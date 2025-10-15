const pool = require("../config/db.js");

/**
 * 관리자 권한 검증 미들웨어
 * JWT 인증 후 사용자의 role이 'admin'인지 확인
 */
const adminAuth = async (req, res, next) => {
	try {
		// authMiddleware에서 이미 userId를 설정했음
		if (!req.userId) {
			return res.status(401).json({
				success: false,
				message: "인증이 필요합니다.",
			});
		}

		const connection = await pool.getConnection();
		try {
			const [rows] = await connection.query(
				"SELECT role FROM users WHERE id = ?",
				[req.userId]
			);

			if (rows.length === 0) {
				return res.status(404).json({
					success: false,
					message: "사용자를 찾을 수 없습니다.",
				});
			}

			const user = rows[0];

			if (user.role !== "admin") {
				return res.status(403).json({
					success: false,
					message: "관리자 권한이 필요합니다.",
				});
			}

			// 관리자 권한 확인 완료
			next();
		} finally {
			connection.release();
		}
	} catch (error) {
		console.error("관리자 권한 검증 오류:", error);
		return res.status(500).json({
			success: false,
			message: "권한 검증 중 오류가 발생했습니다.",
		});
	}
};

module.exports = adminAuth;
