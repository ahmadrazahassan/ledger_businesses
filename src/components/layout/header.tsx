'use client';

import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { LogoFull } from '@/components/brand/logo-full';
import { LogoSymbol } from '@/components/brand/logo-symbol';
import { IconSearch, IconClose, IconArrowRight } from '@/components/icons';
import { categoryHref, getCategoryNavLinks } from '@/config/category-navigation';

/** Header omits Reporting & Business Insights; footer and site taxonomy still include it. */
const navLinks = getCategoryNavLinks().filter(
  (link) => link.href !== categoryHref('reporting-business-insights')
);

const SCROLL_HIDE_PX = 40;
const BAR_TOP_GAP = 0;
const BAR_BOTTOM_GAP = 12;
const ANNOUNCEMENT_DISMISS_EVENT = 'ledger-announcement-dismissed';

function subscribeReducedMotion(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const navLinkClass =
  'px-1 py-0.5 text-[9px] lg:text-[10px] xl:text-[10.5px] 2xl:text-[11px] font-semibold uppercase tracking-[0.09em] text-ink/55 hover:text-ink transition-colors leading-tight';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stripHeight, setStripHeight] = useState(0);
  const [barHeight, setBarHeight] = useState(72);
  const [scrollHidden, setScrollHidden] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  const updateStripHeight = () => {
    const strip = document.getElementById('site-announcement-strip');
    setStripHeight(strip?.offsetHeight ?? 0);
  };

  const updateBarHeight = () => {
    const el = barRef.current;
    if (el) setBarHeight(el.offsetHeight);
  };

  useLayoutEffect(() => {
    updateStripHeight();
    const strip = document.getElementById('site-announcement-strip');
    if (!strip) return;
    const ro = new ResizeObserver(() => {
      updateStripHeight();
      updateBarHeight();
    });
    ro.observe(strip);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    updateBarHeight();
    const el = barRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateBarHeight());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onDismiss = () => setStripHeight(0);
    window.addEventListener(ANNOUNCEMENT_DISMISS_EVENT, onDismiss);
    return () => window.removeEventListener(ANNOUNCEMENT_DISMISS_EVENT, onDismiss);
  }, []);

  useEffect(() => {
    const onResize = () => {
      updateStripHeight();
      updateBarHeight();
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollHidden(window.scrollY > SCROLL_HIDE_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const offset = stripHeight + BAR_TOP_GAP + barHeight + BAR_BOTTOM_GAP;
    root.style.setProperty('--site-header-offset', `${offset}px`);
    return () => {
      root.style.removeProperty('--site-header-offset');
    };
  }, [stripHeight, barHeight]);

  const spacerHeight = BAR_TOP_GAP + barHeight + BAR_BOTTOM_GAP;
  const headerTop = stripHeight + BAR_TOP_GAP;
  const navHidden = scrollHidden && !mobileOpen;

  const transitionClass = prefersReducedMotion
    ? ''
    : 'transition-[transform,opacity] duration-300 ease-out';

  return (
    <>
      <div aria-hidden className="w-full shrink-0" style={{ height: spacerHeight }} />

      <header
        ref={barRef}
        className={`fixed left-0 right-0 z-50 w-full border-b border-ink/[0.07] bg-white/82 shadow-[0_1px_0_rgba(30,31,38,0.04)] backdrop-blur-xl backdrop-saturate-150 ${transitionClass} ${
          navHidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
        style={{
          top: headerTop,
          visibility: navHidden ? 'hidden' : 'visible',
        }}
        {...(navHidden ? { inert: true } : {})}
      >
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex h-[56px] md:h-[60px] items-center justify-between gap-4">
            <Link href="/" className="shrink-0 min-w-0">
              <span className="hidden sm:block">
                <LogoFull />
              </span>
              <span className="block sm:hidden">
                <LogoSymbol size={28} />
              </span>
            </Link>

            <nav
              className="hidden lg:flex flex-1 flex-wrap items-center justify-center gap-x-1 gap-y-1 px-0.5 xl:gap-x-1.5 2xl:gap-x-2"
              aria-label="Primary"
            >
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/search"
                className="flex w-9 h-9 items-center justify-center rounded-md border border-ink/[0.1] text-ink/45 hover:text-ink hover:bg-ink/[0.04] hover:border-ink/[0.14] transition-all"
                aria-label="Search"
              >
                <IconSearch size={15} />
              </Link>

              <Link
                href="/#newsletter"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[12px] font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Subscribe
                <IconArrowRight size={12} className="opacity-80" aria-hidden />
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md border border-ink/[0.1] text-ink/45 hover:text-ink transition-all"
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                <div className="flex flex-col items-center gap-[5px]">
                  <span
                    className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 ${
                      mobileOpen ? 'w-[14px] translate-y-[6.5px] rotate-45' : 'w-[14px]'
                    }`}
                  />
                  <span
                    className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 ${
                      mobileOpen ? 'w-0 opacity-0' : 'w-[10px]'
                    }`}
                  />
                  <span
                    className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 ${
                      mobileOpen
                        ? 'w-[14px] -translate-y-[6.5px] -rotate-45'
                        : 'w-[14px]'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-ink transition-opacity duration-500 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between h-[64px] px-4 border-b border-white/[0.06]">
            <Link href="/" onClick={() => setMobileOpen(false)} className="shrink-0">
              <LogoSymbol size={28} className="text-accent" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-md border border-white/10 text-white/50 hover:text-white transition-all"
              aria-label="Close menu"
            >
              <IconClose size={16} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-0 max-w-lg mx-auto">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center gap-4 py-4 border-b border-white/[0.06] last:border-b-0"
                >
                  <span className="w-8 h-8 rounded-md bg-white/[0.06] flex items-center justify-center text-[11px] font-mono text-accent/90 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[17px] sm:text-[19px] font-semibold text-white/90 tracking-[-0.02em] group-hover:text-accent transition-colors">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="px-6 pb-8 pt-2 border-t border-white/[0.06]">
            <Link
              href="/#newsletter"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-accent px-4 text-accent-foreground text-[13px] font-semibold transition-colors hover:bg-accent-hover"
            >
              Subscribe to Ledger Businesses
              <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
