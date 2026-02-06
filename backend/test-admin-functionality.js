const axios = require('axios');

// Test script for admin functionality
const BASE_URL = 'http://localhost:5002/api';

// Admin credentials (you may need to adjust these)
const ADMIN_CREDENTIALS = {
  email: 'admin@ecommerce.com',
  password: 'admin123' // You may need to adjust this
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function testAdminFunctionality() {
  console.log('🧪 Testing Admin Functionality...\n');

  try {
    // Step 1: Login as admin to get JWT token
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await api.post('/auth/login', ADMIN_CREDENTIALS);

    if (!loginResponse.data.success) {
      throw new Error('Admin login failed: ' + loginResponse.data.message);
    }

    const adminToken = loginResponse.data.data.token;
    console.log('✅ Admin login successful');
    console.log(`👤 Admin: ${loginResponse.data.data.user.name} (${loginResponse.data.data.user.email})`);

    // Set authorization header for subsequent requests
    api.defaults.headers.Authorization = `Bearer ${adminToken}`;

    // Step 2: Test fetching orders
    console.log('\n2️⃣ Testing GET /admin/orders');
    const ordersResponse = await api.get('/admin/orders?page=1&limit=5');

    if (!ordersResponse.data.success) {
      throw new Error('Failed to fetch orders: ' + ordersResponse.data.message);
    }

    console.log('✅ Orders fetched successfully');
    console.log(`📦 Found ${ordersResponse.data.data.orders.length} orders`);
    console.log(`📊 Total orders: ${ordersResponse.data.data.pagination.totalOrders}`);

    if (ordersResponse.data.data.orders.length > 0) {
      const testOrder = ordersResponse.data.data.orders[0];
      console.log(`🎯 Using order ${testOrder.orderNumber} (${testOrder._id}) for testing`);
      console.log(`📋 Current status: ${testOrder.status}`);

      // Step 3: Test order stats
      console.log('\n3️⃣ Testing GET /admin/orders/stats');
      const statsResponse = await api.get('/admin/orders/stats');

      if (!statsResponse.data.success) {
        throw new Error('Failed to fetch order stats: ' + statsResponse.data.message);
      }

      console.log('✅ Order stats fetched successfully');
      console.log(`📊 Total orders: ${statsResponse.data.data.totalOrders}`);
      console.log(`💰 Total revenue: $${statsResponse.data.data.totalRevenue}`);
      console.log('📈 Status breakdown:', statsResponse.data.data.statusBreakdown);

      // Step 4: Test order status update
      console.log('\n4️⃣ Testing PUT /admin/orders/:id/status');
      const newStatus = testOrder.status === 'pending' ? 'processing' : 'pending';
      const updateData = {
        status: newStatus,
        note: 'Test status update from admin functionality test',
        trackingNumber: 'TEST123456789'
      };

      console.log(`🔄 Updating order ${testOrder.orderNumber} from "${testOrder.status}" to "${newStatus}"`);

      const updateResponse = await api.put(`/admin/orders/${testOrder._id}/status`, updateData);

      if (!updateResponse.data.success) {
        throw new Error('Failed to update order status: ' + updateResponse.data.message);
      }

      console.log('✅ Order status updated successfully');
      console.log(`🔄 Status changed to: ${updateResponse.data.data.order.status}`);
      console.log(`📝 Note: ${updateResponse.data.data.order.notes}`);
      console.log(`🚚 Tracking: ${updateResponse.data.data.order.trackingNumber}`);

      // Step 5: Verify the update by fetching the order again
      console.log('\n5️⃣ Verifying the update...');
      const verifyResponse = await api.get('/admin/orders?page=1&limit=5');
      const updatedOrder = verifyResponse.data.data.orders.find(o => o._id === testOrder._id);

      if (updatedOrder && updatedOrder.status === newStatus) {
        console.log('✅ Order status update verified successfully');
        console.log(`📋 Confirmed status: ${updatedOrder.status}`);
      } else {
        console.log('⚠️ Order status update verification failed');
      }

    } else {
      console.log('⚠️ No orders found to test status update');
    }

    console.log('\n🎉 All admin functionality tests passed!');
    console.log('\n💡 The admin panel should now work correctly.');

  } catch (error) {
    console.error('❌ Admin functionality test failed:', error.message);

    if (error.response) {
      console.error('📋 Error details:', {
        status: error.response.status,
        data: error.response.data
      });

      if (error.response.status === 401) {
        console.log('\n💡 Authentication failed. Please check admin credentials:');
        console.log('- Email: admin@ecommerce.com');
        console.log('- Password: Check your admin user password in the database');
      }
    }
  }
}

// Run tests
if (require.main === module) {
  testAdminFunctionality();
}

module.exports = { testAdminFunctionality };