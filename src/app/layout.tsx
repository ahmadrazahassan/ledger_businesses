import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
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
    default: "Ledger Businesses — UK Accounting, Payroll & Tax Compliance Guides",
    template: "%s | Ledger Businesses",
  },
  description:
    "Expert guides on Sage accounting, bookkeeping, payroll, invoicing, MTD compliance, and financial reporting for UK small and medium businesses.",
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
      'impact-site-verification': '98c9150f-50e0-4ff7-9133-8b9f238be19b',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Ledger Businesses",
    title: "Ledger Businesses — UK Accounting, Payroll & Tax Compliance Guides",
    description:
      "Expert guides on Sage accounting, bookkeeping, payroll, invoicing, MTD compliance, and financial reporting for UK SMEs.",
    url: siteUrl,
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ledgerbusinesses",
    title: "Ledger Businesses",
    description:
      "Expert guides on Sage accounting, bookkeeping, payroll, invoicing, MTD compliance, and financial reporting for UK SMEs.",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
