import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Simulate link dispatching
    setIsSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-[85vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-gray-100"
      >
        {isSubmitted ? (
          /* Success Screen */
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-green-500/20"
            >
              <CheckCircle2 size={36} />
            </motion.div>

            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Check Your Email</h2>
            <p className="text-xs text-gray-400 font-semibold mb-6 leading-relaxed">
              We have dispatched a password reset link to <span className="text-gray-700 font-bold">{email}</span>. Click the link inside to restore your secure credentials.
            </p>

            <Link
              to="/login"
              className="w-full bg-black hover:bg-gray-800 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider block transition-colors"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          /* Input Screen */
          <div>
            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-4xl">🔑</span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-3">Reset Password</h2>
              <p className="text-gray-400 text-xs font-semibold mt-1">Enter your registered email to request a reset link</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl p-3.5 flex items-center gap-2 mb-6 text-xs font-bold border border-red-100">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                className="w-full bg-[#ff5200] hover:bg-[#e64a00] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Send Reset Link
              </button>
            </form>

            {/* Back link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-50">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
