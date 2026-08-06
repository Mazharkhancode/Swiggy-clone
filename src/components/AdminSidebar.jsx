import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, ShoppingCart, Home, Users } from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Restaurants', path: '/admin/restaurants', icon: Utensils },
    { name: 'Manage Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-xl min-h-[400px] md:min-h-[600px] border border-slate-800">
      <div className="space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-[#ff5200] rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md shadow-orange-500/20">
            A
          </div>
          <div>
            <h3 className="font-black text-sm tracking-tight text-white">Swiggy Admin</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Control Center</p>
          </div>
        </div>

        <hr className="border-slate-800" />

        {/* Links */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = path === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all select-none border border-transparent ${
                  isActive
                    ? 'bg-[#ff5200] text-white shadow-md shadow-orange-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-800'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-800 mt-8">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-800 transition-all select-none border border-transparent"
        >
          <Home size={16} className="text-slate-500" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  );
}
