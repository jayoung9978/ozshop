const adminUserService = require("../../services/admin/userService.js");

/**
 * 관리자 - 모든 사용자 조회
 */
exports.getAllUsers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const search = req.query.search || "";
		const role = req.query.role || "";

		const result = await adminUserService.getAllUsers({
			page,
			limit,
			search,
			role,
		});

		res.status(200).json({
			success: true,
			data: result.users,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(result.total / limit),
				totalItems: result.total,
				itemsPerPage: limit,
			},
		});
	} catch (error) {
		console.error("사용자 목록 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "사용자 목록 조회 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 특정 사용자 조회
 */
exports.getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await adminUserService.getUserById(id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "사용자를 찾을 수 없습니다.",
			});
		}

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		console.error("사용자 조회 오류:", error);
		res.status(500).json({
			success: false,
			message: "사용자 조회 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 사용자 권한 변경
 */
exports.updateUserRole = async (req, res) => {
	try {
		const { id } = req.params;
		const { role } = req.body;

		if (!role || !["user", "admin"].includes(role)) {
			return res.status(400).json({
				success: false,
				message: "유효하지 않은 권한입니다. (user 또는 admin만 가능)",
			});
		}

		const updated = await adminUserService.updateUserRole(id, role);

		if (!updated) {
			return res.status(404).json({
				success: false,
				message: "사용자를 찾을 수 없습니다.",
			});
		}

		res.status(200).json({
			success: true,
			message: "사용자 권한이 변경되었습니다.",
		});
	} catch (error) {
		console.error("사용자 권한 변경 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "사용자 권한 변경 중 오류가 발생했습니다.",
		});
	}
};

/**
 * 관리자 - 사용자 삭제
 */
exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		// 자기 자신은 삭제할 수 없음
		if (parseInt(id) === req.userId) {
			return res.status(400).json({
				success: false,
				message: "자기 자신은 삭제할 수 없습니다.",
			});
		}

		const deleted = await adminUserService.deleteUser(id);

		if (!deleted) {
			return res.status(404).json({
				success: false,
				message: "사용자를 찾을 수 없습니다.",
			});
		}

		res.status(200).json({
			success: true,
			message: "사용자가 삭제되었습니다.",
		});
	} catch (error) {
		console.error("사용자 삭제 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "사용자 삭제 중 오류가 발생했습니다.",
		});
	}
};
