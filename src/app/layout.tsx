import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Inter } from "next/font/google";
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

export const metadata: Metadata = {
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ledger Businesses",
    title: "Ledger Businesses — The Authority in Business Intelligence",
    description:
      "Premium editorial coverage of Business, AI, Startups, B2B, Software, and emerging technology.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ledger Businesses",
    description:
      "Premium editorial coverage of Business, AI, Startups, B2B, Software, and emerging technology.",
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
        {children}
      </body>
    </html>
  );
}
