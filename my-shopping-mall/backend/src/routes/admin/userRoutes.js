const express = require("express");
const adminUserController = require("../../controllers/admin/userController.js");
const { authenticateToken } = require("../../middlewares/authMiddleware.js");
const adminAuth = require("../../middlewares/adminAuth.js");

const router = express.Router();

// GET /api/admin/users - 사용자 목록 조회
router.get("/", authenticateToken, adminAuth, adminUserController.getAllUsers);

// GET /api/admin/users/:id - 특정 사용자 조회
router.get("/:id", authenticateToken, adminAuth, adminUserController.getUserById);

// PUT /api/admin/users/:id/role - 사용자 권한 변경
router.put("/:id/role", authenticateToken, adminAuth, adminUserController.updateUserRole);

// DELETE /api/admin/users/:id - 사용자 삭제
router.delete("/:id", authenticateToken, adminAuth, adminUserController.deleteUser);

module.exports = router;
