const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String, default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500' },
  cuisine: [{ type: String }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  deliveryTime: { type: Number, default: 30 }, // in minutes
  costForTwo: { type: Number, default: 300 },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  isActive: { type: Boolean, default: false }, // Approved by admin
  isOpened: { type: Boolean, default: true },  // Toggled online/offline by merchant
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
