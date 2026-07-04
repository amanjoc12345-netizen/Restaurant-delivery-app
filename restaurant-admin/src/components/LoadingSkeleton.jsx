import React from 'react';

const LoadingSkeleton = ({ type = 'table', rows = 5, cols = 4 }) => {
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-900 border border-slate-850 rounded-2xl p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-3 w-20 bg-slate-800 rounded" />
              <div className="h-8 w-8 bg-slate-800 rounded-xl" />
            </div>
            <div className="h-6 w-16 bg-slate-800 rounded mb-1" />
          </div>
        ))}
      </div>
    );
  }

  // default table skeleton loader
  return (
    <div className="w-full bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl animate-pulse">
      {/* Header mock */}
      <div className="h-12 bg-slate-950/40 border-b border-slate-850 flex items-center px-6 gap-4">
        {Array.from({ length: cols }).map((_, idx) => (
          <div key={idx} className="h-2.5 bg-slate-850 rounded flex-1" />
        ))}
      </div>
      {/* Rows mock */}
      <div className="divide-y divide-slate-850">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="h-16 flex items-center px-6 gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div key={cIdx} className="h-2.5 bg-slate-800 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
