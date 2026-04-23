import { api, isMockMode } from './api';
import { delay, mockUsers } from './mockData';

const mapBackendUser = (user) => {
  if (!user) return null;

  return {
    id: user.id ?? user.id_utilisateurs ?? null,
    username:
      user.username ??
      user.nom_utilisateur ??
      [user.prenom, user.nom].filter(Boolean).join(' ').trim() ??
      '',
    email: user.email ?? '',
    role: user.role ?? 'utilisateur',
    avatarUrl: user.avatarUrl ?? user.photo ?? null,
    createdAt: user.createdAt ?? user.created_at ?? null,
  };
};

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
        user: mapBackendUser(user)
      };
    }
    
    const response = await api.post('/auth/login', { email, mot_de_passe: password });
    return {
      ...response,
      user: mapBackendUser(response?.user),
    };
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
    
    return api.post('/auth/register', {
      nom: username,
      prenom: 'Utilisateur',
      nom_utilisateur: username,
      email,
      mot_de_passe: password
    });
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
      return { user: mapBackendUser(mockUsers[0]) };
    }
    
    const response = await api.get('/users/me');
    return {
      ...response,
      user: mapBackendUser(response?.user),
    };
  }
};
