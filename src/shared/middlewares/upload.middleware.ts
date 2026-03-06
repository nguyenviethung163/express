import multer from "multer";
import { ApiError } from "../errors/api-error";

// Configure memory storage as we delegate to providers
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Only images are allowed"));
    }
  }
});
