import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { restaurants, saveRestaurants } from '../../data/restaurants';
import { Search, Plus, Edit2, Trash2, X, Save, Eye, ArrowLeft, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminRestaurants() {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Editors state
  const [editMode, setEditMode] = useState(false); // true if editing or adding
  const [activeRest, setActiveRest] = useState(null); // null means adding new restaurant
  
  // Restaurant Form State
  const [restForm, setRestForm] = useState({
    name: '', cuisine: '', image: '', rating: 4.5, time: '30 mins',
    dist: '2.5 KM', offer: '', minOrder: 150, deliveryFee: 30,
    address: '', hours: '11:00 AM – 11:00 PM', menu: []
  });

  // Active category select in Menu Editor
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Menu Item Form State
  const [itemForm, setItemForm] = useState({
    name: '', desc: '', price: '', rating: 4.5, veg: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
  });
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemIdx, setEditingItemIdx] = useState(null); // null means adding

  useEffect(() => {
    const stored = localStorage.getItem('swiggy_restaurants');
    setList(stored ? JSON.parse(stored) : restaurants);
  }, []);

  const persistChange = (newList) => {
    setList(newList);
    saveRestaurants(newList);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtered = list.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteRestaurant = (id) => {
    if (confirm('Are you sure you want to delete this restaurant? This will remove all its menus and cannot be undone.')) {
      const updated = list.filter(r => r.id !== id);
      persistChange(updated);
    }
  };

  const handleOpenAdd = () => {
    setActiveRest(null);
    setRestForm({
      name: '', cuisine: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
      rating: 4.5, time: '30 mins', dist: '2.5 KM', offer: '20% OFF', minOrder: 150, deliveryFee: 30,
      address: '', hours: '11:00 AM – 11:00 PM', menu: []
    });
    setSelectedCategoryIdx(0);
    setEditMode(true);
  };

  const handleOpenEdit = (rest) => {
    setActiveRest(rest);
    setRestForm({ ...rest, menu: rest.menu ? JSON.parse(JSON.stringify(rest.menu)) : [] }); // Deep clone menu
    setSelectedCategoryIdx(0);
    setEditMode(true);
  };

  const handleSaveRestaurant = (e) => {
    e.preventDefault();
    if (!restForm.name || !restForm.cuisine || !restForm.address) {
      alert('Name, Cuisine, and Address are required.');
      return;
    }

    let updatedList;
    if (activeRest) {
      // Editing
      updatedList = list.map(r => r.id === activeRest.id ? { ...r, ...restForm } : r);
    } else {
      // Adding new
      const newRest = {
        ...restForm,
        id: 'rest_' + Date.now(),
        tags: [restForm.name.toLowerCase(), ...restForm.cuisine.toLowerCase().split(',').map(c => c.trim())],
        foodTypes: restForm.menu && restForm.menu.length > 0 ? [restForm.menu[0].category] : ['Healthy']
      };
      updatedList = [...list, newRest];
    }
    
    persistChange(updatedList);
    setEditMode(false);
  };

  // Menu Category Operations
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const catExists = restForm.menu.some(c => c.category.toLowerCase() === newCategoryName.trim().toLowerCase());
    if (catExists) {
      alert('Category already exists.');
      return;
    }
    const updatedMenu = [...restForm.menu, { category: newCategoryName.trim(), items: [] }];
    setRestForm({ ...restForm, menu: updatedMenu });
    setSelectedCategoryIdx(updatedMenu.length - 1);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (idx) => {
    if (confirm('Delete category and all its items?')) {
      const updatedMenu = restForm.menu.filter((_, i) => i !== idx);
      setRestForm({ ...restForm, menu: updatedMenu });
      setSelectedCategoryIdx(0);
    }
  };

  // Menu Item Operations
  const openItemAdd = () => {
    setEditingItemIdx(null);
    setItemForm({
      name: '', desc: '', price: '', rating: 4.5, veg: true,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
    });
    setShowItemModal(true);
  };

  const openItemEdit = (item, idx) => {
    setEditingItemIdx(idx);
    setItemForm({ ...item });
    setShowItemModal(true);
  };

  const handleSaveItem = (e) => {
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

    const activeCategory = restForm.menu[selectedCategoryIdx];
    if (!activeCategory) return;

    let updatedItems = [...activeCategory.items];
    const itemData = {
      ...itemForm,
      price: priceNum,
      id: itemForm.id || 'item_' + Date.now()
    };

    if (editingItemIdx !== null) {
      // Editing
      updatedItems[editingItemIdx] = itemData;
    } else {
      // Adding
      updatedItems.push(itemData);
    }

    const updatedMenu = restForm.menu.map((cat, idx) =>
      idx === selectedCategoryIdx ? { ...cat, items: updatedItems } : cat
    );

    setRestForm({ ...restForm, menu: updatedMenu });
    setShowItemModal(false);
  };

  const handleDeleteItem = (itemIdx) => {
    if (confirm('Delete this food item?')) {
      const activeCategory = restForm.menu[selectedCategoryIdx];
      const updatedItems = activeCategory.items.filter((_, i) => i !== itemIdx);
      const updatedMenu = restForm.menu.map((cat, idx) =>
        idx === selectedCategoryIdx ? { ...cat, items: updatedItems } : cat
      );
      setRestForm({ ...restForm, menu: updatedMenu });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          <AdminSidebar />

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {!editMode ? (
                // Restaurant list page
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-50 pb-5">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Manage Restaurants</h1>
                      <p className="text-gray-400 text-xs font-semibold mt-1">Configure restaurant profiles and food catalogs</p>
                    </div>
                    <button
                      onClick={handleOpenAdd}
                      className="bg-[#ff5200] hover:bg-[#e64a00] text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer h-fit"
                    >
                      <Plus size={16} /> Add Restaurant
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search by restaurant name or cuisine..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="pl-10 pr-4 py-3 w-full bg-slate-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                    />
                  </div>

                  {/* Catalog list */}
                  <div className="space-y-4">
                    {filtered.length > 0 ? (
                      filtered.map((rest, idx) => (
                        <div
                          key={rest.id}
                          className="border border-slate-100 rounded-3xl p-4 md:p-5 bg-white flex flex-col sm:flex-row gap-5 items-center hover:border-orange-100 hover:shadow-md transition-all justify-between"
                        >
                          <div className="flex items-center gap-4 self-start sm:self-auto">
                            <img src={rest.image} alt={rest.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-50" />
                            <div>
                              <h4 className="font-black text-slate-800 text-sm">{rest.name}</h4>
                              <p className="text-slate-400 text-[10px] font-semibold mt-0.5">{rest.cuisine}</p>
                              <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-500">
                                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded">★ {rest.rating}</span>
                                <span>•</span>
                                <span>{rest.menu ? rest.menu.length : 0} Categories</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2.5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 justify-end">
                            <button
                              onClick={() => handleOpenEdit(rest)}
                              className="flex items-center gap-1 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
                            >
                              <Edit2 size={12} /> Edit Catalog
                            </button>
                            <button
                              onClick={() => handleDeleteRestaurant(rest.id)}
                              className="flex items-center gap-1 border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50/50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 gap-3">
                        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-xl">🏬</div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">No restaurants found</p>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">Try searching with another name or add a new restaurant.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                // Add / Edit Restaurant & Menu Layout
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-black uppercase tracking-wider bg-white px-4 py-2.5 border border-slate-100 rounded-2xl shadow-sm cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back to Catalog
                  </button>

                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                        {activeRest ? `Edit: ${activeRest.name}` : 'Add Restaurant'}
                      </h2>
                      <p className="text-gray-400 text-xs font-semibold mt-1">Configure profile details and complete menu card</p>
                    </div>

                    <form onSubmit={handleSaveRestaurant} className="space-y-6">
                      
                      {/* Grid fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Restaurant Name</label>
                          <input
                            type="text"
                            value={restForm.name}
                            onChange={(e) => setRestForm({ ...restForm, name: e.target.value })}
                            placeholder="e.g. Johny Hot Dog"
                            className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Cuisines (comma separated)</label>
                          <input
                            type="text"
                            value={restForm.cuisine}
                            onChange={(e) => setRestForm({ ...restForm, cuisine: e.target.value })}
                            placeholder="e.g. Mughlai, Biryani, Indian"
                            className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Image URL</label>
                          <input
                            type="text"
                            value={restForm.image}
                            onChange={(e) => setRestForm({ ...restForm, image: e.target.value })}
                            placeholder="Enter image web link"
                            className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Rating</label>
                            <input
                              type="number"
                              step="0.1"
                              min="1"
                              max="5"
                              value={restForm.rating}
                              onChange={(e) => setRestForm({ ...restForm, rating: parseFloat(e.target.value) || 4.5 })}
                              className="px-3 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold text-center"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Time</label>
                            <input
                              type="text"
                              value={restForm.time}
                              onChange={(e) => setRestForm({ ...restForm, time: e.target.value })}
                              placeholder="30 mins"
                              className="px-3 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold text-center"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Distance</label>
                            <input
                              type="text"
                              value={restForm.dist}
                              onChange={(e) => setRestForm({ ...restForm, dist: e.target.value })}
                              placeholder="2.5 KM"
                              className="px-3 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold text-center"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Offer Badge Text</label>
                          <input
                            type="text"
                            value={restForm.offer}
                            onChange={(e) => setRestForm({ ...restForm, offer: e.target.value })}
                            placeholder="e.g. 50% OFF up to ₹100"
                            className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Min. Order (₹)</label>
                            <input
                              type="number"
                              value={restForm.minOrder}
                              onChange={(e) => setRestForm({ ...restForm, minOrder: parseInt(e.target.value) || 0 })}
                              className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Delivery Fee (₹)</label>
                            <input
                              type="number"
                              value={restForm.deliveryFee}
                              onChange={(e) => setRestForm({ ...restForm, deliveryFee: parseInt(e.target.value) || 0 })}
                              className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Outlet Address</label>
                          <input
                            type="text"
                            value={restForm.address}
                            onChange={(e) => setRestForm({ ...restForm, address: e.target.value })}
                            placeholder="Complete physical address of the restaurant"
                            className="px-4 py-3 w-full bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                          />
                        </div>
                      </div>

                      <hr className="border-slate-50" />

                      {/* Deep Menu Editor */}
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-50 pb-3 gap-2">
                          <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Menu Cards Editor</h3>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="New category (e.g. Starters)"
                              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff5200] text-xs font-bold"
                            />
                            <button
                              type="button"
                              onClick={handleAddCategory}
                              className="bg-black hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={12} /> Category
                            </button>
                          </div>
                        </div>

                        {restForm.menu && restForm.menu.length > 0 ? (
                          <div className="flex flex-col lg:flex-row gap-6">
                            
                            {/* Left: Category Pills */}
                            <div className="w-full lg:w-48 space-y-1 flex-shrink-0 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 lg:gap-0">
                              {restForm.menu.map((cat, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setSelectedCategoryIdx(index)}
                                  className={`flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase border w-max lg:w-full flex-shrink-0 lg:flex-shrink ${
                                    selectedCategoryIdx === index
                                      ? 'bg-slate-900 border-slate-900 text-white'
                                      : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{cat.category}</span>
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCategory(index);
                                    }}
                                    className="ml-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 p-0.5 rounded transition-all inline-block print:hidden"
                                    title="Delete category"
                                  >
                                    <X size={10} />
                                  </span>
                                </button>
                              ))}
                            </div>

                            {/* Right: Items list of selected category */}
                            <div className="flex-1 space-y-4 border border-slate-100 p-4 rounded-3xl bg-slate-50/50">
                              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">
                                  Category: {restForm.menu[selectedCategoryIdx]?.category}
                                </h4>
                                <button
                                  type="button"
                                  onClick={openItemAdd}
                                  className="text-xs font-black text-[#ff5200] hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-0"
                                >
                                  <PlusCircle size={14} /> Add Item
                                </button>
                              </div>

                              <div className="space-y-3">
                                {restForm.menu[selectedCategoryIdx]?.items && restForm.menu[selectedCategoryIdx].items.length > 0 ? (
                                  restForm.menu[selectedCategoryIdx].items.map((item, itemIdx) => (
                                    <div
                                      key={item.id || itemIdx}
                                      className="bg-white border border-slate-100 p-3.5 rounded-2xl flex gap-3 items-center justify-between shadow-sm hover:border-slate-200 transition-all"
                                    >
                                      <div className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-slate-50" />
                                        <div>
                                          <div className="flex items-center gap-1.5">
                                            <span className={`w-2.5 h-2.5 border rounded-sm flex items-center justify-center ${item.veg ? 'border-green-600 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                                              <span className={`w-1 h-1 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-500'}`}></span>
                                            </span>
                                            <h5 className="font-bold text-xs text-slate-800">{item.name}</h5>
                                          </div>
                                          <p className="text-[10px] text-slate-400 font-bold mt-1">₹{item.price}</p>
                                        </div>
                                      </div>

                                      <div className="flex gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => openItemEdit(item, itemIdx)}
                                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 cursor-pointer border-0"
                                        >
                                          <Edit2 size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteItem(itemIdx)}
                                          className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 cursor-pointer border-0"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-center py-6 text-xs text-slate-400 font-semibold border border-dashed border-slate-200 rounded-2xl">
                                    No items in this category yet. Click Add Item to populate.
                                  </p>
                                )}
                              </div>

                            </div>

                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 font-semibold py-8 text-center border border-dashed border-slate-200 rounded-3xl">
                            Please create your first Category using the builder above.
                          </p>
                        )}
                      </div>

                      {/* Main Restaurant Actions */}
                      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-5 py-3 border border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#ff5200] hover:bg-[#e64a00] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                        >
                          <Save size={14} /> Save Catalog
                        </button>
                      </div>

                    </form>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Add / Edit Menu Item Dialog Modal */}
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
                <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tight">
                  {editingItemIdx !== null ? 'Edit Food Item' : 'Add Food Item'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full cursor-pointer border-0"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Item Name</label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    placeholder="e.g. Chicken Tandoori Kebab"
                    className="px-4 py-2.5 w-full bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Description</label>
                  <input
                    type="text"
                    value={itemForm.desc}
                    onChange={(e) => setItemForm({ ...itemForm, desc: e.target.value })}
                    placeholder="Short description of taste, ingredients..."
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
                      placeholder="e.g. 199"
                      className="px-4 py-2.5 w-full bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Food Type</label>
                    <div className="flex gap-2 h-10 items-center">
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
                    className="flex-1 border border-slate-200 text-slate-500 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#ff5200] hover:bg-[#e64a00] text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    Apply Item
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
