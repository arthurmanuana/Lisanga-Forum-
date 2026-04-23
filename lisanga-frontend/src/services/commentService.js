import { api, isMockMode } from './api';
import { delay, mockComments } from './mockData';

const mapBackendComment = (comment) => {
  if (!comment) return null;

  const username =
    comment.nom_utilisateur ||
    [comment.prenom, comment.nom].filter(Boolean).join(' ').trim() ||
    'Utilisateur';

  return {
    id: comment.id_commentaire ?? comment.id,
    content: comment.contenu ?? comment.content ?? '',
    articleId: comment.id_article ?? comment.articleId,
    parentId: comment.id_parent_commentaire ?? comment.parentId ?? null,
    createdAt: comment.date_commentaire ?? comment.created_at ?? comment.createdAt,
    author: {
      id: comment.id_utilisateur ?? comment.author?.id ?? null,
      username: comment.author?.username || username,
      avatarUrl: comment.photo_utilisateur ?? comment.author?.avatarUrl ?? null,
      role: comment.role_utilisateur ?? comment.author?.role ?? 'utilisateur',
    },
    replies: [],
  };
};

export const commentService = {
  getCommentsByArticle: async (articleId) => {
    if (isMockMode()) {
      await delay();
      
      const articleComments = mockComments.filter(c => c.articleId === articleId);
      
      return { comments: articleComments };
    }

    const response = await api.get(`/commentaires/article/${articleId}`);
    const topLevelComments = response?.data || [];

    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (commentRow) => {
        const mapped = mapBackendComment(commentRow);
        const repliesResponse = await api.get(`/commentaires/${mapped.id}/replies`);
        mapped.replies = (repliesResponse?.data || []).map(mapBackendComment);
        return mapped;
      })
    );

    return { comments: commentsWithReplies };
  },
  
  addComment: async (articleId, content, parentId = null) => {
    if (isMockMode()) {
      await delay(800);
      
      const newComment = {
        id: `c${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        author: {
          id: '1',
          username: 'current_user',
          avatarUrl: null
        },
        articleId,
        parentId,
        replies: [],
        createdAt: new Date().toISOString()
      };
      
      return { comment: newComment, message: 'Commentaire ajouté avec succès' };
    }

    const response = await api.post('/commentaires', {
      id_article: Number(articleId),
      contenu: content,
      id_parent_commentaire: parentId ? Number(parentId) : null,
    });

    return {
      comment: mapBackendComment(response?.data),
      message: response?.message || 'Commentaire ajouté avec succès',
    };
  },
  
  deleteComment: async (commentId) => {
    if (isMockMode()) {
      await delay();
      
      return { message: 'Commentaire supprimé avec succès' };
    }

    return api.delete(`/commentaires/${commentId}`);
  }
};