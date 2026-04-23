import { api, isMockMode } from './api';
import { delay } from './mockData';

export const categorieService = {
  getCategories: async () => {
    if (isMockMode()) {
      await delay();
      return [];
    }

    const response = await api.get('/categories');
    return response?.data || [];
  },
};
