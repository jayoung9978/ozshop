const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// 모든 주문 라우트는 인증 필요
router.use(authenticateToken);

// POST /api/orders - 주문 생성
router.post("/", orderController.createOrder);

// GET /api/orders - 사용자 주문 목록
router.get("/", orderController.getUserOrders);

// GET /api/orders/:id - 주문 상세 조회
router.get("/:id", orderController.getOrderById);

// PUT /api/orders/:id/cancel - 주문 취소
router.put("/:id/cancel", orderController.cancelOrder);

module.exports = router;
