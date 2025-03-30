interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public getSize(): number {
    return this.cache.size;
  }

  public getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  public getEntries<T>(): [string, T][] {
    return Array.from(this.cache.entries()).map(([key, entry]) => [
      key,
      entry.data as T,
    ]);
  }

  public setWithCallback<T>(
    key: string,
    callback: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    if (this.has(key)) {
      return Promise.resolve(this.get<T>(key)!);
    }

    return callback().then((data) => {
      this.set(key, data, ttl);
      return data;
    });
  }
}

export const cache = Cache.getInstance();

// Example usage:
/*
// Set cache entry
cache.set('user-123', { name: 'John', age: 30 });

// Get cache entry
const user = cache.get<{ name: string; age: number }>('user-123');

// Check if key exists
const exists = cache.has('user-123');

// Delete cache entry
cache.delete('user-123');

// Clear all cache
cache.clear();

// Get cache size
const size = cache.getSize();

// Get all cache keys
const keys = cache.getKeys();

// Get all cache entries
const entries = cache.getEntries<{ name: string; age: number }>();

// Set with callback
const user = await cache.setWithCallback(
  'user-123',
  () => fetchUser('123'),
  10 * 60 * 1000 // 10 minutes
);
*/ 