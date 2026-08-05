import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, ShoppingBag, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { useAuthModal } from '../context/AuthModalContext';

export default function DashboardSidebar() {
  const { user, logout } = useAuthModal();
  const location = useLocation();

  if (!user) return null;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile Details', path: '/profile', icon: User },
    { name: 'My Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
    { name: 'Saved Addresses', path: '/addresses', icon: MapPin },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Helper to render user initials or avatar
  const renderAvatar = () => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />;
    }
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    return (
      <div className="w-full h-full bg-gradient-to-tr from-[#ff5200] to-orange-400 text-white flex items-center justify-center font-black text-xl">
        {initials}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full md:w-64 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex-shrink-0 h-fit gap-6">
      
      {/* User Quick Info */}
      <div className="flex flex-row md:flex-col items-center gap-4 border-b border-gray-50 pb-6 text-left md:text-center">
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-orange-100 shadow-inner flex-shrink-0">
          {renderAvatar()}
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-gray-800 text-base md:text-lg truncate">{user.name}</h3>
          <p className="text-gray-400 text-xs font-semibold truncate mt-0.5">{user.email}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-1 scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap md:whitespace-normal ${
                isActive
                  ? 'bg-orange-50 text-[#ff5200]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#ff5200]' : 'text-gray-400'} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Logout button in sidebar for desktop */}
        <button
          onClick={logout}
          className="hidden md:flex items-center gap-3 px-4 py-3 mt-4 text-left text-red-500 hover:bg-red-50 hover:text-red-700 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border-0"
        >
          <LogOut size={18} className="text-red-400" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Mobile Logout Button (Visible only on small screens next to scrollable list) */}
      <button
        onClick={logout}
        className="flex md:hidden items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer border-0 flex-shrink-0"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>

    </div>
  );
}
