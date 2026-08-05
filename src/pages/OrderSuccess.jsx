import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Home, Timer, Check, ChefHat, Bike, Gift } from 'lucide-react';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingStep, setTrackingStep] = useState(0); // 0: Placed, 1: Preparing, 2: Out for Delivery, 3: Delivered
  const [timeLeft, setTimeLeft] = useState(35); // Initial estimate: 35 minutes

  useEffect(() => {
    const saved = sessionStorage.getItem('last_order_details');
    if (!saved) {
      navigate('/');
      return;
    }
    setOrderDetails(JSON.parse(saved));

    // Simulate real-time tracking progression
    const trackingInterval = setInterval(() => {
      setTrackingStep((prev) => {
        if (prev < 3) return prev + 1;
        clearInterval(trackingInterval);
        return prev;
      });
    }, 12000); // Progress milestone every 12 seconds in mockup

    // Simulate countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timerInterval);
        return 0;
      });
    }, 60000); // Decrease minutes every 60 seconds

    return () => {
      clearInterval(trackingInterval);
      clearInterval(timerInterval);
    };
  }, [navigate]);

  const handleDownloadInvoice = () => {
    if (!orderDetails) return;

    const invoiceText = `
==================================================
                 SWIGGY INVOICE
==================================================
Order ID:       #${orderDetails.orderId}
Date/Time:      ${new Date().toLocaleString()}
Restaurant:     ${orderDetails.restaurantName}
Delivery Address: ${orderDetails.address}
Payment Method:   ${orderDetails.paymentMethod}
==================================================
Dishes Ordered:
--------------------------------------------------
${orderDetails.items.map(i => `${i.name.padEnd(30)} x${i.quantity.toString().padEnd(3)} ₹${i.price * i.quantity}`).join('\n')}
==================================================
Grand Total:    ₹${orderDetails.grandTotal}
==================================================
Thank you for ordering with Swiggy!
Have a delicious meal!
==================================================
`;

    const element = document.createElement("a");
    const file = new Blob([invoiceText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Swiggy_Invoice_${orderDetails.orderId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!orderDetails) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Card Container */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 text-center relative overflow-hidden">
          {/* Confetti Background Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50 via-white to-white -z-0 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Animated Check */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/20"
            >
              <CheckCircle2 size={44} />
            </motion.div>

            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Order Confirmed!</h1>
            <p className="text-gray-400 text-sm font-semibold mb-6">
              Thank you for ordering from <span className="text-gray-900 font-bold">{orderDetails.restaurantName}</span>
            </p>

            {/* Order Details Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md bg-gray-50 p-5 rounded-2xl border border-gray-100 text-left text-xs mb-8">
              <div>
                <span className="text-gray-400 font-bold block uppercase tracking-wider mb-1">Order ID</span>
                <span className="font-bold text-gray-800 text-sm">#{orderDetails.orderId}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold block uppercase tracking-wider mb-1">Estimated Arrival</span>
                <span className="font-bold text-gray-800 text-sm flex items-center gap-1">
                  <Timer size={14} className="text-[#ff5200]" />
                  {timeLeft > 0 ? `${timeLeft} mins` : 'Arrived'}
                </span>
              </div>
              <div className="col-span-2 border-t border-gray-200/60 pt-3 mt-1">
                <span className="text-gray-400 font-bold block uppercase tracking-wider mb-1">Delivery Address</span>
                <span className="font-bold text-gray-700 leading-relaxed block">{orderDetails.address}</span>
              </div>
            </div>

            {/* Stepper Delivery Tracker */}
            <div className="w-full max-w-lg mb-8">
              <h3 className="font-black text-sm text-gray-800 mb-6 text-left">Track Your Delivery</h3>
              
              <div className="relative flex items-center justify-between w-full">
                
                {/* Connecting Progress Line */}
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-0">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(trackingStep / 3) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>

                {/* Steps */}
                {[
                  { icon: Check, label: 'Confirmed' },
                  { icon: ChefHat, label: 'Kitchen' },
                  { icon: Bike, label: 'On Way' },
                  { icon: Gift, label: 'Delivered' }
                ].map((step, idx) => {
                  const StepIcon = step.icon;
                  const isActive = trackingStep >= idx;
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                        isActive 
                          ? 'bg-green-500 border-green-100 text-white shadow-md shadow-green-500/20' 
                          : 'bg-white border-gray-100 text-gray-300'
                      }`}>
                        <StepIcon size={20} className={idx === trackingStep && trackingStep < 3 ? 'animate-pulse' : ''} />
                      </div>
                      <span className={`text-[10px] font-black uppercase mt-2 tracking-wider ${
                        isActive ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4 border-t border-gray-50">
              <Link
                to={`/track-order/${orderDetails.orderId}`}
                className="flex-1 bg-[#ff5200] hover:bg-[#e64a00] text-white py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <Timer size={14} /> Track Order
              </Link>
              <button
                onClick={handleDownloadInvoice}
                className="flex-1 border-2 border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Invoice
              </button>
              <Link
                to="/"
                className="flex-1 border-2 border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <Home size={14} /> Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
