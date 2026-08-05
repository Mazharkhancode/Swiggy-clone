import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, ChevronLeft, Tag, Flame, Percent, Sparkles } from 'lucide-react';
import { restaurants } from '../data/restaurants';

const DEAL_META = {
  'flat-125-off': {
    title: 'Flat ₹125 OFF',
    subtitle: 'On orders above ₹249 — Use code WELCOME125',
    icon: Flame,
    bg: 'from-orange-500 to-red-500',
    filter: (rest) => {
      // Show restaurants with items priced around ₹125 discount range (items ≤ ₹200 that benefit most from ₹125 off)
      return rest.menu.some(sec => sec.items.some(item => item.price >= 125 && item.price <= 400));
    },
    getItems: (rest) => {
      const items = [];
      rest.menu.forEach(sec => {
        sec.items.forEach(item => {
          if (item.price >= 125 && item.price <= 400) {
            items.push({ ...item, restaurantName: rest.name, restaurantId: rest.id, discountedPrice: Math.max(item.price - 125, 0) });
          }
        });
      });
      return items;
    }
  },
  '50-percent-off': {
    title: '50% OFF up to ₹100',
    subtitle: 'On your first 3 food orders — Use code TRYNEW50',
    icon: Percent,
    bg: 'from-fuchsia-500 to-purple-600',
    filter: (rest) => {
      return rest.menu.some(sec => sec.items.some(item => item.price >= 100));
    },
    getItems: (rest) => {
      const items = [];
      rest.menu.forEach(sec => {
        sec.items.forEach(item => {
          if (item.price >= 100) {
            const discount = Math.min(Math.floor(item.price * 0.5), 100);
            items.push({ ...item, restaurantName: rest.name, restaurantId: rest.id, discountedPrice: item.price - discount });
          }
        });
      });
      return items;
    }
  },
  'free-delivery': {
    title: 'Free Delivery',
    subtitle: 'On selected premium brands — Use code FREEDEL',
    icon: Sparkles,
    bg: 'from-blue-500 to-indigo-600',
    filter: (rest) => rest.deliveryFee === 0,
    getItems: (rest) => {
      const items = [];
      rest.menu.forEach(sec => {
        sec.items.forEach(item => {
          items.push({ ...item, restaurantName: rest.name, restaurantId: rest.id, discountedPrice: null });
        });
      });
      return items;
    }
  },
  'cashback-150': {
    title: 'Flat ₹150 Cashback',
    subtitle: 'Pay using Swiggy Wallet — Use code PAYWALLET',
    icon: Tag,
    bg: 'from-emerald-500 to-teal-600',
    filter: (rest) => rest.minOrder >= 199,
    getItems: (rest) => {
      const items = [];
      rest.menu.forEach(sec => {
        sec.items.forEach(item => {
          if (item.price >= 199) {
            items.push({ ...item, restaurantName: rest.name, restaurantId: rest.id, discountedPrice: null, cashback: 150 });
          }
        });
      });
      return items;
    }
  },
  '60-percent-off': {
    title: 'Flat 60% OFF',
    subtitle: 'From your favorite restaurants — Use code SWIGGY60',
    icon: Percent,
    bg: 'from-orange-600 to-red-600',
    filter: (rest) => true,
    getItems: (rest) => {
      const items = [];
      rest.menu.forEach(sec => {
        sec.items.forEach(item => {
          const discount = Math.floor(item.price * 0.6);
          items.push({ 
            ...item, 
            restaurantName: rest.name, 
            restaurantId: rest.id, 
            discountedPrice: item.price - discount 
          });
        });
      });
      return items;
    }
  },
};

export default function DealsProducts() {
  const { dealType } = useParams();
  const navigate = useNavigate();
  const meta = DEAL_META[dealType];

  const dealItems = useMemo(() => {
    if (!meta) return [];
    const items = [];
    restaurants.forEach(rest => {
      if (meta.filter(rest)) {
        items.push(...meta.getItems(rest));
      }
    });
    return items;
  }, [dealType]);

  if (!meta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🏷️</div>
        <h2 className="text-2xl font-black text-gray-800">Deal not found</h2>
        <p className="text-gray-500 mt-2 mb-6">This offer may have expired.</p>
        <Link to="/" className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-orange-600 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const Icon = meta.icon;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Deal Header Banner */}
      <div className={`bg-gradient-to-br ${meta.bg} py-10 px-4`}>
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm font-semibold mb-4 transition-colors bg-transparent border-0 cursor-pointer p-0">
            <ChevronLeft size={16} /> Home
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Icon size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">{meta.title}</h1>
              <p className="text-white/80 text-sm mt-1">{meta.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Count */}
      <div className="max-w-6xl mx-auto px-4 mt-6 mb-6">
        <p className="text-base font-black text-gray-800">
          {dealItems.length} dish{dealItems.length !== 1 ? 'es' : ''} available with this offer
        </p>
      </div>

      {/* Items Grid */}
      <div className="max-w-6xl mx-auto px-4">
        {dealItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-gray-700">No items found for this deal</h3>
            <p className="text-gray-400 text-sm mt-2">Check back later for new offers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {dealItems.map((item, i) => (
              <motion.div
                key={`${item.id}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
              >
                <Link to={`/product/${item.id}`} className="group block">
                  {/* Image */}
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Veg/Non-Veg Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${item.veg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {item.veg ? '● Veg' : '● Non-Veg'}
                      </span>
                    </div>

                    {/* Discount Badge */}
                    {item.discountedPrice != null && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                        <span className="text-white text-xs font-black">{meta.title}</span>
                      </div>
                    )}

                    {/* Rating */}
                    <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 text-green-700 text-xs font-black px-2 py-0.5 rounded-full shadow-sm">
                      <Star size={9} fill="currentColor" /> {item.rating}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="px-1">
                    <h3 className="font-black text-gray-900 text-[15px] group-hover:text-primary transition-colors truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 font-semibold mb-1 truncate">{item.restaurantName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.discountedPrice != null ? (
                        <>
                          <span className="text-base font-black text-gray-900">₹{item.discountedPrice}</span>
                          <span className="text-xs text-gray-400 line-through">₹{item.price}</span>
                        </>
                      ) : (
                        <span className="text-base font-black text-gray-900">₹{item.price}</span>
                      )}
                      {item.cashback && (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          +₹{item.cashback} cashback
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
