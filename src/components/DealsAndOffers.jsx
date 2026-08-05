import { motion } from 'framer-motion';
import { Tag, Sparkles, Flame, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

const offers = [
  { 
    title: 'Flat ₹125 OFF', 
    desc: 'On orders above ₹249', 
    code: 'WELCOME125', 
    bg: 'from-orange-500 to-red-500',
    icon: Flame,
    dealType: 'flat-125-off'
  },
  { 
    title: '50% OFF up to ₹100', 
    desc: 'On your first 3 food orders', 
    code: 'TRYNEW50', 
    bg: 'from-fuchsia-500 to-purple-600',
    icon: Percent,
    dealType: '50-percent-off'
  },
  { 
    title: 'Free Delivery', 
    desc: 'On selected premium brands', 
    code: 'FREEDEL', 
    bg: 'from-blue-500 to-indigo-600',
    icon: Sparkles,
    dealType: 'free-delivery'
  },
  { 
    title: 'Flat ₹150 Cashback', 
    desc: 'Pay using Swiggy Wallet', 
    code: 'PAYWALLET', 
    bg: 'from-emerald-500 to-teal-600',
    icon: Tag,
    dealType: 'cashback-150'
  },
];

export default function DealsAndOffers() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Deals & Offers For You</h2>
          <span className="bg-orange-100 text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Limited Time
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <Link key={index} to={`/deals/${offer.dealType}`}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  className={`relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${offer.bg} shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[160px]`}
                >
                  {/* Background Pattern */}
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                    <Icon size={120} />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                        <Icon size={20} className="text-white" />
                      </div>
                      <span className="text-[11px] font-black tracking-widest bg-black/25 px-2.5 py-1 rounded-md border border-white/10 uppercase">
                        CODE: {offer.code}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black tracking-tight leading-snug">{offer.title}</h3>
                    <p className="text-white/80 font-medium text-xs mt-1">{offer.desc}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-4 text-xs font-bold text-white/90">
                    <span>Tap to Apply</span>
                    <span>→</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
