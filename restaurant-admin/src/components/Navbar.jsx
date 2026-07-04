import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Shield, LogOut, LayoutDashboard } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 z-40 w-full">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-400 font-bold text-xl hover:opacity-90 transition-opacity">
          <Shield className="w-6 h-6 text-indigo-500" />
          <span className="tracking-wide">BiteDash <span className="text-slate-400 font-medium text-sm px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded ml-1">Admin</span></span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {admin ? (
            <>
              {/* Admin profile details */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-350 text-xs font-medium">
                <LayoutDashboard size={14} className="text-indigo-400" />
                <span>{admin.email}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-800 hover:border-rose-500/30 hover:text-rose-400"
                icon={LogOut}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-slate-800">
                Log In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
