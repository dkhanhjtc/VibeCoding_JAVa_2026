import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { loginAdmin } from '../services/authService.js';
import { Button, FormInput, SectionBadge } from './UIPrimitives.jsx';

export const AdminLoginModal = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await loginAdmin(username, password);
      if (result.success) {
        onLoginSuccess?.(result.user);
        onClose?.();
      } else {
        setError(result.error || 'Tên đăng nhập hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi xác thực');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setUsername('admin');
    setPassword('Admin@2026!');
    setError('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#00203d]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-elevated max-w-md w-full border border-[#a1c0d1]/60 overflow-hidden flex flex-col my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ đăng nhập"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#f0f4f8] hover:bg-[#a1c0d1]/40 text-[#00203d] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b7a8c]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-7 pb-4 border-b border-[#a1c0d1]/40">
          <div className="w-10 h-10 rounded-2xl bg-[#00203d] text-white flex items-center justify-center shadow-subtle mb-3 border border-[#0f383f]">
            <Lock className="w-5 h-5 text-[#3b7a8c]" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b7a8c] block mb-0.5">
            BẢO MẬT HỆ THỐNG
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#00203d] tracking-tight">
            Đăng nhập Quản Trị
          </h2>
          <p className="text-xs text-[#1f4f5a] mt-1 leading-relaxed">
            Dành cho Quản trị viên và Ban Giám Khảo xem báo cáo chuyển đổi.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 pt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="adminUsername"
              label="Tên đăng nhập / Email"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              placeholder="admin hoặc admin@shopkhoisac.vn"
              autoComplete="username"
            />

            <div>
              <label htmlFor="adminPassword" className="block text-xs font-bold text-[#00203d] mb-1.5">
                Mật khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Nhập mật khẩu quản trị"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#a1c0d1] bg-white text-[#00203d] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b7a8c] focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-[#6b99ab] hover:text-[#00203d] transition-colors"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo Credential Helper for Judges */}
            <div className="p-3.5 rounded-2xl bg-[#f0f4f8] border border-[#a1c0d1] text-xs text-[#1f4f5a] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-[#00203d]">
                  <KeyRound className="w-3.5 h-3.5 text-[#3b7a8c]" />
                  <span>Tài khoản Demo cho BGK:</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="text-[11px] font-bold text-[#3b7a8c] hover:text-[#2e5e73] hover:underline cursor-pointer"
                >
                  Tự động điền
                </button>
              </div>
              <div className="font-mono text-[11px] text-[#0f383f] bg-white p-2 rounded-lg border border-[#a1c0d1]/60 flex items-center justify-between">
                <span>admin</span>
                <span className="text-[#6b99ab]">/</span>
                <span>Admin@2026!</span>
              </div>
              <p className="text-[10px] text-[#6b99ab]">
                Mật khẩu được băm và bảo vệ bằng Web Crypto SHA-256 an toàn.
              </p>
            </div>

            {/* Buttons */}
            <div className="pt-1 space-y-2">
              <Button
                type="submit"
                variant="navy"
                size="md"
                isLoading={isLoading}
                className="w-full group"
              >
                <span>{isLoading ? 'Đang xác thực SHA-256...' : 'Đăng nhập hệ thống'}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#3b7a8c]" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
                className="w-full"
              >
                ← Quay lại trang chủ
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;

