import React, { createContext, useContext } from 'react';
// Temporarily disabled to prevent infinite loops
// import { useSession } from '../hooks/useSession';

const SessionContext = createContext();

/**
 * Session Context Provider - TEMPORARILY DISABLED
 */
export const SessionProvider = ({ children }) => {
  // Temporarily return a mock session to prevent infinite loops
  const mockSessionData = {
    session: {
      isAuthenticated: false,
      user: null,
      sessionId: null,
      loading: false,
      error: null
    },
    login: async () => ({ success: false, error: 'Session provider disabled' }),
    register: async () => ({ success: false, error: 'Session provider disabled' }),
    logout: async () => { },
    refreshToken: async () => false,
    checkAuth: async () => { },
    updateUser: () => { },
    fetchSession: async () => { }
  };

  return (
    <SessionContext.Provider value={mockSessionData}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * Hook to use session context
 */
export const useSessionContext = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }

  return context;
};

/**
 * HOC to require authentication
 */
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { session } = useSessionContext();

    if (session.loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      );
    }

    if (!session.isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

/**
 * HOC to require admin role
 */
export const withAdminAuth = (Component) => {
  return function AdminAuthenticatedComponent(props) {
    const { session } = useSessionContext();

    if (session.loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      );
    }

    if (!session.isAuthenticated || session.user?.role !== 'admin') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};