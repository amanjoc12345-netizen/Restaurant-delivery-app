import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LogOut, User as UserIcon } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 z-40 w-full">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-amber-500 font-bold text-xl hover:opacity-90 transition-opacity">
          <Compass className="w-6 h-6 animate-spin-slow" />
          <span className="tracking-wide">BiteDash</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* User profile dropdown indicator */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <UserIcon size={14} />
                </div>
                <span className="text-sm font-medium">{user.fullName}</span>
                <span className="text-2xs bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded uppercase font-semibold">
                  {user.role}
                </span>
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
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-slate-800">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
