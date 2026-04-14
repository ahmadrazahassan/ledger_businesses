import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EditorialArrowLink } from '@/components/ui/editorial-cta';

export const metadata: Metadata = {
  title: 'How We Test UK Accounting Software | Ledger Businesses Methodology',
  description:
    'Editorial methodology for hands-on UK accounting, payroll, and tax software reviews — testing, compliance checks, and independence.',
  alternates: {
    canonical: '/methodology',
  },
};

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <div className="rounded-2xl border border-ink/12 px-6 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
            <header className="max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">Editorial process</p>
              <h1 className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-heading font-bold leading-[1.05] tracking-[-0.04em] text-ink">
                How we test and review software
              </h1>
              <p className="mt-6 text-[17px] leading-[1.65] text-ink/55 md:text-[18px]">
                Hands-on evaluations of UK accounting, payroll, and finance tools — structured around real workflows,
                HMRC-facing requirements, and transparent independence from commercial relationships.
              </p>
            </header>

            <div className="mt-12 border border-ink/10 bg-ink/[0.02] px-6 py-8 md:px-8 md:py-9">
              <p className="text-[15px] leading-[1.75] text-ink/60 md:text-[16px]">
                We do not accept paid placements in editorial rankings. Affiliate partnerships are disclosed; they do not
                determine scores or verdicts. See our{' '}
                <Link
                  href="/affiliate-disclosure"
                  className="border-b border-ink/25 pb-px font-medium text-ink transition-colors hover:border-ink"
                >
                  Affiliate disclosure
                </Link>
                .
              </p>
            </div>

            <div className="mt-14 space-y-0 border-t border-ink/10 md:mt-16">
              {[
                {
                  n: '01',
                  title: 'Hands-on testing',
                  body: (
                    <>
                      <p>
                        We do not rely on marketing copy alone. For platforms we cover (including major UK names such as
                        Sage, Xero, and QuickBooks), we use live or trial accounts and run a consistent set of UK business
                        scenarios.
                      </p>
                      <ul className="mt-4 list-none space-y-3 border-l border-ink/15 pl-5 text-[15px] leading-relaxed text-ink/55">
                        <li>
                          <span className="font-medium text-ink">Bank feeds:</span> connection stability and reconciliation
                          behaviour.
                        </li>
                        <li>
                          <span className="font-medium text-ink">Invoicing:</span> creation, chasing, and payment flows.
                        </li>
                        <li>
                          <span className="font-medium text-ink">Payroll (RTI):</span> dummy runs against HMRC RTI and
                          pensions expectations.
                        </li>
                        <li>
                          <span className="font-medium text-ink">VAT &amp; MTD:</span> return preparation and submission
                          paths where MTD applies.
                        </li>
                      </ul>
                    </>
                  ),
                },
                {
                  n: '02',
                  title: 'UK compliance and localization',
                  body: (
                    <>
                      <p>
                        US-first products often miss UK requirements. We score against UK tax logic, terminology, and
                        reporting norms.
                      </p>
                      <ul className="mt-4 list-none space-y-3 border-l border-ink/15 pl-5 text-[15px] leading-relaxed text-ink/55">
                        <li>VAT schemes (e.g. Standard, Flat Rate, Cash Accounting) where relevant.</li>
                        <li>HMRC recognition for MTD for VAT and, where applicable, ITSA readiness.</li>
                        <li>CIS and other sector-specific flows when the product targets those users.</li>
                        <li>UK-style management and statutory reports.</li>
                      </ul>
                    </>
                  ),
                },
                {
                  n: '03',
                  title: 'Value and total cost',
                  body: (
                    <>
                      <p>
                        We compare tiers and add-ons so the true cost at realistic headcount and feature use is visible —
                        not only entry-level pricing.
                      </p>
                      <ul className="mt-4 list-none space-y-3 border-l border-ink/15 pl-5 text-[15px] leading-relaxed text-ink/55">
                        <li>User, accountant, and payroll seat economics.</li>
                        <li>What is bundled vs billed separately at scale.</li>
                        <li>Feature parity across plans versus named competitors where we run comparisons.</li>
                      </ul>
                    </>
                  ),
                },
                {
                  n: '04',
                  title: 'Editorial independence',
                  body: (
                    <p>
                      Recommendations follow from testing evidence and documented criteria. We surface limitations and
                      trade-offs explicitly so readers can decide fit — not only headline strengths.
                    </p>
                  ),
                },
              ].map((section) => (
                <section key={section.n} className="border-b border-ink/10 py-12 md:py-14">
                  <div className="grid gap-8 md:grid-cols-12 md:gap-10 lg:gap-14">
                    <div className="md:col-span-4">
                      <p className="text-[11px] font-semibold tabular-nums text-ink/35">{section.n}</p>
                      <h2 className="mt-3 text-xl font-heading font-bold tracking-tight text-ink md:text-2xl">
                        {section.title}
                      </h2>
                    </div>
                    <div className="space-y-4 text-[16px] leading-[1.75] text-ink/60 md:col-span-8 md:text-[17px]">
                      {section.body}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <footer className="mt-14 border-t border-ink/10 pt-12 md:mt-16 md:pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">Questions</p>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink/55">
                For methodology detail, corrections, or partnership standards — use the contact form with the subject
                line that best matches your enquiry.
              </p>
              <EditorialArrowLink href="/contact" className="mt-10">
                Contact the editor
              </EditorialArrowLink>
            </footer>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
