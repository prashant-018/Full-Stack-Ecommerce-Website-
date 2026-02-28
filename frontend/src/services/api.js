import axios from 'axios';
import API_URL from '../config/api';

// CRITICAL: Verify API_URL is not localhost in production
if (import.meta.env.PROD && (API_URL.includes('localhost') || API_URL.includes('127.0.0.1'))) {
  console.error('❌ CRITICAL ERROR: API_URL contains localhost in production!');
  console.error('Current API_URL:', API_URL);
  throw new Error('API_URL cannot be localhost in production. Set VITE_API_URL in Vercel.');
}

// Create axios instance with production configuration
// API_URL already contains /api, so use it directly
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug logging
console.log('🔧 API Service - baseURL:', api.defaults.baseURL);
console.log('🔧 API Service - Full URL example:', `${api.defaults.baseURL}/products`);
console.log('✅ Using API_URL directly (already contains /api)');

// Verify baseURL is correct
if (api.defaults.baseURL.includes('localhost') && window.location.hostname !== 'localhost') {
  console.error('❌ ERROR: Axios baseURL is localhost but we are not on localhost!');
  console.error('Hostname:', window.location.hostname);
  console.error('baseURL:', api.defaults.baseURL);
}

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Enhanced error handling with production debugging
api.interceptors.response.use(
  (response) => {
    // Log successful requests in production for debugging
    if (import.meta.env.PROD && import.meta.env.VITE_DEBUG === 'true') {
      console.log('✅ API Success:', {
        url: response.config?.url,
        baseURL: response.config?.baseURL,
        status: response.status
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging for production debugging
    const errorDetails = {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      fullURL: error.config?.url ? `${error.config.baseURL}${error.config.url}` : 'N/A',
        status: error.response?.status,
        message: error.message,
      code: error.code,
      responseData: error.response?.data
    };

    // Always log errors in production
    if (import.meta.env.PROD) {
      console.error('❌ API Error:', errorDetails);
      
      // Show user-friendly error for network issues
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.error('🌐 Network Error - Check if backend is accessible:', error.config?.baseURL);
      }
    } else {
      // Detailed logging in development
      console.error('❌ API Error:', errorDetails);
    }

    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Add user-friendly error message
    if (error.code === 'ERR_NETWORK') {
      error.userMessage = 'Cannot connect to server. Please check your internet connection.';
    } else if (error.response?.status >= 500) {
      error.userMessage = 'Server error. Please try again later.';
    } else if (error.response?.data?.message) {
      error.userMessage = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

// Export API functions
export const fetchProductsBySection = async (section, params = {}) => {
  try {
  const queryParams = new URLSearchParams({
    section: section.toLowerCase(),
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    )
  });
    
    const url = `/products?${queryParams}`;
    const fullUrl = `${api.defaults.baseURL}${url}`;
    
    console.log('🔍 Fetching products:', {
      section,
      url,
      baseURL: api.defaults.baseURL,
      fullURL: fullUrl,
      environment: import.meta.env.MODE,
      queryString: queryParams.toString()
    });
    
    // First, test if backend is reachable
    try {
      const healthCheck = await api.get('/health');
      console.log('✅ Backend health check passed:', healthCheck.data);
    } catch (healthError) {
      console.warn('⚠️  Health check failed, but continuing with product fetch:', healthError.message);
    }
    
    const response = await api.get(url);
    
    console.log('✅ Products fetched successfully:', {
      status: response.status,
      dataKeys: Object.keys(response.data || {}),
      hasData: !!response.data?.data,
      hasProducts: !!response.data?.products,
      productsCount: response.data?.data?.products?.length || response.data?.products?.length || 0,
      responseStructure: {
        success: response.data?.success,
        hasDataObject: !!response.data?.data,
        hasProductsArray: Array.isArray(response.data?.data?.products) || Array.isArray(response.data?.products)
      }
    });
    
  return response.data;
  } catch (error) {
    console.error('❌ fetchProductsBySection error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      status: error.response?.status,
      statusText: error.response?.statusText,
      baseURL: api.defaults.baseURL,
      url: error.config?.url,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
      responseData: error.response?.data,
      responseHeaders: error.response?.headers
    });
    
    // More specific error handling
    if (error.response?.status === 404) {
      console.error('❌ 404 Error - Route not found. Check if backend route exists.');
      console.error('Expected route:', `${api.defaults.baseURL}/products?section=${section}`);
    }
    
    throw error;
  }
};

export const fetchProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const fetchMensProducts = async (params = {}) => {
  return fetchProductsBySection('men', params);
};

export const fetchWomensProducts = async (params = {}) => {
  return fetchProductsBySection('women', params);
};

export const searchProducts = async (query, params = {}) => {
  const queryParams = new URLSearchParams({ q: query, ...params });
  const response = await api.get(`/products/search?${queryParams}`);
  return response.data;
};

export const fetchFeaturedProducts = async (params = {}) => {
  const queryParams = new URLSearchParams(params);
  const response = await api.get(`/products/featured?${queryParams}`);
  return response.data;
};

export const fetchNewArrivals = async (params = {}) => {
  const queryParams = new URLSearchParams(params);
  const response = await api.get(`/products/new-arrivals?${queryParams}`);
  return response.data;
};

// Cart API
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addItemToCart = async (productId, size, color, quantity = 1) => {
  const response = await api.post('/cart/add', {
    productId,
    size,
    color,
    quantity
  });
  return response.data;
};

export const updateCartItemQuantity = async (itemId, quantity) => {
  const response = await api.put(`/cart/update/${itemId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (arg) => {
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
      // Fall through
    }
  }
  const response = await api.delete('/cart/remove', {
    params: { productId, size, color }
  });
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart/clear');
  return response.data;
};

// Orders API
export const createOrder = async (payload) => {
  const response = await api.post('/orders', payload);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get('/orders/my');
  return response.data;
};

// Reviews API
export const fetchProductReviews = async (productId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  const response = await api.get(`/reviews/${productId}?${queryParams.toString()}`);
  return response.data;
};

export const addProductReview = async (payload) => {
  const response = await api.post('/reviews', payload);
  return response.data;
};

export const deleteProductReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

// Admin API
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
};

export const getAdminOrders = async (params = {}) => {
  const response = await api.get('/admin/orders', { params });
  return response.data;
};

export const getOrderStats = async () => {
  const response = await api.get('/admin/orders/stats');
  return response.data;
};

export const updateOrderStatus = async (orderId, updateData) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, updateData);
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await api.delete(`/admin/orders/${orderId}`);
  return response.data;
};

export default api;
