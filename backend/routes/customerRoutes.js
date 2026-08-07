const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantDetails,
  getMenuItemDetails
} = require('../controllers/customerRestaurantController');

router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id', getRestaurantDetails);
router.get('/menu/:id', getMenuItemDetails);

module.exports = router;
