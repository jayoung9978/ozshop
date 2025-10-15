"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, hasToken } from "@/lib/helpers";
import Button from "@/components/ui/Button";

const CartClient = () => {
	const router = useRouter();
	const [authChecked, setAuthChecked] = useState(false);
	const { items, total, loading, fetchCart, updateQuantity, removeItem } =
		useCartStore();

	// 장바구니 로드 (로그인 여부 무관)
	useEffect(() => {
		setAuthChecked(true);
		fetchCart();
	}, [fetchCart]);

	// 수량 증가
	const handleIncrease = async (productId: number, currentQuantity: number) => {
		try {
			await updateQuantity(productId, currentQuantity + 1);
		} catch (error) {
			console.error("수량 증가 실패:", error);
			alert("수량 변경에 실패했습니다.");
		}
	};

	// 수량 감소
	const handleDecrease = async (productId: number, currentQuantity: number) => {
		if (currentQuantity <= 1) {
			const confirmDelete = confirm("상품을 장바구니에서 삭제하시겠습니까?");
			if (confirmDelete) {
				await handleRemove(productId);
			}
			return;
		}

		try {
			await updateQuantity(productId, currentQuantity - 1);
		} catch (error) {
			console.error("수량 감소 실패:", error);
			alert("수량 변경에 실패했습니다.");
		}
	};

	// 아이템 삭제
	const handleRemove = async (productId: number) => {
		try {
			await removeItem(productId);
		} catch (error) {
			console.error("삭제 실패:", error);
			alert("상품 삭제에 실패했습니다.");
		}
	};

	// 로그인 체크 중 또는 로딩 상태
	if (!authChecked || (loading && items.length === 0)) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">장바구니를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	// 빈 장바구니
	if (items.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="text-gray-400 text-6xl mb-4">🛒</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						장바구니가 비어있습니다
					</h2>
					<p className="text-gray-600 mb-6">
						상품을 담아보세요!
					</p>
					<Link href="/products">
						<Button variant="primary">상품 둘러보기</Button>
					</Link>
				</div>
			</div>
		);
	}

	// 장바구니 아이템 목록
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-8">장바구니</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* 장바구니 아이템 목록 */}
				<div className="lg:col-span-2">
					<div className="space-y-4">
						{items.map((item) => (
							<div
								key={item.id}
								className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
							>
								{/* 상품 이미지 */}
								<div className="relative w-24 h-24 bg-gray-200 rounded flex-shrink-0">
									<Image
										src={item.image_url}
										alt={`${item.product_name} 상품 이미지`}
										fill
										className="object-cover rounded"
										sizes="96px"
										priority={false}
									/>
								</div>

								{/* 상품 정보 */}
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-800 mb-1">
										{item.product_name}
									</h3>
									<p className="text-blue-600 font-bold">
										{formatPrice(item.price)}
									</p>
								</div>

								{/* 수량 조절 */}
								<div className="flex items-center gap-2">
									<button
										onClick={() => handleDecrease(item.product_id, item.quantity)}
										className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold"
										disabled={loading}
									>
										-
									</button>
									<span className="w-12 text-center font-semibold">
										{item.quantity}
									</span>
									<button
										onClick={() => handleIncrease(item.product_id, item.quantity)}
										className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold"
										disabled={loading}
									>
										+
									</button>
								</div>

								{/* 소계 */}
								<div className="text-right w-24">
									<p className="text-lg font-bold text-gray-800">
										{formatPrice(item.price * item.quantity)}
									</p>
								</div>

								{/* 삭제 버튼 */}
								<button
									onClick={() => handleRemove(item.product_id)}
									className="text-red-500 hover:text-red-700 font-bold"
									disabled={loading}
								>
									✕
								</button>
							</div>
						))}
					</div>
				</div>

				{/* 주문 요약 */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
						<h2 className="text-xl font-bold text-gray-800 mb-4">
							주문 요약
						</h2>

						<div className="space-y-3 mb-4">
							<div className="flex justify-between text-gray-600">
								<span>상품 개수</span>
								<span>{items.length}개</span>
							</div>
							<div className="flex justify-between text-gray-600">
								<span>총 수량</span>
								<span>
									{items.reduce((sum, item) => sum + item.quantity, 0)}개
								</span>
							</div>
							<div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
								<span>총 금액</span>
								<span className="text-blue-600">{formatPrice(total)}</span>
							</div>
						</div>

						<Link href="/checkout">
							<Button variant="primary" className="w-full mb-3">
								주문하기
							</Button>
						</Link>

						<Link href="/products">
							<Button variant="secondary" className="w-full">
								쇼핑 계속하기
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartClient;
