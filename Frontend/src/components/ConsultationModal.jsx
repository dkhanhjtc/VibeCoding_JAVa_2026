import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validatePhoneNumber } from '../shared/validation.js';
import { saveLead } from '../services/leadsStore.js';

export const ConsultationModal = ({
  isOpen,
  onClose,
  packageData,
  surveyData,
  domainRecommendation,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    note: '',
    agreed: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: 'Nguyễn Khánh Linh',
        phone: '0901234567',
        email: 'linh.mayhandmade@gmail.com',
        note: surveyData?.shopName ? `Tư vấn mở shop: ${surveyData.shopName}` : '',
        agreed: true
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, surveyData]);

  if (!isOpen || !packageData) return null;

  const { name, priceMonthly, priceYearly, renewalYearly, storage, traffic, websites } = packageData;
  const formattedMonthly = Number(priceMonthly).toLocaleString('vi-VN');
  const hasDomain = surveyData?.needsDomain;
  const domainName = domainRecommendation?.suggestedDomain || (surveyData?.domainIdea ? `${surveyData.domainIdea}.vn` : 'mayhandmade.vn');
  const domainPrice = hasDomain ? (domainRecommendation?.priceYearly || 450000) : 0;
  const totalFirstYear = priceYearly + domainPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Vui lòng nhập họ và tên của bạn';
    }

    const phoneVal = validatePhoneNumber(formData.phone);
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
      // Lưu lead vào localStorage thông qua leadsStore.js
      const savedLead = saveLead({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        packageName: name,
        packagePrice: `${formattedMonthly}đ/tháng`,
        budget: surveyData?.budget || 150000,
        domainIdea: hasDomain ? domainName : 'Không mua kèm tên miền',
        note: formData.note.trim()
      });

      // Báo thành công ra ngoài để trigger Toast
      onSuccess?.(savedLead);
      onClose();
    } catch (err) {
      console.error('Error saving lead:', err);
      setErrors({ form: 'Không thể lưu thông tin. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#111827]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-gray-200 overflow-hidden flex flex-col my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-gray-100">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            03 / ĐĂNG KÝ TƯ VẤN
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mt-1">
            Bắt đầu cùng {surveyData?.shopName || 'Mây Handmade'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Một bước nhỏ để mở website cho shop. Kỹ thuật viên sẽ hướng dẫn chi tiết, bạn chưa cần thanh toán ngay.
          </p>

          {/* Dòng hiển thị rõ gói đã chọn theo đúng yêu cầu */}
          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-gray-700">
              Bạn đang chọn: <strong className="text-[#111827] font-bold">Gói {name}</strong> - <strong className="text-[#111827] font-bold">{formattedMonthly}đ/tháng</strong>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Lựa chọn phù hợp
            </span>
          </div>
        </div>

        {/* Modal Body - 2 Columns on Desktop */}
        <div className="p-6 sm:p-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: 7 cols */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider mb-1.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, fullName: e.target.value }));
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
                }}
                placeholder="Ví dụ: Nguyễn Khánh Linh"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#111827] ${
                  errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider mb-1.5">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                }}
                placeholder="VD: 0901234567 (10 số di động VN)"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#111827] ${
                  errors.phone ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider mb-1.5">
                Email nhận tài liệu hướng dẫn
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="VD: linh.mayhandmade@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider mb-1.5">
                Ghi chú thêm cho chuyên viên
              </label>
              <textarea
                rows="2"
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                placeholder="VD: Hướng dẫn tích hợp cổng thanh toán và cấu hình giỏ hàng..."
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#111827] resize-none"
              ></textarea>
            </div>

            {/* Checkbox agreement */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 select-none">
                <input
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreed: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#111827] focus:ring-[#111827]"
                />
                <span>
                  Tôi đồng ý được liên hệ về gói đã chọn và đã đọc Chính sách quyền riêng tư. Thông tin chỉ dùng để tư vấn đăng ký.
                </span>
              </label>
              {errors.agreed && (
                <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>
              )}
            </div>

            {/* Submit & Back buttons */}
            <div className="pt-3 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#111827] text-white font-semibold text-sm hover:bg-[#1F2937] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-75"
              >
                <span>{isSubmitting ? 'Đang gửi thông tin...' : 'Xác Nhận Đăng Ký Tư Vấn'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border border-transparent text-gray-600 font-medium text-xs hover:text-[#111827] hover:bg-gray-100 transition-colors"
              >
                ← Quay lại so sánh
              </button>

              <p className="text-center text-[11px] text-gray-400">
                Bản minh họa đăng ký · Không phát sinh đơn hàng
              </p>
            </div>
          </form>

          {/* Right Summary Card: 5 cols */}
          <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#111827] text-white text-[10px] font-bold uppercase tracking-wider">
                  Lựa chọn của shop
                </span>
              </div>

              <h4 className="text-xl font-extrabold text-[#111827]">
                {name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {storage} · {websites} website · {traffic}
              </p>

              {/* Price Breakdown */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Hosting / năm đầu</span>
                  <span className="font-semibold text-gray-800">
                    {Number(priceYearly).toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {hasDomain && (
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="truncate pr-2 font-mono text-gray-800">{domainName}</span>
                    <span className="font-semibold text-gray-800 shrink-0">
                      {Number(domainPrice).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="font-bold text-gray-800 text-sm">Tổng năm đầu:</span>
                  <span className="text-xl font-extrabold text-[#111827]">
                    {Number(totalFirstYear).toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 leading-tight">
                  Gia hạn: {(renewalYearly || priceYearly * 1.3).toLocaleString('vi-VN')}đ/năm từ năm thứ hai. Giá ví dụ đã gồm VAT.
                </p>
              </div>
            </div>

            {/* Reassurance note */}
            <div className="mt-6 pt-4 border-t border-gray-200/80">
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Bạn có thể đổi gói trước khi kích hoạt. Không yêu cầu thông tin thẻ ngân hàng.
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
