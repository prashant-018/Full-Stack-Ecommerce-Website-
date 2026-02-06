const axios = require('axios');

// Debug test to simulate exact frontend request
const BASE_URL = 'http://localhost:5002/api';

async function debugOrderTest() {
  console.log('🔍 Debug Order Test - Simulating Frontend Request...\n');

  try {
    // Get a real product first
    const productsResponse = await axios.get(`${BASE_URL}/products?limit=1`);
    const testProduct = productsResponse.data.data.products[0];
    console.log(`✅ Using product: ${testProduct.name} (${testProduct._id})`);

    // Exact payload that PaymentOptions.jsx sends
    const frontendPayload = {
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
      shipping: 0,
      tax: 0,
      discount: 0,
      total: testProduct.salePrice || testProduct.price
    };

    console.log('📤 Frontend payload structure:');
    console.log(JSON.stringify(frontendPayload, null, 2));

    console.log('\\n📤 Sending POST request to /api/orders...');

    const response = await axios.post(`${BASE_URL}/orders`, frontendPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 201) {
      console.log('\\n🎉 SUCCESS! Order created successfully!');
      console.log('Order Number:', response.data.data.order.orderNumber);
      console.log('Order ID:', response.data.data.order._id);
      console.log('Total:', response.data.data.order.total);
      console.log('Status:', response.data.data.order.status);
    }

  } catch (error) {
    console.error('\\n❌ DEBUG TEST FAILED!');
    console.error('Error:', error.message);

    if (error.response) {
      console.error('\\n📋 Response Details:');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));

      if (error.response.status === 400) {
        console.log('\\n🔍 400 Bad Request Analysis:');
        if (error.response.data.errors) {
          console.log('Validation Errors:');
          error.response.data.errors.forEach(err => {
            console.log(`  - ${err.field}: ${err.message} (value: ${err.value})`);
          });
        }
        if (error.response.data.message) {
          console.log('Error Message:', error.response.data.message);
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
  }
}

// Run debug test
if (require.main === module) {
  debugOrderTest();
}

module.exports = { debugOrderTest };