'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-ink/10 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-heading font-bold text-ink mb-1">We value your privacy</h3>
          <p className="text-sm text-ink/70">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies in accordance with UK-GDPR guidelines. Read our <Link href="/privacy" className="text-accent-content underline hover:text-accent-content/80">Privacy Policy</Link> for more information.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={declineCookies}
            className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold text-ink bg-ink/5 hover:bg-ink/10 rounded-full transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold text-accent-foreground bg-accent rounded-full transition-colors hover:bg-accent-hover"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
