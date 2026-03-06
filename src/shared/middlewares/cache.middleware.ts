import { Request, Response, NextFunction } from "express";
import RedisService from "../utils/redis";
import { logger } from "../utils/pino-logger";

/**
 * Cache middleware for Express
 * @param ttlSeconds Time to live in seconds
 * @returns
 */
export const cacheMiddleware = (ttlSeconds: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Build cache key: include user ID if authenticated
    const userId = (req as any).user?.id || "public";
    const key = `cache:${userId}:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await RedisService.get(key);

      if (cachedResponse) {
        logger.debug({ key }, "Cache hit");
        return res.status(200).json(cachedResponse);
      }

      logger.debug({ key }, "Cache miss");

      // Override res.json to capture and cache the response
      const originalJson = res.json;
      res.json = function (body: any) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          RedisService.set(key, body, ttlSeconds).catch(err => {
            logger.error({ err, key }, "Failed to set cache");
          });
        }
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      logger.error({ error, key }, "Cache middleware error");
      next();
    }
  };
};
