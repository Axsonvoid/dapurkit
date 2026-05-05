import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Check, Package, Truck, MapPin } from 'lucide-react';

const STATUS_STEPS = [
  { id: 'pending', label: 'Order Placed', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: Check },
  { id: 'packing', label: 'Packing', icon: Package },
  { id: 'shipped', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: MapPin }
];

export default function Tracking() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('dapurkit_lastOrder');
    if (saved) {
      const parsed = JSON.parse(saved);
      setOrder(parsed);
      setCurrentStep(parsed.statusIndex || 0);
    } else {
      navigate('/'); // Redirect if no order exists
    }
  }, [navigate]);

  const advanceStatus = () => {
    if (currentStep < STATUS_STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      localStorage.setItem('dapurkit_lastOrder', JSON.stringify({ ...order, statusIndex: next }));
    }
  };

  if (!order) return <div className="p-8 text-center">Loading order...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>
      
      {/* Order Summary Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-lg font-bold">#{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Placed On</p>
            <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 border-t pt-4">
          <div><span className="font-medium">Items:</span> {order.itemsCount}</div>
          <div><span className="font-medium">Total:</span> Rp {order.total.toLocaleString()}</div>
          <div><span className="font-medium">Ship To:</span> {order.city}</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6">Delivery Status</h2>
        
        {/* Desktop: Horizontal */}
        <div className="hidden md:flex justify-between items-center relative">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-0" />
          <div className="absolute top-5 left-0 h-1 bg-green-500 -z-0 transition-all duration-500" 
               style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }} />
          
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center w-1/5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                  isCurrent ? 'bg-white border-green-500 text-green-600 scale-110' : 
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  <Icon size={20} />
                </div>
                <p className={`mt-2 text-sm font-medium ${isCurrent ? 'text-green-700' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile: Vertical */}
        <div className="md:hidden space-y-6">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                    isCurrent ? 'bg-white border-green-500 text-green-600' : 
                    'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Icon size={16} />
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`font-medium ${isCurrent ? 'text-green-700' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                  {isCurrent && <p className="text-xs text-gray-400 mt-1">In progress...</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Control */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-gray-400 mb-2">🎓 Demo Controls</p>
          <button 
            onClick={advanceStatus}
            disabled={currentStep >= STATUS_STEPS.length - 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {currentStep >= STATUS_STEPS.length - 1 ? '✅ Order Delivered' : 'Simulate Next Status →'}
          </button>
        </div>
      </div>
    </div>
  );
}