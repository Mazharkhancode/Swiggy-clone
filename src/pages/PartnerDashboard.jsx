import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { saveRestaurants, restaurants } from '../data/restaurants';
import { IndianRupee, ShoppingBag, Utensils, ClipboardList, TrendingUp, X, Check, Save, PlusCircle, Trash, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PartnerDashboard() {
  const { user, logout } = useAuthModal();
  const navigate = useNavigate();

  // Redirect if not logged in or not a partner
  useEffect(() => {
    if (!user) {
      navigate('/partner');
      return;
    }
    if (!user.isPartner || !user.partnerRestaurantId) {
      navigate('/partner');
      return;
    }
  }, [user, navigate]);

  const [restaurantData, setRestaurantData] = useState(null);
  const [partnerOrders, setPartnerOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'

  // Item Form state for adding/editing inside Menu Manager
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [itemForm, setItemForm] = useState({
    name: '', desc: '', price: '', veg: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
  });

  const loadDashboardData = () => {
    if (!user || !user.partnerRestaurantId) return;

    // 1. Load restaurant profile
    const stored = localStorage.getItem('swiggy_restaurants');
    const liveList = stored ? JSON.parse(stored) : restaurants;
    const matched = liveList.find(r => r.id === user.partnerRestaurantId);
    
    if (matched) {
      setRestaurantData(matched);
    }

    // 2. Load orders matching this restaurant
    const storedDb = localStorage.getItem('swiggy_users_db');
    const usersDb = storedDb ? JSON.parse(storedDb) : {};
    
    let matchedOrders = [];
    let totalEarnings = 0;

    Object.keys(usersDb).forEach(email => {
      const userObj = usersDb[email];
      if (userObj.orders) {
        userObj.orders.forEach(order => {
          if (order.restaurantId === user.partnerRestaurantId) {
            matchedOrders.push({
              ...order,
              userEmail: userObj.email,
              userName: userObj.name
            });
            totalEarnings += parseFloat(order.grandTotal || 0);
          }
        });
      }
    });

    matchedOrders.reverse(); // Newest first
    setPartnerOrders(matchedOrders);
    setEarnings(Math.round(totalEarnings));
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

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

      // Update current active user session if they are the one
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

      setSuccessMsg(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
      loadDashboardData();
    }
  };

  // Menu Operations
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price || !restaurantData) return;
    const priceNum = parseFloat(itemForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Price must be a valid positive number.');
      return;
    }

    const updatedMenu = restaurantData.menu.map((cat, idx) => {
      if (idx === selectedCategoryIdx) {
        return {
          ...cat,
          items: [...cat.items, {
            ...itemForm,
            price: priceNum,
            id: 'item_' + Date.now(),
            rating: 4.5
          }]
        };
      }
      return cat;
    });

    const updatedRest = { ...restaurantData, menu: updatedMenu };
    
    // Save to global list
    const stored = localStorage.getItem('swiggy_restaurants');
    const liveList = stored ? JSON.parse(stored) : restaurants;
    const updatedList = liveList.map(r => r.id === restaurantData.id ? updatedRest : r);
    
    saveRestaurants(updatedList);
    setRestaurantData(updatedRest);
    setShowItemModal(false);
    setItemForm({
      name: '', desc: '', price: '', veg: true,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
    });
    setSuccessMsg('New food item added successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteItem = (catIdx, itemIdx) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    const updatedMenu = restaurantData.menu.map((cat, idx) => {
      if (idx === catIdx) {
        return { ...cat, items: cat.items.filter((_, i) => i !== itemIdx) };
      }
      return cat;
    });

    const updatedRest = { ...restaurantData, menu: updatedMenu };
    
    // Save to global list
    const stored = localStorage.getItem('swiggy_restaurants');
    const liveList = stored ? JSON.parse(stored) : restaurants;
    const updatedList = liveList.map(r => r.id === restaurantData.id ? updatedRest : r);
    
    saveRestaurants(updatedList);
    setRestaurantData(updatedRest);
    setSuccessMsg('Food item removed successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (!restaurantData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        <p className="font-bold text-sm">Loading Partner Profile...</p>
      </div>
    );
  }

  // Count items
  let itemCounter = 0;
  restaurantData.menu.forEach(cat => {
    itemCounter += cat.items.length;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Partner Header Dashboard */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Owner Left Navigation */}
          <aside className="w-full md:w-64 bg-slate-900 text-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-xl min-h-[450px] border border-slate-800">
            <div className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <img src={restaurantData.image} alt={restaurantData.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h3 className="font-black text-sm tracking-tight text-white line-clamp-1">{restaurantData.name}</h3>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Swiggy Partner</p>
                </div>
              </div>

              <hr className="border-slate-800" />

              <nav className="space-y-1.5">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all select-none border border-transparent w-full text-left cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#ff5200] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-800'
                  }`}
                >
                  <ShoppingBag size={16} />
                  <span>Incoming Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab('menu')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all select-none border border-transparent w-full text-left cursor-pointer ${
                    activeTab === 'menu'
                      ? 'bg-[#ff5200] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-800'
                  }`}
                >
                  <Utensils size={16} />
                  <span>Manage Menu</span>
                </button>
              </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-800 mt-8">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-800 transition-all select-none border border-transparent"
              >
                <LogOut size={16} className="text-slate-500" />
                <span>Exit Partner</span>
              </Link>
            </div>
          </aside>

          {/* Main Owner Content */}
          <div className="flex-1 space-y-6">
            
            {/* Owner banner */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                  {restaurantData.name} Dashboard
                </h1>
                <p className="text-slate-400 text-xs font-semibold mt-1">
                  Manage incoming customer orders and customize your food menus
                </p>
              </div>

              {successMsg && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-2xl border border-emerald-100">
                  {successMsg}
                </div>
              )}
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3.5 rounded-2xl border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <IndianRupee size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Restaurant Earnings</p>
                  <h4 className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">₹{earnings}</h4>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3.5 rounded-2xl border bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Total Orders</p>
                  <h4 className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">{partnerOrders.length}</h4>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3.5 rounded-2xl border bg-orange-500/10 text-[#ff5200] border-orange-500/20">
                  <Utensils size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Menu Card Items</p>
                  <h4 className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">{itemCounter}</h4>
                </div>
              </div>
            </div>

            {/* View Panels */}
            <AnimatePresence mode="wait">
              {activeTab === 'orders' ? (
                // Incoming Orders Feed
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <h3 className="font-black text-slate-800 text-base">Live Incoming Orders</h3>
                    <span className="flex items-center gap-1.5 text-xs text-[#ff5200] font-black animate-pulse">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> Live
                    </span>
                  </div>

                  <div className="space-y-4">
                    {partnerOrders.length > 0 ? (
                      partnerOrders.map((order, idx) => (
                        <div
                          key={order.id}
                          className="border border-slate-100 rounded-3xl p-4 md:p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between bg-white hover:border-slate-200 transition-all"
                        >
                          <div className="space-y-1.5 flex-1 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 text-sm">Order #{order.id}</span>
                              <span className="text-[10px] text-slate-400">{order.date}</span>
                            </div>
                            <p className="text-slate-500 font-semibold">
                              Customer: <span className="text-slate-800 font-bold">{order.userName}</span>
                            </p>
                            <p className="text-slate-500 font-semibold">
                              Delivery: <span className="text-slate-700">{order.address}</span>
                            </p>

                            {/* Item details */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {order.items?.map((itemObj, i) => (
                                <span key={i} className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-600">
                                  {itemObj.item.name} <span className="text-slate-400">x{itemObj.quantity}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 justify-between">
                            <div className="md:text-right">
                              <p className="text-[10px] text-slate-400 font-bold">Total Paid</p>
                              <h5 className="font-black text-sm text-slate-900">₹{order.grandTotal}</h5>
                            </div>
                            
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.userEmail, order.id, e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black uppercase text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ff5200] w-36"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 gap-2">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-lg">🍲</div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">No customer orders placed yet</p>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">When users order from your menu, they will show up here instantly.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                // Menu Editor tab
                <motion.div
                  key="menu-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <h3 className="font-black text-slate-800 text-base">Menu Catalog Manager</h3>
                    {restaurantData.menu.length > 0 && (
                      <button
                        onClick={() => setShowItemModal(true)}
                        className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle size={14} /> Add Food Item
                      </button>
                    )}
                  </div>

                  {restaurantData.menu && restaurantData.menu.length > 0 ? (
                    <div className="space-y-6">
                      {restaurantData.menu.map((cat, catIdx) => (
                        <div key={catIdx} className="space-y-3">
                          <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest border-b border-slate-50 pb-1.5">
                            Category: {cat.category}
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {cat.items && cat.items.length > 0 ? (
                              cat.items.map((item, itemIdx) => (
                                <div
                                  key={item.id}
                                  className="bg-white border border-slate-150 rounded-2xl p-4 flex gap-4 items-center justify-between shadow-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border" />
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <span className={`w-2.5 h-2.5 border rounded-sm flex items-center justify-center ${item.veg ? 'border-green-600 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                                          <span className={`w-1 h-1 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-500'}`}></span>
                                        </span>
                                        <h5 className="font-bold text-xs text-slate-800 line-clamp-1">{item.name}</h5>
                                      </div>
                                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">₹{item.price}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteItem(catIdx, itemIdx)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer border-0"
                                    title="Delete Item"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-400 font-semibold py-4 text-center border border-dashed border-slate-150 rounded-2xl col-span-2">
                                No dishes in this category yet. Click Add Food Item to add.
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-semibold py-8 text-center border border-dashed border-slate-200 rounded-3xl">
                      No categories found on your profile. Please configure your menu category builder.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>

      {/* Add Item Dialog Modal */}
      <AnimatePresence>
        {showItemModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tight">Add Food Item</h3>
                <button
                  onClick={() => setShowItemModal(false)}
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full cursor-pointer border-0"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Select Category</label>
                  <select
                    value={selectedCategoryIdx}
                    onChange={(e) => setSelectedCategoryIdx(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    {restaurantData.menu.map((cat, idx) => (
                      <option key={idx} value={idx}>{cat.category}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Item Name</label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    placeholder="e.g. Indori Poha Special"
                    className="px-4 py-2.5 w-full bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-xs font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Description</label>
                  <input
                    type="text"
                    value={itemForm.desc}
                    onChange={(e) => setItemForm({ ...itemForm, desc: e.target.value })}
                    placeholder="Brief description of dish..."
                    className="px-4 py-2.5 w-full bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Price (₹)</label>
                    <input
                      type="number"
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                      placeholder="e.g. 49"
                      className="px-4 py-2.5 w-full bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-xs font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1 flex flex-col justify-center items-center pt-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={itemForm.veg}
                        onChange={(e) => setItemForm({ ...itemForm, veg: e.target.checked })}
                        className="accent-green-600 w-4.5 h-4.5 rounded"
                      />
                      <span>Veg Only</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Image URL</label>
                  <input
                    type="text"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    className="px-4 py-2.5 w-full bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-xs font-semibold"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowItemModal(false)}
                    className="flex-1 border border-slate-200 text-slate-500 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#ff5200] hover:bg-[#e64a00] text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    Save Item
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
