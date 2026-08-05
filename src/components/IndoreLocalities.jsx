import { motion } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';

const localities = [
  { name: 'Vijay Nagar', count: '340 places' },
  { name: 'Palasia', count: '210 places' },
  { name: 'Chappan Dukan', count: '90 places' },
  { name: 'Bhavarkua', count: '180 places' },
  { name: 'Rajendra Nagar', count: '120 places' },
  { name: 'Annapurna Road', count: '140 places' },
  { name: 'Saket', count: '95 places' },
  { name: 'Khajrana', count: '80 places' },
];

export default function IndoreLocalities() {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
          Popular localities in and around Indore
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {localities.map((loc, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <MapPin size={18} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-800 text-[16px] truncate group-hover:text-primary transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">{loc.count}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
