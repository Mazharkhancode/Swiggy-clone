import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { Settings as SettingsIcon, ShieldAlert, KeyRound, BellRing, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const { user, updateUserSettings, changePassword, logout } = useAuthModal();
  const navigate = useNavigate();

  // Route protection
  if (!user) {
    setTimeout(() => navigate('/login'), 0);
    return null;
  }

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Deactivate state
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Notifications State
  const notifications = user.settings || {
    orderUpdates: true,
    promoEmails: false,
    smsAlerts: true
  };

  const handleNotificationChange = (key, value) => {
    updateUserSettings({ [key]: value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    const result = changePassword(oldPassword, newPassword);
    if (result.success) {
      setPasswordSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } else {
      setPasswordError(result.message || 'Failed to change password.');
    }
  };

  const handleDeactivate = () => {
    // Perform mockup account deactivation: logout and remove details
    logout();
    navigate('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          <DashboardSidebar />

          <div className="flex-1 space-y-6">
            
            {/* Account Settings Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-8"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Account Settings</h1>
                <p className="text-gray-400 text-xs font-semibold mt-1">Configure your password, notifications, and security options</p>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="font-black text-gray-800 text-base flex items-center gap-2 border-b border-gray-50 pb-2">
                  <KeyRound className="text-[#ff5200]" size={18} /> Change Password
                </h3>

                <AnimatePresence>
                  {passwordSuccess && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-50 text-green-600 border border-green-100 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-bold"
                    >
                      <CheckCircle2 size={16} className="flex-shrink-0" />
                      <span>{passwordSuccess}</span>
                    </motion.div>
                  )}

                  {passwordError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 text-red-600 border border-red-100 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-bold"
                    >
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{passwordError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Current password"
                      className="px-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="px-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="px-4 py-3 w-full bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff5200] text-sm font-semibold transition-all"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2">
                    <button
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white py-3 px-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              <hr className="border-gray-50" />

              {/* Notification Toggles */}
              <div className="space-y-4">
                <h3 className="font-black text-gray-800 text-base flex items-center gap-2 border-b border-gray-50 pb-2">
                  <BellRing className="text-[#ff5200]" size={18} /> Notification Preferences
                </h3>

                <div className="space-y-3 max-w-md">
                  {[
                    { key: 'orderUpdates', title: 'Order Updates', desc: 'Receive real-time notifications about order packing & delivery.' },
                    { key: 'promoEmails', title: 'Offers and Promotions', desc: 'Get updates on discounts, seasonal deals, and promo codes.' },
                    { key: 'smsAlerts', title: 'SMS Alerts', desc: 'Receive secondary updates and security codes via text message.' }
                  ].map((pref) => (
                    <label
                      key={pref.key}
                      className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={!!notifications[pref.key]}
                        onChange={(e) => handleNotificationChange(pref.key, e.target.checked)}
                        className="mt-1 accent-[#ff5200] w-4 h-4 rounded border-gray-300 flex-shrink-0"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-bold text-sm text-gray-800 leading-none">{pref.title}</h4>
                        <p className="text-gray-400 text-xs font-semibold leading-normal">{pref.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-gray-50" />

              {/* Deactivate Account */}
              <div className="space-y-4">
                <h3 className="font-black text-red-600 text-base flex items-center gap-2 border-b border-gray-50 pb-2">
                  <ShieldAlert size={18} /> Danger Zone
                </h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-lg">
                  Deactivating your account will sign you out, remove all saved sessions, and clear temporary caches. This simulation cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeactivateModal(true)}
                  className="bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Deactivate Account
                </button>
              </div>

            </motion.div>

          </div>

        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      <AnimatePresence>
        {showDeactivateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center space-y-6"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xl mx-auto">
                <ShieldAlert size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-gray-900">Are you absolutely sure?</h3>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  This will log you out and deactivate your current simulated account. Do you wish to proceed?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Yes, Deactivate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
