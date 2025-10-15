const pool = require("../config/db.js");

// 장바구니에 상품 추가
exports.addToCart = async (userId, productId, quantity) => {
	const connection = await pool.getConnection();
	try {
		// 이미 장바구니에 있는지 확인
		const [existing] = await connection.query(
			"SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
			[userId, productId]
		);

		if (existing.length > 0) {
			// 이미 있으면 수량 업데이트
			await connection.query(
				"UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
				[quantity, userId, productId]
			);
		} else {
			// 없으면 새로 추가
			await connection.query(
				"INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
				[userId, productId, quantity]
			);
		}
	} finally {
		connection.release();
	}
};

// 사용자의 장바구니 조회
exports.getCart = async (userId) => {
	const [rows] = await pool.query(
		`SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url
		FROM cart c
		JOIN products p ON c.product_id = p.id
		WHERE c.user_id = ?`,
		[userId]
	);
	return rows;
};

// 장바구니 상품 수량 업데이트
exports.updateCartItem = async (userId, productId, quantity) => {
	await pool.query(
		"UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
		[quantity, userId, productId]
	);
};

// 장바구니에서 상품 삭제
exports.removeFromCart = async (userId, productId) => {
	await pool.query(
		"DELETE FROM cart WHERE user_id = ? AND product_id = ?",
		[userId, productId]
	);
};
