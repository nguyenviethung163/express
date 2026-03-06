import Redis from "ioredis";
import env from "../../configs/env";
import { logger } from "./pino-logger";

/**
 * Singleton service for managing Redis connections and operations.
 * Provides easy access to common cache operations like GET, SET, and DEL.
 */
class RedisService {
  private static instance: Redis;

  private constructor() {}

  /**
   * Returns the singleton Redis instance, creating it if necessary.
   * @returns {Redis} The active Redis client instance.
   */
  public static getInstance(): Redis {
    if (!RedisService.instance) {
      RedisService.instance = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: times => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        }
      });

      RedisService.instance.on("connect", () => {
        logger.info("Redis connected successfully");
      });

      RedisService.instance.on("error", err => {
        logger.error({ err }, "Redis connection error");
      });
    }

    return RedisService.instance;
  }

  /**
   * Retrieves and parses data from Redis.
   * @template T The expected type of the data.
   * @param key - The cache key.
   * @returns {Promise<T | null>} The parsed data or null if not found/error.
   */
  public static async get<T>(key: string): Promise<T | null> {
    const data = await this.getInstance().get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error({ error, key }, "Error parsing redis data");
      return null;
    }
  }

  /**
   * Stores data in Redis with an optional TTL.
   * @param key - The cache key.
   * @param value - The data to store (will be JSON stringified).
   * @param ttlSeconds - Time-to-live in seconds (default: 1 hour).
   */
  public static async set(
    key: string,
    value: any,
    ttlSeconds: number = 3600
  ): Promise<void> {
    try {
      const data = JSON.stringify(value);
      await this.getInstance().set(key, data, "EX", ttlSeconds);
    } catch (error) {
      logger.error({ error, key }, "Error setting redis data");
    }
  }

  /**
   * Deletes a specific key from Redis.
   * @param key - The cache key to remove.
   */
  public static async del(key: string): Promise<void> {
    await this.getInstance().del(key);
  }

  /**
   * Deletes multiple keys matching a pattern using SCAN.
   * @param pattern - The key pattern (e.g., "user:*").
   */
  public static async delPattern(pattern: string): Promise<void> {
    const stream = this.getInstance().scanStream({
      match: pattern
    });

    stream.on("data", async (keys: string[]) => {
      if (keys.length) {
        const pipeline = this.getInstance().pipeline();
        keys.forEach(key => pipeline.del(key));
        await pipeline.exec();
      }
    });
  }
}

export default RedisService;
