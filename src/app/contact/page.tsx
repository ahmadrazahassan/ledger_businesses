'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CONTACT_EMAIL, CONTACT_MAILTO, INSTAGRAM_HREF, SITE_DOMAIN } from '@/lib/site';
import { EditorialSubmitButton } from '@/components/ui/editorial-cta';

const inputClass =
  'w-full bg-transparent border-0 border-b border-ink/20 pb-2.5 pt-1 text-[15px] text-ink placeholder:text-ink/40 focus:border-ink focus:ring-0 focus:outline-none transition-[border-color] duration-200';

const labelClass = 'block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45 mb-2';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `From: ${formState.name}`,
      formState.company ? `Company: ${formState.company}` : null,
      `Email: ${formState.email}`,
      '',
      formState.message,
    ]
      .filter(Boolean)
      .join('\n');
    const mailtoLink = `${CONTACT_MAILTO}?subject=${encodeURIComponent(formState.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
          <div className="rounded-2xl border border-ink/12 bg-white px-6 py-10 md:px-10 md:py-14 lg:px-12 lg:py-16">
            {submitted ? (
              <div className="mx-auto max-w-md py-16 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">Message ready</p>
                <h2 className="mt-4 text-2xl font-heading font-bold tracking-tight text-ink md:text-3xl">
                  Open your email client to send
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/55">
                  If nothing opened, write to{' '}
                  <a href={CONTACT_MAILTO} className="text-ink underline underline-offset-4 decoration-ink/25 hover:decoration-ink">
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({ name: '', company: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-12 inline-flex items-center gap-3 border border-ink/15 bg-white px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:border-ink/30 hover:bg-ink/[0.02]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20 lg:items-start">
                {/* Left — positioning & contact lines */}
                <div className="flex flex-col justify-between gap-12 lg:min-h-[420px]">
                  <div>
                    <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-heading font-bold leading-[1.05] tracking-[-0.04em] text-ink">
                      Let&apos;s collaborate
                    </h1>
                    <a
                      href={CONTACT_MAILTO}
                      className="mt-6 inline-block text-[15px] text-ink/50 transition-colors hover:text-ink"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>

                  <div className="flex flex-col gap-6 border-t border-ink/10 pt-8 text-[13px] text-ink/55 md:flex-row md:items-end md:justify-between md:gap-8">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">Find us</p>
                      <div className="mt-3">
                        <a
                          href={INSTAGRAM_HREF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-ink transition-colors hover:text-ink/70"
                        >
                          Instagram
                        </a>
                      </div>
                    </div>
                    <div className="text-right md:text-right">
                      <p>Birmingham, United Kingdom</p>
                      <p className="mt-1 text-ink/40">Editorial · {SITE_DOMAIN}</p>
                    </div>
                  </div>
                </div>

                {/* Right — form */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">Say hello</p>
                  <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <div>
                      <label htmlFor="contact-name" className={labelClass}>
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        required
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className={labelClass}>
                        Subject
                      </label>
                      <select
                        id="contact-subject"
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        required
                        className={`${inputClass} cursor-pointer appearance-none bg-[length:12px] bg-[position:right_0_top_50%] bg-no-repeat pr-6`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        }}
                      >
                        <option value="" disabled>
                          Choose subject
                        </option>
                        <option value="Editorial inquiry">Editorial inquiry</option>
                        <option value="Partnership or brand enquiry">Partnership or brand enquiry</option>
                        <option value="Affiliate disclosure question">Affiliate disclosure question</option>
                        <option value="Media or press">Media or press</option>
                        <option value="Technical or site feedback">Technical or site feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-company" className={labelClass}>
                        Company
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        autoComplete="organization"
                        value={formState.company}
                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                        placeholder="Company or practice name (optional)"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        required
                        placeholder={`you@${SITE_DOMAIN}`}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className={labelClass}>
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        required
                        rows={4}
                        placeholder="Start typing here"
                        className={`${inputClass} resize-none leading-relaxed`}
                      />
                    </div>

                    <div className="pt-4">
                      <EditorialSubmitButton>Submit</EditorialSubmitButton>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
