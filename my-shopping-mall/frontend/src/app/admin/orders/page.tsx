"use client";

import { useState, useEffect } from "react";
import { adminApi, AdminOrder, Pagination } from "@/lib/api";
import Button from "@/components/ui/Button";

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<AdminOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [pagination, setPagination] = useState<Pagination | null>(null);
	const [statusFilter, setStatusFilter] = useState("");

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const response = await adminApi.orders.getAll({
				page,
				limit: 10,
				status: statusFilter || undefined,
			});
			if (response.success) {
				setOrders(response.data);
				setPagination(response.pagination);
			}
		} catch (error) {
			console.error("주문 목록 조회 실패:", error);
			alert("주문 목록을 불러오는데 실패했습니다.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, [page, statusFilter]);

	const handleStatusChange = async (orderId: number, newStatus: string) => {
		if (!confirm(`주문 상태를 "${newStatus}"로 변경하시겠습니까?`)) {
			return;
		}

		try {
			const response = await adminApi.orders.updateStatus(orderId, newStatus);
			if (response.success) {
				alert("주문 상태가 변경되었습니다.");
				fetchOrders();
			}
		} catch (error) {
			console.error("주문 상태 변경 실패:", error);
			alert("주문 상태 변경에 실패했습니다.");
		}
	};

	const getStatusBadge = (status: string) => {
		const statusMap: Record<string, { label: string; color: string }> = {
			pending: { label: "대기중", color: "bg-yellow-100 text-yellow-800" },
			processing: { label: "처리중", color: "bg-blue-100 text-blue-800" },
			shipped: { label: "배송중", color: "bg-purple-100 text-purple-800" },
			delivered: { label: "배송완료", color: "bg-green-100 text-green-800" },
			cancelled: { label: "취소됨", color: "bg-red-100 text-red-800" },
		};

		const statusInfo = statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };

		return (
			<span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
				{statusInfo.label}
			</span>
		);
	};

	if (loading) {
		return <div className="text-center py-8">로딩 중...</div>;
	}

	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-800 mb-6">주문 관리</h1>

			{/* 필터 */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-6">
				<div className="flex gap-4 items-center">
					<label className="text-sm font-medium text-gray-700">상태 필터:</label>
					<select
						value={statusFilter}
						onChange={(e) => {
							setStatusFilter(e.target.value);
							setPage(1);
						}}
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">전체</option>
						<option value="pending">대기중</option>
						<option value="processing">처리중</option>
						<option value="shipped">배송중</option>
						<option value="delivered">배송완료</option>
						<option value="cancelled">취소됨</option>
					</select>
				</div>
			</div>

			{/* 주문 테이블 */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								주문번호
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								사용자
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								총금액
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								상태
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								주문일
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								작업
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{orders.map((order) => (
							<tr key={order.id}>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									#{order.id}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{order.user_name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{order.total_amount.toLocaleString()}원
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm">
									{getStatusBadge(order.status)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{new Date(order.created_at).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<select
										value={order.status}
										onChange={(e) => handleStatusChange(order.id, e.target.value)}
										className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="pending">대기중</option>
										<option value="processing">처리중</option>
										<option value="shipped">배송중</option>
										<option value="delivered">배송완료</option>
										<option value="cancelled">취소됨</option>
									</select>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* 페이지네이션 */}
			{pagination && (
				<div className="flex justify-center items-center mt-6 space-x-2">
					<Button
						onClick={() => setPage(page - 1)}
						disabled={page === 1}
						variant="secondary"
					>
						이전
					</Button>
					<span className="px-4 py-2">
						{page} / {pagination.totalPages}
					</span>
					<Button
						onClick={() => setPage(page + 1)}
						disabled={page >= pagination.totalPages}
						variant="secondary"
					>
						다음
					</Button>
				</div>
			)}
		</div>
	);
}
