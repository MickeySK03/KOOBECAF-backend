const express = require("express");
const authenticateMiddleware = require("../middlewares/authenticate");
const productController = require("../controllers/product-controller");
const uploadMiddleware = require("../middlewares/upload");

const router = express.Router();

router.get("/allProduct", authenticateMiddleware, productController.getAllProduct);
router.get("/search", authenticateMiddleware, productController.searchProduct);
router.get("/category/:categoryId", authenticateMiddleware, productController.getProductByCategory);
router.get("/search/:userId", authenticateMiddleware, productController.getProductByUserId);
router.get("/wishlist", authenticateMiddleware, productController.getWishlistByUserId);
router.get("/:productId", authenticateMiddleware, productController.getProductById);
router.post(
    "/create",
    authenticateMiddleware,
    uploadMiddleware.fields([{ name: "productImage", maxCount: 5 }]),
    productController.createProduct,
);
router.patch(
    "/edit/:productId",
    authenticateMiddleware,
    uploadMiddleware.fields([{ name: "productImage", maxCount: 5 }]),
    productController.editProduct,
);
router.delete("/:productId", authenticateMiddleware, productController.deleteProduct);
router.post("/wishList/:productId", authenticateMiddleware, productController.wishListProduct);
router.put("/:productId", authenticateMiddleware, productController.updateProductStatus);

module.exports = router;
