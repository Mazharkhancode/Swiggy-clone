const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalMerchants = await User.countDocuments({ role: 'merchant' });
    const totalDelivery = await User.countDocuments({ role: 'delivery' });
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from completed orders
    const completedOrders = await Order.find({ orderStatus: 'delivered' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({
      stats: {
        totalUsers,
        totalMerchants,
        totalDelivery,
        totalRestaurants,
        totalOrders,
        totalRevenue: Number(totalRevenue.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all restaurants (for approval/moderation)
// @route   GET /api/admin/restaurants
// @access  Private (Admin only)
const getAdminRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email phone');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Activate a restaurant
// @route   PUT /api/admin/restaurants/:id/approve
// @access  Private (Admin only)
const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.isActive = true;
    const updatedRestaurant = await restaurant.save();

    res.json({
      message: 'Restaurant approved and activated successfully',
      restaurant: updatedRestaurant
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAdminRestaurants,
  approveRestaurant,
  getAdminUsers
};
