import { api, isMockMode } from './api';
import { delay, mockArticles, mockComments } from './mockData';

export const userService = {
  getUserArticles: async (userId) => {
    if (isMockMode()) {
      await delay();
      const userArticles = mockArticles.filter(a => a.author?.id === userId);
      return { articles: userArticles };
    }
    return api.get(`/users/${userId}/articles`);
  },

  getUserComments: async (userId) => {
    if (isMockMode()) {
      await delay();
      const userComments = mockComments.filter(c => c.author?.id === userId);
      return { comments: userComments };
    }
    return api.get(`/users/${userId}/comments`);
  },

  updateProfile: async (data) => {
    if (isMockMode()) {
      await delay();
      return { message: 'Profil mis à jour', user: data };
    }
    return api.put('/users/profile', data);
  }
};