import mongoose from "mongoose";
import env from "./env";
import logger from "../core/utils/logger";

let isConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  if (!env.DATABASE_URL) {
    logger.warn("⚠️ No DATABASE_URL provided. Operating in high-speed In-Memory repository mode.");
    return false;
  }

  try {
    const conn = await mongoose.connect(env.DATABASE_URL, {
      serverSelectionTimeoutMS: 3000, // Fast timeout (3s) to not block startup if DB is down
    });
    isConnected = true;
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    logger.warn(`⚠️ MongoDB Connection Failed (${error.message}). Gracefully falling back to In-Memory repository mode.`);
    isConnected = false;
    return false;
  }
};

export const getDbStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
  };
};

export default connectDatabase;
