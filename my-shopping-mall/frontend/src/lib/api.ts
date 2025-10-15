const API_BASE_URL = "http://localhost:3001/api";

// 타입 정의
interface LoginCredentials {
	email: string;
	password: string;
}

interface SignupData {
	email: string;
	password: string;
	name: string;
}

// 상품 타입 정의
export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	image_url: string;
	stock: number;
	category: string;
}

// 장바구니 아이템 타입 정의
export interface CartItem {
	id: number;
	product_id: number;
	product_name: string;
	price: number;
	quantity: number;
	image_url: string;
}

// 사용자 타입 정의
export interface User {
	id: number;
	email: string;
	name: string;
	role?: string;
	created_at: string;
}

// 사용자 업데이트 요청 타입
export interface UpdateUserRequest {
	name?: string;
	password?: string;
}

// 관리자용 상품 타입
export interface AdminProduct {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
	category: string;
	image_url: string;
	created_at: string;
	updated_at?: string;
}

// 관리자용 상품 생성/수정 타입
export interface AdminProductInput {
	product_name: string;
	description?: string;
	price: number;
	stock_quantity: number;
	category?: string;
	image_url?: string;
}

// 관리자용 사용자 타입
export interface AdminUser {
	id: number;
	email: string;
	name: string;
	role: string;
	created_at: string;
}

// 주문 타입 정의
export interface Order {
	id: number;
	user_id?: number;
	total_amount: number;
	status: string;
	shipping_address: string;
	created_at: string;
	updated_at?: string;
	items?: OrderItem[];
}

// 관리자용 주문 타입
export interface AdminOrder {
	id: number;
	user_id: number;
	user_name: string;
	user_email: string;
	total_amount: number;
	status: string;
	shipping_address: string;
	created_at: string;
	updated_at?: string;
}

// 주문 상품 타입
export interface OrderItem {
	id: number;
	order_id: number;
	product_id: number;
	product_name: string;
	price: number;
	quantity: number;
	image_url: string;
	created_at: string;
}

// 주문 상세 타입
export interface AdminOrderDetail extends AdminOrder {
	items: OrderItem[];
}

// 페이지네이션 타입
export interface Pagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}

export const getAuthHeaders = (): Record<string, string> => {
	if (typeof window === "undefined") {
		return {};
	}
	const token = localStorage.getItem("token");
	if (!token) {
		return {};
	}
	return {
		Authorization: `Bearer ${token}`,
	};
};

export const apiRequest = async <T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> => {
	const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

export const authApi = {
	login: (credentials: LoginCredentials) => {
		return apiRequest("/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});
	},
	signup: (userData: SignupData) => {
		return apiRequest("/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});
	},
	getProfile: () => {
		return apiRequest<{ success: boolean; data: User }>("/user", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...getAuthHeaders(),
			},
		});
	},
	updateProfile: (userData: UpdateUserRequest) => {
		return apiRequest<{ success: boolean; data: User }>("/user", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...getAuthHeaders(),
			},
			body: JSON.stringify(userData),
		});
	},
};

// 상품 필터 타입
export interface ProductFilters {
	search?: string;
	category?: string;
	minPrice?: string;
	maxPrice?: string;
	sortBy?: string;
}

// 상품 API
export const productApi = {
	// 모든 상품 조회 (검색/필터 포함)
	getAllProducts: (filters?: ProductFilters) => {
		const params = new URLSearchParams();

		if (filters?.search) params.append("search", filters.search);
		if (filters?.category) params.append("category", filters.category);
		if (filters?.minPrice) params.append("minPrice", filters.minPrice);
		if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice);
		if (filters?.sortBy) params.append("sortBy", filters.sortBy);

		const queryString = params.toString();
		const endpoint = queryString ? `/products?${queryString}` : "/products";

		return apiRequest<{ success: boolean; data: Product[]; count: number }>(
			endpoint
		);
	},
	// 특정 상품 조회
	getProductById: (id: number) => {
		return apiRequest<{ success: boolean; data: Product }>(`/products/${id}`);
	},
	// 가격 범위 조회
	getPriceRange: () => {
		return apiRequest<{
			success: boolean;
			data: { minPrice: number; maxPrice: number };
		}>("/products/price-range");
	},
};

// 장바구니 API
export const cartApi = {
	// 장바구니 조회
	getCart: () => {
		return apiRequest<{ success: boolean; data: CartItem[] }>("/cart", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...getAuthHeaders(),
			},
		});
	},
	// 장바구니에 상품 추가
	addItem: (productId: number, quantity: number) => {
		return apiRequest<{ success: boolean; message: string }>("/cart", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...getAuthHeaders(),
			},
			body: JSON.stringify({ productId, quantity }),
		});
	},
	// 장바구니 아이템 수량 변경
	updateItem: (productId: number, quantity: number) => {
		return apiRequest<{ success: boolean; message: string }>(
			`/cart/${productId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...getAuthHeaders(),
				},
				body: JSON.stringify({ quantity }),
			}
		);
	},
	// 장바구니 아이템 삭제
	removeItem: (productId: number) => {
		return apiRequest<{ success: boolean; message: string }>(
			`/cart/${productId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					...getAuthHeaders(),
				},
			}
		);
	},
};

// 주문 API
export const orderApi = {
	// 주문 생성
	create: (shippingAddress: string) => {
		return apiRequest<{ success: boolean; message: string; data: { orderId: number } }>(
			"/orders",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...getAuthHeaders(),
				},
				body: JSON.stringify({ shippingAddress }),
			}
		);
	},
	// 사용자 주문 목록 조회
	getUserOrders: () => {
		return apiRequest<{ success: boolean; data: Order[] }>("/orders", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...getAuthHeaders(),
			},
		});
	},
	// 주문 상세 조회
	getById: (id: number) => {
		return apiRequest<{ success: boolean; data: Order }>(`/orders/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...getAuthHeaders(),
			},
		});
	},
	// 주문 취소
	cancel: (id: number) => {
		return apiRequest<{ success: boolean; message: string }>(
			`/orders/${id}/cancel`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...getAuthHeaders(),
				},
			}
		);
	},
};

// 관리자 API
export const adminApi = {
	// 대시보드
	dashboard: {
		getStats: () => {
			return apiRequest<{ success: boolean; data: { productCount: number; userCount: number; orderCount: number } }>(
				"/admin/dashboard/stats",
				{
					headers: getAuthHeaders(),
				}
			);
		},
	},
	// 상품 관리
	products: {
		getAll: (params?: { page?: number; limit?: number; search?: string; category?: string }) => {
			const queryParams = new URLSearchParams();
			if (params?.page) queryParams.append("page", params.page.toString());
			if (params?.limit) queryParams.append("limit", params.limit.toString());
			if (params?.search) queryParams.append("search", params.search);
			if (params?.category) queryParams.append("category", params.category);
			const queryString = queryParams.toString();
			return apiRequest<{ success: boolean; data: AdminProduct[]; pagination: Pagination }>(
				`/admin/products${queryString ? `?${queryString}` : ""}`,
				{
					headers: getAuthHeaders(),
				}
			);
		},
		getById: (id: number) => {
			return apiRequest<{ success: boolean; data: AdminProduct }>(
				`/admin/products/${id}`,
				{
					headers: getAuthHeaders(),
				}
			);
		},
		create: (productData: AdminProductInput) => {
			return apiRequest<{ success: boolean; message: string; data: { productId: number } }>(
				"/admin/products",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...getAuthHeaders(),
					},
					body: JSON.stringify(productData),
				}
			);
		},
		update: (id: number, productData: Partial<AdminProductInput>) => {
			return apiRequest<{ success: boolean; message: string }>(
				`/admin/products/${id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						...getAuthHeaders(),
					},
					body: JSON.stringify(productData),
				}
			);
		},
		delete: (id: number) => {
			return apiRequest<{ success: boolean; message: string }>(
				`/admin/products/${id}`,
				{
					method: "DELETE",
					headers: getAuthHeaders(),
				}
			);
		},
	},
	// 사용자 관리
	users: {
		getAll: (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
			const queryParams = new URLSearchParams();
			if (params?.page) queryParams.append("page", params.page.toString());
			if (params?.limit) queryParams.append("limit", params.limit.toString());
			if (params?.search) queryParams.append("search", params.search);
			if (params?.role) queryParams.append("role", params.role);
			const queryString = queryParams.toString();
			return apiRequest<{ success: boolean; data: AdminUser[]; pagination: Pagination }>(
				`/admin/users${queryString ? `?${queryString}` : ""}`,
				{
					headers: getAuthHeaders(),
				}
			);
		},
		updateRole: (id: number, role: string) => {
			return apiRequest<{ success: boolean; message: string }>(
				`/admin/users/${id}/role`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						...getAuthHeaders(),
					},
					body: JSON.stringify({ role }),
				}
			);
		},
		delete: (id: number) => {
			return apiRequest<{ success: boolean; message: string }>(
				`/admin/users/${id}`,
				{
					method: "DELETE",
					headers: getAuthHeaders(),
				}
			);
		},
	},
	// 주문 관리
	orders: {
		getAll: (params?: { page?: number; limit?: number; status?: string; userId?: string }) => {
			const queryParams = new URLSearchParams();
			if (params?.page) queryParams.append("page", params.page.toString());
			if (params?.limit) queryParams.append("limit", params.limit.toString());
			if (params?.status) queryParams.append("status", params.status);
			if (params?.userId) queryParams.append("userId", params.userId);
			const queryString = queryParams.toString();
			return apiRequest<{ success: boolean; data: AdminOrder[]; pagination: Pagination }>(
				`/admin/orders${queryString ? `?${queryString}` : ""}`,
				{
					headers: getAuthHeaders(),
				}
			);
		},
		getById: (id: number) => {
			return apiRequest<{ success: boolean; data: AdminOrderDetail }>(
				`/admin/orders/${id}`,
				{
					headers: getAuthHeaders(),
				}
			);
		},
		updateStatus: (id: number, status: string) => {
			return apiRequest<{ success: boolean; message: string }>(
				`/admin/orders/${id}/status`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						...getAuthHeaders(),
					},
					body: JSON.stringify({ status }),
				}
			);
		},
		delete: (id: number) => {
			return apiRequest<{ success: boolean; message: string }>(
				`/admin/orders/${id}`,
				{
					method: "DELETE",
					headers: getAuthHeaders(),
				}
			);
		},
	},
};
