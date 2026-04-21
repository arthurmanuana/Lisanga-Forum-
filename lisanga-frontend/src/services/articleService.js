import { api, isMockMode } from './api';
import { delay, mockArticles } from './mockData';
import { PAGINATION } from '../utils/constants';

export const articleService = {
  getArticles: async ({ category = '', search = '', sort = 'recent', page = 1, limit = PAGINATION.articlesPerPage } = {}) => {
    if (isMockMode()) {
      await delay();
      
      let filtered = [...mockArticles];
      
      if (category && category !== '') {
        filtered = filtered.filter(article => article.category === category);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(searchLower) || 
          article.content.toLowerCase().includes(searchLower)
        );
      }
      
      if (sort === 'popular') {
        filtered.sort((a, b) => (b.likesCount - b.dislikesCount) - (a.likesCount - a.dislikesCount));
      } else if (sort === 'commented') {
        filtered.sort((a, b) => b.commentsCount - a.commentsCount);
      } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      const totalArticles = filtered.length;
      const totalPages = Math.ceil(totalArticles / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedArticles = filtered.slice(startIndex, endIndex);
      
      return {
        articles: paginatedArticles,
        pagination: {
          currentPage: page,
          totalPages,
          totalArticles,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    }
    
    const params = new URLSearchParams({ category, search, sort, page: page.toString(), limit: limit.toString() });
    return api.get(`/articles?${params.toString()}`);
  },
  
  getArticleById: async (id) => {
    if (isMockMode()) {
      await delay();
      
      const article = mockArticles.find(a => a.id === id);
      
      if (!article) {
        throw new Error('Article non trouvé');
      }
      
      return { article };
    }
    
    return api.get(`/articles/${id}`);
  },
  
  createArticle: async (formData) => {
    if (isMockMode()) {
      await delay(1200);
      
      const newArticle = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: formData.get('title'),
        content: formData.get('content'),
        excerpt: formData.get('content').substring(0, 150) + '...',
        imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
        category: formData.get('category'),
        author: {
          id: '1',
          username: 'current_user',
          avatarUrl: null
        },
        likesCount: 0,
        dislikesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        article: newArticle,
        message: 'Article publié avec succès'
      };
    }
    
    return api.post('/articles', formData);
  },
  
  updateArticle: async (id, formData) => {
    if (isMockMode()) {
      await delay();
      
      return {
        message: 'Article mis à jour avec succès'
      };
    }
    
    return api.put(`/articles/${id}`, formData);
  },
  
  deleteArticle: async (id) => {
    if (isMockMode()) {
      await delay();
      
      return {
        message: 'Article supprimé avec succès'
      };
    }
    
    return api.delete(`/articles/${id}`);
  },
  
  likeArticle: async (id) => {
    if (isMockMode()) {
      await delay(500);
      
      const storageKey = `lisanga_vote_${id}`;
      const previousVote = localStorage.getItem(storageKey);
      
      if (previousVote === 'like') {
        localStorage.removeItem(storageKey);
        return { action: 'removed', vote: null };
      }
      
      localStorage.setItem(storageKey, 'like');
      return { action: 'liked', vote: 'like' };
    }
    
    return api.post(`/articles/${id}/like`);
  },
  
  dislikeArticle: async (id) => {
    if (isMockMode()) {
      await delay(500);
      
      const storageKey = `lisanga_vote_${id}`;
      const previousVote = localStorage.getItem(storageKey);
      
      if (previousVote === 'dislike') {
        localStorage.removeItem(storageKey);
        return { action: 'removed', vote: null };
      }
      
      localStorage.setItem(storageKey, 'dislike');
      return { action: 'disliked', vote: 'dislike' };
    }
    
    return api.post(`/articles/${id}/dislike`);
  },
  
  getUserVote: (articleId) => {
    if (isMockMode()) {
      return localStorage.getItem(`lisanga_vote_${articleId}`);
    }
    return null;
  }
};
