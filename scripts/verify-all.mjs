import path from 'path';
import fs from 'fs';
import { query, initDb } from '../server/db/index.ts';
import { runMigrations } from '../server/db/migrate.ts';
import { seedDatabase } from '../server/db/seed.ts';
import { generateToken, getJwtSecret } from '../server/middleware/auth.ts';
import bcrypt from 'bcryptjs';

console.log('====================================================');
console.log('CLASSIC FASHIONS — COMPREHENSIVE BACKEND VERIFICATION');
console.log('====================================================\n');

const testResults = [];

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testResults.push({ message, pass: true });
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testResults.push({ message, pass: false });
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runVerification() {
  // 1. Verify Node and Environment
  console.log('--- 1. Node.js & Database Engine Verification ---');
  const nodeVer = process.version;
  console.log(`  Current Node.js version: ${nodeVer}`);
  const major = parseInt(nodeVer.slice(1).split('.')[0], 10);
  assert(major >= 22, `Node.js version is >= 22 (found ${nodeVer})`);

  await initDb();
  await runMigrations();
  await seedDatabase();

  const dbPath = path.resolve('server/data/classic_fashions.db');
  assert(fs.existsSync(dbPath), `SQLite database file exists at ${dbPath}`);

  // 2. Database Schema and Seeding Verification
  console.log('\n--- 2. Database Schema & Data Integrity ---');
  const cats = await query('SELECT * FROM categories ORDER BY name ASC');
  assert(cats.rowCount === 10, `All 10 categories present in DB (found ${cats.rowCount})`);

  const prods = await query('SELECT * FROM products');
  assert(prods.rowCount >= 54, `Products present in DB (found ${prods.rowCount})`);

  // Verify product structure integrity
  const sampleProd = prods.rows.find((p) => p.product_code === 'CF-LAC-101');
  assert(sampleProd !== undefined, 'Sample product CF-LAC-101 exists in DB');
  assert(sampleProd.name.length > 0, `Product name is populated: "${sampleProd?.name}"`);
  assert(sampleProd.category_id === 'laces', `Product category is laces`);
  assert(sampleProd.images !== null, 'Product images JSON exists');
  assert(sampleProd.colours !== null, 'Product colours JSON exists');

  // Verify re-running seed does NOT duplicate products
  const beforeCount = prods.rowCount;
  await seedDatabase();
  const afterCount = (await query('SELECT COUNT(*) as c FROM products')).rows[0].c;
  assert(Number(afterCount) === beforeCount, `Seed is idempotent: product count unchanged (${afterCount})`);

  // 3. Admin Authentication & Security Verification
  console.log('\n--- 3. Admin Authentication & Security Verification ---');
  const adminUsers = await query('SELECT * FROM admin_users WHERE email = $1', ['admin@classicfashions.com']);
  assert(adminUsers.rowCount === 1, 'Default admin user exists in DB');
  const admin = adminUsers.rows[0];
  assert(admin.password_hash.startsWith('$2'), 'Admin password hash uses bcrypt ($2)');

  const passwordValid = await bcrypt.compare('ClassicAdmin2026!', admin.password_hash);
  assert(passwordValid, 'Admin bcrypt hash verifies correctly against password');

  const passwordInvalid = await bcrypt.compare('WrongPassword123!', admin.password_hash);
  assert(!passwordInvalid, 'Admin bcrypt hash correctly rejects incorrect password');

  const jwtSecret = getJwtSecret();
  assert(jwtSecret && jwtSecret.length > 10, 'JWT secret is configured and accessible');

  const testToken = generateToken({ id: admin.id, email: admin.email, role: admin.role });
  assert(typeof testToken === 'string' && testToken.split('.').length === 3, 'JWT token is properly signed and structured');

  // 4. Enquiry Submissions & Relational Persistence
  console.log('\n--- 4. Enquiry Submissions & Relational DB Persistence ---');
  const testReqCode = `CF-REQ-V-${Math.floor(100000 + Math.random() * 900000)}`;
  const testEnqId = `mr_verify_${Date.now()}`;

  // Insert Material Request Enquiry
  await query(
    `INSERT INTO customer_enquiries (
      id, reference_code, enquiry_type, customer_name, company_name,
      phone, email, city_state, preferred_contact_method, urgency,
      target_date, message, material_specs, reference_images, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      testEnqId,
      testReqCode,
      'material_request',
      'Verification Inspector',
      'Test Textiles India',
      '+91 94444 33333',
      'inspector@testtextiles.in',
      'Tiruppur, Tamil Nadu',
      'whatsapp',
      'urgent',
      '2026-11-01',
      'Urgent sample requirement for autumn collection',
      JSON.stringify({
        category: 'laces',
        materialName: 'Cotton Crochet Border Lace',
        width: '3.5 inch',
        gsm: '180 GSM',
      }),
      JSON.stringify([{ name: 'sample_swatch.jpg', sizeKb: 142 }]),
      'received',
    ]
  );

  // Insert associated item in enquiry_items
  const testItemId = `item_verify_${Date.now()}`;
  await query(
    `INSERT INTO enquiry_items (id, enquiry_id, product_name, quantity, unit, custom_notes)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [testItemId, testEnqId, 'Cotton Crochet Border Lace', '25', 'Meters', 'Sample test batch']
  );

  // Retrieve and verify
  const retrievedEnq = await query('SELECT * FROM customer_enquiries WHERE reference_code = $1', [testReqCode]);
  assert(retrievedEnq.rowCount === 1, `Material Request ${testReqCode} saved and retrieved from DB`);
  assert(retrievedEnq.rows[0].customer_name === 'Verification Inspector', 'Customer name persisted correctly');

  const retrievedItems = await query('SELECT * FROM enquiry_items WHERE enquiry_id = $1', [testEnqId]);
  assert(retrievedItems.rowCount === 1, `Enquiry item linked correctly in enquiry_items table`);
  assert(retrievedItems.rows[0].product_name === 'Cotton Crochet Border Lace', 'Linked item name verified');

  // Insert Collection Enquiry with multiple items
  const testCollCode = `CF-ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const testCollId = `coll_verify_${Date.now()}`;

  await query(
    `INSERT INTO customer_enquiries (
      id, reference_code, enquiry_type, customer_name, company_name,
      phone, email, message, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      testCollId,
      testCollCode,
      'collection',
      'Dealer Sourcing Partner',
      'Elite Garments',
      '+91 98888 77777',
      'dealer@elitegarments.com',
      'Dealer wholesale swatch package request',
      'received',
    ]
  );

  await query(
    `INSERT INTO enquiry_items (id, enquiry_id, product_code, product_name, quantity, unit, selected_colour)
     VALUES 
     ($1, $2, 'CF-LAC-101', 'Heavy Embroidered Cotton Lace', '2', 'swatches', 'White'),
     ($3, $4, 'CF-DEN-101', 'Ring Denim 12oz Heavy Twill', '1', 'swatches', 'Indigo Blue'),
     ($5, $6, 'CF-MSH-101', 'Super Soft Hexagonal Mesh', '3', 'swatches', 'Black')`,
    [
      `ci_${Date.now()}_1`, testCollId,
      `ci_${Date.now()}_2`, testCollId,
      `ci_${Date.now()}_3`, testCollId,
    ]
  );

  const retrievedColl = await query('SELECT * FROM customer_enquiries WHERE reference_code = $1', [testCollCode]);
  assert(retrievedColl.rowCount === 1, `Dealer collection enquiry ${testCollCode} persisted`);

  const collItems = await query('SELECT * FROM enquiry_items WHERE enquiry_id = $1', [testCollId]);
  assert(collItems.rowCount === 3, `All 3 collection items linked in enquiry_items table (found ${collItems.rowCount})`);

  // 5. Verify Persistence Across DB Restart
  console.log('\n--- 5. Verify Persistence Across Database Reconnect ---');
  // Re-initialize DB from file
  await initDb();
  const restartCheck = await query('SELECT * FROM customer_enquiries WHERE reference_code = $1', [testReqCode]);
  assert(restartCheck.rowCount === 1, `Persisted enquiry ${testReqCode} intact after database re-initialization`);

  const restartItemsCheck = await query('SELECT * FROM enquiry_items WHERE enquiry_id = $1', [testEnqId]);
  assert(restartItemsCheck.rowCount === 1, `Linked enquiry item intact after database re-initialization`);

  // Clean up verification records
  await query('DELETE FROM customer_enquiries WHERE id = $1', [testEnqId]);
  await query('DELETE FROM customer_enquiries WHERE id = $1', [testCollId]);
  console.log('  Cleaned up temporary test records.');

  // 6. Verify Git Ignore Safety
  console.log('\n--- 6. Git Security & Secrets Check ---');
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  assert(gitignoreContent.includes('server/data/*.db'), '.gitignore excludes database files (server/data/*.db)');
  assert(gitignoreContent.includes('.env*'), '.gitignore excludes environment secret files (.env*)');
  assert(gitignoreContent.includes('!.env.example'), '.gitignore preserves .env.example template');

  console.log('\n====================================================');
  console.log(`VERIFICATION SUMMARY: ${testResults.filter((r) => r.pass).length}/${testResults.length} CHECKS PASSED`);
  console.log('====================================================\n');
}

runVerification().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
