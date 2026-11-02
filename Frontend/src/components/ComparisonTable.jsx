import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, HardDrive, Users, Globe, Lock, Shield, Clock } from 'lucide-react';

export const ComparisonTable = ({
  packages = [],
  bestMatchId,
  domainRecommendation,
  onSelect
}) => {
  // Tab active cho chế độ xem mobile
  const [activeMobileTab, setActiveMobileTab] = useState(bestMatchId || (packages[0]?.id));

  if (!packages || packages.length === 0) return null;

  // Sắp xếp các gói theo giá tăng dần để dễ đối chiếu
  const sortedPackages = [...packages].sort((a, b) => a.priceMonthly - b.priceMonthly);

  const domainCost = `${Number(domainRecommendation?.priceYearly).toLocaleString('vi-VN')}đ/năm đầu`;

  const rows = [
    {
      key: 'price',
      label: 'Giá / tháng',
      tooltip: 'Mức giá ưu đãi áp dụng trong năm đầu tiên',
      icon: null,
      render: (pkg) => (
        <div>
          <span className="text-base md:text-lg font-bold text-[#111827]">
            {Number(pkg.priceMonthly).toLocaleString('vi-VN')}đ
          </span>
          <span className="text-xs text-gray-500 font-normal"> /tháng</span>
        </div>
      )
    },
    {
      key: 'storage',
      label: 'Ổ cứng (NVMe SSD)',
      tooltip: 'Ổ cứng NVMe siêu tốc, truy xuất nhanh gấp 10 lần SSD SATA thông thường',
      icon: HardDrive,
      render: (pkg) => <span className="font-semibold text-gray-800">{pkg.storage}</span>
    },
    {
      key: 'traffic',
      label: 'Băng thông (Lưu lượng khách)',
      tooltip: 'Số lượt khách tối đa website phục vụ mượt mà mỗi tháng mà không bị nghẽn giỏ hàng',
      icon: Users,
      render: (pkg) => <span className="font-medium text-gray-700">{pkg.traffic}</span>
    },
    {
      key: 'domain',
      label: 'Tên miền kèm theo',
      tooltip: 'Hỗ trợ kết nối và đăng ký tên miền riêng cho shop',
      icon: Globe,
      render: (pkg) => (
        <span className="text-xs text-gray-700">
          {domainRecommendation?.suggestedDomain} ({domainCost})
        </span>
      )
    },
    {
      key: 'ssl',
      label: 'Chứng chỉ bảo mật SSL',
      tooltip: 'Bảo vệ thông tin thanh toán và giỏ hàng của khách (https://)',
      icon: Lock,
      render: (pkg) => (
        <div className="flex items-center justify-center sm:justify-start gap-1 text-emerald-700 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>{pkg.ssl}</span>
        </div>
      )
    },
    {
      key: 'backup',
      label: 'Sao lưu dữ liệu',
      tooltip: 'Tự động sao lưu định kỳ, khôi phục nguyên trạng chỉ với 1 click khi cần',
      icon: Shield,
      render: (pkg) => <span className="text-gray-800">{pkg.backup}</span>
    },
    {
      key: 'websites',
      label: 'Số lượng website',
      tooltip: 'Số website chạy độc lập trên cùng gói hosting',
      icon: null,
      render: (pkg) => <span className="text-gray-800">{pkg.websites} website</span>
    },
    {
      key: 'support',
      label: 'Kênh hỗ trợ',
      tooltip: 'Kỹ thuật viên đồng hành giải quyết sự cố 24/7',
      icon: Clock,
      render: (pkg) => <span className="text-gray-800">{pkg.support}</span>
    }
  ].filter((row) => row.key !== 'domain' || domainRecommendation);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm mt-10">
      {/* Title & Section Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-bold text-[#111827]">
            Bảng đối chiếu thông số chi tiết
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            So sánh đối chiếu 3 gói hosting (01 Best Match + 02 Alternatives) trực quan
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Đã gồm VAT & Hỗ trợ kỹ thuật cấu hình ban đầu
        </div>
      </div>

      {/* ----------------- MOBILE VIEW (< 768px): SWIPEABLE / TABBED CARDS ----------------- */}
      <div className="block md:hidden p-4">
        {/* Package Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl mb-4">
          {sortedPackages.map((pkg) => {
            const isBest = pkg.id === bestMatchId;
            const isSelected = pkg.id === activeMobileTab;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setActiveMobileTab(pkg.id)}
                className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all relative ${
                  isSelected
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                {pkg.name}
                {isBest && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Package Details in Mobile Card */}
        {sortedPackages
          .filter((pkg) => pkg.id === activeMobileTab)
          .map((pkg) => {
            const isBest = pkg.id === bestMatchId;
            return (
              <div
                key={pkg.id}
                className={`rounded-2xl p-5 ${
                  isBest
                    ? 'bg-gray-50/90 border-2 border-[#111827]'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                  <div>
                    {isBest && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-[#111827] px-2 py-0.5 rounded-full mb-1">
                        <Sparkles className="w-3 h-3 text-amber-300" /> Khuyên dùng tốt nhất
                      </span>
                    )}
                    <h5 className="text-xl font-bold text-[#111827]">{pkg.name}</h5>
                    <p className="text-xs text-gray-500">{pkg.tagline}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-[#111827]">
                      {Number(pkg.priceMonthly).toLocaleString('vi-VN')}đ
                    </div>
                    <div className="text-[11px] text-gray-500">/tháng</div>
                  </div>
                </div>

                <div className="space-y-3 divide-y divide-gray-100 text-xs">
                  {rows.map((row) => (
                    <div key={row.key} className="pt-2 flex justify-between items-center gap-2">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="text-right font-medium text-gray-800">
                        {row.render(pkg)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => onSelect?.(pkg)}
                    className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      isBest
                        ? 'bg-[#111827] text-white shadow-md hover:bg-[#1F2937]'
                        : 'border border-gray-300 text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <span>{isBest ? `Đăng ký tư vấn gói ${pkg.name}` : `Chọn gói ${pkg.name}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* ----------------- DESKTOP VIEW (>= 768px): FULL GRID TABLE ----------------- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-white">
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                Tiêu chí so sánh
              </th>
              {sortedPackages.map((pkg) => {
                const isBest = pkg.id === bestMatchId;
                return (
                  <th
                    key={pkg.id}
                    className={`py-4 px-6 text-center w-1/4 transition-colors ${
                      isBest ? 'bg-gray-50/90 relative' : ''
                    }`}
                  >
                    {isBest && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#111827]"></div>
                    )}
                    {isBest && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-[#111827] px-2.5 py-0.5 rounded-full mb-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Khuyên dùng tốt nhất
                      </span>
                    )}
                    <div className="text-lg font-bold text-[#111827]">{pkg.name}</div>
                    <div className="text-xs text-gray-500 font-normal">{pkg.tagline}</div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-gray-50/40 transition-colors">
                <td className="py-3.5 px-6 font-medium text-gray-700 text-xs flex items-center gap-1.5">
                  <span>{row.label}</span>
                </td>
                {sortedPackages.map((pkg) => {
                  const isBest = pkg.id === bestMatchId;
                  return (
                    <td
                      key={pkg.id}
                      className={`py-3.5 px-6 text-center ${
                        isBest ? 'bg-gray-50/80 font-medium' : ''
                      }`}
                    >
                      {row.render(pkg)}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Action Row at Bottom of Table */}
            <tr className="border-t-2 border-gray-200 bg-white">
              <td className="py-5 px-6 text-xs font-semibold text-gray-400 uppercase">
                Hành động
              </td>
              {sortedPackages.map((pkg) => {
                const isBest = pkg.id === bestMatchId;
                return (
                  <td
                    key={pkg.id}
                    className={`py-5 px-6 text-center ${
                      isBest ? 'bg-gray-50/80' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect?.(pkg)}
                      className={`w-full max-w-[200px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 ${
                        isBest
                          ? 'bg-[#111827] text-white shadow hover:bg-[#1F2937]'
                          : 'border border-gray-300 text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <span>{isBest ? `Đăng ký ${pkg.name}` : 'Chọn gói này'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
