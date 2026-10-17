import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../core/utils/catchAsync";
import ApiResponse from "../../core/responses/ApiResponse";
import TutorService from "./tutor.service";

export class TutorController {
  public static interact = catchAsync(async (req: Request, res: Response) => {
    const result = await TutorService.processInteraction({
      childId: req.body.childId,
      text: req.body.text,
      manualModeOverride: req.body.manualModeOverride,
    });

    ApiResponse.send(res, {
      statusCode: StatusCodes.OK,
      message: "Tutor interaction processed successfully",
      data: result,
      meta: {
        latencyMs: result.latencyMs,
        isSub2sCompliant: result.latencyMs < 2000,
        provider: result.provider,
      },
    });
  });

  public static getHistory = catchAsync(async (req: Request, res: Response) => {
    const childId = req.params.childId as string;
    const history = TutorService.getSessionHistory(childId);

    ApiResponse.send(res, {
      statusCode: StatusCodes.OK,
      message: "Session history retrieved successfully",
      data: history,
    });
  });

  public static resetSession = catchAsync(async (req: Request, res: Response) => {
    const childId = req.params.childId as string;
    const result = TutorService.resetSession(childId);

    ApiResponse.send(res, {
      statusCode: StatusCodes.OK,
      message: result.message,
      data: result,
    });
  });
}

export default TutorController;
