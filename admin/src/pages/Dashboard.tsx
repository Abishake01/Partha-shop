import { useQuery } from 'react-query';
import { dashboardApi } from '../services/api';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery(
    'dashboard-stats',
    () => dashboardApi.getStats(),
    { select: (res) => res.data.data }
  );

  if (isLoading) return <LoadingSpinner />;

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      link: '/orders',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: FiPackage,
      color: 'bg-yellow-500',
      link: '/orders?status=PENDING',
    },
    {
      title: 'Total Revenue',
      value: `₹${parseFloat((stats?.totalRevenue || 0).toString()).toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'bg-purple-500',
      link: '/users',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div className={`${stat.color} rounded-lg p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <Icon className="w-12 h-12 text-white/80" />
              </div>
            </div>
          );

          return stat.link ? (
            <Link key={stat.title} to={stat.link}>
              {content}
            </Link>
          ) : (
            <div key={stat.title}>{content}</div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.orderNumber}</td>
                    <td>
                      {order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : 'N/A'}
                    </td>
                    <td>{order.items.length}</td>
                    <td>₹{parseFloat(order.totalAmount.toString()).toFixed(2)}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent orders</p>
        )}
      </div>
    </div>
  );
}

