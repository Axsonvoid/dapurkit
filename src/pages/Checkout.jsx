import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { shippingRates } from '../data/mockShipping';
import { CheckCircle2, Truck, CreditCard, Package, AlertCircle, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  // Address Data
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jakarta');
  
  // Payment Data
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // --- CALCULATIONS ---
  const totalWeight = cart.reduce((sum, item) => sum + (item.quantity * 0.5), 0); 
  const rate = shippingRates[city] || shippingRates["Jakarta"];
  const shippingCost = (totalWeight * rate.perKg) + rate.base;
  const grandTotal = totalPrice + shippingCost;

  // --- HANDLERS ---

  // Format Card Number (Adds spaces every 4 digits)
  const handleCardChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    if (value.length <= 19) setCardNumber(value);
  };

  // Format Expiry (Adds slash)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
    if (value.length <= 5) setExpiry(value);
  };

  // CVV Validation (Numbers only, max 3 or 4 digits)
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) setCvv(value);
  };

  // Go to Next Step
  const nextStep = () => {
    if (step === 1 && !address) {
      alert("Please enter an address.");
      return;
    }
    if (step === 2) {
      handlePaymentSubmit();
      return;
    }
    setStep(step + 1);
  };

  // Payment Simulation Logic
  const handlePaymentSubmit = () => {
    setPaymentError('');
    
    // 1. Basic Validation Check
    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 13) {
      setPaymentError('Invalid card number.');
      return;
    }
    if (expiry.length < 5) {
      setPaymentError('Invalid expiry date.');
      return;
    }
    if (cvv.length < 3) {
      setPaymentError('Invalid CVV.');
      return;
    }
    if (!cardHolder) {
      setPaymentError('Cardholder name is required.');
      return;
    }

    // 2. Simulate Processing
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      // If all good, go to Step 3 (Review)
      setStep(3); 
    }, 2000); // 2 second delay
  };

  // Finalize Order
  const placeOrder = () => {
    clearCart(); // Empty the cart
    navigate('/'); // Go home
    alert("Order Placed Successfully!"); // Simple notification
  };

  // Redirect if cart empty
  if (cart.length === 0) navigate('/');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* --- PROGRESS BAR --- */}
      <div className="flex justify-between mb-8 px-4 max-w-2xl mx-auto">
        {[
          { num: 1, label: "Address", icon: <Truck size={20} /> },
          { num: 2, label: "Payment", icon: <CreditCard size={20} /> },
          { num: 3, label: "Review", icon: <Package size={20} /> }
        ].map((s) => (
          <div key={s.num} className={`flex flex-col items-center ${step >= s.num ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${step >= s.num ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
              {step > s.num ? <CheckCircle2 size={20} /> : s.icon}
            </div>
            <span className="text-sm font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT: FORM AREA --- */}
        <div className="lg:col-span-2">
          
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              <textarea 
                className="w-full border p-3 rounded mb-4 focus:ring-2 focus:ring-green-500 outline-none" 
                rows="3" 
                placeholder="Enter your full delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
              <select 
                className="w-full border p-3 rounded mb-6 focus:ring-2 focus:ring-green-500 outline-none"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {Object.keys(shippingRates).map(cityName => (
                  <option key={cityName} value={cityName}>{cityName}</option>
                ))}
              </select>
              <button onClick={nextStep} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
                Continue to Payment
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Payment Details</h2>
              
              {/* Error Banner */}
              {paymentError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} /> {paymentError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-green-500 outline-none"
                    value={cardNumber}
                    onChange={handleCardChange}
                    disabled={isProcessing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-green-500 outline-none"
                      value={expiry}
                      onChange={handleExpiryChange}
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">CVV</label>
                    <input 
                      type="password" 
                      placeholder="123" 
                      className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-green-500 outline-none"
                      value={cvv}
                      onChange={handleCvvChange}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                  <input 
                    type="text" 
                    placeholder="Name on card" 
                    className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-green-500 outline-none"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <button 
                onClick={nextStep} 
                disabled={isProcessing}
                className={`w-full mt-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : 'Pay & Continue'}
                {isProcessing && 'Processing...'}
              </button>
            </div>
          )}

          {/* STEP 3: REVIEW / SUCCESS */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Order Review</h2>
              <p className="text-gray-500 mb-6">Total Amount: <span className="font-bold text-gray-900">Rp {grandTotal.toLocaleString()}</span></p>
              <p className="text-sm text-gray-500 mb-6">Address: {address}, {city}</p>
              <button onClick={placeOrder} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700">
                Confirm Order
              </button>
            </div>
          )}

        </div>

        {/* --- RIGHT: SUMMARY --- */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} x{item.quantity}</span>
                <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>Rp {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping ({city})</span>
              <span>Rp {shippingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>Rp {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}