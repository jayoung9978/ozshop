const express = require("express");
const cartController = require("../controllers/cartController.js");
const { authenticateToken } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// POST /api/cart - 장바구니에 상품 추가
router.post("/", cartController.addToCart);

// GET /api/cart - 장바구니 조회
router.get("/", cartController.getCart);

// PUT /api/cart/:productId - 장바구니 상품 수량 업데이트
router.put("/:productId", cartController.updateCartItem);

// DELETE /api/cart/:productId - 장바구니에서 상품 삭제
router.delete("/:productId", cartController.removeFromCart);

module.exports = router;
