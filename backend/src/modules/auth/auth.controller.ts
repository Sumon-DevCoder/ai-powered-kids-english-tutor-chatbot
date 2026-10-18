import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../core/utils/catchAsync";
import ApiResponse from "../../core/responses/ApiResponse";
import AuthService from "./auth.service";
import { AuthRequest } from "../../core/middleware/auth.middleware";

export class AuthController {
  public static login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    ApiResponse.send(res, {
      statusCode: StatusCodes.OK,
      message: "Parent authentication successful",
      data: result,
    });
  });

  public static register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    const result = await AuthService.register(name, email, password, role);

    ApiResponse.send(res, {
      statusCode: StatusCodes.CREATED,
      message: "Parent account registered successfully",
      data: result,
    });
  });

  public static getMe = catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const user = await AuthService.getMe(userId!);

    ApiResponse.send(res, {
      statusCode: StatusCodes.OK,
      message: "Current parent profile retrieved successfully",
      data: user,
    });
  });
}

export default AuthController;
