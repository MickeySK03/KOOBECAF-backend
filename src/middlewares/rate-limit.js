const { rateLimit } = require("express-rate-limit");

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100000,
    message: "Too many requests from this IP",
});
