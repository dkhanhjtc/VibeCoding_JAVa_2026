import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button, SectionBadge } from './UIPrimitives.jsx';

export const ComparisonTable = ({
  packages = [],
  bestMatchId = 'standard',
  domainRecommendation,
  onSelect
}) => {
  if (!packages || packages.length === 0) return null;

  // Sắp xếp thứ tự gói chuẩn: Khởi đầu, Đồng hành, Phát triển
  const packageOrder = ['entry', 'standard', 'pro'];
  const displayPackages = [...packages].sort((a, b) => {
    const idxA = packageOrder.indexOf(a.id);
    const idxB = packageOrder.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    return (a.priceMonthly || 0) - (b.priceMonthly || 0);
  });

  const domainName = domainRecommendation?.suggestedDomain || 'mayhandmade.vn';
  const domainPrice = domainRecommendation?.priceYearly
    ? `${Number(domainRecommendation.priceYearly).toLocaleString('vi-VN')}đ/năm đầu`
    : '450.000đ/năm đầu';

  const rows = [
    {
      key: 'renewal',
      label: 'Gia hạn hosting',
      getValue: (pkg) => `${Number(pkg.renewalMonthly || (pkg.priceMonthly * 1.3)).toLocaleString('vi-VN')}đ/tháng`
    },
    {
      key: 'storage',
      label: 'Dung lượng lưu trữ',
      getValue: (pkg) => (pkg.storage ? pkg.storage.replace(' NVMe', '') : '15 GB')
    },
    {
      key: 'traffic',
      label: 'Lượt khách thích hợp',
      getValue: (pkg) => {
        if (pkg.id === 'entry') return '3.000 lượt/tháng';
        if (pkg.id === 'standard') return '10.000 lượt/tháng';
        if (pkg.id === 'pro') return '30.000 lượt/tháng';
        return pkg.traffic || '10.000 lượt/tháng';
      }
    },
    {
      key: 'websites',
      label: 'Số website',
      getValue: (pkg) => `${pkg.websites || 1} website`
    },
    {
      key: 'ssl',
      label: 'Bảo mật SSL',
      getValue: () => 'Miễn phí · tự gia hạn'
    },
    {
      key: 'backup',
      label: 'Sao lưu dữ liệu',
      getValue: (pkg) => pkg.backup || 'Mỗi ngày · giữ 14 ngày'
    },
    {
      key: 'support',
      label: 'Khi cần hỗ trợ',
      getValue: (pkg) => pkg.support || 'Chat 24/7'
    },
    {
      key: 'suitable',
      label: 'Phù hợp với',
      getValue: (pkg) => {
        if (pkg.id === 'entry') return 'Shop mới thử bán';
        if (pkg.id === 'standard') return 'Shop nhỏ bán ổn định';
        if (pkg.id === 'pro') return 'Shop mở rộng nhiều kênh';
        return pkg.suitableFor || 'Shop kinh doanh';
      }
    },
    {
      key: 'domain',
      label: 'Tên miền đi kèm',
      getValue: () => `${domainName} +${domainPrice}`
    }
  ].filter((row) => row.key !== 'domain' || domainRecommendation);

  return (
    <div className="w-full">
      {/* ----------------- DESKTOP VIEW (>= 1024px / lg) ----------------- */}
      <div className="hidden lg:block bg-white border border-[#a1c0d1]/60 rounded-3xl overflow-hidden shadow-card">
        <div className="p-6 pb-4 border-b border-[#a1c0d1]/40">
          <SectionBadge
            tag="02 / CHỌN GÓI VỪA VẶN"
            title="Ba gói. Một lựa chọn phù hợp."
            subtitle="Đọc theo từng hàng để thấy điều gì thực sự khác biệt."
            className="mb-0 border-b-0 pb-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#a1c0d1]/40">
                <th className="py-4 px-4 text-xs font-semibold text-[#6b99ab] w-[24%] align-top bg-[#f0f4f8]/40">
                  <div className="flex items-center gap-1.5 text-[#00203d] font-bold mb-1">
                    <span className="w-3.5 h-3.5 border border-[#3b7a8c] rounded grid grid-cols-2 gap-0.5 p-0.5">
                      <span className="bg-[#3b7a8c] rounded-xs"></span>
                      <span className="bg-[#3b7a8c] rounded-xs"></span>
                      <span className="bg-[#3b7a8c] rounded-xs"></span>
                      <span className="bg-[#3b7a8c] rounded-xs"></span>
                    </span>
                    <span>Một góc nhìn rõ ràng</span>
                  </div>
                  <p className="text-[11px] text-[#1f4f5a] font-normal leading-tight">
                    Không cần đọc thông số khó hiểu.
                  </p>
                </th>

                {displayPackages.map((pkg) => {
                  const isBest = pkg.id === bestMatchId;
                  return (
                    <th
                      key={pkg.id}
                      className={`py-4 px-4 align-top transition-colors w-[25.3%] ${
                        isBest
                          ? 'bg-[#f0f4f8]/70 border-x border-[#3b7a8c]/40 relative'
                          : 'bg-white'
                      }`}
                    >
                      {isBest ? (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00203d] text-white text-[10px] font-black uppercase tracking-wider shadow-subtle">
                            <Sparkles className="w-2.5 h-2.5 text-[#3b7a8c]" />
                            Đề xuất cho bạn
                          </span>
                        </div>
                      ) : (
                        <div className="h-6 mb-2" />
                      )}
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b99ab]">
                        Gói Hosting
                      </div>
                      <div className="text-lg font-black text-[#00203d] mt-0.5">
                        {pkg.name}
                      </div>
                      <div className="text-[11px] text-[#1f4f5a] font-normal">
                        {pkg.tagline}
                      </div>
                      <div className="mt-2.5">
                        <span className="text-xl font-black text-[#00203d]">
                          {Number(pkg.priceMonthly).toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-xs text-[#1f4f5a]">/tháng</span>
                        <div className="text-[11px] text-[#6b99ab] mt-0.5">
                          {Number(pkg.priceYearly).toLocaleString('vi-VN')}đ cho năm đầu
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#a1c0d1]/30 text-xs">
              {rows.map((row) => (
                <tr key={row.key} className="hover:bg-[#f0f4f8]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#00203d] bg-[#f0f4f8]/30">
                    {row.label}
                  </td>
                  {displayPackages.map((pkg) => {
                    const isBest = pkg.id === bestMatchId;
                    return (
                      <td
                        key={pkg.id}
                        className={`py-3 px-4 text-[#1f4f5a] ${
                          isBest ? 'border-x border-[#3b7a8c]/40 bg-[#f0f4f8]/50 font-medium text-[#00203d]' : ''
                        }`}
                      >
                        {row.getValue(pkg)}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Action Buttons Row */}
              <tr className="border-t border-[#a1c0d1]/50">
                <td className="py-4 px-4 bg-[#f0f4f8]/30"></td>
                {displayPackages.map((pkg) => {
                  const isBest = pkg.id === bestMatchId;
                  return (
                    <td
                      key={pkg.id}
                      className={`py-4 px-4 align-middle ${
                        isBest ? 'border-x border-b border-[#3b7a8c]/40 bg-[#f0f4f8]/50' : ''
                      }`}
                    >
                      {isBest ? (
                        <Button
                          variant="navy"
                          size="md"
                          onClick={() => onSelect?.(pkg)}
                          className="w-full group"
                        >
                          <span>Đăng ký {pkg.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-[#3b7a8c]" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => onSelect?.(pkg)}
                          className="w-full"
                        >
                          Chọn gói này
                        </Button>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#f0f4f8]/40 border-t border-[#a1c0d1]/40 text-[11px] text-[#6b99ab] leading-relaxed">
          Giá ví dụ đã gồm VAT. Giá theo tháng được quy đổi khi trả trước 12 tháng; mức gia hạn áp dụng từ năm thứ hai. Không phải báo giá của nhà cung cấp.
        </div>
      </div>

      {/* ----------------- MOBILE VIEW (< 1024px): 3 STACKED CARDS MATCHING MOCKUP ----------------- */}
      <div className="block lg:hidden space-y-4">
        <div className="bg-white border border-[#a1c0d1]/60 rounded-3xl p-5 shadow-card">
          <SectionBadge
            tag="02 / CHỌN GÓI VỪA VẶN"
            title="Ba gói. Một lựa chọn phù hợp."
            subtitle="Đọc theo từng hàng để thấy điều gì thực sự khác biệt."
            className="mb-0 border-b-0 pb-0"
          />
        </div>

        {displayPackages.map((pkg) => {
          const isBest = pkg.id === bestMatchId;
          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-5 transition-all duration-200 shadow-card bg-white ${
                isBest
                  ? 'border-2 border-[#00203d] ring-1 ring-[#00203d]/10'
                  : 'border border-[#a1c0d1]/70'
              }`}
            >
              {isBest && (
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00203d] text-white text-[10px] font-black uppercase tracking-wider shadow-subtle">
                    <Sparkles className="w-2.5 h-2.5 text-[#3b7a8c]" />
                    Đề xuất cho bạn
                  </span>
                </div>
              )}

              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b99ab]">
                Gói Hosting
              </div>
              <h4 className="text-xl font-black text-[#00203d] mt-0.5">
                {pkg.name}
              </h4>
              <p className="text-xs text-[#1f4f5a] mt-0.5">
                {pkg.tagline}
              </p>

              <div className="my-3 py-2.5 px-3 rounded-xl bg-[#f0f4f8] border border-[#a1c0d1]/50 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-[#00203d]">
                    {Number(pkg.priceMonthly).toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-xs text-[#1f4f5a]">/tháng</span>
                </div>
                <span className="text-[11px] text-[#6b99ab]">
                  {Number(pkg.priceYearly).toLocaleString('vi-VN')}đ/năm đầu
                </span>
              </div>

              {/* Rows specs list */}
              <div className="space-y-2 text-xs divide-y divide-[#a1c0d1]/30">
                {rows.map((row) => (
                  <div key={row.key} className="pt-2 flex justify-between items-start gap-2">
                    <span className="text-[#6b99ab] shrink-0">{row.label}:</span>
                    <span className="text-right font-medium text-[#00203d]">
                      {row.getValue(pkg)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-[#a1c0d1]/40">
                {isBest ? (
                  <Button
                    variant="navy"
                    size="md"
                    onClick={() => onSelect?.(pkg)}
                    className="w-full group"
                  >
                    <span>Đăng ký {pkg.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-[#3b7a8c]" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => onSelect?.(pkg)}
                    className="w-full"
                  >
                    Chọn gói này
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <div className="p-4 bg-white rounded-2xl border border-[#a1c0d1]/50 text-[11px] text-[#6b99ab] leading-relaxed">
          Giá ví dụ đã gồm VAT. Giá theo tháng được quy đổi khi trả trước 12 tháng; mức gia hạn áp dụng từ năm thứ hai. Không phải báo giá của nhà cung cấp.
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
