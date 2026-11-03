import React, { useState, useRef } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SectionBadge } from './UIPrimitives.jsx';

gsap.registerPlugin(useGSAP);

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Hosting và tên miền khác nhau thế nào?',
    answer: 'Tên miền là địa chỉ để khách tìm đến, như mayhandmade.vn. Hosting là nơi chứa ảnh, sản phẩm và nội dung của shop. Muốn website hoạt động, bạn cần cả hai.'
  },
  {
    id: 'faq-2',
    question: 'Chưa rành kỹ thuật có tự dùng được không?',
    answer: 'Hoàn toàn được. Bảng quản trị tiếng Việt trực quan, tự động cài đặt WordPress/WooCommerce chỉ với 1 click và đội ngũ kỹ thuật hỗ trợ bạn 24/7.'
  },
  {
    id: 'faq-3',
    question: 'Shop đông khách hơn thì nâng gói được chứ?',
    answer: 'Có thể nâng cấp bất kỳ lúc nào chỉ mất 2-3 phút, dữ liệu và hình ảnh sản phẩm được giữ nguyên vẹn 100% không làm gián đoạn việc bán hàng.'
  },
  {
    id: 'faq-4',
    question: 'Năm sau tôi sẽ trả bao nhiêu?',
    answer: 'Chi phí gia hạn từ năm thứ hai được niêm yết rõ ràng và minh bạch ngay từ đầu, không có phí ẩn. Ví dụ gói Đồng hành là 129.000đ/tháng (1.548.000đ/năm).'
  },
  {
    id: 'faq-5',
    question: 'Để lại thông tin có bị trừ tiền không?',
    answer: 'Không bao giờ. Bước đăng ký tư vấn hoàn toàn miễn phí, chúng tôi không yêu cầu thông tin thẻ ngân hàng hay bất kỳ cam kết mua hàng nào.'
  }
];

export const FAQAccordion = () => {
  // Mở mặc định câu hỏi đầu tiên như mockup
  const [openItems, setOpenItems] = useState({ 'faq-1': true });
  const faqRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.from('.faq-card', {
      y: 15,
      autoAlpha: 0,
      duration: 0.45,
      stagger: 0.06,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility'
    });
  }, { scope: faqRef });

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section ref={faqRef} aria-label="Câu hỏi thường gặp" className="w-full">
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b7a8c] block mb-0.5">
          GIẢI ĐÁP NGẮN GỌN
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#00203d] tracking-tight">
          Bạn có thể đang băn khoăn
        </h3>
        <p className="text-xs sm:text-sm text-[#1f4f5a] mt-1 leading-relaxed">
          Những điều nên biết trước khi mở website đầu tiên.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
        {FAQ_ITEMS.map((item) => {
          const isOpen = !!openItems[item.id];
          return (
            <div
              key={item.id}
              className={`faq-card rounded-2xl transition-all duration-200 border overflow-hidden ${
                isOpen
                  ? 'border-[#3b7a8c] bg-white shadow-card ring-1 ring-[#3b7a8c]/20'
                  : 'border-[#a1c0d1]/40 bg-white hover:border-[#6b99ab] hover:bg-[#f0f4f8]/50'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full text-left py-3.5 px-4 sm:px-5 flex items-center justify-between gap-3 font-bold text-[#00203d] text-xs sm:text-sm select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b7a8c]"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#3b7a8c] shrink-0 hidden sm:block" />
                  <span>{item.question}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#6b99ab] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#3b7a8c]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-[#1f4f5a] leading-relaxed border-t border-[#f0f4f8] bg-[#f0f4f8]/40 animate-fade-in">
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
