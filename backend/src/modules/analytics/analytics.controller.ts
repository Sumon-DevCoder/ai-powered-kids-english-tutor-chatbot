import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../core/utils/catchAsync";
import ApiResponse from "../../core/responses/ApiResponse";
import AnalyticsService from "./analytics.service";

export class AnalyticsController {
  public static getMetrics = catchAsync(async (_req: Request, res: Response) => {
    const metrics = await AnalyticsService.getSystemMetrics();

    ApiResponse.send(res, {
      statusCode: StatusCodes.OK,
      message: "System and learning analytics retrieved successfully",
      data: metrics,
    });
  });
}

export default AnalyticsController;
