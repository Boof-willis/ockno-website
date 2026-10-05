/**
 * The pricing catalog, read from the Ockno API at BUILD time.
 *
 * The site is a static export, so `next build` fetches the catalog once and bakes it into
 * /pricing. The numbers come from the same catalog the app bills from
 * (GET /api/v1/public/billing/catalog), so the website cannot advertise a price the app does not
 * charge. A price change is an admin edit in the app followed by a site rebuild.
 *
 * A build that cannot read the catalog FAILS instead of shipping an empty or stale pricing page.
 * Point it at an environment with OCKNO_API_BASE_URL (default: production).
 */

export interface CatalogPlan {
  key: string;
  label: string;
  tier: "trial" | "base" | "pro" | "max" | "custom" | string;
  step: number | null;
  tagline: string | null;
  perks: string[];
  monthly_price_usd: number | null;
  included_credits: number | null;
  price_per_credit_cents: number | null;
  savings_pct_vs_base: number | null;
  purchasable: boolean;
  features: string[];
}

export interface CatalogTier {
  tier: string;
  label: string;
  plans: string[];
}

export interface CatalogFee {
  key: string;
  label: string;
  unit: string;
  price: number;
  recurring: boolean;
  one_time: boolean;
}

export interface Catalog {
  plans: CatalogPlan[];
  tiers: CatalogTier[];
  fees: CatalogFee[];
  ai_models: { label: string; cost_multiplier: number; is_default: boolean }[];
  generation: { label: string; credits_per_unit: number; unit: string; kind: "image" | "video" }[];
  trial_days: number;
  generated_at: string;
}

const DEFAULT_API = "https://api.ockno.com/api/v1";

export async function fetchCatalog(): Promise<Catalog> {
  const base = (process.env.OCKNO_API_BASE_URL || DEFAULT_API).replace(/\/$/, "");
  const url = `${base}/public/billing/catalog`;
  let res: Response;
  try {
    res = await fetch(url, { cache: "force-cache" });
  } catch (e) {
    throw new Error(`Pricing: could not reach ${url} (${(e as Error).message}). Set OCKNO_API_BASE_URL to a reachable API.`);
  }
  if (!res.ok) {
    throw new Error(`Pricing: ${url} answered ${res.status}. The pricing page is not built without the catalog.`);
  }
  const body = await res.json();
  const catalog = body?.data as Catalog | undefined;
  const tiers = new Set((catalog?.plans ?? []).filter((p) => p.purchasable).map((p) => p.tier));
  for (const required of ["base", "pro", "max"]) {
    if (!tiers.has(required)) {
      throw new Error(`Pricing: the catalog from ${url} has no purchasable "${required}" plan.`);
    }
  }
  return catalog as Catalog;
}

export function plansForTier(catalog: Catalog, tier: string): CatalogPlan[] {
  return catalog.plans
    .filter((p) => p.tier === tier)
    .sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
}

export const credits = (n: number | null | undefined) => (n ?? 0).toLocaleString("en-US");

export const dollars = (n: number | null | undefined) =>
  `$${(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

/** A pass-through rate. Dollar amounts get cents; anything under a dollar keeps up to four
 *  decimals so a per-minute or per-text rate is not rounded into a different price. */
export function rate(n: number): string {
  if (n >= 1 || n === 0) return `$${n.toFixed(2)}`;
  const s = n.toFixed(4).replace(/0+$/, "");
  return `$${s.split(".")[1].length < 2 ? n.toFixed(2) : s}`;
}
