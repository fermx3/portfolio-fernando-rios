import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type Bucket = "ask" | "lead";

interface Limit {
  /** Requests allowed per window. */
  max: number;
  windowMs: number;
  /** Same window, in the duration string @upstash/ratelimit expects. */
  window: `${number} ${"s" | "m" | "h" | "d"}`;
}

const LIMITS: Record<Bucket, Limit> = {
  ask: { max: 10, windowMs: 10 * 60_000, window: "10 m" },
  // Leads are rarer and cost more to get wrong, so they get their own budget
  // rather than sharing the question one.
  lead: { max: 3, windowMs: 24 * 60 * 60_000, window: "1 d" },
};

function hasUpstash(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

const limiters = new Map<Bucket, Ratelimit>();

function upstashLimiter(bucket: Bucket): Ratelimit {
  let limiter = limiters.get(bucket);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(LIMITS[bucket].max, LIMITS[bucket].window),
      prefix: `assistant:${bucket}`,
    });
    limiters.set(bucket, limiter);
  }
  return limiter;
}

/**
 * Per-instance fallback.
 *
 * Serverless runs many instances, each with its own copy of this map, so the
 * real ceiling is the limit times the instance count. It is a brake, not a
 * guarantee — which is why the hard stop is the spend cap on the API key.
 */
const memory = new Map<string, number[]>();

function memoryAllows(bucket: Bucket, ip: string): boolean {
  const { max, windowMs } = LIMITS[bucket];
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const hits = (memory.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= max) {
    memory.set(key, hits);
    return false;
  }

  hits.push(now);
  memory.set(key, hits);

  // The map would otherwise grow for the lifetime of the instance.
  if (memory.size > 5000) {
    for (const [k, times] of memory) {
      if (times.every((t) => now - t >= windowMs)) memory.delete(k);
    }
  }

  return true;
}

let announced = false;

/**
 * Says once which limiter is actually in play.
 *
 * Without this the shared counter fails to silence: the env vars have to be
 * named exactly UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, and any
 * other name just falls through to the per-instance counter with nothing in
 * the logs. You would think it was configured when it was not.
 */
function announceOnce(shared: boolean) {
  if (announced) return;
  announced = true;
  console.log(
    shared
      ? "[assistant] rate limit: shared (Upstash)"
      : "[assistant] rate limit: per-instance (no UPSTASH_REDIS_REST_URL/_TOKEN)"
  );
}

/**
 * Returns false when the caller has run out of budget for this bucket.
 *
 * If Upstash is unreachable this degrades to the in-memory counter instead of
 * failing closed: a third-party outage should not take the assistant down.
 */
export async function allow(bucket: Bucket, ip: string): Promise<boolean> {
  if (hasUpstash()) {
    announceOnce(true);
    try {
      const { success } = await upstashLimiter(bucket).limit(ip);
      return success;
    } catch {
      console.error(`[assistant] rate limit store unavailable; falling back to in-memory`);
    }
  } else {
    announceOnce(false);
  }
  return memoryAllows(bucket, ip);
}

/**
 * Best-effort client address. Vercel sets x-forwarded-for; the value is
 * spoofable in general, so this scopes normal use rather than stopping a
 * determined attacker.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
