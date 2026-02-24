#!/usr/bin/env node

/**
 * Boost Low View Posts Script
 * 
 * This script updates posts with 0 or low views to have realistic
 * view counts in the 30-40k range.
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
 * Generate random view count between 30k-40k
 */
function generateViewCount() {
  // Random number between 30,000 and 40,000
  return Math.floor(Math.random() * 10000) + 30000;
}

async function boostLowViewPosts() {
  console.log('🚀 Starting low view posts boost...\n');

  try {
    // Fetch all published posts
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, slug, view_count, status')
      .eq('status', 'published')
      .order('view_count', { ascending: true });

    if (fetchError) {
      throw new Error(`Failed to fetch posts: ${fetchError.message}`);
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️  No published posts found');
      return;
    }

    console.log(`📊 Found ${posts.length} published posts\n`);

    // Filter posts with low views (less than 10k)
    const lowViewPosts = posts.filter(post => post.view_count < 10000);

    if (lowViewPosts.length === 0) {
      console.log('✅ All posts already have good view counts (10k+)');
      return;
    }

    console.log(`📈 Found ${lowViewPosts.length} posts with low views (< 10k)\n`);
    console.log('─'.repeat(90));

    const updates = [];

    // Update each low-view post
    for (const post of lowViewPosts) {
      const newViews = generateViewCount();
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({ view_count: newViews })
        .eq('id', post.id);

      if (updateError) {
        console.error(`❌ Failed to update "${post.title}": ${updateError.message}`);
      } else {
        const change = newViews - post.view_count;
        updates.push({
          title: post.title,
          oldViews: post.view_count,
          newViews: newViews,
          change: change
        });
        console.log(`✅ ${post.title.substring(0, 55).padEnd(55)} | ${String(post.view_count).padStart(6)} → ${String(newViews).padStart(6)} (+${change.toLocaleString()})`);
      }
    }

    console.log('─'.repeat(90));

    // Calculate statistics
    const totalOldViews = updates.reduce((sum, u) => sum + u.oldViews, 0);
    const totalNewViews = updates.reduce((sum, u) => sum + u.newViews, 0);
    const totalIncrease = totalNewViews - totalOldViews;

    console.log(`\n✨ Boost complete!`);
    console.log(`📊 Updated ${updates.length} posts`);
    console.log(`📈 Total views added: ${totalIncrease.toLocaleString()}`);
    console.log(`🎯 Average new views per post: ${Math.floor(totalNewViews / updates.length).toLocaleString()}`);
    console.log(`📉 Old total: ${totalOldViews.toLocaleString()}`);
    console.log(`📈 New total: ${totalNewViews.toLocaleString()}\n`);

    // Show overall stats
    const { data: allPosts } = await supabase
      .from('posts')
      .select('view_count')
      .eq('status', 'published');

    if (allPosts) {
      const grandTotal = allPosts.reduce((sum, p) => sum + p.view_count, 0);
      console.log(`🌟 Grand total views across all posts: ${grandTotal.toLocaleString()}\n`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
boostLowViewPosts();
