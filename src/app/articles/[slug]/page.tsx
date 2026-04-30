import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ArticleBody } from '@/components/article-body';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { NewsletterCard } from '@/components/newsletter-card';
import { IconClock, IconCalendar, IconChevronRight } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { toAbsoluteUrl } from '@/lib/site';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data;
}

async function getRelatedPosts(categoryId: string, currentSlug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .limit(3);

  if (error) return [];
  return data || [];
}

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published');

  const posts = (data || []) as Array<{ slug: string }>;
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Article Not Found' };
  const canonicalUrl = `/articles/${post.slug}`;
  const seoTitle = post.seo_title || post.title;
  const seoDescription = post.seo_description || post.excerpt;
  const ogImage = post.og_image || post.cover_image || '/og-default.png';

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: [post.author.name],
      section: post.category?.name || undefined,
      tags: post.tags || [],
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(post.category_id, post.slug);
  const articleUrl = toAbsoluteUrl(`/articles/${post.slug}`);
  const articleImage = post.og_image || post.cover_image || toAbsoluteUrl('/og-default.png');
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: [articleImage],
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ledger Businesses',
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl('/favicon.svg'),
      },
    },
    mainEntityOfPage: articleUrl,
    articleSection: post.category.name,
    keywords: (post.tags || []).join(', '),
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: toAbsoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.category.name,
        item: toAbsoluteUrl(`/category/${post.category.slug}`),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Header />
      <main>
        <article>
          {/* Article header */}
          <SectionWrapper narrow className="pt-10 md:pt-16 pb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray mb-8">
              <Link href="/" className="hover:text-ink transition-colors">Home</Link>
              <IconChevronRight size={10} className="text-gray-light" />
              <Link href={`/category/${post.category.slug}`} className="hover:text-ink transition-colors">
                {post.category.name}
              </Link>
              <IconChevronRight size={10} className="text-gray-light" />
              <span className="text-ink/50 truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Category chip */}
            <Link
              href={`/category/${post.category.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/15 text-accent-content text-xs font-bold rounded-full mb-5 hover:bg-accent/25 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {post.category.name}
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-[42px] lg:text-5xl font-heading font-bold text-ink leading-[1.12] tracking-[-0.02em] mb-5">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg md:text-xl text-ink/60 leading-relaxed mb-6 max-w-2xl">
              {post.excerpt}
            </p>

            {/* Affiliate Disclosure Alert */}
            <div className="mb-6 p-4 rounded-xl bg-accent/5 border border-accent/10 flex items-start gap-3">
              <span className="text-accent-content mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </span>
              <p className="text-sm text-ink/70 leading-relaxed">
                <strong>Ledger Businesses is reader-supported.</strong> When you buy through links on our site, we may earn an affiliate commission at no extra cost to you. <Link href="/affiliate-disclosure" className="text-accent-content hover:underline">Learn more</Link>.
              </p>
            </div>

            {/* Meta info */}
            <div className="flex flex-col gap-6 pb-8 border-b border-ink/[0.06]">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-ink/10 relative shrink-0">
                    {post.author.avatar_url ? (
                      <Image src={post.author.avatar_url} alt={post.author.name} fill className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-bold text-ink/40 text-xs">
                        {post.author.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-ink">{post.author.name}</span>
                    <Link href="/about" className="text-xs text-accent-content hover:underline">
                      View Editorial Profile
                    </Link>
                  </div>
                </div>
                
                <span className="hidden md:block w-1 h-1 rounded-full bg-gray-light" />
                
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <IconCalendar size={14} />
                    <span className="flex flex-col">
                      <span>Published: {formatDate(post.published_at || post.created_at)}</span>
                      {post.updated_at && post.updated_at !== post.published_at && (
                        <span className="text-xs opacity-75">Updated: {formatDate(post.updated_at)}</span>
                      )}
                    </span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-light" />
                  <span className="flex items-center gap-1.5">
                    <IconClock size={14} />
                    <span>{post.reading_time} min read</span>
                  </span>
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* Cover image */}
          <SectionWrapper narrow noPadding className="py-10">
            {post.cover_image ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-ink/5">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  quality={95}
                  priority
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-2xl bg-warm flex items-center justify-center overflow-hidden shadow-lg">
                <span className="font-heading font-black text-ink/[0.03] text-[80px] select-none">LB</span>
              </div>
            )}
          </SectionWrapper>

          {/* Article body */}
          <SectionWrapper narrow noPadding className="py-12">
            <ArticleBody
              html={post.content_html}
              className="prose prose-lg max-w-none text-ink/85 leading-[1.85] 
                prose-headings:text-ink prose-headings:font-heading prose-headings:mb-4 prose-headings:mt-8
                prose-p:mb-6
                prose-a:text-[#05ce78] prose-a:no-underline
                prose-strong:text-ink prose-strong:font-semibold
                prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:text-ink/60 prose-blockquote:italic
                prose-ul:my-6 prose-ol:my-6
                prose-li:mb-2
                prose-img:rounded-xl prose-img:shadow-md
                prose-code:text-accent-content prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
            />
          </SectionWrapper>

          {/* Tags */}
          {post.tags.length > 0 && (
            <SectionWrapper narrow noPadding className="pb-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-ink/40 mr-1">Tags</span>
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium text-ink/50 bg-ink/[0.03] border border-ink/[0.06] rounded-full hover:border-accent/30 hover:text-accent-content transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SectionWrapper>
          )}
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <SectionWrapper className="border-t border-ink/[0.06]">
            <h2 className="text-xl font-heading font-bold text-ink mb-6">More in {post.category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relPost) => (
                <Link
                  key={relPost.id}
                  href={`/articles/${relPost.slug}`}
                  className="group p-5 rounded-xl border border-ink/[0.06] bg-card hover:border-accent/20 hover:shadow-card transition-all"
                >
                  <span className="text-[10px] font-bold text-accent-content uppercase tracking-wide">
                    {relPost.category.name}
                  </span>
                  <h3 className="text-sm font-bold text-ink mt-2 mb-2 leading-snug group-hover:text-accent-content transition-colors">
                    {relPost.title}
                  </h3>
                  <p className="text-xs text-gray line-clamp-2">{relPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Newsletter */}
        <SectionWrapper id="newsletter">
          <NewsletterCard />
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
