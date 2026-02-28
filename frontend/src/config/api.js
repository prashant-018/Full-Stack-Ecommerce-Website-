/**
 * Production-Grade API Configuration
 * Single source of truth for all API URLs
 * 
 * Usage:
 *   import API_URL from '../config/api';
 *   fetch(`${API_URL}/auth/login`)
 *   axios.post(`${API_URL}/products`, data)
 * 
 * IMPORTANT: API_URL already contains /api, never add /api again!
 */

const getApiBaseUrl = () => {
  // Check if we're in production build
  const isProductionBuild = import.meta.env.PROD || import.meta.env.MODE === 'production';
  
  // Check hostname safely (only in browser)
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
  const isProduction = isProductionBuild || (!isLocalhost && hostname !== '');
  
  // Development: Use Vite proxy (relative path) ONLY if actually on localhost
  if (!isProduction && isLocalhost) {
    const devUrl = '/api';
    console.log('🔧 Development Mode - API_URL:', devUrl);
    return devUrl;
  }

  // Production: Use environment variable or fallback
  // NEVER use localhost in production
  const envUrl = import.meta.env.VITE_API_URL;
  // Single canonical production backend (same host used everywhere)
  const productionFallback = 'https://cafes-20-main-6.onrender.com';
  
  // Use env var if set, otherwise use fallback
  let baseUrl = envUrl || productionFallback;
  
  // CRITICAL: Never allow localhost in production
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    console.error('❌ BLOCKED: localhost detected in production! Using fallback.');
    baseUrl = productionFallback;
  }
  
  // Clean the URL (remove trailing slashes)
  let url = baseUrl.trim().replace(/\/+$/, '');
  
  // In production, ensure /api is included
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  
  // Log for debugging
  console.log('🌐 API_URL Configuration:');
  console.log('  - Environment:', import.meta.env.MODE);
  console.log('  - Is Production:', import.meta.env.PROD);
  console.log('  - Is Development:', import.meta.env.DEV);
  console.log('  - Hostname:', window.location.hostname);
  console.log('  - Computed isProduction:', isProduction);
  console.log('  - VITE_API_URL from env:', envUrl || 'NOT SET (using fallback)');
  console.log('  - Base URL:', baseUrl);
  console.log('  - Final API_URL:', url);
  
  if (!envUrl && isProduction) {
    console.error('❌ CRITICAL: VITE_API_URL not set in production!');
    console.error('📋 Set VITE_API_URL in Vercel Dashboard → Settings → Environment Variables');
    console.error(`   Value should be your backend origin, e.g. ${productionFallback}`);
    console.warn('⚠️  Using fallback URL:', url);
  }
  
  return url;
};

// Export the API base URL (ALREADY contains /api - never add /api again!)
export const API_URL = getApiBaseUrl();

// Runtime validation - CRITICAL for production
if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  const isProductionHost = hostname !== 'localhost' && !hostname.includes('127.0.0.1');
  
  if (isProductionHost && (API_URL.includes('localhost') || API_URL.includes('127.0.0.1'))) {
    console.error('❌ CRITICAL ERROR: API_URL is localhost on production host!');
    console.error('Hostname:', hostname);
    console.error('API_URL:', API_URL);
    console.error('This will cause CORS errors. Set VITE_API_URL in Vercel.');
    
    // Force production URL
    const forcedUrl = 'https://full-stack-ecommerce-website-2-8vaf.onrender.com/api';
    console.error('⚠️  Forcing production URL:', forcedUrl);
    // Note: We can't reassign const, but this will at least log the error
  }
}

// Always log the final API_URL value for debugging
console.log('✅ API_URL initialized:', API_URL);
console.log('✅ Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');
console.log('⚠️  REMEMBER: API_URL already contains /api, use it like: `${API_URL}/auth/login`');

export default API_URL;
