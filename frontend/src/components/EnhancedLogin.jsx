import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../contexts/SessionContext';
import { getUserPreferences, setUserPreferences } from '../utils/cookieUtils';

const EnhancedLogin = () => {
  const navigate = useNavigate();
  const { login, session } = useSessionContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);

      if (result.success) {
        // Set user preferences if remember me is checked
        if (formData.rememberMe) {
          const preferences = getUserPreferences();
          setUserPreferences({
            ...preferences,
            rememberMe: true,
            lastLoginEmail: formData.email
          });
        }

        // Redirect based on user role
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved email if remember me was previously checked
  React.useEffect(() => {
    const preferences = getUserPreferences();
    if (preferences.rememberMe && preferences.lastLoginEmail) {
      setFormData(prev => ({
        ...prev,
        email: preferences.lastLoginEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {session.sessionId && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Session ID: {session.sessionId.substring(0, 8)}...
            </p>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-black hover:text-gray-800">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-black hover:text-gray-800">
                Sign up
              </a>
            </span>
          </div>
        </form>

        {/* Session Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Session Debug Info:</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLogin;