import { createContext, useContext, useState, useEffect } from 'react';

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

  const loginUser = (email, password) => {
    const db = getUsersDb();
    const emailKey = email.toLowerCase();
    
    let matchedUser;
    if (db[emailKey]) {
      // Mock validation: allow login if password matches (default to password123 if not set)
      matchedUser = db[emailKey];
      // For ease of testing, if they provide any password, let's match it.
      // If the db record has a password, validate it.
      if (matchedUser.password && matchedUser.password !== password) {
        return { success: false, message: 'Invalid password' };
      }
    } else {
      // Create user on-the-fly for existing/mock flows
      matchedUser = createDefaultUser(email.split('@')[0], email, '9876543210', password);
      db[emailKey] = matchedUser;
      localStorage.setItem('swiggy_users_db', JSON.stringify(db));
    }

    setUser(matchedUser);
    localStorage.setItem('swiggy_user', JSON.stringify(matchedUser));
    setIsOpen(false);
    return { success: true };
  };

  const signupUser = (name, email, phone, password) => {
    const db = getUsersDb();
    const emailKey = email.toLowerCase();

    if (db[emailKey]) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = createDefaultUser(name, email, phone, password);
    db[emailKey] = newUser;
    localStorage.setItem('swiggy_users_db', JSON.stringify(db));

    setUser(newUser);
    localStorage.setItem('swiggy_user', JSON.stringify(newUser));
    setIsOpen(false);
    return { success: true };
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('swiggy_user');
  };

  // Profile operations
  const updateUserProfile = (fields) => {
    if (!user) return;
    const updated = { ...user, ...fields };
    saveUserToDb(updated);
  };

  // Address operations
  const addAddress = (address) => {
    if (!user) return;
    const newAddress = {
      id: Date.now().toString(),
      ...address
    };
    const updated = {
      ...user,
      addresses: [...(user.addresses || []), newAddress]
    };
    saveUserToDb(updated);
  };

  const updateAddress = (addressId, updatedAddress) => {
    if (!user) return;
    const updated = {
      ...user,
      addresses: (user.addresses || []).map(addr => addr.id === addressId ? { ...addr, ...updatedAddress } : addr)
    };
    saveUserToDb(updated);
  };

  const deleteAddress = (addressId) => {
    if (!user) return;
    const updated = {
      ...user,
      addresses: (user.addresses || []).filter(addr => addr.id !== addressId)
    };
    saveUserToDb(updated);
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
      status: 'Delivered',
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
        changePassword
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

