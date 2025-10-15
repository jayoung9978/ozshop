const authService = require("../services/authService.js");

// 회원가입 처리
exports.signup = async (req, res) => {
	try {
		const { email, password, name } = req.body;

		// 요청 데이터 검증
		if (!email || !password || !name) {
			return res.status(400).json({
				success: false,
				message: "이메일, 비밀번호, 이름을 모두 입력해주세요.",
			});
		}

		// authService.signup 호출
		const userId = await authService.signup(email, password, name);

		// 응답 반환
		res.status(201).json({
			success: true,
			message: "회원가입이 완료되었습니다.",
			data: { userId },
		});
	} catch (error) {
		console.error("회원가입 오류:", error);
		res.status(500).json({
			success: false,
			message: error.message || "회원가입 중 오류가 발생했습니다.",
		});
	}
};

// 로그인 처리
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// 요청 데이터 검증
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "이메일과 비밀번호를 입력해주세요.",
			});
		}

		// authService.login 호출
		const token = await authService.login(email, password);

		// 토큰 응답
		res.status(200).json({
			success: true,
			message: "로그인이 완료되었습니다.",
			data: { token },
		});
	} catch (error) {
		console.error("로그인 오류:", error);
		res.status(401).json({
			success: false,
			message: error.message || "로그인 중 오류가 발생했습니다.",
		});
	}
};
