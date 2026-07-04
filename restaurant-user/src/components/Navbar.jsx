import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { Compass, ShoppingCart, User as UserIcon, LogOut, Search, Menu, X, ClipboardList } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (location.pathname !== '/' && query.trim() !== '') {
      navigate('/');
    }
  };

  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 z-40 w-full">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-amber-500 font-bold text-xl hover:opacity-90 transition-opacity flex-shrink-0">
          <Compass className="w-6 h-6 animate-spin-slow" />
          <span className="tracking-wide">BiteDash</span>
        </Link>

        {/* Global Search Input (only shown for logged-in users) */}
        {user && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search recipes, categories..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/" className="text-sm font-semibold text-slate-350 hover:text-amber-500 transition-colors">
                Home
              </Link>
              <Link to="/orders" className="text-sm font-semibold text-slate-350 hover:text-amber-500 transition-colors flex items-center gap-1.5">
                <ClipboardList size={16} />
                <span>My Orders</span>
              </Link>

              {/* Shopping Cart Icon with Badge */}
              <Link to="/checkout" className="relative p-2.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-300 hover:text-amber-500 hover:border-amber-500/20 transition-all">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center border border-slate-950 animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-xl text-slate-300 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <UserIcon size={14} />
                  </div>
                  <span className="text-xs font-semibold">{user.fullName}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-scale-in">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-all"
                    >
                      <UserIcon size={14} />
                      <span>Edit Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-all"
                    >
                      <ClipboardList size={14} />
                      <span>View Orders</span>
                    </Link>
                    <div className="border-t border-slate-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2.5">
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

        {/* Mobile menu toggle & cart icon */}
        <div className="flex md:hidden items-center gap-3">
          {user && (
            <Link to="/checkout" className="relative p-2 bg-slate-900 border border-slate-850 rounded-xl text-slate-300">
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-slate-900 border border-slate-850 rounded-xl text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-900 p-6 flex flex-col gap-5 animate-slide-in">
          {user && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search size={14} />
              </div>
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-slate-900 border border-slate-850 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div className="flex flex-col gap-4 text-sm font-semibold">
            {user ? (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-amber-400">
                  Home
                </Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-amber-400">
                  My Orders
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-amber-400">
                  My Profile
                </Link>
                <div className="border-t border-slate-900 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-rose-400 text-left cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
