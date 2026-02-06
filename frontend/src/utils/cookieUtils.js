/**
 * Frontend cookie utility functions
 */

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiry in days
 * @param {Object} options - Additional options
 */
export const setCookie = (name, value, days = 7, options = {}) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

  const cookieOptions = {
    expires: expires.toUTCString(),
    path: '/',
    sameSite: 'lax',
    ...options
  };

  const cookieString = Object.entries(cookieOptions)
    .map(([key, val]) => `${key}=${val}`)
    .join('; ');

  document.cookie = `${name}=${encodeURIComponent(value)}; ${cookieString}`;
};

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 * @param {string} path - Cookie path
 */
export const deleteCookie = (name, path = '/') => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
};

/**
 * Get JSON cookie (parse JSON value)
 * @param {string} name - Cookie name
 * @returns {Object|null} Parsed object or null
 */
export const getJSONCookie = (name) => {
  const cookieValue = getCookie(name);
  if (!cookieValue) return null;

  try {
    return JSON.parse(cookieValue);
  } catch (error) {
    console.warn(`Failed to parse JSON cookie ${name}:`, error);
    return null;
  }
};

/**
 * Set JSON cookie (stringify object)
 * @param {string} name - Cookie name
 * @param {Object} value - Object to store
 * @param {number} days - Expiry in days
 * @param {Object} options - Additional options
 */
export const setJSONCookie = (name, value, days = 7, options = {}) => {
  try {
    const jsonString = JSON.stringify(value);
    setCookie(name, jsonString, days, options);
  } catch (error) {
    console.error(`Failed to set JSON cookie ${name}:`, error);
  }
};

/**
 * Check if cookies are enabled
 * @returns {boolean} True if cookies are enabled
 */
export const areCookiesEnabled = () => {
  try {
    setCookie('test', 'test', 1);
    const enabled = getCookie('test') === 'test';
    deleteCookie('test');
    return enabled;
  } catch (error) {
    return false;
  }
};

/**
 * Get all cookies as an object
 * @returns {Object} Object with cookie names as keys
 */
export const getAllCookies = () => {
  const cookies = {};
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    const eqPos = c.indexOf('=');
    if (eqPos > 0) {
      const name = c.substring(0, eqPos);
      const value = decodeURIComponent(c.substring(eqPos + 1));
      cookies[name] = value;
    }
  }

  return cookies;
};

/**
 * Clear all cookies (best effort - can only clear cookies for current domain/path)
 */
export const clearAllCookies = () => {
  const cookies = getAllCookies();
  Object.keys(cookies).forEach(name => {
    deleteCookie(name);
    deleteCookie(name, '/');
  });
};

// Cookie names used in the application
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPrefs',
  GUEST_CART: 'guestCart',
  SESSION_ID: 'ecom.sid'
};

// Preference management
export const getUserPreferences = () => {
  return getJSONCookie(COOKIE_NAMES.USER_PREFERENCES) || {
    theme: 'light',
    currency: 'USD',
    language: 'en'
  };
};

export const setUserPreferences = (preferences) => {
  setJSONCookie(COOKIE_NAMES.USER_PREFERENCES, preferences, 30); // 30 days
};

// Guest cart management
export const getGuestCart = () => {
  return getJSONCookie(COOKIE_NAMES.GUEST_CART) || [];
};

export const setGuestCart = (cartItems) => {
  setJSONCookie(COOKIE_NAMES.GUEST_CART, cartItems, 7); // 7 days
};

export const clearGuestCart = () => {
  deleteCookie(COOKIE_NAMES.GUEST_CART);
};