import express from "express";
import { sendMessage, allMessages, getAllUsers } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", isAuthenticated, getAllUsers);
router.post("/message", isAuthenticated, sendMessage);
router.get("/messages/:chatId", isAuthenticated, allMessages);

export default router;