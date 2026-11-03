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
          ? 'border-2 border-[#3b7a8c] shadow-elevated md:-translate-y-2 ring-2 ring-[#3b7a8c]/20'
          : 'border border-[#a1c0d1]/60 shadow-card hover:border-[#6b99ab] hover:shadow-elevated'
      }`}
    >
      {/* Top Best Match Badge */}
      {isBestMatch && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#00203d] text-white text-xs font-semibold tracking-wide uppercase shadow-sm border border-[#0f383f]">
            <Sparkles className="w-3.5 h-3.5 text-[#3b7a8c]" />
            Khuyên Dùng Tốt Nhất
          </span>
        </div>
      )}

      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6b99ab]">
            Gói Hosting
          </span>
          {isBestMatch && (
            <span className="text-[11px] font-semibold text-[#0f383f] bg-[#f0f4f8] px-2 py-0.5 rounded-md border border-[#a1c0d1]">
              Tiết kiệm tối ưu
            </span>
          )}
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-[#00203d] tracking-tight">
          {name}
        </h3>
        
        <p className="text-xs text-[#1f4f5a] mt-1 min-h-[32px]">
          {tagline}
        </p>

        {/* Pricing */}
        <div className="mt-4 pt-4 border-t border-[#f0f4f8] pb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-extrabold text-[#00203d] tracking-tight">
              {formattedMonthly}đ
            </span>
            <span className="text-xs font-medium text-[#6b99ab]">/tháng</span>
          </div>
          <p className="text-xs text-[#1f4f5a] mt-1">
            {formattedYearly}đ thanh toán cho năm đầu
          </p>
        </div>

        {/* Key Specification Highlights */}
        <div className="space-y-2.5 py-4 border-t border-b border-[#f0f4f8] text-xs text-[#1f4f5a]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#6b99ab]">
              <HardDrive className="w-3.5 h-3.5 text-[#3b7a8c]" />
              Dung lượng
            </span>
            <span className="font-semibold text-[#00203d]">{storage}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#6b99ab]">
              <Users className="w-3.5 h-3.5 text-[#3b7a8c]" />
              Lượng khách
            </span>
            <span className="font-semibold text-[#00203d]">{traffic}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#6b99ab]">
              <Globe className="w-3.5 h-3.5 text-[#3b7a8c]" />
              Số website
            </span>
            <span className="font-semibold text-[#00203d]">{websites} website</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#6b99ab]">
              <Shield className="w-3.5 h-3.5 text-[#3b7a8c]" />
              Sao lưu
            </span>
            <span className="font-medium text-[#0f383f]">{backup}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#6b99ab]">
              <Clock className="w-3.5 h-3.5 text-[#3b7a8c]" />
              Hỗ trợ
            </span>
            <span className="font-medium text-[#0f383f]">{support}</span>
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-4 mb-6">
          <p className="text-[11px] font-semibold uppercase text-[#6b99ab] tracking-wider mb-2.5">
            Điểm nổi bật
          </p>
          <ul className="space-y-2">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#1f4f5a] leading-tight">
                <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isBestMatch ? 'text-[#3b7a8c]' : 'text-[#6b99ab]'}`} />
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
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#3b7a8c] hover:bg-[#2e5e73] text-white font-medium text-sm active:scale-[0.99] transition-all shadow-md group"
          >
            <span>Đăng ký tư vấn gói này</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#f0f4f8]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelect?.(packageData)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#2e5e73] text-[#2e5e73] font-medium text-sm hover:bg-[#2e5e73] hover:text-white active:scale-[0.99] transition-all"
          >
            <span>Đăng ký tư vấn gói này</span>
          </button>
        )}

        <p className="text-center text-[11px] text-[#6b99ab] mt-2">
          {suitableFor}
        </p>
      </div>
    </div>
  );
};

export default PackageCard;
