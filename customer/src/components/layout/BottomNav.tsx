import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiShoppingCart, FiUser, FiHeart } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export default function BottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { getTotalItems } = useCartStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 ${
            isActive('/') ? 'text-primary-600' : 'text-gray-600'
          }`}
        >
          <FiHome className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/products"
          className={`flex flex-col items-center justify-center flex-1 ${
            isActive('/products') ? 'text-primary-600' : 'text-gray-600'
          }`}
        >
          <FiShoppingBag className="w-6 h-6" />
          <span className="text-xs mt-1">Products</span>
        </Link>
        {isAuthenticated() && (
          <Link
            to="/wishlist"
            className={`flex flex-col items-center justify-center flex-1 ${
              isActive('/wishlist') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <FiHeart className="w-6 h-6" />
            <span className="text-xs mt-1">Wishlist</span>
          </Link>
        )}
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center flex-1 relative ${
            isActive('/cart') ? 'text-primary-600' : 'text-gray-600'
          }`}
        >
          <FiShoppingCart className="w-6 h-6" />
          {getTotalItems() > 0 && (
            <span className="absolute top-0 right-1/4 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link
          to={isAuthenticated() ? '/profile' : '/login'}
          className={`flex flex-col items-center justify-center flex-1 ${
            isActive('/profile') || isActive('/login') ? 'text-primary-600' : 'text-gray-600'
          }`}
        >
          <FiUser className="w-6 h-6" />
          <span className="text-xs mt-1">{isAuthenticated() ? 'Profile' : 'Login'}</span>
        </Link>
      </div>
    </nav>
  );
}

