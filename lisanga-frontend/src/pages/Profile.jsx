import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { userService } from '../services/userService';
import { formatDate } from '../utils/formatters';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <section className="profile">
        <div className="container">
          <div className="profile__header">
            <div className="profile__avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} />
              ) : (
                <div className="profile__avatar-initials">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile__info">
              <h1 className="profile__name">{user.username}</h1>
              <p className="profile__email">{user.email}</p>
              <span className="profile__role">{user.role}</span>
            </div>
          </div>

          <div className="profile__tabs">
            <button
              className={`profile__tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Informations
            </button>
            <button
              className={`profile__tab ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('articles')}
            >
              Mes Articles
            </button>
            <button
              className={`profile__tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Mes Commentaires
            </button>
          </div>

          <div className="profile__content">
            {activeTab === 'info' && <ProfileInfo user={user} />}
            {activeTab === 'articles' && <ProfileArticles userId={user.id} />}
            {activeTab === 'comments' && <ProfileComments userId={user.id} />}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function ProfileInfo({ user }) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      await userService.updateProfile(formData);
      setMessage('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (err) {
      setMessage('Erreur lors de la mise à jour');
      console.error('Erreur:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-info">
      {message && (
        <div className={`profile-message ${message.includes('succès') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      {isEditing ? (
        <form className="profile-info__form" onSubmit={handleSubmit}>
          <Input
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="URL de l'avatar"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
          <div className="profile-info__actions">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? <Loader size="sm" /> : 'Enregistrer'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="profile-info__display">
          <div className="profile-info__field">
            <span className="profile-info__label">Nom d'utilisateur</span>
            <span className="profile-info__value">{formData.username}</span>
          </div>
          <div className="profile-info__field">
            <span className="profile-info__label">Email</span>
            <span className="profile-info__value">{formData.email}</span>
          </div>
          <div className="profile-info__field">
            <span className="profile-info__label">Rôle</span>
            <span className="profile-info__value">{user.role}</span>
          </div>
          <div className="profile-info__field">
            <span className="profile-info__label">Membre depuis</span>
            <span className="profile-info__value">{formatDate(user.createdAt)}</span>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Modifier le profil
          </Button>
        </div>
      )}
    </div>
  );
}

function ProfileArticles({ userId }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await userService.getUserArticles(userId);
        setArticles(response.articles);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, [userId]);

  if (loading) return <Loader />;

  if (articles.length === 0) {
    return (
      <div className="profile-empty">
        <p>Vous n'avez pas encore publié d'articles.</p>
        <Button variant="primary" onClick={() => window.location.href = '/creer-article'}>
          Créer un article
        </Button>
      </div>
    );
  }

  const handleDeleteArticle = async (articleId) => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?');
    if (!confirmed) return;

    try {
      setDeletingId(articleId);
      await articleService.deleteArticle(articleId);
      setArticles((prev) => prev.filter((article) => article.id !== articleId));
    } catch (err) {
      console.error('Erreur suppression article:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="profile-articles">
      {articles.map(article => (
        <div key={article.id} className="profile-article-card">
          <h3>
            <a href={`/articles/${article.id}`}>{article.title}</a>
          </h3>
          <div className="profile-article-meta">
            <span>{article.category}</span>
            <span>{formatDate(article.createdAt)}</span>
            <span>{article.likesCount} likes</span>
            <span>{article.commentsCount} commentaires</span>
          </div>
          <div className="profile-article-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = `/articles/${article.id}/edit`}
            >
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={deletingId === article.id}
              onClick={() => handleDeleteArticle(article.id)}
            >
              {deletingId === article.id ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileComments({ userId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await userService.getUserComments(userId);
        setComments(response.comments);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [userId]);

  if (loading) return <Loader />;

  if (comments.length === 0) {
    return (
      <div className="profile-empty">
        <p>Vous n'avez pas encore de commentaires.</p>
      </div>
    );
  }

  return (
    <div className="profile-comments">
      {comments.map(comment => (
        <div key={comment.id} className="profile-comment-card">
          <p className="profile-comment-content">{comment.content}</p>
          <div className="profile-comment-meta">
            <a href={`/articles/${comment.articleId}`}>
              Voir l'article
            </a>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Profile;