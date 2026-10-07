/** The Ockno app. Every call to action on this site sends people to its signup page. */
export const APP_URL = "https://app.ockno.com";

/** Signup, optionally with a plan picked ahead (a catalog plan key such as `pro` or `max_2`). */
export function signupUrl(plan?: string): string {
  return plan ? `${APP_URL}/signup?plan=${encodeURIComponent(plan)}` : `${APP_URL}/signup`;
}
