import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Row 1 — top row (22 items)
const row1 = [
  { name: 'Desserts',     image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Burger',       image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Chinese',      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Cake',         image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Khichdi',      image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Paratha',      image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Biryani',      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Pizza',        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Dosa',         image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Momos',        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Sandwich',     image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Pav Bhaji',    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Noodles',      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Rolls',        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Dal Makhani',  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Thali',        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Paneer',       image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Kebab',        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Soup',         image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Salad',        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Milkshake',    image: 'https://images.unsplash.com/photo-1553530979-fbb9e4aee36f?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Lassi',        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=200&h=200&q=80' },
];

// Row 2 — bottom row (22 items)
const row2 = [
  { name: 'Vada',         image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Rasgulla',     image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Pasta',        image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Coffee',       image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Chole Bhature',image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Ice Cream',    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Rasmalai',     image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Idli',         image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Samosa',       image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Waffles',      image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Pancakes',     image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Chicken',      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Fish & Chips', image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Tikka',        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Naan',         image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Pulao',        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Gulab Jamun',  image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Halwa',        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Kulfi',        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Poha',         image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Upma',         image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Tacos',        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=200&h=200&q=80' },
];

function CategoryItem({ cat }) {
  return (
    <Link to={`/category/${encodeURIComponent(cat.name)}`}>
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center cursor-pointer group w-[120px] flex-shrink-0"
      >
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden mb-2 shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-gray-50">
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <span className="font-bold text-gray-800 text-sm text-center group-hover:text-primary transition-colors leading-tight">
          {cat.name}
        </span>
      </motion.div>
    </Link>
  );
}

export default function FoodCategories() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">

        {/* Header row with arrow buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Order our best food options
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                canScrollLeft
                  ? 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                canScrollRight
                  ? 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable container — no padding-bottom, scrollbar fully hidden */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="overflow-x-auto scrollbar-hide"
        >
          {/* Inner wrapper — forces min width so items don't wrap */}
          <div className="inline-flex flex-col gap-y-4 min-w-max">

            {/* Row 1 */}
            <div className="flex gap-x-6">
              {row1.map((cat, i) => <CategoryItem key={i} cat={cat} />)}
            </div>

            {/* Row 2 */}
            <div className="flex gap-x-6">
              {row2.map((cat, i) => <CategoryItem key={i} cat={cat} />)}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

