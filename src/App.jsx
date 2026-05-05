import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Cart from "./pages/Cart";
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';

// If you still have Login logic inside App.jsx, move it to a new file 'src/pages/Login.jsx' like this:
// (I'll give you the Login.jsx code in the next batch if you need it, but for now just make sure the import works)
// To avoid errors, create 'src/pages/Login.jsx' with the Login component code I gave you in Phase 1.

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path='/tracking' element={<Tracking />}/>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="bg-gray-100 text-center py-6 text-gray-500 text-sm">
            © 2026 DapurKit. University Project Mockup.
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;