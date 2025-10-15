const productService = require("../services/productService.js");

// 모든 상품 조회 (검색/필터링 포함)
exports.getAllProducts = async (req, res) => {
	try {
		const filters = {
			search: req.query.search,
			category: req.query.category,
			minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
			maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
			sortBy: req.query.sortBy,
		};

		const products = await productService.getAllProducts(filters);
		res.status(200).json({
			success: true,
			data: products,
			count: products.length,
		});
	} catch (error) {
		console.error("상품 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "상품 조회 중 오류가 발생했습니다.",
		});
	}
};

// 특정 상품 조회
exports.getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await productService.getProductById(id);

		if (!product) {
			return res.status(404).json({
				success: false,
				message: "상품을 찾을 수 없습니다.",
			});
		}

		res.status(200).json({
			success: true,
			data: product,
		});
	} catch (error) {
		console.error("상품 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "상품 조회 중 오류가 발생했습니다.",
		});
	}
};

// 가격 범위 조회
exports.getPriceRange = async (req, res) => {
	try {
		const priceRange = await productService.getPriceRange();
		res.status(200).json({
			success: true,
			data: priceRange,
		});
	} catch (error) {
		console.error("가격 범위 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "가격 범위 조회 중 오류가 발생했습니다.",
		});
	}
};
