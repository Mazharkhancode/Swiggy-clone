// ============================================================
// Indore Restaurants - Complete Data Store
// foodTypes = ONLY categories this restaurant ACTUALLY serves
// These map EXACTLY to the home page FoodCategories icons
// ============================================================

const defaultRestaurants = [
  // ---- ORIGINAL 6 ----
  {
    id: 'nafees', name: 'Nafees Restaurant', cuisine: 'Mughlai, Biryani, North Indian',
    rating: 4.6, time: '30 mins', dist: '3.2 KM', offer: '20% OFF', minOrder: 199, deliveryFee: 30,
    address: 'Near Masjid Square, Palasia, Indore', hours: '11:00 AM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
    tags: ['nafees', 'biryani', 'mughlai', 'chicken', 'korma'],
    foodTypes: ['Biryani'],
    categories: ['Biryani', 'Kebabs', 'Curry', 'Breads'],
    menu: [
      { category: 'Biryani', items: [
        { id: 'n1', name: 'Chicken Biryani', desc: 'Aromatic basmati rice slow-cooked with tender chicken and saffron', price: 229, rating: 4.8, veg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', variants: [{label:'Half',extra:0},{label:'Full',extra:80}], addons: [{label:'Extra Raita',price:30}] },
        { id: 'n2', name: 'Mutton Biryani', desc: 'Slow-cooked mutton pieces layered with fragrant Basmati rice', price: 299, rating: 4.7, veg: false, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', variants: [{label:'Half',extra:0},{label:'Full',extra:100}], addons: [] },
        { id: 'n3', name: 'Veg Biryani', desc: 'Garden vegetables layered with saffron rice', price: 169, rating: 4.5, veg: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
      { category: 'Kebabs', items: [
        { id: 'n4', name: 'Seekh Kebab', desc: 'Minced mutton grilled over charcoal, served with mint chutney', price: 189, rating: 4.7, veg: false, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'n5', name: 'Paneer Tikka', desc: 'Cottage cheese marinated in spiced yogurt, grilled in tandoor', price: 219, rating: 4.6, veg: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
      { category: 'Curry', items: [
        { id: 'n6', name: 'Butter Chicken', desc: 'Tender chicken in rich creamy tomato-based sauce', price: 249, rating: 4.8, veg: false, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'n7', name: 'Dal Makhani', desc: 'Black lentils slow-cooked overnight with butter and cream', price: 179, rating: 4.6, veg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [
      { name: 'Rahul Verma', rating: 5, date: '2 days ago', text: 'Best Biryani in Indore! Absolutely perfect spices.' },
      { name: 'Mohammed Ali', rating: 5, date: '2 weeks ago', text: 'Authentic Mughlai taste. Seekh Kebab was amazing!' },
    ]
  },
  {
    id: 'johny', name: 'Johny Hot Dog', cuisine: 'Fast Food, Burgers, Sliders',
    rating: 4.8, time: '15 mins', dist: '1.5 KM', offer: '10% OFF', minOrder: 99, deliveryFee: 0,
    address: 'Chappan Dukan, New Palasia, Indore', hours: '10:00 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80',
    tags: ['johny', 'hot dog', 'burger', 'slider'],
    foodTypes: ['Burger', 'Rolls'],
    categories: ['Hot Dogs', 'Burgers', 'Sides'],
    menu: [
      { category: 'Hot Dogs', items: [
        { id: 'j1', name: 'Classic Chicken Hot Dog', desc: 'Juicy chicken sausage in a soft bun with mustard and ketchup', price: 79, rating: 4.9, veg: false, image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80', variants: [{label:'Single',extra:0},{label:'Double Patty',extra:40}], addons: [{label:'Extra Cheese',price:20}] },
        { id: 'j2', name: 'Mutton Hot Dog', desc: 'Tender mutton sausage with caramelized onions and special sauce', price: 99, rating: 4.8, veg: false, image: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'j3', name: 'Veg Slider', desc: 'Crispy veggie patty in a toasted bun with creamy coleslaw', price: 69, rating: 4.6, veg: true, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Cheese',price:20}] },
      ]},
      { category: 'Burgers', items: [
        { id: 'j4', name: 'Crispy Chicken Burger', desc: 'Crunchy fried chicken breast, lettuce, and chipotle mayo', price: 129, rating: 4.7, veg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Cheese',price:20}] },
        { id: 'j5', name: 'Aloo Tikki Burger', desc: 'Spiced potato patty with onion rings and green chutney', price: 89, rating: 4.6, veg: true, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [
      { name: 'Amit Sharma', rating: 5, date: '3 days ago', text: 'Iconic Indore experience! Mutton Hot Dog is unmatched.' },
      { name: 'Sneha Joshi', rating: 5, date: '5 days ago', text: 'Been coming here for years, quality only gets better!' },
    ]
  },
  {
    id: 'guru-kripa', name: 'Guru Kripa Veg', cuisine: 'North Indian, Pure Veg Thali',
    rating: 4.5, time: '25 mins', dist: '2.8 KM', offer: '15% OFF', minOrder: 149, deliveryFee: 20,
    address: 'Near Palasia Square, Palasia, Indore', hours: '10:30 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    tags: ['guru kripa', 'veg', 'thali', 'paneer'],
    foodTypes: ['Thali', 'Healthy'],
    categories: ['Thali', 'Paneer', 'Dal & Sabzi'],
    menu: [
      { category: 'Thali', items: [
        { id: 'g1', name: 'Full Veg Thali', desc: 'Dal, 2 Sabzi, Roti, Rice, Salad, Papad and Dessert', price: 149, rating: 4.7, veg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80', variants: [{label:'Regular',extra:0},{label:'Special',extra:50}], addons: [] },
        { id: 'g2', name: 'Mini Thali', desc: 'Dal, 1 Sabzi, 2 Roti and Salad', price: 99, rating: 4.5, veg: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
      { category: 'Paneer', items: [
        { id: 'g3', name: 'Shahi Paneer', desc: 'Rich cottage cheese gravy with cream and aromatic spices', price: 199, rating: 4.8, veg: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Savita Agrawal', rating: 5, date: '1 day ago', text: 'Best pure veg thali in Indore! Dal tadka is heavenly.' }]
  },
  {
    id: 'o2-cafe', name: 'O2 Cafe de la Ville', cuisine: 'Cafe, Italian, Pizza, Desserts',
    rating: 4.4, time: '35 mins', dist: '3.0 KM', offer: 'Buy 1 Get 1', minOrder: 199, deliveryFee: 40,
    address: 'Near Treasure Island Mall, Vijay Nagar, Indore', hours: '9:00 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    tags: ['o2', 'cafe', 'pizza', 'pasta', 'dessert'],
    foodTypes: ['Pizza', 'Desserts'],
    categories: ['Pizza', 'Pasta', 'Desserts'],
    menu: [
      { category: 'Pizza', items: [
        { id: 'o1', name: 'Margherita Pizza', desc: 'Classic tomato sauce, fresh mozzarella and basil on thin crust', price: 259, rating: 4.5, veg: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', variants: [{label:'7 inch',extra:0},{label:'10 inch',extra:80}], addons: [{label:'Extra Cheese',price:40}] },
        { id: 'o2', name: 'BBQ Chicken Pizza', desc: 'Smoky BBQ sauce, grilled chicken, red onions and bell peppers', price: 329, rating: 4.6, veg: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', variants: [{label:'7 inch',extra:0},{label:'10 inch',extra:80}], addons: [] },
      ]},
      { category: 'Desserts', items: [
        { id: 'o4', name: 'Chocolate Lava Cake', desc: 'Warm chocolate cake with molten center, served with vanilla ice cream', price: 189, rating: 4.8, veg: true, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Deepika Rawat', rating: 5, date: '4 days ago', text: 'Amazing ambiance and the Lava Cake is to die for!' }]
  },
  {
    id: 'shreemaya', name: 'Shreemaya Cafeteria', cuisine: 'Bakery, Cakes, Pastries',
    rating: 4.7, time: '20 mins', dist: '2.2 KM', offer: 'Free Delivery', minOrder: 129, deliveryFee: 0,
    address: 'Near Bombay Hospital, Vijay Nagar, Indore', hours: '8:00 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    tags: ['shreemaya', 'bakery', 'cake', 'pastry', 'puff'],
    foodTypes: ['Cakes', 'Desserts'],
    categories: ['Cakes', 'Pastries', 'Puffs & Rolls'],
    menu: [
      { category: 'Cakes', items: [
        { id: 's1', name: 'Black Forest Cake', desc: 'Classic German chocolate cake with whipped cream and cherries', price: 349, rating: 4.8, veg: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', variants: [{label:'500g',extra:0},{label:'1 Kg',extra:300}], addons: [] },
        { id: 's2', name: 'Chocolate Truffle Cake', desc: 'Rich dark chocolate ganache layered with moist chocolate sponge', price: 399, rating: 4.9, veg: true, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&q=80', variants: [{label:'500g',extra:0},{label:'1 Kg',extra:350}], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Anjali Tiwari', rating: 5, date: '2 days ago', text: "Shreemaya's Black Forest is legendary! No birthday is complete without it." }]
  },
  {
    id: 'vijay-chaat', name: 'Vijay Chaat House', cuisine: 'Indori Chaat, Samosa, Sweets',
    rating: 4.6, time: '18 mins', dist: '1.7 KM', offer: '₹50 OFF on ₹199', minOrder: 99, deliveryFee: 15,
    address: 'Chappan Dukan Market, New Palasia, Indore', hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80',
    tags: ['vijay', 'chaat', 'samosa', 'indori', 'poha'],
    foodTypes: ['South Indian', 'Desserts', 'Healthy'],
    categories: ['Indori Chaat', 'Samosa & Kachori', 'Sweets'],
    menu: [
      { category: 'Indori Chaat', items: [
        { id: 'v1', name: 'Indori Poha', desc: 'Light poha topped with sev, jalebi and fennel seeds', price: 59, rating: 4.7, veg: true, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Sev',price:10}] },
        { id: 'v2', name: 'Garadu', desc: 'Deep-fried yam pieces tossed with spicy masala — true Indori delicacy', price: 79, rating: 4.8, veg: true, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
      { category: 'Sweets', items: [
        { id: 'v6', name: 'Jalebi (100g)', desc: 'Crispy sugar-syrup soaked spirals — best paired with rabdi', price: 49, rating: 4.9, veg: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80', variants: [{label:'100g',extra:0},{label:'250g',extra:60}], addons: [{label:'With Rabdi',price:30}] },
      ]},
    ],
    reviews: [{ name: 'Suresh Kumar', rating: 5, date: '1 day ago', text: 'Indore ki shaan hai Vijay Chaat! Garadu is a must-try.' }]
  },

  // ---- CAFES & MULTI CUISINE ----
  {
    id: 'the-brew-room', name: 'The Brew Room', cuisine: 'Cafe, Coffee, Burgers, Waffles',
    rating: 4.5, time: '22 mins', dist: '2.1 KM', offer: '15% OFF', minOrder: 149, deliveryFee: 0,
    address: 'AB Road, Vijay Nagar, Indore', hours: '9:00 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=600&q=80',
    tags: ['brew room', 'cafe', 'coffee', 'burger', 'waffle'],
    foodTypes: ['Burger', 'Desserts', 'Cakes'],
    categories: ['Coffee', 'Burgers', 'Desserts'],
    menu: [
      { category: 'Burgers', items: [
        { id: 'br2', name: 'Smash Burger', desc: 'Double smashed patty with American cheese, pickles and special sauce', price: 199, rating: 4.6, veg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Cheese',price:30}] },
      ]},
      { category: 'Desserts', items: [
        { id: 'br4', name: 'Belgian Waffle', desc: 'Crispy golden waffle with Nutella, strawberries and whipped cream', price: 169, rating: 4.8, veg: true, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Arjun Kapoor', rating: 5, date: '3 days ago', text: 'Best cafe vibes in Indore! Smash burger is unreal.' }]
  },
  {
    id: 'woodbox-cafe', name: 'Woodbox Cafe', cuisine: 'Cafe, Italian, Pizza, Burgers',
    rating: 4.4, time: '30 mins', dist: '2.4 KM', offer: 'Free Delivery', minOrder: 179, deliveryFee: 0,
    address: 'Geeta Bhawan Square, Old Palasia, Indore', hours: '10:00 AM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    tags: ['woodbox', 'cafe', 'pasta', 'burger', 'pizza'],
    foodTypes: ['Pizza', 'Burger'],
    categories: ['Pizza', 'Pasta', 'Burgers'],
    menu: [
      { category: 'Pizza', items: [
        { id: 'wb1', name: 'Farm Fresh Veggie Pizza', desc: 'Bell peppers, olives, mushrooms, onions and mozzarella', price: 279, rating: 4.4, veg: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', variants: [{label:'7 inch',extra:0},{label:'10 inch',extra:80}], addons: [] },
        { id: 'wb2', name: 'Pepperoni Pizza', desc: 'Classic American pepperoni with mozzarella on thin crust', price: 319, rating: 4.5, veg: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Tanvi Shah', rating: 5, date: '1 week ago', text: 'Best Pepperoni Pizza in Indore!' }]
  },
  {
    id: 'the-bohemian', name: 'The Bohemian', cuisine: 'Continental, Italian, Cafe, Desserts',
    rating: 4.3, time: '28 mins', dist: '2.6 KM', offer: 'Free Delivery', minOrder: 199, deliveryFee: 0,
    address: 'MG Road, Near Rajwada, Indore', hours: '10:00 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
    tags: ['bohemian', 'continental', 'italian', 'cafe', 'dessert'],
    foodTypes: ['Pizza', 'Burger', 'Desserts', 'Cakes'],
    categories: ['Starters', 'Mains', 'Desserts'],
    menu: [
      { category: 'Starters', items: [
        { id: 'tb2', name: 'Chicken Quesadilla', desc: 'Grilled tortilla filled with chicken, cheese, jalapeños and salsa', price: 229, rating: 4.6, veg: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
      { category: 'Desserts', items: [
        { id: 'tb3', name: 'Tiramisu', desc: 'Classic Italian dessert with mascarpone and espresso soaked ladyfingers', price: 199, rating: 4.8, veg: true, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'tb4', name: 'NY Cheesecake', desc: 'Dense creamy New York-style cheesecake with graham cracker crust', price: 189, rating: 4.7, veg: true, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Nishant Pandey', rating: 4, date: '1 week ago', text: 'Great vibes. Tiramisu is outstanding!' }]
  },

  // ---- PIZZA ----
  {
    id: 'dominos-indore', name: "Domino's Pizza", cuisine: 'Pizza, Garlic Bread, Pasta',
    rating: 4.1, time: '30 mins', dist: '2.5 KM', offer: '2 Pizzas ₹599', minOrder: 299, deliveryFee: 0,
    address: 'C-21 Mall, Vijay Nagar, Indore', hours: '10:00 AM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    tags: ['dominos', "domino's", 'pizza', 'garlic bread', 'stuffed crust'],
    foodTypes: ['Pizza'],
    categories: ['Pizza', 'Sides', 'Beverages'],
    menu: [
      { category: 'Pizza', items: [
        { id: 'dom1', name: 'Margherita', desc: 'Classic delight with 100% real mozzarella cheese', price: 199, rating: 4.0, veg: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', variants: [{label:'Regular',extra:0},{label:'Medium',extra:100},{label:'Large',extra:200}], addons: [{label:'Extra Cheese',price:50}] },
        { id: 'dom2', name: 'Peppy Paneer', desc: 'Chunky paneer with vibrant capsicum and spicy jalapeños', price: 249, rating: 4.2, veg: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', variants: [{label:'Regular',extra:0},{label:'Medium',extra:100}], addons: [] },
        { id: 'dom3', name: 'Chicken Dominator', desc: 'Maximum loaded chicken toppings on every bite', price: 349, rating: 4.3, veg: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', variants: [{label:'Regular',extra:0},{label:'Medium',extra:120}], addons: [] },
      ]},
    ],
    reviews: [
      { name: 'Ravi Sharma', rating: 4, date: '3 days ago', text: 'Reliable as always! Fast delivery and hot pizza.' },
      { name: 'Priya S', rating: 4, date: '1 week ago', text: 'Love the Peppy Paneer, always consistent.' },
    ]
  },
  {
    id: 'la-pinoz', name: 'La Pinoz Pizza', cuisine: 'Pizza, Pasta, Momos',
    rating: 4.3, time: '25 mins', dist: '2.0 KM', offer: '30% OFF', minOrder: 249, deliveryFee: 0,
    address: 'Near South Tukoganj, Indore', hours: '11:00 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    tags: ['la pinoz', 'lapinoz', 'pizza', 'pasta', 'loaded pizza'],
    foodTypes: ['Pizza'],
    categories: ['Pizza', 'Pasta', 'Sides'],
    menu: [
      { category: 'Pizza', items: [
        { id: 'lp1', name: 'Veg Extravaganza', desc: 'Loaded with 6 different vegetables and extra cheese', price: 279, rating: 4.4, veg: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', variants: [{label:'7 inch',extra:0},{label:'10 inch',extra:100}], addons: [{label:'Extra Cheese',price:50}] },
        { id: 'lp2', name: 'Peri Peri Chicken Pizza', desc: 'Spicy peri peri chicken with onions and jalapenos', price: 329, rating: 4.5, veg: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Sachin K', rating: 4, date: '4 days ago', text: 'Best pizza value in Indore! Peri Peri is fire.' }]
  },
  {
    id: 'mojo-pizza', name: 'Mojo Pizza', cuisine: 'Pizza, Sides',
    rating: 4.2, time: '28 mins', dist: '3.1 KM', offer: '50% OFF 2nd Pizza', minOrder: 199, deliveryFee: 20,
    address: 'AB Road, Indore', hours: '10:30 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    tags: ['mojo', 'mojo pizza', 'pizza', 'gourmet pizza'],
    foodTypes: ['Pizza'],
    categories: ['Pizza', 'Sides'],
    menu: [
      { category: 'Pizza', items: [
        { id: 'mj1', name: 'Mexicana', desc: 'Jalapeños, red paprika, black olives and corn on thin crust', price: 249, rating: 4.1, veg: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', variants: [{label:'7 inch',extra:0},{label:'10 inch',extra:80}], addons: [] },
        { id: 'mj2', name: 'BBQ Basha', desc: 'BBQ chicken, mushroom and onion on thin crust with BBQ drizzle', price: 289, rating: 4.3, veg: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Akash T', rating: 4, date: '1 week ago', text: 'Good pizza, loved the thin crust options.' }]
  },
  {
    id: 'pizza-hut-indore', name: 'Pizza Hut', cuisine: 'Pizza, Pasta, Sides',
    rating: 4.2, time: '35 mins', dist: '3.3 KM', offer: 'Buy 1 Get 1', minOrder: 249, deliveryFee: 40,
    address: 'Sapna Sangeeta Road, Indore', hours: '11:00 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    tags: ['pizza hut', 'pizza', 'pan pizza', 'stuffed crust'],
    foodTypes: ['Pizza'],
    categories: ['Pizza', 'Pasta', 'Sides'],
    menu: [
      { category: 'Pizza', items: [
        { id: 'ph1', name: 'Veg Supremo Pizza', desc: 'Corn, capsicum, black olives, mushrooms and onions on pan crust', price: 349, rating: 4.3, veg: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', variants: [{label:'Personal',extra:0},{label:'Medium',extra:150},{label:'Large',extra:300}], addons: [{label:'Stuffed Crust',price:80}] },
        { id: 'ph2', name: 'Chicken BBQ Pizza', desc: 'Smoky BBQ chicken with onions on a buttery pan crust', price: 399, rating: 4.4, veg: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Prateek J', rating: 4, date: '1 week ago', text: 'Reliable as always. Pan pizza is always a treat.' }]
  },

  // ---- BURGERS ----
  {
    id: 'mcdonalds-indore', name: "McDonald's", cuisine: 'Burgers, Wraps, Fries',
    rating: 4.1, time: '20 mins', dist: '2.8 KM', offer: 'McSaver Meals from ₹89', minOrder: 149, deliveryFee: 30,
    address: 'Bhawarkua Square, Indore', hours: '8:00 AM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    tags: ["mcdonald's", 'mcdonalds', 'mc', 'burger', 'mcaloo', 'fries', 'mcflurry'],
    foodTypes: ['Burger'],
    categories: ['Burgers', 'Wraps', 'Sides', 'Desserts'],
    menu: [
      { category: 'Burgers', items: [
        { id: 'mc1', name: 'McAloo Tikki', desc: 'Seasoned potato patty with fresh lettuce and creamy sauce', price: 89, rating: 4.2, veg: true, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Patty',price:40}] },
        { id: 'mc2', name: 'Chicken Maharaja Mac', desc: 'Two grilled chicken patties with lettuce, onion and edam cheese', price: 199, rating: 4.3, veg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'mc3', name: 'McVeggie Burger', desc: 'Crispy veggie patty with fresh veggies and tangy sauce', price: 119, rating: 4.0, veg: true, image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [
      { name: 'Karan M', rating: 4, date: '2 days ago', text: 'Consistent quality and fast service!' },
      { name: 'Pooja R', rating: 4, date: '5 days ago', text: 'McAloo Tikki is my all-time fav. Never disappoints.' },
    ]
  },
  {
    id: 'burger-king-indore', name: 'Burger King', cuisine: 'Burgers, Wraps, Desserts',
    rating: 4.0, time: '25 mins', dist: '3.0 KM', offer: '2 Whoppers ₹299', minOrder: 149, deliveryFee: 35,
    address: 'D Mart, Vijay Nagar, Indore', hours: '9:00 AM – 12:00 AM',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    tags: ['burger king', 'burgerking', 'bk', 'whopper', 'burger'],
    foodTypes: ['Burger'],
    categories: ['Burgers', 'Sides', 'Desserts'],
    menu: [
      { category: 'Burgers', items: [
        { id: 'bk1', name: 'Veg Whopper', desc: 'Plant-based patty flame-grilled with fresh lettuce, tomatoes and mayo', price: 159, rating: 4.1, veg: true, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Cheese',price:30}] },
        { id: 'bk2', name: 'Chicken Whopper', desc: 'Flame-grilled chicken with crispy lettuce, tomatoes and creamy mayo', price: 199, rating: 4.2, veg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Nikhil G', rating: 4, date: '1 week ago', text: 'Great burgers! Love the flame-grilled taste.' }]
  },
  {
    id: 'kfc-indore', name: 'KFC', cuisine: 'Fried Chicken, Burgers, Wraps, Sides',
    rating: 4.2, time: '22 mins', dist: '2.5 KM', offer: 'Bucket for ₹399', minOrder: 199, deliveryFee: 30,
    address: 'C-21 Mall, AB Road, Indore', hours: '10:00 AM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80',
    tags: ['kfc', 'kentucky', 'fried chicken', 'bucket', 'zinger', 'chicken burger'],
    foodTypes: ['Burger'],
    categories: ['Chicken Buckets', 'Burgers', 'Wraps', 'Sides'],
    menu: [
      { category: 'Chicken Buckets', items: [
        { id: 'kfc1', name: 'Hot & Crispy Chicken Bucket (8 Pcs)', desc: 'KFC signature recipe — 8 pieces of juicy, crispy fried chicken', price: 599, rating: 4.5, veg: false, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=400&q=80', variants: [{label:'8 Pcs',extra:0},{label:'12 Pcs',extra:200}], addons: [{label:'Extra Dip',price:30}] },
        { id: 'kfc2', name: 'Popcorn Chicken', desc: 'Bite-sized crispy chicken pieces seasoned with bold spices', price: 199, rating: 4.3, veg: false, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80', variants: [{label:'Regular',extra:0},{label:'Large',extra:80}], addons: [] },
      ]},
      { category: 'Burgers', items: [
        { id: 'kfc3', name: 'Zinger Burger', desc: 'Crunchy chicken fillet with fresh lettuce, mayo and spicy sauce', price: 229, rating: 4.4, veg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Cheese',price:30}] },
        { id: 'kfc4', name: 'Veg Zinger', desc: 'Crispy veggie patty with lettuce, onion rings and creamy sauce', price: 179, rating: 4.1, veg: true, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
      { category: 'Wraps', items: [
        { id: 'kfc5', name: 'Classic Chicken Wrap', desc: 'Tender chicken strips wrapped in a soft tortilla with veggies and mayo', price: 169, rating: 4.2, veg: false, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [
      { name: 'Aditya S', rating: 4, date: '2 days ago', text: 'Zinger Burger never disappoints! Crispy and juicy.' },
      { name: 'Meera K', rating: 5, date: '1 week ago', text: 'Best fried chicken in town. Hot & Crispy bucket is amazing!' },
    ]
  },
  {
    id: 'bake-and-shake', name: 'Bake & Shake', cuisine: 'Milkshakes, Burgers, Desserts',
    rating: 4.5, time: '18 mins', dist: '1.9 KM', offer: 'Free Delivery', minOrder: 99, deliveryFee: 0,
    address: 'Treasure Island Mall, Vijay Nagar, Indore', hours: '10:30 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80',
    tags: ['bake and shake', 'milkshake', 'burger', 'dessert'],
    foodTypes: ['Burger', 'Desserts', 'Cakes'],
    categories: ['Milkshakes', 'Burgers', 'Desserts'],
    menu: [
      { category: 'Burgers', items: [
        { id: 'bs3', name: 'Double Decker Burger', desc: 'Two patties with double cheese, lettuce and secret sauce', price: 179, rating: 4.5, veg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
      { category: 'Milkshakes', items: [
        { id: 'bs1', name: 'Oreo Milkshake', desc: 'Thick Oreo cookie milkshake with whipped cream', price: 149, rating: 4.8, veg: true, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Rohit J', rating: 5, date: '2 days ago', text: 'Best milkshakes in Indore! So thick and creamy.' }]
  },
  {
    id: 'grill-n-burger', name: 'Grill N Burger', cuisine: 'Burgers, Grills, Fast Food',
    rating: 4.3, time: '20 mins', dist: '1.6 KM', offer: '₹40 OFF on ₹199', minOrder: 99, deliveryFee: 0,
    address: 'Palasia Square, Indore', hours: '12:00 PM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=600&q=80',
    tags: ['grill n burger', 'burger', 'grill', 'chicken burger'],
    foodTypes: ['Burger'],
    categories: ['Burgers', 'Grilled Items', 'Sides'],
    menu: [
      { category: 'Burgers', items: [
        { id: 'gnb1', name: 'Grilled Chicken Burger', desc: 'Chargrilled chicken breast with coleslaw and chipotle mayo', price: 149, rating: 4.4, veg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Cheese',price:20}] },
        { id: 'gnb2', name: 'Spicy Veg Stack', desc: 'Crispy spiced chickpea patty with fresh lettuce and sriracha', price: 119, rating: 4.2, veg: true, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Harish B', rating: 4, date: '5 days ago', text: 'Great grilled chicken burger, loved the charred flavor.' }]
  },

  // ---- BIRYANI ----
  {
    id: 'paradise-biryani', name: 'Paradise Biryani', cuisine: 'Biryani, Hyderabadi, North Indian',
    rating: 4.6, time: '35 mins', dist: '3.8 KM', offer: '20% OFF', minOrder: 199, deliveryFee: 30,
    address: 'Navlakha Square, Indore', hours: '11:00 AM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    tags: ['paradise', 'biryani', 'hyderabadi', 'dum biryani'],
    foodTypes: ['Biryani'],
    categories: ['Biryani', 'Curries', 'Desserts'],
    menu: [
      { category: 'Biryani', items: [
        { id: 'par1', name: 'Hyderabadi Dum Biryani', desc: 'Slow-cooked dum biryani with tender chicken and saffron', price: 249, rating: 4.7, veg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', variants: [{label:'Half',extra:0},{label:'Full',extra:100}], addons: [{label:'Extra Raita',price:30}] },
        { id: 'par2', name: 'Veg Dum Biryani', desc: 'Fresh vegetables layered with saffron rice in dum style', price: 179, rating: 4.5, veg: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Sameer H', rating: 5, date: '1 day ago', text: 'Authentic Hyderabadi flavors! Best dum biryani in Indore.' }]
  },
  {
    id: 'hyd-biryani-house', name: 'Hyderabadi Biryani House', cuisine: 'Biryani, Kebabs, Curries',
    rating: 4.5, time: '30 mins', dist: '2.7 KM', offer: '₹60 OFF on ₹299', minOrder: 199, deliveryFee: 25,
    address: 'Rajendra Nagar, Indore', hours: '11:30 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    tags: ['hyderabadi', 'biryani house', 'biryani', 'dum', 'kebab'],
    foodTypes: ['Biryani'],
    categories: ['Biryani', 'Kebabs', 'Curry'],
    menu: [
      { category: 'Biryani', items: [
        { id: 'hyb1', name: 'Mutton Dum Biryani', desc: 'Tender mutton pieces slow-cooked with fragrant basmati rice', price: 329, rating: 4.8, veg: false, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80', variants: [{label:'Half',extra:0},{label:'Full',extra:120}], addons: [] },
        { id: 'hyb2', name: 'Chicken Dum Biryani', desc: 'Spiced chicken layers with long grain basmati rice', price: 249, rating: 4.6, veg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Faizan A', rating: 5, date: '2 days ago', text: 'The mutton biryani is absolutely divine! Highly recommended.' }]
  },
  {
    id: 'biryani-zone', name: 'Biryani Zone', cuisine: 'Biryani, Rolls, Fast Delivery',
    rating: 4.3, time: '20 mins', dist: '1.8 KM', offer: 'Free Delivery', minOrder: 149, deliveryFee: 0,
    address: 'Scheme 78, Vijay Nagar, Indore', hours: '11:00 AM – 12:00 AM',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    tags: ['biryani zone', 'biryani', 'fast delivery'],
    foodTypes: ['Biryani'],
    categories: ['Biryani', 'Rolls'],
    menu: [
      { category: 'Biryani', items: [
        { id: 'bz1', name: 'Chicken Biryani Box', desc: 'Quick-serve chicken biryani with raita and salad', price: 179, rating: 4.3, veg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'bz2', name: 'Paneer Biryani', desc: 'Aromatic paneer biryani with saffron and mint', price: 159, rating: 4.2, veg: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Rahul T', rating: 4, date: '3 days ago', text: 'Super fast delivery! Biryani tastes homemade.' }]
  },
  {
    id: 'dum-pukht', name: 'Dum Pukht Biryani', cuisine: 'Awadhi Biryani, Mughlai, Kebabs',
    rating: 4.7, time: '40 mins', dist: '4.5 KM', offer: '25% OFF', minOrder: 249, deliveryFee: 35,
    address: 'Race Course Road, Indore', hours: '12:00 PM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    tags: ['dum pukht', 'awadhi', 'biryani', 'mughlai', 'lucknowi'],
    foodTypes: ['Biryani'],
    categories: ['Biryani', 'Kebabs', 'Curry'],
    menu: [
      { category: 'Biryani', items: [
        { id: 'dp1', name: 'Awadhi Dum Biryani', desc: 'Authentic Lucknowi slow-cooked dum biryani with kewra water', price: 299, rating: 4.8, veg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', variants: [{label:'Half',extra:0},{label:'Full',extra:150}], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Wasim K', rating: 5, date: '1 week ago', text: 'Best Awadhi Biryani in Indore. Worth every penny!' }]
  },
  {
    id: 'moti-mahal', name: 'Moti Mahal Deluxe', cuisine: 'North Indian, Mughlai, Biryani',
    rating: 4.5, time: '30 mins', dist: '3.6 KM', offer: '20% OFF', minOrder: 249, deliveryFee: 30,
    address: 'Race Course Road, Indore', hours: '12:00 PM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
    tags: ['moti mahal', 'butter chicken', 'tandoor', 'biryani'],
    foodTypes: ['Biryani'],
    categories: ['Starters', 'Curries', 'Biryani'],
    menu: [
      { category: 'Biryani', items: [
        { id: 'mm4', name: 'Dum Murgh Biryani', desc: 'Sealed and slow-cooked saffron rice with marinated chicken', price: 289, rating: 4.8, veg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Deepak J', rating: 4, date: '2 weeks ago', text: 'Classic North Indian flavors. Dum Biryani was excellent!' }]
  },

  // ---- CHINESE ----
  {
    id: 'golden-dragon', name: 'Golden Dragon', cuisine: 'Chinese, Thai, Indo-Chinese',
    rating: 4.3, time: '32 mins', dist: '3.8 KM', offer: '25% OFF', minOrder: 199, deliveryFee: 35,
    address: 'Near C21 Mall, Vijay Nagar, Indore', hours: '12:00 PM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    tags: ['golden dragon', 'chinese', 'noodles', 'manchurian', 'spring roll'],
    foodTypes: ['Chinese'],
    categories: ['Starters', 'Noodles & Rice', 'Soups'],
    menu: [
      { category: 'Noodles & Rice', items: [
        { id: 'gd3', name: 'Schezwan Fried Rice', desc: 'Wok-tossed rice with vegetables and fiery Schezwan sauce', price: 169, rating: 4.4, veg: true, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80', variants: [{label:'Veg',extra:0},{label:'Chicken',extra:50}], addons: [] },
        { id: 'gd4', name: 'Hakka Noodles', desc: 'Stir-fried noodles with fresh vegetables and soy sauce', price: 149, rating: 4.3, veg: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80', variants: [{label:'Veg',extra:0},{label:'Chicken',extra:50}], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Saurabh G', rating: 4, date: '4 days ago', text: 'Best Chinese in Indore! Schezwan fried rice hits different.' }]
  },
  {
    id: 'chopsticks', name: 'Chopsticks Restaurant', cuisine: 'Chinese, Thai, Pan Asian',
    rating: 4.4, time: '28 mins', dist: '3.2 KM', offer: '20% OFF', minOrder: 199, deliveryFee: 30,
    address: 'MG Road, Indore', hours: '12:00 PM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    tags: ['chopsticks', 'chinese', 'thai', 'dim sum', 'noodles'],
    foodTypes: ['Chinese'],
    categories: ['Dim Sum', 'Noodles', 'Thai Curries'],
    menu: [
      { category: 'Dim Sum', items: [
        { id: 'cs1', name: 'Steamed Veg Dimsums (6 pcs)', desc: 'Delicate steamed dumplings with spiced vegetable filling', price: 159, rating: 4.5, veg: true, image: 'https://images.unsplash.com/photo-1548696887-63fd9fcc7b16?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Soy Sauce',price:10}] },
        { id: 'cs2', name: 'Chicken Dimsums (6 pcs)', desc: 'Silky dimsums filled with minced chicken and ginger', price: 189, rating: 4.6, veg: false, image: 'https://images.unsplash.com/photo-1548696887-63fd9fcc7b16?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Priya M', rating: 5, date: '3 days ago', text: 'Amazing dim sums! Best Pan Asian food in Indore.' }]
  },
  {
    id: 'yo-china', name: 'Yo! China', cuisine: 'Chinese, Indian Chinese, Noodles',
    rating: 4.1, time: '30 mins', dist: '2.9 KM', offer: '30% OFF', minOrder: 149, deliveryFee: 25,
    address: 'South Tukoganj, Indore', hours: '11:00 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    tags: ['yo china', 'chinese', 'noodles', 'fried rice', 'momos'],
    foodTypes: ['Chinese'],
    categories: ['Starters', 'Noodles', 'Rice'],
    menu: [
      { category: 'Noodles', items: [
        { id: 'yc1', name: 'Triple Schezwan Noodles', desc: 'Fiery schezwan sauce noodles with veg, egg and chicken', price: 199, rating: 4.2, veg: false, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'yc2', name: 'Veg Chowmein', desc: 'Stir-fried noodles with mixed vegetables and soy sauce', price: 149, rating: 4.0, veg: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Kiran S', rating: 4, date: '1 week ago', text: 'Good Chinese food at reasonable prices.' }]
  },

  // ---- SOUTH INDIAN ----
  {
    id: 'south-spice', name: 'South Spice', cuisine: 'South Indian, Dosa, Idli, Filter Coffee',
    rating: 4.6, time: '22 mins', dist: '2.7 KM', offer: '15% OFF', minOrder: 99, deliveryFee: 20,
    address: 'Bengali Square, Indore', hours: '7:00 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    tags: ['south spice', 'south indian', 'dosa', 'idli', 'vada', 'sambar'],
    foodTypes: ['South Indian'],
    categories: ['Dosas', 'Idli & Vada', 'Rice & Meals'],
    menu: [
      { category: 'Dosas', items: [
        { id: 'ss1', name: 'Mysore Masala Dosa', desc: 'Crispy dosa with spicy Mysore chutney and potato masala', price: 99, rating: 4.8, veg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Extra Sambar',price:15}] },
        { id: 'ss2', name: 'Cheese Dosa', desc: 'Golden dosa stuffed with spiced potato and melted cheese', price: 119, rating: 4.7, veg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Ramesh I', rating: 5, date: '2 days ago', text: 'Authentic South Indian taste! Mysore Dosa is fabulous.' }]
  },
  {
    id: 'sarafa-bazaar', name: 'Sarafa Night Bazaar', cuisine: 'Street Food, Chaat, South Indian',
    rating: 4.8, time: '25 mins', dist: '3.5 KM', offer: '₹40 OFF on ₹199', minOrder: 99, deliveryFee: 20,
    address: 'Sarafa Bazaar, Old Palasia, Indore', hours: '8:00 PM – 2:00 AM',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
    tags: ['sarafa', 'night bazaar', 'chaat', 'bhutte', 'dosa'],
    foodTypes: ['South Indian', 'Desserts', 'Healthy'],
    categories: ['Chaat', 'South Indian', 'Sweets'],
    menu: [
      { category: 'South Indian', items: [
        { id: 'sa3', name: 'Masala Dosa', desc: 'Crispy rice crepe with spiced potato filling, served with sambar', price: 89, rating: 4.7, veg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Kamal S', rating: 5, date: '1 day ago', text: 'Sarafa is an experience! Bhutte ka Kees is a MUST!' }]
  },
  {
    id: 'udupi-kitchen', name: 'Udupi Kitchen', cuisine: 'South Indian, Pure Veg, Dosa, Meals',
    rating: 4.5, time: '20 mins', dist: '2.3 KM', offer: '10% OFF', minOrder: 99, deliveryFee: 15,
    address: 'Annapurna Road, Indore', hours: '7:30 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    tags: ['udupi', 'south indian', 'dosa', 'idli', 'veg meals'],
    foodTypes: ['South Indian', 'Thali', 'Healthy'],
    categories: ['Dosas', 'Idli & Vada', 'Meals'],
    menu: [
      { category: 'Dosas', items: [
        { id: 'ud1', name: 'Rava Dosa', desc: 'Crispy semolina crepe with cashews and coriander', price: 79, rating: 4.6, veg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'ud2', name: 'Onion Uttapam', desc: 'Thick soft rice pancake topped with caramelized onions', price: 69, rating: 4.4, veg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Sunita N', rating: 5, date: '3 days ago', text: 'Reminds me of authentic South Indian restaurants in Chennai!' }]
  },
  {
    id: 'dosa-plaza', name: 'Dosa Plaza', cuisine: 'South Indian, Dosa Varieties, Beverages',
    rating: 4.3, time: '18 mins', dist: '1.5 KM', offer: 'Free Delivery', minOrder: 79, deliveryFee: 0,
    address: 'Vijay Nagar Main Road, Indore', hours: '8:00 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    tags: ['dosa plaza', 'dosa', 'south indian', 'crispy dosa'],
    foodTypes: ['South Indian'],
    categories: ['Dosas', 'Beverages'],
    menu: [
      { category: 'Dosas', items: [
        { id: 'dp2', name: 'Spring Dosa', desc: 'Crispy dosa filled with Chinese-style spring roll filling', price: 89, rating: 4.4, veg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'dp3', name: 'Plain Dosa', desc: 'Classic crispy plain dosa served with sambar and chutney', price: 59, rating: 4.2, veg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Mridul S', rating: 4, date: '1 week ago', text: 'Great dosa varieties! The spring dosa is unique.' }]
  },

  // ---- THALI ----
  {
    id: 'daal-baati-club', name: 'Daal Baati Club', cuisine: 'Rajasthani, Thali, Pure Veg',
    rating: 4.7, time: '35 mins', dist: '4.1 KM', offer: '₹50 OFF on ₹299', minOrder: 149, deliveryFee: 30,
    address: 'LIG Square, Vijay Nagar, Indore', hours: '11:00 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    tags: ['daal baati', 'rajasthani', 'thali', 'churma'],
    foodTypes: ['Thali'],
    categories: ['Daal Baati', 'Thali', 'Sweets'],
    menu: [
      { category: 'Daal Baati', items: [
        { id: 'db1', name: 'Daal Baati Churma Thali', desc: 'Traditional Rajasthani daal, 3 baatis, churma, 2 sabzis and papad', price: 199, rating: 4.9, veg: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', variants: [{label:'Regular',extra:0},{label:'Special',extra:60}], addons: [{label:'Extra Ghee',price:30}] },
      ]},
    ],
    reviews: [{ name: 'Bharat S', rating: 5, date: '1 day ago', text: 'Authentic Rajasthani flavors! Daal Baati Thali is worth every rupee.' }]
  },
  {
    id: 'rajdhani-thali', name: 'Rajdhani Thali', cuisine: 'Gujarati, Rajasthani, Unlimited Thali',
    rating: 4.6, time: '30 mins', dist: '3.4 KM', offer: '₹75 OFF on ₹399', minOrder: 299, deliveryFee: 40,
    address: 'Nehru Park Road, Indore', hours: '11:30 AM – 3:30 PM, 7:00 PM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    tags: ['rajdhani', 'thali', 'gujarati', 'rajasthani', 'unlimited'],
    foodTypes: ['Thali'],
    categories: ['Unlimited Thali', 'Sweets'],
    menu: [
      { category: 'Unlimited Thali', items: [
        { id: 'rj1', name: 'Rajdhani Special Thali', desc: 'Unlimited Gujarati-Rajasthani thali with rotis, dal, 3 sabzis, rice and dessert', price: 349, rating: 4.7, veg: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Meena P', rating: 5, date: '4 days ago', text: 'Unlimited thali with amazing variety! Value for money.' }]
  },
  {
    id: 'shreenathji-veg', name: 'Shreenathji Pure Veg', cuisine: 'Pure Veg, Thali, North Indian',
    rating: 4.4, time: '25 mins', dist: '2.2 KM', offer: 'Free Delivery', minOrder: 99, deliveryFee: 0,
    address: 'Bhawarkua Main Road, Indore', hours: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    tags: ['shreenathji', 'pure veg', 'thali', 'north indian'],
    foodTypes: ['Thali', 'Healthy'],
    categories: ['Thali', 'Sabzi', 'Rotis'],
    menu: [
      { category: 'Thali', items: [
        { id: 'sn1', name: 'Shreenathji Thali', desc: 'Dal tadka, 2 sabzis, roti, rice, salad, papad and pickle', price: 129, rating: 4.5, veg: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Dinesh A', rating: 4, date: '5 days ago', text: 'Simple and satisfying home-style thali. Good quality.' }]
  },

  // ---- ROLLS ----
  {
    id: 'jimmy-tandoor', name: "Jimmy's Tandoor", cuisine: 'Kathi Rolls, Kebabs, North Indian',
    rating: 4.6, time: '28 mins', dist: '2.9 KM', offer: '20% OFF', minOrder: 199, deliveryFee: 25,
    address: 'Patel Bridge Corner, Vijay Nagar, Indore', hours: '12:00 PM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=600&q=80',
    tags: ['jimmy', 'tandoor', 'roll', 'tikka', 'kebab'],
    foodTypes: ['Rolls'],
    categories: ['Kebabs & Tikka', 'Rolls'],
    menu: [
      { category: 'Rolls', items: [
        { id: 'jt3', name: 'Chicken Tikka Roll', desc: 'Tandoori chicken tikka wrapped in flaky paratha with onion and chutneys', price: 149, rating: 4.7, veg: false, image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'jt4', name: 'Paneer Tikka Roll', desc: 'Marinated paneer tikka with onions and green chutney in paratha', price: 129, rating: 4.6, veg: true, image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Vikas T', rating: 5, date: '2 days ago', text: 'Best rolls in Indore! Chicken tikka roll is divine.' }]
  },
  {
    id: 'rolls-n-wraps', name: 'Rolls n Wraps', cuisine: 'Kathi Rolls, Wraps, Fast Food',
    rating: 4.4, time: '15 mins', dist: '1.2 KM', offer: '₹30 OFF on ₹149', minOrder: 89, deliveryFee: 0,
    address: 'Near Bombay Hospital, Vijay Nagar, Indore', hours: '11:00 AM – 11:30 PM',
    image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=600&q=80',
    tags: ['rolls', 'kathi roll', 'frankie', 'wrap'],
    foodTypes: ['Rolls'],
    categories: ['Chicken Rolls', 'Veg Rolls'],
    menu: [
      { category: 'Veg Rolls', items: [
        { id: 'rw3', name: 'Paneer Tikka Roll', desc: 'Paneer cubes grilled and wrapped in paratha', price: 89, rating: 4.5, veg: true, image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
        { id: 'rw4', name: 'Aloo Frankie', desc: 'Mumbai-style spiced potato roll with tangy chutney', price: 59, rating: 4.3, veg: true, image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Ashish M', rating: 5, date: '1 day ago', text: 'Fastest delivery and tasty rolls!' }]
  },
  {
    id: 'kathi-junction', name: 'Kathi Junction', cuisine: 'Kathi Rolls, Frankie, Wraps',
    rating: 4.4, time: '18 mins', dist: '2.0 KM', offer: 'Free Delivery', minOrder: 99, deliveryFee: 0,
    address: 'Treasure Island Area, Vijay Nagar, Indore', hours: '12:00 PM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=600&q=80',
    tags: ['kathi junction', 'kathi', 'roll', 'frankie', 'wrap'],
    foodTypes: ['Rolls'],
    categories: ['Egg Rolls', 'Veg Rolls', 'Chicken Rolls'],
    menu: [
      { category: 'Chicken Rolls', items: [
        { id: 'kj1', name: 'Egg Chicken Kathi Roll', desc: 'Egg-coated paratha with spiced chicken strips and onions', price: 109, rating: 4.5, veg: false, image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Sonu K', rating: 4, date: '3 days ago', text: 'Super tasty kathi rolls! Will order again.' }]
  },
  {
    id: 'roll-brothers', name: 'Roll Brothers', cuisine: 'Rolls, Wraps, Indo-Chinese',
    rating: 4.2, time: '15 mins', dist: '1.0 KM', offer: '₹25 OFF', minOrder: 79, deliveryFee: 0,
    address: 'Palasia Square, Indore', hours: '11:30 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=600&q=80',
    tags: ['roll brothers', 'roll', 'wrap', 'schezwan roll'],
    foodTypes: ['Rolls'],
    categories: ['Veg Rolls', 'Non-Veg Rolls', 'Chinese Rolls'],
    menu: [
      { category: 'Veg Rolls', items: [
        { id: 'rb1', name: 'Schezwan Veggie Roll', desc: 'Spicy schezwan sautéed vegetables wrapped in egg paratha', price: 69, rating: 4.2, veg: true, image: 'https://images.unsplash.com/photo-1626776877813-e9ff2b54e6b2?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Rahul P', rating: 4, date: '1 week ago', text: 'Quick bites for lunch! Schezwan roll is great.' }]
  },

  // ---- HEALTHY ----
  {
    id: 'green-leaf-cafe', name: 'Green Leaf Cafe', cuisine: 'Healthy, Salads, Juices, Wraps',
    rating: 4.4, time: '20 mins', dist: '2.0 KM', offer: '10% OFF', minOrder: 129, deliveryFee: 0,
    address: 'Scheme 54, Vijay Nagar, Indore', hours: '8:00 AM – 9:00 PM',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    tags: ['green leaf', 'healthy', 'salad', 'juice', 'smoothie'],
    foodTypes: ['Healthy', 'Rolls'],
    categories: ['Salads', 'Wraps', 'Juices'],
    menu: [
      { category: 'Salads', items: [
        { id: 'gl1', name: 'Greek Salad Bowl', desc: 'Cucumbers, tomatoes, olives, feta cheese with oregano dressing', price: 179, rating: 4.6, veg: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [{label:'Add Grilled Chicken',price:70}] },
      ]},
    ],
    reviews: [{ name: 'Dr. Priya V', rating: 5, date: '4 days ago', text: 'Finally a healthy option in Indore! Amazing quinoa bowl.' }]
  },
  {
    id: 'nutri-bowl', name: 'Nutri Bowl', cuisine: 'Healthy, Bowls, Smoothies, Protein',
    rating: 4.5, time: '22 mins', dist: '2.2 KM', offer: 'Free Delivery', minOrder: 149, deliveryFee: 0,
    address: 'Near Apollo Hospital, Vijay Nagar, Indore', hours: '7:00 AM – 9:00 PM',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    tags: ['nutri bowl', 'healthy', 'protein', 'smoothie bowl', 'diet'],
    foodTypes: ['Healthy'],
    categories: ['Smoothie Bowls', 'Protein Meals', 'Fresh Juices'],
    menu: [
      { category: 'Smoothie Bowls', items: [
        { id: 'nb1', name: 'Acai Smoothie Bowl', desc: 'Thick acai blend topped with granola, banana and mixed berries', price: 249, rating: 4.7, veg: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
      { category: 'Protein Meals', items: [
        { id: 'nb2', name: 'Chicken Protein Bowl', desc: 'Grilled chicken, quinoa, roasted veggies and tahini', price: 299, rating: 4.6, veg: false, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Fitness Yogi', rating: 5, date: '2 days ago', text: 'The best healthy food in Indore! Protein bowl is amazing.' }]
  },
  {
    id: 'fit-bites', name: 'Fit Bites', cuisine: 'Healthy, Low-Calorie, Wraps, Juices',
    rating: 4.2, time: '18 mins', dist: '1.7 KM', offer: '15% OFF', minOrder: 99, deliveryFee: 0,
    address: 'AB Road, Indore', hours: '8:30 AM – 8:30 PM',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    tags: ['fit bites', 'healthy', 'diet', 'low calorie', 'salad'],
    foodTypes: ['Healthy'],
    categories: ['Low-Cal Meals', 'Wraps', 'Juices'],
    menu: [
      { category: 'Low-Cal Meals', items: [
        { id: 'fb1', name: 'Detox Salad', desc: 'Kale, spinach, cucumber, seeds and lemon-honey dressing', price: 159, rating: 4.3, veg: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Aditi W', rating: 4, date: '5 days ago', text: 'Clean and healthy food. Great for diet!' }]
  },

  // ---- DESSERTS & CAKES ----
  {
    id: 'cake-walk-bakery', name: 'Cake Walk Bakery', cuisine: 'Cakes, Pastries, Desserts, Bread',
    rating: 4.6, time: '25 mins', dist: '2.0 KM', offer: '₹50 OFF on ₹399', minOrder: 199, deliveryFee: 30,
    address: 'South Tukoganj, Indore', hours: '8:00 AM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    tags: ['cake walk', 'bakery', 'cake', 'pastry', 'dessert'],
    foodTypes: ['Cakes', 'Desserts'],
    categories: ['Cakes', 'Pastries', 'Cookies'],
    menu: [
      { category: 'Cakes', items: [
        { id: 'cw1', name: 'Red Velvet Cake', desc: 'Moist red velvet sponge with cream cheese frosting', price: 379, rating: 4.7, veg: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', variants: [{label:'500g',extra:0},{label:'1 Kg',extra:320}], addons: [] },
        { id: 'cw2', name: 'Butterscotch Cake', desc: 'Creamy butterscotch layered cake with crunchy praline toppings', price: 349, rating: 4.6, veg: true, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&q=80', variants: [{label:'500g',extra:0},{label:'1 Kg',extra:300}], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Ruchi B', rating: 5, date: '3 days ago', text: 'Best bakery in Indore! Red velvet cake is phenomenal.' }]
  },
  {
    id: 'just-bake', name: 'Just Bake', cuisine: 'Bakery, Cakes, Cupcakes, Macarons',
    rating: 4.4, time: '20 mins', dist: '2.5 KM', offer: '20% OFF', minOrder: 149, deliveryFee: 25,
    address: 'Vijay Nagar, Indore', hours: '9:00 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    tags: ['just bake', 'bakery', 'cake', 'cupcake', 'macaron'],
    foodTypes: ['Cakes', 'Desserts'],
    categories: ['Cakes', 'Cupcakes', 'Pastries'],
    menu: [
      { category: 'Cupcakes', items: [
        { id: 'jb1', name: 'Choco Lava Cupcake', desc: 'Warm chocolate cupcake with a gooey molten center', price: 79, rating: 4.5, veg: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
      { category: 'Cakes', items: [
        { id: 'jb2', name: 'Mango Cheesecake', desc: 'Creamy no-bake cheesecake with fresh Alphonso mango topping', price: 349, rating: 4.6, veg: true, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80', variants: [], addons: [] },
      ]},
    ],
    reviews: [{ name: 'Tanisha K', rating: 4, date: '1 week ago', text: 'Cupcakes are divine! Mango cheesecake is heaven.' }]
  },
];

// Initialize in localStorage if not already present
if (typeof window !== 'undefined' && !localStorage.getItem('swiggy_restaurants')) {
  localStorage.setItem('swiggy_restaurants', JSON.stringify(defaultRestaurants));
}

// Dynamically read from localStorage
export const restaurants = typeof window !== 'undefined' && localStorage.getItem('swiggy_restaurants')
  ? JSON.parse(localStorage.getItem('swiggy_restaurants'))
  : defaultRestaurants;

export const saveRestaurants = (updatedList) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('swiggy_restaurants', JSON.stringify(updatedList));
  }
};

const getLiveRestaurants = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('swiggy_restaurants');
    if (data) return JSON.parse(data);
  }
  return restaurants;
};

// ============================================================
// Helper: Get restaurants by category (STRICT - uses foodTypes only)
// ============================================================
export const getRestaurantsByCategory = (categoryName) => {
  return getLiveRestaurants().filter(rest =>
    rest.foodTypes && rest.foodTypes.includes(categoryName)
  );
};

// Helper: get all unique food items across all restaurants for a given category
export const getItemsByCategory = (categoryName) => {
  const norm = categoryName.toLowerCase();
  const results = [];
  getLiveRestaurants().forEach(rest => {
    rest.menu.forEach(section => {
      section.items.forEach(item => {
        if (
          section.category.toLowerCase().includes(norm) ||
          item.name.toLowerCase().includes(norm)
        ) {
          results.push({ ...item, restaurantName: rest.name, restaurantId: rest.id });
        }
      });
    });
  });
  return results;
};

// Helper: get single item by id across all restaurants
export const getItemById = (itemId) => {
  for (const rest of getLiveRestaurants()) {
    for (const section of rest.menu) {
      for (const item of section.items) {
        if (item.id === itemId) {
          return { ...item, restaurantName: rest.name, restaurantId: rest.id, restaurantRating: rest.rating };
        }
      }
    }
  }
  return null;
};
