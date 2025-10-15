"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { user, token, loading, checkAuth } = useAuthStore();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			await checkAuth();
			setIsChecking(false);
		};

		initAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (isChecking || loading) return;

		// 로그인 확인
		if (!token || !user) {
			router.push("/login");
			return;
		}

		// 관리자 권한 확인 (role이 'admin'인지 확인)
		if (user.role !== "admin") {
			alert("관리자 권한이 필요합니다.");
			router.push("/");
		}
	}, [token, user, router, isChecking, loading]);

	if (isChecking || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">로딩 중...</div>
			</div>
		);
	}

	if (!token || !user || user.role !== "admin") {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* 관리자 네비게이션 바 */}
			<nav className="bg-gray-800 text-white">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-8">
							<Link href="/admin" className="text-xl font-bold">
								관리자 페이지
							</Link>
							<Link
								href="/admin/products"
								className="hover:bg-gray-700 px-3 py-2 rounded"
							>
								상품 관리
							</Link>
							<Link
								href="/admin/users"
								className="hover:bg-gray-700 px-3 py-2 rounded"
							>
								사용자 관리
							</Link>
							<Link
								href="/admin/orders"
								className="hover:bg-gray-700 px-3 py-2 rounded"
							>
								주문 관리
							</Link>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-sm">
								관리자: {user.name} ({user.email})
							</span>
							<Link
								href="/"
								className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
							>
								쇼핑몰로 이동
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* 메인 컨텐츠 */}
			<main className="container mx-auto px-4 py-8">{children}</main>
		</div>
	);
}
