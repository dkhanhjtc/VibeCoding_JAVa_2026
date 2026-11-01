import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({
  message,
  type = 'success',
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isWarning = type === 'warning';
  const isError = type === 'error';

  return (
    <aside
      aria-label="Thông báo hệ thống"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] transition-all"
    >
      <div className="bg-[#111827] text-white rounded-2xl p-4 shadow-2xl border border-gray-700/60 flex items-start gap-3 backdrop-blur-md">
        <div className="mt-0.5 shrink-0">
          {isSuccess && (
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          {isWarning && (
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          {isError && (
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          {!isSuccess && !isWarning && !isError && (
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Info className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <p className="text-sm font-semibold text-white tracking-wide">
            {typeof message === 'object' ? message.title : (isSuccess ? 'Thành công!' : 'Thông báo')}
          </p>
          <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
            {typeof message === 'object' ? message.text : message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Toast;
