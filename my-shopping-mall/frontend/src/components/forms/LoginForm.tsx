"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { getValidationError } from "@/lib/helpers";

const LoginForm = () => {
	const router = useRouter();
	const { login } = useAuthStore();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({
		email: "",
		password: "",
		general: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	// 입력값 변경 핸들러
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// 입력 시 에러 메시지 초기화
		setErrors((prev) => ({
			...prev,
			[name]: "",
			general: "",
		}));
	};

	// 폼 검증
	const validateForm = (): boolean => {
		const newErrors = {
			email: "",
			password: "",
			general: "",
		};

		// 이메일 검증
		const emailError = getValidationError("email", formData.email);
		if (emailError) {
			newErrors.email = emailError;
		}

		// 비밀번호 검증
		const passwordError = getValidationError("password", formData.password);
		if (passwordError) {
			newErrors.password = passwordError;
		}

		setErrors(newErrors);
		return !newErrors.email && !newErrors.password;
	};

	// 로그인 처리
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// 폼 검증
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setErrors({ email: "", password: "", general: "" });

		try {
			// authStore의 login 메서드 호출 (토큰 저장 + 상태 업데이트)
			await login(formData.email, formData.password);

			// 저장된 리다이렉트 경로 확인
			const redirectPath =
				typeof window !== "undefined"
					? sessionStorage.getItem("redirectAfterLogin")
					: null;

			if (redirectPath) {
				sessionStorage.removeItem("redirectAfterLogin");
				router.push(redirectPath);
			} else {
				// 기본적으로 메인 페이지로 이동
				router.push("/");
			}
		} catch (err) {
			// 에러 처리
			const error = err as Error;
			setErrors((prev) => ({
				...prev,
				general: error.message || "로그인에 실패했습니다.",
			}));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

			<form onSubmit={handleSubmit}>
				{/* 이메일 입력 */}
				<Input
					type="email"
					name="email"
					label="이메일"
					placeholder="email@example.com"
					value={formData.email}
					onChange={handleChange}
					error={errors.email}
					required
					disabled={isLoading}
				/>

				{/* 비밀번호 입력 */}
				<Input
					type="password"
					name="password"
					label="비밀번호"
					placeholder="비밀번호를 입력하세요"
					value={formData.password}
					onChange={handleChange}
					error={errors.password}
					required
					disabled={isLoading}
				/>

				{/* 전체 에러 메시지 */}
				{errors.general && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{errors.general}
					</div>
				)}

				{/* 로그인 버튼 */}
				<Button
					type="submit"
					variant="primary"
					disabled={isLoading}
					className="w-full"
				>
					{isLoading ? "로그인 중..." : "로그인"}
				</Button>
			</form>

			{/* 회원가입 링크 */}
			<p className="text-center mt-4 text-gray-600">
				계정이 없으신가요?{" "}
				<a href="/signup" className="text-blue-600 hover:underline">
					회원가입
				</a>
			</p>
		</div>
	);
};

export default LoginForm;
