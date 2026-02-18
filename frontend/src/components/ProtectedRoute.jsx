import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
  </div>
);

// Unauthorized access component
const UnauthorizedAccess = ({ message, redirectTo = "/login" }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
      <div className="text-red-500 text-6xl mb-4">🚫</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <Navigate to={redirectTo} replace />
    </div>
  </div>
);

// Basic protected route - requires authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute check:', {
    path: location.pathname,
    isAuthenticated,
    loading,
    hasToken: !!localStorage.getItem('authToken')
  });

  if (loading) {
    console.log('⏳ Auth loading...');
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login with return path:', location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('✅ Authenticated, rendering protected content');
  return children;
};

// Admin only route
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  console.log('👑 AdminRoute check:', {
    path: location.pathname,
    isAuthenticated,
    isAdmin: isAdmin(),
    loading
  });

  if (loading) {
    console.log('⏳ Auth loading...');
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin()) {
    console.log('❌ Not admin, access denied');
    return (
      <UnauthorizedAccess
        message="You need administrator privileges to access this page."
        redirectTo="/"
      />
    );
  }

  console.log('✅ Admin authenticated, rendering admin content');
  return children;
};

// User only route
export const UserRoute = ({ children }) => {
  const { isAuthenticated, isUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isUser()) {
    return (
      <UnauthorizedAccess
        message="This page is only accessible to regular users."
        redirectTo="/admin"
      />
    );
  }

  return children;
};

// Public route - redirects authenticated users away from login/register
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  console.log('🌐 PublicRoute check:', {
    isAuthenticated,
    isAdmin: isAdmin(),
    loading
  });

  if (loading) {
    console.log('⏳ Auth loading...');
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirect based on role
    if (isAdmin()) {
      console.log('👑 Admin already logged in, redirecting to /admin');
      return <Navigate to="/admin" replace />;
    } else {
      console.log('👤 User already logged in, redirecting to /');
      return <Navigate to="/" replace />;
    }
  }

  console.log('✅ Not authenticated, showing public content');
  return children;
};