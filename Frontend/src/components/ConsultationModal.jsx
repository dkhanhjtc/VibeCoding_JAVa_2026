import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ShieldCheck, Bookmark } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { validatePhoneNumber } from '../shared/validation.js';
import { saveLead } from '../services/leadsStore.js';
import { Button, FormInput, SectionBadge } from './UIPrimitives.jsx';

gsap.registerPlugin(useGSAP);

export const ConsultationModal = ({
  isOpen,
  onClose,
  packageData,
  surveyData,
  domainRecommendation,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Khánh Linh',
    phone: '090 123 4567',
    email: 'linh.mayhandmade@gmail.com',
    agreed: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const overlayRef = useRef(null);
  const modalCardRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: 'Nguyễn Khánh Linh',
        phone: '090 123 4567',
        email: 'linh.mayhandmade@gmail.com',
        agreed: true
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Smooth entrance with GSAP
  useGSAP(() => {
    if (!isOpen || !overlayRef.current || !modalCardRef.current) return;

    gsap.fromTo(
      overlayRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25, ease: 'power2.out' }
    );
    gsap.fromTo(
      modalCardRef.current,
      { autoAlpha: 0, scale: 0.94, y: 16 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.15)' }
    );
  }, { dependencies: [isOpen] });

  // Smooth exit animation
  const handleAnimatedClose = () => {
    if (!overlayRef.current || !modalCardRef.current) {
      onClose?.();
      return;
    }
    gsap.to(modalCardRef.current, {
      autoAlpha: 0,
      scale: 0.96,
      y: 10,
      duration: 0.2,
      ease: 'power2.in'
    });
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        onClose?.();
      }
    });
  };

  // Keyboard handler for Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleAnimatedClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !packageData) return null;

  const { name, priceMonthly, priceYearly, renewalYearly, storage, traffic, websites } = packageData;
  const formattedMonthly = Number(priceMonthly).toLocaleString('vi-VN');
  const domainName = domainRecommendation?.suggestedDomain || 'mayhandmade.vn';
  const domainPrice = domainRecommendation?.priceYearly || 450000;
  const domainRenewal = domainRecommendation?.renewalYearly || 550000;
  const totalFirstYear = priceYearly + domainPrice;
  const totalRenewal = (renewalYearly || (priceYearly * 1.3)) + domainRenewal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Vui lòng nhập họ và tên của bạn';
    }

    const cleanPhone = formData.phone.replace(/\s+/g, '');
    const phoneVal = validatePhoneNumber(cleanPhone);
    if (!phoneVal.isValid) {
      newErrors.phone = phoneVal.error;
    }

    if (!formData.agreed) {
      newErrors.agreed = 'Vui lòng xác nhận đồng ý điều khoản tư vấn';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const savedLead = saveLead({
        fullName: formData.fullName.trim(),
        phone: cleanPhone,
        email: formData.email.trim(),
        packageName: name,
        packagePrice: `${formattedMonthly}đ/tháng`,
        budget: surveyData?.budget || 150000,
        domainIdea: domainName,
        note: `Tư vấn mở website: ${surveyData?.shopName || 'Mây Handmade'}`
      });

      onSuccess?.(savedLead);
      handleAnimatedClose();
    } catch (err) {
      console.error('Error saving lead:', err);
      setErrors({ form: 'Không thể lưu thông tin. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#00203d]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={handleAnimatedClose}
    >
      <div
        ref={modalCardRef}
        className="relative bg-white rounded-3xl shadow-elevated max-w-3xl w-full border border-[#a1c0d1]/60 overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-[#a1c0d1] rounded-full mx-auto mt-3 block sm:hidden"></div>

        {/* Top Close Button */}
        <button
          type="button"
          onClick={handleAnimatedClose}
          aria-label="Đóng cửa sổ"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#f0f4f8] hover:bg-[#a1c0d1]/40 text-[#00203d] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b7a8c]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-5 sm:p-7 pb-3 border-b border-[#a1c0d1]/40">
          <SectionBadge
            tag="03 / ĐĂNG KÝ TƯ VẤN"
            title={`Bắt đầu cùng ${surveyData?.shopName || 'Mây Handmade'}`}
            subtitle="Một bước nhỏ để mở website cho shop. Chúng tôi sẽ hướng dẫn, bạn chưa cần thanh toán."
            className="mb-0 border-b-0 pb-0"
          />
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form: Left on Desktop, Bottom on Mobile */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-3.5 order-2 lg:order-1">
            <FormInput
              id="fullName"
              label="Họ và tên"
              required
              value={formData.fullName}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, fullName: e.target.value }));
                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
              }}
              placeholder="Nguyễn Khánh Linh"
              error={errors.fullName}
            />

            <FormInput
              id="phone"
              type="tel"
              label="Số điện thoại"
              required
              value={formData.phone}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, phone: e.target.value }));
                if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
              }}
              placeholder="090 123 4567"
              error={errors.phone}
            />

            <FormInput
              id="email"
              type="email"
              label="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="linh.mayhandmade@gmail.com"
            />

            {/* Checkbox agreement */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#1f4f5a] select-none">
                <input
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreed: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-[#a1c0d1] text-[#3b7a8c] focus:ring-[#3b7a8c]"
                />
                <span className="leading-relaxed">
                  Tôi đồng ý được liên hệ về gói đã chọn và đã đọc Chính sách quyền riêng tư. Thông tin chỉ dùng để tư vấn đăng ký.
                </span>
              </label>
              {errors.agreed && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.agreed}</p>
              )}
            </div>

            {/* Notice Callout Box */}
            <div className="p-3.5 rounded-xl bg-[#f0f4f8] border border-[#a1c0d1] flex items-start gap-2.5 text-xs text-[#1f4f5a]">
              <Bookmark className="w-4 h-4 text-[#3b7a8c] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#00203d] block font-bold">
                  Trạng thái minh họa · Đã lưu trên thiết bị
                </strong>
                <p className="text-[11px] text-[#6b99ab] mt-0.5 leading-relaxed">
                  &ldquo;Thông tin đã được lưu để bạn quay lại sau.&rdquo; Đây là thông báo mẫu, không xác nhận việc lưu thực tế.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-2">
              <Button
                type="submit"
                variant="navy"
                size="md"
                isLoading={isSubmitting}
                className="w-full group"
              >
                <span>{isSubmitting ? 'Đang gửi thông tin...' : 'Gửi yêu cầu đăng ký'}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#3b7a8c]" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleAnimatedClose}
                className="w-full"
              >
                ← Quay lại so sánh
              </Button>

              <p className="text-center text-[11px] text-[#6b99ab] pt-1">
                Bản minh họa đăng ký · Không phát sinh đơn hàng
              </p>
            </div>
          </form>

          {/* Summary Card: Right on Desktop, Top on Mobile */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-[#a1c0d1]/70 flex flex-col justify-between order-1 lg:order-2 shadow-card">
            <div>
              <div className="mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#00203d] text-white text-[10px] font-black uppercase tracking-wider shadow-subtle">
                  Lựa chọn của shop
                </span>
              </div>

              <h4 className="text-xl font-black text-[#00203d]">
                {name}
              </h4>
              <p className="text-xs text-[#1f4f5a] mt-0.5">
                {storage ? storage.replace(' NVMe', '') : '15 GB'} · {websites} website · 10.000 lượt/tháng
              </p>

              {/* Price Breakdown */}
              <div className="mt-4 pt-3 border-t border-[#a1c0d1]/40 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#1f4f5a]">
                  <span>Hosting / năm đầu</span>
                  <span className="font-bold text-[#00203d]">
                    {Number(priceYearly).toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#1f4f5a]">
                  <span className="truncate pr-2 font-mono text-[#00203d]">{domainName}</span>
                  <span className="font-bold text-[#00203d] shrink-0">
                    {Number(domainPrice).toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="pt-3 border-t border-[#a1c0d1]/40 flex justify-between items-baseline">
                  <span className="font-bold text-[#0f383f] text-xs">Tổng năm đầu</span>
                  <span className="text-2xl font-black text-[#00203d]">
                    {Number(totalFirstYear).toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <p className="text-[11px] text-[#6b99ab] leading-tight">
                  Gia hạn: {Number(totalRenewal).toLocaleString('vi-VN')}đ/năm từ năm thứ hai. Giá ví dụ đã gồm VAT.
                </p>
              </div>

              <p className="text-[11px] text-[#6b99ab] mt-3 leading-relaxed">
                Tên miền có thể đăng ký trong ví dụ. Tình trạng thực tế cần được kiểm tra lại.
              </p>
            </div>

            {/* Reassurance note */}
            <div className="mt-4 pt-3 border-t border-[#a1c0d1]/40">
              <div className="flex items-start gap-2 text-xs text-[#1f4f5a]">
                <ShieldCheck className="w-4 h-4 text-[#3b7a8c] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#1f4f5a] leading-relaxed">
                  Bạn có thể đổi gói trước khi thanh toán. Không yêu cầu thông tin thẻ ngân hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
