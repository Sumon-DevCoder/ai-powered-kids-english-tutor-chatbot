import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import env from "../../config/env";
import ApiError from "../../core/errors/ApiError";
import { StatusCodes } from "http-status-codes";
import {
  User,
  IUser,
  inMemoryUserStore,
  hashPassword,
  comparePassword,
} from "./user.model";

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: "parent" | "educator";
  };
}

export class AuthService {
  private static generateToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
  }

  public static async login(emailInput: string, passwordInput: string): Promise<AuthResponse> {
    const email = (emailInput || "").toLowerCase().trim();

    let user: IUser | null = null;

    // Check MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email }).lean();
      } catch {
        // Fallback to memory store
      }
    }

    // Fallback to memory store
    if (!user) {
      user = inMemoryUserStore.get(email) || null;
    }

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const isMatch = await comparePassword(passwordInput, user.password);
    if (!isMatch) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const token = this.generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  public static async register(
    name: string,
    emailInput: string,
    passwordInput: string,
    role: "parent" | "educator" = "parent"
  ): Promise<AuthResponse> {
    const email = (emailInput || "").toLowerCase().trim();

    // Check if user already exists
    let existingUser: any = inMemoryUserStore.get(email);
    if (!existingUser && mongoose.connection.readyState === 1) {
      try {
        existingUser = await User.findOne({ email }).lean();
      } catch {
        // Ignored
      }
    }

    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, "A user with this email already exists");
    }

    const hashedPassword = await hashPassword(passwordInput);
    const generatedId = `user_${Date.now()}`;

    const newUser: IUser = {
      _id: generatedId,
      name: name.trim(),
      email,
      password: hashedPassword,
      role,
    };

    // Save to memory store
    inMemoryUserStore.set(email, newUser);

    // Save to DB
    if (mongoose.connection.readyState === 1) {
      try {
        await User.create(newUser);
      } catch {
        // Memory store update already succeeded
      }
    }

    const token = this.generateToken({
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  public static async getMe(userId: string): Promise<any> {
    let user: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(userId).select("-password").lean();
      } catch {
        // Fallback
      }
    }

    if (!user) {
      for (const u of inMemoryUserStore.values()) {
        if (u._id === userId) {
          user = { _id: u._id, name: u.name, email: u.email, role: u.role };
          break;
        }
      }
    }

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User profile not found");
    }

    return user;
  }
}

export default AuthService;
