import 'server-only';

interface AttemptBucket {
  count: number;
  windowStartMs: number;
}

const buckets = new Map<string, AttemptBucket>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function canAttemptLogin(ip: string): boolean {
  const now = Date.now();
  const current = buckets.get(ip);

  if (!current || now - current.windowStartMs > WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStartMs: now });
    return true;
  }

  if (current.count >= MAX_ATTEMPTS) return false;
  current.count += 1;
  return true;
}
