import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'Cookie notice',
  description:
    'How Ledger Businesses uses cookies and where to manage preferences. Links to our full Privacy Policy.',
  alternates: {
    canonical: '/cookies',
  },
};

export default function CookieNoticePage() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pb-16 pt-16 md:pt-24">
          <div className="mb-10">
            <span className="mb-6 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent-content">
              Legal
            </span>
            <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-ink md:text-5xl">Cookie notice</h1>
            <p className="text-lg text-ink/60">
              Short summary. Full detail is in our{' '}
              <Link href="/privacy#cookies" className="font-medium text-accent-content underline underline-offset-2">
                Privacy Policy — cookies section
              </Link>
              .
            </p>
          </div>

          <div className="space-y-6 text-[15px] leading-relaxed text-ink/70">
            <p>
              We use cookies and similar technologies to operate the site, remember preferences (such as cookie
              consent), measure traffic, and improve performance. Some cookies are strictly necessary; others are only
              used if you accept non-essential cookies via our banner.
            </p>
            <p>
              You can change your browser settings to block or delete cookies; doing so may affect how parts of the site
              work.
            </p>
            <p>
              Affiliate or analytics partners may set cookies when you follow tracked links or when those tools load —
              see our{' '}
              <Link href="/privacy" className="font-medium text-accent-content underline underline-offset-2">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/affiliate-disclosure" className="font-medium text-accent-content underline underline-offset-2">
                Affiliate disclosure
              </Link>
              .
            </p>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
