const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/swiggy_clone');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    console.log('Database cleared!');

    // Create Admin User
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@swiggy.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999'
    });

    // Create Merchant User
    const merchant = await User.create({
      name: 'Nafees Owner',
      email: 'nafees@swiggy.com',
      password: 'merchant123',
      role: 'merchant',
      phone: '8888888888'
    });

    console.log('Default users created.');

    // Seed Restaurant
    const restaurant = await Restaurant.create({
      owner: merchant._id,
      name: 'Nafees Restaurant',
      description: 'Mughlai, Biryani, North Indian Specialities',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
      cuisine: ['Mughlai', 'Biryani', 'North Indian'],
      rating: 4.6,
      numReviews: 48,
      deliveryTime: 30,
      costForTwo: 400,
      address: {
        street: 'Near Masjid Square, Palasia',
        city: 'Indore',
        state: 'MP',
        postalCode: '452010'
      },
      isActive: true, // Auto-approved for seed testing
      isOpened: true
    });

    console.log('Nafees Restaurant seeded.');

    // Seed Menu Items
    const menuItems = [
      {
        restaurant: restaurant._id,
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice slow-cooked with tender chicken and saffron',
        price: 229,
        category: 'Biryani',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80'
      },
      {
        restaurant: restaurant._id,
        name: 'Mutton Biryani',
        description: 'Slow-cooked mutton pieces layered with fragrant Basmati rice',
        price: 299,
        category: 'Biryani',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80'
      },
      {
        restaurant: restaurant._id,
        name: 'Veg Biryani',
        description: 'Garden vegetables layered with saffron rice',
        price: 169,
        category: 'Biryani',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80'
      },
      {
        restaurant: restaurant._id,
        name: 'Butter Chicken',
        description: 'Tender chicken in rich creamy tomato-based sauce',
        price: 249,
        category: 'Curry',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80'
      },
      {
        restaurant: restaurant._id,
        name: 'Dal Makhani',
        description: 'Black lentils slow-cooked overnight with butter and cream',
        price: 179,
        category: 'Curry',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80'
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded successfully.');

    mongoose.connection.close();
    console.log('Seeding process finished!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
