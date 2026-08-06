import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">

        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          className="relative mb-8"
        >
          <div className="text-[140px] sm:text-[180px] font-black text-gray-100 leading-none select-none">
            404
          </div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center text-7xl sm:text-8xl"
          >
            🛵
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-400 text-sm font-semibold leading-relaxed">
            Looks like our delivery rider took a wrong turn. <br />
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-[#ff5200] hover:bg-[#e64a00] text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
          >
            <Home size={16} /> Go Home
          </Link>
          <Link
            to="/restaurants"
            className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all"
          >
            <Search size={16} /> Browse Restaurants
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => window.history.back()}
          className="mt-6 flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs font-bold mx-auto transition-colors cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft size={14} /> Go Back
        </motion.button>

      </div>
    </div>
  );
}
