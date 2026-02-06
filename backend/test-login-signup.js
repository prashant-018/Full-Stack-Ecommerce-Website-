/**
 * Quick Test Script for Login and Signup
 * Run: node test-login-signup.js
 */

const BASE_URL = 'http://localhost:5000/api';

// Test user data
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123'
};

console.log('🧪 Testing Login and Signup...\n');
console.log('Test User:', testUser.email);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test Registration
async function testRegister() {
  console.log('1️⃣ Testing Registration...');
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Registration SUCCESS!');
      console.log('   User ID:', data.user?.id);
      console.log('   Name:', data.user?.name);
      console.log('   Email:', data.user?.email);
      console.log('   Token:', data.token ? 'Received ✓' : 'Missing ✗');
      return { success: true, token: data.token, user: data.user };
    } else {
      console.log('❌ Registration FAILED!');
      console.log('   Status:', response.status);
      console.log('   Message:', data.message);
      if (data.errors) {
        console.log('   Errors:', JSON.stringify(data.errors, null, 2));
      }
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Registration ERROR!');
    console.log('   Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test Login
async function testLogin(email, password) {
  console.log('\n2️⃣ Testing Login...');
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Login SUCCESS!');
      console.log('   User ID:', data.user?.id);
      console.log('   Name:', data.user?.name);
      console.log('   Email:', data.user?.email);
      console.log('   Token:', data.token ? 'Received ✓' : 'Missing ✗');
      return { success: true, token: data.token, user: data.user };
    } else {
      console.log('❌ Login FAILED!');
      console.log('   Status:', response.status);
      console.log('   Message:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Login ERROR!');
    console.log('   Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test Get Profile
async function testGetProfile(token) {
  console.log('\n3️⃣ Testing Get Profile...');
  if (!token) {
    console.log('⚠️  Skipping - No token available');
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Get Profile SUCCESS!');
      console.log('   Name:', data.data?.user?.name);
      console.log('   Email:', data.data?.user?.email);
      return true;
    } else {
      console.log('❌ Get Profile FAILED!');
      console.log('   Status:', response.status);
      console.log('   Message:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get Profile ERROR!');
    console.log('   Error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  // Check if fetch is available
  if (typeof fetch === 'undefined') {
    console.log('❌ fetch is not available. Please use Node.js 18+ or install node-fetch');
    process.exit(1);
  }

  // Test 1: Register
  const registerResult = await testRegister();
  
  // Test 2: Login (use registered user)
  let loginResult = { success: false };
  if (registerResult.success) {
    loginResult = await testLogin(testUser.email, testUser.password);
  } else {
    // Try login anyway (user might already exist)
    loginResult = await testLogin(testUser.email, testUser.password);
  }

  // Test 3: Get Profile
  const token = loginResult.token || registerResult.token;
  if (token) {
    await testGetProfile(token);
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Test Summary:');
  console.log('   Registration:', registerResult.success ? '✅ PASSED' : '❌ FAILED');
  console.log('   Login:', loginResult.success ? '✅ PASSED' : '❌ FAILED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (registerResult.success && loginResult.success) {
    console.log('🎉 All tests passed! Login and Signup are working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});

