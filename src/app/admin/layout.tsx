'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoFull } from '@/components/brand/logo-full';
import { useState, useEffect, useRef } from 'react';
import { ToastProvider } from '@/components/ui/toast';

const adminNav = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Posts', href: '/admin/posts' },
  { label: 'Import', href: '/admin/posts/import' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Banners', href: '/admin/banners' },
];

const SCROLL_THRESHOLD = 80;

function isNavActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  if (href === '/admin/posts/import') return pathname.startsWith('/admin/posts/import');
  if (href === '/admin/posts') return pathname.startsWith('/admin/posts') && !pathname.startsWith('/admin/posts/import');
  return pathname.startsWith(href);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const prev = prevScrollY.current;

      if (y < SCROLL_THRESHOLD) {
        setHeaderHidden(false);
      } else if (y > prev) {
        setHeaderHidden(true);
      } else if (y < prev) {
        setHeaderHidden(false);
      }

      prevScrollY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    prevScrollY.current = window.scrollY;
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream">
        {/* Floating dark header — hide on scroll down */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 pt-4 transition-all duration-300 ease-out will-change-transform ${
            headerHidden
              ? '-translate-y-[calc(100%+24px)] opacity-0 pointer-events-none'
              : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="max-w-[1600px] mx-auto">
            <div className="bg-ink rounded-2xl shadow-elevated border border-white/[0.06] px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between min-h-[52px] py-2.5 gap-3">
                {/* Brand */}
                <Link href="/admin" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 group">
                  <LogoFull variant="light" className="[&_span]:text-[15px] sm:[&_span]:text-[17px]" />
                  <div className="hidden sm:flex items-center gap-2.5">
                    <div className="w-px h-4 bg-white/15" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                      Admin
                    </span>
                  </div>
                </Link>

                {/* Desktop nav — reference-style muted links */}
                <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center min-w-0">
                  {adminNav.map((link) => {
                    const active = isNavActive(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`px-3 xl:px-4 py-2 text-[13px] font-medium lowercase tracking-tight rounded-lg transition-colors duration-200 ${
                          active
                            ? 'text-white'
                            : 'text-white/45 hover:text-white/80'
                        }`}
                      >
                        {link.label.toLowerCase()}
                      </Link>
                    );
                  })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium lowercase text-white/45 hover:text-white/80 transition-colors duration-200"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-70"
                      aria-hidden
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <span>view site</span>
                  </Link>

                  <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 text-accent text-[13px] font-semibold lowercase rounded-full transition-opacity duration-200 hover:opacity-90"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span className="hidden sm:inline">new post</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMobileNavOpen((o) => !o)}
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
                    aria-expanded={mobileNavOpen}
                    aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      {mobileNavOpen ? (
                        <>
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </>
                      ) : (
                        <>
                          <line x1="4" y1="12" x2="20" y2="12" />
                          <line x1="4" y1="6" x2="20" y2="6" />
                          <line x1="4" y1="18" x2="20" y2="18" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile panel — dark, below bar */}
              {mobileNavOpen && (
                <div className="lg:hidden border-t border-white/[0.08] py-3 space-y-1 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4">
                  {adminNav.map((link) => {
                    const active = isNavActive(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={`block px-4 py-3 text-[14px] font-medium lowercase rounded-xl transition-colors ${
                          active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        {link.label.toLowerCase()}
                      </Link>
                    );
                  })}
                  <div className="pt-2 mt-2 border-t border-white/[0.08]">
                    <Link
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-[14px] font-medium lowercase text-white/45 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      view site
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-[88px] pb-12">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
