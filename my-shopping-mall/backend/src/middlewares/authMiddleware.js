const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
	try {
		// Authorization 헤더에서 토큰 추출
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "인증 토큰이 필요합니다.",
			});
		}

		// 토큰 검증
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return res.status(403).json({
					success: false,
					message: "유효하지 않은 토큰입니다.",
				});
			}

			// 사용자 정보를 req.user와 req.userId에 저장
			req.user = user;
			req.userId = user.userId;

			// next() 호출
			next();
		});
	} catch (error) {
		console.error("토큰 인증 오류:", error);
		res.status(500).json({
			success: false,
			message: "인증 중 오류가 발생했습니다.",
		});
	}
};

module.exports = { authenticateToken };
