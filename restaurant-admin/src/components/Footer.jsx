import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold">
          <Shield size={16} />
          <span>BiteDash Control Center</span>
        </div>
        <p>© 2026 BiteDash Admin Portal. Confidential & Proprietary.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400 transition-colors">Admin Security Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">System Status</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
