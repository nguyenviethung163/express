---
description: How to add a new storage provider to the system
---

# Adding a New Storage Provider

Follow this guide to extend the storage system with a new provider (e.g., AWS S3, Google Cloud Storage, Azure Blob).

1. **Define Provider**: Create `src/shared/utils/storage/[name].provider.ts`.
2. **Implement Interface**: Ensure it implements `IStorageProvider`:
   ```typescript
   export class MyProvider implements IStorageProvider {
     async upload(file: Express.Multer.File, folder?: string): Promise<StorageResult> { ... }
     async delete(key: string): Promise<void> { ... }
   }
   ```
3. **Add Config**: Update `src/configs/env.ts` with required environment variables.
4. **Update Factory**: Add the new case to `StorageService.getInstance()` in `storage.service.ts`:
   ```typescript
   case "my-provider":
     StorageService.instance = new MyProvider();
     break;
   ```
5. **Update .env**: Set `STORAGE_PROVIDER=my-provider` and provide credentials.
6. **Verify**: Test file upload and delete functionality in a temporary route or test.
