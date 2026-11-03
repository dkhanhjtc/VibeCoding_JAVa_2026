import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Server, Cpu } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const LOADING_STEPS = [
  {
    icon: Sparkles,
    text: 'Đang phân tích loại website...',
    detail: 'Đánh giá cấu trúc website, số lượng sản phẩm và danh mục phù hợp'
  },
  {
    icon: Cpu,
    text: 'Đang tính toán lưu lượng và dung lượng...',
    detail: 'Mô phỏng lượt khách ghé thăm đồng thời để không nghẽn giỏ hàng'
  },
  {
    icon: Server,
    text: 'Đang chọn lọc gói tối ưu chi phí...',
    detail: 'So sánh các gói hạ tầng và khuyến nghị đuôi tên miền phù hợp nhất'
  }
];

export const Skeleton = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const textContainerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Smooth cross-fade between AI analysis steps
  useGSAP(() => {
    if (textContainerRef.current) {
      gsap.fromTo(
        textContainerRef.current,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, { dependencies: [currentStepIndex] });

  const currentStep = LOADING_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      {/* Central AI Loading Status Box */}
      <div className="bg-white border border-[#a1c0d1]/60 rounded-3xl p-8 shadow-card text-center mb-8 relative overflow-hidden">
        {/* Shimmer gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f0f4f8] via-[#3b7a8c] to-[#f0f4f8] animate-pulse" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00203d] text-[#3b7a8c] mb-5 shadow-md border border-[#0f383f]">
          <StepIcon className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        <div className="inline-block px-3 py-1 bg-[#f0f4f8] text-[#0f383f] text-xs font-semibold rounded-full uppercase tracking-wider mb-3 border border-[#a1c0d1]">
          AI HostWise Đang Phân Tích
        </div>

        {/* Text container animated smoothly with GSAP */}
        <div ref={textContainerRef} className="min-h-[72px] flex flex-col items-center justify-center">
          <h3 className="text-xl md:text-2xl font-bold text-[#00203d] tracking-tight">
            {currentStep.text}
          </h3>

          <p className="text-[#1f4f5a] text-sm mt-1.5 max-w-md mx-auto">
            {currentStep.detail}
          </p>
        </div>

        {/* Step Progress indicators */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {LOADING_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStepIndex
                  ? 'w-8 bg-[#3b7a8c]'
                  : idx < currentStepIndex
                  ? 'w-3 bg-[#6b99ab]'
                  : 'w-3 bg-[#a1c0d1]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Skeleton Cards Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className={`bg-white border rounded-2xl p-6 ${
              card === 2
                ? 'border-2 border-[#3b7a8c]/50 ring-2 ring-[#3b7a8c]/20'
                : 'border border-[#a1c0d1]/60'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="h-5 bg-[#f0f4f8] rounded w-24"></div>
              {card === 2 && <div className="h-5 bg-[#3b7a8c]/20 rounded-full w-20"></div>}
            </div>

            <div className="h-7 bg-[#f0f4f8] rounded w-36 mb-2"></div>
            <div className="h-4 bg-[#f0f4f8] rounded w-full mb-6"></div>

            <div className="h-10 bg-[#f0f4f8] rounded w-28 mb-6"></div>

            <div className="space-y-3 pt-4 border-t border-[#f0f4f8]">
              <div className="h-4 bg-[#f0f4f8] rounded w-full"></div>
              <div className="h-4 bg-[#f0f4f8] rounded w-5/6"></div>
              <div className="h-4 bg-[#f0f4f8] rounded w-4/6"></div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0f4f8]">
              <div className="h-11 bg-[#f0f4f8] rounded-xl w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
