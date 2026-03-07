import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Ledger Businesses is the premier resource for accounting, finance, and business operations professionals.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pt-16 md:pt-24 pb-16">
          {/* Header */}
          <div className="mb-16">
            <span className="inline-block px-3 py-1 bg-accent/15 text-accent text-xs font-bold rounded-full mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-ink leading-[1.1] tracking-tight mb-6">
              Empowering Financial Excellence
            </h1>
            <p className="text-xl md:text-2xl text-ink/60 leading-relaxed max-w-3xl">
              Ledger Businesses is the definitive guide for modern accounting, payroll, and HR professionals navigating the digital economy.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="mb-16 p-8 md:p-12 rounded-3xl bg-ink text-white">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-white/70 leading-relaxed">
              We exist to bridge the gap between traditional financial practices and modern technological solutions. Our mission is to equip business owners, accountants, and HR leaders with the actionable intelligence they need to streamline operations, ensure compliance, and drive sustainable growth.
            </p>
          </div>

          {/* What We Cover */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-8">What We Cover</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-ink/[0.06]">
                <h3 className="text-xl font-heading font-bold text-ink mb-3">Accounting & Bookkeeping</h3>
                <p className="text-ink/60 leading-relaxed">
                  Deep dives into cloud accounting, financial reporting standards, and best practices for maintaining pristine books. We help you choose the right tools and methodologies for your business size and sector.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-ink/[0.06]">
                <h3 className="text-xl font-heading font-bold text-ink mb-3">Payroll & HR</h3>
                <p className="text-ink/60 leading-relaxed">
                  Navigating the complexities of workforce management, from PAYE and pension compliance to HR automation. We provide clear guidance on keeping your team paid and your business compliant.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-ink/[0.06]">
                <h3 className="text-xl font-heading font-bold text-ink mb-3">Tax Compliance</h3>
                <p className="text-ink/60 leading-relaxed">
                  Essential updates on VAT, Corporation Tax, and Making Tax Digital (MTD). Our expert analysis ensures you stay ahead of regulatory changes and avoid costly penalties.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-ink/[0.06]">
                <h3 className="text-xl font-heading font-bold text-ink mb-3">Business Technology</h3>
                <p className="text-ink/60 leading-relaxed">
                  Reviews and implementation guides for the software that powers modern business. From ERP systems to automated invoicing, we help you build a tech stack that works.
                </p>
              </div>
            </div>
          </div>

          {/* Our Approach */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-8">Our Editorial Standards</h2>
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6 text-ink/70 leading-relaxed">
                <p>
                  Accuracy and utility are at the core of everything we publish. Ledger Businesses is committed to providing content that is not only factually correct but also practically useful. We understand that our readers rely on our insights to make critical financial decisions.
                </p>
                <p>
                  Our editorial team consists of experienced financial writers and industry analysts who understand the nuances of the UK business landscape. We rigorously fact-check our articles against official government guidance (HMRC) and industry standards to ensure reliability.
                </p>
                <p>
                  <b>Editorial Independence:</b> While we may partner with leading software providers to bring you in-depth reviews and offers, our editorial opinions remain our own. We recommend solutions based on their ability to solve real business problems, not just commercial incentives.
                </p>
              </div>
            </div>
          </div>

          {/* Who Reads Us */}
          <div className="mb-16 p-8 md:p-12 rounded-3xl bg-accent/[0.06] border border-accent/10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-6">Our Audience</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-heading font-bold text-accent mb-2">SMEs</div>
                <p className="text-ink/60">Small and medium-sized enterprises looking to scale efficiently.</p>
              </div>
              <div>
                <div className="text-4xl font-heading font-bold text-accent mb-2">Finance Pros</div>
                <p className="text-ink/60">Accountants and bookkeepers seeking the latest industry tools.</p>
              </div>
              <div>
                <div className="text-4xl font-heading font-bold text-accent mb-2">Decision Makers</div>
                <p className="text-ink/60">Founders and Directors responsible for financial strategy.</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="p-8 md:p-12 rounded-3xl bg-ink text-white text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-white/70 mb-6 max-w-2xl mx-auto">
              Have a story tip, partnership inquiry, or feedback? We'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white text-sm font-bold rounded-full hover:brightness-110 transition-all"
            >
              Contact Us
            </a>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
