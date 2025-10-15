"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		productCount: 0,
		userCount: 0,
		orderCount: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await adminApi.dashboard.getStats();
				if (response.success && response.data) {
					setStats(response.data);
				}
			} catch (error) {
				console.error("통계 조회 실패:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-800 mb-6">관리자 대시보드</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* 통계 카드 */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold text-gray-700 mb-2">총 상품</h2>
					<p className="text-3xl font-bold text-blue-600">
						{loading ? "..." : stats.productCount}
					</p>
					<p className="text-sm text-gray-500 mt-2">전체 등록된 상품 수</p>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold text-gray-700 mb-2">총 사용자</h2>
					<p className="text-3xl font-bold text-green-600">
						{loading ? "..." : stats.userCount}
					</p>
					<p className="text-sm text-gray-500 mt-2">가입된 사용자 수</p>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold text-gray-700 mb-2">총 주문</h2>
					<p className="text-3xl font-bold text-purple-600">
						{loading ? "..." : stats.orderCount}
					</p>
					<p className="text-sm text-gray-500 mt-2">전체 주문 수</p>
				</div>
			</div>

			<div className="mt-8 bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-bold text-gray-800 mb-4">빠른 링크</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<a
						href="/admin/products"
						className="block p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
					>
						<h3 className="font-semibold text-gray-800">상품 관리</h3>
						<p className="text-sm text-gray-600 mt-1">
							상품 등록, 수정, 삭제
						</p>
					</a>
					<a
						href="/admin/users"
						className="block p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition"
					>
						<h3 className="font-semibold text-gray-800">사용자 관리</h3>
						<p className="text-sm text-gray-600 mt-1">
							사용자 조회 및 권한 관리
						</p>
					</a>
					<a
						href="/admin/orders"
						className="block p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition"
					>
						<h3 className="font-semibold text-gray-800">주문 관리</h3>
						<p className="text-sm text-gray-600 mt-1">
							주문 조회 및 상태 관리
						</p>
					</a>
				</div>
			</div>
		</div>
	);
}
