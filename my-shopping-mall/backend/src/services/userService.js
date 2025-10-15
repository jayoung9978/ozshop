const pool = require("../config/db.js");

// 사용자 정보 조회
exports.getUserById = async (userId) => {
	const [rows] = await pool.query(
		"SELECT id, email, name, phone, address, role, created_at FROM users WHERE id = ?",
		[userId]
	);
	return rows[0];
};

// 사용자 정보 업데이트
exports.updateUser = async (userId, updateData) => {
	const { name, phone, address } = updateData;
	await pool.query(
		"UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?",
		[name, phone, address, userId]
	);
};
