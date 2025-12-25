import { useQuery } from 'react-query';
import { orderApi } from '../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from '../components/common/ProtectedRoute';

function OrdersPage() {
  const { data: ordersData, isLoading } = useQuery(
    'orders',
    () => orderApi.getOrders(),
    { select: (res) => res.data.data }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {ordersData && ordersData.orders && ordersData.orders.length > 0 ? (
        <div className="space-y-4">
          {ordersData.orders.map((order: any) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="card hover:shadow-lg transition-shadow block"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.items.length} item(s) • Total: ₹{parseFloat(order.totalAmount.toString()).toFixed(2)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-primary-600 hover:text-primary-700 font-medium">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  return (
    <ProtectedRoute>
      <OrdersPage />
    </ProtectedRoute>
  );
}

