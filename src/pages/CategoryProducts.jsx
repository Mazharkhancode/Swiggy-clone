import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, ChevronLeft, SlidersHorizontal, X } from 'lucide-react';
import { getRestaurantsByCategory } from '../data/restaurants';

const CATEGORY_META = {
  Biryani:       { emoji: '🍲', tagline: 'Aromatic, slow-cooked biryani from Indore\'s finest kitchens' },
  Pizza:         { emoji: '🍕', tagline: 'Cheesilicious pizzas to make every day extraordinary' },
  Burger:        { emoji: '🍔', tagline: 'Juicy stacked burgers and sliders from top-rated spots' },
  Cakes:         { emoji: '🎂', tagline: 'Freshly baked cakes and pastries delivered to your door' },
  Thali:         { emoji: '🍱', tagline: 'Wholesome thalis with all the flavors of India' },
  Rolls:         { emoji: '🌯', tagline: 'Freshly wrapped rolls stuffed with bold flavors' },
  Chinese:       { emoji: '🍜', tagline: 'Wok-tossed Indo-Chinese dishes you\'ll crave again and again' },
  Healthy:       { emoji: '🥗', tagline: 'Nutritious, fresh and balanced meals for a healthier you' },
  Desserts:      { emoji: '🍰', tagline: 'Sweet treats and desserts to satisfy every craving' },
  'South Indian':{ emoji: '🥞', tagline: 'Authentic Dosas, Idlis and more from South India\'s rich culinary heritage' },
};

const SORT_OPTIONS = [
  { label: 'Relevance', key: 'relevance' },
  { label: 'Delivery Time', key: 'time' },
  { label: 'Rating', key: 'rating' },
  { label: 'Cost: Low to High', key: 'priceLow' },
  { label: 'Cost: High to Low', key: 'priceHigh' },
];

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState('relevance');
  const [vegOnly, setVegOnly] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const meta = CATEGORY_META[categoryName] || { emoji: '🍽️', tagline: `Discover the best ${categoryName} in Indore` };

  const baseRestaurants = useMemo(() => getRestaurantsByCategory(categoryName), [categoryName]);

  const filtered = useMemo(() => {
    let list = [...baseRestaurants];
    if (vegOnly) {
      list = list.filter(r => r.menu.every(sec => sec.items.every(item => item.veg)));
    }
    if (freeDelivery) {
      list = list.filter(r => r.deliveryFee === 0);
    }
    list.sort((a, b) => {
      if (sortKey === 'rating') return b.rating - a.rating;
      if (sortKey === 'time') return parseInt(a.time) - parseInt(b.time);
      if (sortKey === 'priceLow') return a.minOrder - b.minOrder;
      if (sortKey === 'priceHigh') return b.minOrder - a.minOrder;
      return 0;
    });
    return list;
  }, [baseRestaurants, sortKey, vegOnly, freeDelivery]);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Page Header — minimal, like Swiggy */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-700 text-sm font-semibold mb-4 transition-colors bg-transparent border-0 cursor-pointer p-0">
          <ChevronLeft size={16} /> Home
        </button>

        <div className="flex items-center gap-3 mb-1">
          <span className="text-4xl">{meta.emoji}</span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">{categoryName}</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">{meta.tagline}</p>

        {/* Filter / Sort Toolbar — Swiggy style pill bar */}
        <div className="flex items-center gap-2 flex-wrap mb-2 border-b border-gray-100 pb-4">
          {/* Sort By dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 border border-gray-300 rounded-full px-4 py-2 text-sm font-bold text-gray-700 hover:border-gray-500 transition-all bg-white"
            >
              <SlidersHorizontal size={14} />
              Sort By
              <span className="text-[10px] text-primary font-black ml-1">
                {sortKey !== 'relevance' ? '•' : ''}
              </span>
            </button>

            {showSortMenu && (
              <div className="absolute left-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400">Sort By</span>
                  <button onClick={() => setShowSortMenu(false)}><X size={14} className="text-gray-400" /></button>
                </div>
                {SORT_OPTIONS.map(opt => (
                  <label
                    key={opt.key}
                    onClick={() => { setSortKey(opt.key); setShowSortMenu(false); }}
                    className="flex items-center justify-between py-2.5 cursor-pointer group"
                  >
                    <span className={`text-sm font-semibold transition-colors ${sortKey === opt.key ? 'text-primary font-black' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      {opt.label}
                    </span>
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${sortKey === opt.key ? 'border-primary' : 'border-gray-300'}`}>
                      {sortKey === opt.key && <span className="w-2 h-2 rounded-full bg-primary block"></span>}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Veg/Non-Veg Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-1.5 border rounded-full px-4 py-2 text-sm font-bold transition-all ${vegOnly ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-300 text-gray-700 bg-white hover:border-gray-500'}`}
          >
            <span className={`w-3 h-3 rounded-sm border-2 ${vegOnly ? 'border-green-600 bg-green-600' : 'border-gray-400'}`}></span>
            Veg Only
          </button>

          {/* Free Delivery Toggle */}
          <button
            onClick={() => setFreeDelivery(!freeDelivery)}
            className={`flex items-center gap-1.5 border rounded-full px-4 py-2 text-sm font-bold transition-all ${freeDelivery ? 'border-primary bg-orange-50 text-primary' : 'border-gray-300 text-gray-700 bg-white hover:border-gray-500'}`}
          >
            🚚 Free Delivery
          </button>
        </div>

        {/* Count */}
        <p className="text-base font-black text-gray-800 mt-4 mb-6">
          {filtered.length} Restaurant{filtered.length !== 1 ? 's' : ''} to explore
        </p>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-6xl mx-auto px-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-gray-700">No restaurants found</h3>
            <p className="text-gray-400 text-sm mt-2">Try clearing the filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((rest, i) => (
              <motion.div
                key={rest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/restaurant/${rest.id}`} className="group block">
                  {/* Cover Image */}
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-3">
                    <img
                      src={rest.image.replace('w=600', 'w=800')}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    {rest.offer && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                        <span className="text-white text-xs font-black">{rest.offer}</span>
                      </div>
                    )}
                    {rest.deliveryFee === 0 && (
                      <span className="absolute top-3 right-3 bg-white/90 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        Free Delivery
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="px-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-black text-gray-900 text-[15px] group-hover:text-primary transition-colors truncate pr-2">{rest.name}</h3>
                      <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-black px-2 py-0.5 rounded-lg flex-shrink-0">
                        <Star size={9} fill="white" /> {rest.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-semibold mb-1 truncate">{rest.cuisine}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold border-t border-gray-100 pt-2 mt-2">
                      <span className="flex items-center gap-1"><Clock size={11} />{rest.time}</span>
                      <span className="text-gray-200">•</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />{rest.dist}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Click-outside to close sort dropdown */}
      {showSortMenu && (
        <div className="fixed inset-0 z-20" onClick={() => setShowSortMenu(false)}></div>
      )}
    </div>
  );
}
