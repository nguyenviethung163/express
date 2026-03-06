import { Request, Response } from "express";
import { StorageService } from "../../shared/utils/storage/storage.service";
import { ApiResponse } from "../../shared/utils/api-response";
import { ApiError } from "../../shared/errors/api-error";

/**
 * Handles single file upload.
 * Validates the presence of a file and uses StorageService to upload.
 */
export const uploadFile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /* 
      #swagger.tags = ['Upload']
      #swagger.summary = 'Upload a single file'
      #swagger.description = 'Uploads a single file to the configured storage provider (Local or Cloudinary)'
      #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['file'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'File to upload'
      }
      #swagger.responses[200] = {
        description: 'File uploaded successfully',
        schema: { $ref: '#/definitions/ApiResponse' }
      }
    */
  if (!req.file) {
    throw ApiError.badRequest("No file uploaded");
  }

  const result = await StorageService.upload(req.file, "uploads");

  return ApiResponse.ok(res, "File uploaded successfully", result);
};

/**
 * Handles multiple file uploads (up to 5).
 */
export const uploadMultipleFiles = async (
  req: Request,
  res: Response
): Promise<Response> => {
  /* 
      #swagger.tags = ['Upload']
      #swagger.summary = 'Upload multiple files'
      #swagger.description = 'Uploads up to 5 files to the configured storage provider'
      #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['files'] = {
        in: 'formData',
        type: 'array',
        items: { type: 'file' },
        required: true,
        description: 'Files to upload'
      }
      #swagger.responses[200] = {
        description: 'Files uploaded successfully',
        schema: { $ref: '#/definitions/ApiResponse' }
      }
    */
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw ApiError.badRequest("No files uploaded");
  }

  const uploadPromises = files.map(file =>
    StorageService.upload(file, "uploads")
  );
  const results = await Promise.all(uploadPromises);

  return ApiResponse.ok(res, "Files uploaded successfully", results);
};
