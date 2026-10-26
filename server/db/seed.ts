import bcrypt from 'bcryptjs';
import { query } from './index.ts';
import { categories, products } from '../../src/data/products.ts';
import { runMigrations } from './migrate.ts';

export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Ensure migrations are run first
  await runMigrations();

  // 1. Seed Categories
  console.log(`Checking categories (found ${categories.length} source categories)...`);
  for (const cat of categories) {
    const existing = await query('SELECT id FROM categories WHERE id = $1', [cat.id]);
    if (existing.rowCount === 0) {
      await query(
        `INSERT INTO categories (id, name, tagline, description, subcategories, pattern_type, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          cat.id,
          cat.name,
          cat.tagline || '',
          cat.description || '',
          JSON.stringify(cat.subcategories || []),
          cat.patternType || '',
          cat.image || '',
        ]
      );
    }
  }
  console.log('✅ Categories seeded.');

  // 2. Seed Products
  console.log(`Checking products (found ${products.length} source products)...`);
  let insertedCount = 0;
  for (const p of products) {
    const existing = await query('SELECT id FROM products WHERE id = $1', [p.id]);
    if (existing.rowCount === 0) {
      await query(
        `INSERT INTO products (
          id, product_code, name, category_id, category_label, subcategory,
          fabric_weave_type, quality, yarn_construction, width, gsm, weave, selvage, standard, loom,
          description, short_description, full_description, images, image_alt, colours, sizes,
          fabric, price, availability, active, pattern_type, specifications, applications,
          customization_note, enquiry_enabled, is_service, featured
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22,
          $23, $24, $25, $26, $27, $28, $29,
          $30, $31, $32, $33
        )`,
        [
          p.id,
          p.productCode,
          p.name,
          p.category,
          p.categoryLabel,
          p.subcategory || '',
          p.fabricWeaveType || '',
          p.quality || '',
          p.yarnConstruction || '',
          p.width || '',
          p.gsm || '',
          p.weave || '',
          p.selvage || '',
          p.standard || '',
          p.loom || '',
          p.description || '',
          p.shortDescription || '',
          p.fullDescription || '',
          JSON.stringify(p.images || []),
          p.imageAlt || '',
          JSON.stringify(p.colours || []),
          JSON.stringify(p.sizes || []),
          p.fabric || '',
          p.price || '',
          p.availability || 'Available on Order',
          p.active !== false ? true : false,
          p.patternType || '',
          p.specifications || '',
          JSON.stringify(p.applications || []),
          p.customizationNote || '',
          p.enquiryEnabled !== false ? true : false,
          p.isService === true ? true : false,
          p.featured === true ? true : false,
        ]
      );
      insertedCount++;
    }
  }
  console.log(`✅ Products seeded (${insertedCount} new products inserted).`);

  // 3. Seed Default Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@classicfashions.com';
  const adminPass = process.env.ADMIN_PASSWORD;

  if (process.env.NODE_ENV === 'production' && !adminPass) {
    console.warn('⚠️ [SECURITY] ADMIN_PASSWORD environment variable not set in production. Skipping default admin creation.');
    return;
  }

  const effectivePassword = adminPass || 'ClassicAdmin2026!';
  const existingAdmin = await query('SELECT id FROM admin_users WHERE email = $1', [adminEmail]);

  if (existingAdmin.rowCount === 0) {
    const passwordHash = await bcrypt.hash(effectivePassword, 10);
    await query(
      `INSERT INTO admin_users (id, email, password_hash, full_name, role, active)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['admin-default-1', adminEmail, passwordHash, 'Classic Fashions Admin', 'admin', true]
    );
    console.log(`✅ Default admin created (${adminEmail})`);
  } else {
    console.log(`Admin user already exists (${adminEmail})`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
