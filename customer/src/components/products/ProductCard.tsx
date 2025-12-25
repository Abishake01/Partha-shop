import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  const mainImage = images?.[0] || '/placeholder.jpg';
  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-lg transition-shadow"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square w-full overflow-hidden rounded-lg mb-4 bg-gray-100">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-2xl font-bold text-primary-600">
            ₹{parseFloat(price.toString()).toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{parseFloat(originalPrice.toString()).toFixed(2)}
            </span>
          )}
        </div>
        {product.rating > 0 && (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span>⭐</span>
            <span>{parseFloat(product.rating.toString()).toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        )}
        {product.stock === 0 && (
          <span className="inline-block mt-2 text-sm text-red-600 font-medium">Out of Stock</span>
        )}
      </Link>
    </motion.div>
  );
}

