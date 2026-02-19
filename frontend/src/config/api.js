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
  // Development: Use Vite proxy (relative path)
  if (import.meta.env.DEV) {
    const devUrl = '/api';
    console.log('🔧 Development Mode - API_URL:', devUrl);
    return devUrl;
  }

  // Production: Use environment variable or fallback
  const envUrl = import.meta.env.VITE_API_URL;
  const productionFallback = 'https://full-stack-ecommerce-website-2-8vaf.onrender.com';
  
  // Use env var if set, otherwise use fallback
  const baseUrl = envUrl || productionFallback;
  
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
  console.log('  - VITE_API_URL from env:', envUrl || 'NOT SET (using fallback)');
  console.log('  - Base URL:', baseUrl);
  console.log('  - Final API_URL:', url);
  
  if (!envUrl && import.meta.env.PROD) {
    console.error('❌ CRITICAL: VITE_API_URL not set in production!');
    console.error('📋 Set VITE_API_URL in Vercel Dashboard → Settings → Environment Variables');
    console.error('   Value should be: https://full-stack-ecommerce-website-2-8vaf.onrender.com');
    console.warn('⚠️  Using fallback URL:', url);
  }
  
  return url;
};

// Export the API base URL (ALREADY contains /api - never add /api again!)
export const API_URL = getApiBaseUrl();

// Always log the final API_URL value for debugging
console.log('✅ API_URL initialized:', API_URL);
console.log('⚠️  REMEMBER: API_URL already contains /api, use it like: `${API_URL}/auth/login`');

export default API_URL;
