import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { PostCard } from '@/components/posts/post-card';
import { IconChevronRight } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { toAbsoluteUrl } from '@/lib/site';
import { getPublishedPostsForCategoryId } from '@/lib/queries/category-posts';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data;
}

async function getCategoryPosts(categoryId: string) {
  return getPublishedPostsForCategoryId(categoryId);
}

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('categories')
    .select('slug')
    .eq('is_active', true);

  const categories = (data || []) as Array<{ slug: string }>;
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: 'Category Not Found' };
  const canonicalUrl = `/category/${category.slug}`;
  const title = `${category.name} — Ledger Businesses`;

  return {
    title,
    description: category.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: category.description,
      type: 'website',
      url: canonicalUrl,
      images: [{ url: '/og-default.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: category.description,
      images: ['/og-default.png'],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const categoryPosts = await getCategoryPosts(category.id);
  const categoryUrl = toAbsoluteUrl(`/category/${category.slug}`);
  const itemListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Articles`,
    description: category.description,
    url: categoryUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categoryPosts.length,
      itemListElement: categoryPosts.slice(0, 20).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: toAbsoluteUrl(`/articles/${post.slug}`),
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
      />
      <Header />
      <main>
        <SectionWrapper className="pt-10 md:pt-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray mb-8">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <IconChevronRight size={10} className="text-gray-light" />
            <Link href="/#topics" className="hover:text-ink transition-colors">Topics</Link>
            <IconChevronRight size={10} className="text-gray-light" />
            <span className="text-ink/50">{category.name}</span>
          </nav>

          {/* Category header */}
          <div className="mb-10 pb-8 border-b border-ink/[0.06]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs font-bold text-accent-content uppercase tracking-[0.1em]">Topic</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-3 tracking-[-0.02em]">
              {category.name}
            </h1>
            <p className="text-base text-ink/50 max-w-xl leading-relaxed">
              {category.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent-content text-xs font-bold">
              {categoryPosts.length} articles
            </div>
          </div>

          {/* Posts */}
          {categoryPosts.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-7">
              {categoryPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="category" />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-accent-content text-lg font-bold">0</span>
              </div>
              <p className="text-base font-semibold text-ink/50 mb-1">No articles yet</p>
              <p className="text-sm text-gray">New content is published regularly.</p>
            </div>
          )}
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
