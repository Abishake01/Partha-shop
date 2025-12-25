import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { productApi, cartApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProductDetails() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: productData, isLoading } = useQuery(
    ['product', slug],
    () => productApi.getProductBySlug(slug!),
    { enabled: !!slug, select: (res) => res.data.data }
  );

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await cartApi.addToCart({
        productId: productData!.id,
        quantity,
      });
      addItem(response.data.data);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!productData) return <div>Product not found</div>;

  const images = typeof productData.images === 'string' 
    ? JSON.parse(productData.images) 
    : productData.images || [];
  const price = productData.discountPrice || productData.price;
  const originalPrice = productData.discountPrice ? productData.price : null;
  const discount = productData.discountPrice
    ? ((productData.price - productData.discountPrice) / productData.price) * 100
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
            <img
              src={images[selectedImageIndex] || '/placeholder.jpg'}
              alt={productData.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${productData.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            {productData.rating > 0 && (
              <div className="flex items-center space-x-1">
                <FiStar className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{parseFloat(productData.rating.toString()).toFixed(1)}</span>
                <span className="text-gray-500">({productData.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-4xl font-bold text-primary-600">
                ₹{parseFloat(price.toString()).toFixed(2)}
              </span>
              {originalPrice && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{parseFloat(originalPrice.toString()).toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                    {Math.round(discount)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {productData.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock ({productData.stock} available)</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>
          </div>

          {/* Quantity Selector */}
          {productData.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Max: {productData.stock}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={productData.stock === 0}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>
            {isAuthenticated() && (
              <button className="btn-secondary flex items-center justify-center space-x-2">
                <FiHeart />
                <span>Wishlist</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{productData.description}</p>
          </div>

          {/* Specifications */}
          {productData.specifications && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <dl className="grid grid-cols-2 gap-4">
                {Object.entries(productData.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="text-sm text-gray-900">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

