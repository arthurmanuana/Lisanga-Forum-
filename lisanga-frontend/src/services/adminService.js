import { api, isMockMode } from './api';
import { delay, mockUsers, mockArticles, mockComments } from './mockData';
import { CATEGORIES } from '../utils/constants';

// Mock categories storage (simule une base de données)
let mockCategories = CATEGORIES
  .filter(category => category.value)
  .map((category, index) => ({
    id: index + 1,
    name: category.value,
    slug: category.id,
    description: `Categorie admin: ${category.label}`
  }));

export const adminService = {
  // ===== STATISTIQUES =====
  getStats: async () => {
    if (isMockMode()) {
      await delay();
      
      return {
        stats: {
          totalUsers: mockUsers.length,
          totalArticles: mockArticles.length,
          totalComments: mockComments.length,
          totalLikes: mockArticles.reduce((sum, a) => sum + (a.likesCount || 0), 0),
          activeUsers: mockUsers.filter(u => u.isActive).length,
          recentArticles: mockArticles.slice(0, 5)
        }
      };
    }

    const response = await api.get('/admin/stats');
    const raw = response?.stats || {};
    return {
      stats: {
        totalUsers: raw.users ?? 0,
        totalArticles: raw.articles ?? 0,
        totalComments: raw.comments ?? 0,
        totalLikes: raw.reactions ?? 0,
      },
    };
  },

  // ===== ARTICLES =====
  getAllArticles: async ({ page = 1, limit = 20 } = {}) => {
    if (isMockMode()) {
      await delay();
      
      const startIndex = (page - 1) * limit;
      const paginatedArticles = mockArticles.slice(startIndex, startIndex + limit);
      
      return {
        articles: paginatedArticles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(mockArticles.length / limit),
          totalArticles: mockArticles.length
        }
      };
    }
    
    const response = await api.get(`/articles/with-author?page=${page}&limit=${limit}`);
    const rows = response?.data || [];

    const articles = rows.map((a) => ({
      id: a.id_article,
      title: a.titre,
      category: a.nom_categorie,
      createdAt: a.date_publication || a.created_at,
      author: {
        id: a.id_utilisateur,
        username: a.nom_utilisateur || [a.prenom, a.nom].filter(Boolean).join(' ').trim(),
      },
    }));

    const rawPagination = response?.pagination || {};
    return {
      articles,
      pagination: {
        currentPage: rawPagination.page ?? page,
        totalPages: rawPagination.totalPages ?? 1,
        totalArticles: rawPagination.total ?? articles.length,
      },
    };
  },

  deleteArticle: async (articleId) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Article supprimé avec succès' };
    }
    
    return api.delete(`/articles/${articleId}`);
  },

  // ===== UTILISATEURS =====
  getAllUsers: async ({ page = 1, limit = 20 } = {}) => {
    if (isMockMode()) {
      await delay();
      
      const startIndex = (page - 1) * limit;
      const paginatedUsers = mockUsers.slice(startIndex, startIndex + limit);
      
      return {
        users: paginatedUsers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(mockUsers.length / limit),
          totalUsers: mockUsers.length
        }
      };
    }
    
    return api.get(`/admin/users?page=${page}&limit=${limit}`);
  },

  banUser: async (userId) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Utilisateur banni avec succès' };
    }
    
    throw new Error("Le bannissement n'est pas encore disponible sur l'API");
  },

  unbanUser: async (userId) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Utilisateur débanni avec succès' };
    }
    
    throw new Error("Le débannissement n'est pas encore disponible sur l'API");
  },

  // ===== CATÉGORIES =====
  getAllCategories: async () => {
    if (isMockMode()) {
      await delay();
      return { categories: mockCategories };
    }
    
    const response = await api.get('/categories');
    const rows = response?.data || [];
    return {
      categories: rows.map((c) => ({
        id: c.id_categorie,
        name: c.nom,
        slug: c.nom?.toLowerCase()?.replace(/\s+/g, '-') || '',
        description: c.description || '',
      })),
    };
  },

  addCategory: async (data) => {
    if (isMockMode()) {
      await delay();

      const categoryName = data.name?.trim();
      if (!categoryName) {
        throw new Error('Le nom de categorie est requis');
      }
      if (mockCategories.some(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
        throw new Error('Cette categorie existe deja');
      }
      
      const newCategory = {
        id: Math.max(...mockCategories.map(c => c.id), 0) + 1,
        name: categoryName,
        slug: data.slug || categoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
        description: data.description || ''
      };
      
      mockCategories.push(newCategory);
      return { category: newCategory, message: 'Catégorie ajoutée avec succès' };
    }
    
    const response = await api.post('/categories', {
      nom: data.name,
      description: data.description || null,
    });
    const c = response?.data;
    return {
      category: {
        id: c.id_categorie,
        name: c.nom,
        slug: c.nom?.toLowerCase()?.replace(/\s+/g, '-') || '',
        description: c.description || '',
      },
      message: response?.message || 'Catégorie ajoutée avec succès',
    };
  },

  updateCategory: async (categoryId, data) => {
    if (isMockMode()) {
      await delay();
      
      const index = mockCategories.findIndex(c => c.id === categoryId);
      if (index !== -1) {
        mockCategories[index] = { ...mockCategories[index], ...data };
        return { category: mockCategories[index], message: 'Catégorie mise à jour' };
      }
      throw new Error('Catégorie non trouvée');
    }
    
    const response = await api.put(`/categories/${categoryId}`, {
      nom: data.name,
      description: data.description || null,
    });
    const c = response?.data;
    return {
      category: {
        id: c.id_categorie,
        name: c.nom,
        slug: c.nom?.toLowerCase()?.replace(/\s+/g, '-') || '',
        description: c.description || '',
      },
      message: response?.message || 'Catégorie mise à jour',
    };
  },

  deleteCategory: async (categoryId) => {
    if (isMockMode()) {
      await delay();
      
      mockCategories = mockCategories.filter(c => c.id !== categoryId);
      return { message: 'Catégorie supprimée avec succès' };
    }
    
    return api.delete(`/categories/${categoryId}`);
  }
};
