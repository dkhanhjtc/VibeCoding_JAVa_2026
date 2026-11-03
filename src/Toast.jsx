import React, { useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export const Toast = ({
  message,
  type = 'success',
  onClose,
  duration = 3000
}) => {
  const toastRef = useRef(null);

  useGSAP(() => {
    if (!message || !toastRef.current) return;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(toastRef.current,
      { y: 24, autoAlpha: 0, scale: 0.94 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.32, ease: 'back.out(1.4)', clearProps: 'transform,opacity,visibility' }
    );
  }, { scope: toastRef, dependencies: [message], revertOnUpdate: true });

  const { contextSafe } = useGSAP({ scope: toastRef });

  const handleClose = contextSafe(() => {
    if (!toastRef.current) {
      onClose?.();
      return;
    }
    gsap.to(toastRef.current, {
      y: 15,
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => onClose?.()
    });
  });

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isWarning = type === 'warning';
  const isError = type === 'error';

  return (
    <aside
      ref={toastRef}
      aria-label="Thông báo hệ thống"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)]"
    >
      <div className="bg-[#00203d] text-white rounded-2xl p-4 shadow-elevated border border-[#1f4f5a] flex items-start gap-3 backdrop-blur-md">
        <div className="mt-0.5 shrink-0">
          {isSuccess && (
            <div className="w-8 h-8 rounded-full bg-[#3b7a8c]/25 text-[#a1c0d1] flex items-center justify-center border border-[#3b7a8c]/50">
              <CheckCircle2 className="w-5 h-5 text-[#3b7a8c]" />
            </div>
          )}
          {isWarning && (
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
          )}
          {isError && (
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
          )}
          {!isSuccess && !isWarning && !isError && (
            <div className="w-8 h-8 rounded-full bg-[#6b99ab]/20 text-[#a1c0d1] flex items-center justify-center border border-[#6b99ab]/30">
              <Info className="w-5 h-5 text-[#a1c0d1]" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <p className="text-sm font-semibold text-white tracking-wide">
            {typeof message === 'object' ? message.title : (isSuccess ? 'Thành công!' : 'Thông báo')}
          </p>
          <p className="text-xs text-[#a1c0d1] mt-0.5 leading-relaxed">
            {typeof message === 'object' ? message.text : message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="text-[#a1c0d1] hover:text-white p-1 rounded-lg hover:bg-[#0f383f] transition-colors shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Toast;
