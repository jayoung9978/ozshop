"use client";

import { useState, useEffect } from "react";
import { adminApi, AdminProduct, Pagination } from "@/lib/api";
import Button from "@/components/ui/Button";

export default function AdminProductsPage() {
	const [products, setProducts] = useState<AdminProduct[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pagination, setPagination] = useState<Pagination | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
	const [formData, setFormData] = useState({
		product_name: "",
		description: "",
		price: "",
		stock_quantity: "",
		category: "",
		image_url: "",
	});

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await adminApi.products.getAll({
				page,
				limit: 10,
				search,
			});
			if (response.success) {
				setProducts(response.data);
				setPagination(response.pagination);
			}
		} catch (error) {
			console.error("상품 목록 조회 실패:", error);
			alert("상품 목록을 불러오는데 실패했습니다.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, [page]);

	const handleSearch = () => {
		setPage(1);
		fetchProducts();
	};

	const handleDelete = async (id: number) => {
		if (!confirm("정말로 이 상품을 삭제하시겠습니까?")) {
			return;
		}

		try {
			const response = await adminApi.products.delete(id);
			if (response.success) {
				alert("상품이 삭제되었습니다.");
				fetchProducts();
			}
		} catch (error) {
			console.error("상품 삭제 실패:", error);
			alert("상품 삭제에 실패했습니다.");
		}
	};

	const openAddModal = () => {
		setEditingProduct(null);
		setFormData({
			product_name: "",
			description: "",
			price: "",
			stock_quantity: "",
			category: "",
			image_url: "",
		});
		setShowModal(true);
	};

	const openEditModal = (product: AdminProduct) => {
		setEditingProduct(product);
		setFormData({
			product_name: product.name,
			description: product.description || "",
			price: product.price.toString(),
			stock_quantity: product.stock.toString(),
			category: product.category || "",
			image_url: product.image_url || "",
		});
		setShowModal(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const productData = {
				product_name: formData.product_name,
				description: formData.description,
				price: parseFloat(formData.price),
				stock_quantity: parseInt(formData.stock_quantity),
				category: formData.category,
				image_url: formData.image_url,
			};

			if (editingProduct) {
				const response = await adminApi.products.update(editingProduct.id, productData);
				if (response.success) {
					alert("상품이 수정되었습니다.");
					setShowModal(false);
					fetchProducts();
				}
			} else {
				const response = await adminApi.products.create(productData);
				if (response.success) {
					alert("상품이 추가되었습니다.");
					setShowModal(false);
					fetchProducts();
				}
			}
		} catch (error) {
			console.error("상품 저장 실패:", error);
			alert("상품 저장에 실패했습니다.");
		}
	};

	if (loading) {
		return <div className="text-center py-8">로딩 중...</div>;
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">상품 관리</h1>
				<Button onClick={openAddModal} variant="primary">
					상품 추가
				</Button>
			</div>

			{/* 검색 */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-6">
				<div className="flex gap-4">
					<input
						type="text"
						placeholder="상품명 검색..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleSearch()}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<Button onClick={handleSearch} variant="primary">
						검색
					</Button>
				</div>
			</div>

			{/* 상품 테이블 */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								상품명
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								가격
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								재고
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								카테고리
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								작업
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{products.map((product) => (
							<tr key={product.id}>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{product.id}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{product.name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{product.price.toLocaleString()}원
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{product.stock}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{product.category || "-"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
									<button
										onClick={() => openEditModal(product)}
										className="text-blue-600 hover:text-blue-900"
									>
										수정
									</button>
									<button
										onClick={() => handleDelete(product.id)}
										className="text-red-600 hover:text-red-900"
									>
										삭제
									</button>
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

			{/* 상품 추가/수정 모달 */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<h2 className="text-2xl font-bold mb-4">
							{editingProduct ? "상품 수정" : "상품 추가"}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										상품명 *
									</label>
									<input
										type="text"
										required
										value={formData.product_name}
										onChange={(e) =>
											setFormData({ ...formData, product_name: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										설명
									</label>
									<textarea
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										rows={3}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										가격 *
									</label>
									<input
										type="number"
										required
										value={formData.price}
										onChange={(e) =>
											setFormData({ ...formData, price: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										재고 수량 *
									</label>
									<input
										type="number"
										required
										value={formData.stock_quantity}
										onChange={(e) =>
											setFormData({
												...formData,
												stock_quantity: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										카테고리
									</label>
									<input
										type="text"
										value={formData.category}
										onChange={(e) =>
											setFormData({ ...formData, category: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										이미지 URL
									</label>
									<input
										type="text"
										value={formData.image_url}
										onChange={(e) =>
											setFormData({ ...formData, image_url: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
							</div>
							<div className="flex justify-end space-x-2 mt-6">
								<Button
									type="button"
									onClick={() => setShowModal(false)}
									variant="secondary"
								>
									취소
								</Button>
								<Button type="submit" variant="primary">
									{editingProduct ? "수정" : "추가"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
