import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" />;
      case 'error':
        return <AlertOctagon className="text-rose-400 w-5 h-5 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="text-amber-400 w-5 h-5 flex-shrink-0" />;
      default:
        return <Info className="text-blue-400 w-5 h-5 flex-shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20 bg-emerald-950/40 text-emerald-300';
      case 'error':
        return 'border-rose-500/20 bg-rose-950/40 text-rose-300';
      case 'warning':
        return 'border-amber-500/20 bg-amber-950/40 text-amber-300';
      default:
        return 'border-blue-500/20 bg-blue-950/40 text-blue-300';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start justify-between gap-3 p-4 border rounded-2xl backdrop-blur-md shadow-2xl pointer-events-auto animate-slide-in ${getBorderColor(
              t.type
            )}`}
          >
            <div className="flex gap-2.5">
              {getIcon(t.type)}
              <span className="text-xs font-semibold leading-5">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
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
