import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import errorHandler from "./core/errors/errorHandler";
import env from "./config/env";
import { getDbStatus } from "./config/db";

const app = express();

// Trust proxy for edge and load balancer deployments (Render/Railway)
app.set("trust proxy", 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsers
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Rate Limiter: 200 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Root & Health Monitoring Endpoints
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "AI Kids English Tutor API",
    version: "1.0.0",
    status: "online",
    targetAudience: "Children under 7 years old",
    database: getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "HEALTHY",
    uptimeSeconds: Math.floor(process.uptime()),
    database: getDbStatus(),
    latencyTarget: "< 2.0s SLA Active",
  });
});

// Mount Central API v1 Routes
app.use("/api/v1", routes);

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
