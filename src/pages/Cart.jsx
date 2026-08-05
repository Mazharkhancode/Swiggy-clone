import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, Tag, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, activeRestaurant, updateQuantity, removeFromCart, subtotal, cartCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Pre-defined coupons listing
  const availableCoupons = [
    { code: 'SWIGGY60', title: '60% OFF', desc: 'Flat 60% OFF on all order values', val: 0.6, type: 'percent' },
    { code: 'WELCOME125', title: 'Flat ₹125 OFF', desc: 'On orders above ₹249', val: 125, type: 'flat', minOrder: 249 },
    { code: 'TRYNEW50', title: '50% OFF up to ₹100', desc: 'Save 50% on first orders', val: 100, type: 'maxPercent', percentVal: 0.5 }
  ];

  const applyCoupon = (code) => {
    setCouponError('');
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      setCouponError('Invalid coupon code.');
      setCouponDiscount(0);
      setAppliedCoupon('');
      return;
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      setCouponError(`Min order value of ₹${coupon.minOrder} required.`);
      setCouponDiscount(0);
      setAppliedCoupon('');
      return;
    }

    let discount = 0;
    if (coupon.type === 'flat') {
      discount = coupon.val;
    } else if (coupon.type === 'percent') {
      discount = Math.round(subtotal * coupon.val);
    } else if (coupon.type === 'maxPercent') {
      discount = Math.min(Math.round(subtotal * coupon.percentVal), coupon.val);
    }

    setCouponDiscount(discount);
    setAppliedCoupon(coupon.code);
    setCouponCode(coupon.code);
    sessionStorage.setItem('applied_coupon', coupon.code);
    sessionStorage.setItem('coupon_discount', discount.toString());
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
    setCouponCode('');
    sessionStorage.removeItem('applied_coupon');
    sessionStorage.removeItem('coupon_discount');
  };

  // Fees calculations
  const deliveryFee = activeRestaurant ? activeRestaurant.deliveryFee : 0;
  const platformFee = 5;
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = Math.max(subtotal + deliveryFee + platformFee + gst - couponDiscount, 0);

  const handleCheckoutRedirect = () => {
    // Save billing data for reference
    sessionStorage.setItem('grand_total', grandTotal.toString());
    navigate('/checkout');
  };

  if (cartCount === 0 || !activeRestaurant) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-48 h-48 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-[#ff5200] opacity-80" size={80} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Your Cart is Empty</h2>
        <p className="text-gray-400 text-sm font-semibold max-w-sm mt-2 mb-6">
          Good food is always cooking! Go ahead and order some delicious dishes from top restaurants.
        </p>
        <Link to="/" className="bg-[#ff5200] text-white font-bold py-3.5 px-8 rounded-2xl hover:bg-[#e64a00] shadow-lg shadow-orange-500/20 transition-all">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Secure Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items List (Left Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Restaurant header */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-orange-100 text-[#ff5200] flex items-center justify-center font-black">
                🍽️
              </span>
              <div>
                <h3 className="font-black text-gray-800 text-base">{activeRestaurant.name}</h3>
                <p className="text-xs text-gray-400 font-semibold">Serving fresh food straight to you</p>
              </div>
            </div>

            {/* Cart Items Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-lg font-black text-gray-800 border-b border-gray-50 pb-3">Selected Dishes</h2>
              
              <AnimatePresence>
                {cartItems.map((cartItem) => (
                  <motion.div 
                    key={cartItem.item.id} 
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-center justify-between gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                  >
                    
                    {/* Item info */}
                    <div className="flex items-start gap-3 max-w-[60%]">
                      <span className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                        cartItem.item.veg ? 'bg-green-500' : 'bg-red-500'
                      }`} title={cartItem.item.veg ? 'Veg' : 'Non-Veg'} />
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm leading-tight">{cartItem.item.name}</h4>
                        <p className="text-xs text-gray-400 font-semibold mt-0.5">₹{cartItem.item.price}</p>
                      </div>
                    </div>

                    {/* Quantity Selector & Price */}
                    <div className="flex items-center gap-6">
                      
                      {/* Counter */}
                      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-2.5 py-1.5 gap-3.5">
                        <button 
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-black text-sm text-gray-800 w-4 text-center">{cartItem.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                          className="text-gray-500 hover:text-[#ff5200] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-bold text-sm text-gray-800 w-16 text-right">
                        ₹{cartItem.item.price * cartItem.quantity}
                      </span>

                      {/* Trash action */}
                      <button 
                        onClick={() => removeFromCart(cartItem.item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Coupons Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-gray-800 mb-4">Select Coupons</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableCoupons.map((coupon) => (
                  <div 
                    key={coupon.code}
                    onClick={() => applyCoupon(coupon.code)}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      appliedCoupon === coupon.code 
                        ? 'border-[#ff5200] bg-orange-50/10' 
                        : 'border-gray-100 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="bg-orange-50 text-[#ff5200] text-xs font-black px-2 py-0.5 rounded border border-orange-100">
                        {coupon.code}
                      </span>
                      {appliedCoupon === coupon.code && (
                        <span className="text-[#ff5200] text-xs font-black">Applied</span>
                      )}
                    </div>
                    <h4 className="font-black text-sm text-gray-800 mt-1.5">{coupon.title}</h4>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">{coupon.desc}</p>
                  </div>
                ))}
              </div>

              {/* Direct Input */}
              <div className="mt-5 border-t border-gray-50 pt-5 flex gap-3 max-w-md">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Tag size={16} />
                  </span>
                  <input 
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="pl-9 pr-4 py-2.5 w-full bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold uppercase"
                  />
                </div>
                {appliedCoupon ? (
                  <button 
                    onClick={removeCoupon}
                    className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800"
                  >
                    Remove
                  </button>
                ) : (
                  <button 
                    onClick={() => applyCoupon(couponCode)}
                    className="bg-[#ff5200] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#e64a00]"
                  >
                    Apply
                  </button>
                )}
              </div>
              {couponError && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{couponError}</p>}
            </div>

          </div>

          {/* Billing summary card (Right Column) */}
          <div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-black text-gray-800 mb-5 border-b border-gray-50 pb-3">Bill Details</h2>
              
              <div className="space-y-3.5 text-xs font-semibold text-gray-500 mb-6">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="text-gray-800 font-bold">₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Coupon ({appliedCoupon}) Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="text-gray-800 font-bold">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="text-gray-800 font-bold">₹{platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Restaurant Charges</span>
                  <span className="text-gray-800 font-bold">₹{gst}</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 flex justify-between text-sm font-black text-gray-900">
                  <span>To Pay</span>
                  <span className="text-[#ff5200] text-base">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button 
                onClick={handleCheckoutRedirect}
                className="w-full bg-[#ff5200] hover:bg-[#e64a00] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
