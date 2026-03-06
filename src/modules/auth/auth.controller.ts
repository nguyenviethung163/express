import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { verifyPassword } from "./auth.helpers";
import {
  generateAccessToken,
  generateRefreshToken
} from "../../shared/utils/jwt";
import { ApiResponse } from "../../shared/utils/api-response";
import { ApiError } from "../../shared/errors/api-error";
import { RegisterInput, LoginInput } from "./auth.validation";
import { UserRequest } from "../../types/user";
import { COOKIE_OPTIONS, TOKEN_EXPIRY } from "./auth.constants";
import { AuthUser } from "./auth.types";

/**
 * Handles user registration.
 * Checks for existing email and creates a new user record.
 */
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body = req.body as RegisterInput;

  const existingUser = await AuthService.findUserByEmail(body.email);
  if (existingUser) {
    throw ApiError.conflict("User with this email already exists");
  }

  const user = await AuthService.registerUser(body);

  return ApiResponse.created(res, "User registered successfully", user);
};

/**
 * Handles user login and session creation.
 * Validates credentials and issues secure access/refresh cookies.
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body as LoginInput;

  const user = await AuthService.findUserByEmail(email);
  if (!user || !user.password) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken(user.id);

  // Save refresh token to DB
  await AuthService.createRefreshToken({
    userId: user.id,
    tokenHash: refreshToken,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY.REFRESH)
  });

  res.cookie("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: TOKEN_EXPIRY.ACCESS
  });
  res.cookie("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: TOKEN_EXPIRY.REFRESH
  });

  const { password: _, ...userWithoutPassword } = user;
  return ApiResponse.ok(
    res,
    "Login successful",
    userWithoutPassword as AuthUser
  );
};

/**
 * Handles user logout.
 * Revokes the refresh token and clears authentication cookies.
 */
export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await AuthService.revokeRefreshToken(refreshToken);
  }

  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });

  return ApiResponse.ok(res, "Logout successful");
};

/**
 * Handles access token refreshment.
 * Validates the refresh token cookie and issues a new access token.
 */
export const refresh = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token is required");
  }

  const tokenData = await AuthService.findRefreshToken(refreshToken);
  if (!tokenData || tokenData.expiresAt < new Date()) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const accessToken = generateAccessToken({ id: tokenData.userId });
  res.cookie("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: TOKEN_EXPIRY.ACCESS
  });

  return ApiResponse.ok(res, "Token refreshed successfully");
};

/**
 * Fetches the current authenticated user's profile.
 * Requires valid authentication middleware to populate `req.user`.
 */
export const getMe = async (
  req: UserRequest,
  res: Response
): Promise<Response> => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const user = await AuthService.findUserById(req.user.id!);
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const { password, ...userWithoutPassword } = user;
  return ApiResponse.ok(
    res,
    "User profile fetched",
    userWithoutPassword as AuthUser
  );
};
