import type { Metadata } from 'next';
import { AnnouncementStrip } from '@/components/layout/announcement-strip';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { PostCardHero } from '@/components/posts/post-card-hero';
import { SponsorLeaderboard } from '@/components/sponsors/sponsor-leaderboard';
import { SponsorMidBanner } from '@/components/sponsors/sponsor-mid-banner';
import { SponsorSidebar } from '@/components/sponsors/sponsor-sidebar';
import { TopicGrid } from '@/components/topic-grid';
import { LatestArticles } from '@/components/latest-articles';
import { TrendingList } from '@/components/trending-list';
import { DeepDiveModule } from '@/components/deep-dive-module';
import { NewsletterCard } from '@/components/newsletter-card';
import { CategorySpotlight } from '@/components/category-spotlight';
import { IconArrowRight } from '@/components/icons';
import {
  getFeaturedPosts,
  getLatestPosts,
  getTrendingPosts,
  getEditorPicks,
  getActiveCategories,
  getSecondaryHeroPosts,
  getCategoryPosts,
} from '@/lib/queries/homepage';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
  },
};

export default async function HomePage() {
  const [featured, latest, trending, editorPicks, categories, secondaryHero, accountingPosts, payrollPosts] = await Promise.all([
    getFeaturedPosts(),
    getLatestPosts(),
    getTrendingPosts(),
    getEditorPicks(),
    getActiveCategories(),
    getSecondaryHeroPosts(),
    getCategoryPosts('accounting-bookkeeping', 4),
    getCategoryPosts('payroll', 4),
  ]);

  const mainFeatured = featured[0];
  const secondaryFeatured = featured.slice(1, 3);
  
  const mainSecondaryHero = secondaryHero[0];
  const sideSecondaryHero = secondaryHero.slice(1, 3);

  // Prepare announcement items from trending posts
  const announcementItems = trending.slice(0, 3).map((post, index) => ({
    label: index === 0 ? 'Trending' : index === 1 ? 'Popular' : 'Latest',
    text: post.title,
    href: `/articles/${post.slug}`,
    cta: 'Read',
  }));

  return (
    <>
      <AnnouncementStrip items={announcementItems} />
      <Header />

      <main>
        {/* Hero Editorial */}
        {featured.length > 0 ? (
          <SectionWrapper className="pt-8 md:pt-12 pb-6 md:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {mainFeatured && (
                  <PostCardHero post={mainFeatured} size="large" />
                )}
              </div>
              <div className="flex flex-col gap-4">
                {secondaryFeatured.map((post) => (
                  <PostCardHero key={post.id} post={post} size="medium" />
                ))}
              </div>
            </div>
          </SectionWrapper>
        ) : (
          <SectionWrapper className="pt-8 md:pt-12 pb-6 md:pb-8">
            <div className="p-16 rounded-3xl bg-white border border-ink/[0.06] text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-ink/[0.04] flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/30">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-[24px] font-heading font-bold text-ink mb-3">No articles yet</h3>
                <p className="text-[15px] text-ink/50">
                  Check back soon for the latest business insights and analysis.
                </p>
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* Must-Read Banner — shows top 4 posts */}
        {trending.length > 0 && <SponsorLeaderboard posts={trending} />}

        {/* Accounting Spotlight */}
        {accountingPosts.length > 0 && (
          <SectionWrapper>
            <CategorySpotlight 
              title="Accounting & Bookkeeping" 
              slug="accounting-bookkeeping" 
              posts={accountingPosts}
              tagline="Essential"
              description="Expert guidance on maintaining pristine financial records and navigating cloud accounting."
            />
          </SectionWrapper>
        )}

        {/* Latest Articles */}
        {latest.length > 0 && (
          <SectionWrapper id="latest">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Feed</span>
            </div>
            <h2 className="text-[28px] md:text-[36px] font-heading font-bold text-ink leading-[1.05] mb-2">
              Latest
            </h2>
            <p className="text-[14px] text-ink/55 mb-8">
              The most recent analysis from our editorial team.
            </p>
            <LatestArticles posts={latest} categories={categories} />
          </SectionWrapper>
        )}

        {/* Trending + Editor's Picks + Sidebar */}
        {(trending.length > 0 || editorPicks.length > 0) && (
          <SectionWrapper id="trending">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {trending.length > 0 && (
                <div>
                  <TrendingList posts={trending.slice(0, 8)} title="Trending" showRank />
                </div>
              )}
              {editorPicks.length > 0 && (
                <div>
                  <TrendingList posts={editorPicks} title="Editor's Picks" />
                </div>
              )}
              <div className="hidden lg:flex flex-col gap-5">
                <SponsorSidebar />
                {/* Second sidebar placeholder */}
                <div className="rounded-[22px] bg-accent/[0.06] border border-accent/10 p-5 text-center">
                  <span className="text-[9px] font-bold text-ink/35 uppercase tracking-[0.15em] block mb-3">Sponsor</span>
                  <p className="text-[13px] font-semibold text-ink/50 mb-2">Your brand could be here</p>
                  <p className="text-[11px] text-ink/40 leading-relaxed mb-4">Premium sidebar placement for enterprise brands.</p>
                  <a href="mailto:fiza@ledgerthebusinesses.com" className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-[11px] font-bold rounded-full hover:bg-accent/85 transition-all">
                    Get started
                    <IconArrowRight size={10} />
                  </a>
                </div>
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* Secondary Hero Section - Big Article Website Feel */}
        {secondaryHero.length > 0 && (
          <SectionWrapper className="pt-6 pb-6">
            <div className="flex items-center gap-2 mb-4">
               <span className="w-1.5 h-1.5 rounded-full bg-accent" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Focus</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {mainSecondaryHero && (
                  <PostCardHero post={mainSecondaryHero} size="large" />
                )}
              </div>
              <div className="flex flex-col gap-4">
                {sideSecondaryHero.map((post) => (
                  <PostCardHero key={post.id} post={post} size="medium" />
                ))}
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* Payroll Spotlight */}
        {payrollPosts.length > 0 && (
          <SectionWrapper className="pb-12">
            <CategorySpotlight 
              title="Payroll & Compliance" 
              slug="payroll" 
              posts={payrollPosts}
              tagline="Strategic"
              description="Navigating the complexities of workforce management, RTI, and auto-enrolment."
            />
          </SectionWrapper>
        )}

        {/* Newsletter */}
        <SectionWrapper id="newsletter" className="py-8 md:py-12">
          <NewsletterCard />
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
