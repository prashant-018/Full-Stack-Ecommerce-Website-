import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import API_URL from '../config/api';

const LoginSignin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Prepare login data
        const loginData = {
          email: formData.email,
          password: formData.password
        };

        console.log('Attempting login with:', { email: loginData.email });
        
        // Call the real backend API
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData)
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok && data.success) {
          // Check if user is admin for admin login
          if (isAdminLogin) {
            if (data.data.user.role !== 'admin') {
              alert('Access denied. Admin privileges required.');
              setIsLoading(false);
              return;
            }

            console.log('Admin login successful:', data.data.user);
            alert('Admin login successful! Welcome to Admin Dashboard.');

            // Store admin token and user data
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('adminUser', JSON.stringify(data.data.user));

            // Redirect to admin dashboard
            navigate('/admin');
          } else {
            // Regular user login
            console.log('User login successful:', data.data.user);
            alert('Login successful!');

            // Store user token and data
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('userRole', data.data.user.role);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(data.data.user));

            // Redirect to home page
            navigate('/');
          }
        } else {
          console.error('Login failed:', data);
          alert(data.message || 'Login failed. Please check your credentials.');
          setIsLoading(false);
          return;
        }
      } else {
        // Sign up logic
        const signupData = {
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: 'user'
        };

        console.log('Attempting signup with:', { email: signupData.email, name: signupData.name });

        // Call the real backend API using centralized config
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData)
        });

        const data = await response.json();
        console.log('Signup response:', data);

        if (response.ok && data.success) {
          console.log('Signup successful:', data.data.user);
          alert('Account created successfully!');

          // Store user token and data
          localStorage.setItem('authToken', data.data.token);
          localStorage.setItem('userRole', data.data.user.role);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(data.data.user));

          // Redirect to home page
          navigate('/');
        } else {
          console.error('Signup failed:', data);
          alert(data.message || 'Signup failed. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      // Reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsAdminLogin(false); // Reset admin login when switching modes
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login/Signup Section */}
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 border-b border-gray-200 py-4 bg-white">
          <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black cursor-pointer">Home</Link>
            <span>/</span>
            <span className="text-black">{isLogin ? 'Login' : 'Sign Up'}</span>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-medium text-gray-900">
              {isAdminLogin ? 'Admin Login' : (isLogin ? 'Sign in to your account' : 'Create your account')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="font-medium text-black hover:text-gray-700 underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>

            {/* Admin Login Toggle - Only show for login mode */}
            {isLogin && (
              <div className="mt-4">
                <button
                  onClick={() => setIsAdminLogin(!isAdminLogin)}
                  className={`text-sm px-4 py-2 rounded-full border transition-colors ${isAdminLogin
                    ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                >
                  {isAdminLogin ? '👤 Switch to User Login' : '🔐 Admin Login'}
                </button>
                {isAdminLogin && (
                  <p className="text-xs text-red-600 mt-2">
                    Use your admin credentials to access the dashboard
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className={`bg-white py-8 px-4 shadow-sm border sm:rounded-lg sm:px-10 ${isAdminLogin ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}>
            {/* Admin Login Header */}
            {isAdminLogin && (
              <div className="mb-6 p-3 bg-red-100 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-red-600 mr-2">🔐</div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Admin Access</h3>
                    <p className="text-xs text-red-600">Restricted area for administrators only</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Sign up fields */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full px-3 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                          } rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full px-3 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                          } rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Confirm password for sign up */}
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-3 py-2 pr-10 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        } rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Remember me and forgot password for login */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      className="font-medium text-black hover:text-gray-700"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
                    } transition-colors`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign in' : 'Create account'
                  )}
                </button>
              </div>

              {/* Terms and conditions for sign up */}
              {!isLogin && (
                <div className="text-xs text-gray-600 text-center">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-black hover:text-gray-700 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-black hover:text-gray-700 underline">
                    Privacy Policy
                  </Link>
                </div>
              )}
            </form>

            {/* Social login options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="ml-2">Google</span>
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignin;