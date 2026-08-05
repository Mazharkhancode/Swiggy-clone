import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { ShoppingBag, ChevronRight, Clock, User, Landmark, HelpCircle, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const loadAllOrders = () => {
    const storedDb = localStorage.getItem('swiggy_users_db');
    const usersDb = storedDb ? JSON.parse(storedDb) : {};
    
    let list = [];
    Object.keys(usersDb).forEach(email => {
      const userObj = usersDb[email];
      if (userObj.orders && Array.isArray(userObj.orders)) {
        userObj.orders.forEach(order => {
          list.push({
            ...order,
            userEmail: userObj.email,
            userName: userObj.name
          });
        });
      }
    });

    // Sort: newest first
    list.reverse();
    setOrders(list);
  };

  useEffect(() => {
    loadAllOrders();
  }, []);

  const handleStatusChange = (userEmail, orderId, newStatus) => {
    const storedDb = localStorage.getItem('swiggy_users_db');
    if (!storedDb) return;
    
    const db = JSON.parse(storedDb);
    const emailKey = userEmail.toLowerCase();
    
    if (db[emailKey] && db[emailKey].orders) {
      db[emailKey].orders = db[emailKey].orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('swiggy_users_db', JSON.stringify(db));

      // Also update the active session if the active user is the one whose order got updated
      const activeUserStr = localStorage.getItem('swiggy_user');
      if (activeUserStr) {
        const activeUser = JSON.parse(activeUserStr);
        if (activeUser.email.toLowerCase() === emailKey) {
          activeUser.orders = activeUser.orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          );
          localStorage.setItem('swiggy_user', JSON.stringify(activeUser));
        }
      }

      setSuccessMsg(`Order ${orderId} updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAllOrders();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          <AdminSidebar />

          <div className="flex-1 space-y-6">
            
            {/* Header page */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Manage Orders</h1>
                <p className="text-gray-400 text-xs font-semibold mt-1">Platform-wide order monitoring and tracking center</p>
              </div>

              {successMsg && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-2xl border border-emerald-100 animate-pulse">
                  {successMsg}
                </div>
              )}
            </div>

            {/* List orders */}
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 hover:shadow-md hover:border-slate-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    
                    {/* Left: Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center flex-wrap gap-2.5">
                        <span className="text-xs bg-orange-50 text-[#ff5200] border border-orange-100 font-black px-2.5 py-0.5 rounded uppercase">
                          {order.restaurantName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100">
                          {order.date}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 font-semibold text-slate-600">
                        <p>Order ID: <span className="text-slate-900 font-bold">{order.id}</span></p>
                        <p className="flex items-center gap-1">
                          <User size={12} className="text-slate-400" />
                          <span>{order.userName} ({order.userEmail})</span>
                        </p>
                        <p className="text-slate-500 text-[11px] font-bold mt-1">
                          Address: <span className="text-slate-700">{order.address}</span>
                        </p>
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 pt-2 text-xs font-bold text-slate-700">
                        {order.items?.map((itemObj, i) => (
                          <span key={i} className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-slate-600">
                            {itemObj.item.name} <span className="text-slate-400">x{itemObj.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Price & Status Controller */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="md:text-right">
                        <p className="text-xs text-slate-400 font-semibold">Grand Total</p>
                        <h4 className="text-lg font-black text-slate-800">₹{order.grandTotal}</h4>
                      </div>

                      {/* Dropdown status changer */}
                      <div className="space-y-1.5 text-left w-40">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Update Status</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.userEmail, order.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black uppercase text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ff5200]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center p-6 gap-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl text-slate-400">🛍️</div>
                  <div>
                    <h3 className="font-black text-slate-800 text-base">No customer orders placed yet</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">As orders are placed on the checkout screen, they will populate here instantly.</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
