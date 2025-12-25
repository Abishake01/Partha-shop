import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { productApi, categoryApi, brandApi } from '../services/api';
import { ProductCardSkeleton, ProductGridSkeleton } from '../components/common/SkeletonLoader';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';

function ProductCard({ product }: { product: any }) {
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

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    inStock: searchParams.get('inStock') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  });

  const { data: productsData, isLoading } = useQuery(
    ['products', filters],
    () => productApi.getProducts(filters),
    { select: (res) => res.data.data }
  );

  const { data: categories } = useQuery('categories', () => categoryApi.getCategories(), {
    select: (res) => res.data.data,
  });

  const { data: brands } = useQuery('brands', () => brandApi.getBrands(), {
    select: (res) => res.data.data,
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      categoryId: '',
      brandId: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      inStock: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`${
            showFilters ? 'block' : 'hidden'
          } md:block w-full md:w-64 space-y-6`}
        >
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            {categories && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  className="w-full input"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Brand Filter */}
            {brands && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={filters.brandId}
                  onChange={(e) => handleFilterChange('brandId', e.target.value)}
                  className="w-full input"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand: any) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full input"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.inStock === 'true'}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 btn-secondary"
            >
              <FiFilter />
              <span>Filters</span>
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {productsData?.pagination?.total || 0} products found
            </p>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="input w-auto"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="popularity-desc">Most Popular</option>
            </select>
          </div>

          {/* Products */}
          {isLoading ? (
            <ProductGridSkeleton />
          ) : productsData?.products && productsData.products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData.products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {productsData.pagination && productsData.pagination.pages > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                  {[...Array(productsData.pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.set('page', page.toString());
                          setSearchParams(params);
                        }}
                        className={`px-4 py-2 rounded-lg ${
                          productsData.pagination.page === page
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

