# Ockno Website 2.0

Marketing site for **Ockno** — the AI operator for paid acquisition and the
lead lifecycle. Built with Next.js (App Router) and Tailwind CSS.

## Quick Start

### Prerequisites
- Node.js 18.18+ (Node 20+ recommended)
- npm

### Install & run
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`.

### Build
```bash
npm run build
npm start
```

## Project Structure
```
app/
  layout.tsx              # fonts (Sentient + JetBrains Mono), metadata, globals
  page.tsx                # landing page (composes sections)
  privacy-policy/page.tsx
  terms/page.tsx
  globals.css
components/
  sections/               # landing page sections
  Nav.tsx, Footer.tsx, HeroBackdrop.tsx, LegalShell.tsx
  ui/Icon.tsx             # @iconify/react wrapper
public/                   # fonts, images
tailwind.config.ts
```

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 3.4 (CSS-variable design tokens, dark + orange)
- **Icons:** @iconify/react
- **Fonts:** Sentient (self-hosted) + JetBrains Mono (`next/font`)

## License
© 2026 Ockno, Inc.
