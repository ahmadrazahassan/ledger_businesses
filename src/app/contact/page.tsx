'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { CONTACT_EMAIL, CONTACT_MAILTO, SITE_DOMAIN } from '@/lib/site';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `${CONTACT_MAILTO}?subject=${encodeURIComponent(formState.subject)}&body=${encodeURIComponent(`From: ${formState.name} (${formState.email})\n\n${formState.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pt-16 md:pt-24 pb-20 md:pb-28">
          {/* Hero Section */}
          <div className="mb-14 md:mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[13px] font-semibold text-accent-content uppercase tracking-[0.12em]">
                Available to connect
              </span>
            </div>
            <h1 className="text-[44px] md:text-[72px] lg:text-[84px] font-heading font-bold text-ink leading-[0.95] tracking-[-0.04em] mb-6">
              Let&apos;s start a<br />
              <span className="text-ink/30">conversation.</span>
            </h1>
            <p className="text-[18px] md:text-[22px] text-ink/50 leading-relaxed max-w-2xl">
              Whether it&apos;s a story tip, partnership inquiry, or just feedback — I&apos;d love to hear from you.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

            {/* Left — Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Email Card */}
              <div className="group">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 mb-3">Email</p>
                <a
                  href={CONTACT_MAILTO}
                  className="flex items-center gap-3.5 px-4 py-4 rounded-2xl border border-ink/[0.06] bg-white hover:border-accent/20 hover:shadow-lg hover:shadow-accent/[0.04] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-content">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-ink group-hover:text-accent-content transition-colors break-all">{CONTACT_EMAIL}</p>
                    <p className="text-[12px] text-ink/40 mt-0.5">For all inquiries</p>
                  </div>
                </a>
              </div>

              {/* Social */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 mb-3">Social</p>
                <a
                  href="https://www.instagram.com/fiza_rana_42"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 px-4 py-4 rounded-2xl border border-ink/[0.06] bg-white hover:border-accent/20 hover:shadow-lg hover:shadow-accent/[0.04] transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-ink/[0.04] group-hover:bg-accent/10 flex items-center justify-center shrink-0 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40 group-hover:text-accent-content transition-colors">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-ink group-hover:text-accent-content transition-colors">Instagram</p>
                    <p className="text-[12px] text-ink/40 mt-0.5">@fiza_rana_42</p>
                  </div>
                </a>
              </div>

              {/* Response Time */}
              <div className="px-4 py-4 rounded-2xl bg-accent/[0.06] border border-accent/10">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-content">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <p className="text-[13px] font-bold text-ink">Response Time</p>
                </div>
                <p className="text-[13px] text-ink/55 leading-relaxed">
                  I aim to respond within 48 hours. For urgent matters, add &quot;URGENT&quot; in the subject line.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 mb-3">Quick Links</p>
                <div className="space-y-2">
                  {[
                    { label: 'About Us', href: '/about' },
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Terms of Service', href: '/terms' },
                    { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
                    { label: 'Newsletter Signup', href: '/#newsletter' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex items-center justify-between p-3 rounded-xl text-[14px] text-ink/60 hover:text-ink hover:bg-ink/[0.03] transition-all"
                    >
                      {link.label}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/20">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="h-full flex items-center justify-center p-12 rounded-3xl border border-accent/15 bg-accent/[0.04]">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-content">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-ink mb-3">Message Sent!</h3>
                    <p className="text-ink/50 leading-relaxed max-w-sm mx-auto">
                      Your email client should have opened. If not, you can reach me directly at{' '}
                      <a href={CONTACT_MAILTO} className="text-accent-content font-medium">
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormState({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="mt-8 px-6 py-2.5 rounded-full text-[13px] font-semibold border border-ink/10 text-ink/60 hover:border-ink/20 hover:text-ink transition-all"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="p-8 md:p-10 rounded-3xl border border-ink/[0.06] bg-white">
                    <h2 className="text-[26px] md:text-[32px] font-heading font-bold text-ink mb-2">
                      Send a message
                    </h2>
                    <p className="text-[15px] text-ink/45 mb-10">
                      Fill out the form below and I&apos;ll get back to you shortly.
                    </p>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="contact-name" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink/40 mb-2.5">
                            Your Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            required
                            placeholder="John Doe"
                            className="w-full px-4 py-3.5 rounded-xl border border-ink/[0.08] bg-slate-50/50 text-[15px] text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink/40 mb-2.5">
                            Email Address
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            required
                            placeholder={`you@${SITE_DOMAIN}`}
                            className="w-full px-4 py-3.5 rounded-xl border border-ink/[0.08] bg-slate-50/50 text-[15px] text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-subject" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink/40 mb-2.5">
                          Subject
                        </label>
                        <select
                          id="contact-subject"
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          required
                          className="w-full px-4 py-3.5 rounded-xl border border-ink/[0.08] bg-slate-50/50 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all appearance-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 16px center',
                          }}
                        >
                          <option value="">Select a topic</option>
                          <option value="Editorial Inquiry">Editorial Inquiry</option>
                          <option value="Partnership Opportunity">Partnership Opportunity</option>
                          <option value="Advertising">Advertising</option>
                          <option value="Media & Press">Media & Press</option>
                          <option value="General Feedback">General Feedback</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink/40 mb-2.5">
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          required
                          rows={5}
                          placeholder="Tell me what you have in mind..."
                          className="w-full px-4 py-3.5 rounded-xl border border-ink/[0.08] bg-slate-50/50 text-[15px] text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-ink text-white text-[15px] font-bold hover:bg-ink/90 active:scale-[0.995] transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    Send Message
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
