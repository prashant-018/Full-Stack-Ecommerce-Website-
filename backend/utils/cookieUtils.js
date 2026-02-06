/**
 * Cookie utility functions for secure cookie management
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Default cookie options
 */
const defaultCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
};

/**
 * Set a secure cookie
 * @param {Object} res - Express response object
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Additional cookie options
 */
const setSecureCookie = (res, name, value, options = {}) => {
  const cookieOptions = {
    ...defaultCookieOptions,
    ...options
  };

  res.cookie(name, value, cookieOptions);
};

/**
 * Set authentication token cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token
 * @param {number} maxAge - Cookie max age in milliseconds
 */
const setAuthCookie = (res, token, maxAge = 24 * 60 * 60 * 1000) => {
  setSecureCookie(res, 'authToken', token, {
    maxAge,
    path: '/'
  });
};

/**
 * Set refresh token cookie (longer expiry, more secure)
 * @param {Object} res - Express response object
 * @param {string} refreshToken - Refresh token
 */
const setRefreshTokenCookie = (res, refreshToken) => {
  setSecureCookie(res, 'refreshToken', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh',
    httpOnly: true
  });
};

/**
 * Set user preferences cookie
 * @param {Object} res - Express response object
 * @param {Object} preferences - User preferences object
 */
const setPreferencesCookie = (res, preferences) => {
  setSecureCookie(res, 'userPrefs', JSON.stringify(preferences), {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: false, // Allow client-side access for preferences
    path: '/'
  });
};

/**
 * Set cart cookie for guest users
 * @param {Object} res - Express response object
 * @param {Array} cartItems - Cart items array
 */
const setCartCookie = (res, cartItems) => {
  setSecureCookie(res, 'guestCart', JSON.stringify(cartItems), {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: false, // Allow client-side access
    path: '/'
  });
};

/**
 * Clear a cookie
 * @param {Object} res - Express response object
 * @param {string} name - Cookie name
 * @param {string} path - Cookie path
 */
const clearCookie = (res, name, path = '/') => {
  res.clearCookie(name, {
    ...defaultCookieOptions,
    path,
    maxAge: 0
  });
};

/**
 * Clear all authentication cookies
 * @param {Object} res - Express response object
 */
const clearAuthCookies = (res) => {
  clearCookie(res, 'authToken');
  clearCookie(res, 'refreshToken', '/api/auth/refresh');
  clearCookie(res, 'ecom.sid'); // Clear session cookie
};

/**
 * Get cookie value from request
 * @param {Object} req - Express request object
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
const getCookie = (req, name) => {
  return req.cookies[name] || null;
};

/**
 * Parse JSON cookie safely
 * @param {Object} req - Express request object
 * @param {string} name - Cookie name
 * @returns {Object|null} Parsed object or null
 */
const getJSONCookie = (req, name) => {
  const cookieValue = getCookie(req, name);
  if (!cookieValue) return null;

  try {
    return JSON.parse(cookieValue);
  } catch (error) {
    console.warn(`Failed to parse JSON cookie ${name}:`, error.message);
    return null;
  }
};

module.exports = {
  setSecureCookie,
  setAuthCookie,
  setRefreshTokenCookie,
  setPreferencesCookie,
  setCartCookie,
  clearCookie,
  clearAuthCookies,
  getCookie,
  getJSONCookie,
  defaultCookieOptions
};