import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import LikeDislike from '../components/like/LikeDislike';
import { articleService } from '../services/articleService';
import { commentService } from '../services/commentService';
import { formatDateLong } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import './ArticleDetail.css';

const countCommentsTree = (items = []) =>
  items.reduce((total, item) => total + 1 + countCommentsTree(item.replies || []), 0);

const removeCommentFromTree = (items = [], commentId) => {
  let removedCount = 0;

  const updatedItems = items.reduce((acc, item) => {
    if (item.id === commentId) {
      removedCount += 1 + countCommentsTree(item.replies || []);
      return acc;
    }

    const { updatedItems: updatedReplies, removedCount: removedInReplies } = removeCommentFromTree(
      item.replies || [],
      commentId
    );

    removedCount += removedInReplies;
    acc.push({
      ...item,
      replies: updatedReplies,
    });
    return acc;
  }, []);

  return { updatedItems, removedCount };
};

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  
  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await articleService.getArticleById(id);
        setArticle(response.article);
        setCommentsCount(response.article?.commentsCount || 0);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement de l\'article');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadArticle();
    }
  }, [id]);
  
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;
      
      try {
        setLoadingComments(true);
        const response = await commentService.getCommentsByArticle(id);
        setComments(response.comments);
        setCommentsCount(countCommentsTree(response.comments));
      } catch (err) {
        console.error('Erreur lors du chargement des commentaires:', err);
      } finally {
        setLoadingComments(false);
      }
    };
    
    loadComments();
  }, [id]);
  
  const handleEdit = () => {
    navigate(`/articles/${id}/edit`);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await articleService.deleteArticle(id);
        navigate('/articles');
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };
  
  const handleAddComment = async (content) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirect_url', `/articles/${id}`);
      navigate('/connexion');
      return;
    }
    
    try {
      setSubmittingComment(true);
      const response = await commentService.addComment(id, content);
      setComments(prev => [...prev, response.comment]);
      setCommentsCount((prev) => prev + 1);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const handleReply = (commentId) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirect_url', `/articles/${id}`);
      navigate('/connexion');
      return;
    }
    setReplyingTo(commentId);
  };
  
  const handleCancelReply = () => {
    setReplyingTo(null);
  };
  
  const handleSubmitReply = async (content) => {
    try {
      setSubmittingComment(true);
      const response = await commentService.addComment(id, content, replyingTo);
      
      setComments(prev => prev.map(comment => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.comment]
          };
        }
        return comment;
      }));
      setCommentsCount((prev) => prev + 1);
      
      setReplyingTo(null);
    } catch (err) {
      console.error('Erreur lors de la réponse au commentaire:', err);
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        await commentService.deleteComment(commentId);
        setComments((prev) => {
          const { updatedItems, removedCount } = removeCommentFromTree(prev, commentId);
          if (removedCount > 0) {
            setCommentsCount((current) => Math.max(0, current - removedCount));
          }
          return updatedItems;
        });
      } catch (err) {
        console.error('Erreur lors de la suppression du commentaire:', err);
      }
    }
  };
  
  const canModify = isAuthenticated && user && article && (user.id === article.author?.id || user.role === 'admin');
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="article-detail__loading">
          <Loader size="lg" />
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !article) {
    return (
      <>
        <Navbar />
        <div className="article-detail__container">
          <ErrorMessage message={error || 'Article non trouvé'} />
          <div className="article-detail__actions">
            <Link to="/articles">
              <Button variant="outline">Retour aux articles</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      
      <article className="article-detail">
        <div className="container">
          <div className="article-detail__back">
            <Link to="/articles" className="article-detail__back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Retour aux articles
            </Link>
          </div>
          
          {article.imageUrl && (
            <div className="article-detail__hero">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="article-detail__hero-image"
              />
            </div>
          )}
          
          <div className="article-detail__content">
            <header className="article-detail__header">
              {article.category && (
                <span className="article-detail__category">{article.category}</span>
              )}
              <h1 className="article-detail__title">{article.title}</h1>
              
              <div className="article-detail__meta">
                <div className="article-detail__author">
                  {article.author?.avatarUrl ? (
                    <img 
                      src={article.author.avatarUrl} 
                      alt={article.author.username}
                      className="article-detail__avatar"
                    />
                  ) : (
                    <div className="article-detail__avatar article-detail__avatar--initials">
                      {article.author?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="article-detail__author-info">
                    <span className="article-detail__author-name">
                      {article.author?.username || 'Auteur inconnu'}
                    </span>
                    <time className="article-detail__date" dateTime={article.createdAt}>
                      {formatDateLong(article.createdAt)}
                    </time>
                  </div>
                </div>
                
                {canModify && (
                  <div className="article-detail__actions">
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDelete}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Supprimer
                    </Button>
                  </div>
                )}
              </div>
            </header>
            
            <div className="article-detail__body">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <footer className="article-detail__footer">
              <LikeDislike
                articleId={article.id}
                initialLikes={article.likesCount}
                initialDislikes={article.dislikesCount}
              />
              <div className="article-detail__stat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {commentsCount} commentaires
              </div>
            </footer>
            
            <section className="article-detail__comments">
              <h2 className="article-detail__comments-title">Commentaires</h2>
              
              <CommentForm
                onSubmit={handleAddComment}
                isLoading={submittingComment}
                placeholder="Écrivez un commentaire..."
              />
              
              {loadingComments ? (
                <div className="article-detail__comments-loading">
                  <Loader size="md" />
                </div>
              ) : (
                <>
                  <CommentList
                    comments={comments}
                    onReply={handleReply}
                    onDelete={handleDeleteComment}
                    currentUserId={user?.id}
                  />
                  
                  {replyingTo && (
                    <div className="article-detail__reply-form">
                      <CommentForm
                        onSubmit={handleSubmitReply}
                        isLoading={submittingComment}
                        isReply={true}
                        onCancel={handleCancelReply}
                        placeholder="Écrivez votre réponse..."
                      />
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </article>
      
      <Footer />
    </>
  );
}

export default ArticleDetail;