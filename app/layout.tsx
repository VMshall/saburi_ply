import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/jsonld";
import { Bricolage_Grotesque } from "next/font/google";

/**
 * Display typeface for headings (Bricolage Grotesque) — gives headlines character vs. the system
 * sans body. Exposed as the `--font-display` CSS variable and opted into via the `font-display`
 * Tailwind utility, so only elements that ask for it use it; the body stays unchanged.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/**
 * Root layout — owns <html>/<body>, sitewide <head> (Metadata API), the provider
 * boundary, and the Navbar/Footer shell. §3.
 *
 * Default metadata = the home/site defaults ported from client/config/metaConfig.js ('/')
 * + client/components/PageMeta.jsx (OG/Twitter/geo/icons) + index.html (verification).
 * Per-page metadata (canonical, per-route title/description, the 5 JSON-LD schema types,
 * the reusable <JsonLd> for Organization+WebSite) is authored in P3/P4. metadataBase makes
 * every relative canonical/OG URL absolute to the www host (never localhost/*.vercel.app).
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.saburiply.com"),
  title:
    "Best Plywood Manufacturer and Supplier in India | Saburi Ply",
  description:
    "Saburi Ply is the best plywood manufacturer and supplier in India, offering premium plywood, block boards, and decorative panels for homes and commercial use.",
  keywords:
    "plywood manufacturer india, plywood supplier, saburi ply, block board, wpc plywood",
  authors: [{ name: "Saburi Ply" }],
  publisher: "Saburi Ply",
  category: "Manufacturing",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Saburi Ply",
    title:
      "Best Plywood Manufacturer and Supplier in India | Saburi Ply",
    description:
      "Saburi Ply is the best plywood manufacturer and supplier in India, offering premium plywood, block boards, and decorative panels for homes and commercial use.",
    url: "/",
    images: [
      {
        url: "/images/og/saburiply-og.jpg",
        width: 1200,
        height: 630,
        alt: "Saburi Ply - Leading Plywood Manufacturer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@saburiply",
    title:
      "Best Plywood Manufacturer and Supplier in India | Saburi Ply",
    description:
      "Saburi Ply is the best plywood manufacturer and supplier in India, offering premium plywood, block boards, and decorative panels for homes and commercial use.",
    images: ["/images/og/saburiply-og.jpg"],
  },
  // Icons stay on the square logo — the OG banner is 1.9:1 and would be cropped to nothing.
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/saburi.jpg", sizes: "32x32", type: "image/png" },
      { url: "/images/saburi.jpg", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/images/saburi.jpg", sizes: "180x180" }],
  },
  verification: {
    google: "RG3h7TIZcIqePcuNQWtPHtRhy0WULgbbduENvwOVmTY",
  },
  other: {
    language: "English",
    "geo.region": "IN",
    "geo.placename": "India",
    ICBM: "20.5937,78.9629",
    industry: "Plywood Manufacturing",
    business: "B2B, B2C",
  },
};

// Sitewide structured data is built by lib/jsonld.ts (Organization + WebSite, §6). The former
// inlined LocalBusiness moves to page level — home / contact / location pages.

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5L4XC66W"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>

        {/* Sitewide structured data (§6): Organization + WebSite. LocalBusiness now lives on
            home / contact / location pages. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        {/*
          Analytics / tag managers — ported from index.html via next/script.
          NOTE (P6 perf): the original on-first-interaction lazy loader + the second
          container (GTM-T34ZCLBR) are intentionally simplified here to next/script
          strategies; reconcile the exact loading strategy during the CWV pass.
        */}
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5L4XC66W');`}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VWZ92LCZZF"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-VWZ92LCZZF');`}
        </Script>

        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="bYI8M+foBGI651XGFMV/vQ"
          strategy="afterInteractive"
        />

        <Script id="fb-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','573529158617545');fbq('track','PageView');`}
        </Script>

        <Script id="ms-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","uy9tl9dejg");`}
        </Script>
      </body>
    </html>
  );
}
