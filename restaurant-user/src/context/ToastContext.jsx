import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay Container */}
      <div className="fixed bottom-5 right-5 z-55 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
            error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
            info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          };

          const Icon = {
            success: CheckCircle2,
            error: AlertCircle,
            info: Info,
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 border rounded-xl backdrop-blur-md shadow-lg transition-all duration-300 animate-slide-in ${typeStyles[toast.type]}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-xs font-semibold leading-snug">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
