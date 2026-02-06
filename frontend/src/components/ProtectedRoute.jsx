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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin only route
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    return (
      <UnauthorizedAccess
        message="You need administrator privileges to access this page."
        redirectTo="/"
      />
    );
  }

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirect based on role
    if (isAdmin()) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};