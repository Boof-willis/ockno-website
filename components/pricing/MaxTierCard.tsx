"use client";

import { useState } from "react";
import EarlyAccessButton from "../EarlyAccessButton";
import type { CatalogPlan } from "@/lib/pricing";
import { credits, dollars } from "@/lib/pricing";

/**
 * The Max tier is five plans sold as one card: a slider picks how many credits, and the price and
 * the per-credit saving move with it. Same maths as the app's plan picker, from the same catalog.
 */
export default function MaxTierCard({ steps, tagline }: { steps: CatalogPlan[]; tagline: string | null }) {
  const [i, setI] = useState(0);
  const plan = steps[Math.min(i, steps.length - 1)];
  if (!plan) return null;
  return (
    <div className="card-elevated relative flex flex-col p-7 md:p-8 ring-1 ring-primary/30">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{plan.label}</h3>
        {plan.savings_pct_vs_base ? (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            Save {plan.savings_pct_vs_base}% per credit
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-muted-foreground min-h-[2.5rem]">{tagline}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">{dollars(plan.monthly_price_usd)}</span>
        <span className="text-sm text-muted-foreground">a month</span>
      </div>
      <p className="mt-1 text-sm text-foreground tabular-nums">{credits(plan.included_credits)} AI credits a month</p>

      <label className="mt-6 block">
        <span className="sr-only">How many AI credits a month</span>
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          step={1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          aria-valuetext={`${credits(plan.included_credits)} credits for ${dollars(plan.monthly_price_usd)} a month`}
          className="w-full cursor-pointer accent-[hsl(var(--primary))] h-6"
        />
        <span className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
          <span>{credits(steps[0].included_credits)}</span>
          <span>{credits(steps[steps.length - 1].included_credits)}</span>
        </span>
      </label>

      <div className="mt-auto pt-8">
        <EarlyAccessButton className="btn-lift btn-pill btn-pill-primary w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Get early access
        </EarlyAccessButton>
      </div>
    </div>
  );
}
