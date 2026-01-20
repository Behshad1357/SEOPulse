import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics";
import { ExitIntentPopup } from "@/components/exit-intent-popup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seopulse.digital"),
  title: {
    default: "SEOPulse: AI Insights from Google Search Console | Free Trial",
    template: "%s | SEOPulse",
  },
  description:
    "Connect GSC → Get AI page fixes, traffic alerts, 90-day trends. Turn messy Search Console data into AI action items that grow traffic 25%. Free plan available.",
  keywords: [
    "Google Search Console dashboard",
    "GSC AI tool",
    "SEO dashboard",
    "AI SEO insights",
    "Search Console analytics",
    "GSC reporting tool",
    "SEO automation",
    "keyword tracking",
    "organic traffic growth",
  ],
  authors: [{ name: "SEOPulse" }],
  creator: "SEOPulse",
  publisher: "SEOPulse",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seopulse.digital",
    siteName: "SEOPulse",
    title: "SEOPulse: AI Insights from Google Search Console",
    description:
      "Turn messy GSC data into AI action items that grow traffic 25%. Connect your Search Console and get instant insights. Free plan available.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEOPulse - AI-Powered Google Search Console Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEOPulse: AI Insights from Google Search Console",
    description:
      "Turn messy GSC data into AI action items that grow traffic 25%. Free plan available.",
    images: ["/og-image.png"],
    creator: "@seopulse",
  },
  alternates: {
    canonical: "https://seopulse.digital",
  },
  verification: {
    google: "your-google-verification-code", // Add after GSC verification
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="canonical" href="https://seopulse.digital" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        {children}
        <ExitIntentPopup />
      </body>
    </html>
  );
}