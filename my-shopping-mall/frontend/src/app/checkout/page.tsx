"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cartApi, orderApi, CartItem } from "@/lib/api";
import { hasToken } from "@/lib/helpers";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
	const router = useRouter();
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [shippingAddress, setShippingAddress] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const { updateQuantity } = useCartStore();

	useEffect(() => {
		// 로그인 확인 - 결제는 반드시 로그인 필요
		if (!hasToken()) {
			const goToLogin = confirm(
				"주문하려면 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?"
			);
			if (goToLogin) {
				// 로그인 후 다시 돌아올 수 있도록 현재 경로 저장
				if (typeof window !== "undefined") {
					sessionStorage.setItem("redirectAfterLogin", "/checkout");
				}
				router.push("/login");
			} else {
				router.push("/cart");
			}
			return;
		}

		// 장바구니 데이터 로드 (서버에서)
		const fetchCart = async () => {
			try {
				const response = await cartApi.getCart();
				if (response.success && response.data) {
					if (response.data.length === 0) {
						alert("장바구니가 비어있습니다.");
						router.push("/cart");
						return;
					}
					setCartItems(response.data);
				}
			} catch (error) {
				console.error("장바구니 조회 실패:", error);
				setError("장바구니 정보를 불러올 수 없습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchCart();
	}, [router]);

	// 총 금액 계산
	const totalAmount = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	// 수량 변경 처리
	const handleQuantityChange = async (productId: number, newQuantity: number) => {
		try {
			await updateQuantity(productId, newQuantity);
			// 장바구니 다시 불러오기
			const response = await cartApi.getCart();
			if (response.success && response.data) {
				setCartItems(response.data);
			}
		} catch (error) {
			console.error("수량 변경 실패:", error);
			alert("수량 변경에 실패했습니다.");
		}
	};

	// 주문 처리
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!shippingAddress.trim()) {
			setError("배송 주소를 입력해주세요.");
			return;
		}

		setIsSubmitting(true);
		setError("");

		try {
			const response = await orderApi.create(shippingAddress);

			if (response.success) {
				alert("주문이 완료되었습니다!");
				router.push("/mypage");
			}
		} catch (error) {
			console.error("주문 실패:", error);
			setError("주문 처리 중 오류가 발생했습니다.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">주문 정보를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold text-gray-800 mb-8">주문하기</h1>

			{/* 주문 상품 목록 */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 className="text-xl font-bold text-gray-800 mb-4">주문 상품</h2>
				<div className="space-y-4">
					{cartItems.map((item) => (
						<div
							key={item.id}
							className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
						>
							<img
								src={item.image_url || "/placeholder.png"}
								alt={item.product_name}
								className="w-20 h-20 object-cover rounded"
							/>
							<div className="flex-1">
								<h3 className="font-semibold text-gray-800">
									{item.product_name}
								</h3>
								<p className="text-gray-600 mb-2">
									{item.price.toLocaleString()}원
								</p>
								{/* 수량 조절 */}
								<div className="flex items-center gap-2">
									<button
										onClick={() =>
											handleQuantityChange(item.product_id, item.quantity - 1)
										}
										className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={item.quantity <= 1}
									>
										-
									</button>
									<span className="w-12 text-center font-medium">
										{item.quantity}
									</span>
									<button
										onClick={() =>
											handleQuantityChange(item.product_id, item.quantity + 1)
										}
										className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
									>
										+
									</button>
								</div>
							</div>
							<div className="text-right">
								<p className="text-lg font-bold text-gray-800">
									{(item.price * item.quantity).toLocaleString()}원
								</p>
							</div>
						</div>
					))}
				</div>

				{/* 총 금액 */}
				<div className="mt-6 pt-6 border-t border-gray-200">
					<div className="flex justify-between items-center text-xl font-bold">
						<span>총 결제 금액</span>
						<span className="text-blue-600">
							{totalAmount.toLocaleString()}원
						</span>
					</div>
				</div>
			</div>

			{/* 배송 정보 입력 */}
			<form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-bold text-gray-800 mb-4">배송 정보</h2>

				<Input
					type="text"
					name="shippingAddress"
					label="배송 주소"
					placeholder="배송받을 주소를 입력하세요"
					value={shippingAddress}
					onChange={(e) => setShippingAddress(e.target.value)}
					required
					disabled={isSubmitting}
				/>

				{error && (
					<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{error}
					</div>
				)}

				<div className="mt-6 flex gap-4">
					<Button
						type="button"
						variant="secondary"
						onClick={() => router.push("/cart")}
						disabled={isSubmitting}
						className="flex-1"
					>
						장바구니로 돌아가기
					</Button>
					<Button
						type="submit"
						variant="primary"
						disabled={isSubmitting}
						className="flex-1"
					>
						{isSubmitting ? "주문 처리 중..." : "주문 완료"}
					</Button>
				</div>
			</form>
		</div>
	);
}
