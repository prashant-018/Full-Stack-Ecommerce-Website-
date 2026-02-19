import axios from 'axios';
import { API_BASE_URL, getApiDebugInfo } from '../config/api.config';

// Log API configuration on module load
console.log('📡 API Service Initialized');
console.log('🔗 Base URL:', API_BASE_URL);
if (import.meta.env.PROD) {
  console.log('🌍 Production Mode');
  const debugInfo = getApiDebugInfo();
  console.log('📊 Debug Info:', debugInfo);
}

// Create axios instance with production-ready configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for production
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable credentials for cookies/auth
  withCredentials: false, // Set to true if using cookies
});

// Request interceptor - Add auth token and logging
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        params: config.params,
        hasAuth: !!token
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Enhanced error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging and handling
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A'
    };

    // Network errors (CORS, connection refused, etc.)
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('❌ NETWORK ERROR - Cannot connect to backend');
      console.error('📋 Error Details:', errorDetails);
      console.error('🔍 Troubleshooting:');
      console.error('   1. Check if VITE_API_URL is set correctly in Vercel');
      console.error('   2. Verify backend is running and accessible');
      console.error('   3. Check CORS configuration on backend');
      console.error('   4. Verify network connectivity');
      console.error('   5. Check browser console for CORS errors');
      
      // Provide user-friendly error
      error.userMessage = 'Cannot connect to server. Please check your internet connection.';
      error.errorType = 'NETWORK_ERROR';
    }
    // HTTP errors (4xx, 5xx)
    else if (error.response) {
      console.error(`❌ HTTP ERROR ${error.response.status}: ${error.response.statusText}`);
      console.error('📋 Error Details:', errorDetails);
      console.error('📄 Response Data:', error.response.data);

      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - clear auth and redirect
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        error.userMessage = 'Session expired. Please login again.';
        error.errorType = 'AUTH_ERROR';
      } else if (error.response.status === 403) {
        error.userMessage = 'Access denied. You do not have permission.';
        error.errorType = 'PERMISSION_ERROR';
      } else if (error.response.status === 404) {
        error.userMessage = 'Resource not found.';
        error.errorType = 'NOT_FOUND';
      } else if (error.response.status >= 500) {
        error.userMessage = 'Server error. Please try again later.';
        error.errorType = 'SERVER_ERROR';
      } else {
        error.userMessage = error.response.data?.message || 'An error occurred.';
        error.errorType = 'HTTP_ERROR';
      }
    }
    // Request configuration errors
    else if (error.request) {
      console.error('❌ REQUEST ERROR - No response received');
      console.error('📋 Error Details:', errorDetails);
      error.userMessage = 'No response from server. Please try again.';
      error.errorType = 'REQUEST_ERROR';
    }
    // Other errors
    else {
      console.error('❌ UNKNOWN ERROR');
      console.error('📋 Error Details:', errorDetails);
      error.userMessage = 'An unexpected error occurred.';
      error.errorType = 'UNKNOWN_ERROR';
    }

    return Promise.reject(error);
  }
);

/**
 * Fetch products by section (men/women)
 * @param {string} section - Product section ('men' or 'women')
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with products data
 */
export const fetchProductsBySection = async (section, params = {}) => {
  try {
    console.log(`🛍️ Fetching ${section} products...`);
    
    const queryParams = new URLSearchParams({
      section: section.toLowerCase(),
    });

    // Add other params, ensuring numbers are converted to strings
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, String(params[key]));
      }
    });

    const url = `/products?${queryParams}`;
    console.log(`📡 Request URL: ${API_BASE_URL}${url}`);
    
    const response = await api.get(url);
    
    console.log(`✅ Successfully fetched ${section} products`);
    console.log(`📦 Products count:`, response.data?.data?.products?.length || response.data?.products?.length || 0);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching ${section}'s products:`, error);
    // Re-throw with enhanced error info
    throw {
      ...error,
      section,
      operation: 'fetchProductsBySection'
    };
  }
};

/**
 * Fetch single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise} API response with product data
 */
export const fetchProductById = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Fetch men's fashion products
 */
export const fetchMensProducts = async (params = {}) => {
  return fetchProductsBySection('men', params);
};

/**
 * Fetch women's fashion products
 */
export const fetchWomensProducts = async (params = {}) => {
  return fetchProductsBySection('women', params);
};

/**
 * Search products
 */
export const searchProducts = async (query, params = {}) => {
  try {
    const queryParams = new URLSearchParams({ q: query, ...params });
    const response = await api.get(`/products/search?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Fetch featured products
 */
export const fetchFeaturedProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/products/featured?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

/**
 * Fetch new arrivals
 */
export const fetchNewArrivals = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/products/new-arrivals?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw error;
  }
};

// Cart API functions
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addItemToCart = async (productId, size, color, quantity = 1) => {
  try {
    const response = await api.post('/cart/add', {
      productId,
      size,
      color,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (arg) => {
  try {
    if (typeof arg === 'string') {
      const response = await api.delete(`/cart/remove/${arg}`);
      return response.data;
    }
    const { productId, size, color, itemId } = arg || {};
    if (itemId) {
      try {
        const response = await api.delete(`/cart/remove/${itemId}`);
        return response.data;
      } catch (err) {
        // Fall through to composite key removal
      }
    }
    const response = await api.delete('/cart/remove', {
      params: { productId, size, color }
    });
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Orders API
export const createOrder = async (payload) => {
  try {
    const response = await api.post('/orders', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Admin API
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getAdminOrders = async (params = {}) => {
  try {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    throw error;
  }
};

export const getOrderStats = async () => {
  try {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, updateData) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}/status`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/admin/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Export default api instance
export default api;
