import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { account } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-green-600">🍲 DapurKit</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-green-600">Meals</Link>
          {account && <Link to="/dashboard" className="text-gray-600 hover:text-green-600">My Account</Link>}
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {account ? (
            <Link to="/login" className="text-sm font-medium text-green-600">Sign Out</Link>
          ) : (
            <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link to="/" className="block text-gray-600">Meals</Link>
          {account && <Link to="/dashboard" className="block text-gray-600">My Account</Link>}
          <Link to="/cart" className="block text-gray-600">Cart ({totalItems})</Link>
          {account ? (
            <Link to="/login" className="block text-green-600">Sign Out</Link>
          ) : (
            <Link to="/login" className="block text-green-600 font-bold">Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
}