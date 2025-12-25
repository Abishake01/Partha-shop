import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { productApi, cartApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/products/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  const { data: productData, isLoading } = useQuery(
    ['product', slug],
    () => productApi.getProductBySlug(slug!),
    { enabled: !!slug, select: (res) => res.data.data }
  );

  const product = productData?.product || productData;
  const relatedProducts = productData?.relatedProducts || [];
  
  // Ensure product exists before accessing properties
  if (!product && !isLoading) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await cartApi.addToCart({
        productId: product!.id,
        quantity,
      });
      addItem(response.data.data);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Calculate lens position, keeping it within bounds
    const lensSize = 100;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const lensX = Math.max(0, Math.min(rect.width - lensSize, mouseX - lensSize / 2));
    const lensY = Math.max(0, Math.min(rect.height - lensSize, mouseY - lensSize / 2));
    
    setMousePosition({ x: lensX, y: lensY });
    setZoomPosition({ x, y });
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <div>Product not found</div>;

  const images = typeof product.images === 'string' 
    ? JSON.parse(product.images) 
    : product.images || [];
  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discount = product.discountPrice
    ? ((product.price - product.discountPrice) / product.price) * 100
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images Section - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image Container */}
            <div className="order-2 lg:order-1">
              <div
                className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4 relative cursor-crosshair border border-gray-200"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => {
                  setShowZoom(false);
                  setZoomPosition(null);
                  setMousePosition(null);
                }}
                onMouseMove={handleImageHover}
              >
                <img
                  src={images[selectedImageIndex] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {/* Zoom Lens Indicator */}
                {showZoom && mousePosition && (
                  <div
                    className="absolute border-2 border-primary-500 bg-primary-500 bg-opacity-20 pointer-events-none"
                    style={{
                      width: '100px',
                      height: '100px',
                      left: `${mousePosition.x - 50}px`,
                      top: `${mousePosition.y - 50}px`,
                      transform: 'translate(0, 0)',
                    }}
                  />
                )}
              </div>
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setShowZoom(false);
                        setZoomPosition(null);
                        setMousePosition(null);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Zoom Panel - Shows on the right */}
            <div className="order-1 lg:order-2 hidden lg:block">
              {showZoom && zoomPosition && images[selectedImageIndex] ? (
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200 relative">
                  <img
                    src={images[selectedImageIndex] || '/placeholder.jpg'}
                    alt={`${product.name} - Zoom`}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(2.5)`,
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transition: 'none',
                    }}
                    draggable={false}
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <FiZoomIn />
                    Zoom View
                  </div>
                </div>
              ) : (
                <div className="aspect-square w-full rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <FiZoomIn className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Hover over image to zoom</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info - Takes 1 column */}
        <div className="lg:col-span-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            {product.rating > 0 && (
              <div className="flex items-center space-x-1">
                <FiStar className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{parseFloat(product.rating.toString()).toFixed(1)}</span>
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
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
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
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
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Max: {product.stock}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
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
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <dl className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-2">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="text-sm text-gray-900 mt-1">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <button
              onClick={() => navigate(`/products?category=${product.categoryId}`)}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
            >
              See More
              <FiChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct: any) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

