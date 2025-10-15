const express = require("express");
const userController = require("../controllers/userController.js");
const { authenticateToken } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// GET /api/user - 사용자 정보 조회
router.get("/", userController.getUserInfo);

// PUT /api/user - 사용자 정보 업데이트
router.put("/", userController.updateUserInfo);

module.exports = router;
