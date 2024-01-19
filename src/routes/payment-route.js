const express = require("express");
const paymentController = require("../controllers/payment-controller");
const authenticateMiddleware = require("../middlewares/authenticate");

const router = express.Router();

router.post("/", authenticateMiddleware, paymentController.payment);
router.post("/:transactionId", authenticateMiddleware, paymentController.createSubscribe);

module.exports = router;
