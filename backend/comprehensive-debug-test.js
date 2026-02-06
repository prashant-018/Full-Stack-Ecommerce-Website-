const axios = require('axios');

// Comprehensive test for both order creation and status update
const BASE_URL = 'http://localhost:5002/api';

async function comprehensiveDebugTest() {
  console.log('🔍 COMPREHENSIVE DEBUG TEST - Order Creation & Status Update\n');

  try {
    // ===== TEST 1: ORDER CREATION =====
    console.log('📦 TEST 1: ORDER CREATION');
    console.log('='.repeat(50));

    // Get a real product first
    const productsResponse = await axios.get(`${BASE_URL}/products?limit=1`);
    const testProduct = productsResponse.data.data.products[0];
    console.log(`✅ Using product: ${testProduct.name} (${testProduct._id})`);

    // Test order creation with exact frontend payload structure
    const orderPayload = {
      customerInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-0123'
      },
      items: [{
        productId: testProduct._id,
        product: testProduct._id,
        name: testProduct.name,
        price: testProduct.salePrice || testProduct.price,
        quantity: 1,
        size: 'M',
        color: 'Default',
        image: testProduct.images?.[0]?.url || '/placeholder-image.jpg'
      }],
      shippingAddress: {
        fullName: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'India',
        phone: '555-0123'
      },
      paymentMethod: 'COD',
      paymentId: null,
      subtotal: testProduct.salePrice || testProduct.price,
      shipping: 5.99,
      tax: 8.50,
      discount: 0,
      total: (testProduct.salePrice || testProduct.price) + 5.99 + 8.50
    };

    console.log('📤 Sending order creation request...');

    const orderResponse = await axios.post(`${BASE_URL}/orders`, orderPayload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (orderResponse.status === 201) {
      console.log('✅ ORDER CREATION SUCCESS!');
      const createdOrder = orderResponse.data.data.order;
      console.log(`   Order ID: ${createdOrder._id}`);
      console.log(`   Order Number: ${createdOrder.orderNumber}`);
      console.log(`   Status: ${createdOrder.status}`);
      console.log(`   Total: $${createdOrder.total}`);
      console.log(`   Payment: ${createdOrder.paymentMethod}`);

      // ===== TEST 2: ADMIN ORDER STATUS UPDATE =====
      console.log('\\n🔧 TEST 2: ADMIN ORDER STATUS UPDATE');
      console.log('='.repeat(50));

      // First, we need to get an admin token
      console.log('🔑 Getting admin authentication...');

      // Try to login as admin (you may need to adjust credentials)
      try {
        const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: 'admin@example.com', // Adjust as needed
          password: 'admin123' // Adjust as needed
        });

        if (adminLoginResponse.data.success) {
          const adminToken = adminLoginResponse.data.data.token;
          console.log('✅ Admin authentication successful');

          // Test status update
          const statusUpdatePayload = {
            status: 'processing',
            note: 'Order is being processed',
            trackingNumber: 'TRK123456789'
          };

          console.log('📤 Sending status update request...');

          const statusResponse = await axios.put(
            `${BASE_URL}/admin/orders/${createdOrder._id}/status`,
            statusUpdatePayload,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
              }
            }
          );

          if (statusResponse.status === 200) {
            console.log('✅ STATUS UPDATE SUCCESS!');
            console.log(`   New Status: ${statusResponse.data.data.order.status}`);
            console.log(`   Tracking Number: ${statusResponse.data.data.order.trackingNumber}`);
            console.log(`   Notes: ${statusResponse.data.data.order.notes}`);
          }

        } else {
          console.log('❌ Admin login failed - testing status update without auth');

          // Test without auth to see the error
          try {
            await axios.put(
              `${BASE_URL}/admin/orders/${createdOrder._id}/status`,
              { status: 'processing', note: 'Test note' }
            );
          } catch (authError) {
            console.log('✅ Correctly requires authentication:', authError.response?.status);
          }
        }

      } catch (loginError) {
        console.log('❌ Admin login not available - testing status update without auth');

        // Test without auth to see the error
        try {
          await axios.put(
            `${BASE_URL}/admin/orders/${createdOrder._id}/status`,
            { status: 'processing', note: 'Test note' }
          );
        } catch (authError) {
          console.log('✅ Correctly requires authentication:', authError.response?.status);
        }
      }

      // ===== TEST 3: VERIFY ORDER IN DATABASE =====
      console.log('\\n📊 TEST 3: VERIFY ORDER IN DATABASE');
      console.log('='.repeat(50));

      // Try to fetch the order back
      try {
        const fetchResponse = await axios.get(`${BASE_URL}/admin/orders?limit=1`);
        console.log('❌ Admin orders endpoint accessible without auth (security issue)');
      } catch (fetchError) {
        console.log('✅ Admin orders endpoint correctly requires authentication');
      }

    }

  } catch (error) {
    console.error('\\n❌ TEST FAILED!');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);

    if (error.response) {
      console.error('\\n📋 Response Details:');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));

      if (error.response.status === 400) {
        console.log('\\n🔍 400 Bad Request Analysis:');
        const data = error.response.data;

        if (data.errors && Array.isArray(data.errors)) {
          console.log('\\n❌ Validation Errors:');
          data.errors.forEach((err, index) => {
            console.log(`  ${index + 1}. Field: ${err.field}`);
            console.log(`     Message: ${err.message}`);
            console.log(`     Value: ${JSON.stringify(err.value)}`);
          });
        }

        if (data.message) {
          console.log('\\n❌ Error Message:', data.message);
        }
      }
    }
  }

  console.log('\\n' + '='.repeat(80));
  console.log('🎯 COMPREHENSIVE TEST COMPLETED');
  console.log('='.repeat(80));
}

// Run comprehensive test
if (require.main === module) {
  comprehensiveDebugTest();
}

module.exports = { comprehensiveDebugTest };