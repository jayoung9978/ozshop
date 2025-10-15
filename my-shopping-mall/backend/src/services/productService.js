const pool = require("../config/db");

exports.getAllProducts = async (filters = {}) => {
	let query = "SELECT * FROM products WHERE 1=1";
	const params = [];

	// 검색어 필터
	if (filters.search) {
		query += " AND (name LIKE ? OR description LIKE ?)";
		const searchTerm = `%${filters.search}%`;
		params.push(searchTerm, searchTerm);
	}

	// 카테고리 필터
	if (filters.category) {
		query += " AND category = ?";
		params.push(filters.category);
	}

	// 가격 범위 필터
	if (filters.minPrice) {
		query += " AND price >= ?";
		params.push(filters.minPrice);
	}
	if (filters.maxPrice) {
		query += " AND price <= ?";
		params.push(filters.maxPrice);
	}

	// 정렬
	if (filters.sortBy) {
		switch (filters.sortBy) {
			case "price_asc":
				query += " ORDER BY price ASC";
				break;
			case "price_desc":
				query += " ORDER BY price DESC";
				break;
			case "newest":
				query += " ORDER BY id DESC";
				break;
			default:
				query += " ORDER BY id DESC";
		}
	} else {
		query += " ORDER BY id DESC";
	}

	const [rows] = await pool.query(query, params);
	return rows;
};

exports.getProductById = async (id) => {
	const [row] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
	return row[0];
};

// 가격 범위 조회
exports.getPriceRange = async () => {
	const [rows] = await pool.query(
		"SELECT MIN(price) as minPrice, MAX(price) as maxPrice FROM products"
	);
	return rows[0];
};
