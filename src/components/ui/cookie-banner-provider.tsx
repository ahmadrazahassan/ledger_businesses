'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';

export type CookieConsentState = 'loading' | 'pending' | 'accepted' | 'declined';

type CookieBannerContextValue = {
  /** True while the consent prompt should be shown (after client hydration). */
  showBanner: boolean;
  accept: () => void;
  decline: () => void;
  /** Raw consent — used for analytics gating */
  cookieConsent: CookieConsentState;
  /** True only when user chose "Accept all" — GA4 may load */
  analyticsEnabled: boolean;
};

const CookieBannerContext = createContext<CookieBannerContextValue | null>(null);

export function CookieBannerProvider({ children }: { children: React.ReactNode }) {
  const [showBanner, setShowBanner] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsentState>('loading');

  useEffect(() => {
    setHydrated(true);
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'accepted') {
        setCookieConsent('accepted');
        return;
      }
      if (v === 'declined') {
        setCookieConsent('declined');
        return;
      }
      setCookieConsent('pending');
      setShowBanner(true);
    } catch {
      setCookieConsent('pending');
      setShowBanner(true);
    }
  }, []);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      /* ignore */
    }
    setCookieConsent('accepted');
    setShowBanner(false);
  }, []);

  const decline = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {
      /* ignore */
    }
    setCookieConsent('declined');
    setShowBanner(false);
  }, []);

  const analyticsEnabled = cookieConsent === 'accepted';

  const value = useMemo(
    () => ({
      showBanner: hydrated && showBanner,
      accept,
      decline,
      cookieConsent,
      analyticsEnabled,
    }),
    [hydrated, showBanner, accept, decline, cookieConsent, analyticsEnabled]
  );

  return <CookieBannerContext.Provider value={value}>{children}</CookieBannerContext.Provider>;
}

export function useCookieBanner(): CookieBannerContextValue {
  const ctx = useContext(CookieBannerContext);
  if (!ctx) {
    return {
      showBanner: false,
      accept: () => {},
      decline: () => {},
      cookieConsent: 'loading',
      analyticsEnabled: false,
    };
  }
  return ctx;
}
