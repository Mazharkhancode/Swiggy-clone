import { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, MapPin, Phone, ChevronLeft, Search, Plus, Minus, ShoppingCart, ChevronDown, Heart } from 'lucide-react';
import api from '../utils/api';
import { restaurants } from '../data/restaurants';
import { useCart } from '../context/CartContext';
import { useAuthModal } from '../context/AuthModalContext';

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cartItems, addToCart, removeFromCart, replaceCartPrompt, confirmReplaceCart, cancelReplaceCart, cartCount } = useCart();
  const { user, toggleWishlist } = useAuthModal();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        // Attempt to fetch from database
        const response = await api.get(`/restaurants/${id}`);
        if (response.data && response.data.restaurant) {
          const resData = response.data;
          
          // Group flat menu items by category for frontend UI compatibility
          const groupedMenu = [];
          const categories = [];

          if (resData.menu && Array.isArray(resData.menu)) {
            resData.menu.forEach(item => {
              let catObj = groupedMenu.find(g => g.category === item.category);
              if (!catObj) {
                catObj = { category: item.category, items: [] };
                groupedMenu.push(catObj);
                categories.push(item.category);
              }
              catObj.items.push({
                id: item._id,
                name: item.name,
                desc: item.description || '',
                price: item.price,
                rating: 4.5,
                veg: item.isVeg,
                image: item.image,
                variants: [],
                addons: []
              });
            });
          }

          const normalizedRestaurant = {
            id: resData.restaurant._id,
            name: resData.restaurant.name,
            cuisine: Array.isArray(resData.restaurant.cuisine) ? resData.restaurant.cuisine.join(', ') : resData.restaurant.cuisine,
            rating: resData.restaurant.rating || 4.5,
            time: `${resData.restaurant.deliveryTime || 30} mins`,
            dist: '2.5 KM',
            deliveryFee: 0,
            address: `${resData.restaurant.address.street}, ${resData.restaurant.address.city}`,
            hours: '11:00 AM – 11:00 PM',
            image: resData.restaurant.image,
            offer: resData.restaurant.costForTwo ? `₹${resData.restaurant.costForTwo} For Two` : '10% OFF',
            categories: categories,
            menu: groupedMenu,
            reviews: []
          };
          
          setRestaurant(normalizedRestaurant);
        } else {
          // Fallback to static if no restaurant returned
          const staticMatch = restaurants.find(r => r.id === id);
          setRestaurant(staticMatch);
        }
      } catch (err) {
        console.error('Error fetching restaurant details, falling back to static data', err);
        const staticMatch = restaurants.find(r => r.id === id);
        setRestaurant(staticMatch);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const cartLookup = useMemo(() => {
    const lookup = {};
    cartItems.forEach(cartItem => {
      lookup[cartItem.item.id] = cartItem.quantity;
    });
    return lookup;
  }, [cartItems]);

  const [activeTab, setActiveTab] = useState(0);
  const [menuSearch, setMenuSearch] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const sectionRefs = useRef([]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-2xl font-black text-gray-800">Restaurant not found</h2>
        <p className="text-gray-500 mt-2 mb-6">The restaurant you're looking for doesn't exist.</p>
        <Link to="/restaurants" className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-orange-600 transition-colors">
          Browse Restaurants
        </Link>
      </div>
    );
  }



  const scrollToSection = (idx) => {
    setActiveTab(idx);
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredMenu = restaurant.menu.map(section => ({
    ...section,
    items: section.items.filter(item =>
      !menuSearch || item.name.toLowerCase().includes(menuSearch.toLowerCase()) || item.desc.toLowerCase().includes(menuSearch.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const avgRating = restaurant.rating;
  const totalReviews = restaurant.reviews.length;

  return (
    <div className="bg-gray-50 min-h-screen pb-28">
      {/* Restaurant Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <img src={restaurant.image.replace('w=600', 'w=1200').replace('q=80', 'q=90')} alt={restaurant.name} className="w-full h-full object-cover object-center" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-all border-0 cursor-pointer">
          <ChevronLeft size={20} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white">{restaurant.name}</h1>
          <p className="text-sm text-gray-200 mt-0.5">{restaurant.cuisine}</p>
          <div className="flex items-center flex-wrap gap-3 mt-3">
            <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-black px-2.5 py-1 rounded-lg">
              <Star size={10} fill="white" /> {restaurant.rating}
            </span>
            <span className="flex items-center gap-1 text-white/80 text-xs font-semibold">
              <Clock size={12} /> {restaurant.time}
            </span>
            <span className="flex items-center gap-1 text-white/80 text-xs font-semibold">
              <MapPin size={12} /> {restaurant.dist}
            </span>
            {restaurant.deliveryFee === 0
              ? <span className="text-green-400 text-xs font-black">Free Delivery</span>
              : <span className="text-white/70 text-xs font-semibold">Delivery ₹{restaurant.deliveryFee}</span>
            }
          </div>
        </div>
      </div>

      {/* Info Row */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-4 text-xs text-gray-500 font-semibold">
          <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" />{restaurant.address}</span>
          <span className="flex items-center gap-1"><Clock size={12} className="text-primary" />Open: {restaurant.hours}</span>
          {restaurant.offer && <span className="bg-orange-50 text-primary font-black px-2 py-0.5 rounded-full border border-orange-200">{restaurant.offer}</span>}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* Menu Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={menuSearch}
            onChange={e => setMenuSearch(e.target.value)}
            placeholder={`Search in ${restaurant.name}'s menu...`}
            className="w-full bg-white pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {restaurant.categories.map((cat, idx) => (
            <button
              key={cat}
              onClick={() => scrollToSection(idx)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black border transition-all ${activeTab === idx ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
            >{cat}</button>
          ))}
          <button
            onClick={() => setShowReviews(!showReviews)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black border transition-all ${showReviews ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
          >
            Reviews ({totalReviews})
          </button>
        </div>

        {/* Reviews Panel */}
        <AnimatePresence>
          {showReviews && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl font-black text-gray-900">{avgRating}</div>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={16} className={s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 font-semibold">{totalReviews} customer reviews</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {restaurant.reviews.map((rev, i) => (
                    <div key={i} className="border-b border-gray-50 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-sm text-gray-800">{rev.name}</span>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={11} className={s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Sections */}
        {filteredMenu.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 font-semibold">No items found for "{menuSearch}"</p>
          </div>
        ) : (
          filteredMenu.map((section, sIdx) => (
            <div key={section.category} ref={el => sectionRefs.current[sIdx] = el} className="mb-10">
              <h2 className="text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">{section.category}</h2>
              <div className="space-y-4">
                {section.items.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <Link to={`/product/${item.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${item.veg ? 'border-green-600' : 'border-red-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-500'}`}></span>
                        </span>
                        <span className={`text-[10px] font-black uppercase ${item.veg ? 'text-green-600' : 'text-red-500'}`}>{item.veg ? 'Veg' : 'Non-Veg'}</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-yellow-500 font-bold ml-auto">
                          <Star size={9} fill="currentColor" /> {item.rating}
                        </span>
                      </div>
                      <h3 className="font-black text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
                      <p className="text-base font-black text-gray-900 mt-2">₹{item.price}</p>
                    </Link>

                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-inner">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        {user && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist({ ...item, restaurantId: restaurant.id, restaurantName: restaurant.name });
                            }}
                            className="absolute top-1 right-1 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 p-1.5 rounded-full transition-all cursor-pointer shadow-sm border-0 z-10"
                            title="Toggle Wishlist"
                          >
                            <Heart 
                              size={12} 
                              className={user.wishlist?.some(i => i.id === item.id) ? 'text-red-500 fill-red-500' : 'text-gray-500'} 
                            />
                          </button>
                        )}
                      </div>
                      {cartLookup[item.id] ? (
                        <div className="flex items-center gap-2 bg-[#ff5200] rounded-xl px-2 py-1">
                          <button onClick={() => removeFromCart(item.id)} className="text-white"><Minus size={14} /></button>
                          <span className="text-white font-black text-sm w-4 text-center">{cartLookup[item.id]}</span>
                          <button onClick={() => addToCart(item, restaurant)} className="text-white"><Plus size={14} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item, restaurant)}
                          className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 hover:border-primary font-black text-xs px-5 py-1.5 rounded-xl transition-all"
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
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
              <p className="text-xs text-gray-505 font-semibold mb-6 leading-relaxed">
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
