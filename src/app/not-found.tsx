import Link from 'next/link';
import { Caveat } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { IconArrowRight } from '@/components/icons';

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Page not found',
  description: 'The page you requested could not be found.',
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative bg-white">
        <div className="relative flex min-h-[min(85vh,880px)] flex-col items-center justify-center overflow-hidden px-6 py-16 md:py-24">
          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(30, 31, 38, 0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(30, 31, 38, 0.06) 1px, transparent 1px)
              `,
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse 70% 65% at 50% 45%, black 20%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 65% at 50% 45%, black 20%, transparent 75%)',
            }}
            aria-hidden
          />

          {/* Soft accent glows (Finray-style depth, brand accent) */}
          <div
            className="pointer-events-none absolute -bottom-24 left-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/[0.09] blur-[100px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-20 top-1/3 h-[280px] w-[280px] rounded-full bg-accent/25 blur-[90px]"
            aria-hidden
          />

          <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
            <div className="relative mx-auto inline-block">
              {/* Handwritten-style callout */}
              <div className="absolute -top-2 right-0 z-10 translate-x-[min(8vw,3.5rem)] -translate-y-[60%] md:translate-x-[min(12vw,5rem)] md:-translate-y-[70%]">
                <svg
                  className="mx-auto mb-1 h-12 w-24 text-ink/35 md:h-14 md:w-28"
                  viewBox="0 0 120 48"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M8 38 C 35 8, 70 4, 108 18"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M100 14 L108 18 L104 26"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <p
                  className={`${caveat.className} text-[1.35rem] leading-tight text-ink md:text-[1.5rem]`}
                >
                  Something went wrong!
                </p>
                <span className="mt-2 inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-accent-foreground">
                  Oops!
                </span>
              </div>

              <p
                className="font-heading text-[clamp(5.5rem,20vw,11rem)] font-bold leading-[0.92] tracking-[-0.04em] text-ink"
                aria-hidden
              >
                404
              </p>
            </div>

            <h1 className="sr-only">404 — Page not found</h1>
            <h2 className="mt-8 text-[1.5rem] font-bold leading-snug text-ink md:text-[1.875rem] md:leading-tight">
              Hmm… this page isn&apos;t here
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink/55 md:text-[16px]">
              It may have moved, or the link might be out of date. Head back home or open the menu to find
              what you need.
            </p>

            <Link
              href="/"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3 text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(30,31,38,0.12)] transition-transform hover:-translate-y-0.5 hover:bg-ink/92 md:px-8 md:py-3.5"
            >
              Back to home
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform group-hover:translate-x-0.5">
                <IconArrowRight size={16} className="-mr-px" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
