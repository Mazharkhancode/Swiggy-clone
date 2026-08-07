const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  addAddress,
  deleteAddress,
  sendOTP,
  verifyOTP,
  sendEmailOTP,
  verifyEmailOTP,
  verifyFirebaseToken
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/send-email-otp', sendEmailOTP);
router.post('/verify-email-otp', verifyEmailOTP);
router.post('/firebase-phone-login', verifyFirebaseToken);
router.route('/profile').get(protect, getUserProfile);
router.route('/addresses').post(protect, addAddress);
router.route('/addresses/:id').delete(protect, deleteAddress);

module.exports = router;
