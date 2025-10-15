import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Our Shopping Mall
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          최고의 상품을 최저가로 만나보세요. 
          빠른 배송과 안전한 결제를 제공합니다.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          지금 쇼핑하기
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          왜 저희 쇼핑몰을 선택해야 할까요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              빠른 배송
            </h3>
            <p className="text-gray-600">
              주문 후 24시간 내 배송 시작. 
              빠르고 안전하게 상품을 받아보세요.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              안전한 결제
            </h3>
            <p className="text-gray-600">
              SSL 암호화로 보호되는 안전한 결제 시스템. 
              다양한 결제 수단을 지원합니다.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              품질 보증
            </h3>
            <p className="text-gray-600">
              엄선된 고품질 상품만을 제공합니다. 
              100% 정품 보증과 교환/환불 서비스.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            지금 바로 시작하세요!
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            회원가입하고 특별 할인 혜택을 받아보세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              회원가입
            </Link>
            <Link
              href="/products"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
            >
              상품 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
