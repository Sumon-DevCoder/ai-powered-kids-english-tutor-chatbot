import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../core/utils/catchAsync";
import ApiResponse from "../../core/responses/ApiResponse";
import ProfileService from "./profile.service";

export class ProfileController {
  public static getAllProfiles = catchAsync(async (_req: Request, res: Response) => {
    const profiles = await ProfileService.getAllProfiles();
    ApiResponse.send(res, {
      statusCode: StatusCodes.OK,
      message: "Profiles retrieved successfully",
      data: profiles,
    });
  });

  public static getProfileById = catchAsync(async (req: Request, res: Response) => {
    const profile = await ProfileService.getProfileById(req.params.id as string);
    ApiResponse.send(res, {
      statusCode: StatusCodes.OK,
      message: "Profile retrieved successfully",
      data: profile,
    });
  });

  public static createProfile = catchAsync(async (req: Request, res: Response) => {
    const newProfile = await ProfileService.createProfile(req.body);
    ApiResponse.send(res, {
      statusCode: StatusCodes.CREATED,
      message: "Profile created successfully",
      data: newProfile,
    });
  });
}

export default ProfileController;
