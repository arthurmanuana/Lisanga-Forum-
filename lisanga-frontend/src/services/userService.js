import { api, isMockMode } from './api';
import { delay, mockArticles, mockComments } from './mockData';

const mapUserArticle = (article) => ({
  id: article.id_article ?? article.id,
  title: article.titre ?? article.title ?? '',
  category: article.nom_categorie ?? article.category ?? 'Sans catégorie',
  createdAt: article.date_publication ?? article.created_at ?? article.createdAt ?? null,
  likesCount: article.likes_count ?? article.likesCount ?? 0,
  commentsCount: article.comments_count ?? article.commentsCount ?? 0,
});

const mapUserComment = (comment) => ({
  id: comment.id_commentaire ?? comment.id,
  content: comment.contenu ?? comment.content ?? '',
  articleId: comment.id_article ?? comment.articleId ?? null,
  createdAt: comment.date_commentaire ?? comment.created_at ?? comment.createdAt ?? null,
});

export const userService = {
  getUserArticles: async (userId) => {
    if (isMockMode()) {
      await delay();
      const userArticles = mockArticles.filter(a => a.author?.id === userId);
      return { articles: userArticles };
    }
    const response = await api.get(`/articles/user/${userId}`);
    const rows = response?.data || [];
    return { articles: rows.map(mapUserArticle) };
  },

  getUserComments: async (userId) => {
    if (isMockMode()) {
      await delay();
      const userComments = mockComments.filter(c => c.author?.id === userId);
      return { comments: userComments };
    }
    const response = await api.get(`/commentaires/user/${userId}`);
    const rows = response?.data || [];
    return { comments: rows.map(mapUserComment) };
  },

  updateProfile: async (data) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Profil mis à jour', user: data };
    }
    return api.put('/users/me', data);
  }
};