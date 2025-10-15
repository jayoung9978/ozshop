const express = require("express");
const adminProductController = require("../../controllers/admin/productController.js");
const { authenticateToken } = require("../../middlewares/authMiddleware.js");
const adminAuth = require("../../middlewares/adminAuth.js");

const router = express.Router();

// POST /api/admin/products - 상품 생성
router.post("/", authenticateToken, adminAuth, adminProductController.createProduct);

// PUT /api/admin/products/:id - 상품 수정
router.put("/:id", authenticateToken, adminAuth, adminProductController.updateProduct);

// DELETE /api/admin/products/:id - 상품 삭제
router.delete("/:id", authenticateToken, adminAuth, adminProductController.deleteProduct);

// GET /api/admin/products - 관리자용 상품 목록 조회
router.get("/", authenticateToken, adminAuth, adminProductController.getAllProducts);

// GET /api/admin/products/:id - 관리자용 상품 상세 조회
router.get("/:id", authenticateToken, adminAuth, adminProductController.getProductById);

module.exports = router;
