const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  phone: { type: String },
  email: { type: String },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-delete after 5 minutes (300 seconds)
});

module.exports = mongoose.model('OTP', OTPSchema);
