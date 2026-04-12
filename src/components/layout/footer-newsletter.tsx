'use client';

import { useState } from 'react';
import { IconArrowRight, IconMail } from '@/components/icons';

type FooterNewsletterProps = {
  /** Investa-style integrated field (footer dark theme). */
  variant?: 'inline' | 'investa';
};

function IconUserOutline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 19.25c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FooterNewsletter({ variant = 'inline' }: FooterNewsletterProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  if (done) {
    return (
      <p
        className={`text-[14px] font-medium ${variant === 'investa' ? 'text-white/70' : 'text-ink/70'}`}
      >
        Thanks — you&apos;re on the list.
      </p>
    );
  }

  if (variant === 'investa') {
    return (
      <div className="w-full max-w-[420px]">
        <h3 className="mb-5 text-[17px] font-semibold tracking-[-0.02em] text-white">Subscribe to newsletter.</h3>
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.06] py-1.5 pl-4 pr-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors focus-within:border-white/20 focus-within:bg-white/[0.08]"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-white placeholder:text-white/40 focus:outline-none"
          />
          <span className="shrink-0 text-white/35" aria-hidden>
            <IconUserOutline className="text-current" />
          </span>
          <button
            type="submit"
            aria-label="Subscribe"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            <IconArrowRight size={18} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2">
      <div className="relative flex min-h-[44px] flex-1 items-center rounded-full border border-ink/[0.12] bg-white pl-4 pr-10 shadow-[0_1px_2px_rgba(30,31,38,0.04)] focus-within:border-accent-content/25 focus-within:ring-1 focus-within:ring-accent/20">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          autoComplete="email"
          className="h-full w-full min-w-0 bg-transparent text-[14px] text-ink placeholder:text-ink/30 focus:outline-none"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/25">
          <IconMail size={18} />
        </span>
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-[13px] font-semibold text-accent-foreground transition-colors hover:bg-accent-hover sm:min-w-[120px]"
      >
        Subscribe
      </button>
    </form>
  );
}
