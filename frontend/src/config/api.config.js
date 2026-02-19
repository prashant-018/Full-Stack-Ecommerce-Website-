/**
 * Production-Ready API Configuration
 * Handles environment variables, error handling, and debugging
 */

// Get API base URL from environment variable
export const getApiBaseURL = () => {
  // In development with Vite proxy, use relative path
  if (import.meta.env.DEV) {
    const devUrl = '/api';
    console.log('🔧 Development Mode - Using Vite proxy:', devUrl);
    return devUrl;
  }

  // In production, MUST use environment variable
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    const errorMsg = '❌ CRITICAL: VITE_API_URL environment variable is not set!';
    console.error(errorMsg);
    console.error('📋 Please set VITE_API_URL in Vercel:');
    console.error('   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.error('   2. Add: VITE_API_URL = https://your-backend-url.com');
    console.error('   3. Redeploy your application');
    
    // Show error in UI (will be caught by error boundary)
    throw new Error('API URL not configured. Please contact support.');
  }

  // Clean and format the API URL
  let baseUrl = apiUrl.trim();
  
  // Remove trailing slash
  baseUrl = baseUrl.replace(/\/+$/, '');
  
  // Add /api if not present
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`;
  }

  console.log('🌐 Production API URL:', baseUrl);
  console.log('✅ Environment variable loaded successfully');
  
  return baseUrl;
};

// Export API base URL as constant
export const API_BASE_URL = getApiBaseURL();

// Debug information (for development/debugging UI)
export const getApiDebugInfo = () => {
  return {
    isDev: import.meta.env.DEV,
    viteApiUrl: import.meta.env.VITE_API_URL || 'NOT SET',
    computedBaseUrl: API_BASE_URL,
    mode: import.meta.env.MODE,
    allEnvVars: {
      DEV: import.meta.env.DEV,
      MODE: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
      VITE_API_URL: import.meta.env.VITE_API_URL || 'NOT SET'
    }
  };
};

export default {
  API_BASE_URL,
  getApiBaseURL,
  getApiDebugInfo
};

