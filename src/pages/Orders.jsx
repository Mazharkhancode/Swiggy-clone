import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { useCart } from '../context/CartContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { restaurants } from '../data/restaurants';
import { ShoppingBag, Receipt, ArrowRight, Printer, X, Check, Landmark, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Orders() {
  const { user } = useAuthModal();
  const { addToCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [activeInvoice, setActiveInvoice] = useState(null);

  // Route protection
  if (!user) {
    setTimeout(() => navigate('/login'), 0);
    return null;
  }

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;

    // Find the original restaurant object in restaurants data
    const matchedRest = restaurants.find(r => r.id === order.restaurantId) || {
      id: order.restaurantId || 'nafees',
      name: order.restaurantName || 'Restaurant',
      deliveryFee: 30
    };

    // Optional: Clear cart first or let CartContext prompt replace cart
    // For convenience of reorder CTA, we clear the cart and add all items
    clearCart();

    order.items.forEach(orderItem => {
      const itemToCart = {
        id: orderItem.item.id,
        name: orderItem.item.name,
        price: orderItem.item.price,
        veg: orderItem.item.veg,
        image: orderItem.item.image,
        desc: orderItem.item.desc || ''
      };
      
      for (let i = 0; i < orderItem.quantity; i++) {
        addToCart(itemToCart, matchedRest);
      }
    });

    navigate('/cart');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          <DashboardSidebar />

          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm"
            >
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Order History</h1>
              <p className="text-gray-400 text-xs font-semibold mt-1">Manage and track your past orders and download receipts</p>

              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-6 mt-8">
                  {user.orders.map((order, idx) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border border-gray-100 rounded-3xl p-5 md:p-6 bg-white hover:shadow-md hover:border-gray-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center flex-wrap gap-2.5">
                          <span className="text-xs bg-orange-50 text-[#ff5200] border border-orange-100 font-black px-2.5 py-0.5 rounded uppercase">
                            {order.restaurantName}
                          </span>
                          <span className="text-[10px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check size={10} /> {order.status}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-400 font-semibold">
                          Order ID: <span className="text-gray-700 font-bold">{order.id}</span>
                        </p>

                        <p className="text-xs text-gray-500 font-bold">{order.date}</p>

                        {/* Items breakdown list */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-2 text-xs font-semibold text-gray-600">
                          {order.items?.map((itemObj, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-1 rounded-lg">
                              {itemObj.item.name} <span className="text-gray-400">x{itemObj.quantity}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing and Action CTAs */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                        <div className="md:text-right">
                          <p className="text-xs text-gray-400 font-semibold">Total Paid</p>
                          <h4 className="text-xl font-black text-gray-900">₹{order.grandTotal}</h4>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/track-order/${order.id}`}
                            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
                          >
                            Track
                          </Link>
                          <button
                            onClick={() => setActiveInvoice(order)}
                            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
                          >
                            <Receipt size={14} /> Receipt
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="flex items-center gap-1.5 bg-[#ff5200] hover:bg-[#e64a00] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <RefreshCw size={12} /> Reorder
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-6 gap-3 mt-8">
                  <div className="w-16 h-16 bg-orange-50 text-[#ff5200] rounded-full flex items-center justify-center text-2xl">🛍️</div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg">No orders yet</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">You haven't ordered anything yet. Let's get something delicious!</p>
                  </div>
                  <Link to="/restaurants" className="bg-[#ff5200] hover:bg-[#e64a00] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all mt-3">
                    Browse Restaurants
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Printable Invoice Copy Modal */}
      <AnimatePresence>
        {activeInvoice && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] print:max-h-full print:shadow-none"
            >
              
              {/* Receipt Header */}
              <div className="bg-[#ff5200] text-white p-6 flex justify-between items-center print:bg-white print:text-black">
                <div className="space-y-0.5">
                  <h3 className="font-black text-lg">Order Receipt</h3>
                  <p className="text-[10px] text-white/80 font-bold print:text-gray-500">Official Swiggy Invoice</p>
                </div>
                <button
                  onClick={() => setActiveInvoice(null)}
                  className="text-white hover:text-white/80 bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer print:hidden border-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Receipt Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-600 print:overflow-visible">
                
                {/* ID & Date */}
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Invoice ID</p>
                    <p className="font-black text-gray-800 text-xs">{activeInvoice.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Date & Time</p>
                    <p className="font-black text-gray-800 text-xs">{activeInvoice.date}</p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">From</p>
                    <p className="font-black text-gray-800 mb-0.5">{activeInvoice.restaurantName}</p>
                    <p className="text-[11px] text-gray-500 leading-normal">Indore Local Outlet</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Deliver To</p>
                    <p className="font-black text-gray-800 mb-0.5">{user.name}</p>
                    <p className="text-[11px] text-gray-500 leading-normal">{activeInvoice.address}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Item Details</p>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 font-black text-gray-500 border-b border-gray-100">
                          <th className="px-4 py-2.5">Item Name</th>
                          <th className="px-4 py-2.5 text-center">Qty</th>
                          <th className="px-4 py-2.5 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold text-gray-700">
                        {activeInvoice.items?.map((itemObj, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="px-4 py-3 font-bold text-gray-900">{itemObj.item.name}</td>
                            <td className="px-4 py-3 text-center">{itemObj.quantity}</td>
                            <td className="px-4 py-3 text-right">₹{itemObj.item.price * itemObj.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-xs font-semibold text-gray-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-800">₹{activeInvoice.items?.reduce((sum, item) => sum + item.item.price * item.quantity, 0)}</span>
                  </div>
                  {parseFloat(sessionStorage.getItem('coupon_discount') || '0') > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{sessionStorage.getItem('coupon_discount')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-gray-800">₹{activeInvoice.grandTotal > 400 ? 0 : 30}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span className="text-gray-800">₹5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST & Taxes</span>
                    <span className="text-gray-800">₹{Math.round(activeInvoice.grandTotal * 0.05)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-black text-gray-900">
                    <span>Grand Total Paid</span>
                    <span className="text-[#ff5200]">₹{activeInvoice.grandTotal}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-2">
                    <Landmark size={12} /> Paid via {activeInvoice.paymentMethod || 'UPI'}
                  </div>
                </div>

              </div>

              {/* Receipt Actions */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3 print:hidden justify-end">
                <button
                  onClick={() => setActiveInvoice(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer size={14} /> Print Invoice
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
