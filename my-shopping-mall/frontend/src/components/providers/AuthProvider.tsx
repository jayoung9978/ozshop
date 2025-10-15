"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const checkAuth = useAuthStore((state) => state.checkAuth);

	useEffect(() => {
		// 앱 초기 로드 시 인증 상태 확인
		checkAuth();
	}, [checkAuth]);

	return <>{children}</>;
}
