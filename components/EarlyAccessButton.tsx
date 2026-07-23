"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { EARLY_ACCESS_EVENT } from "./EarlyAccessModal";

/** Fire the global event that <EarlyAccessModal> listens for. */
export function openEarlyAccess() {
  window.dispatchEvent(new Event(EARLY_ACCESS_EVENT));
}

/**
 * Drop-in replacement for the "Get early access" links. Renders a real <button>
 * (so it works from server components) that opens the shared capture modal.
 * Pass the same className the old <a> used to keep the styling identical. Any
 * onClick passed in still runs (e.g. to close the mobile menu) before the modal
 * opens.
 */
export default function EarlyAccessButton({
  className,
  children,
  onClick,
  ...rest
}: {
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        onClick?.(e);
        openEarlyAccess();
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
