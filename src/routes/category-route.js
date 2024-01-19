const express = require("express");
const authenticateMiddleware = require("../middlewares/authenticate");
const categoryController = require("../controllers/category-controller");

const router = express.Router();
router.get("/allCategory", authenticateMiddleware, categoryController.allCategories);
router.get("/:categoryId", authenticateMiddleware, categoryController.categories);

module.exports = router;
