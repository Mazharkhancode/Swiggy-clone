import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { Camera, Save, CheckCircle2, User, Mail, Phone, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { user, updateUserProfile } = useAuthModal();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Route protection
  if (!user) {
    setTimeout(() => navigate('/login'), 0);
    return null;
  }

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Preset avatars for quick select
  const presets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80', // Foodie boy
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80', // Foodie girl
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80', // Chef style
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80', // Gourmet critic
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email || !phone) {
      setError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    updateUserProfile({ name, email, phone, avatar });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          <DashboardSidebar />

          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-8"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Profile Details</h1>
                <p className="text-gray-400 text-xs font-semibold mt-1">Manage your identity and profile image on Swiggy</p>
              </div>

              {/* Alerts */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 text-green-600 border border-green-100 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-bold"
                  >
                    <CheckCircle2 size={18} className="flex-shrink-0" />
                    <span>Your profile details have been successfully updated!</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 text-red-600 border border-red-100 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-bold"
                  >
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Profile Picture Uploader */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider">Profile Picture</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    
                    {/* Avatar Circle */}
                    <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-orange-100 shadow-md">
                      {avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#ff5200] to-orange-400 text-white flex items-center justify-center font-black text-2xl uppercase">
                          {name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
                        </div>
                      )}
                      
                      {/* Upload overlay */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                      >
                        <Camera size={20} />
                        <span className="text-[9px] font-black uppercase mt-1">Upload</span>
                      </div>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {/* Presets gallery */}
                    <div className="space-y-2 text-center sm:text-left">
                      <p className="text-xs text-gray-500 font-semibold">Or choose from local avatars:</p>
                      <div className="flex gap-3 justify-center sm:justify-start">
                        {presets.map((preset, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setAvatar(preset)}
                            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${avatar === preset ? 'border-[#ff5200] scale-110 shadow-sm' : 'border-gray-100'}`}
                          >
                            <img src={preset} alt={`Preset ${index}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                        placeholder="10-digit phone number"
                        className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-[#ff5200] hover:bg-[#e64a00] text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
