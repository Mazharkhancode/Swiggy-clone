import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const { signup, user } = useAuthModal();

  // If user is already logged in, redirect to home
  if (user) {
    setTimeout(() => navigate('/'), 0);
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    const result = signup(name, email, phone, password);
    if (result.success) {
      navigate(-1); // Go back or fallback
    } else {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-[90vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-gray-100"
      >
        {/* Branding header */}
        <div className="text-center mb-8">
          <span className="text-4xl">🍔</span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-3">Join Swiggy</h2>
          <p className="text-gray-400 text-xs font-semibold mt-1">Create an account to start ordering delicious food</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-3.5 flex items-center gap-2 mb-6 text-xs font-bold border border-red-100">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <User size={16} />
            </span>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
            />
          </div>

          {/* Email input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
            />
          </div>

          {/* Phone input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Phone size={16} />
            </span>
            <input
              type="tel"
              placeholder="Phone Number (10-digit)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="Password (Min. 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
            />
          </div>

          {/* T&C Checkbox */}
          <label className="flex items-start gap-2.5 px-1 py-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 accent-[#ff5200] w-4 h-4 rounded border-gray-300"
            />
            <span className="text-[10px] text-gray-400 font-bold leading-normal">
              I agree to the Swiggy Terms of Service, Privacy Policy and Content Policies.
            </span>
          </label>

          {/* Sign Up button */}
          <button
            type="submit"
            className="w-full bg-[#ff5200] hover:bg-[#e64a00] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
          >
            Create Account
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Login Redirect */}
        <div className="text-center mt-6 pt-6 border-t border-gray-50">
          <p className="text-xs text-gray-400 font-semibold">
            Already have an account?{' '}
            <Link to="/login" className="text-[#ff5200] font-black hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
