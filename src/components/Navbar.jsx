import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, ChevronDown, LayoutDashboard, ShoppingBag, Heart, MapPin, Settings } from 'lucide-react';
import { useAuthModal } from '../context/AuthModalContext';

export default function Navbar() {
  const { user, logout } = useAuthModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

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
      return <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />;
    }
    return (
      <div className="w-8 h-8 bg-black/20 text-white rounded-full flex items-center justify-center font-black text-xs uppercase border border-white/15">
        {user && user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : <User size={14} />}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-[#ff5200] text-white shadow-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/swiggy_logo.png?v=2" alt="Swiggy" className="h-9 sm:h-10 w-auto object-contain" />
        </Link>

        {/* Right Navigation */}
        <div className="hidden md:flex items-center gap-6 font-bold text-sm">
          <Link to="/restaurants" className="hover:opacity-80 transition-opacity">Restaurants</Link>
          <Link to="#" className="hover:opacity-80 transition-opacity">Swiggy Corporate</Link>
          {user && user.isPartner ? (
            <Link to="/partner/dashboard" className="hover:opacity-80 transition-opacity text-yellow-300 font-bold">Partner Dashboard</Link>
          ) : (
            <Link to="/partner" className="hover:opacity-80 transition-opacity">Partner with us</Link>
          )}
          
          {user ? (
            <div 
              className="relative"
              onMouseLeave={closeDropdown}
            >
              <button 
                onClick={toggleDropdown}
                className="flex items-center gap-2 bg-black/10 hover:bg-black/20 px-4 py-2 rounded-2xl border border-white/10 transition-all cursor-pointer select-none"
              >
                {renderAvatar()}
                <span className="max-w-[120px] truncate">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Card */}
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
                        <Icon size={14} className="text-gray-400 group-hover:text-[#ff5200]" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  <div className="border-t border-gray-50 mt-1.5 pt-1.5">
                    <button
                      onClick={() => {
                        closeDropdown();
                        logout();
                      }}
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
              <Link 
                to="/login"
                className="flex items-center gap-1 border border-white/30 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors"
              >
                Login
              </Link>

              <Link 
                to="/register"
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

