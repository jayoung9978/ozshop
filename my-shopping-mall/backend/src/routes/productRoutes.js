const express = require("express");
const productController = require("../controllers/productController.js");

const router = express.Router();

// GET /api/products/price-range - 가격 범위 조회
router.get("/price-range", productController.getPriceRange);

// GET /api/products - 모든 상품 조회
router.get("/", productController.getAllProducts);

// GET /api/products/:id - 특정 상품 조회
router.get("/:id", productController.getProductById);

module.exports = router;
