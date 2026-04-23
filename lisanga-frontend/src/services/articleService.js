import { api, isMockMode } from './api';
import { delay, mockArticles } from './mockData';
import { PAGINATION } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const normalizeImageUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${API_ORIGIN}${normalized}`;
};

const mapBackendArticle = (article) => {
  if (!article) return null;

  const username =
    article.nom_utilisateur ||
    article.author?.username ||
    [article.prenom, article.nom].filter(Boolean).join(' ').trim() ||
    'Auteur inconnu';

  return {
    id: article.id_article ?? article.id,
    title: article.titre ?? article.title ?? '',
    content: article.contenu ?? article.content ?? '',
    excerpt:
      article.excerpt ||
      (article.contenu || article.content
        ? `${(article.contenu || article.content).slice(0, 150)}...`
        : ''),
    imageUrl: normalizeImageUrl(article.photo ?? article.imageUrl),
    category: article.nom_categorie ?? article.category ?? '',
    author: {
      id: article.id_utilisateur ?? article.author?.id ?? null,
      username,
      avatarUrl: normalizeImageUrl(article.photo_utilisateur ?? article.author?.avatarUrl),
      role: article.role_utilisateur ?? article.author?.role ?? 'utilisateur',
    },
    likesCount: article.likes_count ?? article.likesCount ?? 0,
    dislikesCount: article.dislikes_count ?? article.dislikesCount ?? 0,
    commentsCount: article.comments_count ?? article.commentsCount ?? 0,
    createdAt: article.date_publication ?? article.created_at ?? article.createdAt ?? null,
    updatedAt: article.updated_at ?? article.updatedAt ?? null,
  };
};

const mapPagination = (pagination, page, limit, totalArticles = 0) => {
  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(totalArticles / limit));
  const total = pagination?.total ?? totalArticles;
  return {
    currentPage,
    totalPages,
    totalArticles: total,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

const sortArticles = (articles, sort) => {
  const sorted = [...articles];
  if (sort === 'popular') {
    sorted.sort((a, b) => (b.likesCount - b.dislikesCount) - (a.likesCount - a.dislikesCount));
    return sorted;
  }
  if (sort === 'commented') {
    sorted.sort((a, b) => b.commentsCount - a.commentsCount);
    return sorted;
  }
  sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return sorted;
};

const getCategoryIdByName = async (categoryName) => {
  if (!categoryName) return null;
  const response = await api.get('/categories');
  const categories = response?.data || [];
  const match = categories.find(
    (cat) => cat.nom?.toLowerCase() === categoryName.toLowerCase()
  );
  return match?.id_categorie ?? null;
};

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

    let mappedArticles = [];
    let backendPagination = null;

    if (category) {
      const categoryId = await getCategoryIdByName(category);
      if (!categoryId) {
        return {
          articles: [],
          pagination: mapPagination(null, page, limit, 0),
        };
      }
      const response = await api.get(`/articles/category/${categoryId}`);
      const rows = response?.data || [];
      mappedArticles = rows.map(mapBackendArticle);
    } else if (search || sort !== 'recent') {
      const response = await api.get('/articles/with-author?page=1&limit=50');
      const rows = response?.data || [];
      mappedArticles = rows.map(mapBackendArticle);
    } else {
      const response = await api.get(`/articles/with-author?page=${page}&limit=${limit}`);
      const rows = response?.data || [];
      mappedArticles = rows.map(mapBackendArticle);
      backendPagination = response?.pagination || null;
    }

    let filtered = [...mappedArticles];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(q) ||
          article.content.toLowerCase().includes(q)
      );
    }

    filtered = sortArticles(filtered, sort);

    if (backendPagination && !search && !category && sort === 'recent') {
      return {
        articles: filtered,
        pagination: mapPagination(backendPagination, page, limit, filtered.length),
      };
    }

    const startIndex = (page - 1) * limit;
    const paginatedArticles = filtered.slice(startIndex, startIndex + limit);
    return {
      articles: paginatedArticles,
      pagination: mapPagination(null, page, limit, filtered.length),
    };
  },
  
  getCategoryCounts: async () => {
    if (isMockMode()) {
      await delay();

      return mockArticles.reduce((counts, article) => {
        counts[article.category] = (counts[article.category] || 0) + 1;
        counts[''] = (counts[''] || 0) + 1;
        return counts;
      }, {});
    }

    const [categoriesResponse, articlesResponse] = await Promise.all([
      api.get('/categories'),
      api.get('/articles/with-author?page=1&limit=50'),
    ]);

    const categories = categoriesResponse?.data || [];
    const articles = (articlesResponse?.data || []).map(mapBackendArticle);

    const counts = { '': articles.length };
    categories.forEach((cat) => {
      counts[cat.nom] = 0;
    });
    articles.forEach((article) => {
      if (article.category) {
        counts[article.category] = (counts[article.category] || 0) + 1;
      }
    });

    return counts;
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

    const response = await api.get(`/articles/${id}`);
    const raw = response?.data;
    const mapped = mapBackendArticle(raw);
    return { article: mapped };
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

    const payload = new FormData();

    const categoryValue = formData.get('id_categorie') || formData.get('category');
    let categoryId = Number(categoryValue);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      const resolved = await getCategoryIdByName(String(categoryValue || ''));
      categoryId = resolved;
    }

    payload.append('id_categorie', String(categoryId || ''));
    payload.append('titre', formData.get('titre') || formData.get('title') || '');
    payload.append('contenu', formData.get('contenu') || formData.get('content') || '');

    const photoFile = formData.get('photo') || formData.get('image');
    if (photoFile) {
      payload.append('photo', photoFile);
    }

    const response = await api.post('/articles', payload);
    return {
      article: mapBackendArticle(response?.data),
      message: response?.message || 'Article publié avec succès',
    };
  },
  
  updateArticle: async (id, formData) => {
    if (isMockMode()) {
      await delay();
      
      return {
        message: 'Article mis à jour avec succès'
      };
    }

    throw new Error("L'édition d'article n'est pas disponible dans cette version MVP");
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
