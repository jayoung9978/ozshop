const express = require("express");
const dashboardController = require("../../controllers/admin/dashboardController.js");
const { authenticateToken } = require("../../middlewares/authMiddleware.js");
const adminAuth = require("../../middlewares/adminAuth.js");

const router = express.Router();

// GET /api/admin/dashboard/stats - 대시보드 통계
router.get(
	"/stats",
	authenticateToken,
	adminAuth,
	dashboardController.getStats
);

module.exports = router;
