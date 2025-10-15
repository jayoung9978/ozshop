const pool = require("../../config/db.js");

/**
 * 관리자 - 모든 주문 조회
 */
exports.getAllOrders = async ({ page, limit, status, userId }) => {
	const offset = (page - 1) * limit;

	const connection = await pool.getConnection();
	try {
		const conditions = [];
		const values = [];

		if (status) {
			conditions.push("o.status = ?");
			values.push(status);
		}

		if (userId) {
			conditions.push("o.user_id = ?");
			values.push(userId);
		}

		const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		// 전체 개수 조회
		const [countResult] = await connection.query(
			`SELECT COUNT(*) as total FROM orders o ${whereClause}`,
			values
		);
		const total = countResult[0].total;

		// 주문 목록 조회 (사용자 정보 포함)
		const [orders] = await connection.query(
			`SELECT o.*, u.name as user_name, u.email as user_email
			 FROM orders o
			 LEFT JOIN users u ON o.user_id = u.id
			 ${whereClause}
			 ORDER BY o.created_at DESC
			 LIMIT ? OFFSET ?`,
			[...values, limit, offset]
		);

		return {
			orders,
			total,
		};
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 특정 주문 상세 조회 (주문 상품 포함)
 */
exports.getOrderById = async (orderId) => {
	const connection = await pool.getConnection();
	try {
		// 주문 정보 조회
		const [orderRows] = await connection.query(
			`SELECT o.*, u.name as user_name, u.email as user_email
			 FROM orders o
			 LEFT JOIN users u ON o.user_id = u.id
			 WHERE o.id = ?`,
			[orderId]
		);

		if (orderRows.length === 0) {
			return null;
		}

		const order = orderRows[0];

		// 주문 상품 조회
		const [items] = await connection.query(
			`SELECT oi.*, p.product_name, p.image_url
			 FROM order_items oi
			 LEFT JOIN products p ON oi.product_id = p.id
			 WHERE oi.order_id = ?`,
			[orderId]
		);

		order.items = items;

		return order;
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 주문 상태 변경
 */
exports.updateOrderStatus = async (orderId, status) => {
	const connection = await pool.getConnection();
	try {
		const [result] = await connection.query(
			"UPDATE orders SET status = ? WHERE id = ?",
			[status, orderId]
		);

		return result.affectedRows > 0;
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 주문 삭제
 */
exports.deleteOrder = async (orderId) => {
	const connection = await pool.getConnection();
	try {
		// order_items는 외래키 ON DELETE CASCADE로 자동 삭제됨
		const [result] = await connection.query(
			"DELETE FROM orders WHERE id = ?",
			[orderId]
		);

		return result.affectedRows > 0;
	} finally {
		connection.release();
	}
};
