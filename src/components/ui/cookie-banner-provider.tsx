'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';

type CookieBannerContextValue = {
  /** True while the consent prompt should be shown (after client hydration). */
  showBanner: boolean;
  accept: () => void;
  decline: () => void;
};

const CookieBannerContext = createContext<CookieBannerContextValue | null>(null);

export function CookieBannerProvider({ children }: { children: React.ReactNode }) {
  const [showBanner, setShowBanner] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShowBanner(true);
    } catch {
      setShowBanner(true);
    }
  }, []);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      /* ignore */
    }
    setShowBanner(false);
  }, []);

  const decline = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {
      /* ignore */
    }
    setShowBanner(false);
  }, []);

  const value = useMemo(
    () => ({
      showBanner: hydrated && showBanner,
      accept,
      decline,
    }),
    [hydrated, showBanner, accept, decline]
  );

  return <CookieBannerContext.Provider value={value}>{children}</CookieBannerContext.Provider>;
}

export function useCookieBanner(): CookieBannerContextValue {
  const ctx = useContext(CookieBannerContext);
  if (!ctx) {
    return { showBanner: false, accept: () => {}, decline: () => {} };
  }
  return ctx;
}
