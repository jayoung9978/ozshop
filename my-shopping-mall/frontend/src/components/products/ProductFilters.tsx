"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { productApi } from "@/lib/api";

interface ProductFiltersProps {
	onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
	search: string;
	category: string;
	minPrice: string;
	maxPrice: string;
	sortBy: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
	const [filters, setFilters] = useState<FilterValues>({
		search: "",
		category: "",
		minPrice: "",
		maxPrice: "",
		sortBy: "newest",
	});

	const [priceRange, setPriceRange] = useState<{
		minPrice: number;
		maxPrice: number;
	}>({
		minPrice: 0,
		maxPrice: 1000000,
	});

	// 실제 상품 가격 범위 조회
	useEffect(() => {
		const fetchPriceRange = async () => {
			try {
				const response = await productApi.getPriceRange();
				if (response.success && response.data) {
					setPriceRange({
						minPrice: Math.floor(response.data.minPrice || 0),
						maxPrice: Math.ceil(response.data.maxPrice || 1000000),
					});
				}
			} catch (error) {
				console.error("가격 범위 조회 실패:", error);
			}
		};

		fetchPriceRange();
	}, []);

	const categories = [
		{ value: "", label: "전체 카테고리" },
		{ value: "전자기기", label: "전자기기" },
		{ value: "의류", label: "의류" },
		{ value: "식품", label: "식품" },
		{ value: "도서", label: "도서" },
		{ value: "생활용품", label: "생활용품" },
	];

	const sortOptions = [
		{ value: "newest", label: "최신순" },
		{ value: "price_asc", label: "가격 낮은순" },
		{ value: "price_desc", label: "가격 높은순" },
	];

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSearch = () => {
		onFilterChange(filters);
	};

	const handleReset = () => {
		const resetFilters: FilterValues = {
			search: "",
			category: "",
			minPrice: "",
			maxPrice: "",
			sortBy: "newest",
		};
		setFilters(resetFilters);
		onFilterChange(resetFilters);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 className="text-xl font-bold text-gray-800 mb-4">검색 및 필터</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* 검색어 */}
				<div>
					<Input
						type="text"
						name="search"
						placeholder="상품명 검색..."
						value={filters.search}
						onChange={handleChange}
						label="검색"
					/>
				</div>

				{/* 카테고리 */}
				<div>
					<label className="block text-gray-700 text-sm font-medium mb-2">
						카테고리
					</label>
					<select
						name="category"
						value={filters.category}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{categories.map((cat) => (
							<option key={cat.value} value={cat.value}>
								{cat.label}
							</option>
						))}
					</select>
				</div>

				{/* 정렬 */}
				<div>
					<label className="block text-gray-700 text-sm font-medium mb-2">
						정렬
					</label>
					<select
						name="sortBy"
						value={filters.sortBy}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{sortOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</div>

				{/* 최소 가격 */}
				<div>
					<Input
						type="number"
						name="minPrice"
						placeholder={`최소 가격 (${priceRange.minPrice.toLocaleString()}원)`}
						value={filters.minPrice}
						onChange={handleChange}
						label={`최소 가격 (${priceRange.minPrice.toLocaleString()}원 이상)`}
						min="0"
						step="1"
					/>
				</div>

				{/* 최대 가격 */}
				<div>
					<Input
						type="number"
						name="maxPrice"
						placeholder={`최대 가격 (${priceRange.maxPrice.toLocaleString()}원)`}
						value={filters.maxPrice}
						onChange={handleChange}
						label={`최대 가격 (${priceRange.maxPrice.toLocaleString()}원 이하)`}
						min="0"
						step="1"
					/>
				</div>

				{/* 버튼 영역 */}
				<div className="flex items-end gap-2">
					<Button onClick={handleSearch} variant="primary" className="flex-1">
						검색
					</Button>
					<Button onClick={handleReset} variant="secondary" className="flex-1">
						초기화
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ProductFilters;
