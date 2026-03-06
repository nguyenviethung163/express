import fs from "node:fs/promises";
import path from "node:path";
import { IStorageProvider, StorageResult } from "./storage.provider";
import env from "../../../configs/env";
import { logger } from "../pino-logger";

/**
 * Storage provider that saves files to the local filesystem.
 * Files are stored in the directory specified by `UPLOAD_DIR`.
 */
export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
    this.ensureDir();
  }

  /**
   * Ensures that the base upload directory exists.
   */
  private async ensureDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Uploads a file to the local filesystem.
   * @param file - The file to upload.
   * @param folder - Subfolder within the base upload directory.
   * @returns {Promise<StorageResult>} The relative URL and key of the saved file.
   */
  async upload(
    file: Express.Multer.File,
    folder: string = ""
  ): Promise<StorageResult> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const relativePath = path.join(folder, fileName);
    const fullPath = path.join(this.uploadDir, relativePath);

    // Create subfolder if it doesn't exist
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    await fs.writeFile(fullPath, file.buffer);

    // In a real app, you might want to serve these files via static middleware
    // and return the full URL based on the APP_URL
    const url = `/uploads/${relativePath.replace(/\\/g, "/")}`;

    return { url, key: relativePath };
  }

  /**
   * Deletes a file from the local filesystem.
   * @param key - The relative path (key) of the file to delete.
   */
  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, key);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      logger.error({ error, key }, "Failed to delete local file");
    }
  }
}
