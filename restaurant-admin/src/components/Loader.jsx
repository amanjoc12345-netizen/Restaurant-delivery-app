import React from 'react';

const Loader = ({ size = 'md', className = '', fullPage = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-transparent border-slate-500 ${sizeClasses[size]} ${className}`}
      style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm font-medium text-slate-400">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loader;
