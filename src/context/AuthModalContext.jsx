import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [user, setUser] = useState(null);

  // Helper: Get users DB from localStorage
  const getUsersDb = () => {
    const db = localStorage.getItem('swiggy_users_db');
    return db ? JSON.parse(db) : {};
  };

  // Helper: Save user profile to database
  const saveUserToDb = (updatedUser) => {
    const db = getUsersDb();
    db[updatedUser.email.toLowerCase()] = updatedUser;
    localStorage.setItem('swiggy_users_db', JSON.stringify(db));
    setUser(updatedUser);
    localStorage.setItem('swiggy_user', JSON.stringify(updatedUser));
  };

  const createDefaultUser = (name, email, phone, password = 'password123') => ({
    name: name || email.split('@')[0],
    email: email.toLowerCase(),
    phone: phone || '9876543210',
    password: password,
    avatar: '',
    addresses: [
      { id: '1', type: 'Home', name: name || email.split('@')[0], details: '104, Maple Heights, Vijay Nagar, Indore - 452010', phone: phone || '9876543210' },
      { id: '2', type: 'Work', name: name || email.split('@')[0], details: '5th Floor, Palasia Business Center, Palasia, Indore - 452001', phone: phone || '9876543210' }
    ],
    wishlist: [],
    orders: [],
    settings: {
      orderUpdates: true,
      promoEmails: false,
      smsAlerts: true
    }
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('swiggy_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const db = getUsersDb();
        // Load latest state from DB if available, fallback to active session
        const freshUser = db[parsed.email.toLowerCase()] || parsed;
        setUser(freshUser);
      } catch (e) {
        console.error('Error parsing saved user', e);
      }
    }
  }, []);

  const openLogin = () => {
    setMode('login');
    setIsOpen(true);
  };

  const openSignup = () => {
    setMode('signup');
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const loginUser = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      setUser(data);
      localStorage.setItem('swiggy_user', JSON.stringify(data));
      setIsOpen(false);
      return { success: true };
    } catch (error) {
      console.error('Login error', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password'
      };
    }
  };

  const signupUser = async (name, email, phone, password, role = 'customer') => {
    try {
      const response = await api.post('/auth/register', { name, email, phone, password, role });
      const data = response.data;
      setUser(data);
      localStorage.setItem('swiggy_user', JSON.stringify(data));
      setIsOpen(false);
      return { success: true };
    } catch (error) {
      console.error('Signup error', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Email already registered'
      };
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('swiggy_user');
  };

  // Profile operations
  const updateUserProfile = async (fields) => {
    // In a real system, you would call: await api.put('/auth/profile', fields);
    // Let's update state for now
    if (!user) return;
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem('swiggy_user', JSON.stringify(updated));
  };

  // Address operations
  const addAddress = async (address) => {
    try {
      const response = await api.post('/auth/addresses', {
        addressType: address.type,
        street: address.details,
        city: address.city || 'Indore',
        state: address.state || 'MP',
        postalCode: address.postalCode || '452001'
      });
      // Fetch fresh profile details or update locally
      const updatedUser = { ...user, addresses: response.data };
      setUser(updatedUser);
      localStorage.setItem('swiggy_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Add address error', error);
    }
  };

  const updateAddress = (addressId, updatedAddress) => {
    // Optional fallback or local state update
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await api.delete(`/auth/addresses/${addressId}`);
      const updatedUser = { ...user, addresses: response.data };
      setUser(updatedUser);
      localStorage.setItem('swiggy_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Delete address error', error);
    }
  };

  // Wishlist operations
  const toggleWishlist = (item) => {
    if (!user) return false;
    const wishlist = user.wishlist || [];
    const exists = wishlist.some(i => i.id === item.id);
    let updatedWishlist;
    if (exists) {
      updatedWishlist = wishlist.filter(i => i.id !== item.id);
    } else {
      updatedWishlist = [...wishlist, item];
    }
    const updated = {
      ...user,
      wishlist: updatedWishlist
    };
    saveUserToDb(updated);
    return !exists; // returns true if added, false if removed
  };

  // Order operations
  const addOrder = (order) => {
    if (!user) return;
    const newOrder = {
      id: order.orderId || `SW-${Math.floor(10000000 + Math.random() * 90000000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed',
      ...order
    };
    const updated = {
      ...user,
      orders: [newOrder, ...(user.orders || [])]
    };
    saveUserToDb(updated);
  };

  // Settings operations
  const updateUserSettings = (settings) => {
    if (!user) return;
    const updated = {
      ...user,
      settings: { ...(user.settings || {}), ...settings }
    };
    saveUserToDb(updated);
  };

  const changePassword = (oldPassword, newPassword) => {
    if (!user) return { success: false, message: 'User not logged in' };
    if (user.password && user.password !== oldPassword) {
      return { success: false, message: 'Current password does not match' };
    }
    const updated = {
      ...user,
      password: newPassword
    };
    saveUserToDb(updated);
    return { success: true };
  };

  const sendOTPCode = async (phone) => {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Send OTP error', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP'
      };
    }
  };

  const verifyOTPCode = async (phone, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });
      const data = response.data;
      setUser(data);
      localStorage.setItem('swiggy_user', JSON.stringify(data));
      setIsOpen(false);
      return { success: true };
    } catch (error) {
      console.error('Verify OTP error', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid or expired OTP'
      };
    }
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        user,
        openLogin,
        openSignup,
        close,
        setMode,
        login: loginUser,
        signup: signupUser,
        logout: logoutUser,
        updateUserProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        toggleWishlist,
        addOrder,
        updateUserSettings,
        changePassword,
        sendOTPCode,
        verifyOTPCode
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}

