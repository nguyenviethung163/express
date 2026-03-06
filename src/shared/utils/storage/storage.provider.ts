export interface StorageResult {
  url: string;
  key: string;
}

export interface IStorageProvider {
  upload(file: Express.Multer.File, path?: string): Promise<StorageResult>;
  delete(key: string): Promise<void>;
}
