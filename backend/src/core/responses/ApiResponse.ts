import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export interface ApiResponseOptions<T> {
  statusCode?: number;
  message?: string;
  data: T;
  meta?: Record<string, any>;
}

export class ApiResponse {
  public static send<T>(res: Response, options: ApiResponseOptions<T>): void {
    const statusCode = options.statusCode || StatusCodes.OK;
    res.status(statusCode).json({
      success: true,
      statusCode,
      message: options.message || "Operation successful",
      data: options.data,
      ...(options.meta && { meta: options.meta }),
    });
  }
}

export default ApiResponse;
