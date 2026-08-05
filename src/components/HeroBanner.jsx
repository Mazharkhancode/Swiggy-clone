import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { restaurants } from '../data/restaurants';

// Helper to normalize strings for robust fuzzy-like matching
const normalizeStr = (str) => {
  return (str || '')
    .toLowerCase()
    .replace(/aa/g, 'a')
    .replace(/nn/g, 'n')
    .replace(/jh/g, 'j')
    .replace(/gh/g, 'g')
    .replace(/oo/g, 'u')
    .replace(/\s+/g, '');
};

export default function HeroBanner({ searchQuery, setSearchQuery }) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const indoreLocalities = [
    'Vijay Nagar, Indore',
    'Palasia, Indore',
    'Chappan Dukan, Indore',
    'Bhavarkua, Indore',
    'Rajendra Nagar, Indore',
    'Annapurna Road, Indore'
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative bg-[#ff5200] pt-20 pb-32 overflow-hidden min-h-[600px] flex items-center">
      
      {/* Left side fresh veggies bag - matching Swiggy (half-visible on mobile and desktop) */}
      <div className="absolute left-0 top-[42%] -translate-y-1/2 -translate-x-[52%] opacity-95 z-0 pointer-events-none select-none">
         <img 
           src="/left_veggies_bag.png?v=100" 
           alt="Fresh Vegetables Bag" 
           className="w-[280px] sm:w-[380px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-auto object-contain transform rotate-[32deg]" 
         />
      </div>

      {/* Right side sushi plate with chopsticks - matching Swiggy (half-visible on mobile and desktop) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[18%] opacity-95 z-0 pointer-events-none select-none">
         <img 
           src="/right_sushi_plate.png?v=100" 
           alt="Sushi Plate" 
           className="w-[120px] sm:w-[190px] md:w-[260px] lg:w-[320px] xl:w-[370px] h-auto object-contain transform -rotate-12" 
         />
      </div>

      <div className="container mx-auto px-4 flex flex-col items-center relative z-10 w-full">
        
        <motion.h1 
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white text-center leading-[1.1] mb-12 max-w-4xl tracking-tight"
        >
          Order food & groceries. <br />
          Discover best restaurants.
        </motion.h1>

        {/* Search Bars - Separated with space */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl mb-12"
        >
          {/* Location Input Card */}
          <div className="relative w-full sm:w-[42%]" ref={dropdownRef}>
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center bg-white rounded-2xl px-5 py-4 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 group w-full"
            >
              <MapPin className="text-primary mr-3 flex-shrink-0" size={22} />
              <input 
                type="text" 
                placeholder="Enter your delivery location" 
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setShowDropdown(true);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full focus:outline-none text-gray-800 font-semibold text-[15px] placeholder-gray-400 bg-transparent truncate"
              />
              <ChevronDown className="text-gray-400 ml-2 flex-shrink-0 group-hover:text-primary transition-colors" size={18} />
            </div>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-2 max-h-60 overflow-y-auto">
                {indoreLocalities
                  .filter(loc => loc.toLowerCase().includes(selectedLocation.toLowerCase()))
                  .map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLocation(loc);
                        setShowDropdown(false);
                      }}
                      className="px-5 py-3 hover:bg-orange-50 text-gray-700 font-medium text-[14px] cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <MapPin size={16} className="text-primary flex-shrink-0" />
                      <span>{loc}</span>
                    </div>
                  ))
                }
                {indoreLocalities.filter(loc => loc.toLowerCase().includes(selectedLocation.toLowerCase())).length === 0 && (
                  <div className="px-5 py-3 text-gray-400 text-sm">No locations found in Indore</div>
                )}
              </div>
            )}
          </div>

          {/* Search Input Card with Dropdown */}
          <div className="relative w-full sm:w-[58%]" ref={searchRef}>
            <div className="flex items-center bg-white rounded-2xl px-5 py-4 w-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 group">
              <input 
                type="text" 
                placeholder="Search for restaurant, item or more" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full focus:outline-none text-gray-800 font-semibold text-[15px] placeholder-gray-400 bg-transparent"
              />
              <Search className="text-gray-400 ml-2 flex-shrink-0 group-hover:text-primary transition-colors" size={22} />
            </div>

            {/* Restaurant Search Dropdown */}
            {showSearchDropdown && searchQuery.trim() && (() => {
              const query = searchQuery.trim();
              const normalizedQuery = normalizeStr(query);
              const matchingRestaurants = restaurants.filter(rest => {
                const lowerQuery = query.toLowerCase();
                if (rest.name.toLowerCase().includes(lowerQuery)) return true;
                if (rest.cuisine.toLowerCase().includes(lowerQuery)) return true;
                if (normalizeStr(rest.name).includes(normalizedQuery)) return true;
                if (normalizeStr(rest.cuisine).includes(normalizedQuery)) return true;
                
                if (rest.tags && rest.tags.some(tag => {
                  const normalizedTag = normalizeStr(tag);
                  return (
                    tag.toLowerCase().includes(lowerQuery) ||
                    lowerQuery.includes(tag.toLowerCase()) ||
                    normalizedTag.includes(normalizedQuery) ||
                    normalizedQuery.includes(normalizedTag)
                  );
                })) {
                  return true;
                }
                return false;
              });

              return (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-2 max-h-60 overflow-y-auto">
                  {matchingRestaurants.map((rest, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSearchQuery(rest.name);
                        setShowSearchDropdown(false);
                      }}
                      className="px-5 py-3 hover:bg-orange-50 text-gray-700 font-medium text-[14px] cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={rest.image} alt={rest.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-gray-900 leading-tight">{rest.name}</span>
                          <span className="text-[11px] text-gray-400 truncate max-w-[200px] sm:max-w-[250px]">{rest.cuisine}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-black flex-shrink-0">
                        <span>{rest.rating}</span>
                        <Star size={10} className="fill-current" />
                      </div>
                    </div>
                  ))}
                  {matchingRestaurants.length === 0 && (
                    <div className="px-5 py-4 text-gray-400 text-sm text-center font-semibold">
                      No restaurants found matching "{query}"
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </motion.div>
        {/* Food Delivery Card - Redesigned to span full width of search inputs & have shorter height */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-3xl flex justify-center"
        >
          <Link to="/deals/60-percent-off" className="w-full">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 w-full h-[180px] flex items-center justify-between relative overflow-hidden shadow-2xl hover:shadow-primary/20 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group border border-white/10">
              {/* Left Content */}
              <div className="z-10 flex flex-col justify-between h-full py-1">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none">FOOD DELIVERY</h2>
                  <p className="text-gray-400 font-bold text-xs tracking-wider uppercase mt-2">FROM RESTAURANTS</p>
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                  <span className="bg-orange-50 text-[#ff5200] text-xs font-black px-4 py-1.5 rounded-full">
                    UPTO 60% OFF
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#ff5200] flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="text-white" size={18} />
                  </div>
                </div>
              </div>

              {/* Overlapping Food Image on the Right */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 sm:w-1/2 h-full flex items-center justify-end pr-4 sm:pr-8">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-8 border-white shadow-xl transform group-hover:scale-105 group-hover:rotate-6 transition-all duration-500 flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" 
                    alt="Delicious Food" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
