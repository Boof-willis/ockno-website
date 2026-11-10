import type { Metadata } from "next";
import { activeSans, bodySans, jetbrainsMono } from "./fonts";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ockno.com"),
  alternates: { canonical: "/" },
  // app/favicon.ico is picked up by Next's file convention on its own; these
  // cover the sharper variants (SVG scales, 96px PNG fallback), iOS home-screen
  // icon, and the PWA manifest with the maskable 192/512 icons.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  title: "Ockno | The AI marketing brain",
  // The positioning statement, verbatim — also the Organization schema below.
  description:
    "Ockno is an AI marketing brain that learns your business, tracks every lead from click to paid invoice, and fixes what’s costing you customers.",
  openGraph: {
    title: "Ockno | The AI marketing brain",
    // The tagline: short enough to survive a link preview's truncation.
    description:
      "Ockno is an AI marketing brain that finds and fixes what’s costing you customers.",
    url: "https://www.ockno.com",
    siteName: "Ockno",
    type: "website",
  },
  other: {
    "facebook-domain-verification": "roqfq1995pjiku3f243ghps12ckl9v",
  },
};

// Marks that JS is alive, before paint. Load-bearing: the `html.js` rules in
// globals.css only hide [data-reveal] / [data-focus-item] when JS is present,
// so without this the reveals would never fire and the content would sit
// permanently hidden. Not a theme script — the site is dark, unconditionally.
const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ockno",
  url: "https://www.ockno.com",
  logo: "https://www.ockno.com/images/ockno-logo.svg",
  description:
    "Ockno is an AI marketing brain that learns your business, tracks every lead from click to paid invoice, and fixes what’s costing you customers.",
};

const jsFlagScript = `
(function(){try{
  document.documentElement.classList.add('js');
}catch(e){}})();
`;

// Google Analytics 4. Inlined rather than via next/script because the site is
// a static export — the raw tag is what Google's snippet expects and it fires
// before hydration.
const GA_MEASUREMENT_ID = "G-YCF8HR62M4";

const gaScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${activeSans.variable} ${bodySans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlagScript }} />
        {/* Google tag (gtag.js) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script dangerouslySetInnerHTML={{ __html: gaScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        {/* Belt and braces for the hero's entrance animations (CSS, see
            components/motion/Reveal.tsx): if animations are blocked along with
            JS, nothing is left sitting at its hidden first frame. */}
        <noscript>
          <style>{`[data-motion]{opacity:1!important;transform:none!important;}`}</style>
        </noscript>
      </head>
      <body className="bg-page text-foreground font-body selection:bg-primary/30 selection:text-primary-foreground relative antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
