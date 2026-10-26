import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execRaw, initDb } from './index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('🔄 Running database migrations...');
  await initDb();
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  await execRaw(schemaSql);
  console.log('✅ Database schema verified and migrated.');
}

if (process.argv[1] === __filename) {
  runMigrations()
    .then(() => {
      console.log('Migration completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
