"use client";

import { useEffect, useState } from "react";
import Icon from "./ui/Icon";

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

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={APP_URL}
            className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
          >
            Sign in
          </a>
          <a
            href={APP_URL}
            className="btn-lift btn-pill btn-pill-primary btn-pill-sm hidden md:inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            Get early access
          </a>
          <button
            type="button"
            aria-label="Toggle mobile menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-foreground p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Icon icon={open ? "solar:close-square-linear" : "solar:hamburger-menu-linear"} width={24} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-card border-b border-border p-6 flex flex-col gap-1 shadow-elevated z-50">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={APP_URL}
            onClick={() => setOpen(false)}
            className="mt-2 btn-pill btn-pill-primary btn-pill-sm transition-colors"
          >
            Get early access
          </a>
        </div>
      )}
      </nav>
    </>
  );
}
