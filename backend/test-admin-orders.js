const axios = require('axios');

// Test admin orders endpoint
const BASE_URL = 'http://localhost:5002/api';

async function testAdminOrders() {
  console.log('🔍 Testing Admin Orders Endpoint...\n');

  try {
    // First, let's try to get orders without auth to see what happens
    console.log('📤 Testing GET /api/orders (should require admin auth)...');

    try {
      const response = await axios.get(`${BASE_URL}/orders`);
      console.log('❌ Unexpected: Got response without auth:', response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly requires authentication (401)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.message);
      }
    }

    // Test the admin orders endpoint that might not require auth
    console.log('\\n📤 Testing GET /api/admin/orders...');

    try {
      const response = await axios.get(`${BASE_URL}/admin/orders`);

      if (response.status === 200 && response.data.success) {
        console.log('✅ Admin orders endpoint working!');
        console.log(`📊 Found ${response.data.data.orders.length} orders`);

        if (response.data.data.orders.length > 0) {
          const latestOrder = response.data.data.orders[0];
          console.log('\\n📦 Latest Order:');
          console.log(`   Order Number: ${latestOrder.orderNumber}`);
          console.log(`   Customer: ${latestOrder.customerInfo?.name || latestOrder.customer?.name}`);
          console.log(`   Total: $${latestOrder.total}`);
          console.log(`   Status: ${latestOrder.status}`);
          console.log(`   Payment: ${latestOrder.paymentMethod}`);
          console.log(`   Created: ${new Date(latestOrder.createdAt).toLocaleString()}`);
        }
      }
    } catch (error) {
      console.error('❌ Admin orders test failed:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
if (require.main === module) {
  testAdminOrders();
}

module.exports = { testAdminOrders };