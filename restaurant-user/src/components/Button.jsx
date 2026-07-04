import React from 'react';
import Loader from './Loader';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99]';
  
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-slate-950 focus:ring-amber-500 shadow-lg shadow-amber-500/10',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 focus:ring-slate-700',
    outline: 'border border-slate-700 hover:bg-slate-800 text-slate-300 focus:ring-slate-600',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-500 shadow-lg shadow-rose-500/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader size="sm" className="text-current" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'md' ? 18 : 22} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
