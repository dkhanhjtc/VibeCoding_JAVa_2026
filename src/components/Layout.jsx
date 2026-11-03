import React, { useState, useRef } from 'react';
import {
  Store,
  ShieldCheck,
  ArrowUp,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from './UIPrimitives.jsx';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Layout = ({
  children,
  onOpenAdminLogin
}) => {
  const [activeNav, setActiveNav] = useState('khao-sat');
  const layoutRef = useRef(null);
  const dockRef = useRef(null);
  const staticNavRef = useRef(null);

  useGSAP(() => {
    // Initial setup: floating dock starts hidden and slightly raised for smooth entry
    gsap.set(dockRef.current, {
      autoAlpha: 0,
      y: -16,
      willChange: 'transform, opacity'
    });

    // ScrollTrigger to smoothly fade/slide in floating dock when scrolled past 80px
    const dockTrigger = ScrollTrigger.create({
      start: 80,
      onEnter: () => {
        gsap.to(dockRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        if (staticNavRef.current) {
          gsap.to(staticNavRef.current, {
            autoAlpha: 0,
            duration: 0.2,
            overwrite: 'auto'
          });
        }
      },
      onLeaveBack: () => {
        gsap.to(dockRef.current, {
          autoAlpha: 0,
          y: -16,
          duration: 0.25,
          ease: 'power2.in',
          overwrite: 'auto'
        });
        if (staticNavRef.current) {
          gsap.to(staticNavRef.current, {
            autoAlpha: 1,
            duration: 0.25,
            overwrite: 'auto'
          });
        }
      }
    });

    // ScrollSpy trigger for the FAQ section (#cau-hoi)
    // Only toggles active nav state when section boundary is crossed (0 unnecessary re-renders)
    const spyTrigger = ScrollTrigger.create({
      trigger: '#cau-hoi',
      start: 'top 60%',
      onToggle: (self) => {
        setActiveNav(self.isActive ? 'cau-hoi' : 'khao-sat');
      }
    });

    return () => {
      dockTrigger.kill();
      spyTrigger.kill();
    };
  }, { scope: layoutRef });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={layoutRef}
      className="min-h-screen bg-[#f0f4f8] text-[#00203d] flex flex-col font-sans antialiased selection:bg-[#3b7a8c] selection:text-white relative"
    >
      {/* =========================================================================
          TẦNG 1: STATIC HEADER BAR (Nằm tự nhiên ở đầu trang, trôi đi khi scroll)
          ========================================================================= */}
      <header className="w-full pt-4 pb-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand bên trái */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#00203d] text-white flex items-center justify-center shadow-subtle shrink-0 border border-[#0f383f]">
              <Store className="w-5 h-5 text-[#3b7a8c]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-[#00203d]">
                  Shop khởi sắc
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[12px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white text-[#0f383f] border border-[#a1c0d1] before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-green-500 before:animate-pulse">
                Demo
              </span>
            </div>
          </div>

          {/* Vị trí tĩnh của Navigation Dock khi ở đầu trang */}
          <div ref={staticNavRef} className="hidden md:flex items-center justify-center flex-1">
            <nav className="inline-flex items-center p-1 bg-white/70 border border-[#a1c0d1]/60 rounded-full shadow-subtle transition-all duration-300">
              <a
                href="#khao-sat"
                onClick={() => setActiveNav('khao-sat')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeNav === 'khao-sat'
                    ? 'bg-[#00203d] text-white shadow-subtle'
                    : 'text-[#1f4f5a] hover:text-[#00203d] hover:bg-[#f0f4f8]'
                }`}
              >
                Tư vấn cho shop
              </a>
              <a
                href="#cau-hoi"
                onClick={() => setActiveNav('cau-hoi')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeNav === 'cau-hoi'
                    ? 'bg-[#00203d] text-white shadow-subtle'
                    : 'text-[#1f4f5a] hover:text-[#00203d] hover:bg-[#f0f4f8]'
                }`}
              >
                Câu hỏi thường gặp
              </a>
            </nav>
          </div>

          {/* Nút Đăng nhập Quản Trị bên phải */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAdminLogin}
              className="border-[#a1c0d1] text-[#00203d] hover:bg-[#f0f4f8] shadow-subtle group"
              title="Đăng nhập dành cho Quản trị viên & BGK"
            >
              <Lock className="w-3.5 h-3.5 text-[#3b7a8c] group-hover:scale-110 transition-transform" />
              <span>Đăng nhập Quản Trị</span>
            </Button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          TẦNG 2: FLOATING NAV DOCK BÁM THEO KHI LƯỚT CHUỘT (GPU Accelerated with GSAP)
          ========================================================================= */}
      <div
        ref={dockRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        style={{ visibility: 'hidden', opacity: 0 }}
      >
        <nav className="inline-flex items-center p-1.5 bg-[#f0f4f8]/90 backdrop-blur-md border border-[#a1c0d1] rounded-full shadow-floating transition-all duration-300 ease-out">
          <a
            href="#khao-sat"
            onClick={() => setActiveNav('khao-sat')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none ${
              activeNav === 'khao-sat'
                ? 'bg-[#00203d] text-white shadow-subtle'
                : 'text-[#1f4f5a] hover:text-[#00203d] hover:bg-white/60'
            }`}
          >
            Tư vấn cho shop
          </a>
          <a
            href="#cau-hoi"
            onClick={() => setActiveNav('cau-hoi')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none ${
              activeNav === 'cau-hoi'
                ? 'bg-[#00203d] text-white shadow-subtle'
                : 'text-[#1f4f5a] hover:text-[#00203d] hover:bg-white/60'
            }`}
          >
            Câu hỏi thường gặp
          </a>
        </nav>
      </div>

      {/* ----------------- MAIN VIEWPORT CONTAINER ----------------- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        {children}
      </main>

      {/* =========================================================================
          FOOTER (CHÂN TRANG NÂNG CẤP)
          ========================================================================= */}
      <footer className="bg-[#00203d] text-white border-t border-[#0f383f] mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Col 1: Brand & Scroll-to-Top Clickable Logo */}
            <div className="md:col-span-5 space-y-3">
              <button
                type="button"
                onClick={scrollToTop}
                className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b7a8c] rounded-xl p-1 -ml-1 transition-all"
                title="Nhấn để cuộn mượt lên đỉnh trang"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0f383f] text-[#3b7a8c] flex items-center justify-center border border-[#1f4f5a] group-hover:bg-[#3b7a8c] group-hover:text-white transition-all shadow-subtle">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg tracking-tight text-white group-hover:text-[#a1c0d1] transition-colors">
                      Shop khởi sắc
                    </span>
                    <ArrowUp className="w-3.5 h-3.5 text-[#3b7a8c] opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-[10px] text-[#a1c0d1]/80 font-bold uppercase tracking-wider block">
                    Cuộn lên đầu trang ↑
                  </span>
                </div>
              </button>

              <p className="text-xs text-[#a1c0d1]/90 leading-relaxed max-w-sm">
                Mini app tư vấn chọn gói Hosting & Tên miền vừa vặn nhất cho chủ shop online nhỏ. Không rườm rà kỹ thuật, tối ưu từng đồng ngân sách.
              </p>

              <div className="pt-1 flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#0f383f] text-[#a1c0d1] border border-[#1f4f5a]">
                  HostWise AI Engine
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#3b7a8c]/20 text-[#a1c0d1] border border-[#3b7a8c]/40">
                  Bản Demo 2026
                </span>
              </div>
            </div>

            {/* Col 2: Contact Channels */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a1c0d1] block">
                Kênh Tư Vấn Trực Tiếp
              </span>

              <div className="space-y-2 text-xs">
                {/* Hotline & Zalo */}
                <a
                  href="tel:0901234567"
                  className="flex items-center gap-2.5 text-[#a1c0d1] hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0f383f] flex items-center justify-center text-[#3b7a8c] group-hover:bg-[#3b7a8c] group-hover:text-white transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">090 123 4567</span>
                    <span className="text-[10px] text-[#a1c0d1]/70">Hotline & Zalo hỗ trợ kỹ thuật</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:hotro@shopkhoisac.vn"
                  className="flex items-center gap-2.5 text-[#a1c0d1] hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0f383f] flex items-center justify-center text-[#3b7a8c] group-hover:bg-[#3b7a8c] group-hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">hotro@shopkhoisac.vn</span>
                    <span className="text-[10px] text-[#a1c0d1]/70">Phản hồi giải pháp trong 15 phút</span>
                  </div>
                </a>

                {/* Facebook Fanpage */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#a1c0d1] hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0f383f] flex items-center justify-center text-[#3b7a8c] group-hover:bg-[#3b7a8c] group-hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-white block">Shop Khởi Sắc Community</span>
                    <span className="text-[10px] text-[#a1c0d1]/70">Cộng đồng hỗ trợ mở web bán hàng</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Col 3: Support Hours & Trust Badges */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a1c0d1] block">
                Thời Gian Làm Việc
              </span>

              <div className="p-3.5 rounded-2xl bg-[#0f383f]/60 border border-[#1f4f5a] space-y-1.5 text-xs text-[#a1c0d1]">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <Clock className="w-4 h-4 text-[#3b7a8c]" />
                  <span>8:00 — 22:00</span>
                </div>
                <p className="text-[11px] text-[#a1c0d1]/80">
                  Tất cả các ngày trong tuần.
                </p>
                <div className="pt-1.5 border-t border-[#1f4f5a] text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Hạ tầng & Kỹ thuật trực 24/7
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Terms */}
          <div className="pt-6 border-t border-[#0f383f] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a1c0d1]/80">
            <p>
              © 2026 Shop khởi sắc · Giá, gói dịch vụ và tình trạng tên miền là ví dụ minh họa.
            </p>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-[#a1c0d1]/70 hover:text-white cursor-pointer transition-colors">
                Quyền riêng tư
              </span>
              <span className="text-[#a1c0d1]/40">·</span>
              <span className="text-[#a1c0d1]/70 hover:text-white cursor-pointer transition-colors">
                Điều khoản dịch vụ
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
