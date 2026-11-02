import React from 'react';
import { Sparkles, Check, Globe, ArrowRight, Cpu, AlertTriangle } from 'lucide-react';
import PackageCard from './PackageCard.jsx';
import ComparisonTable from './ComparisonTable.jsx';

export const RecommendationResult = ({
  recommendationData,
  onSelectPackage
}) => {
  if (!recommendationData) return null;

  const {
    isFallback,
    provider,
    bestMatch,
    alternatives = [],
    headline,
    reasons = [],
    budgetNote,
    domainRecommendation,
    costSummary
  } = recommendationData;

  // Xếp 3 gói: Nếu có 2 alternatives, đặt gói bestMatch ở giữa để tạo điểm nhấn
  const displayPackages = [];
  if (alternatives.length >= 2) {
    displayPackages.push(alternatives[0]);
    displayPackages.push(bestMatch);
    displayPackages.push(alternatives[1]);
  } else {
    displayPackages.push(bestMatch, ...alternatives);
  }

  return (
    <section aria-label="Kết quả đề xuất gói" className="w-full space-y-10 animate-fade-in">
      {/* ----------------- PHẦN TRÊN: AI EXPLAINER BOX ----------------- */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gray-100 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                02 / CHỌN GÓI VỪA VẶN
              </span>

              {isFallback ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                  <Cpu className="w-3 h-3 text-gray-600" />
                  Đề Xuất Dự Phòng (Fallback)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  AI Gemini Phân Tích
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              {headline || `${bestMatch?.name} là vừa đủ. Chưa cần gói lớn hơn.`}
            </h3>
            
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Phân tích tự động dựa trên quy mô và dự toán chi phí shop của bạn
            </p>
          </div>

          <div className="self-start px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 font-medium shrink-0">
            Engine: {provider || 'HostWise AI Engine'}
          </div>
        </div>

        {/* Cảnh báo khi gói tối ưu vượt ngân sách */}
        {budgetNote && (
          <div role="alert" className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs sm:text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">{budgetNote.message}</p>
          </div>
        )}

        {/* Lý do AI khuyên dùng */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Tại sao gói {bestMatch?.name} phù hợp nhất?
            </h4>
            <ul className="space-y-2.5">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="leading-snug">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lời khuyên tên miền đi kèm (.vn hay .com) và tổng chi phí */}
          <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 flex flex-col justify-between">
            {domainRecommendation && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-[#111827]" />
                  <span className="text-xs font-bold uppercase text-[#111827] tracking-wider">
                    Lời khuyên tên miền thương hiệu
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-[#111827] bg-white px-2.5 py-1 rounded-lg border border-gray-200 inline-block font-mono">
                    {domainRecommendation.suggestedDomain}
                  </span>
                  <span className="text-xs text-gray-500">
                    +{Number(domainRecommendation.priceYearly).toLocaleString('vi-VN')}đ/năm đầu
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {domainRecommendation.advice}
                </p>
              </div>
            )}

            {costSummary && (
              <div className={`flex items-center justify-between text-xs ${domainRecommendation ? 'mt-4 pt-3 border-t border-gray-200/80' : ''}`}>
                <span className="text-gray-500">
                  {domainRecommendation ? 'Ước tính tổng năm đầu (Hosting + Tên miền):' : 'Ước tính tổng năm đầu (Hosting):'}
                </span>
                <span className="font-extrabold text-[#111827] text-sm">
                  {Number(costSummary.totalFirstYear).toLocaleString('vi-VN')}đ
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------- PHẦN GIỮA: GRID 3 THẺ PACKAGE CARD ----------------- */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            BA GÓI · MỘT LỰA CHỌN PHÙ HỢP
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] mt-1">
            Chọn gói hosting vừa vặn cho shop
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Không cần trả tiền cho cấu hình dư thừa. Nâng cấp linh hoạt khi shop mở rộng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {displayPackages.map((pkg) => {
            const isBest = pkg.id === bestMatch?.id;
            return (
              <PackageCard
                key={pkg.id}
                packageData={pkg}
                isBestMatch={isBest}
                onSelect={onSelectPackage}
              />
            );
          })}
        </div>
      </div>

      {/* ----------------- PHẦN DƯỚI: COMPARISON TABLE ----------------- */}
      <ComparisonTable
        packages={displayPackages}
        bestMatchId={bestMatch?.id}
        domainRecommendation={domainRecommendation}
        onSelect={onSelectPackage}
      />

      {/* ----------------- CTA CALLOUT BANNER ----------------- */}
      <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            03 / BẮT ĐẦU THẬT NHẸ NHÀNG
          </span>
          <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-white">
            Shop đã có lựa chọn. Bước tiếp theo thật đơn giản.
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
            Để lại thông tin để được đội ngũ kỹ thuật viên tư vấn và cấu hình mẫu. Chưa cần thanh toán hay cam kết mua.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectPackage?.(bestMatch)}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#111827] font-bold text-sm hover:bg-gray-100 active:scale-[0.99] transition-all shadow-md group"
        >
          <span>Đăng ký gói {bestMatch?.name}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
};

export default RecommendationResult;
