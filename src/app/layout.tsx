import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Inter } from "next/font/google";
import Script from "next/script";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ledger Businesses",
  url: siteUrl,
  logo: toAbsoluteUrl("/favicon.svg"),
  sameAs: [],
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ledger Businesses",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ledger Businesses — The Authority in Business Intelligence",
    template: "%s | Ledger Businesses",
  },
  description:
    "Premium editorial coverage of Business, AI, Startups, B2B, Software, and emerging technology. Confident analysis for decision-makers.",
  keywords: [
    "business intelligence",
    "AI",
    "startups",
    "B2B",
    "software",
    "enterprise",
    "funding",
    "GPTs",
  ],
  authors: [{ name: "Ledger Businesses" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      'impact-site-verification': '98c9150f-50e0-4ff7-9133-8b9f238be19b',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ledger Businesses",
    title: "Ledger Businesses — The Authority in Business Intelligence",
    description:
      "Premium editorial coverage of Business, AI, Startups, B2B, Software, and emerging technology.",
    url: siteUrl,
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ledgerbusinesses",
    title: "Ledger Businesses",
    description:
      "Premium editorial coverage of Business, AI, Startups, B2B, Software, and emerging technology.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmMono.variable} ${inter.variable} font-body`}>
        <Script
          id="adsense-script"
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7090293429266591"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
