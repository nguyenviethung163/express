import { Request, Response, NextFunction } from "express";
import env from "../../configs/env";

import { ApiError } from "../errors/api-error";
import { logger } from "../utils/pino-logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  logger.error(
    err,
    `Error: ${message} | Status: ${statusCode} | Path: ${req.method} ${req.originalUrl}`
  );

  const response: any = {
    success: false,
    message
  };

  if (err instanceof ApiError && err.errors) {
    response.errors = err.errors;
  }

  if (env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
