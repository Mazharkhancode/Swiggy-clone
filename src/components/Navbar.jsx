import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, ChevronDown, LayoutDashboard, ShoppingBag, Heart, MapPin, Settings, ShoppingCart, Menu, X, Search, LifeBuoy, Percent, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthModal } from '../context/AuthModalContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const formatToE164 = (phone) => {
  if (!phone) return '';
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it already starts with + and has country code, return it as is
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // If it starts with 91 and has 12 digits, prepend +
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // If it has 10 digits (national number), prepend +91
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // Fallback: if it's already a full number, return with +
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

export default function Navbar() {
  const { user, logout, login, signup, isOpen, openLogin, openSignup, close, mode, setMode, loginWithFirebaseToken, sendOTPCode, verifyOTPCode } = useAuthModal();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login/Signup Drawer state
  const [drawerMode, setDrawerMode] = useState('login'); // 'login' | 'signup'
  const [drawerStep, setDrawerStep] = useState('phone'); // 'phone' | 'otp'
  
  // Phone/OTP fields
  const [authPhone, setAuthPhone] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [matchedUserObj, setMatchedUserObj] = useState(null);
  
  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [tempSignupData, setTempSignupData] = useState(null);

  // Firebase Phone Auth State
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('twilio'); // 'twilio' | 'firebase'

  // Sync context mode with drawer mode
  useEffect(() => {
    if (isOpen) {
      setDrawerMode(mode || 'login');
      setDrawerStep('phone');
      setAuthError('');
      setAuthPhone('');
      setAuthOtp('');
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setMatchedUserObj(null);
      setTempSignupData(null);
      setConfirmationResult(null);
      setLoading(false);
      setAuthMethod('twilio');
    }
  }, [isOpen, mode]);

  const openLoginDrawer = () => {
    openLogin();
  };

  const closeLoginDrawer = () => close();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanedDigits = authPhone.replace(/\D/g, '');
    if (cleanedDigits.length < 10) {
      setAuthError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    setLoading(true);
    const formattedPhone = formatToE164(authPhone);

    try {
      // 1. Try Twilio custom OTP flow
      const result = await sendOTPCode(formattedPhone);
      if (result.success) {
        setAuthMethod('twilio');
        setDrawerStep('otp');
        setAuthOtp('');
        setLoading(false);
        return;
      }

      // If credentials are not configured, fallback to Firebase
      const isMissingConfig = result.message && (
        result.message.includes('TWILIO_NOT_CONFIGURED') ||
        result.message.toLowerCase().includes('credentials are not configured')
      );

      if (isMissingConfig) {
        console.warn('Twilio not configured, falling back to Firebase Auth...');
        if (!auth) {
          throw new Error('Firebase Authentication is not initialized. Please verify that your environment variables are configured correctly.');
        }
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });

        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        setConfirmationResult(confirmation);
        setAuthMethod('firebase');
        setDrawerStep('otp');
        setAuthOtp('');
      } else {
        // Propagate the actual Twilio/rate-limiting error to the frontend and do NOT fallback
        throw new Error(result.message || 'Failed to send OTP via Twilio.');
      }
    } catch (error) {
      console.error('Error during phone submit:', error);
      setAuthError(error.message || 'Failed to send OTP. Please check your config or network.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerSignupSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!signupName || !signupEmail || !authPhone || !signupPassword) {
      setAuthError('Please fill in all fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    const cleanedDigits = authPhone.replace(/\D/g, '');
    if (cleanedDigits.length < 10) {
      setAuthError('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    
    setLoading(true);
    setTempSignupData({
      name: signupName,
      email: signupEmail,
      phone: authPhone,
      password: signupPassword
    });

    const formattedPhone = formatToE164(authPhone);

    try {
      // 1. Try Twilio custom OTP flow
      const result = await sendOTPCode(formattedPhone);
      if (result.success) {
        setAuthMethod('twilio');
        setDrawerStep('otp');
        setAuthOtp('');
        setLoading(false);
        return;
      }

      // If credentials are not configured, fallback to Firebase
      const isMissingConfig = result.message && (
        result.message.includes('TWILIO_NOT_CONFIGURED') ||
        result.message.toLowerCase().includes('credentials are not configured')
      );

      if (isMissingConfig) {
        console.warn('Twilio not configured, falling back to Firebase Auth...');
        if (!auth) {
          throw new Error('Firebase Authentication is not initialized. Please verify that your environment variables are configured correctly.');
        }
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });

        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        setConfirmationResult(confirmation);
        setAuthMethod('firebase');
        setDrawerStep('otp');
        setAuthOtp('');
      } else {
        // Propagate actual error (trial limitation, API error, etc.) and do NOT fallback
        throw new Error(result.message || 'Failed to send OTP via Twilio.');
      }
    } catch (error) {
      console.error('Error during signup phone submit:', error);
      setAuthError(error.message || 'Failed to send OTP. Please check your config or network.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authOtp || authOtp.length !== 6) {
      setAuthError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      if (authMethod === 'twilio') {
        let result;
        const formattedPhone = formatToE164(authPhone);
        if (drawerMode === 'signup' && tempSignupData) {
          result = await verifyOTPCode(formattedPhone, authOtp, {
            name: tempSignupData.name,
            email: tempSignupData.email,
            password: tempSignupData.password
          });
        } else {
          result = await verifyOTPCode(formattedPhone, authOtp);
        }

        if (result.success) {
          closeLoginDrawer();
        } else {
          setAuthError(result.message || 'Verification failed.');
        }
      } else {
        // Firebase Flow
        if (!confirmationResult) {
          throw new Error('No active OTP session found. Please request a new code.');
        }

        const userCredential = await confirmationResult.confirm(authOtp);
        const firebaseToken = await userCredential.user.getIdToken();

        let result;
        if (drawerMode === 'signup' && tempSignupData) {
          result = await loginWithFirebaseToken(firebaseToken, {
            name: tempSignupData.name,
            email: tempSignupData.email
          });
        } else {
          result = await loginWithFirebaseToken(firebaseToken);
        }

        if (result.success) {
          closeLoginDrawer();
        } else {
          setAuthError(result.message || 'Verification failed.');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP code', error);
      setAuthError(error.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Location selector state
  const [selectedLoc, setSelectedLoc] = useState(() => {
    return localStorage.getItem('swiggy_selected_location') || 'Race Course Road, HIG Colony, Indore';
  });
  const [locInput, setLocInput] = useState('');
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const locRef = useRef(null);

  const indoreLocalities = [
    'Vijay Nagar, Indore',
    'Palasia, Indore',
    'Chappan Dukan, Indore',
    'Bhavarkua, Indore',
    'Rajendra Nagar, Indore',
    'Annapurna Road, Indore',
    'Race Course Road, HIG Colony, Indore'
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (locRef.current && !locRef.current.contains(event.target)) {
        setShowLocDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc) => {
    setSelectedLoc(loc);
    localStorage.setItem('swiggy_selected_location', loc);
    setShowLocDropdown(false);
  };

  const isHomePage = location.pathname === '/';
  const isCartOrCheckoutPage = location.pathname === '/cart' || location.pathname === '/checkout';

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);
  const closeMobile = () => setMobileMenuOpen(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile Details', path: '/profile', icon: User },
    { name: 'My Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
    { name: 'Saved Addresses', path: '/addresses', icon: MapPin },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const renderAvatar = () => {
    if (user && user.avatar) {
      return <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-white/20" />;
    }
    return (
      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] uppercase border ${isHomePage ? 'bg-black/20 text-white border-white/15' : 'bg-orange-100 text-[#ff5200] border-orange-200'
        }`}>
        {user && user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : <User size={12} />}
      </div>
    );
  };

  const renderLoginDrawer = () => {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLoginDrawer}
              className="fixed inset-0 bg-black/60 z-[60]"
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-white z-[70] shadow-2xl flex flex-col text-gray-800"
            >
              {/* Close button */}
              <button
                onClick={closeLoginDrawer}
                className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 cursor-pointer border-0 bg-transparent p-0 transition-colors"
              >
                <X size={22} />
              </button>

              {/* Invisible Recaptcha Container */}
              <div id="recaptcha-container"></div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-10 pt-16 pb-8">
                
                {/* Step 1: Input Form Step */}
                {drawerStep === 'phone' && (
                  <>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h2 className="text-[28px] font-black text-gray-900 leading-tight">
                          {drawerMode === 'login' ? 'Login' : 'Sign Up'}
                        </h2>
                        <p className="text-[13px] text-gray-500 mt-1">
                          or{' '}
                          <button
                            onClick={() => {
                              setDrawerMode(drawerMode === 'login' ? 'signup' : 'login');
                              setAuthError('');
                            }}
                            className="text-[#ff5200] font-bold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                          >
                            {drawerMode === 'login' ? 'create an account' : 'login to your account'}
                          </button>
                        </p>
                        <div className="w-8 h-[3px] bg-gray-900 mt-4"></div>
                      </div>
                      <img
                        src="/food_illustration.png"
                        alt="Food"
                        className="w-20 h-20 object-contain opacity-90"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>

                    {/* Error */}
                    {authError && (
                      <div className="bg-orange-50 text-orange-600 rounded-xl p-3.5 flex items-start gap-2 mb-5 text-xs font-bold border border-orange-100 leading-normal">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>{authError}</span>
                      </div>
                    )}

                    {drawerMode === 'login' ? (
                      /* Login Form: Just Phone Number */
                      <form onSubmit={handlePhoneSubmit} className="space-y-5">
                        {/* Phone input */}
                        <div className="relative border border-gray-300 rounded-md focus-within:border-[#ff5200] transition-colors">
                          <input
                            type="tel"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder=" "
                            className="peer w-full px-4 pt-6 pb-2 text-[15px] font-semibold text-gray-900 bg-transparent outline-none"
                            id="drawer-phone"
                          />
                          <label
                            htmlFor="drawer-phone"
                            className="absolute left-4 top-2 text-[11px] text-gray-500 font-semibold peer-placeholder-shown:top-4 peer-placeholder-shown:text-[14px] peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#ff5200] transition-all pointer-events-none"
                          >
                            Phone number
                          </label>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full bg-[#ff5200] hover:bg-[#e64a00] text-white py-4 rounded-md font-black text-[14px] uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer border-0 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {loading ? 'SENDING...' : 'LOGIN'}
                          {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                      </form>
                    ) : (
                      /* Signup Form: Full Details (Name, Phone, Email, Password) */
                      <form onSubmit={handleDrawerSignupSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="relative border border-gray-300 rounded-md focus-within:border-[#ff5200] transition-colors">
                          <input
                            type="text"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder=" "
                            className="peer w-full px-4 pt-6 pb-2 text-[15px] font-semibold text-gray-900 bg-transparent outline-none"
                            id="drawer-signup-name"
                          />
                          <label
                            htmlFor="drawer-signup-name"
                            className="absolute left-4 top-2 text-[11px] text-gray-500 font-semibold peer-placeholder-shown:top-4 peer-placeholder-shown:text-[14px] peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#ff5200] transition-all pointer-events-none"
                          >
                            Full Name
                          </label>
                        </div>

                        {/* Phone Number */}
                        <div className="relative border border-gray-300 rounded-md focus-within:border-[#ff5200] transition-colors">
                          <input
                            type="tel"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder=" "
                            className="peer w-full px-4 pt-6 pb-2 text-[15px] font-semibold text-gray-900 bg-transparent outline-none"
                            id="drawer-signup-phone"
                          />
                          <label
                            htmlFor="drawer-signup-phone"
                            className="absolute left-4 top-2 text-[11px] text-gray-500 font-semibold peer-placeholder-shown:top-4 peer-placeholder-shown:text-[14px] peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#ff5200] transition-all pointer-events-none"
                          >
                            Phone Number
                          </label>
                        </div>

                        {/* Email Address */}
                        <div className="relative border border-gray-300 rounded-md focus-within:border-[#ff5200] transition-colors">
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder=" "
                            className="peer w-full px-4 pt-6 pb-2 text-[15px] font-semibold text-gray-900 bg-transparent outline-none"
                            id="drawer-signup-email"
                          />
                          <label
                            htmlFor="drawer-signup-email"
                            className="absolute left-4 top-2 text-[11px] text-gray-500 font-semibold peer-placeholder-shown:top-4 peer-placeholder-shown:text-[14px] peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#ff5200] transition-all pointer-events-none"
                          >
                            Email Address
                        </label>
                      </div>

                      {/* Password */}
                      <div className="relative border border-gray-300 rounded-md focus-within:border-[#ff5200] transition-colors">
                        <input
                          type="password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder=" "
                          className="peer w-full px-4 pt-6 pb-2 text-[15px] font-semibold text-gray-900 bg-transparent outline-none"
                          id="drawer-signup-password"
                        />
                        <label
                          htmlFor="drawer-signup-password"
                          className="absolute left-4 top-2 text-[11px] text-gray-500 font-semibold peer-placeholder-shown:top-4 peer-placeholder-shown:text-[14px] peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#ff5200] transition-all pointer-events-none"
                        >
                          Password
                        </label>
                      </div>

                      {/* Signup Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#ff5200] hover:bg-[#e64a00] text-white py-4 rounded-md font-black text-[14px] uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer border-0 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'SENDING...' : 'SIGN UP \u2192'}
                      </button>
                    </form>
                  )}
                </>
              )}

                {/* Step 3: OTP Verification Step */}
                {drawerStep === 'otp' && (
                  <>
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h2 className="text-[28px] font-black text-gray-900 leading-tight">Verify OTP</h2>
                        <p className="text-[13px] text-gray-500 mt-1">
                          We have sent a 6-digit code to {authPhone}
                        </p>
                        <div className="w-8 h-[3px] bg-gray-900 mt-4"></div>
                      </div>
                    </div>



                    {/* Error */}
                    {authError && (
                      <div className="bg-red-50 text-red-600 rounded-xl p-3 flex items-center gap-2 mb-5 text-xs font-bold border border-red-100">
                        <AlertCircle size={14} className="flex-shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleOtpVerify} className="space-y-5">
                      {/* OTP Input */}
                      <div className="relative border border-gray-300 rounded-md focus-within:border-[#ff5200] transition-colors">
                        <input
                          type="text"
                          value={authOtp}
                          onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder=" "
                          className="peer w-full px-4 pt-6 pb-2 text-[18px] font-black tracking-[8px] text-center text-gray-900 bg-transparent outline-none"
                          id="drawer-otp"
                        />
                        <label
                          htmlFor="drawer-otp"
                          className="absolute left-4 top-2 text-[11px] text-gray-500 font-semibold peer-placeholder-shown:top-4 peer-placeholder-shown:text-[14px] peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#ff5200] transition-all pointer-events-none w-full text-left"
                        >
                          6-Digit OTP Code
                        </label>
                      </div>

                      {/* Verify Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#ff5200] hover:bg-[#e64a00] text-white py-4 rounded-md font-black text-[14px] uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer border-0 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'VERIFYING...' : 'VERIFY OTP'}
                        {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDrawerStep('phone')}
                        className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-0 cursor-pointer block pt-2"
                      >
                        Change Phone Number
                      </button>
                    </form>
                  </>
                )}

                {/* Terms */}
                <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                  By clicking on Login/Sign Up, I accept the{' '}
                  <span className="text-[#ff5200] font-bold cursor-pointer">Terms & Conditions</span>{' '}
                  &{' '}
                  <span className="text-[#ff5200] font-bold cursor-pointer">Privacy Policy</span>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  // 1. Home Page Navbar (Original Orange Theme)
  if (isHomePage) {
    return (
      <>
        <header className="sticky top-0 z-50 bg-[#ff5200] text-white shadow-md">
          <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/swiggy_logo.png?v=2" alt="Swiggy" className="h-8 sm:h-10 w-auto object-contain" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 font-bold text-sm">
              <Link to="/restaurants" className="hover:opacity-80 transition-opacity">Restaurants</Link>
              <Link to="#" className="hover:opacity-80 transition-opacity">Swiggy Corporate</Link>
              {user && user.isPartner ? (
                <Link to="/partner/dashboard" className="hover:opacity-80 transition-opacity text-yellow-300 font-bold">Partner Dashboard</Link>
              ) : (
                <Link to="/partner" className="hover:opacity-80 transition-opacity">Partner with us</Link>
              )}

              {/* Cart Icon */}
              <Link to="/cart" className="relative flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#ff5200] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative" onMouseLeave={closeDropdown}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 bg-black/10 hover:bg-black/20 px-4 py-2 rounded-2xl border border-white/10 transition-all cursor-pointer select-none"
                  >
                    {renderAvatar()}
                    <span className="max-w-[120px] truncate">Hi, {user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-700 py-2.5 z-50 font-semibold animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account</p>
                        <p className="text-xs font-black text-gray-900 truncate mt-0.5">{user.name}</p>
                      </div>

                      {user.email?.toLowerCase() === 'admin@swiggy.com' && (
                        <Link
                          to="/admin"
                          onClick={closeDropdown}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs bg-orange-50 text-[#ff5200] hover:bg-orange-100 transition-colors font-black border-b border-orange-100"
                        >
                          <LayoutDashboard size={14} className="text-[#ff5200]" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeDropdown}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-orange-50 hover:text-[#ff5200] transition-colors"
                          >
                            <Icon size={14} className="text-gray-400" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}

                      <div className="border-t border-gray-50 mt-1.5 pt-1.5">
                        <button
                          onClick={() => { closeDropdown(); logout(); }}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 w-full text-left transition-colors font-bold cursor-pointer border-0"
                        >
                          <LogOut size={14} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={openLoginDrawer} className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer border-0 font-bold text-sm">
                    Login / Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Right Section */}
            <div className="flex md:hidden items-center gap-3">
              <Link to="/cart" className="relative flex items-center">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#ff5200] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer border-0 bg-transparent text-white"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobile}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl flex flex-col md:hidden"
              >
                <div className="bg-[#ff5200] px-6 py-5 flex items-center justify-between">
                  <img src="/swiggy_logo.png?v=2" alt="Swiggy" className="h-8 w-auto object-contain" />
                  <button onClick={closeMobile} className="text-white hover:bg-white/10 p-2 rounded-xl cursor-pointer border-0 bg-transparent">
                    <X size={20} />
                  </button>
                </div>

                {user && (
                  <div className="px-6 py-4 border-b border-gray-100 bg-orange-50/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff5200] to-orange-400 flex items-center justify-center font-black text-white text-sm flex-shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-gray-800 text-sm truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                )}

                <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                  {[
                    { name: 'Restaurants', path: '/restaurants' },
                    { name: 'Partner with us', path: '/partner' },
                  ].map(link => (
                    <Link key={link.path} to={link.path} onClick={closeMobile}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff5200] transition-colors">
                      {link.name}
                    </Link>
                  ))}

                  {user && (
                    <>
                      <div className="pt-2 pb-1 px-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">My Account</p>
                      </div>
                      {user.email?.toLowerCase() === 'admin@swiggy.com' && (
                        <Link to="/admin" onClick={closeMobile}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-[#ff5200] bg-orange-50 hover:bg-orange-100 transition-colors">
                          <LayoutDashboard size={16} /> Admin Panel
                        </Link>
                      )}
                      {menuItems.map(item => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.path} to={item.path} onClick={closeMobile}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff5200] transition-colors">
                            <Icon size={16} className="text-gray-400" /> {item.name}
                          </Link>
                        );
                      })}
                    </>
                  )}
                </nav>

                <div className="px-4 py-5 border-t border-gray-100 space-y-2">
                  {user ? (
                    <button
                      onClick={() => { logout(); closeMobile(); }}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 hover:bg-red-100 font-black text-sm py-3 rounded-2xl transition-all cursor-pointer border-0"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  ) : (
                    <button onClick={() => { closeMobile(); openLoginDrawer(); }}
                      className="w-full text-center bg-[#ff5200] text-white font-black text-sm py-3 rounded-2xl hover:bg-[#e64a00] transition-colors cursor-pointer border-0">
                      Login / Sign Up
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {renderLoginDrawer()}
      </>
    );
  }

  // 2. Cart or Checkout Page Header (Exact Swiggy Secure Checkout Theme from 2nd Screenshot)
  if (isCartOrCheckoutPage) {
    return (
      <>
        <header className="sticky top-0 z-50 bg-white text-gray-800 border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 -ml-23">
              {/* Logo */}
              <Link to="/" className="flex items-center flex-shrink-0 transition-transform hover:scale-[1.02]">
                <img src="/swiggy_orange_icon.png" alt="Swiggy" className="h-10 sm:h-12 w-auto object-contain" onError={(e) => {
                  e.target.src = "/swiggy_logo.png";
                }} />
              </Link>
              {/* SECURE CHECKOUT Label */}
              <span className="font-extrabold text-[13px] tracking-wider text-[#3d4152] uppercase select-none">
                Secure Checkout
              </span>
            </div>

            <div className="flex items-center gap-8 font-bold text-gray-700 mr-17">
              <Link to="/contact" className="flex items-center gap-2 hover:text-[#ff5200] transition-colors">
                <LifeBuoy size={18} className="text-gray-500" />
                <span className="text-[14px] font-bold text-[#3d4152]">Help</span>
              </Link>

              {user ? (
                <div className="relative" onMouseLeave={closeDropdown}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 hover:text-[#ff5200] transition-all cursor-pointer select-none font-bold text-[#3d4152]"
                  >
                    {renderAvatar()}
                    <span className="max-w-[100px] truncate text-[14px]">Hi, {user.name.split(' ')[0]}</span>
                    <ChevronDown size={12} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-700 py-2.5 z-50 font-semibold animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account</p>
                        <p className="text-xs font-black text-gray-900 truncate mt-0.5">{user.name}</p>
                      </div>

                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeDropdown}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-orange-50 hover:text-[#ff5200] transition-colors"
                          >
                            <Icon size={14} className="text-gray-400" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}

                      <div className="border-t border-gray-50 mt-1.5 pt-1.5">
                        <button
                          onClick={() => { closeDropdown(); logout(); }}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 w-full text-left transition-colors font-bold cursor-pointer border-0"
                        >
                          <LogOut size={14} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={openLoginDrawer} className="flex items-center gap-2 hover:text-[#ff5200] transition-colors cursor-pointer bg-transparent border-0 p-0">
                  <User size={18} className="text-gray-500" />
                  <span className="text-[14px] font-bold text-[#3d4152]">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </header>
        {renderLoginDrawer()}
      </>
    );
  }

  // 3. Inner Pages Header (Exact Swiggy Style from user's first screenshot)
  return (
    <>
      <header className="sticky top-0 z-50 bg-white text-gray-800 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 transition-transform hover:scale-[1.02]">
              <img src="/swiggy_orange_icon.png" alt="Swiggy" className="h-10 sm:h-12 w-auto object-contain" onError={(e) => {
                e.target.src = "/swiggy_logo.png";
              }} />
            </Link>

            {/* Location Selector dropdown implementation */}
            <div className="relative -ml-23" ref={locRef}>
              <div
                onClick={() => setShowLocDropdown(!showLocDropdown)}
                className="hidden lg:flex items-center gap-1.5 cursor-pointer hover:text-[#ff5200] transition-all group"
              >
                <span className="font-extrabold text-[14px] text-[#3d4152] border-b-2 border-gray-900 group-hover:border-[#ff5200] pb-0.5 flex-shrink-0">Other</span>
                <span className="text-[13px] text-[#686b78] font-medium truncate max-w-[130px] sm:max-w-[160px] xl:max-w-[220px]">{selectedLoc}</span>
                <ChevronDown size={14} className="text-[#ff5200] transition-transform group-hover:translate-y-0.5 flex-shrink-0" />
              </div>

              {showLocDropdown && (
                <div className="absolute left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-2 w-72">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <input
                      type="text"
                      placeholder="Search Indore locality..."
                      value={locInput}
                      onChange={e => setLocInput(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="w-full text-xs font-semibold px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#ff5200]"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {indoreLocalities
                      .filter(loc => loc.toLowerCase().includes(locInput.toLowerCase()))
                      .map((loc, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectLocation(loc)}
                          className="px-4 py-2.5 hover:bg-orange-50 text-gray-700 font-semibold text-xs cursor-pointer transition-colors flex items-center gap-2"
                        >
                          <MapPin size={12} className="text-[#ff5200]" />
                          <span>{loc}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center gap-8 font-bold text-gray-700 mr-18">
            <Link to="#" className="flex items-center gap-2 hover:text-[#ff5200] transition-colors">
              <ShoppingBag size={18} className="text-gray-500" />
              <span className="text-[14px] font-bold tracking-tight text-[#3d4152]">Swiggy Corporate</span>
            </Link>

            <Link to="/restaurants" className="flex items-center gap-2 hover:text-[#ff5200] transition-colors">
              <Search size={18} className="text-gray-500" />
              <span className="text-[14px] font-bold tracking-tight text-[#3d4152]">Search</span>
            </Link>

            <Link to="/deals/60-percent-off" className="flex items-center gap-2 hover:text-[#ff5200] transition-colors relative">
              <Percent size={18} className="text-gray-500" />
              <span className="text-[14px] font-bold tracking-tight text-[#3d4152]">Offers</span>
              <span className="absolute -top-3.5 -right-6 text-[8px] bg-orange-100 text-[#ff5200] border border-orange-200 px-1 py-0.2 rounded font-black uppercase">New</span>
            </Link>

            <Link to="/contact" className="flex items-center gap-2 hover:text-[#ff5200] transition-colors">
              <LifeBuoy size={18} className="text-gray-500" />
              <span className="text-[14px] font-bold tracking-tight text-[#3d4152]">Help</span>
            </Link>

            {user ? (
              <div className="relative" onMouseLeave={closeDropdown}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 hover:text-[#ff5200] transition-all cursor-pointer select-none font-bold text-[#3d4152]"
                >
                  {renderAvatar()}
                  <span className="max-w-[100px] truncate text-[14px]">Hi, {user.name.split(' ')[0]}</span>
                  <ChevronDown size={12} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-700 py-2.5 z-50 font-semibold animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account</p>
                      <p className="text-xs font-black text-gray-900 truncate mt-0.5">{user.name}</p>
                    </div>

                    {user.email?.toLowerCase() === 'admin@swiggy.com' && (
                      <Link
                        to="/admin"
                        onClick={closeDropdown}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs bg-orange-50 text-[#ff5200] hover:bg-orange-100 transition-colors font-black border-b border-orange-100"
                      >
                        <LayoutDashboard size={14} className="text-[#ff5200]" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={closeDropdown}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-orange-50 hover:text-[#ff5200] transition-colors"
                        >
                          <Icon size={14} className="text-gray-400" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}

                    <div className="border-t border-gray-50 mt-1.5 pt-1.5">
                      <button
                        onClick={() => { closeDropdown(); logout(); }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 w-full text-left transition-colors font-bold cursor-pointer border-0"
                      >
                        <LogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={openLoginDrawer} className="flex items-center gap-2 hover:text-[#ff5200] transition-colors cursor-pointer bg-transparent border-0 p-0">
                <User size={18} className="text-gray-500" />
                <span className="text-[14px] font-bold tracking-tight text-[#3d4152]">Sign In</span>
              </button>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative flex items-center gap-2 hover:text-[#ff5200] transition-colors text-emerald-600">
              <div className="relative">
                <ShoppingCart size={18} className="text-emerald-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff5200] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[14px] font-bold tracking-tight text-[#3d4152] hover:text-[#ff5200]">Cart</span>
            </Link>
          </div>

          {/* Mobile Right Section */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative flex items-center text-emerald-600">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff5200] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent text-gray-700"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl flex flex-col md:hidden text-gray-800"
            >
              <div className="bg-[#ff5200] px-6 py-5 flex items-center justify-between">
                <img src="/swiggy_logo.png?v=2" alt="Swiggy" className="h-8 w-auto object-contain" />
                <button onClick={closeMobile} className="text-white hover:bg-white/10 p-2 rounded-xl cursor-pointer border-0 bg-transparent">
                  <X size={20} />
                </button>
              </div>

              {user && (
                <div className="px-6 py-4 border-b border-gray-100 bg-orange-50/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff5200] to-[#ff5200] flex items-center justify-center font-black text-white text-sm flex-shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-800 text-sm truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {[
                  { name: 'Restaurants', path: '/restaurants', icon: Search },
                  { name: 'Offers', path: '/deals/60-percent-off', icon: Percent },
                  { name: 'Help', path: '/contact', icon: LifeBuoy },
                ].map(link => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.path} to={link.path} onClick={closeMobile}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff5200] transition-colors">
                      <Icon size={16} className="text-gray-400" />
                      {link.name}
                    </Link>
                  );
                })}

                {user && (
                  <>
                    <div className="pt-2 pb-1 px-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">My Account</p>
                    </div>
                    {user.email?.toLowerCase() === 'admin@swiggy.com' && (
                      <Link to="/admin" onClick={closeMobile}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-[#ff5200] bg-orange-50 hover:bg-orange-100 transition-colors">
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}
                    {menuItems.map(item => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.path} to={item.path} onClick={closeMobile}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff5200] transition-colors">
                          <Icon size={16} className="text-gray-400" /> {item.name}
                        </Link>
                      );
                    })}
                  </>
                )}
              </nav>

              <div className="px-4 py-5 border-t border-gray-100 space-y-2">
                {user ? (
                  <button
                    onClick={() => { logout(); closeMobile(); }}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 hover:bg-red-100 font-black text-sm py-3 rounded-2xl transition-all cursor-pointer border-0"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                <button onClick={() => { closeMobile(); openLoginDrawer(); }}
                  className="w-full text-center bg-[#ff5200] text-white font-black text-sm py-3 rounded-2xl hover:bg-[#e64a00] transition-colors cursor-pointer border-0">
                  Login / Sign Up
                </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    {/* ==================== LOGIN DRAWER (Swiggy Style) ==================== */}
    {renderLoginDrawer()}
    </>
  );
}
