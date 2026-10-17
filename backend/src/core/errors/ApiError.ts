import { StatusCodes } from "http-status-codes";
import { ErrorCodes } from "./ErrorCodes";

export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public isOperational: boolean;
  public details?: any;

  constructor(
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    message: string = "An unexpected error occurred",
    errorCode: string = ErrorCodes.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
