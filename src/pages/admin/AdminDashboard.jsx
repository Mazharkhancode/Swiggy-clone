import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { restaurants } from '../../data/restaurants';
import { IndianRupee, ShoppingBag, Utensils, ClipboardList, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrdersCount: 0,
    totalRestaurantsCount: 0,
    totalMenuItemsCount: 0,
    recentOrders: []
  });

  useEffect(() => {
    // 1. Get Live Restaurants from localStorage
    const storedRest = localStorage.getItem('swiggy_restaurants');
    const activeRestList = storedRest ? JSON.parse(storedRest) : restaurants;
    
    // Count total menu items
    let menuCount = 0;
    activeRestList.forEach(r => {
      if (r.menu) {
        r.menu.forEach(cat => {
          if (cat.items) {
            menuCount += cat.items.length;
          }
        });
      }
    });

    // 2. Scan users DB for all orders
    const storedDb = localStorage.getItem('swiggy_users_db');
    const usersDb = storedDb ? JSON.parse(storedDb) : {};
    
    let allOrders = [];
    let revenue = 0;
    
    Object.keys(usersDb).forEach(email => {
      const userObj = usersDb[email];
      if (userObj.orders && Array.isArray(userObj.orders)) {
        userObj.orders.forEach(order => {
          allOrders.push({
            ...order,
            userEmail: userObj.email,
            userName: userObj.name
          });
          revenue += parseFloat(order.grandTotal || 0);
        });
      }
    });

    // Sort all orders by date desc (mock sorting since date is a string, but let's reverse to show newest first)
    allOrders.reverse();

    setStats({
      totalRevenue: Math.round(revenue),
      totalOrdersCount: allOrders.length,
      totalRestaurantsCount: activeRestList.length,
      totalMenuItemsCount: menuCount,
      recentOrders: allOrders.slice(0, 5) // Last 5 orders
    });
  }, []);

  const cardData = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: IndianRupee, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    { title: 'Total Orders', value: stats.totalOrdersCount, icon: ShoppingBag, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { title: 'Active Restaurants', value: stats.totalRestaurantsCount, icon: Utensils, color: 'bg-orange-500/10 text-[#ff5200] border-orange-500/20' },
    { title: 'Total Menu Items', value: stats.totalMenuItemsCount, icon: ClipboardList, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          <AdminSidebar />

          <div className="flex-1 space-y-6">
            
            {/* Header greeting */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="space-y-1 text-center sm:text-left z-10">
                <span className="text-[10px] bg-orange-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Console
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-2">
                  Welcome to Swiggy Control Panel!
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold max-w-md">
                  Monitor platform-wide analytics, modify menus, and update delivery orders in real-time.
                </p>
              </div>
              <div className="text-5xl sm:text-6xl flex-shrink-0 animate-pulse z-10">📊</div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cardData.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4"
                  >
                    <div className={`p-3.5 rounded-2xl border ${card.color} flex-shrink-0`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">{card.title}</p>
                      <h4 className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">{card.value}</h4>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Orders table */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="font-black text-slate-800 text-base md:text-lg">Recent Customer Activity</h3>
                <div className="flex items-center gap-1 text-[#ff5200] font-bold text-xs">
                  <TrendingUp size={14} /> Live Updates
                </div>
              </div>

              {stats.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 font-black text-slate-500 border-b border-slate-100">
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Restaurant</th>
                        <th className="px-4 py-3">Grand Total</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="font-semibold text-slate-700">
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 last:border-0">
                          <td className="px-4 py-3.5 font-bold text-slate-900">{order.id}</td>
                          <td className="px-4 py-3.5 leading-normal">
                            <p className="font-bold text-slate-800">{order.userName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{order.userEmail}</p>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-800">{order.restaurantName}</td>
                          <td className="px-4 py-3.5 font-black text-slate-900">₹{order.grandTotal}</td>
                          <td className="px-4 py-3.5 text-right">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              order.status === 'Delivered'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : order.status === 'Out for Delivery'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : order.status === 'Preparing'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                    : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-lg">🍔</div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">No orders placed on the platform yet</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">As customers place orders, they will show up here instantly.</p>
                  </div>
                </div>
              )}
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
