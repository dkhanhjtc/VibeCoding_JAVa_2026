import React from 'react';
import { Server, Database, Shield, ExternalLink } from 'lucide-react';

export const Layout = ({
  children,
  onOpenLeadsDrawer
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans antialiased selection:bg-[#111827] selection:text-white">
      {/* ----------------- TOP HEADER ----------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xs">
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

          {/* Header Action: Leads Admin Button for Judges */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLeadsDrawer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#111827] text-gray-700 hover:text-white border border-gray-200 hover:border-[#111827] text-xs font-semibold transition-all shadow-2xs group"
              title="Mở bảng dữ liệu khách hàng lưu trong LocalStorage"
            >
              <Database className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-300" />
              <span className="hidden sm:inline">Quản trị Leads</span>
              <span className="sm:hidden">Leads</span>
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- MAIN VIEWPORT CONTAINER (100% RESPONSIVE) ----------------- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
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
