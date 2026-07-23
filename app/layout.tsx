import type { Metadata } from "next";
import { activeSans, bodySans, jetbrainsMono } from "./fonts";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ockno.com"),
  alternates: { canonical: "/" },
  title: "Ockno | The AI marketing employee",
  description:
    "Ockno is an AI employee for your marketing. It learns your business and does the work — building funnels, running ads, and following up with every lead — then gets sharper every week. Service-as-a-Software: not a tool you operate, a hire that delivers.",
  openGraph: {
    title: "Ockno | The AI marketing employee",
    description:
      "An AI employee for your marketing. It learns your business and does the work — funnels, ads, follow-up — then gets sharper every week. Not a tool you operate. A hire that delivers.",
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
    "Ockno is an AI employee for your marketing. It learns your business and does the work — building funnels, running ads, and following up with every lead.",
};

const jsFlagScript = `
(function(){try{
  document.documentElement.classList.add('js');
}catch(e){}})();
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        {/* framer-motion renders its `initial` state into the SSR markup, so
            without JS the hero would stay at opacity 0. Same contract as
            `html.js [data-reveal]`: the hidden state only applies when JS runs.
            A stylesheet !important beats an inline style. */}
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
