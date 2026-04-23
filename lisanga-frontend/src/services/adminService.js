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
    
    return api.get('/admin/stats');
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
    
    return api.get(`/admin/articles?page=${page}&limit=${limit}`);
  },

  deleteArticle: async (articleId) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Article supprimé avec succès' };
    }
    
    return api.delete(`/admin/articles/${articleId}`);
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
    
    return api.post(`/admin/users/${userId}/ban`);
  },

  unbanUser: async (userId) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Utilisateur débanni avec succès' };
    }
    
    return api.post(`/admin/users/${userId}/unban`);
  },

  // ===== CATÉGORIES =====
  getAllCategories: async () => {
    if (isMockMode()) {
      await delay();
      return { categories: mockCategories };
    }
    
    return api.get('/admin/categories');
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
    
    return api.post('/admin/categories', data);
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
    
    return api.put(`/admin/categories/${categoryId}`, data);
  },

  deleteCategory: async (categoryId) => {
    if (isMockMode()) {
      await delay();
      
      mockCategories = mockCategories.filter(c => c.id !== categoryId);
      return { message: 'Catégorie supprimée avec succès' };
    }
    
    return api.delete(`/admin/categories/${categoryId}`);
  }
};
