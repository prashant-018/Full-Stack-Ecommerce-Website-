// API utility functions with JWT token handling
import API_URL from '../config/api';

// API_URL already contains /api, so use it directly
const API_BASE_URL = API_URL;

// Debug logging
console.log('🔧 Utils API - API_BASE_URL:', API_BASE_URL);
console.log('✅ Using API_URL directly (already contains /api)');

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Create headers with authentication
const createAuthHeaders = (additionalHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Handle API response and check for authentication errors
const handleApiResponse = async (response, navigate = null) => {
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');

    if (navigate) {
      navigate('/login');
    }
    throw new Error('Authentication failed. Please login again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}, navigate = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createAuthHeaders(options.headers),
    ...options
  };

  try {
    const response = await fetch(url, config);
    return await handleApiResponse(response, navigate);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Specific API functions for admin operations

// Products API
export const productsApi = {
  // Get all products
  getAll: (navigate = null) => {
    return apiRequest('/products', { method: 'GET' }, navigate);
  },

  // Get single product
  getById: (id, navigate = null) => {
    return apiRequest(`/products/${id}`, { method: 'GET' }, navigate);
  },

  // Create new product (Admin only)
  create: (productData, navigate = null) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }, navigate);
  },

  // Update product (Admin only)
  update: (id, productData, navigate = null) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }, navigate);
  },

  // Delete product (Admin only)
  delete: (id, navigate = null) => {
    return apiRequest(`/products/${id}`, { method: 'DELETE' }, navigate);
  }
};

// Auth API
export const authApi = {
  // Login
  login: (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Register
  register: (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Check if user is admin
export const isAdmin = () => {
  return localStorage.getItem('userRole') === 'admin';
};

// Get current user data
export const getCurrentUser = () => {
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'admin') {
    return JSON.parse(localStorage.getItem('adminUser') || '{}');
  } else {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
};

// Users API (Admin only)
export const usersApi = {
  // Get all users
  getAll: (navigate = null) => {
    return apiRequest('/users', { method: 'GET' }, navigate);
  },

  // Get user statistics
  getStats: (navigate = null) => {
    return apiRequest('/users/stats', { method: 'GET' }, navigate);
  },

  // Update user status (activate/deactivate)
  updateStatus: (userId, isActive, navigate = null) => {
    return apiRequest(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive })
    }, navigate);
  }
};

export default {
  apiRequest,
  productsApi,
  authApi,
  usersApi,
  isAuthenticated,
  isAdmin,
  getCurrentUser
};