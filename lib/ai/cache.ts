/**
 * Lightweight caching layer for AI responses.
 * Can be replaced by Redis in the future for distributed caching.
 */

export class AICache {
  private static cache = new Map<string, { response: string, expiry: number }>();
  private static DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

  static get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.response;
  }

  static set(key: string, response: string, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      response,
      expiry: Date.now() + ttl
    });
  }

  static generateKey(messages: any[], model: string): string {
    return JSON.stringify({ messages, model });
  }
}
