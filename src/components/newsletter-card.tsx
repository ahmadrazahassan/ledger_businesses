'use client';

import { useState } from 'react';
import { IconArrowRight } from '@/components/icons';

export function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="rounded-[28px] md:rounded-[36px] bg-accent overflow-hidden">
      <div className="px-8 py-16 md:px-16 md:py-20 text-center">
        {/* Eyebrow */}
        <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] bg-accent-foreground/10 text-accent-foreground rounded-full mb-7">
          Newsletter
        </span>

        <h2 className="text-3xl md:text-[44px] font-heading font-bold text-accent-foreground leading-[1.1] mb-4">
          Email updates
        </h2>

        <p className="text-[15px] text-accent-foreground/75 leading-relaxed mb-10 max-w-md mx-auto">
          Occasional updates when we publish UK software reviews or compliance explainers. Editorial content only — no paid
          placements in email. Unsubscribe any time.
        </p>

        {submitted ? (
          <div className="py-4">
            <div className="w-12 h-12 rounded-full bg-accent-foreground/10 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-accent-foreground">
                <path d="M4 10.5l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[17px] font-bold text-accent-foreground mb-1">Welcome aboard.</p>
            <p className="text-[13px] text-accent-foreground/65">Check your inbox for a confirmation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-3.5 bg-white border-0 rounded-full text-[14px] text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-accent-foreground/15 transition-all"
              suppressHydrationWarning
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent-foreground text-accent text-[13px] font-semibold rounded-full transition-colors hover:bg-accent-foreground/90 shrink-0"
            >
              Subscribe
              <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                <IconArrowRight size={11} className="text-accent" />
              </span>
            </button>
          </form>
        )}

        <p className="text-[11px] text-accent-foreground/45 mt-6">
          Free forever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
