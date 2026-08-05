import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { useCart } from '../context/CartContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { restaurants } from '../data/restaurants';
import { Heart, ShoppingCart, Star, Leaf, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Wishlist() {
  const { user, toggleWishlist } = useAuthModal();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [addedItems, setAddedItems] = useState({});

  // Route protection
  if (!user) {
    setTimeout(() => navigate('/login'), 0);
    return null;
  }

  const handleAddToCart = (item) => {
    // Find the original restaurant hosting this item
    const matchedRest = restaurants.find(r => 
      r.menu.some(sec => sec.items.some(i => i.id === item.id))
    ) || {
      id: item.restaurantId || 'nafees',
      name: item.restaurantName || 'Nafees Restaurant',
      deliveryFee: 30
    };

    const success = addToCart(item, matchedRest);
    if (success) {
      setAddedItems(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [item.id]: false }));
      }, 2000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          <DashboardSidebar />

          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm"
            >
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
              <p className="text-gray-400 text-xs font-semibold mt-1">Saved food items you love and want to order again</p>

              {user.wishlist && user.wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <AnimatePresence>
                    {user.wishlist.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border border-gray-100 rounded-3xl p-4 flex gap-4 hover:shadow-md hover:border-gray-200 transition-all relative"
                      >
                        {/* Heart icon button to remove */}
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="absolute top-3 right-3 bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors cursor-pointer border-0 z-10"
                          title="Remove from Wishlist"
                        >
                          <Heart size={16} fill="currentColor" />
                        </button>

                        {/* Food Image */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 z-10">
                            <span className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center bg-white/95 ${item.veg ? 'border-green-600' : 'border-red-500'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-500'}`}></span>
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h3 className="font-black text-gray-900 text-sm truncate pr-8">{item.name}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{item.restaurantName || 'Nafees Restaurant'}</p>
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="flex items-center gap-0.5 text-yellow-500 font-black">
                                <Star size={12} fill="currentColor" /> {item.rating || 4.5}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-900 font-black">₹{item.price}</span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center gap-2">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className={`flex-1 ${
                                addedItems[item.id]
                                  ? 'bg-green-500 text-white'
                                  : 'bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 hover:border-primary'
                              } font-black text-xs px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                            >
                              {addedItems[item.id] ? (
                                'Added!'
                              ) : (
                                <>
                                  <ShoppingCart size={12} /> Add to Cart
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-6 gap-3 mt-8">
                  <div className="w-16 h-16 bg-red-50 text-[#ff5200] rounded-full flex items-center justify-center text-2xl">❤️</div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg">Your Wishlist is empty</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Save your favorite dishes here to order them anytime.</p>
                  </div>
                  <Link to="/restaurants" className="bg-[#ff5200] hover:bg-[#e64a00] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all mt-3">
                    Explore Food Items
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
