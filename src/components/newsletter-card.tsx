'use client';

import { useState, useEffect, useRef } from 'react';
import { IconArrowRight } from '@/components/icons';

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

export function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { count, ref: counterRef } = useCountUp(10000, 2500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="rounded-[28px] md:rounded-[36px] bg-accent overflow-hidden" ref={counterRef}>
      <div className="px-8 py-16 md:px-16 md:py-20 text-center">
        {/* Eyebrow */}
        <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] bg-white/20 text-white rounded-full mb-7">
          Newsletter
        </span>

        <h2 className="text-3xl md:text-[44px] font-heading font-bold text-white leading-[1.1] mb-4">
          Stay informed.
        </h2>

        <p className="text-[15px] text-white/70 leading-relaxed mb-6 max-w-md mx-auto">
          Concise analysis on business, AI, and technology. Delivered weekly to decision-makers. No noise.
        </p>

        {/* Subscriber count with animation */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex items-center gap-1.5">
            {/* Stacked avatar dots */}
            <div className="flex -space-x-2">
              {['bg-ink/80', 'bg-ink/60', 'bg-ink/40', 'bg-ink/25'].map((bg, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center`}
                >
                  <span className="text-[7px] font-bold text-white/80">
                    {['A', 'R', 'S', 'M'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-heading font-black text-white tabular-nums">
              {count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count}+
            </span>
            <span className="text-[13px] font-semibold text-white/60">
              subscribers already
            </span>
          </div>
        </div>

        {submitted ? (
          <div className="py-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l4 4 8-8" stroke="#1e1f26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p className="text-[17px] font-bold text-white mb-1">Welcome aboard.</p>
            <p className="text-[13px] text-white/60">Check your inbox for a confirmation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-3.5 bg-white/95 border-0 rounded-full text-[14px] text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              suppressHydrationWarning
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-ink text-accent text-[13px] font-bold rounded-full hover:bg-ink/90 transition-all shrink-0"
            >
              Subscribe
              <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                <IconArrowRight size={11} className="text-accent" />
              </span>
            </button>
          </form>
        )}

        <p className="text-[11px] text-white/40 mt-6">
          Free forever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
