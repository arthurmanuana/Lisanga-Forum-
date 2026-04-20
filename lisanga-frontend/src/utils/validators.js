import { VALIDATION_RULES, IMAGE_UPLOAD } from './constants';

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'L\'email est requis' };
  }
  
  if (!VALIDATION_RULES.email.pattern.test(email)) {
    return { isValid: false, error: VALIDATION_RULES.email.message };
  }
  
  return { isValid: true, error: null };
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Le mot de passe est requis' };
  }
  
  if (password.length < VALIDATION_RULES.password.minLength) {
    return { isValid: false, error: `Le mot de passe doit contenir au moins ${VALIDATION_RULES.password.minLength} caractères` };
  }
  
  if (!VALIDATION_RULES.password.pattern.test(password)) {
    return { isValid: false, error: VALIDATION_RULES.password.message };
  }
  
  return { isValid: true, error: null };
};

export const validateUsername = (username) => {
  if (!username || !username.trim()) {
    return { isValid: false, error: 'Le nom d\'utilisateur est requis' };
  }
  
  if (username.length < VALIDATION_RULES.username.minLength || username.length > VALIDATION_RULES.username.maxLength) {
    return { isValid: false, error: `Le nom d'utilisateur doit contenir entre ${VALIDATION_RULES.username.minLength} et ${VALIDATION_RULES.username.maxLength} caractères` };
  }
  
  if (!VALIDATION_RULES.username.pattern.test(username)) {
    return { isValid: false, error: VALIDATION_RULES.username.message };
  }
  
  return { isValid: true, error: null };
};

export const validatePasswordConfirm = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Veuillez confirmer votre mot de passe' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Les mots de passe ne correspondent pas' };
  }
  
  return { isValid: true, error: null };
};

export const validateArticleTitle = (title) => {
  if (!title || !title.trim()) {
    return { isValid: false, error: 'Le titre est requis' };
  }
  
  const length = title.trim().length;
  
  if (length < VALIDATION_RULES.articleTitle.minLength || length > VALIDATION_RULES.articleTitle.maxLength) {
    return { isValid: false, error: VALIDATION_RULES.articleTitle.message };
  }
  
  return { isValid: true, error: null };
};

export const validateArticleContent = (content) => {
  if (!content || !content.trim()) {
    return { isValid: false, error: 'Le contenu est requis' };
  }
  
  const length = content.trim().length;
  
  if (length < VALIDATION_RULES.articleContent.minLength || length > VALIDATION_RULES.articleContent.maxLength) {
    return { isValid: false, error: VALIDATION_RULES.articleContent.message };
  }
  
  return { isValid: true, error: null };
};

export const validateCategory = (category) => {
  if (!category || !category.trim()) {
    return { isValid: false, error: 'La catégorie est requise' };
  }
  
  return { isValid: true, error: null };
};

export const validateComment = (content) => {
  if (!content || !content.trim()) {
    return { isValid: false, error: 'Le commentaire ne peut pas être vide' };
  }
  
  const length = content.trim().length;
  
  if (length < VALIDATION_RULES.comment.minLength || length > VALIDATION_RULES.comment.maxLength) {
    return { isValid: false, error: VALIDATION_RULES.comment.message };
  }
  
  return { isValid: true, error: null };
};

export const validateImage = (file) => {
  if (!file) {
    return { isValid: false, error: 'Veuillez sélectionner une image' };
  }
  
  if (!IMAGE_UPLOAD.acceptedFormats.includes(file.type)) {
    return { isValid: false, error: 'Format non supporté. Utilisez JPG, PNG ou WebP' };
  }
  
  if (file.size > IMAGE_UPLOAD.maxSize) {
    return { isValid: false, error: 'L\'image ne doit pas dépasser 5 Mo' };
  }
  
  return { isValid: true, error: null };
};

export const validateContactMessage = (message) => {
  if (!message || !message.trim()) {
    return { isValid: false, error: 'Le message est requis' };
  }
  
  const length = message.trim().length;
  
  if (length < VALIDATION_RULES.contactMessage.minLength || length > VALIDATION_RULES.contactMessage.maxLength) {
    return { isValid: false, error: VALIDATION_RULES.contactMessage.message };
  }
  
  return { isValid: true, error: null };
};
