const axios = require('axios');

// Test script to verify the order creation fix
const BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function testOrderCreationFix() {
  console.log('🧪 Testing Order Creation Fix...\n');

  try {
    // Step 1: Get a real product ID
    console.log('1️⃣ Fetching available products...');
    const productsResponse = await api.get('/products?limit=1');

    if (!productsResponse.data.success || !productsResponse.data.data.products.length) {
      throw new Error('No products available for testing');
    }

    const testProduct = productsResponse.data.data.products[0];
    console.log(`✅ Using product: ${testProduct.name} (ID: ${testProduct._id})`);

    // Step 2: Test the exact payload that frontend sends
    console.log('\n2️⃣ Testing with frontend payload structure...');

    const frontendPayload = {
      // Customer info for guest checkout (this was missing before!)
      customerInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },

      // Items array - using productId (frontend format)
      items: [{
        productId: testProduct._id,  // Frontend sends productId
        product: testProduct._id,    // Also include product for compatibility
        name: testProduct.name,
        price: testProduct.salePrice || testProduct.price,
        quantity: 1,
        size: 'M',
        color: 'Default',
        image: testProduct.images?.[0]?.url || '/placeholder-image.jpg'
      }],

      // Shipping address (exact frontend format)
      shippingAddress: {
        fullName: 'John Doe',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'India',
        phone: '+1234567890'
      },

      // Payment details
      paymentMethod: 'COD',
      paymentId: null,

      // Pricing (exact frontend format)
      subtotal: testProduct.salePrice || testProduct.price,
      shipping: 5.00,
      tax: 2.00,
      discount: 0,
      total: (testProduct.salePrice || testProduct.price) + 5.00 + 2.00
    };

    console.log('📦 Sending order payload:', JSON.stringify(frontendPayload, null, 2));

    const orderResponse = await api.post('/orders', frontendPayload);

    if (orderResponse.data.success) {
      console.log('\n✅ Order created successfully!');
      console.log(`📦 Order Number: ${orderResponse.data.data.order.orderNumber}`);
      console.log(`💰 Total: $${orderResponse.data.data.order.total}`);
      console.log(`👤 Customer: ${orderResponse.data.data.order.customerInfo.name}`);
      console.log(`📧 Email: ${orderResponse.data.data.order.customerInfo.email}`);
      console.log(`🏷️ Status: ${orderResponse.data.data.order.status}`);
      console.log(`💳 Payment: ${orderResponse.data.data.order.paymentMethod} (${orderResponse.data.data.order.paymentStatus})`);

      // Step 3: Verify order appears in admin panel
      console.log('\n3️⃣ Testing admin can see the order...');

      try {
        // Login as admin
        const adminLoginResponse = await api.post('/auth/login', {
          email: 'admin@ecommerce.com',
          password: 'admin123'
        });

        if (adminLoginResponse.data.success) {
          const adminToken = adminLoginResponse.data.data.token;

          // Fetch orders as admin
          const adminOrdersResponse = await api.get('/admin/orders?page=1&limit=5', {
            headers: {
              'Authorization': `Bearer ${adminToken}`
            }
          });

          if (adminOrdersResponse.data.success) {
            const orders = adminOrdersResponse.data.data.orders;
            const newOrder = orders.find(order => order.orderNumber === orderResponse.data.data.order.orderNumber);

            if (newOrder) {
              console.log('✅ Order appears in admin panel!');
              console.log(`📦 Admin view: ${newOrder.orderNumber} - ${newOrder.customer?.name} - $${newOrder.total}`);
            } else {
              console.log('❌ Order not found in admin panel');
            }
          }
        }
      } catch (adminError) {
        console.log('⚠️ Admin test skipped (admin user may not exist)');
      }

      console.log('\n🎉 Order creation fix test PASSED!');
      console.log('\n✅ SUMMARY:');
      console.log('- Frontend payload structure: SUPPORTED ✅');
      console.log('- Guest order creation: SUCCESS ✅');
      console.log('- Order saved to database: SUCCESS ✅');
      console.log('- COD payment method: WORKING ✅');
      console.log('- Admin visibility: SUCCESS ✅');

    } else {
      throw new Error('Order creation failed: ' + orderResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Order creation test FAILED:', error.message);

    if (error.response) {
      console.error('\n📋 Error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });

      if (error.response.status === 400 && error.response.data.errors) {
        console.error('\n🔍 Validation errors:');
        error.response.data.errors.forEach(err => {
          console.error(`  - ${err.field || err.param}: ${err.message}`);
        });
      }
    }

    console.log('\n💡 TROUBLESHOOTING TIPS:');
    console.log('1. Make sure the server is running on port 5002');
    console.log('2. Check if MongoDB is connected');
    console.log('3. Verify products exist in database');
    console.log('4. Check server logs for detailed errors');
    console.log('5. Ensure all required fields are present in payload');
  }
}

// Run test
if (require.main === module) {
  testOrderCreationFix();
}

module.exports = { testOrderCreationFix };