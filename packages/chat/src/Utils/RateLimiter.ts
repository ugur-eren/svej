type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimiterOptions = {
  maxAttempts: number;
  windowMs: number;
};

export default class RateLimiter {
  private readonly attempts = new Map<string, RateLimitEntry>();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  public constructor({maxAttempts, windowMs}: RateLimiterOptions) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  public consume(key: string): boolean {
    const now = Date.now();
    const existing = this.attempts.get(key);

    if (!existing || existing.resetAt <= now) {
      this.attempts.set(key, {count: 1, resetAt: now + this.windowMs});
      return true;
    }

    if (existing.count >= this.maxAttempts) {
      return false;
    }

    existing.count += 1;
    return true;
  }

  public sweepExpired(): void {
    const now = Date.now();

    this.attempts.forEach((entry, key) => {
      if (entry.resetAt <= now) {
        this.attempts.delete(key);
      }
    });
  }
}
