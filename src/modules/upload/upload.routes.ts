import { Router } from "express";
import * as UploadController from "./upload.controller";
import { upload } from "../../shared/middlewares/upload.middleware";
import { AsyncHandler } from "../../shared/utils/async-handler";
import { verifyAuthentication } from "../../shared/middlewares/verify-auth";

const router = Router();

// Protect upload routes
router.use(verifyAuthentication as any);

router.post(
  "/single",
  upload.single("file"),
  AsyncHandler(UploadController.uploadFile)
);

router.post(
  "/multiple",
  upload.array("files", 5),
  AsyncHandler(UploadController.uploadMultipleFiles)
);

export default router;
