const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Protect all order routes
router.use(protect);

router.route('/').post(createOrder);
router.route('/myorders').get(getMyOrders);
router.route('/:id').get(getOrderById);

module.exports = router;
