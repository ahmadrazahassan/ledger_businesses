'use client';

import Link from 'next/link';
import { LogoSymbol } from '@/components/brand/logo-symbol';
import { useCookieBanner } from '@/components/ui/cookie-banner-provider';

/**
 * Minimal bottom consent bar. Sits above the Ledger AI composer (z-index + assistant offset via {@link useCookieBanner}).
 */
export function CookieBanner() {
  const { showBanner, accept, decline } = useCookieBanner();

  if (!showBanner) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-5 sm:pb-[max(1rem,env(safe-area-inset-bottom))] sm:pt-3"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div className="pointer-events-auto w-full max-w-4xl rounded-2xl border border-ink/[0.08] bg-white/[0.96] shadow-[0_-4px_32px_rgba(30,31,38,0.08),0_0_0_1px_rgba(0,0,0,0.03)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:gap-5 sm:p-4">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
            <span aria-hidden className="mt-0.5 inline-flex shrink-0 sm:mt-0">
              <LogoSymbol size={24} variant="dark" className="opacity-[0.92]" />
            </span>
            <div className="min-w-0">
              <h2
                id="cookie-banner-title"
                className="font-heading text-[13px] font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-sm"
              >
                Cookies
              </h2>
              <p id="cookie-banner-desc" className="mt-0.5 text-[11px] leading-[1.45] text-ink/[0.58] sm:mt-0 sm:inline sm:text-[12px] sm:leading-snug">
                <span className="sm:mr-1">
                  We use cookies to run and improve the site. See our{' '}
                  <Link
                    href="/privacy"
                    className="font-medium text-accent-content underline decoration-accent-content/25 underline-offset-[2px] transition-colors hover:decoration-accent-content"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
            <button
              type="button"
              onClick={decline}
              className="order-2 rounded-xl border border-ink/[0.1] bg-white/90 px-4 py-2 text-center text-[11px] font-semibold text-ink/[0.75] transition-colors hover:border-ink/[0.16] hover:bg-ink/[0.04] sm:order-1 sm:py-2.5 sm:text-[12px]"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={accept}
              className="order-1 rounded-xl bg-accent px-4 py-2 text-center text-[11px] font-semibold text-accent-foreground transition-colors hover:bg-accent-hover active:brightness-95 sm:order-2 sm:py-2.5 sm:text-[12px]"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
