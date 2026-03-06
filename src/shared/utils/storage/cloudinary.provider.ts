import { v2 as cloudinary } from "cloudinary";
import { IStorageProvider, StorageResult } from "./storage.provider";
import env from "../../../configs/env";

/**
 * Storage provider that uploads files to Cloudinary.
 * Requires `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
 */
export class CloudinaryProvider implements IStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET
    });
  }

  /**
   * Uploads a file to Cloudinary.
   * @param file - The file to upload.
   * @param folder - The Cloudinary folder to store the file in.
   * @returns {Promise<StorageResult>} The secure URL and public ID of the uploaded file.
   */
  async upload(
    file: Express.Multer.File,
    folder: string = "uploads"
  ): Promise<StorageResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto"
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Cloudinary upload failed"));

          resolve({
            url: result.secure_url,
            key: result.public_id
          });
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Deletes a file from Cloudinary.
   * @param key - The public ID (key) of the file to delete.
   */
  async delete(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key);
  }
}
