import { timingSafeEqual } from "node:crypto";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

/**
 * Upstash deletes free databases that go quiet, and the rate limiter only
 * touches this one when someone asks the assistant something. A portfolio can
 * go weeks without that, so a daily Vercel cron writes one key here.
 *
 * Public URL, so it only answers to Vercel's cron: it sends
 * `Authorization: Bearer $CRON_SECRET`. Without that secret configured the
 * route refuses everything rather than running open. The only effect is a
 * single fixed key, nothing from the request reaches Redis.
 */
function authorized(header: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function GET(request: Request) {
  if (!authorized(request.headers.get("authorization"))) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.log("[keepalive] skipped: no UPSTASH_REDIS_REST_URL/_TOKEN");
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  try {
    await Redis.fromEnv().set("assistant:keepalive", new Date().toISOString());
  } catch {
    console.error("[keepalive] Upstash unreachable");
    return Response.json({ error: "unavailable" }, { status: 502 });
  }

  console.log("[keepalive] ok");
  return Response.json({ ok: true });
}
