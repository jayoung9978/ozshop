import Image from "next/image";
import { Product } from "@/lib/api";
import { formatPrice } from "@/lib/helpers";
import Button from "./Button";

interface ProductCardProps {
	product: Product;
	onAddToCart?: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
	const handleAddToCart = () => {
		if (onAddToCart) {
			onAddToCart(product.id);
		}
	};

	const isOutOfStock = product.stock === 0;

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
			{/* 상품 이미지 */}
			<div className="relative w-full h-48 bg-gray-200">
				<Image
					src={product.image_url}
					alt={product.name}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				{isOutOfStock && (
					<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
						<span className="text-white text-lg font-bold">품절</span>
					</div>
				)}
			</div>

			{/* 상품 정보 */}
			<div className="p-4">
				{/* 카테고리 */}
				<span className="text-xs text-gray-500 uppercase">
					{product.category}
				</span>

				{/* 상품명 */}
				<h3 className="text-lg font-semibold text-gray-800 mt-1 mb-2 line-clamp-1">
					{product.name}
				</h3>

				{/* 상품 설명 */}
				<p className="text-sm text-gray-600 mb-3 line-clamp-2">
					{product.description}
				</p>

				{/* 가격 */}
				<div className="flex items-center justify-between mb-3">
					<span className="text-xl font-bold text-blue-600">
						{formatPrice(product.price)}
					</span>
					{/* 재고 정보 */}
					<span
						className={`text-sm ${
							isOutOfStock
								? "text-red-500"
								: product.stock < 10
								? "text-orange-500"
								: "text-gray-500"
						}`}
					>
						{isOutOfStock
							? "품절"
							: product.stock < 10
							? `재고 ${product.stock}개`
							: "재고 있음"}
					</span>
				</div>

				{/* 장바구니 담기 버튼 */}
				<Button
					variant="primary"
					onClick={handleAddToCart}
					disabled={isOutOfStock}
					className="w-full"
				>
					{isOutOfStock ? "품절" : "장바구니 담기"}
				</Button>
			</div>
		</div>
	);
};

export default ProductCard;
