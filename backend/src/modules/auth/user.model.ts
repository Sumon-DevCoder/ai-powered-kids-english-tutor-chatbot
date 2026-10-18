import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import logger from "../../core/utils/logger";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "parent" | "educator";
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["parent", "educator"], default: "parent" },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);

// In-Memory store for high-speed offline/testing support
export const inMemoryUserStore = new Map<string, IUser>();

export const hashPassword = async (plain: string): Promise<string> => {
  return await bcrypt.hash(plain, 10);
};

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(plain, hashed);
};

// Default Demo Parent Account for Evaluators
export const DEFAULT_DEMO_PARENT = {
  _id: "user_parent_demo",
  name: "Parent / Educator Admin",
  email: "parent@toby.ai",
  passwordPlain: "password123",
  role: "parent" as const,
};

export const seedDefaultParent = async (): Promise<void> => {
  try {
    const hashedPassword = await hashPassword(DEFAULT_DEMO_PARENT.passwordPlain);
    const parentData: IUser = {
      _id: DEFAULT_DEMO_PARENT._id,
      name: DEFAULT_DEMO_PARENT.name,
      email: DEFAULT_DEMO_PARENT.email,
      password: hashedPassword,
      role: DEFAULT_DEMO_PARENT.role,
    };

    // Keep in memory store
    inMemoryUserStore.set(parentData.email, parentData);

    // Save to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const exists = await User.findOne({ email: parentData.email });
      if (!exists) {
        await User.create(parentData);
        logger.info("🔑 Default Parent Account seeded in MongoDB Atlas: parent@toby.ai");
      }
    }
  } catch (err: any) {
    logger.warn(`⚠️ Error seeding default parent: ${err.message}`);
  }
};
