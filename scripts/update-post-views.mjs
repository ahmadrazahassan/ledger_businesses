#!/usr/bin/env node

/**
 * Update Post Views Script
 * 
 * This script updates all published posts with realistic random view counts
 * ensuring the total exceeds 600K+ views with a natural distribution.
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
 * Generate realistic view count distribution
 * - Few viral posts (50K-100K views)
 * - Some popular posts (20K-50K views)
 * - Many moderate posts (5K-20K views)
 * - Some newer posts (1K-5K views)
 */
function generateViewCount(index, total) {
  const random = Math.random();
  
  // 5% chance of viral post (50K-100K)
  if (random < 0.05) {
    return Math.floor(Math.random() * 50000) + 50000;
  }
  
  // 15% chance of very popular post (20K-50K)
  if (random < 0.20) {
    return Math.floor(Math.random() * 30000) + 20000;
  }
  
  // 30% chance of popular post (10K-20K)
  if (random < 0.50) {
    return Math.floor(Math.random() * 10000) + 10000;
  }
  
  // 30% chance of moderate post (5K-10K)
  if (random < 0.80) {
    return Math.floor(Math.random() * 5000) + 5000;
  }
  
  // 20% chance of newer post (1K-5K)
  return Math.floor(Math.random() * 4000) + 1000;
}

async function updatePostViews() {
  console.log('🚀 Starting post views update...\n');

  try {
    // Fetch all published posts
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, slug, view_count')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw new Error(`Failed to fetch posts: ${fetchError.message}`);
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️  No published posts found');
      return;
    }

    console.log(`📊 Found ${posts.length} published posts\n`);

    // Generate view counts
    const updates = posts.map((post, index) => ({
      id: post.id,
      title: post.title,
      oldViews: post.view_count,
      newViews: generateViewCount(index, posts.length),
    }));

    // Calculate total views
    const totalViews = updates.reduce((sum, u) => sum + u.newViews, 0);
    
    // If total is less than 600K, boost some posts
    let adjustedUpdates = [...updates];
    if (totalViews < 600000) {
      const deficit = 600000 - totalViews;
      const boostPerPost = Math.ceil(deficit / Math.min(5, posts.length));
      
      console.log(`📈 Boosting views to reach 600K+ target (adding ${deficit.toLocaleString()} views)\n`);
      
      // Boost the top posts
      for (let i = 0; i < Math.min(5, posts.length); i++) {
        adjustedUpdates[i].newViews += boostPerPost;
      }
    }

    const finalTotal = adjustedUpdates.reduce((sum, u) => sum + u.newViews, 0);

    console.log('📝 Updating posts with new view counts:\n');
    console.log('─'.repeat(80));

    // Update each post
    for (const update of adjustedUpdates) {
      const { error: updateError } = await supabase
        .from('posts')
        .update({ view_count: update.newViews })
        .eq('id', update.id);

      if (updateError) {
        console.error(`❌ Failed to update "${update.title}": ${updateError.message}`);
      } else {
        const change = update.newViews - update.oldViews;
        const changeStr = change >= 0 ? `+${change.toLocaleString()}` : change.toLocaleString();
        console.log(`✅ ${update.title.substring(0, 50).padEnd(50)} | ${update.newViews.toLocaleString().padStart(8)} views (${changeStr})`);
      }
    }

    console.log('─'.repeat(80));
    console.log(`\n✨ Update complete!`);
    console.log(`📊 Total views across all posts: ${finalTotal.toLocaleString()}`);
    console.log(`📈 Average views per post: ${Math.floor(finalTotal / posts.length).toLocaleString()}`);
    console.log(`🏆 Highest views: ${Math.max(...adjustedUpdates.map(u => u.newViews)).toLocaleString()}`);
    console.log(`📉 Lowest views: ${Math.min(...adjustedUpdates.map(u => u.newViews)).toLocaleString()}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
updatePostViews();
