import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Ledger Businesses is the premier resource for accounting, finance, and business operations professionals.',
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
              Financial clarity for teams that build serious companies.
            </h1>
            <p className="text-[18px] md:text-[21px] text-ink/60 leading-relaxed max-w-3xl">
              We publish practical intelligence on accounting, payroll, tax compliance, and operations. Every brief is designed for leaders who need decisions, not noise.
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

          <div className="border-y border-ink/10 py-14 md:py-16 mb-16 md:mb-20">
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
              For editorial collaboration, partnerships, or media requests, our team can help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3 text-[13px] font-semibold rounded-full border border-ink/15 text-ink hover:border-ink/30 transition-colors"
            >
              Contact the team
            </Link>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
