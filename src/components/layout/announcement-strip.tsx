'use client';

import { useState, useEffect, useCallback } from 'react';
import { IconClose, IconArrowRight } from '@/components/icons';

interface AnnouncementItem {
  label: string;
  text: string;
  href: string;
  cta: string;
}

interface AnnouncementStripProps {
  items?: AnnouncementItem[];
}

export function AnnouncementStrip({ items = [] }: AnnouncementStripProps) {
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const advance = useCallback(() => {
    if (items.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
      setIsTransitioning(false);
    }, 300);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(advance, 5000);
    return () => clearInterval(interval);
  }, [advance, items.length]);

  if (dismissed || items.length === 0) return null;

  const current = items[activeIndex];

  return (
    <div className="relative bg-accent overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-2 flex items-center justify-center gap-3">
        {/* Indicator dots */}
        {items.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 mr-1">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setActiveIndex(i);
                    setIsTransitioning(false);
                  }, 200);
                }}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'bg-ink w-3' : 'bg-ink/20'
                }`}
                aria-label={`Announcement ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div
          className={`flex items-center gap-3 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] bg-ink text-accent rounded-md shrink-0">
            {current.label}
          </span>
          <span className="text-[13px] font-medium text-ink/70 truncate max-w-[280px] sm:max-w-none">
            {current.text}
          </span>
          <a
            href={current.href}
            className="inline-flex items-center gap-1 text-[13px] font-bold text-ink hover:text-ink/70 transition-colors shrink-0"
          >
            {current.cta}
            <IconArrowRight size={12} />
          </a>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-ink/30 hover:text-ink/70 transition-colors"
        aria-label="Dismiss"
      >
        <IconClose size={12} />
      </button>
    </div>
  );
}
