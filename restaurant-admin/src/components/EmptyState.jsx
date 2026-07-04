import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  title = 'No Data Found',
  description = 'There are no items to display at the moment.',
  icon: Icon = PackageOpen,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-900 border border-slate-850 rounded-2xl p-8 max-w-md mx-auto my-6 shadow-xl animate-scale-in">
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 mb-4 flex items-center justify-center">
        <Icon size={36} className="text-indigo-400" />
      </div>
      <h4 className="font-bold text-slate-200 text-base mb-1.5 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
