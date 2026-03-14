#!/usr/bin/env node

/**
 * Boost Latest Posts Script
 * 
 * Sets random view counts (7,000–15,000) on posts
 * published between March 9–14, 2026.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

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

/**
 * Generate random view count between 7,000 and 15,000
 */
function generateViewCount() {
  return Math.floor(Math.random() * 8001) + 7000; // 7000 to 15000 inclusive
}

async function boostLatestPosts() {
  console.log('🚀 Boosting views for posts published March 9–14, 2026...\n');

  try {
    // Fetch posts published between 2026-03-09 and 2026-03-14 (inclusive)
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, slug, view_count, published_at, status')
      .gte('published_at', '2026-03-09T00:00:00')
      .lte('published_at', '2026-03-14T23:59:59')
      .order('published_at', { ascending: false });

    if (fetchError) {
      throw new Error(`Failed to fetch posts: ${fetchError.message}`);
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️  No posts found published between March 9–14, 2026');
      return;
    }

    console.log(`📊 Found ${posts.length} posts in the date range\n`);
    console.log('─'.repeat(100));

    const updates = [];

    for (const post of posts) {
      const newViews = generateViewCount();

      const { error: updateError } = await supabase
        .from('posts')
        .update({ view_count: newViews })
        .eq('id', post.id);

      if (updateError) {
        console.error(`❌ Failed to update "${post.title}": ${updateError.message}`);
      } else {
        const change = newViews - (post.view_count || 0);
        updates.push({
          title: post.title,
          oldViews: post.view_count || 0,
          newViews,
          change,
          publishedAt: post.published_at,
          status: post.status,
        });
        const dateStr = new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const changeStr = change >= 0 ? `+${change.toLocaleString()}` : change.toLocaleString();
        console.log(
          `✅ [${dateStr}] ${post.title.substring(0, 50).padEnd(50)} | ${String(post.view_count || 0).padStart(6)} → ${String(newViews).padStart(6)} (${changeStr})`
        );
      }
    }

    console.log('─'.repeat(100));

    // Statistics
    const totalOld = updates.reduce((sum, u) => sum + u.oldViews, 0);
    const totalNew = updates.reduce((sum, u) => sum + u.newViews, 0);

    console.log(`\n✨ Boost complete!`);
    console.log(`📊 Updated ${updates.length} posts`);
    console.log(`📈 Total old views: ${totalOld.toLocaleString()}`);
    console.log(`📈 Total new views: ${totalNew.toLocaleString()}`);
    console.log(`🎯 Average new views: ${Math.floor(totalNew / updates.length).toLocaleString()}`);
    console.log(`📉 Min views: ${Math.min(...updates.map(u => u.newViews)).toLocaleString()}`);
    console.log(`📈 Max views: ${Math.max(...updates.map(u => u.newViews)).toLocaleString()}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run
boostLatestPosts();
