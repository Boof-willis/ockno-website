import {
  Inter,
  Hanken_Grotesk,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";

// Kept for the internal /type-preview comparison page.
export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

// Display/heading typeface — Inter (placeholder until a paid face is chosen).
// Exposed as `--font-sans` and applied to h1–h6.
export const activeSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Body/paragraph typeface, exposed as `--font-body`.
export const bodySans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// JetBrains Mono — reserved for genuine code/metadata snippets only.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
