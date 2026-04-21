import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validators';
import { SESSION_STORAGE_KEYS } from '../utils/constants';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import Loader from '../components/common/Loader';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  
  const from = location.state?.from?.pathname || '/';

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
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
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
      await login(formData.email, formData.password);
      
      // Redirect to the page they were trying to access, or home
      const redirectUrl = sessionStorage.getItem(SESSION_STORAGE_KEYS.redirectUrl);
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.redirectUrl);
      navigate(redirectUrl || from, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <Loader size="lg" label="Connexion en cours..." />
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Bon retour !</h1>
          <p className="login-subtitle">Connectez-vous à votre compte Lisanga</p>
        </div>

        {apiError && (
          <ErrorMessage 
            message={apiError} 
            className="login-error"
          />
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
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
            placeholder="Votre mot de passe"
            error={errors.password}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />

          <div className="login-options">
            <a href="/mot-de-passe-oublie" className="login-forgot">
              Mot de passe oublié ?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            full
            size="lg"
            disabled={isLoading}
          >
            Se connecter
          </Button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            Pas encore de compte ?{' '}
            <a href="/inscription" className="login-footer-link">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
