import React from 'react';
import { Sparkles, Check, Globe, ArrowRight } from 'lucide-react';
import { Button } from './UIPrimitives.jsx';

/**
 * AI EXPLAINER CARD - Cột trái bên dưới Form khảo sát
 */
export const AIExplainerCard = ({ recommendationData }) => {
  if (!recommendationData) return null;

  const {
    isFallback,
    bestMatch,
    reasons = []
  } = recommendationData;

  return (
    <div className="bg-white border border-[#a1c0d1]/60 rounded-3xl p-5 sm:p-6 shadow-card transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#a1c0d1]/40 mb-3.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#00203d]">
          <Sparkles className="w-4 h-4 text-[#3b7a8c]" />
          <span>AI giải thích</span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#f0f4f8] text-[#0f383f] border border-[#a1c0d1]">
          {isFallback ? 'HostWise Engine' : 'Từ AI'}
        </span>
      </div>

      <h3 className="text-lg sm:text-xl font-black text-[#00203d] tracking-tight leading-snug">
        {bestMatch?.name || 'Đồng hành'} là vừa đủ. Chưa cần gói lớn hơn.
      </h3>

      {/* Bullet points with checkmarks */}
      <ul className="mt-4 space-y-3">
        {reasons && reasons.length > 0 ? (
          reasons.map((reason, idx) => {
            const parts = typeof reason === 'string' ? reason.split(':') : [reason];
            const title = parts.length > 1 ? parts[0] : null;
            const desc = parts.length > 1 ? parts.slice(1).join(':') : reason;

            return (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1f4f5a]">
                <div className="w-4 h-4 rounded-full bg-[#3b7a8c]/15 text-[#3b7a8c] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div className="leading-relaxed">
                  {title && <strong className="text-[#00203d] font-bold">{title}: </strong>}
                  <span>{desc}</span>
                </div>
              </li>
            );
          })
        ) : (
          <>
            <li className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1f4f5a]">
              <div className="w-4 h-4 rounded-full bg-[#3b7a8c]/15 text-[#3b7a8c] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span className="leading-relaxed">
                <strong className="text-[#00203d]">Đủ chỗ cho 80 sản phẩm:</strong> 15 GB dung lượng tha hồ dùng, 1 website đúng với nhu cầu hiện tại.
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1f4f5a]">
              <div className="w-4 h-4 rounded-full bg-[#3b7a8c]/15 text-[#3b7a8c] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span className="leading-relaxed">
                <strong className="text-[#00203d]">Có dự phòng cho khách ghé:</strong> Mức 10.000 lượt/tháng, gấp đôi 5.000 lượt bạn dự kiến.
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1f4f5a]">
              <div className="w-4 h-4 rounded-full bg-[#3b7a8c]/15 text-[#3b7a8c] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span className="leading-relaxed">
                <strong className="text-[#00203d]">Dễ bắt đầu, dễ hỏi khi cần:</strong> Chat 24/7, sao lưu mỗi ngày. 99.000đ/tháng, dưới mức 150.000đ bạn đặt ra.
              </span>
            </li>
          </>
        )}
      </ul>

      <p className="text-[11px] text-[#6b99ab] mt-4 pt-3 border-t border-[#a1c0d1]/40 leading-relaxed">
        Gợi ý minh họa từ nhu cầu đã điền. Lượt khách là ước tính; hiệu năng còn tùy cách làm website.
      </p>
    </div>
  );
};

/**
 * DOMAIN CARD - Cột phải bên dưới Bảng so sánh
 */
export const DomainCard = ({
  domainRecommendation,
  bestMatch,
  costSummary,
  shopName = 'Mây Handmade'
}) => {
  const domain = domainRecommendation?.suggestedDomain || 'mayhandmade.vn';
  const domainPriceYearly = domainRecommendation?.priceYearly || 450000;
  const domainRenewalYearly = domainRecommendation?.renewalYearly || 550000;

  const hostingFirstYear = bestMatch?.priceYearly || 1188000;
  const totalFirstYear = costSummary?.totalFirstYear || (hostingFirstYear + domainPriceYearly);
  const totalRenewal = costSummary?.totalRenewalYear || ((bestMatch?.renewalYearly || 1548000) + domainRenewalYearly);

  return (
    <div className="bg-white border border-[#a1c0d1]/60 rounded-3xl p-5 sm:p-6 shadow-card transition-all">
      <div className="flex items-center gap-2 mb-1">
        <Globe className="w-4 h-4 text-[#3b7a8c]" />
        <h4 className="text-base sm:text-lg font-bold text-[#00203d]">
          Một địa chỉ dễ nhớ cho shop
        </h4>
      </div>
      <p className="text-xs text-[#1f4f5a] mb-4">
        Ngắn gọn, dùng tên {shopName}, dễ đọc cho khách Việt.
      </p>

      {/* Input box displaying suggested domain */}
      <div className="mb-3">
        <label className="block text-[11px] font-bold text-[#6b99ab] uppercase tracking-wider mb-1">
          Tên miền đề xuất
        </label>
        <div className="px-4 py-2.5 rounded-xl border border-[#a1c0d1] bg-[#f0f4f8] text-[#00203d] font-mono text-sm font-semibold flex items-center justify-between">
          <span>{domain}</span>
          <span className="text-[11px] font-sans font-medium text-[#2e5e73]">
            Khuyên dùng
          </span>
        </div>
      </div>

      <div className="text-xs text-[#1f4f5a] mb-4">
        Có thể đăng ký · ví dụ <strong className="text-[#00203d]">{Number(domainPriceYearly).toLocaleString('vi-VN')}đ/năm đầu</strong> · gia hạn {Number(domainRenewalYearly).toLocaleString('vi-VN')}đ/năm
      </div>

      {/* Calculation Box */}
      <div className="p-4 rounded-2xl bg-[#f0f4f8] border border-[#a1c0d1] space-y-1.5">
        <div className="text-xs text-[#1f4f5a]">
          Tổng năm + {domain}
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-[#0f383f]">Tổng năm đầu</span>
          <span className="text-xl sm:text-2xl font-black text-[#00203d]">
            {Number(totalFirstYear).toLocaleString('vi-VN')}đ
          </span>
        </div>
        <p className="text-[11px] text-[#6b99ab] leading-relaxed pt-1 border-t border-[#a1c0d1]/40">
          ({Number(hostingFirstYear).toLocaleString('vi-VN')}đ hosting + {Number(domainPriceYearly).toLocaleString('vi-VN')}đ tên miền. Từ năm thứ hai: {Number(totalRenewal).toLocaleString('vi-VN')}đ/năm, đã gồm VAT.)
        </p>
      </div>

      <p className="text-[11px] text-[#6b99ab] mt-3 leading-relaxed">
        Tình trạng tên miền chỉ để minh họa. Cần kiểm tra lại tại thời điểm đăng ký.
      </p>
    </div>
  );
};

/**
 * CALLOUT BANNER - Banner Section 03 / Bắt đầu thật nhẹ nhàng
 */
export const CalloutBanner = ({ bestMatch, onSelectPackage }) => {
  const packageName = bestMatch?.name || 'Đồng hành';
  const packagePrice = bestMatch ? `${Number(bestMatch.priceMonthly).toLocaleString('vi-VN')}đ/tháng` : '99.000đ/tháng';

  return (
    <div className="bg-[#00203d] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#0f383f]">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1c0d1] block">
          03 / BẮT ĐẦU THẬT NHẸ NHÀNG
        </span>
        <h4 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white">
          Shop đã có lựa chọn. Bước tiếp theo thật đơn giản.
        </h4>
        <p className="text-xs sm:text-sm text-[#a1c0d1]/90 mt-1 max-w-xl leading-relaxed">
          Để lại thông tin để được hướng dẫn. Chưa cần thanh toán hay cam kết mua.
        </p>
      </div>

      <div className="shrink-0 flex flex-col items-start sm:items-end">
        <Button
          variant="white"
          size="lg"
          onClick={() => onSelectPackage?.(bestMatch)}
          className="group"
        >
          <span>Đăng ký gói {packageName}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#3b7a8c]" />
        </Button>
        <span className="text-[11px] text-[#a1c0d1]/80 mt-1.5 font-medium">
          {packagePrice} · thanh toán theo năm
        </span>
      </div>
    </div>
  );
};

export const RecommendationResult = ({
  recommendationData,
  onSelectPackage
}) => {
  if (!recommendationData) return null;

  return (
    <div className="space-y-6">
      <AIExplainerCard recommendationData={recommendationData} />
      <DomainCard
        domainRecommendation={recommendationData?.domainRecommendation}
        bestMatch={recommendationData?.bestMatch}
        costSummary={recommendationData?.costSummary}
      />
      <CalloutBanner
        bestMatch={recommendationData?.bestMatch}
        onSelectPackage={onSelectPackage}
      />
    </div>
  );
};

export default RecommendationResult;
