/**
 * One-time migration script to backfill Product.slug for existing products.
 *
 * SAFETY:
 * - Does NOT modify products that already have a non-empty slug.
 * - Only sets slug on products where slug is missing or empty.
 * - Uses the same slugify logic as the Product model.
 * - Ensures uniqueness by appending -1, -2, ... if needed.
 *
 * USAGE:
 *   node scripts/migrateProductSlugs.js --dry-run   # see what would change
 *   node scripts/migrateProductSlugs.js            # apply changes
 */

/* eslint-disable no-console */

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');
const slugify = require('../utils/slugify');

const isDryRun = process.argv.includes('--dry-run');

async function connect() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

  console.log(`Connecting to MongoDB at ${mongoURI} ...`);
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to MongoDB');
}

async function migrateSlugs() {
  await connect();

  try {
    const products = await Product.find({}).select('name slug sku').lean();
    console.log(`Found ${products.length} products total.`);

    let updatedCount = 0;

    for (const doc of products) {
      // Skip products that already have a non-empty slug
      if (doc.slug && String(doc.slug).trim() !== '') {
        continue;
      }

      if (!doc.name) {
        console.warn(`⚠️  Product ${doc._id} has no name; skipping slug generation.`);
        continue;
      }

      const baseSlug = slugify(doc.name);
      if (!baseSlug) {
        console.warn(`⚠️  Product ${doc._id} produced empty base slug; skipping.`);
        continue;
      }

      let slug = baseSlug;
      let counter = 1;

      // Ensure uniqueness across DB, ignoring current document
      // NOTE: We query the DB each time to avoid conflicting with existing docs.
      // For typical dataset sizes this is acceptable for a one-time migration.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const existing = await Product.exists({
          slug,
          _id: { $ne: doc._id },
        });

        if (!existing) break;

        slug = `${baseSlug}-${counter++}`;
      }

      updatedCount += 1;

      if (isDryRun) {
        console.log(
          `DRY-RUN: Would set slug for product ${doc._id} (name="${doc.name}") -> "${slug}"`
        );
      } else {
        await Product.updateOne(
          { _id: doc._id },
          { $set: { slug } }
        );
        console.log(
          `Updated product ${doc._id} (name="${doc.name}") with slug "${slug}"`
        );
      }
    }

    console.log(
      isDryRun
        ? `DRY-RUN complete. ${updatedCount} products would be updated.`
        : `Migration complete. ${updatedCount} products updated.`
    );
  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

migrateSlugs();


