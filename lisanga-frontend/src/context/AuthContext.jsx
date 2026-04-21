import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
      
      if (token) {
        setAccessToken(token);
        
        const response = await authService.getProfile();
        setUser(response.user);
        setIsAuthenticated(true);
        
        const redirectUrl = sessionStorage.getItem(SESSION_STORAGE_KEYS.redirectUrl);
        if (redirectUrl) {
          sessionStorage.removeItem(SESSION_STORAGE_KEYS.redirectUrl);
          window.location.href = redirectUrl;
        }
        
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      
      setUser(response.user);
      setAccessToken(response.accessToken);
      setIsAuthenticated(true);
      
      localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, response.accessToken);
      
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
      throw err;
    }
  };
  
  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await authService.register(username, email, password);
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
      throw err;
    }
  };
  
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
    }
  };
  
  const refreshAccessToken = async () => {
    try {
      const response = await authService.refresh();
      setAccessToken(response.accessToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, response.accessToken);
      return response.accessToken;
    } catch (err) {
      logout();
      throw err;
    }
  };
  
  const value = {
    isAuthenticated,
    user,
    accessToken,
    loading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
    checkAuth
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
