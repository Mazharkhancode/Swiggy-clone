import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

import { restaurants as staticRestaurants } from '../data/restaurants';

// Helper to normalize strings for robust fuzzy-like matching (handles double letters, common typos)
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

export default function PopularRestaurants({ searchQuery = '' }) {
  const [restaurantsList, setRestaurantsList] = useState(staticRestaurants);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('/restaurants');
        if (response.data && response.data.length > 0) {
          const dbItems = response.data.map(item => ({
            id: item._id,
            name: item.name,
            cuisine: Array.isArray(item.cuisine) ? item.cuisine.join(', ') : item.cuisine,
            rating: item.rating || 4.5,
            time: `${item.deliveryTime || 30} mins`,
            dist: '2.5 KM',
            offer: item.costForTwo ? `₹${item.costForTwo} For Two` : '10% OFF',
            image: item.image,
            tags: item.cuisine || [],
            isDb: true
          }));

          const filteredStatic = staticRestaurants.filter(
            s => !dbItems.some(d => d.name.toLowerCase() === s.name.toLowerCase())
          );

          setRestaurantsList([...dbItems, ...filteredStatic]);
        }
      } catch (err) {
        console.error('Error fetching restaurants from backend', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const query = searchQuery.trim();
  const normalizedQuery = normalizeStr(query);

  const filteredRestaurants = restaurantsList.filter(rest => {
    if (!query) return true;
    
    // If the query is a generic term (like restaurant, food, eat, order, or common typos), match all
    const lowerQuery = query.toLowerCase();
    const genericTerms = [
      'restaurant', 'restaurants', 'reastaurant', 'reastaurants', 'resatartant', 
      'resatartants', 'rastaurant', 'rastaurants', 'food', 'order', 'eat', 
      'dine', 'hotel', 'dhaba', 'delivery', 'delivry'
    ];
    if (genericTerms.some(term => term.includes(lowerQuery) || lowerQuery.includes(term))) {
      if (lowerQuery.length >= 3) return true;
    }
    
    // Check exact name match
    if (rest.name.toLowerCase().includes(query.toLowerCase())) return true;
    
    // Check exact cuisine match
    if (rest.cuisine.toLowerCase().includes(query.toLowerCase())) return true;

    // Check normalized matches (for jhonny->johny, chat->chaat)
    if (normalizeStr(rest.name).includes(normalizedQuery)) return true;
    if (normalizeStr(rest.cuisine).includes(normalizedQuery)) return true;

    // Check tags
    if (rest.tags && rest.tags.some(tag => {
      const normalizedTag = normalizeStr(tag);
      return (
        tag.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(tag.toLowerCase()) ||
        normalizedTag.includes(normalizedQuery) ||
        normalizedQuery.includes(normalizedTag)
      );
    })) {
      return true;
    }

    return false;
  });

  // Prioritize featured restaurants to show in first 10
  const featuredIds = ['mcdonalds-indore', 'kfc-indore', 'burger-king-indore', 'dominos-indore'];
  const featured = filteredRestaurants.filter(r => featuredIds.includes(r.id));
  const nonFeatured = filteredRestaurants.filter(r => !featuredIds.includes(r.id));
  const sortedRestaurants = [...nonFeatured.slice(0, 6), ...featured, ...nonFeatured.slice(6)].slice(0, 10);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Restaurants in Indore</h2>
        
        {sortedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedRestaurants.map((rest, index) => (
              <Link key={index} to={`/restaurant/${rest.id}`}>
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition-all border border-gray-100 group"
                >
                  {/* Cover Image */}
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                     <img 
                       src={rest.image.replace('w=600', 'w=800')} 
                       alt={rest.name} 
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                     />
                     {rest.offer && (
                       <div className="absolute top-4 left-0 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-r-full shadow-md z-10">
                         {rest.offer}
                       </div>
                     )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{rest.name}</h3>
                      <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold flex-shrink-0">
                        <span>{rest.rating}</span>
                        <Star size={14} className="ml-1 fill-current" />
                      </div>
                    </div>
                    
                    <p className="text-gray-500 mb-4 text-sm truncate">{rest.cuisine}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-4">
                      <span className="flex items-center"><span className="mr-1">⏱️</span> {rest.time}</span>
                      <span className="flex items-center"><span className="mr-1">📍</span> {rest.dist}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg font-semibold">No restaurants found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </section>
  );
}
