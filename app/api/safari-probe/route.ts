/**
 * TEMPORARY — Safari paint-bug diagnostics. Receives DOM-state reports from
 * <SafariProbe /> and appends them to a scratch log. Delete along with the
 * probe component once the Safari scape bug is fixed.
 */
import { appendFileSync } from "fs";

const LOG =
  "/private/tmp/claude-501/-Users-spencerroberts-Documents-Ockno-Parent-Ockno-Website-2-0/c666eaeb-e33a-4144-a3b8-7ca285bac403/scratchpad/safari-probe.log";

export async function POST(req: Request) {
  const body = await req.json();
  appendFileSync(LOG, JSON.stringify(body) + "\n");
  return Response.json({ ok: true });
}
