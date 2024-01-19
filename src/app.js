require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");

const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const rateLimitMiddleware = require("./middlewares/rate-limit");
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const categoryRoute = require("./routes/category-route");
const productRoute = require("./routes/product-route");
const chatRoute = require("./routes/chat-route");
const paymentRoute = require("./routes/payment-route");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(morgan("dev"));
app.use(rateLimitMiddleware);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use("/inbox", chatRoute);
app.use("/payment", paymentRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = server;
