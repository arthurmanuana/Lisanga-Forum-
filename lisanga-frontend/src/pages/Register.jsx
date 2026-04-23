import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateUsername, validateEmail, validatePassword, validatePasswordConfirm } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import Loader from '../components/common/Loader';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Clear API error
    if (apiError) {
      setApiError(null);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'username') {
      const validation = validateUsername(value);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, username: validation.error }));
      }
    }
    
    if (name === 'email') {
      const validation = validateEmail(value);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, email: validation.error }));
      }
    }
    
    if (name === 'password') {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, password: validation.error }));
      }
    }
    
    if (name === 'confirmPassword') {
      const validation = validatePasswordConfirm(formData.password, value);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, confirmPassword: validation.error }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error;
    }
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }
    
    const confirmValidation = validatePasswordConfirm(formData.password, formData.confirmPassword);
    if (!confirmValidation.isValid) {
      newErrors.confirmPassword = confirmValidation.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData.username, formData.email, formData.password);
      
      // Redirect to login page with success message
      navigate('/connexion', { 
        state: { 
          message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' 
        } 
      });
    } catch (err) {
      setApiError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="register-page">
        <div className="register-card">
          <Loader size="lg" label="Inscription en cours..." />
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Créer un compte</h1>
          <p className="register-subtitle">Rejoignez la communauté Lisanga</p>
        </div>

        {apiError && (
          <ErrorMessage 
            message={apiError} 
            className="register-error"
          />
        )}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Nom d'utilisateur"
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="votre_nom_utilisateur"
            error={errors.username}
            required
            disabled={isLoading}
            autoComplete="username"
          />

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="vous@exemple.com"
            error={errors.email}
            required
            disabled={isLoading}
            autoComplete="email"
          />

          <Input
            label="Mot de passe"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Minimum 8 caractères"
            error={errors.password}
            required
            disabled={isLoading}
            autoComplete="new-password"
          />

          <Input
            label="Confirmer le mot de passe"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirmez votre mot de passe"
            error={errors.confirmPassword}
            required
            disabled={isLoading}
            autoComplete="new-password"
          />

          <div className="register-terms">
            <p className="register-terms-text">
              En créant un compte, vous acceptez nos{' '}
              <a href="/conditions" className="register-terms-link">Conditions d'utilisation</a>
              {' '}et notre{' '}
              <a href="/confidentialite" className="register-terms-link">Politique de confidentialité</a>.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            full
            size="lg"
            disabled={isLoading}
          >
            Créer mon compte
          </Button>
        </form>

        <div className="register-footer">
          <p className="register-footer-text">
            Déjà un compte ?{' '}
            <a href="/connexion" className="register-footer-link">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
