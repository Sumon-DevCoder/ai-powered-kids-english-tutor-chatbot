import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import ApiError from "./ApiError";
import { ErrorCodes } from "./ErrorCodes";
import logger from "../utils/logger";
import env from "../../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorCode = ErrorCodes.INTERNAL_SERVER_ERROR;
  let details: any = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.errorCode as ErrorCodes;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    errorCode = ErrorCodes.VALIDATION_ERROR;
    message = "Request validation failed";
    details = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (err.name === "CastError") {
    statusCode = StatusCodes.BAD_REQUEST;
    errorCode = ErrorCodes.BAD_REQUEST;
    message = `Invalid format for field: ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    errorCode = ErrorCodes.BAD_REQUEST;
    message = "Duplicate key violation";
    details = err.keyValue;
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error(`[${req.method} ${req.originalUrl}] - ${message}`, {
    statusCode,
    errorCode,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    errorCode,
    message,
    ...(details && { details }),
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
