import { useQuery } from 'react-query';
import { productApi, categoryApi } from '../services/api';
import { ProductCardSkeleton, ProductGridSkeleton } from '../components/common/SkeletonLoader';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ProductCard({ product }: { product: any }) {
  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  const mainImage = images?.[0] || '/placeholder.jpg';
  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery(
    'featured-products',
    () => productApi.getProducts({ limit: 8, sortBy: 'popularity', sortOrder: 'desc' }),
    { select: (res) => res.data.data.products }
  );

  const { data: categories } = useQuery(
    'categories',
    () => categoryApi.getCategories(),
    { select: (res) => res.data.data }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to MobileShop
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            Discover the latest smartphones, accessories, and gadgets
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {productsLoading ? (
          <ProductGridSkeleton />
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available</p>
          </div>
        )}
      </section>
    </div>
  );
}

