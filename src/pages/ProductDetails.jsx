import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, Plus, Minus, ShoppingCart, Leaf, Clock, CheckCircle2, Heart } from 'lucide-react';
import { getItemById, restaurants } from '../data/restaurants';
import { useCart } from '../context/CartContext';
import { useAuthModal } from '../context/AuthModalContext';

export default function ProductDetails() {
  const { id } = useParams();
  const item = getItemById(id);

  const { addToCart, replaceCartPrompt, confirmReplaceCart, cancelReplaceCart, cartCount } = useCart();
  const { user, toggleWishlist } = useAuthModal();
  const [selectedVariant, setSelectedVariant] = useState(item?.variants?.[0] ?? null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Retrieve restaurant hosting this item
  const restaurant = restaurants.find(r => 
    r.menu.some(sec => sec.items.some(i => i.id === id))
  );

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-2xl font-black text-gray-800">Item not found</h2>
        <p className="text-gray-500 mt-2 mb-6">We couldn't find this product.</p>
        <Link to="/restaurants" className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-orange-600 transition-colors">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const variantExtra = selectedVariant?.extra ?? 0;
  const addonTotal = selectedAddons.reduce((sum, ao) => sum + ao.price, 0);
  const basePrice = item.price + variantExtra + addonTotal;
  const totalPrice = basePrice * qty;

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.label === addon.label)
        ? prev.filter(a => a.label !== addon.label)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    if (!restaurant) return;
    const customizedItem = {
      ...item,
      name: `${item.name}${selectedVariant ? ` (${selectedVariant.label})` : ''}${selectedAddons.length > 0 ? ` + ${selectedAddons.map(a => a.label).join(', ')}` : ''}`,
      price: basePrice
    };
    
    let added = false;
    for (let i = 0; i < qty; i++) {
      added = addToCart(customizedItem, restaurant);
      if (!added) break; // Replace cart popup triggered
    }

    if (added) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    }
  };

  // Related: other items in same restaurant (different from current)
  const relatedItems = restaurant
    ? restaurant.menu.flatMap(s => s.items).filter(i => i.id !== id).slice(0, 4)
    : [];

  return (
    <div className="bg-gray-50 min-h-screen pb-28">
      {/* Back navigation */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link to={`/restaurant/${item.restaurantId}`} className="text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h2 className="font-black text-gray-900 text-sm">{item.name}</h2>
            <p className="text-xs text-gray-400 font-semibold">{item.restaurantName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden shadow-xl aspect-square"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border ${item.veg ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                  {item.veg ? <><Leaf size={10} /> Pure Veg</> : '🍖 Non-Veg'}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-black px-3 py-1.5 rounded-full">
                <Star size={11} fill="currentColor" className="text-yellow-400" /> {item.rating}
              </div>
            </motion.div>

            {/* Restaurant quick link */}
            <Link
              to={`/restaurant/${item.restaurantId}`}
              className="mt-4 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg">🏪</div>
              <div>
                <p className="text-xs text-gray-400 font-semibold">Sold by</p>
                <p className="text-sm font-black text-gray-800 group-hover:text-primary transition-colors">{item.restaurantName}</p>
              </div>
              <div className="ml-auto flex items-center gap-1 bg-green-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">
                <Star size={9} fill="white" /> {item.restaurantRating}
              </div>
            </Link>
          </div>

          {/* Right: Details & Customization */}
          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">{item.name}</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>

              {/* Price Display */}
              <div className="bg-gradient-to-r from-primary/10 to-orange-50 border border-primary/20 rounded-2xl px-5 py-4 mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-900">₹{totalPrice}</span>
                  {qty > 1 && <span className="text-sm text-gray-500 mb-1">({qty} × ₹{basePrice})</span>}
                </div>
                {(variantExtra > 0 || addonTotal > 0) && (
                  <p className="text-xs text-primary font-semibold mt-1">
                    Base ₹{item.price}{variantExtra > 0 ? ` + Size ₹${variantExtra}` : ''}{addonTotal > 0 ? ` + Add-ons ₹${addonTotal}` : ''}
                  </p>
                )}
              </div>

              {/* Variant Selector */}
              {item.variants?.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-black text-gray-800 text-sm mb-3">Choose Size / Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.variants.map(v => (
                      <button
                        key={v.label}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${selectedVariant?.label === v.label ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-primary'}`}
                      >
                        {v.label} {v.extra > 0 && <span className="opacity-70">(+₹{v.extra})</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons Selector */}
              {item.addons?.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-black text-gray-800 text-sm mb-3">Add-ons <span className="font-medium text-gray-400">(Optional)</span></h3>
                  <div className="space-y-2">
                    {item.addons.map(ao => {
                      const isSelected = selectedAddons.find(a => a.label === ao.label);
                      return (
                        <label
                          key={ao.label}
                          onClick={() => toggleAddon(ao)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                              {isSelected && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{ao.label}</span>
                          </div>
                          <span className={`text-xs font-black ${ao.price === 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            {ao.price === 0 ? 'Free' : `+₹${ao.price}`}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-black text-sm text-gray-700">Quantity</span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-all">
                    <Minus size={14} />
                  </button>
                  <span className="font-black text-gray-900 w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-all">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button Row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="w-full bg-green-500 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 h-[56px]"
                      >
                        <CheckCircle2 size={20} /> Added to Cart!
                      </motion.div>
                    ) : (
                      <motion.button
                        key="add"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={handleAddToCart}
                        className="w-full bg-primary hover:bg-orange-600 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all h-[56px] cursor-pointer"
                      >
                        <ShoppingCart size={20} /> Add to Cart — ₹{totalPrice}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                
                {user && (
                  <button
                    onClick={() => toggleWishlist({ ...item, restaurantId: restaurant?.id || 'nafees', restaurantName: restaurant?.name || 'Restaurant' })}
                    className="p-4 rounded-2xl border-2 border-gray-150 hover:border-red-200 text-gray-500 hover:text-red-500 hover:bg-red-50/20 transition-all flex items-center justify-center cursor-pointer aspect-square w-[56px] h-[56px] flex-shrink-0"
                    title="Toggle Wishlist"
                  >
                    <Heart 
                      size={24} 
                      className={user.wishlist?.some(i => i.id === item.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} 
                    />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-black text-gray-900 mb-5">More from {item.restaurantName}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedItems.map(related => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="h-32 overflow-hidden">
                    <img src={related.image} alt={related.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-black text-gray-800 group-hover:text-primary transition-colors line-clamp-1">{related.name}</h4>
                    <p className="text-sm font-black text-gray-900 mt-1">₹{related.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Cart Bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <Link to="/cart" className="max-w-5xl mx-auto bg-primary text-white flex items-center justify-between px-6 py-4 rounded-2xl shadow-2xl shadow-primary/30 block">
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-white font-black text-xs w-7 h-7 rounded-full flex items-center justify-center">{cartCount}</span>
                <span className="font-black">View Cart</span>
              </div>
              <ShoppingCart size={20} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replace Cart Confirmation Modal */}
      <AnimatePresence>
        {replaceCartPrompt.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center"
            >
              <h3 className="text-lg font-black text-gray-900 mb-2">Replace cart items?</h3>
              <p className="text-xs text-gray-500 font-semibold mb-6 leading-relaxed">
                Your cart contains dishes from another restaurant. Do you want to discard your selections and add this dish?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmReplaceCart}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-orange-600 transition-colors"
                >
                  Yes, Replace
                </button>
                <button
                  onClick={cancelReplaceCart}
                  className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
