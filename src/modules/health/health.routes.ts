import { Router } from "express";
import { healthCheck, detailedHealthCheck } from "./health.controller";
import { cacheMiddleware } from "../../shared/middlewares/cache.middleware";
import { AsyncHandler } from "../../shared/utils/async-handler";

const router = Router();

router.get("/", AsyncHandler(healthCheck));
router.get("/detailed", cacheMiddleware(30), AsyncHandler(detailedHealthCheck));

export default router;
