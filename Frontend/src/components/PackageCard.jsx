import React from 'react';
import { Check, ArrowRight, Sparkles, HardDrive, Users, Globe, Shield, Clock } from 'lucide-react';

export const PackageCard = ({
  packageData,
  isBestMatch = false,
  onSelect
}) => {
  if (!packageData) return null;

  const {
    name,
    tagline,
    priceMonthly,
    priceYearly,
    storage,
    traffic,
    websites,
    ssl,
    backup,
    support,
    suitableFor,
    features = []
  } = packageData;

  const formattedMonthly = Number(priceMonthly).toLocaleString('vi-VN');
  const formattedYearly = Number(priceYearly).toLocaleString('vi-VN');

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl bg-white p-6 md:p-7 transition-all duration-300 ${
        isBestMatch
          ? 'border-2 border-[#111827] shadow-xl md:-translate-y-2 ring-1 ring-[#111827]/10'
          : 'border border-[#E5E7EB] shadow-sm hover:border-gray-400 hover:shadow-md'
      }`}
    >
      {/* Top Best Match Badge */}
      {isBestMatch && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#111827] text-white text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Khuyên Dùng Tốt Nhất
          </span>
        </div>
      )}

      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Gói Hosting
          </span>
          {isBestMatch && (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Tiết kiệm tối ưu
            </span>
          )}
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight">
          {name}
        </h3>
        
        <p className="text-xs text-gray-600 mt-1 min-h-[32px]">
          {tagline}
        </p>

        {/* Pricing */}
        <div className="mt-4 pt-4 border-t border-gray-100 pb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
              {formattedMonthly}đ
            </span>
            <span className="text-xs font-medium text-gray-500">/tháng</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formattedYearly}đ thanh toán cho năm đầu
          </p>
        </div>

        {/* Key Specification Highlights */}
        <div className="space-y-2.5 py-4 border-t border-b border-gray-100 text-xs text-gray-700">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-500">
              <HardDrive className="w-3.5 h-3.5 text-gray-400" />
              Dung lượng
            </span>
            <span className="font-semibold text-[#111827]">{storage}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              Lượng khách
            </span>
            <span className="font-semibold text-[#111827]">{traffic}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              Số website
            </span>
            <span className="font-semibold text-[#111827]">{websites} website</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              Sao lưu
            </span>
            <span className="font-medium text-gray-800">{backup}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Hỗ trợ
            </span>
            <span className="font-medium text-gray-800">{support}</span>
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-4 mb-6">
          <p className="text-[11px] font-semibold uppercase text-gray-400 tracking-wider mb-2.5">
            Điểm nổi bật
          </p>
          <ul className="space-y-2">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 leading-tight">
                <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isBestMatch ? 'text-[#111827]' : 'text-gray-500'}`} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="pt-2">
        {isBestMatch ? (
          <button
            type="button"
            onClick={() => onSelect?.(packageData)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#111827] text-white font-medium text-sm hover:bg-[#1F2937] active:scale-[0.99] transition-all shadow-md group"
          >
            <span>Đăng ký tư vấn gói này</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelect?.(packageData)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 text-gray-800 font-medium text-sm hover:bg-gray-100 hover:border-gray-400 active:scale-[0.99] transition-all"
          >
            <span>Đăng ký tư vấn gói này</span>
          </button>
        )}

        <p className="text-center text-[11px] text-gray-500 mt-2">
          {suitableFor}
        </p>
      </div>
    </div>
  );
};

export default PackageCard;
