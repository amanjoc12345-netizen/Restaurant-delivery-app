import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  Layers,
  Utensils,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import Button from './Button';

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Categories', path: '/categories', icon: Layers },
    { label: 'Recipes', path: '/recipes', icon: Utensils },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const getLinkClass = ({ isActive }) => {
    const base =
      'flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer';
    if (isActive) {
      return `${base} bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500`;
    }
    return `${base} text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-l-2 border-transparent`;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-850/60 p-5">
      {/* Brand Header */}
      <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-lg px-2 py-4 mb-6 border-b border-slate-850">
        <Shield className="w-5 h-5 text-indigo-500" />
        <span className="tracking-wide">
          BiteDash <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded ml-1 border border-indigo-500/20 font-bold uppercase">Admin</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={getLinkClass}
              end={item.path === '/'}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Quick Profile Details */}
      <div className="mt-auto border-t border-slate-850 pt-5 space-y-4">
        <div className="px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Logged In As</p>
          <p className="text-xs font-medium text-slate-300 truncate mt-0.5">{admin?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all text-left cursor-pointer border-l-2 border-transparent"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Layout Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-16 bg-slate-900 border-b border-slate-850/60 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-base">
            <Shield className="w-5 h-5 text-indigo-500" />
            <span className="tracking-wide">BiteDash Admin</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-slate-950 border border-slate-850 rounded-xl text-slate-300 cursor-pointer"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        {/* Mobile Sidebar Slide-out Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer panel */}
            <aside className="relative w-64 h-full bg-slate-900 shadow-2xl animate-slide-in">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
