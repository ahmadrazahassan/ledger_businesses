import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getSiteUrl, toAbsoluteUrl, INSTAGRAM_HREF } from "@/lib/site";
import { ConditionalSiteAssistant } from "@/components/ai/conditional-site-assistant";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { CookieBannerProvider } from "@/components/ui/cookie-banner-provider";
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
  sameAs: [INSTAGRAM_HREF],
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
    default: "Ledger Businesses",
    template: "%s | Ledger Businesses",
  },
  description:
    "Independent UK accounting and payroll software reviews, MTD and compliance context, and comparisons for SMEs, sole traders, and advisers.",
  keywords: [
    "Sage accounting",
    "UK bookkeeping",
    "payroll UK",
    "Making Tax Digital",
    "MTD compliance",
    "Sage Payroll",
    "UK SME accounting",
    "VAT compliance",
    "cloud accounting UK",
    "invoicing software",
    "financial reporting",
    "Sage vs Xero",
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
      'impact-site-verification': '53a39466-1eb1-4a19-bdb9-57d584497dbb',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Ledger Businesses",
    title: "Ledger Businesses",
    description:
      "Independent UK accounting and payroll software reviews and compliance-focused guides for SMEs and advisers.",
    url: siteUrl,
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ledgerbusinesses",
    title: "Ledger Businesses",
    description:
      "Independent UK accounting and payroll software reviews and compliance-focused guides for SMEs and advisers.",
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
    <html lang="en-GB">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7090293429266591"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${dmSans.variable} ${dmMono.variable} ${inter.variable} font-body`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <CookieBannerProvider>
          {children}
          <GoogleAnalytics />
          <ConditionalSiteAssistant />
          <CookieBanner />
        </CookieBannerProvider>
        <Analytics />
      </body>
    </html>
  );
}
