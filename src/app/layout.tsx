import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEOPulse - AI-Powered SEO Dashboard & Insights Tool",
  description:
    "Transform complex SEO data into simple, actionable insights. Connect Google Search Console, get AI-powered recommendations, and grow your organic traffic. Free plan available.",
  keywords:
    "SEO tool, SEO dashboard, Google Search Console, AI SEO, keyword tracking, SEO analytics, SEO insights, affordable SEO tool",
  authors: [{ name: "SEOPulse" }],
  creator: "SEOPulse",
  publisher: "SEOPulse",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seo-pulse-xi.vercel.app",
    siteName: "SEOPulse",
    title: "SEOPulse - AI-Powered SEO Dashboard & Insights",
    description:
      "Transform complex SEO data into simple, actionable insights. Free plan available.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEOPulse - AI-Powered SEO Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEOPulse - AI-Powered SEO Dashboard",
    description:
      "Transform complex SEO data into simple, actionable insights. Free plan available.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://seo-pulse-xi.vercel.app",
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        {children}
      </body>
    </html>
  );
}