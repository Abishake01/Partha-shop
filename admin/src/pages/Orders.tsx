import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { orderApi } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Orders() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';

  const { data: ordersData, isLoading } = useQuery(
    ['admin-orders', statusFilter],
    () => orderApi.getOrders({ status: statusFilter || undefined }),
    { select: (res) => res.data.data }
  );

  const updateStatusMutation = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      orderApi.updateOrderStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-orders');
        toast.success('Order status updated');
      },
      onError: () => {
        toast.error('Failed to update order status');
      },
    }
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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (confirm('Are you sure you want to update the order status?')) {
      updateStatusMutation.mutate({ id: orderId, status: newStatus });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            if (e.target.value) {
              params.set('status', e.target.value);
            } else {
              params.delete('status');
            }
            setSearchParams(params);
          }}
          className="input w-auto"
        >
          <option value="">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordersData?.orders?.map((order: any) => (
                <tr key={order.id}>
                  <td className="font-medium">{order.orderNumber}</td>
                  <td>
                    {order.user
                      ? `${order.user.firstName} ${order.user.lastName}`
                      : 'N/A'}
                    <br />
                    <span className="text-xs text-gray-500">{order.user?.email}</span>
                  </td>
                  <td>{order.items.length} item(s)</td>
                  <td>₹{parseFloat(order.totalAmount.toString()).toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => {
                        // TODO: Show order details modal
                        alert(`Order Details:\n${JSON.stringify(order, null, 2)}`);
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {ordersData?.pagination && ordersData.pagination.pages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            {[...Array(ordersData.pagination.pages)].map((_, i) => {
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
                    ordersData.pagination.page === page
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
      </div>
    </div>
  );
}

