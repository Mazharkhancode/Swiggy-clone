import { Link, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { ShoppingBag, Heart, MapPin, Settings, User, ChevronRight, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuthModal();
  const navigate = useNavigate();

  // Route protection
  if (!user) {
    setTimeout(() => navigate('/login'), 0);
    return null;
  }

  const stats = [
    { name: 'Total Orders', count: user.orders?.length || 0, icon: ShoppingBag, color: 'bg-blue-500/10 text-blue-600', link: '/orders' },
    { name: 'My Wishlist', count: user.wishlist?.length || 0, icon: Heart, color: 'bg-red-500/10 text-red-600', link: '/wishlist' },
    { name: 'Saved Addresses', count: user.addresses?.length || 0, icon: MapPin, color: 'bg-green-500/10 text-green-600', link: '/addresses' },
  ];

  const recentOrder = user.orders && user.orders.length > 0 ? user.orders[0] : null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Dashboard Sidebar */}
          <DashboardSidebar />

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-6">
            
            {/* Header Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 justify-between overflow-hidden relative"
            >
              <div className="space-y-2 text-center sm:text-left z-10">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Hi, {user.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm font-semibold max-w-md leading-relaxed">
                  Ready for some delicious meals? Check your orders, wishlist, or update your profile details right here.
                </p>
              </div>
              <div className="text-5xl sm:text-6xl flex-shrink-0 animate-bounce z-10">🍲</div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -z-0 opacity-80"></div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(stat.link)}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className={`p-4 rounded-2xl ${stat.color} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.name}</p>
                      <h4 className="text-2xl font-black text-gray-900 mt-1">{stat.count}</h4>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Order Widget */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="font-black text-gray-800 text-base md:text-lg">Recent Order</h3>
                {recentOrder && (
                  <Link to="/orders" className="text-xs font-bold text-[#ff5200] hover:underline flex items-center gap-0.5">
                    View All Orders <ChevronRight size={14} />
                  </Link>
                )}
              </div>

              {recentOrder ? (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                  <div className="space-y-1.5">
                    <span className="text-[10px] bg-orange-50 text-[#ff5200] border border-orange-100 font-black px-2 py-0.5 rounded uppercase">
                      {recentOrder.restaurantName}
                    </span>
                    <p className="text-xs text-gray-400 font-semibold mt-1">Order ID: <span className="text-gray-700 font-bold">{recentOrder.id}</span></p>
                    <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                      <span className="text-green-600 font-black bg-green-50 px-2 py-0.5 rounded-full">{recentOrder.status}</span>
                      <span>•</span>
                      <span>{recentOrder.date}</span>
                    </div>
                    <div className="text-xs font-bold text-gray-700 mt-2">
                      Items: {recentOrder.items?.map(i => `${i.name} (${i.quantity})`).join(', ')}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 justify-between">
                    <span className="text-lg font-black text-gray-900">₹{recentOrder.grandTotal}</span>
                    <button
                      onClick={() => navigate(`/track-order/${recentOrder.id}`)}
                      className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-6 gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-lg">🍔</div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">No orders placed yet</p>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Explore restaurants around you and place your first order.</p>
                  </div>
                  <Link to="/restaurants" className="bg-[#ff5200] hover:bg-[#e64a00] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm transition-colors mt-2">
                    Browse Restaurants
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Quick Shortcuts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Profile Details', desc: 'Update your name, phone, and upload profile picture.', icon: User, link: '/profile' },
                { name: 'Saved Addresses', desc: 'Manage your delivery locations for faster checkouts.', icon: MapPin, link: '/addresses' },
                { name: 'Account Settings', desc: 'Secure your account with passwords and notifications.', icon: Settings, link: '/settings' },
                { name: 'Wishlist Items', desc: 'Browse and order your favorite dishes instantly.', icon: Heart, link: '/wishlist' }
              ].map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <Link
                    key={shortcut.name}
                    to={shortcut.link}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-start gap-4 hover:border-orange-200 hover:shadow-md transition-all group text-left"
                  >
                    <div className="p-3 bg-orange-50 text-[#ff5200] rounded-xl flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h4 className="font-black text-gray-800 text-sm flex items-center gap-1 group-hover:text-[#ff5200] transition-colors">
                        {shortcut.name} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-gray-400 text-xs font-semibold leading-relaxed">{shortcut.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
