import { Request } from "express";

export type userRoles = "user" | "admin";

export interface UserRequest extends Request {
  user?: {
    id?: number;
    name?: string;
    age?: number;
    email?: string;
    role?: userRoles;
  };
}
