const axios = require('axios');

// Simple test to check if the server is running and admin routes work
const BASE_URL = 'http://localhost:5002/api';

async function testServer() {
  console.log('🧪 Testing server health...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing server health');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running');
    console.log(`📊 Database status: ${healthResponse.data.database.status}`);

    // Test 2: Check if admin routes are accessible (should get 401 without token)
    console.log('\n2️⃣ Testing admin routes (should get 401)');
    try {
      await axios.get(`${BASE_URL}/admin/orders`);
      console.log('❌ Admin routes are not protected!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Admin routes are properly protected (401 Unauthorized)');
      } else {
        console.log(`⚠️ Unexpected error: ${error.response?.status} - ${error.response?.data?.message}`);
      }
    }

    console.log('\n🎉 Basic server tests passed!');
    console.log('\n💡 Next steps:');
    console.log('1. Make sure you have admin credentials');
    console.log('2. Login as admin to get a JWT token');
    console.log('3. Test the order status update functionality');

  } catch (error) {
    console.error('❌ Server test failed:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Server is not running. Please start it with:');
      console.log('cd EcommerecWeb/backend && npm start');
    }
  }
}

// Run tests
if (require.main === module) {
  testServer();
}

module.exports = { testServer };