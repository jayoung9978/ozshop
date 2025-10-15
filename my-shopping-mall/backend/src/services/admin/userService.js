const pool = require("../../config/db.js");

/**
 * 관리자 - 모든 사용자 조회
 */
exports.getAllUsers = async ({ page, limit, search, role }) => {
	const offset = (page - 1) * limit;

	const connection = await pool.getConnection();
	try {
		const conditions = [];
		const values = [];

		if (search) {
			conditions.push("(name LIKE ? OR email LIKE ?)");
			values.push(`%${search}%`, `%${search}%`);
		}

		if (role) {
			conditions.push("role = ?");
			values.push(role);
		}

		const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		// 전체 개수 조회
		const [countResult] = await connection.query(
			`SELECT COUNT(*) as total FROM users ${whereClause}`,
			values
		);
		const total = countResult[0].total;

		// 사용자 목록 조회 (비밀번호 제외)
		const [users] = await connection.query(
			`SELECT id, email, name, role, created_at FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
			[...values, limit, offset]
		);

		return {
			users,
			total,
		};
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 특정 사용자 조회
 */
exports.getUserById = async (userId) => {
	const connection = await pool.getConnection();
	try {
		const [rows] = await connection.query(
			"SELECT id, email, name, role, created_at FROM users WHERE id = ?",
			[userId]
		);

		return rows.length > 0 ? rows[0] : null;
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 사용자 권한 변경
 */
exports.updateUserRole = async (userId, role) => {
	const connection = await pool.getConnection();
	try {
		const [result] = await connection.query(
			"UPDATE users SET role = ? WHERE id = ?",
			[role, userId]
		);

		return result.affectedRows > 0;
	} finally {
		connection.release();
	}
};

/**
 * 관리자 - 사용자 삭제
 */
exports.deleteUser = async (userId) => {
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		// 관련 데이터 삭제 (외래키 제약)
		await connection.query("DELETE FROM cart WHERE user_id = ?", [userId]);
		await connection.query("DELETE FROM orders WHERE user_id = ?", [userId]);

		// 사용자 삭제
		const [result] = await connection.query("DELETE FROM users WHERE id = ?", [userId]);

		await connection.commit();

		return result.affectedRows > 0;
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
};
