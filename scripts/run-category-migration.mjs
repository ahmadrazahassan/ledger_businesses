import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env from .env.local
const envPath = resolve(__dirname, '..', '.env.local');
let envContent = '';
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch (e) {
  console.error('❌ Could not read .env.local');
  process.exit(1);
}

const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...valueParts] = trimmed.split('=');
  env[key.trim()] = valueParts.join('=').trim();
}

const DATABASE_URL = env.DATABASE_URL || env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL or POSTGRES_URL in .env.local');
  console.log('Please add your Supabase connection string to .env.local:');
  console.log('DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"');
  process.exit(1);
}

console.log(`\n🏗️  Sovereign Ink — Category Migration Runner`);

// Read migration SQL
const sqlPath = resolve(__dirname, '..', 'supabase', 'migrations', 'update_categories.sql');
const sql = readFileSync(sqlPath, 'utf-8');

console.log(`📄 Migration file: ${sqlPath}`);
console.log(`   Size: ${(sql.length / 1024).toFixed(1)} KB\n`);

async function runMigration() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Supabase requires SSL
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    console.log('🚀 Executing migration...');
    await client.query(sql);
    console.log('✅ Migration executed successfully');
    
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
