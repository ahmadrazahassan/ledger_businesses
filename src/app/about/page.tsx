import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Ledger Businesses is the authority in business intelligence, delivering premium editorial coverage for decision-makers who lead.',
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
              The Authority in Business Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-ink/60 leading-relaxed max-w-3xl">
              We deliver premium editorial coverage for decision-makers who refuse to compromise on quality, depth, and insight.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="mb-16 p-8 md:p-12 rounded-3xl bg-ink text-white">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-white/70 leading-relaxed">
              In an era of clickbait and superficial analysis, Ledger Businesses stands apart. We exist to serve leaders who demand more than headlines—they need context, nuance, and actionable intelligence. Our editorial team combines decades of business experience with rigorous research to deliver insights that matter.
            </p>
          </div>

          {/* What We Cover */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-8">What We Cover</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-ink/[0.06]">
                <h3 className="text-xl font-heading font-bold text-ink mb-3">Business Strategy</h3>
                <p className="text-ink/60 leading-relaxed">
                  From operational efficiency to market expansion, we analyze the strategies that separate industry leaders from followers. Our coverage goes beyond surface-level trends to examine the fundamental principles driving business success.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-ink/[0.06]">
                <h3 className="text-xl font-heading font-bold text-ink mb-3">Artificial Intelligence</h3>
                <p className="text-ink/60 leading-relaxed">
                  AI is reshaping every industry. We cut through the hype to deliver practical insights on implementation, ROI, and competitive advantage. Our analysis helps you understand not just what AI can do, but what it should do for your business.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-ink/[0.06]">
                <h3 className="text-xl font-heading font-bold text-ink mb-3">Startup Ecosystem</h3>
                <p className="text-ink/60 leading-relaxed">
                  We track the companies and founders building tomorrow's economy. Our startup coverage focuses on sustainable growth, unit economics, and the hard truths about building enduring businesses in competitive markets.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-ink/[0.06]">
                <h3 className="text-xl font-heading font-bold text-ink mb-3">Enterprise Software</h3>
                <p className="text-ink/60 leading-relaxed">
                  Software is eating the world, but not all software is created equal. We evaluate enterprise solutions through the lens of business value, examining adoption patterns, integration challenges, and long-term strategic fit.
                </p>
              </div>
            </div>
          </div>

          {/* Our Approach */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-8">Our Editorial Approach</h2>
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6 text-ink/70 leading-relaxed">
                <p>
                  Every article published on Ledger Businesses undergoes rigorous editorial review. We don't chase traffic with sensational headlines or publish content for the sake of volume. Instead, we focus on depth, accuracy, and relevance to our audience of business leaders and decision-makers.
                </p>
                <p>
                  Our editorial team includes former executives, industry analysts, and journalists with deep domain expertise. We leverage primary research, expert interviews, and data analysis to provide insights you won't find elsewhere. When we cover a topic, we aim to be the definitive source.
                </p>
                <p>
                  We maintain strict editorial independence. Our coverage is never influenced by advertisers, sponsors, or commercial relationships. When we recommend a solution or highlight a company, it's based solely on editorial merit and relevance to our readers.
                </p>
              </div>
            </div>
          </div>

          {/* Who Reads Us */}
          <div className="mb-16 p-8 md:p-12 rounded-3xl bg-accent/[0.06] border border-accent/10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-6">Who Reads Ledger Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-heading font-bold text-accent mb-2">50K+</div>
                <p className="text-ink/60">Monthly readers across enterprise, startup, and investment communities</p>
              </div>
              <div>
                <div className="text-4xl font-heading font-bold text-accent mb-2">C-Suite</div>
                <p className="text-ink/60">CEOs, CFOs, and senior executives who make strategic decisions</p>
              </div>
              <div>
                <div className="text-4xl font-heading font-bold text-accent mb-2">Global</div>
                <p className="text-ink/60">Readers in 120+ countries seeking authoritative business intelligence</p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-8">Our Values</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                <div>
                  <h3 className="text-xl font-heading font-bold text-ink mb-2">Quality Over Quantity</h3>
                  <p className="text-ink/60 leading-relaxed">
                    We publish when we have something meaningful to say, not to meet arbitrary content quotas. Every article must meet our standards for depth, accuracy, and insight.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                <div>
                  <h3 className="text-xl font-heading font-bold text-ink mb-2">Editorial Independence</h3>
                  <p className="text-ink/60 leading-relaxed">
                    Our coverage is never influenced by commercial relationships. We maintain a strict separation between editorial and business operations to ensure unbiased analysis.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                <div>
                  <h3 className="text-xl font-heading font-bold text-ink mb-2">Respect for Readers</h3>
                  <p className="text-ink/60 leading-relaxed">
                    We respect your time and intelligence. No clickbait, no fluff, no misleading headlines. Just substantive analysis delivered with clarity and precision.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                <div>
                  <h3 className="text-xl font-heading font-bold text-ink mb-2">Continuous Improvement</h3>
                  <p className="text-ink/60 leading-relaxed">
                    The business landscape evolves constantly, and so do we. We invest in our team, our processes, and our platform to deliver increasingly valuable insights to our readers.
                  </p>
                </div>
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
