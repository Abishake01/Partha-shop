import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { userApi, orderApi, cartApi } from '../services/api';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from '../components/common/ProtectedRoute';

function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  const { data: addresses, isLoading: addressesLoading } = useQuery(
    'addresses',
    () => userApi.getAddresses(),
    { select: (res) => res.data.data }
  );

  const { data: cartData } = useQuery('cart', () => cartApi.getCart(), {
    select: (res) => res.data.data,
  });

  const createAddressMutation = useMutation(
    (data: typeof addressForm) => userApi.createAddress(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('addresses');
        setShowAddressForm(false);
        setAddressForm({
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          isDefault: false,
        });
        toast.success('Address added successfully');
      },
      onError: () => {
        toast.error('Failed to add address');
      },
    }
  );

  const createOrderMutation = useMutation(
    (data: { addressId: string; paymentMethod: string }) => orderApi.createOrder(data),
    {
      onSuccess: (response) => {
        clearCart();
        queryClient.invalidateQueries('cart');
        toast.success('Order placed successfully!');
        navigate(`/orders/${response.data.data.id}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to place order');
      },
    }
  );

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAddressMutation.mutate(addressForm);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.error('Please select an address');
      return;
    }
    createOrderMutation.mutate({
      addressId: selectedAddressId,
      paymentMethod: 'COD',
    });
  };

  const calculateTotal = () => {
    if (!cartData) return 0;
    return cartData.reduce((total: number, item: any) => {
      const price = item.product.discountPrice || item.product.price;
      return total + parseFloat(price.toString()) * item.quantity;
    }, 0);
  };

  if (addressesLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Address Selection */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Delivery Address</h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {showAddressForm ? 'Cancel' : '+ Add New Address'}
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="mb-4 space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="input"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="input"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  required
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  className="input"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="input"
                  />
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  />
                  <span className="text-sm">Set as default address</span>
                </label>
                <button type="submit" className="btn-primary" disabled={createAddressMutation.isLoading}>
                  {createAddressMutation.isLoading ? 'Adding...' : 'Add Address'}
                </button>
              </form>
            )}

            {addresses && addresses.length > 0 && (
              <div className="space-y-2">
                {addresses.map((address: any) => (
                  <label
                    key={address.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer ${
                      selectedAddressId === address.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="mr-2"
                    />
                    <div>
                      <p className="font-semibold">{address.fullName}</p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      <p className="text-sm text-gray-600">
                        {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      {address.isDefault && (
                        <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="p-4 border-2 border-primary-600 rounded-lg bg-primary-50">
              <p className="font-semibold">Cash on Delivery (COD)</p>
              <p className="text-sm text-gray-600">Pay when you receive your order</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            {cartData && (
              <div className="space-y-2 mb-4">
                {cartData.map((item: any) => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>₹{(parseFloat(price.toString()) * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="border-t pt-4 space-y-2">
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
              onClick={handlePlaceOrder}
              disabled={!selectedAddressId || createOrderMutation.isLoading}
              className="w-full btn-primary mt-4"
            >
              {createOrderMutation.isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  );
}

