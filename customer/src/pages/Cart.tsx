import { useQuery, useMutation, useQueryClient } from 'react-query';
import { cartApi } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from '../components/common/ProtectedRoute';

function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setItems, removeItem, updateItemQuantity } = useCartStore();

  const { data: cartData, isLoading } = useQuery('cart', () => cartApi.getCart(), {
    select: (res) => res.data.data,
    onSuccess: (data) => {
      setItems(data || []);
    },
  });

  const removeMutation = useMutation((id: string) => cartApi.removeFromCart(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('cart');
      toast.success('Item removed from cart');
    },
    onError: () => {
      toast.error('Failed to remove item');
    },
  });

  const updateMutation = useMutation(
    ({ id, quantity }: { id: string; quantity: number }) =>
      cartApi.updateCartItem(id, { quantity }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
      },
      onError: () => {
        toast.error('Failed to update quantity');
      },
    }
  );

  const handleRemove = (id: string) => {
    removeMutation.mutate(id);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateMutation.mutate({ id, quantity: newQuantity });
  };

  const calculateTotal = () => {
    if (!cartData) return 0;
    return cartData.reduce((total: number, item: any) => {
      const price = item.product.discountPrice || item.product.price;
      return total + parseFloat(price.toString()) * item.quantity;
    }, 0);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartData && cartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartData.map((item: any) => {
              const images = typeof item.product.images === 'string'
                ? JSON.parse(item.product.images)
                : item.product.images || [];
              const price = item.product.discountPrice || item.product.price;

              return (
                <div key={item.id} className="card flex flex-col sm:flex-row gap-4">
                  <img
                    src={images[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                    <p className="text-primary-600 font-bold text-xl mb-4">
                      ₹{parseFloat(price.toString()).toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ₹{(parseFloat(price.toString()) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}

export default function Cart() {
  return (
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  );
}

