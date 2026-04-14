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
import { ComparisonsShowcase } from '@/components/home/comparisons-showcase';
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
          <SectionWrapper wide className="pt-8 md:pt-12 pb-6 md:pb-8">
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
          <SectionWrapper wide className="pt-8 md:pt-12 pb-6 md:pb-8">
            <div className="p-16 rounded-3xl bg-white border border-ink/[0.06] text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-ink/[0.04] flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/30">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-[24px] font-heading font-bold text-ink mb-3">No articles yet</h3>
                <p className="text-[15px] text-ink/50 leading-relaxed">
                  UK accounting and payroll reviews are added here as they are published — methodology and disclosures apply
                  to all coverage.
                </p>
              </div>
            </div>
          </SectionWrapper>
        )}

        {latest.length > 0 && (
          <SponsorLeaderboard posts={latest} eyebrow="New on Ledger Businesses" />
        )}

        {/* Accounting Spotlight */}
        {accountingPosts.length > 0 && (
          <SectionWrapper wide>
            <CategorySpotlight
              title="Accounting & Bookkeeping"
              slug="accounting-bookkeeping"
              posts={accountingPosts}
              tagline="Accounting"
              description="Cloud ledgers, reconciliations, and month-end workflows — written for UK companies and their advisers."
            />
          </SectionWrapper>
        )}

        {/* Comparisons — flagship block after Accounting (head-to-head / buyer-guide focus) */}
        {comparisonsPosts.length > 0 && (
          <SectionWrapper wide>
            <ComparisonsShowcase posts={comparisonsPosts} />
          </SectionWrapper>
        )}

        {/* Latest Articles */}
        {latest.length > 0 && (
          <SectionWrapper wide id="latest">
            <h2 className="text-[24px] md:text-[30px] font-heading font-bold text-ink leading-[1.1] mb-2">
              Latest articles
            </h2>
            <p className="text-[14px] text-ink/55 mb-8 max-w-2xl leading-relaxed">
              Hands-on reviews and implementation guides for UK accounting, payroll, and tax software. Methodology and
              affiliate relationships are documented on site; rankings reflect testing, not sponsorship.
            </p>
            <LatestArticles posts={latest} categories={categories} />
          </SectionWrapper>
        )}

        {/* Payroll Spotlight */}
        {payrollPosts.length > 0 && (
          <SectionWrapper wide className="pb-12">
            <CategorySpotlight
              title="Payroll & Compliance"
              slug="payroll"
              posts={payrollPosts}
              tagline="Payroll"
              description="RTI submissions, pensions, and employer reporting — evaluated against UK payroll rules and real payroll runs."
            />
          </SectionWrapper>
        )}

        {/* VAT & Tax Compliance */}
        {vatTaxPosts.length > 0 && (
          <SectionWrapper wide>
            <CategorySpotlight
              title="VAT & Tax Compliance"
              slug="vat-tax-compliance"
              posts={vatTaxPosts}
              tagline="Tax"
              description="VAT schemes, MTD filing paths, and compliance controls — tied to HMRC expectations and product behaviour we verify in testing."
            />
          </SectionWrapper>
        )}

        {/* Small Business */}
        {smallBusinessPosts.length > 0 && (
          <SectionWrapper wide className="pb-12">
            <CategorySpotlight
              title="Small Business"
              slug="small-business"
              posts={smallBusinessPosts}
              tagline="SME"
              description="Operational guides for sole traders and growing UK SMEs — from first ledger to scaled finance processes."
            />
          </SectionWrapper>
        )}

        {/* Newsletter */}
        <SectionWrapper wide id="newsletter" className="py-8 md:py-12">
          <NewsletterCard />
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
