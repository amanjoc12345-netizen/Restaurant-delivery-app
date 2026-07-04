import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`w-full bg-slate-900 border text-slate-200 text-sm rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
            Icon ? 'pl-11' : ''
          } ${
            error ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500' : 'border-slate-800 focus:border-amber-500'
          }`}
          {...props}
        />
      </div>
      {error ? (
        <span className="text-xs font-medium text-rose-500 animate-slide-in">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
