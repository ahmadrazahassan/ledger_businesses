import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'How We Test UK Accounting Software | Ledger Businesses Methodology',
  description: 'Learn about the rigorous editorial methodology Ledger Businesses uses to review and evaluate accounting, payroll, and tax software for UK SMEs.',
  alternates: {
    canonical: '/methodology',
  },
};

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pt-16 md:pt-24 pb-16">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block px-3 py-1 bg-accent/15 text-accent-content text-xs font-bold rounded-full mb-6">
              Editorial Process
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-ink leading-tight mb-4">
              How We Test & Review Software
            </h1>
            <p className="text-lg text-ink/60">
              Our strict methodology ensures unbiased, hands-on evaluations of UK accounting, payroll, and finance software.
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12 p-6 rounded-2xl bg-accent/[0.06] border border-accent/10">
            <p className="text-ink/70 leading-relaxed">
              At Ledger Businesses, we believe UK small businesses and accounting professionals deserve honest, practical, and rigorously tested software reviews. We do not accept paid placements, and our editorial team maintains complete independence from our affiliate partnerships.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">1. Hands-on Testing</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We never base our reviews purely on marketing materials. For every accounting and payroll platform we review (e.g., Sage, Xero, QuickBooks), we sign up for an active account and run it through a standard set of UK business scenarios.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Bank Feeds:</strong> We connect test bank accounts to evaluate sync reliability and transaction reconciliation speed.</li>
                    <li><strong>Invoicing:</strong> We create, customize, and send invoices, tracking how easy it is to manage overdue payments and accept online card payments.</li>
                    <li><strong>Payroll (RTI):</strong> We run dummy payrolls to verify compliance with HMRC's Real Time Information (RTI) requirements, including pension auto-enrolment features.</li>
                    <li><strong>VAT & MTD:</strong> We test Making Tax Digital (MTD) readiness by preparing mock VAT returns and checking the submission workflow.</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">2. UK Compliance & Localization</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Software built for the US market often fails UK businesses. We specifically evaluate platforms on their adherence to UK financial regulations and terminology.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Does it handle UK VAT schemes (Standard, Flat Rate, Cash Accounting)?</li>
                    <li>Is it recognized by HMRC for MTD for VAT and MTD for ITSA?</li>
                    <li>Does it correctly support Construction Industry Scheme (CIS) deductions?</li>
                    <li>Are reports formatted according to UK accounting standards (e.g., Profit & Loss, Balance Sheet)?</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">3. Value for Money</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We analyze pricing structures to ensure transparency. We look beyond the "starter" tiers to calculate the true cost of ownership as a business scales.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Are there hidden fees for adding extra users or accountants?</li>
                    <li>Is payroll an expensive add-on, or included in the base price?</li>
                    <li>How do the features in each tier compare to direct competitors?</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">4. Editorial Independence</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Our reviews are completely independent. While we may earn a commission if you purchase through our links (see our <Link href="/affiliate-disclosure" className="text-accent-content underline">Affiliate Disclosure</Link>), our recommendations are based solely on our testing data. We actively highlight the drawbacks and limitations of every software we review to help you make an informed decision.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
