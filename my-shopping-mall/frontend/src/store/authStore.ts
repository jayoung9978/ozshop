import { create } from "zustand";
import { authApi, User } from "@/lib/api";
import { setToken, removeToken, hasToken, getToken } from "@/lib/helpers";

// 인증 상태 인터페이스
interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	loading: boolean;

	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string, name: string) => Promise<void>;
	logout: () => void;
	checkAuth: () => Promise<void>;
	updateUser: (user: User) => void;
}

// Zustand 스토어 생성
export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,
	isAuthenticated: false,
	loading: false,

	// 로그인
	login: async (email: string, password: string) => {
		try {
			set({ loading: true });

			const response = await authApi.login({ email, password });

			if (response && typeof response === "object" && "data" in response) {
				const data = response.data as { token: string; user?: User };

				// 토큰 저장
				setToken(data.token);

				// 프로필 조회
				const profileResponse = await authApi.getProfile();
				if (profileResponse && profileResponse.success && profileResponse.data) {
					set({
						user: profileResponse.data,
						token: data.token,
						isAuthenticated: true,
					});

					// 로그인 성공 시 장바구니 동기화
					if (typeof window !== "undefined") {
						import("./cartStore").then(({ useCartStore }) => {
							const cartStore = useCartStore.getState();
							cartStore.syncWithServer();
						});
					}
				}
			}
		} catch (error) {
			console.error("로그인 실패:", error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	// 회원가입
	signup: async (email: string, password: string, name: string) => {
		try {
			set({ loading: true });

			const response = await authApi.signup({ email, password, name });

			if (response && typeof response === "object" && "data" in response) {
				const data = response.data as { token: string };

				// 토큰 저장
				setToken(data.token);

				// 프로필 조회
				const profileResponse = await authApi.getProfile();
				if (profileResponse && profileResponse.success && profileResponse.data) {
					set({
						user: profileResponse.data,
						token: data.token,
						isAuthenticated: true,
					});
				}
			}
		} catch (error) {
			console.error("회원가입 실패:", error);
			throw error;
		} finally {
			set({ loading: false });
		}
	},

	// 로그아웃
	logout: () => {
		removeToken();
		set({
			user: null,
			token: null,
			isAuthenticated: false,
		});
	},

	// 인증 상태 체크
	checkAuth: async () => {
		if (!hasToken()) {
			set({ isAuthenticated: false, user: null, token: null });
			return;
		}

		try {
			set({ loading: true });

			const response = await authApi.getProfile();
			const currentToken = getToken();

			if (response && response.success && response.data) {
				set({
					user: response.data,
					token: currentToken,
					isAuthenticated: true,
				});
			} else {
				// 토큰이 유효하지 않음
				removeToken();
				set({ isAuthenticated: false, user: null, token: null });
			}
		} catch (error) {
			console.error("인증 체크 실패:", error);
			removeToken();
			set({ isAuthenticated: false, user: null, token: null });
		} finally {
			set({ loading: false });
		}
	},

	// 사용자 정보 업데이트
	updateUser: (user: User) => {
		set({ user });
	},
}));
