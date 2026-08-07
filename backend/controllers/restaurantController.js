const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// @desc    Create or update partner restaurant profile
// @route   POST /api/partner/restaurant
// @access  Private (Merchant only)
const createOrUpdateRestaurant = async (req, res) => {
  const { name, description, cuisine, deliveryTime, costForTwo, address, image } = req.body;

  try {
    let restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (restaurant) {
      // Update
      restaurant.name = name || restaurant.name;
      restaurant.description = description || restaurant.description;
      restaurant.cuisine = cuisine || restaurant.cuisine;
      restaurant.deliveryTime = deliveryTime || restaurant.deliveryTime;
      restaurant.costForTwo = costForTwo || restaurant.costForTwo;
      restaurant.address = address || restaurant.address;
      restaurant.image = image || restaurant.image;

      const updatedRestaurant = await restaurant.save();
      return res.json(updatedRestaurant);
    } else {
      // Create (Defaults to active: false until approved by Admin)
      const newRestaurant = new Restaurant({
        owner: req.user._id,
        name,
        description,
        cuisine,
        deliveryTime,
        costForTwo,
        address,
        image
      });

      const createdRestaurant = await newRestaurant.save();
      return res.status(201).json(createdRestaurant);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get partner restaurant profile
// @route   GET /api/partner/restaurant
// @access  Private (Merchant only)
const getPartnerRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant profile not found for this partner' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle open/close status of restaurant
// @route   PUT /api/partner/restaurant/toggle
// @access  Private (Merchant only)
const toggleOpenStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.isOpened = !restaurant.isOpened;
    const updated = await restaurant.save();
    res.json({ isOpened: updated.isOpened });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add menu item to restaurant
// @route   POST /api/partner/menu
// @access  Private (Merchant only)
const addMenuItem = async (req, res) => {
  const { name, description, price, category, isVeg, image } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant profile not found' });
    }

    const menuItem = new MenuItem({
      restaurant: restaurant._id,
      name,
      description,
      price,
      category,
      isVeg,
      image
    });

    const savedItem = await menuItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/partner/menu/:id
// @access  Private (Merchant only)
const updateMenuItem = async (req, res) => {
  const { name, description, price, category, isVeg, isAvailable, image } = req.body;

  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Verify ownership
    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this menu item' });
    }

    menuItem.name = name !== undefined ? name : menuItem.name;
    menuItem.description = description !== undefined ? description : menuItem.description;
    menuItem.price = price !== undefined ? price : menuItem.price;
    menuItem.category = category !== undefined ? category : menuItem.category;
    menuItem.isVeg = isVeg !== undefined ? isVeg : menuItem.isVeg;
    menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;
    menuItem.image = image !== undefined ? image : menuItem.image;

    const updatedItem = await menuItem.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/partner/menu/:id
// @access  Private (Merchant only)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this menu item' });
    }

    await MenuItem.deleteOne({ _id: req.params.id });
    res.json({ message: 'Menu item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders for the merchant's restaurant
// @route   GET /api/partner/orders
// @access  Private (Merchant only)
const getPartnerOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/partner/orders/:id/status
// @access  Private (Merchant only)
const updatePartnerOrderStatus = async (req, res) => {
  const { status } = req.body; // e.g. 'preparing', 'ready', 'cancelled'

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.orderStatus = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateRestaurant,
  getPartnerRestaurant,
  toggleOpenStatus,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPartnerOrders,
  updatePartnerOrderStatus
};
