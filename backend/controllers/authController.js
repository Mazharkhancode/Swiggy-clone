const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendMail } = require('../config/email');
const { admin, firebaseInitialized } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    // Check if there is an existing OTP record for resend protection / rate limit
    const existingOTP = await OTP.findOne({ phone });
    if (existingOTP) {
      const timeSinceLastRequest = Date.now() - new Date(existingOTP.lastRequestedAt).getTime();
      if (timeSinceLastRequest < 60000) { // 60 seconds
        return res.status(429).json({
          message: `Please wait ${Math.ceil((60000 - timeSinceLastRequest) / 1000)} seconds before requesting a new OTP.`,
          code: 'RATE_LIMIT_EXCEEDED'
        });
      }
    }

    // Generate a secure 6-digit random code
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // Hash the OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    // Save or update OTP in database
    if (existingOTP) {
      existingOTP.otp = hashedOtp;
      existingOTP.attempts = 0;
      existingOTP.lastRequestedAt = new Date();
      existingOTP.createdAt = new Date(); // Reset TTL
      await existingOTP.save();
    } else {
      await OTP.create({
        phone,
        otp: hashedOtp,
        attempts: 0,
        lastRequestedAt: new Date(),
        createdAt: new Date()
      });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER || process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_MESSAGING_SERVICE_SID;

    const isTwilioConfigured = accountSid && authToken;

    if (!isTwilioConfigured) {
      if (process.env.NODE_ENV === 'development') {
        // Log to console for development verification
        console.log(`\n====================================`);
        console.log(`[DEVELOPMENT - Twilio Not Configured] OTP for ${phone} is: ${otpCode}`);
        console.log(`====================================\n`);
        return res.json({
          message: 'OTP sent successfully (Simulated in Console)',
          simulated: true
        });
      } else {
        return res.status(500).json({
          message: 'Twilio SMS credentials are not configured.',
          code: 'TWILIO_NOT_CONFIGURED'
        });
      }
    }

    // If configured, send via Twilio Programmable SMS
    try {
      const twilio = require('twilio');
      const client = twilio(accountSid, authToken);
      if (!fromNumber) {
        throw new Error('Twilio From number or Messaging Service SID is missing.');
      }

      await client.messages.create({
        body: 'sms_2fa', // Use predefined template to bypass trial account restrictions
        to: phone,
        from: fromNumber
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`\n====================================`);
        console.log(`[DEVELOPMENT - Twilio Configured] Sent OTP to ${phone}: ${otpCode}`);
        console.log(`====================================\n`);
      }

      return res.json({ message: 'OTP sent successfully via Twilio SMS.' });
    } catch (twilioError) {
      console.error('Twilio SMS sending error:', twilioError);
      return res.status(500).json({
        message: `Twilio SMS sending failed: ${twilioError.message}`,
        code: 'TWILIO_SEND_FAILED'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and Log in / Register
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { phone, otp, name, email, password } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' });
  }

  try {
    const otpRecord = await OTP.findOne({ phone });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      otpRecord.attempts += 1;
      
      if (otpRecord.attempts >= 3) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          message: 'Maximum verification attempts exceeded. Please request a new OTP.',
          code: 'ATTEMPTS_EXCEEDED'
        });
      } else {
        await otpRecord.save();
        return res.status(400).json({
          message: `Incorrect OTP. ${3 - otpRecord.attempts} attempts remaining.`,
          code: 'INVALID_OTP',
          attemptsRemaining: 3 - otpRecord.attempts
        });
      }
    }

    // OTP is valid. Now check if user exists.
    let user = await User.findOne({ phone });

    if (!user) {
      const defaultEmail = email || `${phone.replace('+', '')}@swiggy.com`;
      const emailExists = await User.findOne({ email: defaultEmail.toLowerCase() });
      let finalEmail = defaultEmail;
      
      if (emailExists) {
        if (email) {
          return res.status(400).json({ message: 'A user with this email address already exists.' });
        } else {
          finalEmail = `${phone.replace('+', '')}_${Math.floor(1000 + Math.random() * 9000)}@swiggy.com`;
        }
      }

      // Auto-register user as customer if they don't exist
      user = await User.create({
        name: name || `User-${phone.slice(-4)}`,
        email: finalEmail,
        password: password || `otp_${otp}`, // Default temporary password
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
  const { firebaseToken, name, email } = req.body;

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
        name: name || `User-${phone.slice(-4)}`,
        email: email || `${phone.replace('+', '')}@swiggy.com`,
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
