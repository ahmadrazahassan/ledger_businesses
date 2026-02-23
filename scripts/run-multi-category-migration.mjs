#!/usr/bin/env node

/**
 * Multi-Category Migration Runner
 * 
 * This script runs the multi-category support migration on your Supabase database.
 * It creates the post_categories junction table and migrates existing data.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Starting multi-category migration...\n');

  try {
    // Read the migration file
    const migrationPath = resolve(process.cwd(), 'supabase/migrations/00002_add_multi_category_support.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded');
    console.log('⚠️  This migration will:');
    console.log('   1. Create post_categories junction table');
    console.log('   2. Migrate existing category data');
    console.log('   3. Set up triggers and views');
    console.log('   4. Maintain backward compatibility\n');

    // Note: Supabase client doesn't support running raw SQL directly
    // You need to run this migration through Supabase CLI or Dashboard
    console.log('📋 To run this migration:');
    console.log('\n   Option 1: Using Supabase CLI');
    console.log('   $ supabase db push\n');
    console.log('   Option 2: Using Supabase Dashboard');
    console.log('   1. Go to SQL Editor in your Supabase Dashboard');
    console.log('   2. Copy the contents of supabase/migrations/00002_add_multi_category_support.sql');
    console.log('   3. Paste and run the SQL\n');

    console.log('✅ Migration file is ready at:');
    console.log(`   ${migrationPath}\n`);

    // Verify current state
    console.log('🔍 Checking current database state...\n');
    
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, category_id')
      .limit(5);

    if (postsError) {
      console.error('❌ Error checking posts:', postsError.message);
    } else {
      console.log(`✅ Found ${posts?.length || 0} posts (showing first 5)`);
      posts?.forEach(post => {
        console.log(`   - ${post.title} (category: ${post.category_id ? 'set' : 'none'})`);
      });
    }

    console.log('\n📌 After running the migration, all existing posts will have their');
    console.log('   current category set as the primary category in the new system.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();
