'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { LogoFull } from '@/components/brand/logo-full';
import { LogoSymbol } from '@/components/brand/logo-symbol';
import { IconArrowRight } from '@/components/icons';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please verify your email address before signing in.');
        } else {
          setError(authError.message);
        }
        return;
      }

      // Success — redirect to admin (or original destination)
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Column — Brand showcase ── */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-ink overflow-hidden">
        {/* Large cube watermark */}
        <div className="absolute -right-20 -bottom-20 opacity-[0.03]">
          <LogoSymbol size={500} variant="light" className="text-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Top — Logo */}
          <div className="flex items-center gap-3">
            <LogoSymbol size={36} variant="light" className="text-white" />
            <div className="flex items-baseline gap-[3px]">
              <span className="text-[17px] font-extrabold tracking-[-0.03em] text-white/90">
                Ledger Businesses
              </span>
            </div>
          </div>

          {/* Center — Hero messaging */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-[2px] bg-accent rounded-full" />
              <span className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">
                Admin Panel
              </span>
            </div>

            <h1 className="text-[40px] xl:text-[48px] font-heading font-bold text-white leading-[1.1] tracking-[-0.03em] mb-5">
              Editorial
              <br />
              <span className="text-accent">admin access</span>
            </h1>

            <p className="text-[15px] text-white/35 leading-relaxed max-w-sm">
              Sign in to publish and manage UK-focused accounting and payroll content.
            </p>
          </div>

          {/* Bottom — Decorative elements */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-white/15">
              &copy; 2026 Ledger Businesses. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full ${i === 0 ? 'w-2 h-2 bg-accent' : 'w-1.5 h-1.5 bg-white/10'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Column — Login form ── */}
      <div className="flex-1 bg-cream flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo (visible on small screens) */}
          <div className="flex justify-center mb-10 lg:hidden">
            <LogoFull />
          </div>

          {/* Form header */}
          <div className="mb-8">
            <div className="hidden lg:flex items-center gap-2 mb-6">
              <span className="w-6 h-[2px] bg-accent rounded-full" />
              <span className="text-[10px] font-bold text-accent-content uppercase tracking-[0.15em]">
                Sign in
              </span>
            </div>

            <h2 className="text-2xl font-heading font-bold text-ink tracking-[-0.02em]">
              Welcome back
            </h2>
            <p className="text-sm text-ink/40 mt-1">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-ink/50 uppercase tracking-[0.06em] mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-card border border-ink/[0.08] rounded-xl text-sm text-ink placeholder:text-ink/25 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                placeholder="admin@Ledger Businesses.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-ink/50 uppercase tracking-[0.06em]">
                  Password
                </label>
                <button type="button" className="text-[11px] font-medium text-accent-content hover:underline">
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-card border border-ink/[0.08] rounded-xl text-sm text-ink placeholder:text-ink/25 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                placeholder="Enter password"
              />
            </div>

            {/* Remember me */}
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2.5 group"
            >
              <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${rememberMe
                  ? 'bg-accent border-accent'
                  : 'border-ink/[0.12] bg-card group-hover:border-accent'
                }`}>
                {rememberMe && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5.5L4 7.5L8 3" stroke="#1e1f26" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-ink/40">Keep me signed in</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-ink text-cream text-sm font-bold rounded-xl hover:bg-ink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign in to dashboard
                  <IconArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-ink/[0.06]">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xs text-ink/30 hover:text-accent-content transition-colors flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M10 7H4m0 0l2.5-2.5M4 7l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to site
              </Link>
              <p className="text-[10px] text-ink/20">
                Protected area
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
