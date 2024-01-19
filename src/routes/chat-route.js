const express = require("express");
const authenticateMiddleware = require("../middlewares/authenticate");
const chatController = require("../controllers/chat-controller");

const router = express.Router();
router.post("/chat", authenticateMiddleware, chatController.addMessage);
router.get("/getBuyInbox", authenticateMiddleware, chatController.getInboxBuy);
router.get("/getAllMyMessage/:productId/:receiverId", authenticateMiddleware, chatController.getAllChatByUserId);

module.exports = router;
