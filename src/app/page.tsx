import type { Metadata } from 'next';
import { AnnouncementStrip } from '@/components/layout/announcement-strip';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { PostCardHero } from '@/components/posts/post-card-hero';
import { SponsorLeaderboard } from '@/components/sponsors/sponsor-leaderboard';
import { LatestArticles } from '@/components/latest-articles';
import { NewsletterCard } from '@/components/newsletter-card';
import { CategorySpotlight } from '@/components/category-spotlight';
import {
  getFeaturedPosts,
  getLatestPosts,
  getActiveCategories,
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
  const [
    featured,
    latest,
    categories,
    comparisonsPosts,
    vatTaxPosts,
    smallBusinessPosts,
    accountingPosts,
    payrollPosts,
  ] = await Promise.all([
    getFeaturedPosts(),
    getLatestPosts(),
    getActiveCategories(),
    getCategoryPosts('comparisons', 4),
    getCategoryPosts('vat-tax-compliance', 4),
    getCategoryPosts('small-business', 4),
    getCategoryPosts('accounting-bookkeeping', 4),
    getCategoryPosts('payroll', 4),
  ]);

  const mainFeatured = featured[0];
  const secondaryFeatured = featured.slice(1, 3);

  const announcementLabels = ['New', 'Featured', 'Latest'] as const;
  const announcementItems = latest.slice(0, 3).map((post, index) => ({
    label: announcementLabels[index] ?? 'Latest',
    text: post.title,
    href: `/articles/${post.slug}`,
    cta: 'Read',
  }));

  return (
    <>
      <AnnouncementStrip items={announcementItems} />
      <Header />

      <main>
        {featured.length > 0 ? (
          <SectionWrapper className="pt-8 md:pt-12 pb-6 md:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {mainFeatured && (
                  <PostCardHero post={mainFeatured} size="large" priority />
                )}
              </div>
              <div className="flex flex-col gap-4">
                {secondaryFeatured.map((post) => (
                  <PostCardHero key={post.id} post={post} size="medium" priority />
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
                  Check back soon for the latest UK accounting software reviews and guides.
                </p>
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* Comparisons — directly under hero */}
        {comparisonsPosts.length > 0 && (
          <SectionWrapper>
            <CategorySpotlight
              title="Comparisons"
              slug="comparisons"
              posts={comparisonsPosts}
              tagline="Compare"
              description="Side-by-side software picks, head-to-head reviews, and buying guides for UK businesses."
            />
          </SectionWrapper>
        )}

        {latest.length > 0 && (
          <SponsorLeaderboard posts={latest} eyebrow="Recently published" />
        )}

        {/* Accounting Spotlight */}
        {accountingPosts.length > 0 && (
          <SectionWrapper>
            <CategorySpotlight
              title="Accounting & Bookkeeping"
              slug="accounting-bookkeeping"
              posts={accountingPosts}
              tagline="Accounting"
              description="Bookkeeping, cloud accounting, and record-keeping for UK businesses and advisers."
            />
          </SectionWrapper>
        )}

        {/* Latest Articles */}
        {latest.length > 0 && (
          <SectionWrapper id="latest">
            <h2 className="text-[24px] md:text-[30px] font-heading font-bold text-ink leading-[1.1] mb-2">
              Latest articles
            </h2>
            <p className="text-[14px] text-ink/55 mb-8 max-w-2xl">
              New and updated reviews and guides. All content is written for a UK regulatory context unless stated otherwise.
            </p>
            <LatestArticles posts={latest} categories={categories} />
          </SectionWrapper>
        )}

        {/* Payroll Spotlight */}
        {payrollPosts.length > 0 && (
          <SectionWrapper className="pb-12">
            <CategorySpotlight
              title="Payroll & Compliance"
              slug="payroll"
              posts={payrollPosts}
              tagline="Payroll"
              description="Payroll software, RTI, pensions, and workplace reporting for UK employers."
            />
          </SectionWrapper>
        )}

        {/* VAT & Tax Compliance */}
        {vatTaxPosts.length > 0 && (
          <SectionWrapper>
            <CategorySpotlight
              title="VAT & Tax Compliance"
              slug="vat-tax-compliance"
              posts={vatTaxPosts}
              tagline="Tax"
              description="VAT, Making Tax Digital, and tax compliance software in a UK regulatory context."
            />
          </SectionWrapper>
        )}

        {/* Small Business */}
        {smallBusinessPosts.length > 0 && (
          <SectionWrapper className="pb-12">
            <CategorySpotlight
              title="Small Business"
              slug="small-business"
              posts={smallBusinessPosts}
              tagline="SME"
              description="Practical guides for sole traders, startups, and growing UK small businesses."
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
