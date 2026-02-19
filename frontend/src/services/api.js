import axios from 'axios';

// Get API base URL from environment variable or use defaults
const getApiBaseURL = () => {
  // In development with Vite proxy, use relative path
  if (import.meta.env.DEV) {
    return '/api';
  }
  
  // In production, use environment variable or fallback
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    // Ensure it ends with /api if not already
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl.replace(/\/$/, '')}/api`;
    console.log('🌐 Using API URL:', baseUrl);
    return baseUrl;
  }
  
  // Fallback (should not be used in production)
  console.error('❌ VITE_API_URL not set in production! Products will not load.');
  console.error('Please set VITE_API_URL environment variable in Vercel settings.');
  // Still return localhost for now, but log the error
  return 'http://localhost:5002/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information for debugging
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('❌ Network Error: Cannot connect to backend API');
      console.error('API Base URL:', api.defaults.baseURL);
      console.error('Make sure VITE_API_URL is set correctly in Vercel environment variables');
    } else if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.statusText);
      console.error('Response:', error.response.data);
    } else {
      console.error('❌ Request Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch men's fashion products with filtering and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of products per page
 * @param {string} params.category - Filter by category
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 * @param {string} params.sizes - Comma-separated sizes
 * @param {string} params.colors - Comma-separated colors
 * @param {boolean} params.isNewArrival - Filter new arrivals
 * @param {boolean} params.isFeatured - Filter featured products
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort direction (asc/desc)
 * @param {string} params.search - Search query
 * @returns {Promise} API response with products data
 */
export const fetchMensProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      section: 'men',
      ...params,
    });

    const response = await api.get(`/products?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching men\'s products:', error);
    throw error;
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
 * Fetch women's fashion products with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with products data
 */
export const fetchWomensProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      section: 'women',
      ...params,
    });

    const response = await api.get(`/products?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching women\'s products:', error);
    throw error;
  }
};

/**
 * Fetch products by section (men/women)
 * @param {string} section - Product section ('men' or 'women')
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with products data
 */
export const fetchProductsBySection = async (section, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      section: section.toLowerCase(),
    });

    // Add other params, ensuring numbers are converted to strings
    Object.keys(params).forEach(key => {
      queryParams.append(key, String(params[key]));
    });

    const response = await api.get(`/products?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${section}'s products:`, error);
    throw error;
  }
};

/**
 * Search products
 * @param {string} query - Search query
 * @param {Object} params - Additional query parameters
 * @returns {Promise} API response with search results
 */
export const searchProducts = async (query, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      q: query,
      ...params,
    });

    const response = await api.get(`/products/search?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Fetch featured products
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with featured products
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
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with new arrivals
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

/**
 * Cart API functions
 */

/**
 * Get user's cart
 * @returns {Promise} API response with cart data
 */
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

/**
 * Add item to cart
 * @param {string} productId - Product ID
 * @param {string} size - Size
 * @param {string} color - Color
 * @param {number} quantity - Quantity (default: 1)
 * @returns {Promise} API response
 */
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

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} API response
 */
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise} API response
 */
export const removeCartItem = async (arg) => {
  try {
    // Backward compatible: remove by cart subdocument itemId
    if (typeof arg === 'string') {
      const response = await api.delete(`/cart/remove/${arg}`);
      return response.data;
    }

    // Preferred: remove by { productId, size, color } (unique key)
    const { productId, size, color, itemId } = arg || {};

    // If itemId is present, try that first (fast path), but fall back to composite key if needed.
    if (itemId) {
      try {
        const response = await api.delete(`/cart/remove/${itemId}`);
        return response.data;
      } catch (err) {
        // If itemId delete fails (404 / mismatch), fall back to composite key removal
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

/**
 * Clear entire cart
 * @returns {Promise} API response
 */
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Orders API
 */

/**
 * Create order from checkout
 * @param {Object} payload
 * @param {Array} payload.items - [{ productId, name, image, price, size, color, quantity }]
 * @param {Object} payload.shippingAddress
 * @param {'COD'|'CARD'} payload.paymentMethod
 * @param {number} payload.subtotal
 * @param {number} payload.shipping
 * @param {number} payload.tax
 * @param {number} payload.total
 */
export const createOrder = async (payload) => {
  try {
    const response = await api.post('/orders', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Admin Dashboard API
 */

/**
 * Get dashboard statistics (admin only)
 * @returns {Promise} API response with dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Admin Orders API
 */

/**
 * Get all orders (admin only)
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with orders data
 */
export const getAdminOrders = async (params = {}) => {
  try {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    throw error;
  }
};

/**
 * Get order statistics (admin only)
 * @returns {Promise} API response with order stats
 */
export const getOrderStats = async () => {
  try {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
};

/**
 * Update order status (admin only)
 * @param {string} orderId - Order ID
 * @param {Object} updateData - Status update data
 * @returns {Promise} API response
 */
export const updateOrderStatus = async (orderId, updateData) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}/status`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Delete order (admin only)
 * @param {string} orderId - Order ID
 * @returns {Promise} API response
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/admin/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

/**
 * Get logged-in user's orders
 * @returns {Promise} API response with user's orders
 */
export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export default api;