/**
 * Simple API Test Script
 * Run this to test all User Management API endpoints
 * 
 * Usage: node test-api.js
 */

const BASE_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

let authToken = '';
let testUserId = '';

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    return {
      status: response.status,
      data: result
    };
  } catch (error) {
    return {
      status: 500,
      data: { success: false, message: error.message }
    };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n' + colors.blue + '🔍 Testing Health Check...' + colors.reset);
  const result = await makeRequest('GET', '/health');
  
  if (result.status === 200 && result.data.success) {
    console.log(colors.green + '✅ Health check passed' + colors.reset);
    console.log('   Database:', result.data.database?.status || 'unknown');
    return true;
  } else {
    console.log(colors.red + '❌ Health check failed' + colors.reset);
    console.log('   Status:', result.status);
    console.log('   Message:', result.data.message);
    return false;
  }
}

async function testRegister() {
  console.log('\n' + colors.blue + '🔍 Testing User Registration...' + colors.reset);
  
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };

  const result = await makeRequest('POST', '/auth/register', testUser);
  
  if (result.status === 201 && result.data.success) {
    console.log(colors.green + '✅ Registration successful' + colors.reset);
    console.log('   User ID:', result.data.data?.user?.id);
    console.log('   Email:', result.data.data?.user?.email);
    return { success: true, email: testUser.email };
  } else {
    console.log(colors.red + '❌ Registration failed' + colors.reset);
    console.log('   Status:', result.status);
    console.log('   Message:', result.data.message);
    if (result.data.errors) {
      console.log('   Errors:', JSON.stringify(result.data.errors, null, 2));
    }
    return { success: false };
  }
}

async function testLogin(email, password) {
  console.log('\n' + colors.blue + '🔍 Testing User Login...' + colors.reset);
  
  const result = await makeRequest('POST', '/auth/login', { email, password });
  
  if (result.status === 200 && result.data.success) {
    console.log(colors.green + '✅ Login successful' + colors.reset);
    authToken = result.data.data?.token;
    testUserId = result.data.data?.user?.id;
    console.log('   Token received:', authToken ? 'Yes' : 'No');
    console.log('   User ID:', testUserId);
    return true;
  } else {
    console.log(colors.red + '❌ Login failed' + colors.reset);
    console.log('   Status:', result.status);
    console.log('   Message:', result.data.message);
    return false;
  }
}

async function testGetProfile() {
  console.log('\n' + colors.blue + '🔍 Testing Get Profile...' + colors.reset);
  
  if (!authToken) {
    console.log(colors.yellow + '⚠️  Skipping - No auth token' + colors.reset);
    return false;
  }

  const result = await makeRequest('GET', '/user/profile', null, authToken);
  
  if (result.status === 200 && result.data.success) {
    console.log(colors.green + '✅ Get profile successful' + colors.reset);
    console.log('   Name:', result.data.data?.user?.name);
    console.log('   Email:', result.data.data?.user?.email);
    return true;
  } else {
    console.log(colors.red + '❌ Get profile failed' + colors.reset);
    console.log('   Status:', result.status);
    console.log('   Message:', result.data.message);
    return false;
  }
}

async function testUpdateProfile() {
  console.log('\n' + colors.blue + '🔍 Testing Update Profile...' + colors.reset);
  
  if (!authToken) {
    console.log(colors.yellow + '⚠️  Skipping - No auth token' + colors.reset);
    return false;
  }

  const updateData = {
    name: 'Updated Test User',
    phone: '+1234567890',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'USA'
    }
  };

  const result = await makeRequest('PUT', '/user/profile', updateData, authToken);
  
  if (result.status === 200 && result.data.success) {
    console.log(colors.green + '✅ Update profile successful' + colors.reset);
    console.log('   Updated Name:', result.data.data?.user?.name);
    return true;
  } else {
    console.log(colors.red + '❌ Update profile failed' + colors.reset);
    console.log('   Status:', result.status);
    console.log('   Message:', result.data.message);
    return false;
  }
}

async function testLogout() {
  console.log('\n' + colors.blue + '🔍 Testing Logout...' + colors.reset);
  
  if (!authToken) {
    console.log(colors.yellow + '⚠️  Skipping - No auth token' + colors.reset);
    return false;
  }

  const result = await makeRequest('POST', '/auth/logout', null, authToken);
  
  if (result.status === 200 && result.data.success) {
    console.log(colors.green + '✅ Logout successful' + colors.reset);
    return true;
  } else {
    console.log(colors.red + '❌ Logout failed' + colors.reset);
    console.log('   Status:', result.status);
    console.log('   Message:', result.data.message);
    return false;
  }
}

async function testForgotPassword(email) {
  console.log('\n' + colors.blue + '🔍 Testing Forgot Password...' + colors.reset);
  
  const result = await makeRequest('POST', '/auth/forgot-password', { email });
  
  if (result.status === 200 && result.data.success) {
    console.log(colors.green + '✅ Forgot password request successful' + colors.reset);
    console.log('   Message:', result.data.message);
    return true;
  } else {
    console.log(colors.red + '❌ Forgot password failed' + colors.reset);
    console.log('   Status:', result.status);
    console.log('   Message:', result.data.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(colors.blue + '\n🚀 Starting API Tests...\n' + colors.reset);
  console.log('Base URL:', BASE_URL);
  console.log('Make sure your server is running on port 5000\n');

  const results = {
    health: false,
    register: false,
    login: false,
    getProfile: false,
    updateProfile: false,
    logout: false,
    forgotPassword: false
  };

  let testEmail = '';

  // Test 1: Health Check
  results.health = await testHealthCheck();

  // Test 2: Register
  const registerResult = await testRegister();
  results.register = registerResult.success;
  testEmail = registerResult.email || 'test@example.com';

  // Test 3: Login
  if (results.register) {
    results.login = await testLogin(testEmail, 'password123');
  }

  // Test 4: Get Profile
  if (results.login) {
    results.getProfile = await testGetProfile();
  }

  // Test 5: Update Profile
  if (results.login) {
    results.updateProfile = await testUpdateProfile();
  }

  // Test 6: Logout
  if (results.login) {
    results.logout = await testLogout();
  }

  // Test 7: Forgot Password
  results.forgotPassword = await testForgotPassword(testEmail);

  // Summary
  console.log('\n' + colors.blue + '📊 Test Summary:' + colors.reset);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    console.log(`${color}${icon} ${test.padEnd(20)} ${passed ? 'PASSED' : 'FAILED'}${colors.reset}`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const passedCount = Object.values(results).filter(r => r).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`Results: ${passedCount}/${totalCount} tests passed\n`);
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log(colors.red + '❌ Error: fetch is not available' + colors.reset);
  console.log('Please use Node.js 18+ or install node-fetch');
  console.log('Run: npm install node-fetch@2');
  process.exit(1);
}

// Run tests
runTests().catch(error => {
  console.error(colors.red + '❌ Test runner error:' + colors.reset, error);
  process.exit(1);
});

