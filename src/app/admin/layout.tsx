'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoFull } from '@/components/brand/logo-full';
import { useState } from 'react';

const adminNav = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Posts', href: '/admin/posts' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Banners', href: '/admin/banners' },
];

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname.startsWith(href);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Framer-Inspired Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-ink/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3 group">
              <LogoFull />
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-px h-4 bg-ink/10" />
                <span className="text-[11px] font-bold text-ink/35 uppercase tracking-[0.15em]">Admin</span>
              </div>
            </Link>

            {/* Center Navigation - Framer Style */}
            <nav className="hidden lg:flex items-center gap-2 bg-ink/[0.03] p-1.5 rounded-full border border-ink/[0.06]">
              {adminNav.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-5 py-2 text-[13px] font-semibold rounded-full transition-all duration-300 ${
                      active
                        ? 'bg-ink text-white shadow-sm'
                        : 'text-ink/50 hover:text-ink/80 hover:bg-white/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                target="_blank"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-ink/55 bg-white border border-ink/[0.08] rounded-full hover:border-ink/15 hover:bg-ink/[0.02] transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span>View Site</span>
              </Link>
              
              <Link
                href="/admin/posts/new"
                className="flex items-center gap-2 px-5 py-2 bg-accent text-white text-[13px] font-bold rounded-full hover:brightness-110 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="hidden sm:inline">New Post</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white border border-ink/[0.08] text-ink/50 hover:text-ink hover:border-ink/15 transition-all"
                aria-label="Menu"
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

          {/* Mobile Navigation */}
          {mobileNavOpen && (
            <div className="lg:hidden border-t border-ink/[0.06] py-4 space-y-2">
              {adminNav.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`block px-5 py-3 text-[14px] font-semibold rounded-2xl transition-all ${
                      active
                        ? 'bg-ink text-white'
                        : 'text-ink/55 hover:text-ink hover:bg-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-3 border-t border-ink/[0.06]">
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 px-5 py-3 text-[14px] font-semibold text-ink/55 hover:text-ink hover:bg-white rounded-2xl transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View Site
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        {children}
      </main>
    </div>
  );
}
