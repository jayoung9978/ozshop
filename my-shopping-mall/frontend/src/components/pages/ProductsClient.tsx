"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, productApi } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import ProductFilters, {
	FilterValues,
} from "@/components/products/ProductFilters";
import { useCartStore } from "@/store/cartStore";
import { hasToken } from "@/lib/helpers";
import { useRouter } from "next/navigation";

const ProductsClient = () => {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [filters, setFilters] = useState<FilterValues>({
		search: "",
		category: "",
		minPrice: "",
		maxPrice: "",
		sortBy: "newest",
	});
	const { addItem } = useCartStore();

	// 상품 데이터 로드
	const fetchProducts = useCallback(async (currentFilters: FilterValues) => {
		try {
			setIsLoading(true);
			setError("");

			const response = await productApi.getAllProducts(currentFilters);

			if (response && response.success && response.data) {
				setProducts(response.data);
			} else {
				throw new Error("상품 데이터를 불러올 수 없습니다");
			}
		} catch (err) {
			const error = err as Error;
			setError(error.message || "상품을 불러오는 중 오류가 발생했습니다");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProducts(filters);
	}, [fetchProducts, filters]);

	// 필터 변경 핸들러
	const handleFilterChange = (newFilters: FilterValues) => {
		setFilters(newFilters);
	};

	// 장바구니 담기 핸들러
	const handleAddToCart = async (productId: number) => {
		try {
			// 상품 정보 찾기
			const product = products.find((p) => p.id === productId);

			// 비로그인/로그인 상태 모두 장바구니에 추가
			await addItem(productId, 1, product);

			const confirmGoToCart = confirm(
				"장바구니에 상품이 담겼습니다. 장바구니로 이동하시겠습니까?"
			);
			if (confirmGoToCart) {
				router.push("/cart");
			}
		} catch (error) {
			console.error("장바구니 담기 실패:", error);
			alert("장바구니에 담는 중 오류가 발생했습니다.");
		}
	};

	// 로딩 상태
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">상품을 불러오는 중...</p>
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
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
					>
						다시 시도
					</button>
				</div>
			</div>
		);
	}

	// 상품이 없는 경우
	if (products.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="text-gray-400 text-5xl mb-4">📦</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						상품이 없습니다
					</h2>
					<p className="text-gray-600">등록된 상품이 없습니다.</p>
				</div>
			</div>
		);
	}

	// 상품 목록 그리드
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-8">전체 상품</h1>

			{/* 검색 및 필터 */}
			<ProductFilters onFilterChange={handleFilterChange} />

			{/* 상품 개수 표시 */}
			<div className="mb-4 text-gray-600">
				총 <span className="font-semibold">{products.length}개</span>의 상품
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						onAddToCart={handleAddToCart}
					/>
				))}
			</div>
		</div>
	);
};

export default ProductsClient;
