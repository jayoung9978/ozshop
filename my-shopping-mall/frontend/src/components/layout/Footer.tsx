import Link from "next/link";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-800 text-white mt-auto">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* 회사 정보 */}
					<div>
						<h3 className="text-xl font-bold mb-4">🛒 ShopMall</h3>
						<p className="text-gray-300 text-sm mb-2">
							최고의 쇼핑 경험을 제공하는 온라인 쇼핑몰입니다.
						</p>
						<p className="text-gray-400 text-xs">
							고객 만족을 최우선으로 생각합니다.
						</p>
					</div>

					{/* 빠른 링크 */}
					<div>
						<h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/products"
									className="text-gray-300 hover:text-white text-sm transition-colors"
								>
									상품 목록
								</Link>
							</li>
							<li>
								<Link
									href="/cart"
									className="text-gray-300 hover:text-white text-sm transition-colors"
								>
									장바구니
								</Link>
							</li>
							<li>
								<Link
									href="/mypage"
									className="text-gray-300 hover:text-white text-sm transition-colors"
								>
									마이페이지
								</Link>
							</li>
						</ul>
					</div>

					{/* 고객 지원 */}
					<div>
						<h3 className="text-lg font-semibold mb-4">고객 지원</h3>
						<ul className="space-y-2 text-sm text-gray-300">
							<li>이메일: support@shopmall.com</li>
							<li>전화: 1588-0000</li>
							<li>운영시간: 평일 09:00 - 18:00</li>
							<li className="pt-2">
								<a
									href="https://github.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-300 hover:text-white transition-colors"
								>
									GitHub
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* 하단 카피라이트 */}
				<div className="border-t border-gray-700 mt-8 pt-6 text-center">
					<p className="text-gray-400 text-sm">
						© {currentYear} ShopMall. All rights reserved.
					</p>
					<div className="mt-2 space-x-4 text-xs text-gray-500">
						<Link href="/privacy" className="hover:text-gray-300">
							개인정보처리방침
						</Link>
						<span>|</span>
						<Link href="/terms" className="hover:text-gray-300">
							이용약관
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
