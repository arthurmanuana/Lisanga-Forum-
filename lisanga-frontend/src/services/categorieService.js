import { api, isMockMode } from './api';
import { delay } from './mockData';
import { CATEGORIES } from '../utils/constants';

export const categorieService = {
  getCategories: async () => {
    if (isMockMode()) {
      await delay();
      return CATEGORIES.filter((category) => category.value !== '').map((category) => ({
        id: category.id,
        nom: category.label,
        description: '',
      }));
    }

    const response = await api.get('/categories');
    return response?.data || [];
  },
};
