const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @desc    Get all active/approved restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  const { search, cuisine, isVeg } = req.query;

  try {
    let query = { isActive: true }; // Only show approved restaurants

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurant details and menu items
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ message: 'Restaurant not found or not active' });
    }

    const menuItems = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true });

    res.json({
      restaurant,
      menu: menuItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single menu item details
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemDetails = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('restaurant', 'name rating isOpened');

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantDetails,
  getMenuItemDetails
};
