import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userApi } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from '../components/common/ProtectedRoute';

function WishlistPage() {
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery(
    'wishlist',
    () => userApi.getWishlist(),
    { select: (res) => res.data.data }
  );

  const removeMutation = useMutation(
    (productId: string) => userApi.removeFromWishlist(productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('wishlist');
        toast.success('Removed from wishlist');
      },
      onError: () => {
        toast.error('Failed to remove from wishlist');
      },
    }
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {wishlist && wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item: any) => {
            const images = typeof item.product.images === 'string'
              ? JSON.parse(item.product.images)
              : item.product.images || [];
            const price = item.product.discountPrice || item.product.price;

            return (
              <div key={item.id} className="card relative group">
                <button
                  onClick={() => removeMutation.mutate(item.productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <FiTrash2 className="text-red-600" />
                </button>
                <Link to={`/products/${item.product.slug}`}>
                  <div className="aspect-square w-full overflow-hidden rounded-lg mb-4 bg-gray-100">
                    <img
                      src={images[0] || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{parseFloat(price.toString()).toFixed(2)}
                    </span>
                    {item.product.discountPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{parseFloat(item.product.price.toString()).toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiHeart className="mx-auto text-gray-400 text-6xl mb-4" />
          <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Wishlist() {
  return (
    <ProtectedRoute>
      <WishlistPage />
    </ProtectedRoute>
  );
}

