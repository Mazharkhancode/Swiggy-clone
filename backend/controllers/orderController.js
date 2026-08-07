const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { restaurantId, orderItems, shippingAddress, paymentMethod } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Verify and calculate price from DB, not trusting frontend price calculations entirely
    let itemsPrice = 0;
    const dbOrderItems = [];

    for (const item of orderItems) {
      const dbItem = await MenuItem.findById(item.menuItem);
      if (!dbItem) {
        return res.status(404).json({ message: `Item ${item.name} not found` });
      }
      itemsPrice += dbItem.price * item.qty;
      dbOrderItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        qty: item.qty,
        price: dbItem.price
      });
    }

    // Calculations
    const deliveryPrice = itemsPrice > 500 ? 0 : 40; // Free delivery above 500
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2)); // 5% GST
    const totalPrice = itemsPrice + deliveryPrice + taxPrice;

    const order = new Order({
      customer: req.user._id,
      restaurant: restaurantId,
      orderItems: dbOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      deliveryPrice,
      taxPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name image address deliveryTime')
      .populate('deliveryAgent', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow customer, merchant of the restaurant, or admin to view
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isMerchant = req.user.role === 'merchant' && order.restaurant.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isDelivery = req.user.role === 'delivery' && order.deliveryAgent && order.deliveryAgent._id.toString() === req.user._id.toString();

    if (!isCustomer && !isMerchant && !isAdmin && !isDelivery) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
