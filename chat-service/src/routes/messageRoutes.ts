import { Router } from "express";
import { send, getConversation } from "../controllers/MessageController";
import { authMiddleware } from "../middleware";

const messageRoutes = Router();

// @ts-ignore
messageRoutes.post("/send", authMiddleware, send);

messageRoutes.get(
    "/get/:receiverId",
    // @ts-ignore
    authMiddleware,
    getConversation
);
export { messageRoutes };