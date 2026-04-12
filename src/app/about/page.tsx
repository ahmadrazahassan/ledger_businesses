import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Who we are: independent UK accounting and payroll software reviews, led by editor Fiza. Editorial standards and affiliate transparency.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pt-14 md:pt-20 pb-20 md:pb-24">
          <div className="mb-16 md:mb-20">
            <span className="inline-flex items-center px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50 border border-ink/10 rounded-full mb-7">
              About Ledger Businesses
            </span>
            <h1 className="text-[40px] md:text-[60px] font-heading font-bold text-ink leading-[0.98] tracking-[-0.03em] max-w-4xl mb-7">
              Independent UK accounting software reviews and guides.
            </h1>
            <p className="text-[18px] md:text-[21px] text-ink/60 leading-relaxed max-w-3xl">
              We publish practical, hands-on reviews of accounting, payroll, and tax compliance software. Every guide is designed to help UK SMEs make confident, compliant software decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 md:mb-20">
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <p className="text-[10px] uppercase tracking-[0.14em] text-ink/45 mb-2">Focus</p>
              <p className="text-[22px] font-heading font-bold text-ink">UK SMEs</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <p className="text-[10px] uppercase tracking-[0.14em] text-ink/45 mb-2">Coverage</p>
              <p className="text-[22px] font-heading font-bold text-ink">Accounting + Payroll</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <p className="text-[10px] uppercase tracking-[0.14em] text-ink/45 mb-2">Standard</p>
              <p className="text-[22px] font-heading font-bold text-ink">Editorial First</p>
            </div>
          </div>

          {/* Meet the Founder */}
          <div className="border-y border-ink/10 py-14 md:py-16 mb-16 md:mb-20">
            <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
              <div className="shrink-0">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-ink/[0.06] border border-ink/10 flex items-center justify-center">
                  <span className="text-[48px] md:text-[56px] font-heading font-bold text-accent-content/60">F</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-accent-content font-semibold mb-3">Founder & Editor-in-Chief</p>
                <h2 className="text-[30px] md:text-[40px] font-heading font-bold text-ink leading-[1.05] mb-5">
                  Fiza
                </h2>
                <div className="space-y-4 text-[17px] md:text-[19px] text-ink/65 leading-relaxed max-w-3xl">
                  <p>
                    Fiza is the founder and editor-in-chief of Ledger Businesses — a specialist editorial platform dedicated to reviewing and evaluating accounting, bookkeeping, invoicing, payroll, HR, financial reporting, and VAT &amp; tax compliance software for UK small and medium enterprises.
                  </p>
                  <p>
                    With over 8 years of experience as a certified bookkeeper and financial operations consultant in the UK, Fiza has spent her career researching, implementing, and writing about the systems that help companies stay compliant, efficient, and growth-ready. She holds an AAT Level 4 Diploma in Professional Accounting and has guided dozens of SMEs through their transition to Making Tax Digital (MTD) compliant software.
                  </p>
                  <p>
                    Her editorial approach is rooted in accuracy, clarity, and practical application — every software review, guide, and framework published on Ledger Businesses is fact-checked against official HMRC guidance, industry standards, and current regulatory requirements. Fiza personally oversees all software testing and editorial content, ensuring that Ledger Businesses delivers only thoroughly researched, unbiased, and actionable intelligence.
                  </p>
                  <p>
                    Her mission is to make professional-grade financial software knowledge freely accessible to founders, finance leads, and business operators who need real answers — not theory.
                  </p>
                </div>
                <div className="flex items-center gap-6 mt-6">
                  <a
                    href="mailto:fiza@ledgerthebusinesses.com"
                    className="inline-flex items-center gap-2 text-accent-content font-semibold text-[15px] hover:gap-3 transition-all"
                  >
                    fiza@ledgerthebusinesses.com
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/fiza-rana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#0077b5] font-semibold text-[15px] hover:brightness-110 transition-all"
                  >
                    LinkedIn
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-[30px] md:text-[40px] font-heading font-bold text-ink leading-[1.05] mb-6">
              Our mission
            </h2>
            <p className="text-[17px] md:text-[19px] text-ink/65 leading-relaxed max-w-3xl">
              We help operators run better businesses by turning complex finance and compliance topics into clear execution frameworks. Our work is built for founders, finance leads, and advisors who value precision and measurable outcomes.
            </p>
          </div>

          <div className="mb-16 md:mb-20">
            <h2 className="text-[30px] md:text-[40px] font-heading font-bold text-ink leading-[1.05] mb-7">
              What we cover
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink/10 p-7 bg-white">
                <h3 className="text-[22px] font-heading font-bold text-ink mb-3">Accounting & Bookkeeping</h3>
                <p className="text-[15px] text-ink/60 leading-relaxed">Cloud accounting operations, month-end workflows, and reporting standards that scale with growth.</p>
              </div>
              <div className="rounded-2xl border border-ink/10 p-7 bg-white">
                <h3 className="text-[22px] font-heading font-bold text-ink mb-3">Payroll & HR</h3>
                <p className="text-[15px] text-ink/60 leading-relaxed">Payroll accuracy, RTI readiness, and practical people-ops systems for UK teams.</p>
              </div>
              <div className="rounded-2xl border border-ink/10 p-7 bg-white">
                <h3 className="text-[22px] font-heading font-bold text-ink mb-3">Tax Compliance</h3>
                <p className="text-[15px] text-ink/60 leading-relaxed">MTD, VAT, and core compliance controls explained with implementation detail, not theory.</p>
              </div>
              <div className="rounded-2xl border border-ink/10 p-7 bg-white">
                <h3 className="text-[22px] font-heading font-bold text-ink mb-3">Business Systems</h3>
                <p className="text-[15px] text-ink/60 leading-relaxed">Process design, operating cadence, and software workflows that improve decision velocity.</p>
              </div>
            </div>
          </div>

          <div className="mb-16 md:mb-20">
            <h2 className="text-[30px] md:text-[40px] font-heading font-bold text-ink leading-[1.05] mb-7">
              Editorial principles
            </h2>
            <div className="space-y-4">
              <div className="rounded-2xl border border-ink/10 p-6 bg-white">
                <p className="text-[11px] uppercase tracking-[0.12em] text-ink/45 mb-2">01</p>
                <h3 className="text-[20px] font-heading font-bold text-ink mb-2">Accuracy before speed</h3>
                <p className="text-[15px] text-ink/60 leading-relaxed">We verify facts against official guidance and industry sources before publication.</p>
              </div>
              <div className="rounded-2xl border border-ink/10 p-6 bg-white">
                <p className="text-[11px] uppercase tracking-[0.12em] text-ink/45 mb-2">02</p>
                <h3 className="text-[20px] font-heading font-bold text-ink mb-2">Operational relevance</h3>
                <p className="text-[15px] text-ink/60 leading-relaxed">Every article must help a reader implement a better process, not just understand a concept.</p>
              </div>
              <div className="rounded-2xl border border-ink/10 p-6 bg-white">
                <p className="text-[11px] uppercase tracking-[0.12em] text-ink/45 mb-2">03</p>
                <h3 className="text-[20px] font-heading font-bold text-ink mb-2">Editorial independence</h3>
                <p className="text-[15px] text-ink/60 leading-relaxed">Commercial relationships never define our recommendations. Utility and evidence do.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 p-8 md:p-10 bg-white">
            <h2 className="text-[30px] md:text-[38px] font-heading font-bold text-ink leading-[1.05] mb-4">
              Work with us
            </h2>
            <p className="text-[16px] md:text-[18px] text-ink/60 leading-relaxed max-w-2xl mb-7">
              For editorial collaboration, partnerships, or media requests — reach out to Fiza directly.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3 text-[13px] font-semibold rounded-full border border-ink/15 text-ink hover:border-ink/30 transition-colors"
            >
              Contact Fiza
            </Link>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
