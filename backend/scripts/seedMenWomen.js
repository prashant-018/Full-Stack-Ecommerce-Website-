/**
 * Seed script: MEN + WOMEN products only
 *
 * - Connects to MongoDB using MONGODB_URI or local fallback
 * - Clears ONLY the products collection
 * - Inserts fresh men's and women's products
 * - Uses valid enum strings for `category` from Product schema
 * - Uses `section: 'men' | 'women'`
 * - Includes required fields from schema:
 *   - name, price, originalPrice, category, section
 *   - sizes (with stock), colors, images, sku
 * - Also includes a convenient `countInStock` field for each product
 *
 * Run with:
 *   npm run seed:menwomen
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

function buildMensProducts() {
  return [
    {
      name: 'Classic White Oxford Shirt',
      price: 79.99,
      originalPrice: 99.99,
      category: "Men's Shirts",
      section: 'men',
      countInStock: 80,
      sizes: [
        { size: 'S', stock: 15 },
        { size: 'M', stock: 25 },
        { size: 'L', stock: 20 },
        { size: 'XL', stock: 12 },
        { size: 'XXL', stock: 8 }
      ],
      colors: [
        { name: 'White', hex: '#ffffff' },
        { name: 'Light Blue', hex: '#add8e6' },
        { name: 'Navy', hex: '#000080' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop',
          alt: 'Men classic white oxford shirt',
          isPrimary: true
        }
      ],
      description:
        'Premium cotton oxford shirt with a classic fit. Perfect for office and casual wear.',
      brand: 'Everlane Men',
      material: '100% Cotton',
      care: ['Machine wash cold', 'Tumble dry low', 'Warm iron if needed'],
      features: ['Button-down collar', 'Chest pocket', 'Durable buttons'],
      sku: 'MEN-SHIRT-CLASSIC-OXFORD'
    },
    {
      name: 'Slim Fit Dark Wash Jeans',
      price: 69.99,
      originalPrice: 89.99,
      category: "Men's Jeans",
      section: 'men',
      countInStock: 73,
      sizes: [
        { size: '30', stock: 12 },
        { size: '32', stock: 18 },
        { size: '34', stock: 20 },
        { size: '36', stock: 15 },
        { size: '38', stock: 8 }
      ],
      colors: [
        { name: 'Dark Blue', hex: '#1f2937' },
        { name: 'Black', hex: '#000000' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542272605-15e56b9b3f5d?w=800&h=1000&fit=crop',
          alt: 'Men slim fit dark wash jeans',
          isPrimary: true
        }
      ],
      description:
        'Modern slim fit jeans with stretch denim for comfort and durability.',
      brand: 'Everlane Men',
      material: '98% Cotton, 2% Elastane',
      care: ['Machine wash cold', 'Wash inside out', 'Hang dry'],
      features: ['Slim fit', 'Five-pocket styling', 'Stretch denim'],
      sku: 'MEN-JEANS-SLIM-DARK'
    },
    {
      name: 'Everyday Crewneck T-Shirt',
      price: 24.99,
      originalPrice: 29.99,
      category: "Men's T-Shirts",
      section: 'men',
      countInStock: 120,
      sizes: [
        { size: 'S', stock: 20 },
        { size: 'M', stock: 35 },
        { size: 'L', stock: 30 },
        { size: 'XL', stock: 20 },
        { size: 'XXL', stock: 15 }
      ],
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#1f2937' },
        { name: 'Gray', hex: '#6b7280' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
          alt: 'Men everyday crewneck t-shirt',
          isPrimary: true
        }
      ],
      description:
        'Ultra-soft cotton crewneck t-shirt designed for everyday comfort.',
      brand: 'Everlane Men',
      material: '100% Cotton',
      care: ['Machine wash cold', 'Tumble dry low'],
      features: ['Pre-shrunk', 'Modern fit', 'Soft hand feel'],
      sku: 'MEN-TEE-EVERYDAY-CREW'
    },
    {
      name: 'Wool Blend Tailored Blazer',
      price: 199.99,
      originalPrice: 249.99,
      category: "Men's Jackets",
      section: 'men',
      countInStock: 45,
      sizes: [
        { size: 'S', stock: 8 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 12 },
        { size: 'XL', stock: 10 }
      ],
      colors: [
        { name: 'Navy', hex: '#1e3a8a' },
        { name: 'Charcoal', hex: '#374151' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop',
          alt: 'Men wool blend tailored blazer',
          isPrimary: true
        }
      ],
      description:
        'Sophisticated wool blend blazer for business and special occasions.',
      brand: 'Everlane Men',
      material: '70% Wool, 30% Polyester',
      care: ['Dry clean only'],
      features: ['Tailored fit', 'Two-button closure', 'Internal pockets'],
      sku: 'MEN-BLAZER-WOOL'
    },
    {
      name: 'Performance Chino Pants',
      price: 79.99,
      originalPrice: 89.99,
      category: "Men's Pants",
      section: 'men',
      countInStock: 90,
      sizes: [
        { size: '30', stock: 18 },
        { size: '32', stock: 24 },
        { size: '34', stock: 22 },
        { size: '36', stock: 16 },
        { size: '38', stock: 10 }
      ],
      colors: [
        { name: 'Khaki', hex: '#c3b091' },
        { name: 'Olive', hex: '#4b5563' },
        { name: 'Navy', hex: '#1f2937' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&h=1000&fit=crop',
          alt: 'Men performance chino pants',
          isPrimary: true
        }
      ],
      description:
        'Stretch chinos that move with you and keep their shape all day.',
      brand: 'Everlane Men',
      material: '97% Cotton, 3% Elastane',
      care: ['Machine wash cold', 'Tumble dry low'],
      features: ['Performance stretch', 'Tapered leg', 'Wrinkle resistant'],
      sku: 'MEN-PANTS-CHINO'
    },
    {
      name: 'Merino Wool Crew Sweater',
      price: 89.99,
      originalPrice: 109.99,
      category: "Men's Sweaters",
      section: 'men',
      countInStock: 60,
      sizes: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 20 },
        { size: 'L', stock: 18 },
        { size: 'XL', stock: 12 }
      ],
      colors: [
        { name: 'Gray', hex: '#6b7280' },
        { name: 'Navy', hex: '#1f2937' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
          alt: 'Men merino wool crew sweater',
          isPrimary: true
        }
      ],
      description:
        'Soft merino wool sweater that layers easily over shirts or tees.',
      brand: 'Everlane Men',
      material: '100% Merino Wool',
      care: ['Hand wash cold', 'Lay flat to dry'],
      features: ['Fine gauge knit', 'Ribbed cuffs and hem', 'Breathable wool'],
      sku: 'MEN-SWEATER-MERINO-CREW'
    }
  ];
}

function buildWomensProducts() {
  return [
    {
      name: 'Cashmere Crew Sweater',
      price: 129.99,
      originalPrice: 169.99,
      category: "Women's Sweaters",
      section: 'women',
      countInStock: 50,
      sizes: [
        { size: 'XS', stock: 8 },
        { size: 'S', stock: 14 },
        { size: 'M', stock: 16 },
        { size: 'L', stock: 8 },
        { size: 'XL', stock: 4 }
      ],
      colors: [
        { name: 'Cream', hex: '#f5f5dc' },
        { name: 'Black', hex: '#000000' },
        { name: 'Blush', hex: '#f9a8d4' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=800&h=1000&fit=crop',
          alt: 'Women cashmere crew sweater',
          isPrimary: true
        }
      ],
      description:
        'Luxurious cashmere crew sweater with a relaxed, flattering fit.',
      brand: 'Everlane Women',
      material: '100% Cashmere',
      care: ['Hand wash cold', 'Lay flat to dry'],
      features: ['Soft cashmere', 'Crew neckline', 'Ribbed trims'],
      sku: 'WOM-SWEATER-CASHMERE-CREW'
    },
    {
      name: 'Silk Relaxed Shirt',
      price: 98.99,
      originalPrice: 129.99,
      category: "Women's Tops",
      section: 'women',
      countInStock: 65,
      sizes: [
        { size: 'XS', stock: 10 },
        { size: 'S', stock: 18 },
        { size: 'M', stock: 20 },
        { size: 'L', stock: 12 },
        { size: 'XL', stock: 5 }
      ],
      colors: [
        { name: 'White', hex: '#ffffff' },
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#1f2937' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&h=1000&fit=crop',
          alt: 'Women silk relaxed shirt',
          isPrimary: true
        }
      ],
      description:
        'Elegant silk shirt that drapes beautifully and works for day or night.',
      brand: 'Everlane Women',
      material: '100% Silk',
      care: ['Dry clean only'],
      features: ['Relaxed fit', 'Button front', 'Curved hem'],
      sku: 'WOM-TOP-SILK-RELAXED'
    },
    {
      name: 'Midi Wrap Dress',
      price: 118.99,
      originalPrice: 149.99,
      category: "Women's Dresses",
      section: 'women',
      countInStock: 55,
      sizes: [
        { size: 'XS', stock: 8 },
        { size: 'S', stock: 16 },
        { size: 'M', stock: 16 },
        { size: 'L', stock: 10 },
        { size: 'XL', stock: 5 }
      ],
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#1f2937' },
        { name: 'Olive', hex: '#4b5563' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
          alt: 'Women midi wrap dress',
          isPrimary: true
        }
      ],
      description:
        'Flattering wrap dress with a midi length and soft drape for all-day comfort.',
      brand: 'Everlane Women',
      material: '100% Viscose',
      care: ['Machine wash cold', 'Line dry'],
      features: ['Wrap silhouette', 'Adjustable tie', 'Midi length'],
      sku: 'WOM-DRESS-MIDI-WRAP'
    },
    {
      name: 'High-Rise Skinny Jeans',
      price: 79.99,
      originalPrice: 99.99,
      category: "Women's Jeans",
      section: 'women',
      countInStock: 70,
      sizes: [
        { size: '24', stock: 10 },
        { size: '26', stock: 18 },
        { size: '28', stock: 18 },
        { size: '30', stock: 14 },
        { size: '32', stock: 10 }
      ],
      colors: [
        { name: 'Dark Wash', hex: '#111827' },
        { name: 'Black', hex: '#000000' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=1000&fit=crop',
          alt: 'Women high-rise skinny jeans',
          isPrimary: true
        }
      ],
      description:
        'High-rise skinny jeans with excellent stretch and recovery.',
      brand: 'Everlane Women',
      material: '92% Cotton, 6% Polyester, 2% Elastane',
      care: ['Machine wash cold', 'Tumble dry low'],
      features: ['High rise', 'Skinny leg', 'Stretch denim'],
      sku: 'WOM-JEANS-HIGH-RISE-SKINNY'
    },
    {
      name: 'Oversized Trench Coat',
      price: 189.99,
      originalPrice: 229.99,
      category: "Women's Jackets",
      section: 'women',
      countInStock: 40,
      sizes: [
        { size: 'XS', stock: 6 },
        { size: 'S', stock: 12 },
        { size: 'M', stock: 12 },
        { size: 'L', stock: 8 },
        { size: 'XL', stock: 2 }
      ],
      colors: [
        { name: 'Khaki', hex: '#c3b091' },
        { name: 'Olive', hex: '#4b5563' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1495121553079-4c61bcce189c?w=800&h=1000&fit=crop',
          alt: 'Women oversized trench coat',
          isPrimary: true
        }
      ],
      description:
        'Classic oversized trench coat with modern details and water-resistant fabric.',
      brand: 'Everlane Women',
      material: '65% Cotton, 35% Polyester',
      care: ['Dry clean only'],
      features: ['Double-breasted', 'Belted waist', 'Storm flap'],
      sku: 'WOM-JACKET-TRENCH-OVERSIZED'
    },
    {
      name: 'Leather Crossbody Bag',
      price: 159.99,
      originalPrice: 179.99,
      category: "Women's Accessories",
      section: 'women',
      countInStock: 75,
      sizes: [{ size: 'One Size', stock: 75 }],
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Brown', hex: '#92400e' },
        { name: 'Tan', hex: '#d97706' }
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
          alt: 'Women leather crossbody bag',
          isPrimary: true
        }
      ],
      description:
        'Structured leather crossbody bag with adjustable strap and internal organization.',
      brand: 'Everlane Women',
      material: 'Genuine Leather',
      care: ['Wipe with dry cloth', 'Store in dust bag'],
      features: ['Adjustable strap', 'Internal pockets', 'Magnetic closure'],
      sku: 'WOM-BAG-LEATHER-CROSSBODY'
    }
  ];
}

async function seedMenWomenProducts() {
  try {
    console.log('🌱 Starting MEN + WOMEN products seed...\n');

    await connectDB();

    // Clear products only
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products\n');

    const mensProducts = buildMensProducts();
    const womensProducts = buildWomensProducts();

    const allProducts = [...mensProducts, ...womensProducts];
    const inserted = await Product.insertMany(allProducts);

    const menCount = inserted.filter(p => p.section === 'men').length;
    const womenCount = inserted.filter(p => p.section === 'women').length;

    console.log(`✅ Inserted men's products: ${menCount}`);
    console.log(`✅ Inserted women's products: ${womenCount}`);
    console.log(`📊 Total products inserted: ${inserted.length}\n`);
  } catch (error) {
    console.error('❌ Error seeding MEN + WOMEN products:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

if (require.main === module) {
  seedMenWomenProducts();
}



