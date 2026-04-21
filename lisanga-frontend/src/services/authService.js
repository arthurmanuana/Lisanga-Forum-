import { api, isMockMode } from './api';
import { delay, mockUsers } from './mockData';

export const authService = {
  login: async (email, password) => {
    if (isMockMode()) {
      await delay();
      
      const user = mockUsers.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      return {
        accessToken: `mock_access_token_${user.id}_${Date.now()}`,
        refreshToken: `mock_refresh_token_${user.id}`,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt
        }
      };
    }
    
    return api.post('/auth/login', { email, password });
  },
  
  register: async (username, email, password) => {
    if (isMockMode()) {
      await delay();
      
      const existingUser = mockUsers.find(u => u.email === email || u.username === username);
      
      if (existingUser) {
        throw new Error('Cet email ou nom d\'utilisateur est déjà utilisé');
      }
      
      const newUserId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
        userId: newUserId
      };
    }
    
    return api.post('/auth/register', { username, email, password });
  },
  
  logout: async () => {
    if (isMockMode()) {
      await delay(200);
      return { message: 'Déconnexion réussie' };
    }
    
    return api.post('/auth/logout');
  },
  
  refresh: async () => {
    if (isMockMode()) {
      await delay(200);
      
      const mockUser = mockUsers[0];
      
      return {
        accessToken: `mock_access_token_refreshed_${mockUser.id}_${Date.now()}`
      };
    }
    
    return api.post('/auth/refresh');
  },
  
  getProfile: async () => {
    if (isMockMode()) {
      await delay();
      return { user: mockUsers[0] };
    }
    
    return api.get('/auth/profile');
  }
};
