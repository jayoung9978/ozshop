import { create } from "zustand";
import { cartApi, productApi } from "@/lib/api";
import { hasToken } from "@/lib/helpers";

// 장바구니 아이템 타입
export interface CartItem {
	id: number;
	product_id: number;
	product_name: string;
	price: number;
	quantity: number;
	image_url: string;
}

// localStorage 키
const LOCAL_CART_KEY = "guest_cart";

// 로컬 장바구니 헬퍼 함수들
const getLocalCart = (): CartItem[] => {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(LOCAL_CART_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error("로컬 장바구니 로드 실패:", error);
		return [];
	}
};

const saveLocalCart = (items: CartItem[]) => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
	} catch (error) {
		console.error("로컬 장바구니 저장 실패:", error);
	}
};

const clearLocalCart = () => {
	if (typeof window === "undefined") return;
	localStorage.removeItem(LOCAL_CART_KEY);
};

// 장바구니 상태 인터페이스
interface CartState {
	items: CartItem[];
	total: number;
	loading: boolean;

	addItem: (productId: number, quantity: number, productData?: any) => Promise<void>;
	removeItem: (productId: number) => Promise<void>;
	updateQuantity: (productId: number, quantity: number) => Promise<void>;
	fetchCart: () => Promise<void>;
	calculateTotal: () => void;
	syncWithServer: () => Promise<void>; // 로그인 시 서버와 동기화
	clearCart: () => void;
}

// Zustand 스토어 생성
export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	total: 0,
	loading: false,

	// 총 금액 계산
	calculateTotal: () => {
		const items = get().items;
		const total = items.reduce(
			(sum: number, item: CartItem) => sum + item.price * item.quantity,
			0
		);
		set({ total });
	},

	// 장바구니 조회
	fetchCart: async () => {
		try {
			set({ loading: true });

			// 로그인 상태 확인
			if (hasToken()) {
				// 로그인 상태: 서버에서 조회
				const response = await cartApi.getCart();
				if (response && response.success && response.data) {
					set({ items: response.data });
				} else {
					set({ items: [] });
				}
			} else {
				// 비로그인 상태: localStorage에서 조회
				const localItems = getLocalCart();
				set({ items: localItems });
			}

			get().calculateTotal();
		} catch (error) {
			console.error("장바구니 조회 실패:", error);
			// 에러 발생 시 로컬 장바구니 사용
			if (!hasToken()) {
				const localItems = getLocalCart();
				set({ items: localItems });
				get().calculateTotal();
			} else {
				set({ items: [] });
			}
		} finally {
			set({ loading: false });
		}
	},

	// 장바구니에 상품 추가
	addItem: async (productId: number, quantity: number, productData?: any) => {
		try {
			set({ loading: true });

			if (hasToken()) {
				// 로그인 상태: 서버에 추가
				await cartApi.addItem(productId, quantity);
				await get().fetchCart();
			} else {
				// 비로그인 상태: localStorage에 추가
				const localItems = getLocalCart();
				const existingIndex = localItems.findIndex(
					(item) => item.product_id === productId
				);

				if (existingIndex >= 0) {
					// 이미 존재하면 수량 증가
					localItems[existingIndex].quantity += quantity;
				} else {
					// 새로운 상품 추가 - productData가 있으면 사용, 없으면 API 호출
					let newItem: CartItem;
					if (productData) {
						newItem = {
							id: Date.now(), // 임시 ID
							product_id: productId,
							product_name: productData.name,
							price: productData.price,
							quantity: quantity,
							image_url: productData.image_url,
						};
					} else {
						// 상품 정보 가져오기
						const response = await productApi.getProductById(productId);
						if (response.success && response.data) {
							const product = response.data;
							newItem = {
								id: Date.now(),
								product_id: productId,
								product_name: product.name,
								price: product.price,
								quantity: quantity,
								image_url: product.image_url,
							};
						} else {
							throw new Error("상품 정보를 가져올 수 없습니다.");
						}
					}
					localItems.push(newItem);
				}

				saveLocalCart(localItems);
				set({ items: localItems });
				get().calculateTotal();
			}
		} catch (error) {
			console.error("장바구니 추가 실패:", error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	// 장바구니 아이템 삭제
	removeItem: async (productId: number) => {
		try {
			set({ loading: true });

			if (hasToken()) {
				// 로그인 상태: 서버에서 삭제
				await cartApi.removeItem(productId);
				await get().fetchCart();
			} else {
				// 비로그인 상태: localStorage에서 삭제
				const localItems = getLocalCart();
				const filteredItems = localItems.filter(
					(item) => item.product_id !== productId
				);
				saveLocalCart(filteredItems);
				set({ items: filteredItems });
				get().calculateTotal();
			}
		} catch (error) {
			console.error("장바구니 삭제 실패:", error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	// 수량 변경
	updateQuantity: async (productId: number, quantity: number) => {
		try {
			set({ loading: true });

			if (quantity <= 0) {
				await get().removeItem(productId);
				return;
			}

			if (hasToken()) {
				// 로그인 상태: 서버 업데이트
				await cartApi.updateItem(productId, quantity);
				await get().fetchCart();
			} else {
				// 비로그인 상태: localStorage 업데이트
				const localItems = getLocalCart();
				const itemIndex = localItems.findIndex(
					(item) => item.product_id === productId
				);

				if (itemIndex >= 0) {
					localItems[itemIndex].quantity = quantity;
					saveLocalCart(localItems);
					set({ items: localItems });
					get().calculateTotal();
				}
			}
		} catch (error) {
			console.error("수량 변경 실패:", error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	// 로그인 시 로컬 장바구니를 서버와 동기화
	syncWithServer: async () => {
		if (!hasToken()) return;

		try {
			set({ loading: true });

			// 로컬 장바구니 가져오기
			const localItems = getLocalCart();

			if (localItems.length > 0) {
				// 로컬 장바구니의 각 상품을 서버에 추가
				for (const item of localItems) {
					try {
						await cartApi.addItem(item.product_id, item.quantity);
					} catch (error) {
						console.error(
							`상품 ${item.product_name} 동기화 실패:`,
							error
						);
					}
				}

				// 로컬 장바구니 비우기
				clearLocalCart();
			}

			// 서버에서 최신 장바구니 가져오기
			await get().fetchCart();
		} catch (error) {
			console.error("장바구니 동기화 실패:", error);
		} finally {
			set({ loading: false });
		}
	},

	// 장바구니 비우기
	clearCart: () => {
		clearLocalCart();
		set({ items: [], total: 0 });
	},
}));
