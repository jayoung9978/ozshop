const userService = require("../services/userService.js");

// 사용자 정보 조회
exports.getUserInfo = async (req, res) => {
	try {
		const userId = req.user.userId;
		const user = await userService.getUserById(userId);

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

// 사용자 정보 업데이트
exports.updateUserInfo = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { name, phone, address } = req.body;

		if (!name) {
			return res.status(400).json({
				success: false,
				message: "이름을 입력해주세요.",
			});
		}

		await userService.updateUser(userId, { name, phone, address });

		res.status(200).json({
			success: true,
			message: "사용자 정보가 업데이트되었습니다.",
		});
	} catch (error) {
		console.error("사용자 업데이트 오류:", error);
		res.status(500).json({
			success: false,
			message: "사용자 정보 업데이트 중 오류가 발생했습니다.",
		});
	}
};
