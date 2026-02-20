import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/data/seed';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim().toLowerCase() || '';

  if (!query) {
    return NextResponse.json({ results: [], query: '' });
  }

  // In production, this would use Supabase full-text search
  const results = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query))
  );

  return NextResponse.json({
    results: results.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      category: p.category.name,
      author: p.author.name,
      published_at: p.published_at,
      reading_time: p.reading_time,
    })),
    query,
  });
}
