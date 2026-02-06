import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ModernLogin = () => {
  const { login, register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let result;

      if (isLogin) {
        result = await login(formData.email, formData.password, isAdminLogin);

        if (result.success) {
          // Role-based navigation after successful login
          if (result.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError(result.error);
        }
      } else {
        result = await register({
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          // Always redirect users to dashboard after registration
          navigate('/dashboard');
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsAdminLogin(false);
    setError('');
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Breadcrumb */}
      <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 py-4 z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition-colors font-medium">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{isLogin ? 'Sign In' : 'Sign Up'}</span>
        </div>
      </div>

      <div className="w-full max-w-md relative z-20">
        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/20 overflow-hidden">

          {/* Header */}
          <div className="px-8 py-8 text-center bg-gradient-to-b from-white/50 to-transparent">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <Link to="/" className="inline-block mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-wide">
                EVERLANE
              </h1>
            </Link>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join Everlane'}
            </h2>

            <p className="text-gray-600 text-sm">
              {isLogin
                ? 'Sign in to continue your shopping journey'
                : 'Create your account and discover premium fashion'
              }
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            {/* Mode Toggle - Pill Style */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-full p-1 flex">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setIsAdminLogin(false); }}
                  className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${isLogin && !isAdminLogin
                      ? 'bg-white text-gray-900 shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${!isLogin
                      ? 'bg-white text-gray-900 shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Admin Toggle - Subtle */}
            {isLogin && (
              <div className="flex justify-center mb-6">
                <button
                  type="button"
                  onClick={() => setIsAdminLogin(!isAdminLogin)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${isAdminLogin
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isAdminLogin ? 'Admin Mode' : 'Admin Access'}</span>
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields for Sign Up */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-white/50 border rounded-2xl transition-all duration-300 ${focusedField === 'firstName'
                          ? 'border-gray-900 shadow-lg shadow-gray-900/10 bg-white transform scale-[1.02]'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      placeholder="John"
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-white/50 border rounded-2xl transition-all duration-300 ${focusedField === 'lastName'
                          ? 'border-gray-900 shadow-lg shadow-gray-900/10 bg-white transform scale-[1.02]'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      placeholder="Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-gray-900' : 'text-gray-400'
                    }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-4 py-3 bg-white/50 border rounded-2xl transition-all duration-300 ${focusedField === 'email'
                        ? 'border-gray-900 shadow-lg shadow-gray-900/10 bg-white transform scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-gray-900' : 'text-gray-400'
                    }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-3 bg-white/50 border rounded-2xl transition-all duration-300 ${focusedField === 'password'
                        ? 'border-gray-900 shadow-lg shadow-gray-900/10 bg-white transform scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Sign Up */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-gray-900' : 'text-gray-400'
                      }`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-12 py-3 bg-white/50 border rounded-2xl transition-all duration-300 ${focusedField === 'confirmPassword'
                          ? 'border-gray-900 shadow-lg shadow-gray-900/10 bg-white transform scale-[1.02]'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      placeholder="••••••••"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-gray-900 hover:text-gray-700 font-medium underline underline-offset-4"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button - Premium Style */}
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isAdminLogin
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 transform hover:scale-[1.02]'
                      : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-900/40 transform hover:scale-[1.02]'
                  }`}
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Toggle Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  className="font-semibold text-gray-900 hover:text-gray-700 underline underline-offset-4 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Social Login - Reduced Priority */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex justify-center items-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white/50 text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  className="flex justify-center items-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white/50 text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="text-gray-700 hover:text-gray-900 underline underline-offset-2">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-gray-700 hover:text-gray-900 underline underline-offset-2">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;