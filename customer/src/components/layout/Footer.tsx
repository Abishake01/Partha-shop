import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">MobileShop</h3>
            <p className="text-sm">
              Your trusted destination for the latest smartphones, accessories, and gadgets.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-white">
                  Brands
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/orders" className="hover:text-white">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@mobileshop.com</li>
              <li>Phone: +1 234 567 8900</li>
              <li>Address: 123 Mobile St, City, State 12345</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2024 MobileShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

