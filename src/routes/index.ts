import { Router } from "express";
import HealthRouter from "../modules/health/health.routes";
import AuthRouter from "../modules/auth/auth.routes";
import UploadRouter from "../modules/upload/upload.routes";

const router = Router();

router.get("/health", HealthRouter);
router.get("/auth", AuthRouter);
router.use("/upload", UploadRouter);

export default router;
