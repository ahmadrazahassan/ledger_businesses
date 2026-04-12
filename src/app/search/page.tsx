import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { SearchInput } from '@/components/search-input';
import { PostCard } from '@/components/posts/post-card';
import { IconSearch } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search articles on Ledger Businesses.',
  alternates: {
    canonical: '/search',
  },
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function searchPosts(query: string) {
  if (!query) return [];
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content_text.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(50);

  if (error) return [];
  return data || [];
}

async function getPopularCategories() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(6);

  if (error) return [];
  return data || [];
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const [results, categories] = await Promise.all([
    searchPosts(query),
    getPopularCategories(),
  ]);

  return (
    <>
      <Header />
      <main>
        <SectionWrapper className="pt-10 md:pt-16">
          <div className="max-w-2xl mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <IconSearch size={18} className="text-accent-content" />
              </div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-ink">
                Search
              </h1>
            </div>
            <p className="text-sm text-ink/50 mb-6">
              Find articles across all topics and categories.
            </p>
            <SearchInput defaultValue={query} className="mb-0" />
          </div>

          {query ? (
            <>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-ink/[0.06]">
                <span className="text-sm text-ink/60">
                  {results.length} result{results.length !== 1 ? 's' : ''} for
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent-content text-sm font-semibold rounded-full">
                  &ldquo;{query}&rdquo;
                </span>
              </div>
              {results.length > 0 ? (
                <div>
                  {results.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="w-14 h-14 rounded-full bg-ink/[0.04] flex items-center justify-center mx-auto mb-4">
                    <IconSearch size={22} className="text-ink/20" />
                  </div>
                  <p className="text-base font-semibold text-ink/50 mb-2">No results found</p>
                  <p className="text-sm text-gray mb-6">Try different keywords or browse topics below.</p>
                  {categories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="px-3 py-1.5 text-xs font-medium text-ink/50 border border-ink/[0.08] rounded-full hover:border-accent hover:text-accent-content transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="text-sm text-ink/40 mb-6">Enter a keyword to search across all articles.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['AI', 'B2B', 'SaaS', 'Startups', 'Funding', 'Enterprise'].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${term}`}
                    className="px-3 py-1.5 text-xs font-medium text-ink/40 border border-ink/[0.06] rounded-full hover:border-accent hover:text-accent-content hover:bg-accent/5 transition-all"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
