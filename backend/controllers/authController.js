const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendMail } = require('../config/email');
const { admin, firebaseInitialized } = require('../config/firebase');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey12345', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Customer, Partner, Admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add Saved Address
// @route   POST /api/auth/addresses
// @access  Private
const addAddress = async (req, res) => {
  const { addressType, street, city, state, postalCode } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.addresses.push({ addressType, street, city, state, postalCode });
      await user.save();
      res.status(201).json(user.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Saved Address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.addresses = user.addresses.filter(
        (addr) => addr._id.toString() !== req.params.id
      );
      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate and Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    // Generate a 6-digit random code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this phone
    await OTP.deleteMany({ phone });

    // Save new OTP
    await OTP.create({
      phone,
      otp: otpCode
    });

    // Console Log simulation for testing
    console.log(`\n====================================`);
    console.log(`[OTP SEND] Code for ${phone} is: ${otpCode}`);
    console.log(`====================================\n`);

    res.json({ message: 'OTP sent successfully (Check backend console)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and Log in / Register
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' });
  }

  try {
    const otpRecord = await OTP.findOne({ phone, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid. Now check if user exists.
    let user = await User.findOne({ phone });

    if (!user) {
      // Auto-register user as customer if they don't exist
      user = await User.create({
        name: `User-${phone.slice(-4)}`,
        email: `${phone}@swiggy.com`,
        password: `otp_${otp}`, // Default temporary password
        role: 'customer',
        phone
      });
    }

    // Delete the verified OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Return JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate and Send Email OTP
// @route   POST /api/auth/send-email-otp
// @access  Public
const sendEmailOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Clear old email OTPs
    await OTP.deleteMany({ email });

    // Save OTP
    await OTP.create({
      email,
      otp: otpCode
    });

    // Send Mail
    const subject = 'Your Swiggy Clone Verification Code';
    const text = `Your verification OTP is: ${otpCode}. This code is valid for 5 minutes.`;
    const html = `<h3>Swiggy Clone Verification</h3><p>Your verification OTP code is: <strong>${otpCode}</strong></p><p>This code will expire in 5 minutes.</p>`;

    await sendMail(email, subject, text, html);

    res.json({ message: 'OTP sent to your email successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Email OTP and Login / Register
// @route   POST /api/auth/verify-email-otp
// @access  Public
const verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired email OTP' });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: email.split('@')[0],
        email,
        password: `otp_${otp}`,
        role: 'customer'
      });
    }

    // Delete verified OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Firebase Token (Phone login)
// @route   POST /api/auth/firebase-phone-login
// @access  Public
const verifyFirebaseToken = async (req, res) => {
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    return res.status(400).json({ message: 'Firebase token is required' });
  }

  if (!firebaseInitialized) {
    return res.status(500).json({
      message: 'Firebase Admin SDK is not initialized. Please upload serviceAccountKey.json'
    });
  }

  try {
    // Verify token with firebase
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phone = decodedToken.phone_number;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number not found in Firebase token' });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      // Register new user with this phone
      user = await User.create({
        name: `User-${phone.slice(-4)}`,
        email: `${phone.replace('+', '')}@swiggy.com`,
        password: `fb_${Date.now()}`,
        role: 'customer',
        phone
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired Firebase token' });
  }
};

module.exports = {
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
};
