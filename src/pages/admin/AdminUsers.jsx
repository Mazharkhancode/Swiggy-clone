import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Users, Mail, Phone, ShoppingBag, Heart, MapPin, Search, ChevronDown, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortKey, setSortKey] = useState('orders'); // 'orders' | 'name' | 'wishlist'

  const loadUsers = () => {
    const db = localStorage.getItem('swiggy_users_db');
    if (!db) { setUsers([]); return; }
    const usersDb = JSON.parse(db);
    const list = Object.values(usersDb).map(u => ({
      ...u,
      ordersCount: u.orders?.length || 0,
      wishlistCount: u.wishlist?.length || 0,
      addressesCount: u.addresses?.length || 0,
      totalSpent: (u.orders || []).reduce((sum, o) => sum + parseFloat(o.grandTotal || 0), 0)
    }));
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users
    .filter(u => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortKey === 'orders') return b.ordersCount - a.ordersCount;
      if (sortKey === 'spent') return b.totalSpent - a.totalSpent;
      if (sortKey === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  const handleDeleteUser = (email) => {
    if (!window.confirm(`Are you sure you want to delete user: ${email}?`)) return;
    const db = JSON.parse(localStorage.getItem('swiggy_users_db') || '{}');
    delete db[email.toLowerCase()];
    localStorage.setItem('swiggy_users_db', JSON.stringify(db));
    setSelectedUser(null);
    loadUsers();
  };

  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);
  const totalOrders = users.reduce((sum, u) => sum + u.ordersCount, 0);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">

          <AdminSidebar />

          <div className="flex-1 space-y-6">

            {/* Header */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">User Management</h1>
                  <p className="text-gray-400 text-xs font-semibold mt-1">All registered users on Swiggy platform</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-2 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Total Users</p>
                    <p className="text-xl font-black text-[#ff5200]">{users.length}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Total Orders</p>
                    <p className="text-xl font-black text-blue-600">{totalOrders}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-2 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Revenue</p>
                    <p className="text-xl font-black text-green-600">₹{Math.round(totalRevenue).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-white pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#ff5200] shadow-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer border-0 bg-transparent">
                    <X size={14} />
                  </button>
                )}
              </div>
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value)}
                className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-200 shadow-sm cursor-pointer"
              >
                <option value="orders">Sort: Most Orders</option>
                <option value="spent">Sort: Highest Spent</option>
                <option value="name">Sort: Name A-Z</option>
              </select>
            </div>

            {/* Users Table */}
            {users.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 border border-gray-100 shadow-sm text-center">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="font-black text-gray-800 text-lg">No Users Found</h3>
                <p className="text-gray-400 text-xs font-semibold mt-1">No users have registered yet. Users will appear here after they sign up.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Orders</th>
                        <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Wishlist</th>
                        <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Total Spent</th>
                        <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Type</th>
                        <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map((u, idx) => {
                        const initials = (u.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                        return (
                          <motion.tr
                            key={u.email}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                            onClick={() => setSelectedUser(u)}
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff5200] to-orange-400 flex items-center justify-center font-black text-white text-sm flex-shrink-0">
                                  {initials}
                                </div>
                                <div>
                                  <p className="font-black text-gray-800 text-sm group-hover:text-[#ff5200] transition-colors">{u.name || 'Unknown'}</p>
                                  <p className="text-[11px] text-gray-400 font-semibold">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-700 font-black text-sm rounded-full">
                                {u.ordersCount}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-500 font-black text-sm rounded-full">
                                {u.wishlistCount}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right font-black text-gray-800 text-sm">
                              ₹{Math.round(u.totalSpent).toLocaleString()}
                            </td>
                            <td className="px-5 py-4 text-center">
                              {u.isPartner ? (
                                <span className="text-[10px] bg-yellow-100 text-yellow-700 font-black px-2 py-0.5 rounded-full">Partner</span>
                              ) : u.email?.toLowerCase() === 'admin@swiggy.com' ? (
                                <span className="text-[10px] bg-orange-100 text-[#ff5200] font-black px-2 py-0.5 rounded-full">Admin</span>
                              ) : (
                                <span className="text-[10px] bg-gray-100 text-gray-600 font-black px-2 py-0.5 rounded-full">Customer</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                onClick={e => { e.stopPropagation(); handleDeleteUser(u.email); }}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400 font-semibold">
                  Showing {filtered.length} of {users.length} users
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#ff5200] p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-black text-2xl">
                    {(selectedUser.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{selectedUser.name}</h3>
                    <p className="text-white/75 text-xs font-semibold">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer border-0 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-blue-50 rounded-2xl p-3">
                    <p className="text-xl font-black text-blue-600">{selectedUser.ordersCount}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Orders</p>
                  </div>
                  <div className="bg-red-50 rounded-2xl p-3">
                    <p className="text-xl font-black text-red-500">{selectedUser.wishlistCount}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Wishlist</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-3">
                    <p className="text-xl font-black text-green-600">₹{Math.round(selectedUser.totalSpent).toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Spent</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {selectedUser.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
                      <Phone size={14} className="text-gray-400" />
                      <span className="font-semibold">{selectedUser.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="font-semibold">{selectedUser.addressesCount} saved address{selectedUser.addressesCount !== 1 ? 'es' : ''}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm bg-gray-50 rounded-xl px-4 py-3">
                    <Users size={14} className="text-gray-400" />
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      selectedUser.isPartner ? 'bg-yellow-100 text-yellow-700' :
                      selectedUser.email?.toLowerCase() === 'admin@swiggy.com' ? 'bg-orange-100 text-[#ff5200]' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {selectedUser.isPartner ? 'Partner' : selectedUser.email?.toLowerCase() === 'admin@swiggy.com' ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                </div>

                {/* Recent Orders */}
                {selectedUser.orders && selectedUser.orders.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Recent Orders</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {selectedUser.orders.slice(0, 5).map((order, i) => (
                        <div key={i} className="flex justify-between items-center text-xs bg-gray-50 rounded-xl px-3 py-2.5">
                          <div>
                            <p className="font-black text-gray-700">{order.restaurantName}</p>
                            <p className="text-gray-400 text-[10px]">{order.id}</p>
                          </div>
                          <span className="font-black text-[#ff5200]">₹{order.grandTotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleDeleteUser(selectedUser.email)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-black text-sm py-3 rounded-2xl transition-all cursor-pointer border-0"
                >
                  <Trash2 size={14} /> Delete User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
