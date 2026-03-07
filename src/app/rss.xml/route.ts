import { createAdminClient } from '@/lib/supabase/admin';
import { toAbsoluteUrl } from '@/lib/site';

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('posts')
    .select('slug, title, excerpt, published_at, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(100);
  const posts = (data || []) as Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string | null;
    updated_at: string | null;
  }>;

  const items = posts
    .map((post) => {
      const url = toAbsoluteUrl(`/articles/${post.slug}`);
      const pubDate = new Date(post.published_at || post.updated_at || new Date()).toUTCString();
      const description = escapeXml(post.excerpt || '');
      const title = escapeXml(post.title || '');
      return `<item><title>${title}</title><link>${url}</link><guid>${url}</guid><pubDate>${pubDate}</pubDate><description>${description}</description></item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ledger Businesses</title><link>${toAbsoluteUrl('/')}</link><description>Premium editorial coverage for business decision-makers.</description>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
