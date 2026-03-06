import { Router } from "express";
import * as AuthController from "./auth.controller";
import { validateRequest } from "../../shared/middlewares/validate-request";
import { registerSchema, loginSchema } from "./auth.validation";
import { verifyAuthentication } from "../../shared/middlewares/verify-auth";

import {
  signupRateLimiter,
  signinRateLimiter
} from "../../shared/middlewares/rate-limiter";
import { cacheMiddleware } from "../../shared/middlewares/cache.middleware";
import { AsyncHandler } from "../../shared/utils/async-handler";

const router = Router();

router.post(
  "/register",
  signupRateLimiter,
  validateRequest(registerSchema),
  AsyncHandler(AuthController.register)
);
router.post(
  "/login",
  signinRateLimiter,
  validateRequest(loginSchema),
  AsyncHandler(AuthController.login)
);
router.post("/logout", AsyncHandler(AuthController.logout));
router.post("/refresh", AsyncHandler(AuthController.refresh));
router.get(
  "/me",
  verifyAuthentication as any,
  cacheMiddleware(60),
  AsyncHandler(AuthController.getMe)
);

export default router;
