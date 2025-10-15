"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { orderApi, Order } from "@/lib/api";
import { hasToken } from "@/lib/helpers";
import Button from "@/components/ui/Button";

const OrderHistoryClient = () => {
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		// 로그인 확인
		if (!hasToken()) {
			alert("로그인이 필요합니다.");
			router.push("/login");
			return;
		}

		fetchOrders();
	}, [router]);

	// 주문 목록 조회
	const fetchOrders = async () => {
		try {
			setIsLoading(true);
			const response = await orderApi.getUserOrders();

			if (response.success && response.data) {
				setOrders(response.data);
			}
		} catch (error) {
			console.error("주문 목록 조회 실패:", error);
			setError("주문 목록을 불러올 수 없습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	// 주문 취소
	const handleCancelOrder = async (orderId: number) => {
		if (!confirm("주문을 취소하시겠습니까?")) {
			return;
		}

		try {
			const response = await orderApi.cancel(orderId);
			if (response.success) {
				alert("주문이 취소되었습니다.");
				fetchOrders(); // 목록 새로고침
			}
		} catch (error) {
			console.error("주문 취소 실패:", error);
			alert("주문 취소 중 오류가 발생했습니다.");
		}
	};

	// 주문 상태 텍스트
	const getStatusText = (status: string) => {
		switch (status) {
			case "pending":
				return "결제 대기";
			case "processing":
				return "처리 중";
			case "shipped":
				return "배송 중";
			case "delivered":
				return "배송 완료";
			case "cancelled":
				return "취소됨";
			default:
				return status;
		}
	};

	// 주문 상태 색상
	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return "text-yellow-600 bg-yellow-100";
			case "processing":
				return "text-blue-600 bg-blue-100";
			case "shipped":
				return "text-purple-600 bg-purple-100";
			case "delivered":
				return "text-green-600 bg-green-100";
			case "cancelled":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	// 로딩 상태
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">주문 내역을 불러오는 중...</p>
				</div>
			</div>
		);
	}

	// 에러 상태
	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="text-red-500 text-5xl mb-4">⚠️</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						오류가 발생했습니다
					</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<Button onClick={fetchOrders} variant="primary">
						다시 시도
					</Button>
				</div>
			</div>
		);
	}

	// 주문 내역이 없는 경우
	if (orders.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="text-gray-400 text-6xl mb-4">📦</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						주문 내역이 없습니다
					</h2>
					<p className="text-gray-600 mb-6">
						첫 주문을 시작해보세요!
					</p>
					<Button
						onClick={() => router.push("/products")}
						variant="primary"
					>
						상품 둘러보기
					</Button>
				</div>
			</div>
		);
	}

	// 주문 목록
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-8">주문 내역</h1>

			<div className="space-y-4">
				{orders.map((order) => (
					<div
						key={order.id}
						className="bg-white rounded-lg shadow-md p-6"
					>
						{/* 주문 헤더 */}
						<div className="flex justify-between items-start mb-4">
							<div>
								<h3 className="text-lg font-bold text-gray-800 mb-1">
									주문번호: {order.id}
								</h3>
								<p className="text-sm text-gray-600">
									{new Date(order.created_at).toLocaleDateString("ko-KR", {
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							</div>
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
									order.status
								)}`}
							>
								{getStatusText(order.status)}
							</span>
						</div>

						{/* 배송 주소 */}
						<div className="mb-4 p-3 bg-gray-50 rounded">
							<p className="text-sm text-gray-600 mb-1">배송 주소</p>
							<p className="text-gray-800">{order.shipping_address}</p>
						</div>

						{/* 금액 및 버튼 */}
						<div className="flex justify-between items-center pt-4 border-t border-gray-200">
							<div>
								<span className="text-gray-600">총 결제 금액:</span>
								<span className="ml-2 text-xl font-bold text-blue-600">
									{order.total_amount.toLocaleString()}원
								</span>
							</div>
							<div className="flex gap-2">
								{order.status === "pending" && (
									<Button
										variant="secondary"
										onClick={() => handleCancelOrder(order.id)}
									>
										주문 취소
									</Button>
								)}
								<Button
									variant="primary"
									onClick={() => router.push(`/orders/${order.id}`)}
								>
									상세 보기
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default OrderHistoryClient;
