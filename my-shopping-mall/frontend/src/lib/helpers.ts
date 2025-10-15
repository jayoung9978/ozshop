// ===== 토큰 관리 함수들 =====

/**
 * 로컬스토리지에 토큰 저장
 */
export const setToken = (token: string): void => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('token', token);
	}
};

/**
 * 로컬스토리지에서 토큰 가져오기
 */
export const getToken = (): string | null => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('token');
	}
	return null;
};

/**
 * 로컬스토리지에서 토큰 삭제
 */
export const removeToken = (): void => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('token');
	}
};

/**
 * 토큰 존재 여부 확인
 */
export const hasToken = (): boolean => {
	return getToken() !== null;
};

// ===== 유효성 검사 함수들 =====

/**
 * 이메일 형식 검증
 */
export const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * 비밀번호 검증 (최소 6자 이상)
 */
export const validatePassword = (password: string): boolean => {
	return password.length >= 6;
};

/**
 * 이름 검증 (2자 이상)
 */
export const validateName = (name: string): boolean => {
	return name.trim().length >= 2;
};

/**
 * 전화번호 검증 (숫자만, 10-11자리)
 */
export const validatePhone = (phone: string): boolean => {
	const phoneRegex = /^[0-9]{10,11}$/;
	return phoneRegex.test(phone.replace(/-/g, ''));
};

/**
 * 수량 검증 (1 이상의 정수)
 */
export const validateQuantity = (quantity: number): boolean => {
	return Number.isInteger(quantity) && quantity > 0;
};

// ===== 에러 메시지 처리 함수 =====

/**
 * API 에러 메시지 추출
 */
export const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === 'string') {
		return error;
	}
	if (error && typeof error === 'object' && 'message' in error) {
		return String(error.message);
	}
	return '알 수 없는 오류가 발생했습니다.';
};

/**
 * 필드별 에러 메시지 생성
 */
export const getValidationError = (field: string, value: string): string | null => {
	switch (field) {
		case 'email':
			if (!value) return '이메일을 입력해주세요.';
			if (!validateEmail(value)) return '올바른 이메일 형식이 아닙니다.';
			return null;
		case 'password':
			if (!value) return '비밀번호를 입력해주세요.';
			if (!validatePassword(value)) return '비밀번호는 최소 6자 이상이어야 합니다.';
			return null;
		case 'name':
			if (!value) return '이름을 입력해주세요.';
			if (!validateName(value)) return '이름은 최소 2자 이상이어야 합니다.';
			return null;
		case 'phone':
			if (value && !validatePhone(value)) return '올바른 전화번호 형식이 아닙니다.';
			return null;
		default:
			return null;
	}
};

// ===== 유틸리티 함수들 =====

/**
 * 가격 포맷팅 (원화)
 */
export const formatPrice = (price: number): string => {
	return new Intl.NumberFormat('ko-KR', {
		style: 'currency',
		currency: 'KRW',
	}).format(price);
};

/**
 * 날짜 포맷팅
 */
export const formatDate = (date: string | Date): string => {
	const d = new Date(date);
	return new Intl.DateTimeFormat('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(d);
};

/**
 * 전화번호 포맷팅 (하이픈 추가)
 */
export const formatPhone = (phone: string): string => {
	const cleaned = phone.replace(/\D/g, '');
	if (cleaned.length === 10) {
		return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
	}
	if (cleaned.length === 11) {
		return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
	}
	return phone;
};

/**
 * 디바운스 함수 (검색 최적화)
 */
export const debounce = <F extends (...args: unknown[]) => void>(
	func: F,
	delay: number
): ((...args: Parameters<F>) => void) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<F>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};
