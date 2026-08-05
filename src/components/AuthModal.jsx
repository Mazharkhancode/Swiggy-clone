import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, CheckCircle } from 'lucide-react';
import { useAuthModal } from '../context/AuthModalContext';

export default function AuthModal() {
  const { isOpen, mode, close, setMode, login, signup } = useAuthModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      login(email, password);
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setEmail('');
        setPassword('');
      }, 1000);
    } else {
      if (!name || !email || !phone || !password) {
        setError('Please fill in all fields.');
        return;
      }
      signup(name, email, phone, password);
      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
      }, 1000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </h2>
            <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider mt-1">
              {mode === 'login' ? 'or create an account' : 'or login to your account'}
            </p>
          </div>

          {/* Success screen */}
          {successMsg ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center"
            >
              <CheckCircle size={60} className="text-green-500 mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-gray-800">{successMsg}</h3>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 pr-4 py-3.5 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] focus:bg-white font-medium text-gray-800 transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-3.5 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] focus:bg-white font-medium text-gray-800 transition-all text-sm"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 pr-4 py-3.5 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] focus:bg-white font-medium text-gray-800 transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-4 py-3.5 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] focus:bg-white font-medium text-gray-800 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff5200] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:bg-[#e04800] active:scale-[0.98] transition-all mt-6"
              >
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </button>

              <div className="text-center pt-4 border-t border-gray-100 text-xs font-bold text-gray-400 mt-6">
                {mode === 'login' ? (
                  <>
                    New to Swiggy?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-[#ff5200] hover:underline"
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[#ff5200] hover:underline"
                    >
                      Login here
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
