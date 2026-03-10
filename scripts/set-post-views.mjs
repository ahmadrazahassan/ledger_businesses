#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const RECENT_DATE = '2026-03-09';

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function setPostViews() {
  console.log('Starting post views update...\n');

  const { data: posts, error: fetchError } = await supabase
    .from('posts')
    .select('id, title, slug, view_count, published_at, created_at, status')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (fetchError) {
    console.error(`Failed to fetch posts: ${fetchError.message}`);
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log('No published posts found.');
    return;
  }

  console.log(`Found ${posts.length} published posts\n`);
  console.log('-'.repeat(95));

  let updatedCount = 0;
  let recentCount = 0;

  for (const post of posts) {
    const pubDate = post.published_at || post.created_at || '';
    const isRecent = pubDate.startsWith(RECENT_DATE);

    const newViews = isRecent
      ? randomBetween(5000, 8000)
      : randomBetween(7000, 15000);

    if (isRecent) recentCount++;

    const { error: updateError } = await supabase
      .from('posts')
      .update({ view_count: newViews })
      .eq('id', post.id);

    if (updateError) {
      console.error(`Failed: "${post.title}" - ${updateError.message}`);
    } else {
      const tag = isRecent ? '[RECENT]' : '[NORMAL]';
      console.log(
        `${tag.padEnd(9)} ${post.title.substring(0, 55).padEnd(55)} | ${String(post.view_count).padStart(6)} -> ${String(newViews).padStart(6)}`
      );
      updatedCount++;
    }
  }

  console.log('-'.repeat(95));
  console.log(`\nDone! Updated ${updatedCount} posts.`);
  console.log(`  - ${recentCount} recent posts (09/03/2026): 5,000-8,000 views`);
  console.log(`  - ${updatedCount - recentCount} other posts: 7,000-15,000 views\n`);
}

setPostViews();
