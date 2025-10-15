const express = require("express");
const adminOrderController = require("../../controllers/admin/orderController.js");
const { authenticateToken } = require("../../middlewares/authMiddleware.js");
const adminAuth = require("../../middlewares/adminAuth.js");

const router = express.Router();

// GET /api/admin/orders - 주문 목록 조회
router.get("/", authenticateToken, adminAuth, adminOrderController.getAllOrders);

// GET /api/admin/orders/:id - 특정 주문 상세 조회
router.get("/:id", authenticateToken, adminAuth, adminOrderController.getOrderById);

// PUT /api/admin/orders/:id/status - 주문 상태 변경
router.put("/:id/status", authenticateToken, adminAuth, adminOrderController.updateOrderStatus);

// DELETE /api/admin/orders/:id - 주문 삭제
router.delete("/:id", authenticateToken, adminAuth, adminOrderController.deleteOrder);

module.exports = router;
