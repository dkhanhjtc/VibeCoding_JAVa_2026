import React, { useState } from 'react';
import { ShoppingBag, Building2, BookOpen, Globe, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateNeedsForm } from '../shared/validation.js';

const WEBSITE_TYPES = [
  {
    id: 'ecommerce',
    title: 'Shop bán hàng',
    desc: 'WooCommerce, giỏ hàng, đặt hàng',
    icon: ShoppingBag,
    badge: 'Phổ biến nhất'
  },
  {
    id: 'company',
    title: 'Doanh nghiệp',
    desc: 'Giới thiệu công ty, hồ sơ năng lực',
    icon: Building2,
    badge: 'Chuyên nghiệp'
  },
  {
    id: 'blog',
    title: 'Blog / Tin tức',
    desc: 'Cá nhân, viết bài, ít hình sản phẩm',
    icon: BookOpen,
    badge: 'Tiết kiệm'
  }
];

const TRAFFIC_OPTIONS = [
  { id: '<5k', label: '< 5.000', sub: 'Mới mở shop' },
  { id: '5k-20k', label: '5k - 20k', sub: 'Bán đều đặn' },
  { id: '20k-100k', label: '20k - 100k', sub: 'Quy mô vừa' },
  { id: '>100k', label: '> 100k', sub: 'Lưu lượng lớn' }
];

const QUICK_BUDGETS = [
  { value: 100000, label: '100k' },
  { value: 250000, label: '250k' },
  { value: 500000, label: '500k' },
  { value: 1000000, label: '> 1 triệu' }
];

export const NeedsSurveyForm = ({
  initialValues,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    shopName: initialValues?.shopName || 'Mây Handmade',
    websiteType: initialValues?.websiteType || 'ecommerce',
    traffic: initialValues?.traffic || '5k-20k',
    budget: initialValues?.budget || 150000,
    needsDomain: initialValues?.needsDomain ?? true,
    domainIdea: initialValues?.domainIdea || 'mayhandmade.vn'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFillExample = () => {
    setFormData({
      shopName: 'Mây Handmade',
      websiteType: 'ecommerce',
      traffic: '5k-20k',
      budget: 150000,
      needsDomain: true,
      domainIdea: 'mayhandmade.vn'
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateNeedsForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({
        websiteType: true,
        traffic: true,
        budget: true,
        domainIdea: true
      });
      return;
    }

    setErrors({});
    onSubmit?.(formData);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            01 / HIỂU SHOP CỦA BẠN
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mt-1">
            Shop bạn đang cần gì?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Chỉ mất 30 giây để AI tính toán cấu hình hosting tối ưu và tiết kiệm nhất.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillExample}
          className="self-start sm:self-auto text-xs font-medium text-gray-600 hover:text-[#111827] bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors inline-flex items-center gap-1.5 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Điền ví dụ mẫu</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Tên shop / Thương hiệu */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider">
              1. Tên shop / Thương hiệu của bạn
            </label>
            <span className="text-[11px] text-gray-400">Tùy chọn</span>
          </div>
          <input
            type="text"
            value={formData.shopName}
            onChange={(e) => handleFieldChange('shopName', e.target.value)}
            placeholder="Ví dụ: Mây Handmade, Gốm Xinh..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all"
          />
        </div>

        {/* Tiêu chí 1: Loại Website */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider">
              2. Mô hình website dự kiến <span className="text-red-500">*</span>
            </label>
            {errors.websiteType && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.websiteType}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {WEBSITE_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.websiteType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleFieldChange('websiteType', type.id)}
                  className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#111827] bg-gray-50/90 ring-1 ring-[#111827]'
                      : errors.websiteType
                      ? 'border-red-300 bg-red-50/10 hover:border-red-400'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#111827]" />
                      )}
                    </div>
                    <div className="font-bold text-sm text-[#111827]">{type.title}</div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{type.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tiêu chí 2: Lượng truy cập / tháng */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider">
              3. Lượng khách dự kiến ghé thăm / tháng <span className="text-red-500">*</span>
            </label>
            {errors.traffic && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.traffic}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TRAFFIC_OPTIONS.map((opt) => {
              const isSelected = formData.traffic === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleFieldChange('traffic', opt.id)}
                  className={`py-3 px-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#111827] bg-[#111827] text-white shadow-sm'
                      : errors.traffic
                      ? 'border-red-300 bg-red-50/10 text-gray-800 hover:border-red-400'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-sm tracking-tight">{opt.label}</div>
                  <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {opt.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tiêu chí 3: Ngân sách tháng */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider">
              4. Ngân sách hosting dự trù mỗi tháng (VNĐ) <span className="text-red-500">*</span>
            </label>
            {errors.budget && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.budget}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <input
                type="number"
                step="10000"
                min="30000"
                value={formData.budget}
                onChange={(e) => handleFieldChange('budget', e.target.value)}
                placeholder="VD: 150000"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all ${
                  errors.budget ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
                }`}
              />
              <span className="absolute right-4 top-2.5 text-xs font-medium text-gray-400 pointer-events-none">
                đ / tháng
              </span>
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {QUICK_BUDGETS.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => handleFieldChange('budget', chip.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    Number(formData.budget) === chip.value
                      ? 'bg-[#111827] text-white border-[#111827]'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tiêu chí 4: Nhu cầu tên miền */}
        <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.needsDomain}
              onChange={(e) => handleFieldChange('needsDomain', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#111827] focus:ring-[#111827]"
            />
            <span className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-gray-500" />
              Mua kèm tên miền
            </span>
          </label>

          {formData.needsDomain && (
            <div className="pt-2 animate-fade-in pl-7 space-y-1.5 transition-all">
              <label className="block text-xs text-gray-600 font-medium">
                Ý tưởng tên miền mong muốn (không dấu, viết liền):
              </label>
              <div className="flex items-center max-w-md">
                <input
                  type="text"
                  value={formData.domainIdea}
                  onChange={(e) => handleFieldChange('domainIdea', e.target.value)}
                  placeholder="mayhandmade.vn hoặc gomxinh"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#111827] ${
                    errors.domainIdea ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
                  }`}
                />
              </div>
              {errors.domainIdea && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.domainIdea}
                </p>
              )}
              <p className="text-[11px] text-gray-500">
                AI sẽ gợi ý nên chọn đuôi <strong>.vn</strong> hay <strong>.com</strong> để tối ưu nhận diện và ngân sách.
              </p>
            </div>
          )}
        </div>

        {/* Submit CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#111827] text-white font-semibold text-base hover:bg-[#1F2937] active:scale-[0.99] transition-all shadow-lg hover:shadow-xl disabled:opacity-75 disabled:pointer-events-none group"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>{isLoading ? 'Đang phân tích cấu hình...' : 'AI Phân Tích & Gợi Ý Gói'}</span>
          </button>
          <p className="text-center text-xs text-gray-500 mt-2.5">
            Dựa trên mô hình ngôn ngữ và quy tắc tối ưu băng thông cho e-commerce Việt Nam
          </p>
        </div>
      </form>
    </div>
  );
};

export default NeedsSurveyForm;
