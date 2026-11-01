import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Băng thông là gì? Hết băng thông thì web có bị sập không?',
    answer: 'Băng thông (Bandwidth) là tổng dung lượng dữ liệu truyền tải giữa website và khách truy cập (tải ảnh sản phẩm, xem video, lướt trang). Khi hết hạn mức băng thông tháng, website sẽ hiển thị thông báo tạm thời ngưng phục vụ (Bandwidth Limit Exceeded) thay vì sập hoàn toàn. Tuy nhiên, các gói hosting tại HostWise đều được cấu hình hạn mức rộng rãi và có cảnh báo tự động khi đạt 80% để bạn an tâm kinh doanh.'
  },
  {
    id: 'faq-2',
    question: 'Nên chọn đuôi .vn hay .com cho shop bán hàng online?',
    answer: 'Nếu thị trường chính của bạn là người tiêu dùng tại Việt Nam, đuôi .vn (hoặc .com.vn) là lựa chọn vàng vì tăng uy tín cao nhất, bảo hộ thương hiệu nội địa và được thuật toán tìm kiếm Google ưu tiên hiển thị trong nước. Nếu bạn muốn tiết kiệm chi phí ban đầu hoặc có kế hoạch bán xuyên biên giới, đuôi .com là giải pháp quốc tế thông dụng và chi phí gia hạn rất rẻ.'
  },
  {
    id: 'faq-3',
    question: 'Mới mở shop có cần thuê máy chủ riêng (VPS) không?',
    answer: 'Hoàn toàn CHƯA CẦN. VPS đòi hỏi kiến thức quản trị hệ thống phức tạp (cài đặt Linux, bảo mật tường lửa, tối ưu web server). Một gói Cloud Hosting / Shared Hosting chất lượng cao đã được cấu hình sẵn môi trường LiteSpeed tối ưu riêng cho WordPress/WooCommerce, kèm đội ngũ kỹ thuật chăm sóc 24/7 giúp bạn tập trung 100% vào việc bán hàng.'
  },
  {
    id: 'faq-4',
    question: 'Ổ cứng SSD thường và NVMe SSD khác nhau ra sao?',
    answer: 'Ổ cứng NVMe SSD sử dụng giao thức truyền dữ liệu trực tiếp qua khe PCIe, mang lại tốc độ đọc ghi dữ liệu nhanh gấp 5 đến 10 lần so với ổ SSD SATA thông thường. Đối với web bán hàng WooCommerce có nhiều hình ảnh và truy vấn cơ sở dữ liệu giỏ hàng, NVMe giúp tốc độ tải trang dưới 1.2 giây, giảm tỷ lệ khách thoát trang và tăng chuyển đổi đơn hàng.'
  },
  {
    id: 'faq-5',
    question: 'Sau này lượng khách tăng thì có nâng cấp gói hosting dễ dàng không?',
    answer: 'Rất dễ dàng và hoàn toàn tự động! Bạn có thể nâng cấp từ gói Khởi đầu lên Đồng hành hoặc Phát triển chỉ với 1 cú click trong tài khoản quản trị. Toàn bộ mã nguồn, hình ảnh sản phẩm và cơ sở dữ liệu đơn hàng được giữ nguyên vẹn 100%, website hoạt động liên tục mà không hề bị gián đoạn hay mất 1 giây truy cập nào.'
  }
];

export const FAQAccordion = () => {
  // Mở mặc định câu hỏi đầu tiên
  const [openItems, setOpenItems] = useState({ 'faq-1': true });

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section aria-label="Câu hỏi thường gặp" className="w-full mt-14 mb-8">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          GIẢI ĐÁP NGẮN GỌN
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mt-1">
          Bạn có thể đang băn khoăn
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
          Những điều cần biết để chủ shop yên tâm chọn hosting và mở website kinh doanh
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = !!openItems[item.id];
          return (
            <div
              key={item.id}
              className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                isOpen
                  ? 'border-gray-300 bg-white shadow-sm ring-1 ring-[#111827]/5'
                  : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full text-left py-4 px-5 sm:px-6 flex items-center justify-between gap-4 font-bold text-[#111827] text-sm sm:text-base select-none cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
                  <span>{item.question}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#111827]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40 animate-fade-in">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQAccordion;
