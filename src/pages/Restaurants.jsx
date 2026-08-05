import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Clock, MapPin, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { restaurants } from '../data/restaurants';

const SORT_OPTIONS = [
  { label: 'Popularity', key: 'popularity' },
  { label: 'Rating (High to Low)', key: 'rating' },
  { label: 'Delivery Time', key: 'time' },
  { label: 'Price: Low to High', key: 'priceLow' },
  { label: 'Price: High to Low', key: 'priceHigh' },
];

const CUISINE_FILTERS = ['All', 'North Indian', 'Biryani', 'Fast Food', 'Bakery', 'Italian', 'Chaat'];
const RATING_FILTERS = ['All', '4.0+', '4.5+'];

export default function Restaurants() {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('popularity');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...restaurants];

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.tags.some(t => t.includes(q))
      );
    }

    // Cuisine filter
    if (selectedCuisine !== 'All') {
      list = list.filter(r => r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase()));
    }

    // Rating filter
    if (selectedRating !== 'All') {
      const minRating = parseFloat(selectedRating);
      list = list.filter(r => r.rating >= minRating);
    }

    // Veg only
    if (vegOnly) {
      list = list.filter(r =>
        r.menu.every(sec => sec.items.every(item => item.veg))
      );
    }

    // Free delivery
    if (freeDelivery) {
      list = list.filter(r => r.deliveryFee === 0);
    }

    // Sort
    list.sort((a, b) => {
      if (sortKey === 'rating') return b.rating - a.rating;
      if (sortKey === 'time') return parseInt(a.time) - parseInt(b.time);
      if (sortKey === 'priceLow') return a.minOrder - b.minOrder;
      if (sortKey === 'priceHigh') return b.minOrder - a.minOrder;
      return 0; // popularity = original order
    });

    return list;
  }, [query, sortKey, selectedCuisine, selectedRating, vegOnly, freeDelivery]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Cuisines</h4>
        <div className="flex flex-wrap gap-2">
          {CUISINE_FILTERS.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCuisine === c ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
            >{c}</button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Rating</h4>
        <div className="flex flex-wrap gap-2">
          {RATING_FILTERS.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRating(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedRating === r ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
            >{r}</button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Preferences</h4>
        <div className="space-y-2.5">
          {[
            { label: '🥦 Pure Veg Only', state: vegOnly, setter: setVegOnly },
            { label: '🚚 Free Delivery', state: freeDelivery, setter: setFreeDelivery },
          ].map(pref => (
            <label key={pref.label} className="flex items-center gap-3 cursor-pointer select-none group">
              <div
                onClick={() => pref.setter(!pref.state)}
                className={`w-10 h-5 rounded-full transition-all relative ${pref.state ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${pref.state ? 'right-0.5' : 'left-0.5'}`}></span>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Top Hero */}
      <div className="bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Restaurants in <span className="text-primary">Indore</span></h1>
          <p className="text-gray-400 text-sm mb-6">Explore the best local flavors, from Indori chaat to Mughlai feasts</p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search restaurants, cuisines..."
              className="w-full bg-white pl-11 pr-4 py-3.5 rounded-2xl shadow-lg text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-primary/40"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Sort Bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Sort:</span>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${sortKey === opt.key ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}
              >{opt.label}</button>
            ))}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded-full hover:border-primary transition-all"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 sticky top-24">
              <h3 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary" /> Filters
              </h3>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-40 flex items-end">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)}></div>
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                className="relative bg-white w-full rounded-t-3xl p-6 shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-black text-gray-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)}><X size={20} /></button>
                </div>
                <FilterPanel />
                <button onClick={() => setShowFilters(false)} className="mt-6 w-full bg-primary text-white font-extrabold py-3 rounded-2xl">Apply Filters</button>
              </motion.div>
            </div>
          )}

          {/* Restaurant Grid */}
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-semibold mb-4">{filtered.length} restaurants found</p>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-black text-gray-700">No restaurants found</h3>
                <p className="text-gray-400 text-sm mt-1">Try clearing filters or searching something else.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((rest, i) => (
                  <motion.div
                    key={rest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link to={`/restaurant/${rest.id}`} className="group block bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={rest.image.replace('w=600', 'w=800')}
                          alt={rest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        {rest.offer && (
                          <span className="absolute bottom-3 left-3 bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            {rest.offer}
                          </span>
                        )}
                        {rest.deliveryFee === 0 && (
                          <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            Free Delivery
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-black text-gray-900 text-base group-hover:text-primary transition-colors">{rest.name}</h3>
                          <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-black px-2 py-0.5 rounded-lg ml-2 flex-shrink-0">
                            <Star size={10} fill="white" /> {rest.rating}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mb-3 line-clamp-1">{rest.cuisine}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold border-t border-gray-50 pt-3">
                          <span className="flex items-center gap-1"><Clock size={12} className="text-primary" />{rest.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" />{rest.dist}</span>
                          <span className="ml-auto text-gray-400">Min ₹{rest.minOrder}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
