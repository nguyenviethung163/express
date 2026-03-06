import { STATUS_CODES, StatusCode } from "../constants/status-codes";
import type { Response } from "express";

type ApiResponseParams<T> = {
  success: boolean;
  message: string;
  statusCode: StatusCode;
  data?: T | null;
  errors?: unknown;
};

/**
 * Standard utility for building and sending consistent API responses.
 * Ensures that all API endpoints return data in a predictable format.
 * @template T The type of the data payload.
 */
export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly statusCode: StatusCode;
  public readonly data?: T | null;
  public readonly errors?: unknown;

  /**
   * Creates an instance of ApiResponse.
   * @param params - The response parameters.
   */
  constructor({
    success,
    message,
    statusCode,
    data = null,
    errors
  }: ApiResponseParams<T>) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.errors = errors;
  }

  /**
   * Finalizes and sends requested response via Express response object.
   * @param res - The Express response object.
   * @returns {Response} The sent response.
   */
  send(res: Response): Response {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.data !== undefined && { data: this.data }),
      ...(this.errors !== undefined && { errors: this.errors })
    });
  }

  /**
   * Generic success response helper.
   * @param res - Express response object.
   * @param message - Success message.
   * @param data - Payload (optional).
   * @param statusCode - HTTP status code (default: 200 OK).
   */
  static Success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: StatusCode = STATUS_CODES.OK
  ): Response {
    return new ApiResponse<T>({
      success: true,
      message,
      data,
      statusCode
    }).send(res);
  }

  /**
   * Sends a 200 OK response.
   */
  static ok<T>(res: Response, message = "OK", data?: T) {
    return ApiResponse.Success(res, message, data, STATUS_CODES.OK);
  }

  /**
   * Sends a 201 Created response.
   */
  static created<T>(res: Response, message = "Created", data?: T) {
    return ApiResponse.Success(res, message, data, STATUS_CODES.CREATED);
  }
}

/*
 * Usage:
 * ApiResponse.ok(res, "OK", data);
 * ApiResponse.created(res, "Created", data);
 */
