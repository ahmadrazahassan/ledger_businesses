'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { useCookieBanner } from '@/components/ui/cookie-banner-provider';

/**
 * Floating consent card (premium editorial pattern). Stacks above the Ledger AI composer via z-index;
 * the assistant reads {@link useCookieBanner} and lifts when this is visible.
 */
export function CookieBanner() {
  const { showBanner, accept, decline } = useCookieBanner();

  if (!showBanner) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div
        className="pointer-events-auto w-full max-w-[min(100%,26rem)] sm:max-w-xl rounded-[20px] border border-ink/[0.08] bg-white/[0.92] shadow-[0_12px_48px_rgba(30,31,38,0.14),0_0_0_1px_rgba(0,0,0,0.03)] backdrop-blur-2xl"
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
          <div className="flex shrink-0 justify-center sm:pt-0.5 sm:justify-start">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink/[0.04] text-accent-content ring-1 ring-ink/[0.06]">
              <Shield size={22} strokeWidth={1.75} aria-hidden />
            </span>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2
              id="cookie-banner-title"
              className="font-heading text-[15px] font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-base"
            >
              Cookies & privacy
            </h2>
            <p id="cookie-banner-desc" className="mt-2 text-[13px] leading-[1.55] text-ink/[0.68] sm:text-[14px]">
              We use cookies to run the site, remember preferences, and understand traffic. You can accept
              all cookies or decline non-essential ones. See our{' '}
              <Link
                href="/privacy"
                className="font-medium text-accent-content underline decoration-accent-content/30 underline-offset-2 transition-colors hover:decoration-accent-content"
              >
                Privacy Policy
              </Link>{' '}
              for details (UK GDPR).
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-end">
              <button
                type="button"
                onClick={decline}
                className="order-2 w-full rounded-full border border-ink/[0.12] bg-white/80 px-5 py-2.5 text-[13px] font-semibold text-ink/80 shadow-sm transition-colors hover:border-ink/[0.18] hover:bg-ink/[0.04] sm:order-1 sm:w-auto"
              >
                Essential only
              </button>
              <button
                type="button"
                onClick={accept}
                className="order-1 w-full rounded-full bg-accent px-5 py-2.5 text-[13px] font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover active:brightness-95 sm:order-2 sm:w-auto"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
