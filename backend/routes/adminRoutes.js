const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminRestaurants,
  approveRestaurant,
  getAdminUsers
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protect all admin routes to Admin role only
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/restaurants', getAdminRestaurants);
router.put('/restaurants/:id/approve', approveRestaurant);
router.get('/users', getAdminUsers);

module.exports = router;
