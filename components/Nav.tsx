"use client";

import { useEffect, useState } from "react";
import { MenuToggleIcon } from "./ui/menu-toggle-icon";
import EarlyAccessButton from "./EarlyAccessButton";

const NAV_LINKS = [
  { href: "#compare", label: "vs Agency" },
  { href: "#build", label: "How it works" },
  { href: "#platform", label: "Platform" },
  { href: "#team", label: "Who we are" },
  { href: "#faq", label: "FAQ" },
];

const APP_URL = "https://app.ockno.com";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The menu covers the viewport now, so the page must not scroll behind it.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Dark scrim that fades in from the top on scroll, lifting nav contrast
          over the hero/scape. Sits below the nav (z-40), above page content. */}
      <div
        aria-hidden
        className={`nav-scrim fixed top-0 left-0 w-full z-40 pointer-events-none${scrolled ? " is-visible" : ""}`}
      />

      <nav
        className={`nav-bar fixed top-0 w-full z-50 pt-4${scrolled ? " is-scrolled" : ""}`}
        style={{ transform: "translateZ(0)" }}
      >
      {/* .nav-inner already supplies position:relative and z-index:1 (globals.css),
          which is what keeps the logo and toggle painting above the menu panel
          below it. Don't add a Tailwind z-* here expecting it to win — the
          .nav-inner rule is a later single-class declaration and overrides it. */}
      <div className="nav-inner max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ockno-logo.svg"
            alt="Ockno"
            className="h-9 w-auto transition-opacity group-hover:opacity-80"
          />
        </a>

        {/* lg, not md: at 768–1023px these five labels don't fit beside the
            logo and CTA, so they wrapped to two lines and — being absolutely
            positioned — collided with "Sign in". The hamburger now covers that
            whole range instead. whitespace-nowrap stops a single label ("vs
            Agency") breaking across lines if it's ever a near thing. */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={APP_URL}
            className="hidden lg:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
          >
            Sign in
          </a>
          {/* The wrapper owns the responsive hide, not the button: `hidden` on
              the button itself loses to .btn-pill's `display: inline-flex`
              (same specificity, declared later in globals.css), which is why
              this pill kept showing in the mobile bar next to the hamburger.
              On phones the CTA lives in the menu below instead. */}
          <div className="hidden lg:block">
            <EarlyAccessButton className="btn-lift btn-pill btn-pill-primary btn-pill-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page">
              Get early access
            </EarlyAccessButton>
          </div>
          <button
            type="button"
            aria-label="Toggle mobile menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden text-foreground p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            {/* Animated toggle: the same two strokes morph between the menu and
                close states, driven off the `open` state this component already
                owns. 24px to match the icon it replaced. */}
            <MenuToggleIcon open={open} className="size-6" duration={500} />
          </button>
        </div>
      </div>

      {/* absolute + explicit 100dvh, NOT `fixed inset-0`: <nav> sets
          transform: translateZ(0), and a transformed ancestor becomes the
          containing block for fixed descendants — so `fixed inset-0` sized
          itself to the nav's own 80px box instead of the viewport. The nav is
          already pinned to the top at full width, so anchoring to it lands in
          the same place. dvh so mobile browser chrome doesn't clip it. */}
      {open && (
        <div className="lg:hidden absolute top-0 left-0 w-full h-[100dvh] z-0 bg-black flex flex-col">
          {/* Spacer matching the header row (pt-4 + h-16), so the links start
              clear of the logo and toggle floating above at z-50. */}
          <div className="h-20 shrink-0" aria-hidden />
          <div className="flex-1 min-h-0 overflow-y-auto w-full max-w-[1440px] mx-auto px-6 flex flex-col justify-center gap-1 pb-20">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-medium text-muted-foreground hover:text-foreground py-3 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
            <EarlyAccessButton
              onClick={() => setOpen(false)}
              className="mt-6 btn-pill btn-pill-primary transition-colors"
            >
              Get early access
            </EarlyAccessButton>
          </div>
        </div>
      )}
      </nav>
    </>
  );
}
