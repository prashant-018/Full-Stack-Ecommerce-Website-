import React, { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '../config/api';

// Debug logging
console.log('🔧 AuthContext - API_URL:', API_URL);

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userData = localStorage.getItem('user') || localStorage.getItem('adminUser');

      if (token && userRole && userData) {
        const parsedUser = JSON.parse(userData);
        setUser({ ...parsedUser, role: userRole });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, isAdminLogin = false) => {
    try {
      setLoading(true);

      const loginUrl = `${API_URL}/auth/login`;

      console.log('🔐 Attempting login to:', loginUrl);
      console.log('🔧 API_URL value:', API_URL);
      console.log('✅ Final login URL:', loginUrl);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies/CORS
        body: JSON.stringify({ email, password })
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.message || 'Login request failed');
      }

      const data = await response.json();

      if (data.success) {
        const userData = data.data.user;

        // Check role-based access
        if (isAdminLogin && userData.role !== 'admin') {
          throw new Error('Admin privileges required');
        }

        // Store auth data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('isLoggedIn', 'true');

        if (userData.role === 'admin') {
          localStorage.setItem('adminUser', JSON.stringify(userData));
        } else {
          localStorage.setItem('user', JSON.stringify(userData));
        }

        setUser(userData);
        setIsAuthenticated(true);

        console.log('✅ Login successful:', userData.email);
        return { success: true, user: userData };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Handle network errors specifically
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        return { 
          success: false, 
          error: 'Cannot connect to server. Please check if the backend is running and the API URL is correct.' 
        };
      }
      
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      const registerUrl = `${API_URL}/auth/register`;

      console.log('📝 Attempting registration to:', registerUrl);
      console.log('🔧 API_URL value:', API_URL);
      console.log('✅ Final register URL:', registerUrl);

      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies/CORS
        body: JSON.stringify({ ...userData, role: 'user' })
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.message || 'Registration request failed');
      }

      const data = await response.json();

      if (data.success) {
        const newUser = data.data.user;

        // Store auth data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userRole', newUser.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(newUser));

        setUser(newUser);
        setIsAuthenticated(true);

        console.log('✅ Registration successful:', newUser.email);
        return { success: true, user: newUser };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Handle network errors specifically
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        return { 
          success: false, 
          error: 'Cannot connect to server. Please check if the backend is running and the API URL is correct.' 
        };
      }
      
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isUser = () => {
    return user?.role === 'user';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
    isUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};