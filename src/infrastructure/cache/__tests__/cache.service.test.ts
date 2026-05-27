import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createCacheService } from '../cache.service.js';

function createMockRedis() {
  const store = new Map<string, string>();
  return {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    set: vi.fn(async (key: string, value: string, _ex?: string, _ttl?: number) => {
      store.set(key, value);
      return 'OK';
    }),
    del: vi.fn(async (...keys: string[]) => {
      let count = 0;
      for (const k of keys) {
        if (store.delete(k)) count++;
      }
      return count;
    }),
    scan: vi.fn(async () => ['0', []] as [string, string[]]),
    _store: store,
  };
}

describe('createCacheService (Redis)', () => {
  let mockRedis: ReturnType<typeof createMockRedis>;
  let cache: ReturnType<typeof createCacheService>;

  beforeEach(() => {
    mockRedis = createMockRedis();
    cache = createCacheService(mockRedis as never);
  });

  it('get returns null on cache miss', async () => {
    const result = await cache.get('missing-key');
    expect(result).toBeNull();
    expect(mockRedis.get).toHaveBeenCalledWith('missing-key');
  });

  it('get returns parsed value on cache hit', async () => {
    mockRedis._store.set('my-key', JSON.stringify({ name: 'test' }));
    const result = await cache.get('my-key');
    expect(result).toEqual({ name: 'test' });
  });

  it('set stores JSON-serialized value with TTL', async () => {
    await cache.set('key', { data: 1 }, 60);
    expect(mockRedis.set).toHaveBeenCalledWith('key', JSON.stringify({ data: 1 }), 'EX', 60);
  });

  it('set uses default TTL when not specified', async () => {
    await cache.set('key', 'value');
    expect(mockRedis.set).toHaveBeenCalledWith('key', JSON.stringify('value'), 'EX', 300);
  });

  it('invalidate deletes the key', async () => {
    await cache.invalidate('key');
    expect(mockRedis.del).toHaveBeenCalledWith('key');
  });

  it('getOrSet returns cached value without calling fn', async () => {
    mockRedis._store.set('key', JSON.stringify('cached-value'));
    const fn = vi.fn().mockResolvedValue('computed-value');
    const result = await cache.getOrSet('key', fn, 60);
    expect(result).toBe('cached-value');
    expect(fn).not.toHaveBeenCalled();
  });

  it('getOrSet calls fn and caches result on miss', async () => {
    const fn = vi.fn().mockResolvedValue('computed-value');
    const result = await cache.getOrSet('key', fn, 60);
    expect(fn).toHaveBeenCalledOnce();
    expect(result).toBe('computed-value');
    expect(mockRedis.set).toHaveBeenCalledWith('key', JSON.stringify('computed-value'), 'EX', 60);
  });

  it('invalidatePattern scans and deletes matching keys', async () => {
    mockRedis.scan.mockResolvedValueOnce(['0', ['key:1', 'key:2']]);
    await cache.invalidatePattern('key:*');
    expect(mockRedis.scan).toHaveBeenCalledWith('0', 'MATCH', 'key:*', 'COUNT', 100);
    expect(mockRedis.del).toHaveBeenCalledWith('key:1', 'key:2');
  });
});
