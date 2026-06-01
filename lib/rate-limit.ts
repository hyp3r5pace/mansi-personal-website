/**
 * Tiny in-memory sliding-window rate limiter.
 *
 * For a personal site's contact form this is enough: low traffic, single
 * region, no need for shared state. If we ever scale beyond one node,
 * swap the store for Upstash / a Redis client behind the same interface.
 *
 * Caveat: instance memory resets on cold start, so the window is best-
 * effort. Pair with a honeypot, not in lieu of one.
 */

type Hit = { count: number; resetAt: number };

const STORE = new Map<string, Hit>();
const MAX_KEYS = 5000;

export type RateLimitOptions = {
  /** Bucket size — how many requests are allowed in the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const existing = STORE.get(key);

  if (!existing || existing.resetAt <= now) {
    STORE.set(key, { count: 1, resetAt: now + windowMs });
    pruneIfNeeded();
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

function pruneIfNeeded() {
  if (STORE.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [k, v] of STORE) {
    if (v.resetAt <= now) STORE.delete(k);
  }
}
