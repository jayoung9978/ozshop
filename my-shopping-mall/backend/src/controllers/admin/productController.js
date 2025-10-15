const adminProductService = require("../../services/admin/productService.js");

/**
 * 관리자 - 상품 생성
 */
exports.createProduct = async (req, res) => {
	try {
		const { product_name, description, price, stock_quantity, category, image_url } = req.body;

		// 입력 검증
		if (!product_name || !price || stock_quantity === undefined) {
			return res.status(400).json({
				success: false,
				message: "상품명, 가격, 재고는 필수 항목입니다.",
			});
		}

		const productId = await adminProductService.createProduct({
			product_name,
			description,
			price,
			stock_quantity,
			category,
			image_url,
		});

		res.status(201).json({
			success: true,
			message: "상품이 생성되었습니다.",
			data: { productId },
		});
	} catch (error) {
		console.error("상품 생성 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "상품 생성 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 상품 수정
 */
exports.updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { product_name, description, price, stock_quantity, category, image_url } = req.body;

		const updated = await adminProductService.updateProduct(id, {
			product_name,
			description,
			price,
			stock_quantity,
			category,
			image_url,
		});

		if (!updated) {
			return res.status(404).json({
				success: false,
				message: "상품을 찾을 수 없습니다.",
			});
		}

		res.status(200).json({
			success: true,
			message: "상품이 수정되었습니다.",
		});
	} catch (error) {
		console.error("상품 수정 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "상품 수정 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 상품 삭제
 */
exports.deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;

		const deleted = await adminProductService.deleteProduct(id);

		if (!deleted) {
			return res.status(404).json({
				success: false,
				message: "상품을 찾을 수 없습니다.",
			});
		}

		res.status(200).json({
			success: true,
			message: "상품이 삭제되었습니다.",
		});
	} catch (error) {
		console.error("상품 삭제 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "상품 삭제 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 모든 상품 조회 (페이지네이션 및 통계 포함)
 */
exports.getAllProducts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const search = req.query.search || "";
		const category = req.query.category || "";

		const result = await adminProductService.getAllProducts({
			page,
			limit,
			search,
			category,
		});

		res.status(200).json({
			success: true,
			data: result.products,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(result.total / limit),
				totalItems: result.total,
				itemsPerPage: limit,
			},
		});
	} catch (error) {
		console.error("상품 목록 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "상품 목록 조회 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 특정 상품 상세 조회
 */
exports.getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await adminProductService.getProductById(id);

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
