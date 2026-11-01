import React from 'react';
import { Server, Smartphone, Monitor, Database, Shield } from 'lucide-react';

export const Layout = ({
  children,
  previewMode = 'desktop',
  onPreviewModeChange,
  onOpenLeadsDrawer
}) => {
  const isMobilePreview = previewMode === 'mobile';

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans transition-colors antialiased">
      {/* ----------------- TOP STICKY HEADER ----------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center shadow-sm shrink-0 border border-[#111827]">
              <Server className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#111827]">
                  HostWise AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  Bản Demo
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                Hosting & Tên Miền, Dễ Hiểu Hơn
              </p>
            </div>
          </div>

          {/* Nav links on desktop */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600">
            <a href="#khao-sat" className="hover:text-[#111827] transition-colors">
              Tư vấn cho shop
            </a>
            <a href="#cau-hoi" className="hover:text-[#111827] transition-colors">
              Câu hỏi thường gặp
            </a>
          </nav>

          {/* ----------------- BỘ SWITCHER CHẾ ĐỘ XEM (CHO BGK CHẤM ĐIỂM UI) ----------------- */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200 shadow-inner">
            <button
              type="button"
              onClick={() => onPreviewModeChange?.('mobile')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isMobilePreview
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
              title="Xem giao diện mô phỏng điện thoại di động (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">📱 Xem Giao Diện Mobile (390px)</span>
              <span className="sm:hidden">📱 390px</span>
            </button>

            <button
              type="button"
              onClick={() => onPreviewModeChange?.('desktop')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isMobilePreview
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
              title="Xem giao diện chuẩn Desktop toàn màn hình"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">💻 Xem Giao Diện Desktop (Full width)</span>
              <span className="sm:hidden">💻 Full</span>
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- MAIN VIEWPORT / SIMULATOR CONTAINER ----------------- */}
      <main className="flex-1 flex flex-col items-center justify-start w-full py-6 md:py-10 px-2 sm:px-4">
        {isMobilePreview ? (
          /* Khung giả lập iPhone 390px chuẩn sang trọng với viền bo tròn và đổ bóng */
          <div className="w-full flex flex-col items-center">
            {/* Simulator helper note */}
            <div className="mb-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#111827] text-white shadow-sm">
                Đang mô phỏng màn hình iPhone 15 Pro (390 × 844 px)
              </span>
              <p className="text-[11px] text-gray-500 mt-1">
                Cuộn bên trong khung điện thoại để trải nghiệm 100% Mobile Responsive
              </p>
            </div>

            {/* iPhone Frame */}
            <div className="w-[390px] max-w-[calc(100vw-1rem)] bg-[#111827] p-3 rounded-[52px] shadow-phone ring-1 ring-gray-900/30 relative transition-all">
              {/* Dynamic Island notch (Tuyệt đối không dùng màu đen tuyền #000000, dùng Đen than #111827) */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#111827] rounded-full flex items-center justify-end pr-2.5 z-30 pointer-events-none border border-gray-800">
                <div className="w-2.5 h-2.5 bg-gray-800 rounded-full border border-gray-700"></div>
              </div>

              {/* iPhone screen glass */}
              <div className="bg-slate-50 rounded-[42px] overflow-hidden overflow-y-auto max-h-[844px] min-h-[720px] text-gray-900 relative border border-gray-300/40">
                {/* Status Bar simulation */}
                <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-gray-800 bg-white/70 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-100">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span className="text-[10px]">5G</span>
                    <div className="w-5 h-2.5 border border-gray-600 rounded-xs p-0.5 flex items-center">
                      <div className="h-full w-full bg-gray-800 rounded-2xs"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {children}
                </div>

                {/* Home Indicator line */}
                <div className="sticky bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full mx-auto my-2 pointer-events-none"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Container chuẩn full-width */
          <div className="w-full max-w-6xl mx-auto transition-all">
            {children}
          </div>
        )}
      </main>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-800">
              © 2026 HostWise AI · Mini app tư vấn chọn gói Hosting & Tên miền cho chủ shop online nhỏ.
            </p>
            <p className="text-gray-500 mt-0.5">
              Phát triển bởi nhóm: <strong className="text-gray-700">TV1 (Frontend & UI/UX)</strong> & <strong className="text-gray-700">TV2 (Backend & AI Logic)</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Nút Admin Leads dành cho BGK nghiệm thu */}
            <button
              type="button"
              onClick={onOpenLeadsDrawer}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-[#111827] text-gray-700 hover:text-white border border-gray-300 hover:border-[#111827] transition-all shadow-xs group"
              title="Mở bảng dữ liệu khách hàng lưu trong LocalStorage"
            >
              <Database className="w-4 h-4 text-amber-500 group-hover:text-amber-300" />
              <Shield className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-300" />
              <span className="font-semibold">Quản trị Leads (Dành cho BGK)</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
