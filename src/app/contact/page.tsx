import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Ledger Businesses team for inquiries, partnerships, or editorial submissions.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pt-16 md:pt-24 pb-16">
          {/* Header */}
          <div className="mb-16">
            <span className="inline-block px-3 py-1 bg-accent/15 text-accent text-xs font-bold rounded-full mb-6">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-ink leading-[1.1] tracking-tight mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-ink/60 leading-relaxed max-w-3xl">
              Whether you have a story tip, partnership inquiry, or feedback, we're here to listen. Reach out to the right team below.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Editorial */}
            <div className="p-8 rounded-3xl bg-white border border-ink/[0.06] hover:border-ink/10 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-ink mb-3">Editorial Team</h2>
              <p className="text-ink/60 leading-relaxed mb-6">
                Have a story tip, press release, or editorial inquiry? Our newsroom is always looking for compelling business stories that matter.
              </p>
              <a
                href="mailto:editorial@ledgerbusinesses.com"
                className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
              >
                editorial@ledgerbusinesses.com
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>

            {/* Advertising */}
            <div className="p-8 rounded-3xl bg-white border border-ink/[0.06] hover:border-ink/10 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-ink mb-3">Advertising & Partnerships</h2>
              <p className="text-ink/60 leading-relaxed mb-6">
                Interested in reaching 50,000+ business decision-makers? Let's discuss premium advertising placements and partnership opportunities.
              </p>
              <a
                href="mailto:advertise@ledgerbusinesses.com"
                className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
              >
                advertise@ledgerbusinesses.com
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>

            {/* General Inquiries */}
            <div className="p-8 rounded-3xl bg-white border border-ink/[0.06] hover:border-ink/10 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-ink mb-3">General Inquiries</h2>
              <p className="text-ink/60 leading-relaxed mb-6">
                Questions about our content, subscriptions, or general feedback? We're here to help and always appreciate hearing from our readers.
              </p>
              <a
                href="mailto:hello@ledgerbusinesses.com"
                className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
              >
                hello@ledgerbusinesses.com
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>

            {/* Technical Support */}
            <div className="p-8 rounded-3xl bg-white border border-ink/[0.06] hover:border-ink/10 hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-ink mb-3">Technical Support</h2>
              <p className="text-ink/60 leading-relaxed mb-6">
                Experiencing technical issues with our website or newsletter? Our support team will help resolve any problems you're encountering.
              </p>
              <a
                href="mailto:support@ledgerbusinesses.com"
                className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
              >
                support@ledgerbusinesses.com
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </div>

          {/* Response Time */}
          <div className="mb-16 p-8 rounded-3xl bg-accent/[0.06] border border-accent/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-ink mb-2">Response Time</h3>
                <p className="text-ink/70 leading-relaxed">
                  We aim to respond to all inquiries within 48 business hours. For urgent editorial matters or time-sensitive opportunities, please indicate "URGENT" in your subject line. We read every message and appreciate your patience as we work to provide thoughtful, comprehensive responses.
                </p>
              </div>
            </div>
          </div>

          {/* Press Kit */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-8">Press & Media</h2>
            <div className="p-8 rounded-3xl bg-white border border-ink/[0.06]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-heading font-bold text-ink mb-4">Media Kit</h3>
                  <p className="text-ink/60 leading-relaxed mb-6">
                    Need our logo, brand assets, or company information for a story? Download our comprehensive media kit with everything you need.
                  </p>
                  <a
                    href="mailto:press@ledgerbusinesses.com?subject=Media%20Kit%20Request"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white text-sm font-bold rounded-full hover:bg-ink/90 transition-all"
                  >
                    Request Media Kit
                  </a>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-ink mb-4">Press Inquiries</h3>
                  <p className="text-ink/60 leading-relaxed mb-6">
                    Journalists and media professionals can reach our press team for interviews, comments, or background information on business trends.
                  </p>
                  <a
                    href="mailto:press@ledgerbusinesses.com"
                    className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
                  >
                    press@ledgerbusinesses.com
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-8">Connect With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="https://twitter.com/ledgerbusinesses"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-white border border-ink/[0.06] hover:border-accent/20 hover:shadow-card transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-ink/[0.04] group-hover:bg-accent/10 flex items-center justify-center transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-ink/40 group-hover:text-accent transition-colors">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-ink">Twitter</h3>
                </div>
                <p className="text-sm text-ink/60">Follow us for real-time updates and industry insights</p>
              </a>

              <a
                href="https://linkedin.com/company/ledgerbusinesses"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-white border border-ink/[0.06] hover:border-accent/20 hover:shadow-card transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-ink/[0.04] group-hover:bg-accent/10 flex items-center justify-center transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-ink/40 group-hover:text-accent transition-colors">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-ink">LinkedIn</h3>
                </div>
                <p className="text-sm text-ink/60">Connect with our professional network</p>
              </a>

              <a
                href="/rss"
                className="p-6 rounded-2xl bg-white border border-ink/[0.06] hover:border-accent/20 hover:shadow-card transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-ink/[0.04] group-hover:bg-accent/10 flex items-center justify-center transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-ink/40 group-hover:text-accent transition-colors">
                      <path d="M4 11a9 9 0 019 9" />
                      <path d="M4 4a16 16 0 0116 16" />
                      <circle cx="5" cy="19" r="1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-ink">RSS Feed</h3>
                </div>
                <p className="text-sm text-ink/60">Subscribe to our content feed</p>
              </a>
            </div>
          </div>

          {/* Office Info */}
          <div className="p-8 md:p-12 rounded-3xl bg-ink text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">Our Commitment</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  Every message we receive is read by a real person on our team. We value your time and input, whether you're sharing a story tip, providing feedback, or exploring a partnership opportunity.
                </p>
                <p className="text-white/70 leading-relaxed">
                  Ledger Businesses is built on the principle that quality journalism requires quality relationships. We're committed to responsive, thoughtful communication with our readers, partners, and the broader business community.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold mb-6">Quick Links</h3>
                <div className="space-y-3">
                  <a href="/about" className="block text-white/70 hover:text-accent transition-colors">About Us</a>
                  <a href="/privacy" className="block text-white/70 hover:text-accent transition-colors">Privacy Policy</a>
                  <a href="/terms" className="block text-white/70 hover:text-accent transition-colors">Terms of Service</a>
                  <a href="/affiliate-disclosure" className="block text-white/70 hover:text-accent transition-colors">Affiliate Disclosure</a>
                  <a href="/#newsletter" className="block text-white/70 hover:text-accent transition-colors">Newsletter Signup</a>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
