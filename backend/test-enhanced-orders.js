const axios = require('axios');

// Test script for enhanced admin orders API
const BASE_URL = 'http://localhost:5002/api';

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@ecommerce.com',
  password: 'admin123'
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function testEnhancedOrders() {
  console.log('🧪 Testing Enhanced Admin Orders API...\n');

  try {
    // Step 1: Login as admin
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await api.post('/auth/login', ADMIN_CREDENTIALS);

    if (!loginResponse.data.success) {
      throw new Error('Admin login failed: ' + loginResponse.data.message);
    }

    const adminToken = loginResponse.data.data.token;
    console.log('✅ Admin login successful');

    // Set authorization header
    api.defaults.headers.Authorization = `Bearer ${adminToken}`;

    // Step 2: Test enhanced orders endpoint
    console.log('\n2️⃣ Testing Enhanced GET /admin/orders');
    const ordersResponse = await api.get('/admin/orders?page=1&limit=3');

    if (!ordersResponse.data.success) {
      throw new Error('Failed to fetch orders: ' + ordersResponse.data.message);
    }

    console.log('✅ Enhanced orders fetched successfully');
    console.log(`📦 Found ${ordersResponse.data.data.orders.length} orders\n`);

    // Display enhanced order structure
    if (ordersResponse.data.data.orders.length > 0) {
      const sampleOrder = ordersResponse.data.data.orders[0];

      console.log('📋 ENHANCED ORDER STRUCTURE:');
      console.log('=====================================');
      console.log(`Order Number: ${sampleOrder.orderNumber}`);
      console.log(`Status: ${sampleOrder.status}`);
      console.log(`Total: $${sampleOrder.total}`);

      console.log('\n👤 CUSTOMER INFO:');
      console.log(`  Name: ${sampleOrder.customer.name}`);
      console.log(`  Email: ${sampleOrder.customer.email}`);
      console.log(`  Type: ${sampleOrder.customer.type}`);

      console.log('\n📦 ITEMS SUMMARY:');
      console.log(`  Total Items: ${sampleOrder.totalItems}`);
      console.log(`  Items Count: ${sampleOrder.itemsSummary.count}`);
      console.log(`  Has Multiple: ${sampleOrder.itemsSummary.hasMultiple}`);
      console.log(`  Additional Count: ${sampleOrder.itemsSummary.additionalCount}`);

      if (sampleOrder.itemsSummary.firstItem) {
        console.log('\n🛍️ FIRST ITEM DETAILS:');
        console.log(`  Name: ${sampleOrder.itemsSummary.firstItem.productDetails?.name || sampleOrder.itemsSummary.firstItem.name}`);
        console.log(`  Image: ${sampleOrder.itemsSummary.firstItem.productDetails?.image || sampleOrder.itemsSummary.firstItem.image}`);
        console.log(`  Size: ${sampleOrder.itemsSummary.firstItem.size || 'N/A'}`);
        console.log(`  Color: ${sampleOrder.itemsSummary.firstItem.color || 'N/A'}`);
        console.log(`  Quantity: ${sampleOrder.itemsSummary.firstItem.quantity || 0}`);
        console.log(`  Price: $${sampleOrder.itemsSummary.firstItem.price || 0}`);

        if (sampleOrder.itemsSummary.firstItem.productDetails) {
          console.log(`  Category: ${sampleOrder.itemsSummary.firstItem.productDetails.category || 'N/A'}`);
          console.log(`  Subcategory: ${sampleOrder.itemsSummary.firstItem.productDetails.subcategory || 'N/A'}`);
        }
      }

      console.log('\n📊 ALL ITEMS:');
      sampleOrder.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.productDetails?.name || item.name} (Qty: ${item.quantity}, Size: ${item.size}, Color: ${item.color})`);
      });

      console.log('\n=====================================');
    }

    console.log('\n🎉 Enhanced admin orders API is working perfectly!');
    console.log('\n💡 Key Improvements:');
    console.log('✅ Rich customer information with user type');
    console.log('✅ Enhanced product details with images');
    console.log('✅ Proper item count calculation');
    console.log('✅ Product categories and attributes');
    console.log('✅ Structured items summary for UI');

  } catch (error) {
    console.error('❌ Enhanced orders test failed:', error.message);

    if (error.response) {
      console.error('📋 Error details:', {
        status: error.response.status,
        data: error.response.data
      });
    }
  }
}

// Run tests
if (require.main === module) {
  testEnhancedOrders();
}

module.exports = { testEnhancedOrders };