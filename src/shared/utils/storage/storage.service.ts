import {
  IStorageProvider,
  StorageResult
} from "./storage.provider";
import { LocalStorageProvider } from "./local.provider";
import { CloudinaryProvider } from "./cloudinary.provider";
import env from "../../../configs/env";

/**
 * Singleton service for managing file storage operations.
 * Dynamically selects a provider based on environment configuration.
 */
export class StorageService {
  private static instance: IStorageProvider;

  /**
   * Returns the singleton storage provider instance.
   * @throws {Error} If an invalid STORAGE_PROVIDER is configured.
   */
  private static getInstance(): IStorageProvider {
    if (!StorageService.instance) {
      const provider = env.STORAGE_PROVIDER;

      switch (provider) {
        case "local":
          StorageService.instance = new LocalStorageProvider();
          break;
        case "cloudinary":
          StorageService.instance = new CloudinaryProvider();
          break;
        default:
          throw new Error(`Invalid STORAGE_PROVIDER: ${provider}`);
      }
    }
    return StorageService.instance;
  }

  /**
   * Uploads a file using the configured provider.
   * @param file - The file to upload.
   * @param folder - Optional folder/path to store the file in.
   */
  public static async upload(
    file: Express.Multer.File,
    folder?: string
  ): Promise<StorageResult> {
    return this.getInstance().upload(file, folder);
  }

  /**
   * Deletes a file from storage.
   * @param key - The unique identifier/path of the file to delete.
   */
  public static async delete(key: string): Promise<void> {
    return this.getInstance().delete(key);
  }
}
