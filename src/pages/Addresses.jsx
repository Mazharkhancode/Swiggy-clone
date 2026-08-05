import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { MapPin, Plus, Edit, Trash, X, Check, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Addresses() {
  const { user, addAddress, updateAddress, deleteAddress } = useAuthModal();
  const navigate = useNavigate();

  // Route protection
  if (!user) {
    setTimeout(() => navigate('/login'), 0);
    return null;
  }

  // Address modal form state
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null for adding, address ID for editing
  
  const [type, setType] = useState('Home');
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditId(null);
    setType('Home');
    setName(user.name || '');
    setDetails('');
    setPhone(user.phone || '');
    setError('');
    setIsOpen(true);
  };

  const openEditModal = (addr) => {
    setEditId(addr.id);
    setType(addr.type);
    setName(addr.name);
    setDetails(addr.details);
    setPhone(addr.phone);
    setError('');
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !details || !phone) {
      setError('Please fill in all fields.');
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    const payload = { type, name, details, phone };

    if (editId) {
      updateAddress(editId, payload);
    } else {
      addAddress(payload);
    }

    setIsOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          <DashboardSidebar />

          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-50 pb-5">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Saved Addresses</h1>
                  <p className="text-gray-400 text-xs font-semibold mt-1">Add, update, or remove your delivery locations</p>
                </div>
                <button
                  onClick={openAddModal}
                  className="bg-[#ff5200] hover:bg-[#e64a00] text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer h-fit self-start sm:self-auto"
                >
                  <Plus size={16} /> Add Address
                </button>
              </div>

              {user.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {user.addresses.map((address) => (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border-2 border-gray-100 rounded-3xl p-5 bg-white hover:border-orange-200 hover:shadow-sm transition-all flex flex-col justify-between min-h-[160px]"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            address.type === 'Home' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                              : address.type === 'Work' 
                                ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                : 'bg-green-50 text-green-700 border border-green-100'
                          }`}>
                            {address.type}
                          </span>
                          <span className="p-1.5 bg-orange-50 text-[#ff5200] rounded-lg">
                            <MapPin size={14} />
                          </span>
                        </div>

                        <p className="font-bold text-sm text-gray-900 mt-2">{address.name}</p>
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed line-clamp-2">{address.details}</p>
                        <p className="text-xs text-gray-400">Phone: {address.phone}</p>
                      </div>

                      {/* Card Actions */}
                      <div className="flex justify-end gap-2 border-t border-gray-50 pt-4 mt-4 text-xs font-bold">
                        <button
                          onClick={() => openEditModal(address)}
                          className="flex items-center gap-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border-0"
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => deleteAddress(address.id)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border-0"
                        >
                          <Trash size={12} /> Delete
                        </button>
                      </div>

                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-6 gap-3 mt-8">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl">📍</div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg">No addresses saved</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Please add a delivery address to complete checkout faster.</p>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="bg-[#ff5200] hover:bg-[#e64a00] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all mt-3 cursor-pointer"
                  >
                    Add Your First Address
                  </button>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-black text-gray-900">
                  {editId ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full cursor-pointer border-0"
                >
                  <X size={16} />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 rounded-xl p-3 flex items-center gap-2 text-xs font-bold border border-red-100">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Address Type</label>
                  <div className="flex gap-2.5">
                    {['Home', 'Work', 'Other'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border-2 transition-all ${
                          type === t
                            ? 'bg-[#ff5200] border-[#ff5200] text-white shadow-sm'
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Receiver Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter receiver's full name"
                    className="px-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    placeholder="10-digit phone number"
                    className="px-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                  />
                </div>

                {/* Complete Address */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Complete Address</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Flat/House No, Building, Landmark, Locality..."
                    className="px-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold h-24 resize-none transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#ff5200] hover:bg-[#e64a00] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save size={14} /> Save Address
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
