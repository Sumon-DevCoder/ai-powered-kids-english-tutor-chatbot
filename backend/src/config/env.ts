import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Load .env from process.cwd() or fallback
dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().default("mongodb://127.0.0.1:27017/ai_kids_tutor"),
  CORS_ORIGIN: z.string().default("*"),
  GEMINI_API_KEY: z.string().optional().default(""),
  OPENAI_API_KEY: z.string().optional().default(""),
  LOG_LEVEL: z.string().default("info"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
export default env;
