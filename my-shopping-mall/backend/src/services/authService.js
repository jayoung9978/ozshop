const pool = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (email, password, name) => {
	const connection = await pool.getConnection();
	try {
		const [rows] = await connection.query(
			"SELECT * FROM users WHERE email = ?",
			[email]
		);
		if (rows.length > 0) {
			throw new Error("User with this email already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const [result] = await connection.query(
			"INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
			[email, hashedPassword, name]
		);

		return result.insertId;
	} finally {
		connection.release();
	}
};

exports.login = async (email, password) => {
	const connection = await pool.getConnection();
	try {
		const [rows] = await connection.query(
			"SELECT * FROM users WHERE email = ?",
			[email]
		);
		if (rows.length === 0) {
			throw new Error("Invalid email or password");
		}

		const user = rows[0];

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new Error("Invalid email or password");
		}

		const payload = {
			userId: user.id,
			email: user.email,
			name: user.name,
			role: user.role || "user",
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return token;
	} finally {
		connection.release();
	}
};
