const orderService = require("../services/orderService");

// 주문 생성
exports.createOrder = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { shippingAddress } = req.body;

		// 입력 검증
		if (!shippingAddress) {
			return res.status(400).json({
				success: false,
				message: "배송 주소를 입력해주세요.",
			});
		}

		const orderId = await orderService.createOrder(userId, shippingAddress);

		res.status(201).json({
			success: true,
			message: "주문이 완료되었습니다.",
			data: { orderId },
		});
	} catch (error) {
		console.error("주문 생성 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "주문 처리 중 오류가 발생했습니다.",
		});
	}
};

// 사용자 주문 목록 조회
exports.getUserOrders = async (req, res) => {
	try {
		const userId = req.user.userId;
		const orders = await orderService.getUserOrders(userId);

		res.status(200).json({
			success: true,
			data: orders,
		});
	} catch (error) {
		console.error("주문 목록 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "주문 목록 조회 중 오류가 발생했습니다.",
		});
	}
};

// 주문 상세 조회
exports.getOrderById = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { id } = req.params;

		const order = await orderService.getOrderById(id, userId);

		res.status(200).json({
			success: true,
			data: order,
		});
	} catch (error) {
		console.error("주문 조회 오류:", error);
		res.status(404).json({
			success: false,
			message: error.message || "주문을 찾을 수 없습니다.",
		});
	}
};

// 주문 취소
exports.cancelOrder = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { id } = req.params;

		await orderService.cancelOrder(id, userId);

		res.status(200).json({
			success: true,
			message: "주문이 취소되었습니다.",
		});
	} catch (error) {
		console.error("주문 취소 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "주문 취소 중 오류가 발생했습니다.",
		});
	}
};
