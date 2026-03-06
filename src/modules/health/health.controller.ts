import { Request, Response } from "express";
import { db } from "../../db/db";
import { ApiResponse } from "../../shared/utils/api-response";
import RedisService from "../../shared/utils/redis";

/**
 * Simple health check controller.
 * Returns a 200 OK response to verify the server is running.
 */
export const healthCheck = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return ApiResponse.ok(res, "Server is healthy");
};

/**
 * Detailed health check including DB and Redis status.
 */
export const detailedHealthCheck = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let dbStatus = "up";
  let redisStatus = "up";

  try {
    await db.execute("SELECT 1");
  } catch (error) {
    dbStatus = "down";
  }

  try {
    const redis = RedisService.getInstance();
    await redis.ping();
  } catch (error) {
    redisStatus = "down";
  }

  const healthData = {
    unit: "MB"
  },
    cpu: {
      usage: process.cpuUsage()
    }
};

return ApiResponse.Success(res, "Service is healthy", healthData);
};
