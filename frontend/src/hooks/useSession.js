import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getCookie, deleteCookie, COOKIE_NAMES } from '../utils/cookieUtils';

/**
 * Custom hook for session management
 */
export const useSession = () => {
  const [session, setSession] = useState({
    isAuthenticated: false,
    user: null,
    sessionId: null,
    loading: true,
    error: null
  });

  /**
   * Logout user - no dependencies to avoid circular refs
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear session state
      setSession({
        isAuthenticated: false,
        user: null,
        sessionId: null,
        loading: false,
        error: null
      });

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');

      // Clear cookies (best effort)
      deleteCookie(COOKIE_NAMES.AUTH_TOKEN);
      deleteCookie(COOKIE_NAMES.REFRESH_TOKEN);
      deleteCookie(COOKIE_NAMES.SESSION_ID);
    }
  }, []);

  /**
   * Refresh authentication token - no dependencies to avoid circular refs
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh');

      if (response.data.success) {
        const { user } = response.data.data;
        setSession(prev => ({
          ...prev,
          user,
          error: null
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user - call logout directly to avoid dependency
      try {
        await api.post('/auth/logout');
      } catch (logoutError) {
        console.error('Logout error:', logoutError);
      } finally {
        setSession({
          isAuthenticated: false,
          user: null,
          sessionId: null,
          loading: false,
          error: null
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        deleteCookie(COOKIE_NAMES.AUTH_TOKEN);
        deleteCookie(COOKIE_NAMES.REFRESH_TOKEN);
        deleteCookie(COOKIE_NAMES.SESSION_ID);
      }
      return false;
    }
  }, []);

  /**
   * Check authentication status - no dependencies to avoid circular refs
   */
  const checkAuth = useCallback(async () => {
    const token = getCookie(COOKIE_NAMES.AUTH_TOKEN) || localStorage.getItem('authToken');

    if (!token) {
      setSession({
        isAuthenticated: false,
        user: null,
        sessionId: null,
        loading: false,
        error: null
      });
      return;
    }

    try {
      const response = await api.get('/auth/me');

      if (response.data.success) {
        const { user, session: sessionInfo } = response.data.data;
        setSession({
          isAuthenticated: true,
          user,
          sessionId: sessionInfo?.sessionId || null,
          loading: false,
          error: null
        });
      } else {
        // Try to refresh token - call refreshToken directly to avoid dependency
        const refreshed = await refreshToken();
        if (!refreshed) {
          // Logout inline to avoid dependency
          try {
            await api.post('/auth/logout');
          } catch (logoutError) {
            console.error('Logout error:', logoutError);
          } finally {
            setSession({
              isAuthenticated: false,
              user: null,
              sessionId: null,
              loading: false,
              error: null
            });
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            deleteCookie(COOKIE_NAMES.AUTH_TOKEN);
            deleteCookie(COOKIE_NAMES.REFRESH_TOKEN);
            deleteCookie(COOKIE_NAMES.SESSION_ID);
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);

      if (error.response?.status === 401) {
        // Try to refresh token - call refreshToken directly to avoid dependency
        const refreshed = await refreshToken();
        if (!refreshed) {
          // Logout inline to avoid dependency
          try {
            await api.post('/auth/logout');
          } catch (logoutError) {
            console.error('Logout error:', logoutError);
          } finally {
            setSession({
              isAuthenticated: false,
              user: null,
              sessionId: null,
              loading: false,
              error: null
            });
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            deleteCookie(COOKIE_NAMES.AUTH_TOKEN);
            deleteCookie(COOKIE_NAMES.REFRESH_TOKEN);
            deleteCookie(COOKIE_NAMES.SESSION_ID);
          }
        }
      } else {
        setSession(prev => ({
          ...prev,
          loading: false,
          error: 'Authentication check failed'
        }));
      }
    }
  }, []);

  /**
   * Fetch session information from server
   */
  const fetchSession = useCallback(async () => {
    try {
      setSession(prev => ({ ...prev, loading: true, error: null }));

      const response = await api.get('/auth/session');

      if (response.data.success) {
        setSession({
          ...response.data.data.session,
          loading: false,
          error: null
        });
      } else {
        setSession({
          isAuthenticated: false,
          user: null,
          sessionId: null,
          loading: false,
          error: response.data.message
        });
      }
    } catch (error) {
      console.error('Session fetch error:', error);
      setSession({
        isAuthenticated: false,
        user: null,
        sessionId: null,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch session'
      });
    }
  }, []);

  /**
   * Login with credentials
   */
  const login = useCallback(async (credentials) => {
    try {
      setSession(prev => ({ ...prev, loading: true, error: null }));

      const response = await api.post('/auth/login', credentials);

      if (response.data.success) {
        const { user, session: sessionInfo } = response.data.data;

        setSession({
          isAuthenticated: true,
          user,
          sessionId: sessionInfo.sessionId,
          loading: false,
          error: null
        });

        return { success: true, user };
      } else {
        setSession(prev => ({
          ...prev,
          loading: false,
          error: response.data.message
        }));
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setSession(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (userData) => {
    try {
      setSession(prev => ({ ...prev, loading: true, error: null }));

      const response = await api.post('/auth/register', userData);

      if (response.data.success) {
        const { user, session: sessionInfo } = response.data.data;

        setSession({
          isAuthenticated: true,
          user,
          sessionId: sessionInfo.sessionId,
          loading: false,
          error: null
        });

        return { success: true, user };
      } else {
        setSession(prev => ({
          ...prev,
          loading: false,
          error: response.data.message
        }));
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setSession(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Update user profile in session
   */
  const updateUser = useCallback((updatedUser) => {
    setSession(prev => ({
      ...prev,
      user: { ...prev.user, ...updatedUser }
    }));
  }, []);

  // Initialize session on mount - FIXED: Empty dependency array to run only once
  useEffect(() => {
    checkAuth();
  }, []); // Empty dependency array to prevent infinite loops

  // Set up token refresh interval
  useEffect(() => {
    if (session.isAuthenticated) {
      const interval = setInterval(() => {
        refreshToken();
      }, 15 * 60 * 1000); // Refresh every 15 minutes

      return () => clearInterval(interval);
    }
  }, [session.isAuthenticated, refreshToken]);

  return {
    session,
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
    updateUser,
    fetchSession
  };
};