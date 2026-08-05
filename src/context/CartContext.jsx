import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [replaceCartPrompt, setReplaceCartPrompt] = useState({
    show: false,
    item: null,
    restaurant: null,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('swiggy_cart');
    const savedRest = localStorage.getItem('swiggy_active_restaurant');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
    if (savedRest) {
      try {
        setActiveRestaurant(JSON.parse(savedRest));
      } catch (e) {
        console.error('Error loading restaurant info', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCartToStorage = (items, rest) => {
    localStorage.setItem('swiggy_cart', JSON.stringify(items));
    if (rest) {
      localStorage.setItem('swiggy_active_restaurant', JSON.stringify(rest));
    } else {
      localStorage.removeItem('swiggy_active_restaurant');
    }
  };

  const addToCart = (item, restaurant) => {
    // If active restaurant exists and is different from the item's restaurant
    if (activeRestaurant && activeRestaurant.id !== restaurant.id) {
      setReplaceCartPrompt({
        show: true,
        item,
        restaurant,
      });
      return false;
    }

    let updatedItems;
    const existingIndex = cartItems.findIndex((cartItem) => cartItem.item.id === item.id);

    if (existingIndex > -1) {
      updatedItems = [...cartItems];
      updatedItems[existingIndex].quantity += 1;
    } else {
      updatedItems = [...cartItems, { item, quantity: 1, restaurantId: restaurant.id }];
    }

    setCartItems(updatedItems);
    if (!activeRestaurant) {
      setActiveRestaurant(restaurant);
      saveCartToStorage(updatedItems, restaurant);
    } else {
      saveCartToStorage(updatedItems, activeRestaurant);
    }
    return true;
  };

  const confirmReplaceCart = () => {
    const { item, restaurant } = replaceCartPrompt;
    if (item && restaurant) {
      const updatedItems = [{ item, quantity: 1, restaurantId: restaurant.id }];
      setCartItems(updatedItems);
      setActiveRestaurant(restaurant);
      saveCartToStorage(updatedItems, restaurant);
    }
    setReplaceCartPrompt({ show: false, item: null, restaurant: null });
  };

  const cancelReplaceCart = () => {
    setReplaceCartPrompt({ show: false, item: null, restaurant: null });
  };

  const removeFromCart = (itemId) => {
    const existingIndex = cartItems.findIndex((cartItem) => cartItem.item.id === itemId);
    if (existingIndex === -1) return;

    let updatedItems = [...cartItems];
    if (updatedItems[existingIndex].quantity > 1) {
      updatedItems[existingIndex].quantity -= 1;
    } else {
      updatedItems = updatedItems.filter((cartItem) => cartItem.item.id !== itemId);
    }

    setCartItems(updatedItems);

    if (updatedItems.length === 0) {
      setActiveRestaurant(null);
      saveCartToStorage([], null);
    } else {
      saveCartToStorage(updatedItems, activeRestaurant);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedItems = cartItems.map((cartItem) => {
      if (cartItem.item.id === itemId) {
        return { ...cartItem, quantity };
      }
      return cartItem;
    });

    setCartItems(updatedItems);
    saveCartToStorage(updatedItems, activeRestaurant);
  };

  const clearCart = () => {
    setCartItems([]);
    setActiveRestaurant(null);
    saveCartToStorage([], null);
  };

  const cartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  const subtotal = cartItems.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        activeRestaurant,
        replaceCartPrompt,
        addToCart,
        confirmReplaceCart,
        cancelReplaceCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
