#!/usr/bin/env node

/**
 * Sovereign Ink — Database Migration Runner
 * 
 * Runs the SQL migration against your Supabase project.
 * 
 * Usage:
 *   node scripts/run-migration.mjs
 * 
 * Requires .env.local to be configured with:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 * 
 * If this script doesn't work (some Supabase plans restrict the SQL API),
 * copy the contents of supabase/migrations/00001_initial_schema.sql
 * into the Supabase Dashboard → SQL Editor → New Query → Run.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env from .env.local
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...valueParts] = trimmed.split('=');
  env[key.trim()] = valueParts.join('=').trim();
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];

console.log(`\n🏗️  Sovereign Ink — Database Migration Runner`);
console.log(`   Project: ${projectRef}`);
console.log(`   URL: ${SUPABASE_URL}\n`);

// Read migration SQL
const sqlPath = resolve(__dirname, '..', 'supabase', 'migrations', '00001_initial_schema.sql');
const sql = readFileSync(sqlPath, 'utf-8');

console.log(`📄 Migration file: ${sqlPath}`);
console.log(`   Size: ${(sql.length / 1024).toFixed(1)} KB\n`);

// Split SQL into individual statements for better error handling
// This splits on semicolons that are NOT inside $$ blocks
function splitSqlStatements(sqlText) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  
  const lines = sqlText.split('\n');
  for (const line of lines) {
    // Skip comment-only lines at the top level
    const trimmed = line.trim();
    if (!inDollarQuote && (trimmed.startsWith('--') || trimmed === '')) {
      current += line + '\n';
      continue;
    }
    
    // Track $$ blocks
    const dollarCount = (line.match(/\$\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      inDollarQuote = !inDollarQuote;
    }
    
    current += line + '\n';
    
    // If we're not in a dollar quote and line ends with ;
    if (!inDollarQuote && trimmed.endsWith(';')) {
      const stmt = current.trim();
      if (stmt && !stmt.match(/^--/)) {
        statements.push(stmt);
      }
      current = '';
    }
  }
  
  // Don't forget any remaining content
  if (current.trim()) {
    statements.push(current.trim());
  }
  
  return statements;
}

// Try running the full SQL first via the Supabase pg endpoint
async function runFullMigration() {
  // Method 1: Try Supabase pg-meta endpoint
  const endpoints = [
    `${SUPABASE_URL}/rest/v1/rpc/`,
  ];
  
  // Since the above endpoints may not support raw SQL,
  // we'll use the createClient approach with individual operations
  console.log('🔄 Running migration via Supabase API...\n');
  
  // Import the Supabase client dynamically
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Test connection first
  console.log('   Testing connection...');
  const { error: testError } = await supabase.from('_test_connection_').select('*').limit(1);
  if (testError && !testError.message.includes('does not exist') && !testError.message.includes('relation')) {
    console.error(`   ❌ Connection failed: ${testError.message}`);
    console.log('\n📋 ALTERNATIVE: Run the SQL manually in the Supabase Dashboard:');
    console.log('   1. Go to https://supabase.com/dashboard/project/' + projectRef + '/sql');
    console.log('   2. Click "New Query"');
    console.log('   3. Paste the contents of: supabase/migrations/00001_initial_schema.sql');
    console.log('   4. Click "Run"\n');
    process.exit(1);
  }
  console.log('   ✅ Connection successful\n');
  
  // Since we can't run raw SQL through the JS client,
  // provide instructions for manual execution
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  The Supabase JS client cannot execute DDL (CREATE TABLE, etc.).');
  console.log('  Please run the migration manually:');
  console.log('');
  console.log('  📋 OPTION 1 — Supabase Dashboard SQL Editor (recommended):');
  console.log(`     https://supabase.com/dashboard/project/${projectRef}/sql`);
  console.log('     → New Query → Paste SQL → Run');
  console.log('');
  console.log('  📋 OPTION 2 — Supabase CLI:');
  console.log('     npx supabase login');
  console.log(`     npx supabase link --project-ref ${projectRef}`);
  console.log('     npx supabase db push');
  console.log('');
  console.log('  📋 OPTION 3 — Direct PostgreSQL (psql):');
  console.log(`     psql "postgresql://postgres:YOUR_DB_PASSWORD@db.${projectRef}.supabase.co:5432/postgres" -f supabase/migrations/00001_initial_schema.sql`);
  console.log('');
  console.log('  Migration file: supabase/migrations/00001_initial_schema.sql');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Verify if tables already exist
  console.log('\n🔍 Checking if tables already exist...\n');
  
  const tables = ['authors', 'categories', 'posts', 'banners', 'newsletter_subscribers'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`   ❌ ${table} — not found (${error.message.slice(0, 60)})`);
    } else {
      console.log(`   ✅ ${table} — exists`);
    }
  }
  
  console.log('');
}

runFullMigration().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
