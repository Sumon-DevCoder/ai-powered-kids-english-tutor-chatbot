import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../../config/env";
import ApiError from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: "parent" | "educator";
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Authentication required. Please provide a valid Bearer token."
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    (req as AuthRequest).user = decoded;
    next();
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Invalid or expired authentication token. Please log in again."
    );
  }
};

export default requireAuth;
