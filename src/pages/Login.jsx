import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuthModal();

  // If user is already logged in, redirect to home
  if (user) {
    setTimeout(() => navigate('/'), 0);
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const result = login(email, password);
    if (result.success) {
      navigate(-1); // Go back to where the user was, or fallback to home
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-[85vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-gray-100"
      >
        {/* Branding header */}
        <div className="text-center mb-8">
          <span className="text-4xl">🍕</span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-3">Welcome Back</h2>
          <p className="text-gray-400 text-xs font-semibold mt-1">Sign in to your Swiggy account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-3.5 flex items-center gap-2 mb-6 text-xs font-bold border border-red-100">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4.5">
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

          {/* Password input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
            />
          </div>

          {/* Forgot link */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-bold text-[#ff5200] hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-[#ff5200] hover:bg-[#e64a00] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
          >
            Login
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Signup Redirect */}
        <div className="text-center mt-6 pt-6 border-t border-gray-50">
          <p className="text-xs text-gray-400 font-semibold">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#ff5200] font-black hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
