const pool = require("../config/db");

// 주문 생성 (장바구니에서)
exports.createOrder = async (userId, shippingAddress) => {
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		// 1. 장바구니 조회
		const [cartItems] = await connection.query(
			`SELECT c.*, p.name as product_name, p.price, p.image_url, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
			[userId]
		);

		if (cartItems.length === 0) {
			throw new Error("장바구니가 비어있습니다");
		}

		// 2. 재고 확인 및 총액 계산
		let totalAmount = 0;
		for (const item of cartItems) {
			if (item.stock < item.quantity) {
				throw new Error(`${item.product_name}의 재고가 부족합니다`);
			}
			totalAmount += item.price * item.quantity;
		}

		// 3. 주문 생성
		const [orderResult] = await connection.query(
			`INSERT INTO orders (user_id, total_amount, shipping_address, status)
       VALUES (?, ?, ?, 'pending')`,
			[userId, totalAmount, shippingAddress]
		);

		const orderId = orderResult.insertId;

		// 4. 주문 상품 생성 및 재고 감소
		for (const item of cartItems) {
			// 주문 상품 추가
			await connection.query(
				`INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
				[
					orderId,
					item.product_id,
					item.product_name,
					item.price,
					item.quantity,
					item.image_url,
				]
			);

			// 재고 감소
			await connection.query(
				`UPDATE products SET stock = stock - ? WHERE id = ?`,
				[item.quantity, item.product_id]
			);
		}

		// 5. 장바구니 비우기
		await connection.query(`DELETE FROM cart WHERE user_id = ?`, [userId]);

		await connection.commit();
		return orderId;
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
};

// 사용자의 주문 목록 조회
exports.getUserOrders = async (userId) => {
	const connection = await pool.getConnection();
	try {
		const [orders] = await connection.query(
			`SELECT id, total_amount, status, shipping_address, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
			[userId]
		);
		return orders;
	} finally {
		connection.release();
	}
};

// 주문 상세 조회
exports.getOrderById = async (orderId, userId) => {
	const connection = await pool.getConnection();
	try {
		// 주문 정보 조회
		const [orders] = await connection.query(
			`SELECT * FROM orders WHERE id = ? AND user_id = ?`,
			[orderId, userId]
		);

		if (orders.length === 0) {
			throw new Error("주문을 찾을 수 없습니다");
		}

		const order = orders[0];

		// 주문 상품 조회
		const [items] = await connection.query(
			`SELECT * FROM order_items WHERE order_id = ?`,
			[orderId]
		);

		return {
			...order,
			items,
		};
	} finally {
		connection.release();
	}
};

// 주문 취소
exports.cancelOrder = async (orderId, userId) => {
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		// 1. 주문 확인
		const [orders] = await connection.query(
			`SELECT * FROM orders WHERE id = ? AND user_id = ?`,
			[orderId, userId]
		);

		if (orders.length === 0) {
			throw new Error("주문을 찾을 수 없습니다");
		}

		const order = orders[0];

		if (order.status !== "pending") {
			throw new Error("이미 처리 중인 주문은 취소할 수 없습니다");
		}

		// 2. 주문 상품 조회 및 재고 복구
		const [items] = await connection.query(
			`SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
			[orderId]
		);

		for (const item of items) {
			await connection.query(
				`UPDATE products SET stock = stock + ? WHERE id = ?`,
				[item.quantity, item.product_id]
			);
		}

		// 3. 주문 상태 변경
		await connection.query(
			`UPDATE orders SET status = 'cancelled' WHERE id = ?`,
			[orderId]
		);

		await connection.commit();
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
};
