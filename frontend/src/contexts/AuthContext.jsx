import React, { createContext, useContext, useState, useEffect } from 'react';

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

      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
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

        return { success: true, user: userData };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, role: 'user' })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const newUser = data.data.user;

        // Store auth data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userRole', newUser.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(newUser));

        setUser(newUser);
        setIsAuthenticated(true);

        return { success: true, user: newUser };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
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