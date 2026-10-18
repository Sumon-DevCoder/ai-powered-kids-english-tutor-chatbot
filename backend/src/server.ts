import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import env from "./config/env";
import connectDatabase from "./config/db";
import initTutorSocket from "./modules/tutor/tutor.socket";
import logger from "./core/utils/logger";

const server = http.createServer(app);

// Initialize Socket.io Server
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 20000,
  pingInterval: 10000,
});

// Attach Tutor WebSocket Handlers
initTutorSocket(io);

const startServer = async () => {
  const PORT = env.PORT || 5000;

  // Start listening immediately
  server.listen(PORT, () => {
    logger.info(`🚀 AI Kids English Tutor Server running on port ${PORT}`);
    logger.info(`👶 Child Mode Engine: Active (L1, L2, L3 Progressive Learning)`);
    logger.info(`⚡ Latency SLA: < 2.0s Active Watchdog`);
    logger.info(`📡 Socket.io Real-time Gateway: Ready`);
  });

  // Connect to Database asynchronously without blocking server readiness
  const isDbConnected = await connectDatabase();
  if (isDbConnected) {
    const { seedInitialProfiles } = await import("./modules/profile/profile.model");
    await seedInitialProfiles();
    logger.info("🌱 MongoDB Atlas: Initial child profiles synchronized successfully");
  }
};

startServer();

// Graceful Shutdown
const handleShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Gracefully closing HTTP and WebSocket server...`);
  server.close(() => {
    logger.info("Server closed successfully.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

export { server, io };
export default server;
