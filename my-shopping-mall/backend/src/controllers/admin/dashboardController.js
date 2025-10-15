const pool = require("../../config/db.js");

// 대시보드 통계 조회
exports.getStats = async (req, res) => {
	try {
		const connection = await pool.getConnection();

		try {
			// 상품 수 조회
			const [productCount] = await connection.query(
				"SELECT COUNT(*) as count FROM products"
			);

			// 사용자 수 조회
			const [userCount] = await connection.query(
				"SELECT COUNT(*) as count FROM users"
			);

			// 주문 수 조회
			const [orderCount] = await connection.query(
				"SELECT COUNT(*) as count FROM orders"
			);

			res.status(200).json({
				success: true,
				data: {
					productCount: productCount[0].count,
					userCount: userCount[0].count,
					orderCount: orderCount[0].count,
				},
			});
		} finally {
			connection.release();
		}
	} catch (error) {
		console.error("통계 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "통계 조회 중 오류가 발생했습니다.",
		});
	}
};
