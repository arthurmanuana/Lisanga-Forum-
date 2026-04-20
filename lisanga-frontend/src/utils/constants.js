export const CATEGORIES = [
  { id: 'all', label: 'Tous', value: '' },
  { id: 'technologie', label: 'Technologie', value: 'Technologie' },
  { id: 'business', label: 'Business', value: 'Business' },
  { id: 'design', label: 'Design', value: 'Design' },
  { id: 'communaute', label: 'Communauté', value: 'Communauté' },
  { id: 'formation', label: 'Formation', value: 'Formation' },
  { id: 'evenement', label: 'Événement', value: 'Événement' },
  { id: 'culture', label: 'Culture', value: 'Culture' },
  { id: 'societe', label: 'Société', value: 'Société' }
];

export const SORT_OPTIONS = [
  { id: 'recent', label: 'Plus récents', value: 'recent' },
  { id: 'popular', label: 'Plus populaires', value: 'popular' },
  { id: 'commented', label: 'Plus commentés', value: 'commented' }
];

export const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères alphanumériques'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Veuillez entrer une adresse email valide'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
  },
  articleTitle: {
    minLength: 10,
    maxLength: 200,
    message: 'Le titre doit contenir entre 10 et 200 caractères'
  },
  articleContent: {
    minLength: 100,
    maxLength: 10000,
    message: 'Le contenu doit contenir entre 100 et 10000 caractères'
  },
  comment: {
    minLength: 1,
    maxLength: 1000,
    message: 'Le commentaire doit contenir entre 1 et 1000 caractères'
  },
  contactMessage: {
    minLength: 10,
    maxLength: 1000,
    message: 'Le message doit contenir entre 10 et 1000 caractères'
  }
};

export const IMAGE_UPLOAD = {
  maxSize: 5 * 1024 * 1024,
  acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
};

export const PAGINATION = {
  articlesPerPage: 9,
  adminArticlesPerPage: 20,
  adminCommentsPerPage: 50,
  adminUsersPerPage: 20
};

export const TOKEN_EXPIRY = {
  accessToken: 15 * 60 * 1000,
  refreshToken: 7 * 24 * 60 * 60 * 1000
};

export const LOCAL_STORAGE_KEYS = {
  accessToken: 'lisanga_access_token',
  theme: 'lisanga_theme'
};

export const SESSION_STORAGE_KEYS = {
  redirectUrl: 'redirect_url'
};

export const API_DELAY = 800;
