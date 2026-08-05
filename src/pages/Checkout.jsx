import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuthModal } from '../context/AuthModalContext';
import { MapPin, Plus, CreditCard, ShieldCheck, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, activeRestaurant, subtotal, clearCart } = useCart();
  const { user, openLogin, addAddress, addOrder } = useAuthModal();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Saved Addresses State
  const [addresses, setAddresses] = useState(() => {
    return user && user.addresses && user.addresses.length > 0
      ? user.addresses
      : [
          { id: '1', type: 'Home', name: user?.name || 'Rahul Sharma', details: '104, Maple Heights, Vijay Nagar, Indore - 452010', phone: user?.phone || '9876543210' },
          { id: '2', type: 'Work', name: user?.name || 'Rahul Sharma', details: '5th Floor, Palasia Business Center, Palasia, Indore - 452001', phone: user?.phone || '9876543210' }
        ];
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      return user.addresses[0].id;
    }
    return '1';
  });

  // Sync addresses state if user context addresses load/change
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      setAddresses(user.addresses);
      // Ensure a valid selection is kept
      const currentSelectionExists = user.addresses.some(a => a.id === selectedAddressId);
      if (!currentSelectionExists) {
        setSelectedAddressId(user.addresses[0].id);
      }
    }
  }, [user, selectedAddressId]);

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New Address Form State
  const [newType, setNewType] = useState('Home');
  const [newName, setNewName] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [formError, setFormError] = useState('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Simulation loading state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  // Billing Calculations
  const couponCode = sessionStorage.getItem('applied_coupon') || '';
  const couponDiscount = parseFloat(sessionStorage.getItem('coupon_discount') || '0');
  
  const deliveryFee = activeRestaurant ? activeRestaurant.deliveryFee : 0;
  const platformFee = 5;
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + platformFee + gst - couponDiscount;

  const handleAddAddress = (e) => {
    e.preventDefault();
    setFormError('');
    if (!newName || !newDetails || !newPhone) {
      setFormError('Please fill in all fields.');
      return;
    }
    const newAddress = {
      id: Date.now().toString(),
      type: newType,
      name: newName,
      details: newDetails,
      phone: newPhone
    };
    setAddresses([...addresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    
    if (user) {
      addAddress(newAddress);
    }

    setShowNewAddressForm(false);
    // Reset fields
    setNewName('');
    setNewDetails('');
    setNewPhone('');
  };

  const handlePlaceOrder = () => {
    if (!user) {
      openLogin();
      return;
    }
    setIsPlacingOrder(true);
    setSimulationStep(1);

    // Simulate backend processing stages
    setTimeout(() => {
      setSimulationStep(2); // Sending to restaurant
      setTimeout(() => {
        setSimulationStep(3); // Restaurant confirmed
        setTimeout(() => {
          // Success redirection
          const orderId = `SW-${Math.floor(10000000 + Math.random() * 90000000)}`;
          const address = addresses.find(a => a.id === selectedAddressId)?.details || '';
          
          const richOrder = {
            orderId,
            restaurantId: activeRestaurant?.id || 'nafees',
            restaurantName: activeRestaurant?.name || 'Swiggy Restaurant',
            address,
            grandTotal,
            paymentMethod: paymentMethod.toUpperCase(),
            items: cartItems.map(item => ({
              item: {
                id: item.item.id,
                name: item.item.name,
                price: item.item.price,
                veg: item.item.veg,
                image: item.item.image,
                desc: item.item.desc || ''
              },
              quantity: item.quantity,
              restaurantId: item.restaurantId
            }))
          };

          // Save order to history context
          addOrder(richOrder);

          // Save order success context to sessionStorage for legacy support (OrderSuccess page)
          sessionStorage.setItem('last_order_details', JSON.stringify(richOrder));

          clearCart();
          setIsPlacingOrder(false);
          navigate('/order-success');
        }, 1500);
      }, 1500);
    }, 1500);
  };

  if (cartItems.length === 0 || !activeRestaurant) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 font-bold mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Addresses & Payments */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Selection Block */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="text-[#ff5200]" size={20} />
                Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      selectedAddressId === address.id
                        ? 'border-[#ff5200] bg-orange-50/20'
                        : 'border-gray-100 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        address.type === 'Home' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {address.type}
                      </span>
                      {selectedAddressId === address.id && (
                        <div className="w-4 h-4 rounded-full bg-[#ff5200] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                    <p className="font-bold text-sm text-gray-800 mb-1">{address.name}</p>
                    <p className="text-xs text-gray-500 font-semibold mb-2 leading-relaxed">{address.details}</p>
                    <p className="text-xs text-gray-400">Phone: {address.phone}</p>
                  </div>
                ))}

                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="border-2 border-dashed border-gray-200 hover:border-[#ff5200] rounded-2xl p-4 flex flex-col items-center justify-center text-center text-gray-500 hover:text-[#ff5200] transition-colors gap-2 min-h-[140px]"
                >
                  <Plus size={24} />
                  <span className="font-bold text-sm">Add New Address</span>
                </button>
              </div>

              {/* Add New Address Form Modal/Dropdown */}
              <AnimatePresence>
                {showNewAddressForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 border-t border-gray-100 pt-6"
                  >
                    <form onSubmit={handleAddAddress} className="space-y-4 max-w-lg">
                      <h3 className="font-black text-sm text-gray-700">Add Delivery Instructions</h3>
                      {formError && <div className="text-red-500 text-xs font-bold">{formError}</div>}
                      
                      <div className="flex gap-4">
                        {['Home', 'Work'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setNewType(type)}
                            className={`px-4 py-2 rounded-full font-bold text-xs ${
                              newType === type ? 'bg-[#ff5200] text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="px-4 py-2.5 w-full bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          className="px-4 py-2.5 w-full bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm"
                        />
                      </div>
                      <textarea
                        placeholder="Complete Address (Flat/House No, Building, Landmark, Locality)"
                        value={newDetails}
                        onChange={(e) => setNewDetails(e.target.value)}
                        className="px-4 py-2.5 w-full bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm h-20 resize-none"
                      />

                      <div className="flex gap-3">
                        <button type="submit" className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-800">
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewAddressForm(false)}
                          className="border border-gray-200 text-gray-500 px-5 py-2 rounded-xl text-xs font-bold hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Payment Method Block */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="text-[#ff5200]" size={20} />
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'upi', title: 'UPI (Paytm, GPay, PhonePe)' },
                  { id: 'card', title: 'Credit / Debit Card' },
                  { id: 'cod', title: 'Cash on Delivery (COD)' },
                  { id: 'netbanking', title: 'Net Banking' }
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                      paymentMethod === method.id
                        ? 'border-[#ff5200] bg-orange-50/20'
                        : 'border-gray-100 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === method.id ? 'border-[#ff5200]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-[#ff5200]"></div>
                      )}
                    </div>
                    <span className="font-bold text-sm text-gray-800">{method.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Bill Review & Final Place Order */}
          <div className="space-y-6">
            
            {/* Bill Preview Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                <ShoppingBag className="text-[#ff5200]" size={20} />
                Order Summary
              </h2>

              <div className="mb-4">
                <span className="text-[10px] bg-orange-50 text-[#ff5200] font-black px-2 py-0.5 rounded uppercase">
                  From: {activeRestaurant.name}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 max-w-[70%]">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        cartItem.item.veg ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className="font-bold text-gray-800 truncate">{cartItem.item.name}</span>
                      <span className="text-gray-400 font-semibold">x{cartItem.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-700">₹{cartItem.item.price * cartItem.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-gray-50 pt-4 space-y-2.5 text-xs font-semibold text-gray-500 mb-6">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="text-gray-800">₹{subtotal}</span>
                </div>
                {couponCode && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Coupon ({couponCode}) Applied</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="text-gray-800">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="text-gray-800">₹{platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Restaurant Charges</span>
                  <span className="text-gray-800">₹{gst}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-black text-gray-900">
                  <span>To Pay</span>
                  <span className="text-[#ff5200]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Security Shield */}
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5 mb-6">
                <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
                <span className="text-[10px] text-gray-500 font-bold leading-normal">
                  Safe and Secure Payments. 100% authentic dishes guaranteed.
                </span>
              </div>

              {/* Place Order Trigger */}
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-[#ff5200] hover:bg-[#e64a00] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Place Order — ₹{grandTotal}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Placing Order Screen Simulation */}
      <AnimatePresence>
        {isPlacingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center shadow-2xl">
              <Loader2 className="text-[#ff5200] animate-spin mb-6" size={48} />
              
              <h3 className="text-lg font-black text-gray-800 mb-2">
                {simulationStep === 1 && 'Processing Payment...'}
                {simulationStep === 2 && 'Sending Order to Kitchen...'}
                {simulationStep === 3 && 'Restaurant Accepted Order!'}
              </h3>
              
              <p className="text-xs text-gray-400 font-semibold">
                {simulationStep === 1 && 'Securely communicating with bank servers.'}
                {simulationStep === 2 && `Relaying request to ${activeRestaurant.name}.`}
                {simulationStep === 3 && 'Kitchen crew is prepping your meal.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
