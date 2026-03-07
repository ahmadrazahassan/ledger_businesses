import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env
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
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function updateAuthor() {
  console.log('📝 Updating author bio...');

  // Get first author
  const { data: authors } = await supabase.from('authors').select('id').limit(1);
  if (!authors || authors.length === 0) {
    console.error('No authors found.');
    return;
  }
  const authorId = authors[0].id;

  const { error } = await supabase
    .from('authors')
    .update({
      name: "Fiza Kanwal",
      bio: "Senior Financial Editor with over 10 years of experience in UK accounting standards, payroll compliance, and business technology. Fiza specializes in helping SMEs navigate HMRC regulations and digital transformation.",
      linkedin: "https://www.linkedin.com/in/fiza-kanwal-editorial",
      twitter: "https://twitter.com/fizakanwal_fin"
    })
    .eq('id', authorId);

  if (error) {
    console.error('Error updating author:', error.message);
  } else {
    console.log('✅ Author updated successfully!');
  }
}

updateAuthor();
