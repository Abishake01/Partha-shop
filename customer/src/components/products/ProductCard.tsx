import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    discountPrice?: number | null;
    images: string | any[];
    rating: number;
    reviewCount?: number;
    stock: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductCard({ product }: ProductCardProps) {
  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  const mainImage = images?.[0] || '/placeholder.jpg';
  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const hasDiscount = !!product.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileHover={{ y: -4 }}
      className="card hover:shadow-lg transition-shadow"
      role="article"
      aria-label={product.name}
    >
      <Link to={`/products/${product.slug}`} className="block group">
        <div className="aspect-square w-full overflow-hidden rounded-lg mb-4 bg-gray-100 relative">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ₹{parseFloat(displayPrice.toString()).toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{parseFloat(originalPrice.toString()).toFixed(2)}
            </span>
          )}
        </div>

        {product.rating > 0 && (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span role="img" aria-label="rating">⭐</span>
            <span className="font-medium">{parseFloat(product.rating.toString()).toFixed(1)}</span>
            <span className="text-gray-400">({product.reviewCount || 0})</span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

