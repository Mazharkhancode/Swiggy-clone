const express = require('express');
const router = express.Router();
const {
  createOrUpdateRestaurant,
  getPartnerRestaurant,
  toggleOpenStatus,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPartnerOrders,
  updatePartnerOrderStatus
} = require('../controllers/restaurantController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Lock all partner routes to logged-in users with role 'merchant'
router.use(protect);
router.use(authorizeRoles('merchant'));

router
  .route('/restaurant')
  .get(getPartnerRestaurant)
  .post(createOrUpdateRestaurant);

router.put('/restaurant/toggle', toggleOpenStatus);

router.route('/menu').post(addMenuItem);
router.route('/menu/:id').put(updateMenuItem).delete(deleteMenuItem);

router.route('/orders').get(getPartnerOrders);
router.route('/orders/:id/status').put(updatePartnerOrderStatus);

module.exports = router;
