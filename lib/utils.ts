import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The standard shadcn/ui class helper: clsx resolves conditionals/arrays/objects,
 * then tailwind-merge drops earlier utilities that a later one conflicts with —
 * so a caller's `className` reliably wins over a component's internal defaults
 * (`size-6` beating a built-in `size-4`) instead of both landing and letting
 * stylesheet order decide.
 *
 * Added by hand rather than via `shadcn init`, which would have overwritten
 * globals.css and tailwind.config.ts along with this project's design tokens.
 * Any shadcn component dropped into components/ui can import this unchanged.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
