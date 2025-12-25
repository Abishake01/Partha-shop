import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/products', label: 'Products', icon: FiPackage },
    { path: '/orders', label: 'Orders', icon: FiShoppingBag },
    { path: '/users', label: 'Users', icon: FiUsers },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 ${
                isActive ? 'bg-primary-600' : 'hover:bg-gray-800'
              }`}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-6 py-3 hover:bg-gray-800 rounded-lg"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

