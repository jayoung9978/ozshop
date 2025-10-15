"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
	const router = useRouter();
	const { isAuthenticated, user, logout } = useAuthStore();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// 로그아웃 핸들러
	const handleLogout = () => {
		logout();
		setIsMobileMenuOpen(false);
		router.push("/");
	};

	// 모바일 메뉴 토글
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	// 링크 클릭 시 모바일 메뉴 닫기
	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className="bg-white shadow-md sticky top-0 z-50">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* 로고 */}
					<Link
						href="/"
						className="text-2xl font-bold text-blue-600 hover:text-blue-700"
						onClick={closeMobileMenu}
					>
						🛒 ShopMall
					</Link>

					{/* 데스크톱 메뉴 */}
					<div className="hidden md:flex items-center space-x-6">
						<Link
							href="/products"
							className="text-gray-700 hover:text-blue-600 font-medium"
						>
							상품 목록
						</Link>

						{isAuthenticated ? (
							<>
								<Link
									href="/cart"
									className="text-gray-700 hover:text-blue-600 font-medium"
								>
									장바구니
								</Link>
								<Link
									href="/orders"
									className="text-gray-700 hover:text-blue-600 font-medium"
								>
									주문내역
								</Link>
								<Link
									href="/mypage"
									className="text-gray-700 hover:text-blue-600 font-medium"
								>
									마이페이지
								</Link>
								{user?.role === "admin" && (
									<Link
										href="/admin"
										className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
									>
										관리자
									</Link>
								)}
								<button
									onClick={handleLogout}
									className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium"
								>
									로그아웃
								</button>
							</>
						) : (
							<>
								<Link
									href="/login"
									className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 font-medium"
								>
									로그인
								</Link>
								<Link
									href="/signup"
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
								>
									회원가입
								</Link>
							</>
						)}
					</div>

					{/* 모바일 햄버거 버튼 */}
					<button
						onClick={toggleMobileMenu}
						className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
						aria-label="메뉴 열기"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							{isMobileMenuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							)}
						</svg>
					</button>
				</div>

				{/* 모바일 메뉴 */}
				{isMobileMenuOpen && (
					<div className="md:hidden pb-4 border-t border-gray-200">
						<div className="flex flex-col space-y-3 pt-4">
							<Link
								href="/products"
								className="text-gray-700 hover:text-blue-600 font-medium px-2 py-2 rounded hover:bg-gray-50"
								onClick={closeMobileMenu}
							>
								상품 목록
							</Link>

							{isAuthenticated ? (
								<>
									<Link
										href="/cart"
										className="text-gray-700 hover:text-blue-600 font-medium px-2 py-2 rounded hover:bg-gray-50"
										onClick={closeMobileMenu}
									>
										장바구니
									</Link>
									<Link
										href="/orders"
										className="text-gray-700 hover:text-blue-600 font-medium px-2 py-2 rounded hover:bg-gray-50"
										onClick={closeMobileMenu}
									>
										주문내역
									</Link>
									<Link
										href="/mypage"
										className="text-gray-700 hover:text-blue-600 font-medium px-2 py-2 rounded hover:bg-gray-50"
										onClick={closeMobileMenu}
									>
										마이페이지
									</Link>
									{user?.role === "admin" && (
										<Link
											href="/admin"
											className="text-left px-2 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
											onClick={closeMobileMenu}
										>
											관리자
										</Link>
									)}
									<button
										onClick={handleLogout}
										className="text-left px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium"
									>
										로그아웃
									</button>
								</>
							) : (
								<>
									<Link
										href="/login"
										className="text-left px-2 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 font-medium"
										onClick={closeMobileMenu}
									>
										로그인
									</Link>
									<Link
										href="/signup"
										className="text-left px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
										onClick={closeMobileMenu}
									>
										회원가입
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
