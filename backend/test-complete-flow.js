const axios = require('axios');

// Test complete order creation and status update flow
const BASE_URL = 'http://localhost:5002/api';

async function testCompleteFlow() {
  console.log('🔍 COMPLETE FLOW TEST - Order Creation + Admin Status Update\n');

  try {
    // ===== STEP 1: CREATE ORDER =====
    console.log('📦 STEP 1: CREATE ORDER');
    console.log('='.repeat(50));

    // Get a real product
    const productsResponse = await axios.get(`${BASE_URL}/products?limit=1`);
    const testProduct = productsResponse.data.data.products[0];
    console.log(`✅ Using product: ${testProduct.name} (${testProduct._id})`);

    // Create order with exact frontend payload
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
        quantity: 2,
        size: 'L',
        color: 'Blue',
        image: testProduct.images?.[0]?.url || '/placeholder-image.jpg'
      }],
      shippingAddress: {
        fullName: 'John Doe',
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        phone: '555-0123'
      },
      paymentMethod: 'COD',
      paymentId: null,
      subtotal: (testProduct.salePrice || testProduct.price) * 2,
      shipping: 8.99,
      tax: 12.50,
      discount: 0,
      total: ((testProduct.salePrice || testProduct.price) * 2) + 8.99 + 12.50
    };

    console.log('📤 Creating order...');
    const orderResponse = await axios.post(`${BASE_URL}/orders`, orderPayload);

    if (orderResponse.status === 201) {
      const createdOrder = orderResponse.data.data.order;
      console.log('✅ ORDER CREATED SUCCESSFULLY!');
      console.log(`   Order ID: ${createdOrder._id}`);
      console.log(`   Order Number: ${createdOrder.orderNumber}`);
      console.log(`   Status: ${createdOrder.status}`);
      console.log(`   Total: $${createdOrder.total}`);
      console.log(`   Items: ${createdOrder.totalItems}`);

      // ===== STEP 2: ADMIN LOGIN =====
      console.log('\\n🔑 STEP 2: ADMIN LOGIN');
      console.log('='.repeat(50));

      const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@example.com',
        password: 'admin123'
      });

      if (adminLoginResponse.data.success) {
        const adminToken = adminLoginResponse.data.data.token;
        console.log('✅ ADMIN LOGIN SUCCESSFUL!');
        console.log(`   Admin: ${adminLoginResponse.data.data.user.name}`);
        console.log(`   Role: ${adminLoginResponse.data.data.user.role}`);

        // ===== STEP 3: FETCH ORDERS AS ADMIN =====
        console.log('\\n📊 STEP 3: FETCH ORDERS AS ADMIN');
        console.log('='.repeat(50));

        const ordersResponse = await axios.get(`${BASE_URL}/admin/orders?limit=5`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (ordersResponse.data.success) {
          console.log('✅ ADMIN ORDERS FETCHED SUCCESSFULLY!');
          console.log(`   Total Orders: ${ordersResponse.data.data.pagination.totalOrders}`);
          console.log(`   Orders in Response: ${ordersResponse.data.data.orders.length}`);

          const latestOrder = ordersResponse.data.data.orders.find(o => o._id === createdOrder._id);
          if (latestOrder) {
            console.log(`   ✅ Created order found in admin list`);
            console.log(`      Customer: ${latestOrder.customer.name}`);
            console.log(`      Status: ${latestOrder.status}`);
          }
        }

        // ===== STEP 4: UPDATE ORDER STATUS =====
        console.log('\\n🔧 STEP 4: UPDATE ORDER STATUS');
        console.log('='.repeat(50));

        const statusUpdatePayload = {
          status: 'processing',
          note: 'Order is being processed by warehouse team',
          trackingNumber: 'TRK' + Date.now()
        };

        console.log('📤 Updating order status...');
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
          console.log('✅ ORDER STATUS UPDATED SUCCESSFULLY!');
          const updatedOrder = statusResponse.data.data.order;
          console.log(`   Previous Status: ${statusResponse.data.data.previousStatus}`);
          console.log(`   New Status: ${updatedOrder.status}`);
          console.log(`   Tracking Number: ${updatedOrder.trackingNumber}`);
          console.log(`   Notes: ${updatedOrder.notes}`);
          console.log(`   Status History: ${updatedOrder.statusHistory.length} entries`);

          // ===== STEP 5: VERIFY STATUS UPDATE =====
          console.log('\\n✅ STEP 5: VERIFY STATUS UPDATE');
          console.log('='.repeat(50));

          const verifyResponse = await axios.get(`${BASE_URL}/admin/orders?limit=5`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          });

          const verifiedOrder = verifyResponse.data.data.orders.find(o => o._id === createdOrder._id);
          if (verifiedOrder && verifiedOrder.status === 'processing') {
            console.log('✅ STATUS UPDATE VERIFIED IN DATABASE!');
            console.log(`   Order ${verifiedOrder.orderNumber} status: ${verifiedOrder.status}`);
          } else {
            console.log('❌ Status update not reflected in database');
          }

          // ===== STEP 6: TEST DIFFERENT STATUS UPDATES =====
          console.log('\\n🚚 STEP 6: TEST ADDITIONAL STATUS UPDATES');
          console.log('='.repeat(50));

          // Update to shipped
          const shippedUpdate = await axios.put(
            `${BASE_URL}/admin/orders/${createdOrder._id}/status`,
            {
              status: 'shipped',
              note: 'Order shipped via FedEx',
              trackingNumber: 'FDX' + Date.now()
            },
            { headers: { 'Authorization': `Bearer ${adminToken}` } }
          );

          if (shippedUpdate.status === 200) {
            console.log('✅ Updated to SHIPPED status');
            console.log(`   Tracking: ${shippedUpdate.data.data.order.trackingNumber}`);
          }

          // Update to delivered
          const deliveredUpdate = await axios.put(
            `${BASE_URL}/admin/orders/${createdOrder._id}/status`,
            {
              status: 'delivered',
              note: 'Order delivered successfully'
            },
            { headers: { 'Authorization': `Bearer ${adminToken}` } }
          );

          if (deliveredUpdate.status === 200) {
            console.log('✅ Updated to DELIVERED status');
            console.log(`   Delivered At: ${deliveredUpdate.data.data.order.deliveredAt}`);
          }

        }

      } else {
        console.log('❌ Admin login failed');
      }

    } else {
      console.log('❌ Order creation failed');
    }

  } catch (error) {
    console.error('\\n❌ COMPLETE FLOW TEST FAILED!');
    console.error('Error:', error.message);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('\\n' + '='.repeat(80));
  console.log('🎯 COMPLETE FLOW TEST FINISHED');
  console.log('='.repeat(80));
}

// Run complete flow test
if (require.main === module) {
  testCompleteFlow();
}

module.exports = { testCompleteFlow };