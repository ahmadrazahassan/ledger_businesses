'use client';

import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { useCookieBanner } from '@/components/ui/cookie-banner-provider';

/**
 * Loads gtag.js only after the user accepts cookies (UK/EU-appropriate).
 * Measurement ID: {@link GA_MEASUREMENT_ID}.
 */
export function GoogleAnalytics() {
  const { analyticsEnabled } = useCookieBanner();

  if (!analyticsEnabled || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
