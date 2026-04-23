const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const api = {
  get: async (endpoint, options = {}) => {
    if (USE_MOCK) {
      return { useMock: true };
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      ...options
    });
    
    return handleResponse(response);
  },
  
  post: async (endpoint, data, options = {}) => {
    if (USE_MOCK) {
      return { useMock: true, data };
    }
    
    const isFormData = data instanceof FormData;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...getAuthHeaders(),
        ...options.headers
      },
      body: isFormData ? data : JSON.stringify(data),
      ...options
    });
    
    return handleResponse(response);
  },
  
  put: async (endpoint, data, options = {}) => {
    if (USE_MOCK) {
      return { useMock: true, data };
    }

    const isFormData = data instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...getAuthHeaders(),
        ...options.headers
      },
      body: isFormData ? data : JSON.stringify(data),
      ...options
    });
    
    return handleResponse(response);
  },
  
  patch: async (endpoint, data, options = {}) => {
    if (USE_MOCK) {
      return { useMock: true, data };
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    
    return handleResponse(response);
  },
  
  delete: async (endpoint, options = {}) => {
    if (USE_MOCK) {
      return { useMock: true };
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      ...options
    });
    
    return handleResponse(response);
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('lisanga_access_token');
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  
  return {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
    throw new Error(error.message || 'Une erreur est survenue');
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

export const isMockMode = () => USE_MOCK;
