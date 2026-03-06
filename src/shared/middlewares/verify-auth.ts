import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from "../utils/jwt";
import { logger } from "../utils/pino-logger";
import env from "../../configs/env";
import { UserRequest } from "../../types/user";
import { ApiError } from "../errors/api-error";
import { AuthService } from "../../modules/auth/auth.service";
import { NextFunction, Response } from "express";

const isProduction = env.NODE_ENV === "production";
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/"
};

export async function verifyAuthentication(
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  // Step 1: Try validating access token
  try {
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      req.user = decoded;
      return next();
    }
  } catch (err) {
    // Access token expired or invalid
    logger.warn("Access token verification failed");
  }

  // Step 2: Refresh token required if access token fails
  if (!refreshToken) {
    return next(ApiError.unauthorized("Unauthorized, Please login first."));
  }

  try {
    const decodedRefresh = verifyRefreshToken(refreshToken);

    // Step 3: Ensure token is valid in DB
    const tokenInDb = await AuthService.findRefreshToken(refreshToken);

    if (!tokenInDb || tokenInDb.expiresAt < new Date()) {
      return next(ApiError.unauthorized("Unauthorized, Please login first."));
    }

    // Step 4: Ensure user still exists
    const userInDb = await AuthService.findUserById(decodedRefresh.userId);

    if (!userInDb) {
      return next(ApiError.unauthorized("Unauthorized, Please login first."));
    }

    // Step 5: Issue new tokens
    const newAccessToken = generateAccessToken({ id: userInDb.id });
    const newRefreshToken = generateRefreshToken(userInDb.id);

    // Revoke old token and save new one
    await AuthService.revokeRefreshToken(refreshToken);
    await AuthService.createRefreshToken({
      userId: userInDb.id,
      tokenHash: newRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    });

    // Step 6: Saved accessToken and refreshToken in cookie
    res.cookie("accessToken", newAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_EXPIRY
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_EXPIRY
    });

    // Step 7: Attach user to request
    req.user = {
      id: userInDb.id,
      email: userInDb.email,
      role: userInDb.role as any
    };

    return next();
  } catch (err: any) {
    logger.warn("Refresh token verification failed");
    return next(ApiError.unauthorized("Unauthorized, Please login first."));
  }
}
