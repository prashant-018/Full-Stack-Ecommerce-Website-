const axios = require('axios');
require('dotenv').config();

/**
 * Test admin API endpoints
 */
const testAdminAPI = async () => {
  try {
    console.log('🧪 Testing Admin API Endpoints...');

    const baseURL = 'http://localhost:5002/api';

    // Step 1: Login as admin to get token
    console.log('\n1️⃣ Testing admin login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@gmail.com',
      password: 'prashant123'
    });

    if (!loginResponse.data.success) {
      console.error('❌ Admin login failed:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Admin login successful');

    // Step 2: Test admin orders endpoint
    console.log('\n2️⃣ Testing admin orders endpoint...');
    const ordersResponse = await axios.get(`${baseURL}/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (ordersResponse.data.success) {
      console.log('✅ Admin orders endpoint working');
      console.log(`📦 Found ${ordersResponse.data.data.orders.length} orders`);
    } else {
      console.error('❌ Admin orders endpoint failed:', ordersResponse.data.message);
    }

    // Step 3: Test admin stats endpoint
    console.log('\n3️⃣ Testing admin stats endpoint...');
    const statsResponse = await axios.get(`${baseURL}/admin/orders/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (statsResponse.data.success) {
      console.log('✅ Admin stats endpoint working');
      console.log('📊 Stats:', statsResponse.data.data);
    } else {
      console.error('❌ Admin stats endpoint failed:', statsResponse.data.message);
    }

    console.log('\n🎉 All admin API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

// Run the test
testAdminAPI()
  .then(() => {
    console.log('🏁 Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test error:', error.message);
    process.exit(1);
  });