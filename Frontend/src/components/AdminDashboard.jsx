import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Users, 
  TrendingUp, 
  Globe, 
  Database, 
  Download, 
  Trash2, 
  LogOut, 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { getLeads, clearTestLeads, exportLeadsToCSV } from '../services/leadsStore.js';
import { logoutAdmin } from '../services/authService.js';
import { Button } from './UIPrimitives.jsx';

export const AdminDashboard = ({
  onBackToHome,
  onLogout
}) => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [packageFilter, setPackageFilter] = useState('ALL');
  const [confirmClear, setConfirmClear] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const loadData = () => {
    const list = getLeads();
    setLeads(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    onLogout?.();
  };

  const handleClearData = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearTestLeads();
    setLeads([]);
    setConfirmClear(false);
    setSelectedLead(null);
  };

  // Tính toán KPI Thống kê nhanh
  const totalLeads = leads.length;

  // Gói được chọn nhiều nhất
  const packageCounts = leads.reduce((acc, lead) => {
    const pkg = lead.packageName || 'Đồng hành';
    acc[pkg] = (acc[pkg] || 0) + 1;
    return acc;
  }, {});

  let topPackage = 'Chưa có';
  let topCount = 0;
  Object.entries(packageCounts).forEach(([name, count]) => {
    if (count > topCount) {
      topCount = count;
      topPackage = name;
    }
  });

  // Tỷ lệ khách mua kèm tên miền
  const leadsWithDomain = leads.filter(l => l.domainIdea && l.domainIdea !== 'Chưa chọn' && l.domainIdea !== 'Không mua kèm tên miền').length;
  const domainRate = totalLeads > 0 ? Math.round((leadsWithDomain / totalLeads) * 100) : 0;

  // Lọc dữ liệu theo search và gói
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').includes(searchTerm) ||
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.domainIdea || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPackage = packageFilter === 'ALL' || lead.packageName === packageFilter;

    return matchesSearch && matchesPackage;
  });

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#00203d] flex flex-col font-sans antialiased">
      {/* ----------------- ADMIN TOP NAVIGATION BAR ----------------- */}
      <header className="sticky top-0 z-40 w-full bg-[#00203d] text-white border-b border-[#0f383f] shadow-floating">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0f383f] text-[#3b7a8c] flex items-center justify-center border border-[#1f4f5a]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-white">
                  Shop khởi sắc
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#3b7a8c]/25 text-[#a1c0d1] border border-[#3b7a8c]/40">
                  Admin Dashboard
                </span>
              </div>
              <p className="text-[10px] text-[#a1c0d1]/80 font-bold uppercase tracking-wider hidden sm:block">
                Hệ Thống Quản Trị Khách Hàng (Leads Management)
              </p>
            </div>
          </div>

          {/* User info & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-semibold text-[#a1c0d1] hidden md:inline-block">
              Quản trị viên (Admin)
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={onBackToHome}
              className="bg-transparent border-[#1f4f5a] text-white hover:bg-[#0f383f] hover:border-[#3b7a8c]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#3b7a8c]" />
              <span className="hidden sm:inline text-[#000000]">Về trang chủ</span>
              <span className="sm:hidden">Trang chủ</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white border-transparent"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ----------------- MAIN ADMIN CONTENT ----------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* KPI Cards Grid */}
        <section aria-label="Báo cáo tổng quan" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Tổng Leads */}
          <div className="bg-white rounded-3xl p-5 border border-[#a1c0d1]/60 shadow-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b99ab] block">
                Tổng khách đăng ký
              </span>
              <div className="text-3xl font-black text-[#00203d] mt-1">
                {totalLeads}
              </div>
              <span className="text-[11px] text-[#3b7a8c] font-semibold mt-0.5 block">
                Lưu trên LocalStorage
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#f0f4f8] text-[#3b7a8c] flex items-center justify-center border border-[#a1c0d1]/40 shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Gói chuộng nhất */}
          <div className="bg-white rounded-3xl p-5 border border-[#a1c0d1]/60 shadow-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b99ab] block">
                Gói được chọn nhiều
              </span>
              <div className="text-2xl font-black text-[#00203d] mt-1 truncate max-w-[140px]">
                {topPackage}
              </div>
              <span className="text-[11px] text-[#1f4f5a] font-medium mt-0.5 block">
                {topCount > 0 ? `${topCount} lượt quan tâm` : 'Chưa có dữ liệu'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#f0f4f8] text-[#2e5e73] flex items-center justify-center border border-[#a1c0d1]/40 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Tỷ lệ kèm tên miền */}
          <div className="bg-white rounded-3xl p-5 border border-[#a1c0d1]/60 shadow-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b99ab] block">
                Kèm tên miền
              </span>
              <div className="text-3xl font-black text-[#00203d] mt-1">
                {domainRate}%
              </div>
              <span className="text-[11px] text-[#3b7a8c] font-semibold mt-0.5 block">
                {leadsWithDomain} / {totalLeads} khách
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#f0f4f8] text-[#3b7a8c] flex items-center justify-center border border-[#a1c0d1]/40 shrink-0">
              <Globe className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Cơ sở dữ liệu */}
          <div className="bg-white rounded-3xl p-5 border border-[#a1c0d1]/60 shadow-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b99ab] block">
                Cơ sở dữ liệu
              </span>
              <div className="text-lg font-black text-[#00203d] mt-1">
                Native Storage
              </div>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Hoạt động ổn định
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#f0f4f8] text-[#0f383f] flex items-center justify-center border border-[#a1c0d1]/40 shrink-0">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Action & Filter Toolbar */}
        <section aria-label="Bộ lọc dữ liệu" className="bg-white rounded-3xl p-5 border border-[#a1c0d1]/60 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#6b99ab] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, SĐT, email, tên miền..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#a1c0d1] bg-white text-xs sm:text-sm text-[#00203d] focus:outline-none focus:ring-2 focus:ring-[#3b7a8c] transition-all"
              />
            </div>

            {/* Filter by Package */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#6b99ab] shrink-0" />
              <select
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#a1c0d1] bg-white text-xs font-semibold text-[#00203d] focus:outline-none focus:ring-2 focus:ring-[#3b7a8c] cursor-pointer"
              >
                <option value="ALL">Tất cả gói hosting</option>
                <option value="Khởi đầu">Gói Khởi đầu</option>
                <option value="Đồng hành">Gói Đồng hành</option>
                <option value="Phát triển">Gói Phát triển</option>
                <option value="Tăng tốc">Gói Tăng tốc</option>
              </select>
            </div>
          </div>

          {/* Action Buttons: Export CSV & Clear */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="navy"
              size="sm"
              onClick={exportLeadsToCSV}
              disabled={leads.length === 0}
              className="gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#3b7a8c]" />
              <span>Xuất CSV (Excel)</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearData}
              disabled={leads.length === 0}
              className={`gap-1.5 ${confirmClear ? 'border-rose-500 text-rose-600 bg-rose-50' : ''}`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{confirmClear ? 'Nhấn để xác nhận xóa' : 'Xóa dữ liệu mẫu'}</span>
            </Button>
          </div>
        </section>

        {/* Detailed Data Table */}
        <section aria-label="Bảng danh sách leads" className="bg-white rounded-3xl border border-[#a1c0d1]/60 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[#a1c0d1]/40 flex items-center justify-between">
            <h3 className="font-black text-lg text-[#00203d]">
              Danh sách khách hàng ({filteredLeads.length})
            </h3>
            <span className="text-xs text-[#6b99ab]">
              Cập nhật thời gian thực
            </span>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="py-14 text-center px-4">
              <Users className="w-10 h-10 text-[#a1c0d1] mx-auto mb-2" />
              <p className="font-bold text-sm text-[#00203d]">Không tìm thấy khách hàng nào</p>
              <p className="text-xs text-[#1f4f5a] mt-1 max-w-sm mx-auto">
                {leads.length === 0 
                  ? 'Chưa có thông tin đăng ký nào. Hãy gửi thử 1 đơn đăng ký từ trang chủ!'
                  : 'Không có dữ liệu khớp với điều kiện lọc hoặc từ khóa tìm kiếm.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#a1c0d1]/40 bg-[#f0f4f8]/50 text-[#6b99ab] font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4">Liên hệ</th>
                    <th className="py-3 px-4">Gói dịch vụ</th>
                    <th className="py-3 px-4">Tên miền đề xuất</th>
                    <th className="py-3 px-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#a1c0d1]/30">
                  {filteredLeads.map((lead) => {
                    const dateFormatted = lead.createdAt 
                      ? new Date(lead.createdAt).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A';

                    return (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-[#f0f4f8]/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 text-[#1f4f5a] whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#6b99ab]" />
                            <span>{dateFormatted}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-[#00203d] whitespace-nowrap">
                          {lead.fullName || 'Chưa đặt tên'}
                        </td>

                        <td className="py-3.5 px-4 text-[#1f4f5a] space-y-0.5 whitespace-nowrap">
                          <div className="flex items-center gap-1 font-mono font-medium text-[#00203d]">
                            <Phone className="w-3 h-3 text-[#3b7a8c]" />
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-1 text-[11px] text-[#6b99ab]">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${lead.email}`} className="hover:underline truncate max-w-[160px]">{lead.email}</a>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00203d] text-white">
                            {lead.packageName}
                          </span>
                          <div className="text-[10px] text-[#6b99ab] mt-0.5">
                            {lead.packagePrice}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-[#00203d] whitespace-nowrap">
                          {lead.domainIdea || 'Chưa chọn'}
                        </td>

                        <td className="py-3.5 px-4 text-[#1f4f5a] max-w-xs truncate" title={lead.note}>
                          {lead.note || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

