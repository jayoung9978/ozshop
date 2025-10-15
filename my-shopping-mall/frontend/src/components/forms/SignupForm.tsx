"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authApi } from "@/lib/api";
import { setToken } from "@/lib/helpers";
import { getValidationError } from "@/lib/helpers";

const SignupForm = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		passwordConfirm: "",
		name: "",
	});
	const [errors, setErrors] = useState({
		email: "",
		password: "",
		passwordConfirm: "",
		name: "",
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
			passwordConfirm: "",
			name: "",
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

		// 비밀번호 확인 검증
		if (!formData.passwordConfirm) {
			newErrors.passwordConfirm = "비밀번호 확인을 입력하세요";
		} else if (formData.password !== formData.passwordConfirm) {
			newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
		}

		// 이름 검증
		const nameError = getValidationError("name", formData.name);
		if (nameError) {
			newErrors.name = nameError;
		}

		setErrors(newErrors);
		return (
			!newErrors.email &&
			!newErrors.password &&
			!newErrors.passwordConfirm &&
			!newErrors.name
		);
	};

	// 회원가입 처리
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// 폼 검증
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setErrors({ email: "", password: "", passwordConfirm: "", name: "", general: "" });

		try {
			// API 호출
			const response = await authApi.signup({
				email: formData.email,
				password: formData.password,
				name: formData.name,
			});

			// 응답 타입 체크
			if (response && typeof response === "object" && "data" in response) {
				const data = response.data as { token: string };

				// 토큰 저장
				setToken(data.token);

				// 메인 페이지로 이동
				router.push("/");
			} else {
				throw new Error("Invalid response format");
			}
		} catch (err) {
			// 에러 처리
			const error = err as Error;
			setErrors((prev) => ({
				...prev,
				general: error.message || "회원가입에 실패했습니다.",
			}));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>

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
					placeholder="8자 이상 입력하세요"
					value={formData.password}
					onChange={handleChange}
					error={errors.password}
					required
					disabled={isLoading}
				/>

				{/* 비밀번호 확인 입력 */}
				<Input
					type="password"
					name="passwordConfirm"
					label="비밀번호 확인"
					placeholder="비밀번호를 다시 입력하세요"
					value={formData.passwordConfirm}
					onChange={handleChange}
					error={errors.passwordConfirm}
					required
					disabled={isLoading}
				/>

				{/* 이름 입력 */}
				<Input
					type="text"
					name="name"
					label="이름"
					placeholder="이름을 입력하세요"
					value={formData.name}
					onChange={handleChange}
					error={errors.name}
					required
					disabled={isLoading}
				/>

				{/* 전체 에러 메시지 */}
				{errors.general && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{errors.general}
					</div>
				)}

				{/* 회원가입 버튼 */}
				<Button
					type="submit"
					variant="primary"
					disabled={isLoading}
					className="w-full"
				>
					{isLoading ? "회원가입 중..." : "회원가입"}
				</Button>
			</form>

			{/* 로그인 링크 */}
			<p className="text-center mt-4 text-gray-600">
				이미 계정이 있으신가요?{" "}
				<a href="/login" className="text-blue-600 hover:underline">
					로그인
				</a>
			</p>
		</div>
	);
};

export default SignupForm;
