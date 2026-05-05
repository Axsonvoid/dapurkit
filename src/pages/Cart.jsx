import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function Cart() {
  const { cart, addToCart, removeFromCart, totalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any meals yet.</p>
        <Link to="/" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700">
          Browse Meals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {cart.map((item) => (
          <div key={item.id} className="p-6 flex items-center gap-4 border-b last:border-b-0">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <p className="text-gray-500 text-sm">Rp {item.price.toFixed(2)} / unit</p>
            </div>
            
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button onClick={() => item.quantity > 1 ? addToCart({...item, quantity: -1}) : removeFromCart(item.id)} className="p-1 hover:bg-gray-100 rounded">
                <Minus size={18} />
              </button>
              <span className="font-medium w-6 text-center">{item.quantity}</span>
              <button onClick={() => addToCart(item)} className="p-1 hover:bg-gray-100 rounded">
                <Plus size={18} />
              </button>
            </div>

            {/* Price & Remove */}
            <div className="text-right min-w-[80px]">
              <p className="font-bold">Rp {(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline mt-1">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-gray-500">Total ({cart.reduce((a, b) => a + b.quantity, 0)} items)</p>
          <p className="text-2xl font-bold text-gray-900">Rp {totalPrice.toFixed(2)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={clearCart} className="px-4 py-2 text-red-600 border border-red-200 rounded hover:bg-red-50">
            Clear Cart
          </button>
          <Link to="/checkout" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}