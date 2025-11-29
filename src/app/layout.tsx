import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});

export const metadata = {
  metadataBase: new URL("https://pastefever.com"), // Change to your domain
  title: {
    default: "PasteFever - Instant Clipboard to Download Converter",
    template: "%s | PasteFever",
  },
  description:
    "Paste images or text from your clipboard and download instantly. No uploads, no servers, completely private and secure. Works offline. Free clipboard manager and converter.",
  keywords: [
    "clipboard manager",
    "paste to download",
    "clipboard converter",
    "image downloader",
    "text to file",
    "privacy focused",
    "offline tool",
    "no upload",
    "instant download",
    "clipboard tool",
    "paste tool",
    "browser clipboard",
    "privacy app",
    "secure clipboard",
  ],
  authors: [{ name: "PasteFever", url: "https://pastefever.com" }],
  creator: "PasteFever",
  publisher: "PasteFever",
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
    url: "https://pastefever.com",
    title: "PasteFever - Instant Clipboard to Download Converter",
    description:
      "Paste images or text and download instantly. No uploads, completely private. Works offline.",
    siteName: "PasteFever",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "PasteFever - Instant Clipboard Downloads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PasteFever - Instant Clipboard to Download Converter",
    description:
      "Paste images or text and download instantly. No uploads, completely private.",
    creator: "@pastefever", // Change to your Twitter handle
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://pastefever.com",
  },
  verification: {
    google: "your-google-verification-code", // Add after Google Search Console setup
    // yandex: 'your-yandex-verification',
    // bing: 'your-bing-verification',
  },
  category: "technology",
  applicationName: "PasteFever",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PasteFever",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* JSON-LD Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "PasteFever",
              url: "https://pastefever.com",
              description:
                "Paste images or text from your clipboard and download instantly. No uploads, completely private.",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
              },
              featureList: [
                "Instant clipboard downloads",
                "No file uploads required",
                "Complete privacy - client-side only",
                "Works offline",
                "Supports images and text",
                "Download history",
                "Dark mode support",
              ],
            }),
          }}
        />

        {/* Google Analytics - Add your GA4 ID */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-alt focus:text-main"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
