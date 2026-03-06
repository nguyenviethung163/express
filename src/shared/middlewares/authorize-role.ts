import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error";
import { UserRequest, userRoles } from "../../types/user";

export const authorizeRoles = (...allowedRoles: userRoles[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    // 1. Check if user is authenticated
    if (!req.user) {
      return next(ApiError.unauthorized("Unauthorized, Please login first."));
    }

    // 2. Check if user has required role
    const userRole = req.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(
        ApiError.forbidden(
          "Forbidden. You do not have permission to access this resource"
        )
      );
    }
    next();
  };
};
