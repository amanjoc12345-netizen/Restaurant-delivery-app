import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-6 relative overflow-hidden bg-slate-950">
      {/* Glow Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-slate-900 border border-slate-850 p-8 rounded-2xl shadow-2xl animate-scale-in">
        <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 mx-auto mb-5">
          <ShieldAlert size={28} />
        </div>

        <h1 className="text-3xl font-black text-slate-100 tracking-tight mb-2">
          404 Page Error
        </h1>
        
        <p className="text-slate-400 font-bold text-xs uppercase tracking-wider text-indigo-400 mb-4">
          Access Violated or Path Missing
        </p>

        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          The routing endpoint you are trying to visit is not registered in the system configuration. Check your permissions or link structure.
        </p>

        <Link to="/" className="inline-block">
          <Button variant="primary" size="sm" icon={ArrowLeft}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
