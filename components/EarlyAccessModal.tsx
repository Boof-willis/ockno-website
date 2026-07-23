"use client";

import { useEffect, useId, useRef, useState } from "react";
import Icon from "./ui/Icon";

/**
 * Global "Get early access" lead-capture modal.
 *
 * Opens on the window event `ockno:early-access` (dispatched by
 * <EarlyAccessButton>), mounted once in the root layout.
 *
 * Endpoint: a GoHighLevel inbound webhook. This site is a static export (no
 * server route), so the browser posts the lead straight to the GHL hook. Set the
 * URL via NEXT_PUBLIC_GHL_WEBHOOK_URL (inlined at build) or paste it below.
 *
 * A2P 10DLC / TCPA: the SMS+email consent checkbox is UNCHECKED by default
 * (explicit opt-in). Its language names the sender (Ockno), states the message
 * types, that frequency varies, that msg & data rates may apply, the STOP/HELP
 * keywords, and that consent is not a condition of purchase. The exact consent
 * text shown plus a timestamp are sent to GHL as a record of consent.
 */

const GHL_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL ??
  "https://services.leadconnectorhq.com/hooks/REPLACE_WITH_YOUR_GHL_WEBHOOK";

/** Kept in sync with the visible checkbox label (minus the links). Sent to GHL so
 *  there's a stored record of exactly what the lead agreed to. */
const CONSENT_TEXT =
  "I agree to receive marketing and account text messages (SMS) and emails from Ockno at the phone number and email I provided. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help.";

export const EARLY_ACCESS_EVENT = "ockno:early-access";

type Status = "idle" | "submitting" | "success" | "error";

const inputCls =
  "w-full rounded-lg border border-border bg-nested/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary/40 transition-colors";
const labelCls = "block text-[13px] font-medium text-foreground mb-1.5";

export default function EarlyAccessModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  // Open on the global event.
  useEffect(() => {
    const onOpen = () => {
      setStatus("idle");
      setConsent(false);
      setOpen(true);
    };
    window.addEventListener(EARLY_ACCESS_EVENT, onOpen);
    return () => window.removeEventListener(EARLY_ACCESS_EVENT, onOpen);
  }, []);

  // Escape to close, scroll lock, pause smooth-scroll, focus first field.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    // Lenis (SmoothScroll) keeps scrolling the page behind an overflow lock, so
    // stop it explicitly while the modal is open.
    const lenis = (window as unknown as { lenis?: { stop?: () => void; start?: () => void } }).lenis;
    try {
      lenis?.stop?.();
    } catch {}
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      try {
        lenis?.start?.();
      } catch {}
      window.clearTimeout(t);
    };
  }, [open]);

  async function postLead(payload: Record<string, unknown>) {
    const body = JSON.stringify(payload);
    try {
      // Preferred path: a normal CORS request so we can read the status. GHL
      // LeadConnector hooks generally allow this.
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      return res.ok;
    } catch {
      // The request threw (CORS preflight blocked / network). Re-send as a
      // "simple" no-cors request, which skips preflight and still delivers the
      // lead to the hook. The response is opaque, so treat delivery as success.
      try {
        await fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body,
          mode: "no-cors",
        });
        return true;
      } catch {
        return false;
      }
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent || status === "submitting") return;
    setStatus("submitting");

    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("name") || "").trim();
    const [first, ...rest] = fullName.split(/\s+/);
    const payload = {
      name: fullName,
      first_name: first || fullName,
      last_name: rest.join(" "),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      business: String(fd.get("business") || "").trim(),
      sms_consent: true,
      email_consent: true,
      consent_text: CONSENT_TEXT,
      consent_timestamp: new Date().toISOString(),
      source: "ockno.com — early access form",
      page_url: typeof window !== "undefined" ? window.location.href : "",
    };

    const ok = await postLead(payload);
    if (ok) {
      setFirstName(payload.first_name);
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[var(--card-radius)] border border-border bg-card shadow-elevated p-6 sm:p-8"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon icon="solar:close-circle-linear" width={22} />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon icon="solar:check-circle-bold" width={30} />
            </div>
            <h2 id={titleId} className="text-xl font-semibold text-foreground mb-2">
              You&apos;re on the list{firstName ? `, ${firstName}` : ""}.
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Thanks for your interest in Ockno. We&apos;ve got your details and
              our team will be in touch shortly about early access.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-pill btn-pill-primary btn-pill-sm mx-auto"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 id={titleId} className="text-xl font-semibold text-foreground">
                Get early access to Ockno
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Tell us where to reach you and we&apos;ll be in touch about
                getting you set up.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="ea-name" className={labelCls}>
                  Name
                </label>
                <input
                  ref={firstFieldRef}
                  id="ea-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jordan Rivera"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="ea-email" className={labelCls}>
                  Email
                </label>
                <input
                  id="ea-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@business.com"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="ea-phone" className={labelCls}>
                  Mobile phone
                </label>
                <input
                  id="ea-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(555) 123-4567"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="ea-business" className={labelCls}>
                  Business name{" "}
                  <span className="text-muted-foreground/60 font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  id="ea-business"
                  name="business"
                  type="text"
                  autoComplete="organization"
                  placeholder="Acme Roofing Co."
                  className={inputCls}
                />
              </div>

              {/* A2P / TCPA explicit opt-in — unchecked by default. */}
              <label className="flex gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ accentColor: "hsl(var(--primary))" }}
                />
                <span className="text-xs leading-relaxed text-muted-foreground">
                  I agree to receive marketing and account text messages (SMS) and
                  emails from Ockno at the phone number and email I provided.
                  Consent is not a condition of purchase. Message frequency varies.
                  Message &amp; data rates may apply. Reply STOP to opt out, HELP
                  for help. See our{" "}
                  <a
                    href="/privacy-policy"
                    className="underline hover:text-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/terms"
                    className="underline hover:text-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms
                  </a>
                  .
                </span>
              </label>

              {status === "error" && (
                <p className="text-xs text-red-400" role="alert">
                  Something went wrong. Please try again, or email us at{" "}
                  <a href="mailto:hello@ockno.com" className="underline">
                    hello@ockno.com
                  </a>
                  .
                </p>
              )}

              <button
                type="submit"
                disabled={!consent || status === "submitting"}
                className="btn-pill btn-pill-accent w-full disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {status === "submitting" ? "Sending…" : "Request early access"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
