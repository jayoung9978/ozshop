const pool = require("../../config/db.js");

/**
 * 관리자 - 상품 생성
 */
exports.createProduct = async (productData) => {
	const { product_name, description, price, stock_quantity, category, image_url } = productData;

	const connection = await pool.getConnection();
	try {
		const [result] = await connection.query(
			`INSERT INTO products (name, description, price, stock, category, image_url)
			 VALUES (?, ?, ?, ?, ?, ?)`,
			[product_name, description || null, price, stock_quantity, category || null, image_url || null]
		);

		return result.insertId;
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 상품 수정
 */
exports.updateProduct = async (productId, productData) => {
	const { product_name, description, price, stock_quantity, category, image_url } = productData;

	const connection = await pool.getConnection();
	try {
		// 동적으로 업데이트할 필드만 쿼리에 포함
		const updates = [];
		const values = [];

		if (product_name !== undefined) {
			updates.push("name = ?");
			values.push(product_name);
		}
		if (description !== undefined) {
			updates.push("description = ?");
			values.push(description);
		}
		if (price !== undefined) {
			updates.push("price = ?");
			values.push(price);
		}
		if (stock_quantity !== undefined) {
			updates.push("stock = ?");
			values.push(stock_quantity);
		}
		if (category !== undefined) {
			updates.push("category = ?");
			values.push(category);
		}
		if (image_url !== undefined) {
			updates.push("image_url = ?");
			values.push(image_url);
		}

		if (updates.length === 0) {
			throw new Error("수정할 필드가 없습니다.");
		}

		values.push(productId);

		const [result] = await connection.query(
			`UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
			values
		);

		return result.affectedRows > 0;
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 상품 삭제
 */
exports.deleteProduct = async (productId) => {
	const connection = await pool.getConnection();
	try {
		const [result] = await connection.query(
			"DELETE FROM products WHERE id = ?",
			[productId]
		);

		return result.affectedRows > 0;
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 모든 상품 조회 (페이지네이션)
 */
exports.getAllProducts = async ({ page, limit, search, category }) => {
	const offset = (page - 1) * limit;

	const connection = await pool.getConnection();
	try {
		// WHERE 조건 동적 생성
		const conditions = [];
		const values = [];

		if (search) {
			conditions.push("(name LIKE ? OR description LIKE ?)");
			values.push(`%${search}%`, `%${search}%`);
		}

		if (category) {
			conditions.push("category = ?");
			values.push(category);
		}

		const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		// 전체 개수 조회
		const [countResult] = await connection.query(
			`SELECT COUNT(*) as total FROM products ${whereClause}`,
			values
		);
		const total = countResult[0].total;

		// 상품 목록 조회
		const [products] = await connection.query(
			`SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
			[...values, limit, offset]
		);

		return {
			products,
			total,
		};
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 특정 상품 조회
 */
exports.getProductById = async (productId) => {
	const connection = await pool.getConnection();
	try {
		const [rows] = await connection.query(
			"SELECT * FROM products WHERE id = ?",
			[productId]
		);

		return rows.length > 0 ? rows[0] : null;
	} finally {
		connection.release();
	}
};
