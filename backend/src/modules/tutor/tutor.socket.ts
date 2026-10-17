import { Server as SocketIOServer, Socket } from "socket.io";
import TutorService from "./tutor.service";
import logger from "../../core/utils/logger";

export const initTutorSocket = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    logger.info(`🔌 Client connected to Socket.io: ${socket.id}`);

    // Multi-Child Room Scoping: Child joins private room based on childId
    socket.on("join_child_room", (data: { childId: string }) => {
      if (data?.childId) {
        socket.join(`room_${data.childId}`);
        logger.info(`👶 Child ${data.childId} joined private room_${data.childId}`);
        socket.emit("room_joined", { childId: data.childId, status: "connected" });
      }
    });

    // Handle real-time conversational message
    socket.on(
      "send_message",
      async (data: { childId: string; text: string; manualModeOverride?: any }) => {
        const { childId, text, manualModeOverride } = data;
        const targetRoom = `room_${childId}`;

        try {
          // Notify client that Toby is thinking
          io.to(targetRoom).emit("tutor:status", { status: "thinking" });

          const result = await TutorService.processInteraction({
            childId,
            text,
            manualModeOverride,
          });

          // Simulate streaming tokens for immediate typing mascot effect
          const words = result.reply.split(" ");
          for (let i = 0; i < words.length; i++) {
            const token = i === words.length - 1 ? words[i] : `${words[i]} `;
            io.to(targetRoom).emit("tutor:token_stream", { token });
            // Tiny 20ms pause between tokens for natural speech sync
            await new Promise((resolve) => setTimeout(resolve, 20));
          }

          // Emit complete structured payload
          io.to(targetRoom).emit("tutor:complete", result);
        } catch (error: any) {
          logger.error(`Socket error for child ${childId}:`, error);
          io.to(targetRoom).emit("tutor:error", {
            message: error.message || "Failed to process message",
          });
        }
      }
    );

    socket.on("disconnect", () => {
      logger.info(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

export default initTutorSocket;
