'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogoFull } from '@/components/brand/logo-full';
import { LogoSymbol } from '@/components/brand/logo-symbol';
import { IconSearch, IconClose, IconArrowRight } from '@/components/icons';

const navLinks = [
  { label: 'Business', href: '/category/business' },
  { label: 'AI', href: '/category/ai' },
  { label: 'Startups', href: '/category/startups' },
  { label: 'B2B', href: '/category/b2b' },
  { label: 'Software', href: '/category/software' },
  { label: 'Funding', href: '/category/funding' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-cream/90 shadow-[0_1px_2px_rgba(30,31,38,0.04)]'
          : 'bg-cream'
          }`}
        style={scrolled ? { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } : undefined}
      >
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex items-center justify-between h-[64px]">

            {/* ── Logo ── */}
            <Link href="/" className="shrink-0 relative z-10">
              <span className="hidden sm:block"><LogoFull /></span>
              <span className="block sm:hidden"><LogoSymbol size={28} /></span>
            </Link>

            {/* ── Center: Dark pill navigation ── */}
            <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-[2px] px-1.5 py-1.5 bg-ink rounded-full">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="relative px-4 py-[6px] text-[13px] font-medium text-white/50 hover:text-accent rounded-full hover:bg-white/[0.06] transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* ── Right: Actions ── */}
            <div className="flex items-center gap-2 relative z-10">
              {/* Search */}
              <Link
                href="/search"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-ink/[0.08] text-ink/35 hover:text-ink hover:border-ink/[0.15] hover:bg-ink/[0.03] transition-all duration-200"
                aria-label="Search"
              >
                <IconSearch size={15} />
              </Link>

              {/* Subscribe — green accent pill */}
              <Link
                href="#newsletter"
                className="hidden sm:inline-flex items-center gap-1.5 pl-4 pr-3 py-[7px] bg-accent text-white text-[13px] font-semibold rounded-full hover:brightness-110 transition-all duration-200"
              >
                Subscribe
                <span className="w-5 h-5 rounded-full bg-ink/[0.1] flex items-center justify-center">
                  <IconArrowRight size={10} />
                </span>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-ink/[0.08] text-ink/40 hover:text-ink transition-all"
                aria-label="Menu"
              >
                <div className="flex flex-col items-center gap-[5px]">
                  <span className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'w-[14px] translate-y-[6.5px] rotate-45' : 'w-[14px]'}`} />
                  <span className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'w-0 opacity-0' : 'w-[10px]'}`} />
                  <span className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'w-[14px] -translate-y-[6.5px] -rotate-45' : 'w-[14px]'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Full-screen mobile overlay ── */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${mobileOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-ink transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Top bar */}
          <div className="flex items-center justify-between h-[64px] px-4">
            <Link href="/" onClick={() => setMobileOpen(false)} className="shrink-0">
              <LogoSymbol size={28} className="text-accent" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white transition-all"
              aria-label="Close menu"
            >
              <IconClose size={16} />
            </button>
          </div>

          {/* Nav links — large editorial */}
          <nav className="flex-1 flex flex-col justify-center px-6 -mt-10">
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-5 py-5 border-b border-white/[0.05] last:border-b-0"
              >
                <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[11px] font-mono text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[28px] sm:text-[36px] font-bold text-white/85 tracking-[-0.02em] group-hover:text-accent transition-colors duration-200">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="px-6 pb-8">
            <Link
              href="#newsletter"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-accent text-white text-[13px] font-semibold rounded-full"
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
