const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500' },
  category: { type: String, required: true }, // e.g. Pizza, Burger, Dessert, Drinks
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true }, // In stock / Out of stock
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
