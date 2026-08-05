import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { saveRestaurants, restaurants } from '../data/restaurants';
import { ArrowRight, Utensils, CheckCircle2, ChevronRight, PlusCircle, Trash, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Partner() {
  const { user, updateUserProfile, openLogin } = useAuthModal();
  const navigate = useNavigate();

  const [registerMode, setRegisterMode] = useState(false);
  const [step, setStep] = useState(1); // 1: Profile Info, 2: Menu Builder

  // Restaurant details form
  const [restForm, setRestForm] = useState({
    name: '', cuisine: '', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    minOrder: 150, deliveryFee: 30, address: '', hours: '11:00 AM – 11:00 PM', menu: []
  });

  // Category and Item states for step 2
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [selectedCatIdx, setSelectedCatIdx] = useState(0);

  // Active Menu Item Builder Form
  const [itemForm, setItemForm] = useState({
    name: '', desc: '', price: '', veg: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
  });

  const handleStartRegistration = () => {
    if (!user) {
      alert('Please Login or Sign Up first to register a restaurant partner account.');
      openLogin();
      return;
    }
    setRegisterMode(true);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!restForm.name || !restForm.cuisine || !restForm.address) {
      alert('Please fill in Restaurant Name, Cuisines, and Address.');
      return;
    }
    setStep(2);
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    if (categories.some(c => c.category.toLowerCase() === newCatName.trim().toLowerCase())) {
      alert('Category already exists.');
      return;
    }
    const updated = [...categories, { category: newCatName.trim(), items: [] }];
    setCategories(updated);
    setSelectedCatIdx(updated.length - 1);
    setNewCatName('');
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price) {
      alert('Item Name and Price are required.');
      return;
    }
    const priceNum = parseFloat(itemForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Price must be a valid positive number.');
      return;
    }

    const updated = categories.map((cat, idx) => {
      if (idx === selectedCatIdx) {
        return {
          ...cat,
          items: [...cat.items, {
            ...itemForm,
            price: priceNum,
            id: 'item_' + Date.now() + Math.random().toString(36).slice(2, 5),
            rating: 4.5
          }]
        };
      }
      return cat;
    });

    setCategories(updated);
    setItemForm({
      name: '', desc: '', price: '', veg: true,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
    });
  };

  const handleDeleteItem = (catIdx, itemIdx) => {
    const updated = categories.map((cat, idx) => {
      if (idx === catIdx) {
        return { ...cat, items: cat.items.filter((_, i) => i !== itemIdx) };
      }
      return cat;
    });
    setCategories(updated);
  };

  const handleCompleteRegistration = () => {
    if (categories.length === 0 || categories.every(c => c.items.length === 0)) {
      alert('Please build your Menu Card and add at least one food item before submitting.');
      return;
    }

    // 1. Compile final restaurant object
    const newRestId = 'rest_partner_' + Date.now();
    const finalRest = {
      ...restForm,
      id: newRestId,
      rating: 4.5,
      time: '25 mins',
      dist: '1.2 KM',
      offer: 'Partner Launch Promo',
      tags: [restForm.name.toLowerCase(), ...restForm.cuisine.toLowerCase().split(',').map(c => c.trim())],
      foodTypes: categories.map(c => c.category),
      categories: categories.map(c => c.category),
      menu: categories,
      reviews: [{ name: 'System Review', rating: 5, date: 'Today', text: 'Congratulations on launching your restaurant with Swiggy!' }]
    };

    // 2. Fetch live list, append, and save
    const stored = localStorage.getItem('swiggy_restaurants');
    const liveList = stored ? JSON.parse(stored) : restaurants;
    const updatedList = [...liveList, finalRest];
    saveRestaurants(updatedList);

    // 3. Mark active user as Partner in users DB & active session
    updateUserProfile({
      isPartner: true,
      partnerRestaurantId: newRestId
    });

    // 4. Redirect to Partner Dashboard
    alert('Congratulations! Your restaurant has been successfully registered. You are being redirected to your Partner Control Panel.');
    navigate('/partner/dashboard');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <AnimatePresence mode="wait">
          {!registerMode ? (
            // Landing promo
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Hero header */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <span className="text-xs bg-orange-100 text-[#ff5200] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Swiggy Partners
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-none">
                  Grow your business with Swiggy
                </h1>
                <p className="text-slate-400 text-sm font-semibold leading-relaxed">
                  Join Indore's top food network. Register your restaurant outlet, upload your menus, set custom pricing, and start receiving orders from thousands of customers instantly!
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleStartRegistration}
                    className="bg-[#ff5200] hover:bg-[#e64a00] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 mx-auto shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    Register Your Restaurant <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Benefits cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {[
                  { title: '2x Volume Growth', desc: 'Reach thousands of gourmet food lovers across Indore with 24/7 delivery support.', icon: '📈' },
                  { title: 'Full Menu Controls', desc: 'Add categories, customize item descriptions, toggle veg labels, and edit pricing anytime.', icon: '🍔' },
                  { title: 'Direct Order Tracking', desc: 'Manage incoming orders, update packaging status, and coordinate live with delivery partners.', icon: '🛵' }
                ].map((card, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
                    <span className="text-3xl block">{card.icon}</span>
                    <h3 className="font-black text-slate-800 text-sm">{card.title}</h3>
                    <p className="text-slate-400 text-xs font-semibold leading-normal">{card.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Registration steps
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm space-y-8"
            >
              {/* Form header steps progress */}
              <div className="flex justify-between items-center border-b border-slate-50 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Restaurant Partner Setup</h2>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Register outlet profile and configure food menu card</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                  <span className={step === 1 ? 'text-[#ff5200]' : 'text-emerald-500'}>Step 1</span>
                  <ChevronRight size={12} />
                  <span className={step === 2 ? 'text-[#ff5200]' : ''}>Step 2</span>
                </div>
              </div>

              {step === 1 ? (
                // Step 1: Restaurant Profile Info
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Restaurant Outlet Name</label>
                      <input
                        type="text"
                        value={restForm.name}
                        onChange={(e) => setRestForm({ ...restForm, name: e.target.value })}
                        placeholder="e.g. Indore Chaat Cafe"
                        className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Cuisines (comma separated)</label>
                      <input
                        type="text"
                        value={restForm.cuisine}
                        onChange={(e) => setRestForm({ ...restForm, cuisine: e.target.value })}
                        placeholder="e.g. South Indian, Fast Food, Street Food"
                        className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Outlet Image URL</label>
                      <input
                        type="text"
                        value={restForm.image}
                        onChange={(e) => setRestForm({ ...restForm, image: e.target.value })}
                        placeholder="Enter direct image URL link"
                        className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Delivery Fee (₹)</label>
                        <input
                          type="number"
                          value={restForm.deliveryFee}
                          onChange={(e) => setRestForm({ ...restForm, deliveryFee: parseInt(e.target.value) || 0 })}
                          className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Min. Order Value (₹)</label>
                        <input
                          type="number"
                          value={restForm.minOrder}
                          onChange={(e) => setRestForm({ ...restForm, minOrder: parseInt(e.target.value) || 0 })}
                          className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Operating Hours</label>
                      <input
                        type="text"
                        value={restForm.hours}
                        onChange={(e) => setRestForm({ ...restForm, hours: e.target.value })}
                        placeholder="11:00 AM – 11:00 PM"
                        className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Outlet Complete Address</label>
                      <input
                        type="text"
                        value={restForm.address}
                        onChange={(e) => setRestForm({ ...restForm, address: e.target.value })}
                        placeholder="Outlet Address, Near Landmark, Vijay Nagar, Indore"
                        className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setRegisterMode(false)}
                      className="px-5 py-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#ff5200] hover:bg-[#e64a00] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                    >
                      Next: Build Menu <ChevronRight size={14} />
                    </button>
                  </div>
                </form>
              ) : (
                // Step 2: Menu Builder Details
                <div className="space-y-6">
                  
                  {/* Category Builder */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">1. Create Categories</h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">Add groupings like Starters, Main Course, Drinks</p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Starters"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-bold"
                      />
                      <button
                        onClick={handleAddCategory}
                        className="bg-black hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                      >
                        <PlusCircle size={12} /> Add
                      </button>
                    </div>
                  </div>

                  {categories.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Left: Category select pills */}
                      <div className="w-full lg:w-44 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2">
                        {categories.map((cat, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCategoryIdx(idx)}
                            className={`flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase border w-max lg:w-full flex-shrink-0 lg:flex-shrink ${
                              selectedCatIdx === idx
                                ? 'bg-slate-900 border-slate-900 text-white shadow'
                                : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            <span>{cat.category}</span>
                            <span className="text-[10px] bg-slate-200/50 text-slate-600 px-1.5 py-0.5 rounded font-black ml-2">
                              {cat.items.length}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Right: Food Item Form & Added lists for selected Category */}
                      <div className="flex-1 space-y-6">
                        
                        {/* Food Item Creator form */}
                        <form onSubmit={handleAddItem} className="bg-slate-50/50 p-4 border border-slate-100 rounded-3xl space-y-4">
                          <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest border-b border-slate-100 pb-2">
                            Add Item to: {categories[selectedCatIdx]?.category}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Food Item Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Masala Dosa"
                                value={itemForm.name}
                                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                className="px-3.5 py-2.5 w-full bg-white border border-slate-100 rounded-xl focus:outline-none text-xs font-semibold"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Price (₹)</label>
                                <input
                                  type="number"
                                  placeholder="99"
                                  value={itemForm.price}
                                  onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                                  className="px-3.5 py-2.5 w-full bg-white border border-slate-100 rounded-xl focus:outline-none text-xs font-semibold"
                                  required
                                />
                              </div>
                              <div className="space-y-1 flex flex-col justify-center items-center pt-3">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={itemForm.veg}
                                    onChange={(e) => setItemForm({ ...itemForm, veg: e.target.checked })}
                                    className="accent-green-600 w-4 h-4 rounded"
                                  />
                                  <span>Veg Only</span>
                                </label>
                              </div>
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Brief Description</label>
                              <input
                                type="text"
                                placeholder="Crispy crepe served with coconut chutney & sambhar..."
                                value={itemForm.desc}
                                onChange={(e) => setItemForm({ ...itemForm, desc: e.target.value })}
                                className="px-3.5 py-2.5 w-full bg-white border border-slate-100 rounded-xl focus:outline-none text-xs font-semibold"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="submit"
                              className="bg-black hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                            >
                              <PlusCircle size={14} /> Add Item to Menu
                            </button>
                          </div>
                        </form>

                        {/* List of currently added items in selected category */}
                        <div className="space-y-3">
                          <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-wider">Added items in this category:</h4>
                          {categories[selectedCatIdx]?.items && categories[selectedCatIdx].items.length > 0 ? (
                            categories[selectedCatIdx].items.map((item, itemIdx) => (
                              <div
                                key={item.id}
                                className="bg-white border border-slate-100 p-3 rounded-2xl flex items-center justify-between shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`w-2.5 h-2.5 border rounded-sm flex items-center justify-center ${item.veg ? 'border-green-600 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                                    <span className={`w-1 h-1 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-500'}`}></span>
                                  </span>
                                  <div>
                                    <h5 className="font-bold text-xs text-slate-800">{item.name}</h5>
                                    <p className="text-[10px] text-slate-400 font-bold">₹{item.price}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteItem(selectedCatIdx, itemIdx)}
                                  className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg cursor-pointer border-0"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-6 text-xs text-slate-400 font-semibold border border-dashed border-slate-200 rounded-2xl">
                              No items added to this category yet. Use the form above to add dishes.
                            </p>
                          )}
                        </div>

                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-lg">📁</div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">No menu categories created yet</p>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Please add a category (e.g. Breakfast, Mains) at the top of Step 2.</p>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Actions */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-50"
                    >
                      Back: Profile
                    </button>
                    <button
                      onClick={handleCompleteRegistration}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <Save size={14} /> Complete Registration
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
