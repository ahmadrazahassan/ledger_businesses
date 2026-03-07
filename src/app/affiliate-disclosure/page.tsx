import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'Learn about Ledger Businesses affiliate relationships and how we maintain editorial independence.',
  alternates: {
    canonical: '/affiliate-disclosure',
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pt-16 md:pt-24 pb-16">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block px-3 py-1 bg-accent/15 text-accent text-xs font-bold rounded-full mb-6">
              Transparency
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-ink leading-tight mb-4">
              Affiliate Disclosure
            </h1>
            <p className="text-lg text-ink/60">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12 p-6 rounded-2xl bg-accent/[0.06] border border-accent/10">
            <p className="text-ink/70 leading-relaxed">
              At Ledger Businesses, transparency is fundamental to our relationship with readers. This disclosure explains our affiliate relationships, how we earn revenue, and how we maintain editorial independence despite these commercial arrangements.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">What Are Affiliate Relationships?</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Affiliate marketing is a performance-based arrangement where we earn a commission when readers purchase products or services through links on our website. These relationships help support our editorial operations and allow us to provide free, high-quality content to our readers.
                  </p>
                  <p>
                    When you click an affiliate link and make a purchase, the company pays us a small percentage of the sale. This comes at no additional cost to you—the price you pay is the same whether you use our link or go directly to the company's website.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">Our Affiliate Partners</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Ledger Businesses participates in affiliate programs with select companies and platforms, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Software and SaaS platforms relevant to business operations</li>
                    <li>Business tools and productivity applications</li>
                    <li>Professional services and consulting firms</li>
                    <li>Educational resources and training programs</li>
                    <li>Books and publications on business topics</li>
                    <li>Conference and event registrations</li>
                  </ul>
                  <p>
                    We carefully select affiliate partners based on their relevance to our audience and the quality of their offerings. We only promote products and services that we believe provide genuine value to business leaders and decision-makers.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">Editorial Independence</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Our editorial content is never influenced by affiliate relationships or potential commission earnings. We maintain strict separation between our editorial and business operations to ensure unbiased coverage.
                  </p>
                  
                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">Our Commitments:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We never recommend products or services solely because they offer affiliate commissions</li>
                    <li>Our editorial team has full autonomy in content creation and product evaluation</li>
                    <li>We disclose affiliate relationships clearly when they exist</li>
                    <li>We regularly review products and services we recommend to ensure they continue to meet our standards</li>
                    <li>We will criticize or provide negative coverage of affiliate partners if warranted by facts</li>
                    <li>We do not accept payment for positive coverage or editorial placement</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">How We Identify Affiliate Links</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We believe in transparency. When an article contains affiliate links, we clearly disclose this in one or more of the following ways:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>A disclosure statement at the beginning or end of the article</li>
                    <li>Inline disclosures near affiliate links when appropriate</li>
                    <li>Visual indicators or labels on affiliate links</li>
                  </ul>
                  <p>
                    Not all links on our website are affiliate links. We link to many resources, companies, and articles without any commercial relationship. We only use affiliate links when they're relevant to the content and provide value to readers.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">Our Review Process</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    When we review products or services that have affiliate programs, we follow a rigorous evaluation process:
                  </p>
                  
                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">Research and Testing</h3>
                  <p>
                    We conduct thorough research and, when possible, hands-on testing of products and services. Our reviews are based on actual experience, user feedback, industry analysis, and objective criteria.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">Comparative Analysis</h3>
                  <p>
                    We compare products against competitors, including those without affiliate programs. Our goal is to help you make informed decisions, not to drive affiliate revenue.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">Honest Assessment</h3>
                  <p>
                    We provide balanced coverage that includes both strengths and weaknesses. If a product isn't suitable for certain use cases or audiences, we say so clearly.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">Revenue and Sustainability</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Ledger Businesses generates revenue through multiple channels to ensure financial sustainability and editorial independence:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Affiliate commissions from product and service recommendations</li>
                    <li>Premium advertising placements for enterprise brands</li>
                    <li>Sponsored content (clearly labeled and editorially independent)</li>
                    <li>Newsletter subscriptions and premium content offerings</li>
                  </ul>
                  <p>
                    This diversified revenue model ensures that no single source of income can influence our editorial direction. We're accountable to our readers first, not to advertisers or affiliate partners.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">Your Trust Matters</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We understand that trust is earned through consistent, transparent behavior. Our affiliate relationships exist to support our mission of delivering premium business intelligence, not to compromise it.
                  </p>
                  <p>
                    If you ever feel that our affiliate relationships have influenced our editorial judgment, we want to hear from you. Your feedback helps us maintain the standards that define Ledger Businesses.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">FTC Compliance</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Ledger Businesses complies with the Federal Trade Commission's guidelines on endorsements and testimonials. We disclose material connections between our website and the companies we mention when such connections exist.
                  </p>
                  <p>
                    Our affiliate disclosures meet or exceed FTC requirements for clarity and prominence. We believe that transparent disclosure benefits both our readers and our business.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">Updates to This Disclosure</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We may update this affiliate disclosure as our business relationships evolve or as regulations change. Material changes will be reflected in the "Last updated" date at the top of this page.
                  </p>
                  <p>
                    We encourage you to review this disclosure periodically to stay informed about how we maintain transparency in our affiliate relationships.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">Questions and Concerns</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    If you have questions about our affiliate relationships, editorial policies, or specific disclosures, please contact us:
                  </p>
                  <div className="p-6 rounded-2xl bg-white border border-ink/[0.06] mt-4">
                    <p className="font-semibold text-ink mb-2">Ledger Businesses</p>
                    <p>Email: editorial@ledgerbusinesses.com</p>
                    <p>Contact Form: <a href="/contact" className="text-accent hover:underline">ledgerbusinesses.com/contact</a></p>
                  </div>
                  <p className="mt-4">
                    We're committed to transparency and welcome your feedback on how we can better serve our readers while maintaining the financial sustainability necessary to produce high-quality journalism.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-ink text-white">
            <h3 className="text-2xl font-heading font-bold mb-3">Our Promise to You</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              We will always prioritize your trust over short-term revenue. Our affiliate relationships exist to support our editorial mission, not to compromise it. When we recommend something, it's because we genuinely believe it provides value to business leaders like you.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-bold rounded-full hover:brightness-110 transition-all"
            >
              Learn More About Us
            </a>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
