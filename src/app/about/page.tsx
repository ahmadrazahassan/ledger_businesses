import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CONTACT_EMAIL, CONTACT_MAILTO, INSTAGRAM_HREF } from '@/lib/site';
import { EditorialArrowLink } from '@/components/ui/editorial-cta';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Ledger Businesses: independent UK editorial on accounting, payroll, and tax compliance software — editor credentials, disclosures, and contact.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <div className="rounded-2xl border border-ink/12 px-6 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
            <header className="max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">Ledger Businesses</p>
              <h1 className="mt-5 text-[clamp(2rem,4.5vw,3.5rem)] font-heading font-bold leading-[1.05] tracking-[-0.04em] text-ink">
                Independent UK software intelligence for finance-led operators.
              </h1>
              <p className="mt-6 text-[17px] leading-[1.65] text-ink/55 md:text-[18px]">
                We publish hands-on reviews and implementation guides for accounting, payroll, and tax compliance
                software — written so UK SMEs can choose and run systems with confidence, including Making Tax Digital
                (MTD) aligned workflows where they apply.
              </p>
            </header>

            <div className="mt-14 grid grid-cols-1 divide-y divide-ink/10 border-y border-ink/10 md:mt-20 md:grid-cols-3 md:divide-x md:divide-y-0">
              {[
                { k: 'Audience', v: 'UK SMEs & finance teams' },
                { k: 'Coverage', v: 'Accounting · Payroll · Compliance' },
                { k: 'Standard', v: 'Editorial-first, evidence-led' },
              ].map((row) => (
                <div key={row.k} className="py-6 md:px-6 md:py-8 lg:px-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">{row.k}</p>
                  <p className="mt-3 text-[17px] font-heading font-bold tracking-tight text-ink md:text-[18px]">{row.v}</p>
                </div>
              ))}
            </div>

            <section className="mt-14 border-b border-ink/10 pb-14 md:mt-20 md:grid md:grid-cols-12 md:gap-12 lg:gap-16 md:pb-20">
              <div className="md:col-span-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">Founder & editor-in-chief</p>
                <h2 className="mt-4 text-3xl font-heading font-bold tracking-tight text-ink md:text-4xl">Fiza</h2>
                <div className="mt-8 hidden h-40 w-full max-w-[200px] rounded-lg border border-ink/10 bg-ink/[0.03] md:flex md:items-center md:justify-center">
                  <span className="text-5xl font-heading font-bold text-ink/15">F</span>
                </div>
              </div>
              <div className="mt-10 space-y-5 text-[16px] leading-[1.7] text-ink/60 md:col-span-8 md:mt-0 md:text-[17px]">
                <p>
                  Fiza is the founder and editor-in-chief of Ledger Businesses — a specialist editorial platform focused on
                  reviewing accounting, bookkeeping, invoicing, payroll, HR, reporting, and VAT &amp; tax compliance
                  software for UK small and medium-sized enterprises.
                </p>
                <p>
                  She has over eight years&apos; experience as a certified bookkeeper and financial operations consultant
                  in the UK, with an AAT Level 4 Diploma in Professional Accounting. That background informs how we test
                  products, interpret HMRC-facing requirements, and translate vendor capability into what actually matters
                  on a month-end close or payroll run.
                </p>
                <p>
                  Content is checked against official guidance and current regulatory context where relevant; commercial
                  relationships are disclosed and do not determine our recommendations. The goal is practical,
                  defensible advice readers can act on — not generic rankings.
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 text-[14px] font-medium text-ink">
                  <a href={CONTACT_MAILTO} className="border-b border-ink/20 pb-0.5 transition-colors hover:border-ink">
                    {CONTACT_EMAIL}
                  </a>
                  <a
                    href={INSTAGRAM_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-ink/20 pb-0.5 transition-colors hover:border-ink"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </section>

            <section className="border-b border-ink/10">
              <h2 className="pt-14 text-2xl font-heading font-bold tracking-tight text-ink md:pt-20 md:text-3xl">
                What we publish
              </h2>
              <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-ink/55 md:text-[17px]">
                Structured reviews, comparison frameworks, and compliance-oriented explainers — aligned to how UK teams
                buy and run software in practice.
              </p>
              <ul className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
                {[
                  {
                    t: 'Accounting & bookkeeping',
                    d: 'Cloud ledger operations, reconciliations, and reporting that scale with the business.',
                  },
                  {
                    t: 'Payroll & HR',
                    d: 'RTI-aligned payroll, pensions, and people processes for UK employers.',
                  },
                  {
                    t: 'Tax & compliance',
                    d: 'MTD, VAT, and control design explained with implementation detail.',
                  },
                  {
                    t: 'Systems & workflow',
                    d: 'How tools fit into month-end cadence, approvals, and decision-making — not feature lists alone.',
                  },
                ].map((item) => (
                  <li key={item.t} className="grid gap-2 py-6 md:grid-cols-12 md:gap-8 md:py-8">
                    <span className="text-[15px] font-heading font-bold text-ink md:col-span-5">{item.t}</span>
                    <span className="text-[15px] leading-relaxed text-ink/55 md:col-span-7">{item.d}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-14 md:pt-20">
              <h2 className="text-2xl font-heading font-bold tracking-tight text-ink md:text-3xl">Editorial principles</h2>
              <ol className="mt-10 space-y-8">
                {[
                  {
                    n: '01',
                    t: 'Accuracy before publication',
                    d: 'Claims are checked against official sources and product behaviour we observe in testing.',
                  },
                  {
                    n: '02',
                    t: 'Operational relevance',
                    d: 'Every piece should improve a process, buying decision, or compliance posture — not fill a page.',
                  },
                  {
                    n: '03',
                    t: 'Transparency',
                    d: 'Affiliate relationships and disclosures are published; readers can see how we work.',
                  },
                ].map((item) => (
                  <li key={item.n} className="flex gap-6 md:gap-10">
                    <span className="shrink-0 text-[11px] font-semibold tabular-nums text-ink/35">{item.n}</span>
                    <div>
                      <h3 className="text-[17px] font-heading font-bold text-ink">{item.t}</h3>
                      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/55">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <footer className="mt-16 border-t border-ink/10 pt-12 md:mt-20 md:pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">Next step</p>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink/55">
                Editorial collaboration, factual corrections, or partnership standards — use the contact form and choose
                the subject line that fits.
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
