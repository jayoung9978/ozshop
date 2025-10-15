"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi, User } from "@/lib/api";
import { hasToken } from "@/lib/helpers";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getValidationError } from "@/lib/helpers";

const MyPageClient = () => {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		password: "",
		passwordConfirm: "",
	});

	const [errors, setErrors] = useState({
		name: "",
		password: "",
		passwordConfirm: "",
		general: "",
	});

	// 로그인 체크 및 프로필 로드
	useEffect(() => {
		if (!hasToken()) {
			alert("로그인이 필요합니다.");
			router.push("/login");
			return;
		}
		fetchProfile();
	}, [router]);

	// 프로필 조회
	const fetchProfile = async () => {
		try {
			setIsLoading(true);
			const response = await authApi.getProfile();

			if (response && response.success && response.data) {
				setUser(response.data);
				setFormData({
					name: response.data.name,
					password: "",
					passwordConfirm: "",
				});
			}
		} catch (error) {
			console.error("프로필 조회 실패:", error);
			alert("프로필을 불러오는데 실패했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	// 입력값 변경 핸들러
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErrors((prev) => ({
			...prev,
			[name]: "",
			general: "",
		}));
	};

	// 폼 검증
	const validateForm = (): boolean => {
		const newErrors = {
			name: "",
			password: "",
			passwordConfirm: "",
			general: "",
		};

		// 이름 검증
		const nameError = getValidationError("name", formData.name);
		if (nameError) {
			newErrors.name = nameError;
		}

		// 비밀번호 검증 (입력했을 경우에만)
		if (formData.password) {
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
		}

		setErrors(newErrors);
		return !newErrors.name && !newErrors.password && !newErrors.passwordConfirm;
	};

	// 수정 모드 토글
	const handleEditToggle = () => {
		if (isEditing) {
			// 취소 - 원래 데이터로 복원
			if (user) {
				setFormData({
					name: user.name,
					password: "",
					passwordConfirm: "",
				});
			}
			setErrors({ name: "", password: "", passwordConfirm: "", general: "" });
		}
		setIsEditing(!isEditing);
	};

	// 저장 핸들러
	const handleSave = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			setIsSaving(true);
			setErrors({ name: "", password: "", passwordConfirm: "", general: "" });

			// 변경된 데이터만 전송
			const updateData: { name?: string; password?: string } = {};

			if (formData.name !== user?.name) {
				updateData.name = formData.name;
			}

			if (formData.password) {
				updateData.password = formData.password;
			}

			// 변경사항이 없으면 알림
			if (Object.keys(updateData).length === 0) {
				alert("변경된 정보가 없습니다.");
				setIsEditing(false);
				return;
			}

			await authApi.updateProfile(updateData);

			alert("프로필이 수정되었습니다.");
			setIsEditing(false);
			setFormData((prev) => ({
				...prev,
				password: "",
				passwordConfirm: "",
			}));

			// 프로필 다시 조회
			await fetchProfile();
		} catch (error) {
			console.error("프로필 수정 실패:", error);
			setErrors((prev) => ({
				...prev,
				general: "프로필 수정에 실패했습니다.",
			}));
		} finally {
			setIsSaving(false);
		}
	};

	// 로딩 상태
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">프로필을 불러오는 중...</p>
				</div>
			</div>
		);
	}

	// 사용자 정보 없음
	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="text-red-500 text-5xl mb-4">⚠️</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						프로필을 불러올 수 없습니다
					</h2>
					<Button onClick={() => router.push("/")} variant="primary">
						홈으로 이동
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-8">마이페이지</h1>

				<div className="bg-white rounded-lg shadow-md p-6">
					{/* 이메일 (수정 불가) */}
					<div className="mb-6">
						<label className="block text-gray-700 text-sm font-medium mb-2">
							이메일
						</label>
						<div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
							{user.email}
						</div>
						<p className="text-sm text-gray-500 mt-1">
							이메일은 변경할 수 없습니다.
						</p>
					</div>

					{/* 이름 */}
					<Input
						type="text"
						name="name"
						label="이름"
						value={formData.name}
						onChange={handleChange}
						error={errors.name}
						disabled={!isEditing || isSaving}
						required
					/>

					{/* 비밀번호 (수정 모드일 때만) */}
					{isEditing && (
						<>
							<Input
								type="password"
								name="password"
								label="새 비밀번호"
								placeholder="변경하지 않으려면 비워두세요"
								value={formData.password}
								onChange={handleChange}
								error={errors.password}
								disabled={isSaving}
							/>

							{formData.password && (
								<Input
									type="password"
									name="passwordConfirm"
									label="비밀번호 확인"
									placeholder="비밀번호를 다시 입력하세요"
									value={formData.passwordConfirm}
									onChange={handleChange}
									error={errors.passwordConfirm}
									disabled={isSaving}
								/>
							)}
						</>
					)}

					{/* 가입일 */}
					<div className="mb-6">
						<label className="block text-gray-700 text-sm font-medium mb-2">
							가입일
						</label>
						<div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
							{new Date(user.created_at).toLocaleDateString("ko-KR")}
						</div>
					</div>

					{/* 전체 에러 메시지 */}
					{errors.general && (
						<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							{errors.general}
						</div>
					)}

					{/* 버튼 영역 */}
					<div className="flex gap-3">
						{!isEditing ? (
							<Button
								onClick={handleEditToggle}
								variant="primary"
								className="flex-1"
							>
								정보 수정
							</Button>
						) : (
							<>
								<Button
									onClick={handleSave}
									variant="primary"
									disabled={isSaving}
									className="flex-1"
								>
									{isSaving ? "저장 중..." : "저장"}
								</Button>
								<Button
									onClick={handleEditToggle}
									variant="secondary"
									disabled={isSaving}
									className="flex-1"
								>
									취소
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyPageClient;
