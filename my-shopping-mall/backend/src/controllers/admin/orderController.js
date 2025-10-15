const adminOrderService = require("../../services/admin/orderService.js");

/**
 * 관리자 - 모든 주문 조회
 */
exports.getAllOrders = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const status = req.query.status || "";
		const userId = req.query.userId || "";

		const result = await adminOrderService.getAllOrders({
			page,
			limit,
			status,
			userId,
		});

		res.status(200).json({
			success: true,
			data: result.orders,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(result.total / limit),
				totalItems: result.total,
				itemsPerPage: limit,
			},
		});
	} catch (error) {
		console.error("주문 목록 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "주문 목록 조회 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 특정 주문 상세 조회
 */
exports.getOrderById = async (req, res) => {
	try {
		const { id } = req.params;
		const order = await adminOrderService.getOrderById(id);

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "주문을 찾을 수 없습니다.",
			});
		}

		res.status(200).json({
			success: true,
			data: order,
		});
	} catch (error) {
		console.error("주문 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "주문 조회 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 주문 상태 변경
 */
exports.updateOrderStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
		if (!status || !validStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				message: `유효하지 않은 상태입니다. (${validStatuses.join(", ")} 중 선택)`,
			});
		}

		const updated = await adminOrderService.updateOrderStatus(id, status);

		if (!updated) {
			return res.status(404).json({
				success: false,
				message: "주문을 찾을 수 없습니다.",
			});
		}

		res.status(200).json({
			success: true,
			message: "주문 상태가 변경되었습니다.",
		});
	} catch (error) {
		console.error("주문 상태 변경 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "주문 상태 변경 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 주문 삭제
 */
exports.deleteOrder = async (req, res) => {
	try {
		const { id } = req.params;

		const deleted = await adminOrderService.deleteOrder(id);

		if (!deleted) {
			return res.status(404).json({
				success: false,
				message: "주문을 찾을 수 없습니다.",
			});
		}

		res.status(200).json({
			success: true,
			message: "주문이 삭제되었습니다.",
		});
	} catch (error) {
		console.error("주문 삭제 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "주문 삭제 중 오류가 발생했습니다.",
		});
	}
};
