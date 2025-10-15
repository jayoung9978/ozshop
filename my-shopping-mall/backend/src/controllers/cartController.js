const cartService = require("../services/cartService.js");

// 장바구니에 상품 추가
exports.addToCart = async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const userId = req.user.userId; // 인증 미들웨어에서 설정

		if (!productId || !quantity) {
			return res.status(400).json({
				success: false,
				message: "상품 ID와 수량을 입력해주세요.",
			});
		}

		await cartService.addToCart(userId, productId, quantity);

		res.status(201).json({
			success: true,
			message: "장바구니에 추가되었습니다.",
		});
	} catch (error) {
		console.error("장바구니 추가 오류:", error);
		res.status(500).json({
			success: false,
			message: "장바구니 추가 중 오류가 발생했습니다.",
		});
	}
};

// 장바구니 조회
exports.getCart = async (req, res) => {
	try {
		const userId = req.user.userId;
		const cart = await cartService.getCart(userId);

		res.status(200).json({
			success: true,
			data: cart,
		});
	} catch (error) {
		console.error("장바구니 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "장바구니 조회 중 오류가 발생했습니다.",
		});
	}
};

// 장바구니 상품 수량 업데이트
exports.updateCartItem = async (req, res) => {
	try {
		const { productId } = req.params;
		const { quantity } = req.body;
		const userId = req.user.userId;

		if (!quantity) {
			return res.status(400).json({
				success: false,
				message: "수량을 입력해주세요.",
			});
		}

		await cartService.updateCartItem(userId, productId, quantity);

		res.status(200).json({
			success: true,
			message: "수량이 업데이트되었습니다.",
		});
	} catch (error) {
		console.error("장바구니 업데이트 오류:", error);
		res.status(500).json({
			success: false,
			message: "장바구니 업데이트 중 오류가 발생했습니다.",
		});
	}
};

// 장바구니에서 상품 삭제
exports.removeFromCart = async (req, res) => {
	try {
		const { productId } = req.params;
		const userId = req.user.userId;

		await cartService.removeFromCart(userId, productId);

		res.status(200).json({
			success: true,
			message: "장바구니에서 삭제되었습니다.",
		});
	} catch (error) {
		console.error("장바구니 삭제 오류:", error);
		res.status(500).json({
			success: false,
			message: "장바구니 삭제 중 오류가 발생했습니다.",
		});
	}
};
