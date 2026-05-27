import type { Redis } from 'ioredis';

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  invalidate(key: string): Promise<void>;
  invalidatePattern(pattern: string): Promise<void>;
  getOrSet<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}

const DEFAULT_TTL_SECONDS = 300;

export function createCacheService(redis: Redis): CacheService {
  return {
    async get<T>(key: string): Promise<T | null> {
      const data = await redis.get(key);
      return data ? (JSON.parse(data) as T) : null;
    },

    async set(key: string, value: unknown, ttlSeconds = DEFAULT_TTL_SECONDS): Promise<void> {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    },

    async invalidate(key: string): Promise<void> {
      await redis.del(key);
    },

    async invalidatePattern(pattern: string): Promise<void> {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        );
        cursor = nextCursor;
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== '0');
    },

    async getOrSet<T>(key: string, fn: () => Promise<T>, ttlSeconds = DEFAULT_TTL_SECONDS): Promise<T> {
      const cached = await redis.get(key);
      if (cached) return JSON.parse(cached) as T;

      const result = await fn();
      await redis.set(key, JSON.stringify(result), 'EX', ttlSeconds);
      return result;
    },
  };
}
