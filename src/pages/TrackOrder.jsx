import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Compass, Phone, MessageSquare, ShieldCheck, MapPin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [simStatus, setSimStatus] = useState('Confirmed'); // Confirmed -> Preparing -> Dispatched -> Delivered

  // Map path coordinates
  const pathPoints = [
    { x: 40, y: 310, label: 'Restaurant' },
    { x: 180, y: 310, label: 'Palasia Cross' },
    { x: 180, y: 160, label: 'Main Square' },
    { x: 380, y: 160, label: 'Vijay Nagar Road' },
    { x: 380, y: 50, label: 'Your Home' }
  ];

  useEffect(() => {
    // 1. Fetch order details from localStorage
    const storedDb = localStorage.getItem('swiggy_users_db');
    const usersDb = storedDb ? JSON.parse(storedDb) : {};
    
    let matchedOrder = null;
    let userEmailKey = null;

    Object.keys(usersDb).forEach(email => {
      const userObj = usersDb[email];
      if (userObj.orders) {
        const o = userObj.orders.find(ord => ord.id === orderId);
        if (o) {
          matchedOrder = { ...o, userEmail: email, userName: userObj.name };
          userEmailKey = email;
        }
      }
    });

    if (!matchedOrder) {
      // Try to read from active user session if not in users DB yet
      const activeUser = JSON.parse(localStorage.getItem('swiggy_user'));
      if (activeUser && activeUser.orders) {
        const o = activeUser.orders.find(ord => ord.id === orderId);
        if (o) {
          matchedOrder = { ...o, userEmail: activeUser.email, userName: activeUser.name };
        }
      }
    }

    if (!matchedOrder) {
      setLoading(false);
      return;
    }

    setOrder(matchedOrder);
    setLoading(false);

    // 2. Simulation Loop for scooter movement & status updates
    // Simulating full cycle in 40 seconds
    const intervalTime = 100; // ms
    const totalSimDuration = 40000; // 40 seconds
    let startTime = Date.now();

    const updateDBStatus = (status) => {
      if (!userEmailKey) return;
      const db = JSON.parse(localStorage.getItem('swiggy_users_db')) || {};
      if (db[userEmailKey] && db[userEmailKey].orders) {
        db[userEmailKey].orders = db[userEmailKey].orders.map(o => o.id === orderId ? { ...o, status } : o);
        localStorage.setItem('swiggy_users_db', JSON.stringify(db));
      }
      const active = JSON.parse(localStorage.getItem('swiggy_user'));
      if (active && active.email.toLowerCase() === userEmailKey.toLowerCase()) {
        active.orders = active.orders.map(o => o.id === orderId ? { ...o, status } : o);
        localStorage.setItem('swiggy_user', JSON.stringify(active));
      }
    };

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / totalSimDuration, 1);
      setProgress(ratio);

      // Determine statuses based on ratio
      let currentStatus = 'Confirmed';
      if (ratio >= 1) {
        currentStatus = 'Delivered';
      } else if (ratio >= 0.7) {
        currentStatus = 'Out for Delivery';
      } else if (ratio >= 0.25) {
        currentStatus = 'Preparing';
      }

      setSimStatus(currentStatus);
      updateDBStatus(currentStatus);

      if (ratio >= 1) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        <p className="font-bold text-sm">Locating your order GPS...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <div className="text-6xl mb-4">📍</div>
        <h2 className="text-xl font-black text-slate-800">Order tracking details not found</h2>
        <p className="text-slate-400 text-xs mt-1 mb-6">Check your order ID or go back to order history.</p>
        <Link to="/orders" className="bg-[#ff5200] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md">
          My Orders
        </Link>
      </div>
    );
  }

  // Calculate current scooter coordinate based on progress (0 to 1)
  const getScooterPos = (prog) => {
    if (prog <= 0) return pathPoints[0];
    if (prog >= 1) return pathPoints[pathPoints.length - 1];

    const numSegments = pathPoints.length - 1;
    const rawIndex = prog * numSegments;
    const currentIdx = Math.floor(rawIndex);
    const segProg = rawIndex - currentIdx;

    const p1 = pathPoints[currentIdx];
    const p2 = pathPoints[currentIdx + 1];

    return {
      x: p1.x + (p2.x - p1.x) * segProg,
      y: p1.y + (p2.y - p1.y) * segProg
    };
  };

  const scooterPos = getScooterPos(progress);

  // Stepper items list
  const steps = [
    { key: 'Confirmed', title: 'Order Confirmed', desc: 'Restaurant accepted your order' },
    { key: 'Preparing', title: 'Preparing Food', desc: 'Chef is preparing fresh meals' },
    { key: 'Out for Delivery', title: 'Rider Dispatched', desc: 'Rider is carrying your order' },
    { key: 'Delivered', title: 'Delivered', desc: 'Enjoy your delicious meals!' }
  ];

  const getStepIndex = (status) => {
    if (status === 'Delivered') return 3;
    if (status === 'Out for Delivery') return 2;
    if (status === 'Preparing') return 1;
    return 0;
  };

  const currentStepIdx = getStepIndex(simStatus);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header link */}
        <div className="mb-6">
          <Link to="/orders" className="flex items-center gap-1 text-xs font-black text-slate-500 hover:text-slate-800 uppercase tracking-widest bg-white w-fit px-4 py-2 border border-slate-100 rounded-2xl shadow-sm">
            <ChevronLeft size={14} /> Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Center - Tracking Status & Stepper */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[9px] bg-orange-100 text-[#ff5200] border border-orange-200 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Live Status
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-2">
                  {simStatus === 'Delivered' 
                    ? 'Food has been delivered! 🎉' 
                    : simStatus === 'Out for Delivery' 
                      ? 'Rider is on the way! 🛵' 
                      : simStatus === 'Preparing' 
                        ? 'Food is being prepared 🍳' 
                        : 'Waiting for Confirmation ⏳'}
                </h2>
                <p className="text-slate-400 text-xs font-semibold mt-1">
                  Arriving at: <span className="text-slate-700 font-bold">{order.address}</span>
                </p>
              </div>
              <div className="text-right sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Delivery</p>
                <p className="text-2xl font-black text-slate-800 mt-0.5">
                  {simStatus === 'Delivered' ? 'Delivered' : '15-20 Mins'}
                </p>
              </div>
            </div>

            {/* Simulated Live SVG Map */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden relative">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Compass className="text-[#ff5200] animate-spin-slow" size={16} /> Delivery GPS Radar (Simulated)
              </h3>
              
              <div className="w-full aspect-[4/3] max-h-[360px] bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
                <svg viewBox="0 0 450 360" className="w-full h-full">
                  {/* Grid Lines (Street layout) */}
                  <rect x="0" y="0" width="450" height="360" fill="#f8fafc" />
                  
                  {/* Road Network Grid */}
                  {/* Horizontal Roads */}
                  <line x1="0" y1="310" x2="450" y2="310" stroke="#e2e8f0" strokeWidth="20" />
                  <line x1="0" y1="160" x2="450" y2="160" stroke="#e2e8f0" strokeWidth="20" />
                  <line x1="0" y1="50" x2="450" y2="50" stroke="#e2e8f0" strokeWidth="20" />
                  
                  {/* Vertical Roads */}
                  <line x1="40" y1="0" x2="40" y2="360" stroke="#e2e8f0" strokeWidth="20" />
                  <line x1="180" y1="0" x2="180" y2="360" stroke="#e2e8f0" strokeWidth="20" />
                  <line x1="380" y1="0" x2="380" y2="360" stroke="#e2e8f0" strokeWidth="20" />

                  {/* Visual Landmarks */}
                  <rect x="70" y="80" width="80" height="50" rx="10" fill="#f1f5f9" />
                  <text x="110" y="110" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Palasia Park</text>
                  
                  <rect x="230" y="210" width="110" height="60" rx="10" fill="#e2e8f0" />
                  <text x="285" y="245" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">Swiggy Hub</text>

                  {/* Dotted Delivery Route Path */}
                  <path
                    d="M 40 310 L 180 310 L 180 160 L 380 160 L 380 50"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="4"
                    strokeDasharray="6,6"
                  />

                  {/* Travel progress trace */}
                  {progress > 0 && (
                    <path
                      d={`M 40 310 ${
                        progress >= 0.35 
                          ? 'L 180 310 L 180 160' 
                          : progress >= 0.2 
                            ? 'L 180 310' 
                            : ''
                      } L ${scooterPos.x} ${scooterPos.y}`}
                      fill="none"
                      stroke="#ff5200"
                      strokeWidth="4"
                      className="opacity-70"
                    />
                  )}

                  {/* Pins */}
                  {/* Restaurant Marker */}
                  <g transform="translate(40,310)">
                    <circle r="14" fill="#10b981" />
                    <text y="3" fill="white" fontSize="10" fontWeight="black" textAnchor="middle">R</text>
                  </g>

                  {/* Home Marker */}
                  <g transform="translate(380,50)">
                    <circle r="14" fill="#3b82f6" />
                    <text y="3" fill="white" fontSize="10" fontWeight="black" textAnchor="middle">H</text>
                  </g>

                  {/* Animated Scooter Rider Marker */}
                  <g transform={`translate(${scooterPos.x},${scooterPos.y})`}>
                    <circle r="12" fill="#ff5200" className="animate-ping absolute" style={{ animationDuration: '2s' }} />
                    <circle r="10" fill="#ff5200" stroke="white" strokeWidth="2" />
                    <text y="3" fill="white" fontSize="8" fontWeight="black" textAnchor="middle">🛵</text>
                  </g>
                </svg>

                {/* Legend tags */}
                <div className="absolute left-4 bottom-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-100 text-[9px] font-bold text-slate-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#10b981] rounded-full"></span> Restaurant
                </div>
                <div className="absolute right-4 top-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-100 text-[9px] font-bold text-slate-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#3b82f6] rounded-full"></span> Destination
                </div>
              </div>
            </div>

            {/* Live Status Tracker Stepper */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider border-b border-slate-50 pb-3">Journey Details</h3>
              <div className="relative pl-8 space-y-6">
                
                {/* Visual Line */}
                <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-100">
                  <div 
                    className="w-full bg-[#ff5200] transition-all duration-500" 
                    style={{ height: `${(currentStepIdx / 3) * 100}%` }}
                  />
                </div>

                {steps.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={step.key} className="relative flex gap-4">
                      
                      {/* Step bullet */}
                      <span className={`absolute -left-[28px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        isDone 
                          ? 'bg-[#ff5200] border-[#ff5200] text-white shadow' 
                          : isCurrent 
                            ? 'bg-white border-[#ff5200] text-[#ff5200] scale-110 shadow-md shadow-orange-500/10'
                            : 'bg-white border-slate-200 text-slate-300'
                      }`}>
                        {isDone ? <Check size={12} strokeWidth={3} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                      </span>

                      <div className="min-w-0">
                        <h4 className={`font-black text-sm ${isCurrent ? 'text-[#ff5200]' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column - Rider & Order info */}
          <div className="space-y-6">
            
            {/* Rider Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-5 text-center">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-50 pb-3 text-left">
                Delivery Partner
              </h3>
              
              <div className="space-y-3">
                {/* Rider Photo */}
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto overflow-hidden border-2 border-orange-100 shadow-inner flex items-center justify-center text-3xl">
                  👨‍✈️
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-base">Aarav Sharma</h4>
                  <p className="text-slate-400 text-[10px] font-bold mt-0.5">MP-09-HQ-7788 • Active Rider</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-xl py-2 px-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#ff5200]">
                  ★ 4.9 Rating
                </div>
              </div>

              <div className="flex gap-2.5 border-t border-slate-50 pt-4 mt-2">
                <button className="flex-1 bg-[#ff5200] hover:bg-[#e64a00] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer">
                  <Phone size={12} fill="currentColor" /> Call Rider
                </button>
                <button className="flex-1 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer">
                  <MessageSquare size={12} /> Chat
                </button>
              </div>
            </div>

            {/* Order Items card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-50 pb-3">
                Order details
              </h3>
              
              <div className="space-y-3">
                {order.items?.map((itemObj, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-semibold text-slate-600">
                    <span className="truncate max-w-[70%]">{itemObj.item.name} <span className="text-slate-400 text-[10px]">x{itemObj.quantity}</span></span>
                    <span className="text-slate-800 font-bold">₹{itemObj.item.price * itemObj.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-50 pt-3 flex justify-between items-center font-black text-sm text-slate-900 mt-2">
                <span>Total Paid</span>
                <span className="text-[#ff5200]">₹{order.grandTotal}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 text-[9px] font-bold text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" /> Contactless delivery enabled
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
