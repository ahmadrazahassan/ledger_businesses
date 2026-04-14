import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Editorial Standards',
  description:
    'How Ledger Businesses researches, writes, and updates UK accounting and payroll software coverage — independence, accuracy, and corrections.',
  alternates: {
    canonical: '/editorial-standards',
  },
};

export default function EditorialStandardsPage() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pb-16 pt-16 md:pt-24">
          <div className="mb-10">
            <span className="mb-6 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent-content">
              Editorial
            </span>
            <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-ink md:text-5xl">
              Editorial standards
            </h1>
            <p className="text-lg text-ink/60">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-10 text-[15px] leading-relaxed text-ink/70">
            <p>
              Ledger Businesses publishes independent guides and comparisons for UK small businesses, sole traders,
              and finance teams. These standards describe how we work so readers know what to expect from our
              coverage — including how we handle commercial relationships and corrections.
            </p>

            <section>
              <h2 className="mb-4 text-2xl font-heading font-bold text-ink">Independence</h2>
              <p>
                Affiliate or advertising relationships do not determine our conclusions. We disclose commercial
                arrangements clearly (see our{' '}
                <Link href="/affiliate-disclosure" className="font-medium text-accent-content underline underline-offset-2">
                  Affiliate disclosure
                </Link>
                ). Products are assessed against the same criteria we publish or imply in each piece — typically
                UK compliance fit, pricing clarity, day-to-day usability, and support for workflows like MTD, VAT,
                or payroll reporting where relevant.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-heading font-bold text-ink">Accuracy and sources</h2>
              <p>
                We aim to align factual claims with official HMRC guidance, vendor documentation, and what we
                observe in hands-on testing. Pricing and feature details change; we update articles when we become
                aware of material changes and note significant revisions where helpful.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-heading font-bold text-ink">Corrections</h2>
              <p>
                If you spot an error — factual, regulatory, or product-related — please email{' '}
                <a href={CONTACT_MAILTO} className="font-medium text-accent-content underline underline-offset-2">
                  {CONTACT_EMAIL}
                </a>{' '}
                with the article URL and correction. We investigate and amend content when appropriate; substantive
                fixes may be noted on the page or in our change log where we maintain one.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-heading font-bold text-ink">Reviews and comparisons</h2>
              <p>
                Reviews and &quot;vs&quot; articles reflect editorial judgment against stated criteria, not a single
                universal ranking. We explain who each option suits — including when a product is a weaker fit — so
                readers can map advice to their own situation.
              </p>
            </section>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
