import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, Database, Shield, RefreshCw, UserCheck, Calendar, Phone, Mail } from 'lucide-react';
import { getLeads, clearTestLeads, exportLeadsToCSV } from '../services/leadsStore.js';

export const LeadsDrawer = ({
  isOpen,
  onClose,
  onLeadsUpdated
}) => {
  const [leads, setLeads] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const fetchLeads = () => {
    const list = getLeads();
    setLeads(list);
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
      setConfirmClear(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    exportLeadsToCSV();
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearTestLeads();
    setLeads([]);
    setConfirmClear(false);
    onLeadsUpdated?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-[#00203d]/75 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col border-l border-[#a1c0d1]/60 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header (Navy Theme) */}
        <div className="p-6 border-b border-[#0f383f] bg-[#00203d] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f383f] text-[#3b7a8c] flex items-center justify-center shadow-sm border border-[#1f4f5a]">
              <Database className="w-5 h-5 text-[#3b7a8c]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  Quản Trị Khách Hàng (Leads Store)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#3b7a8c]/25 text-[#a1c0d1] border border-[#3b7a8c]/40">
                  Dành Cho BGK
                </span>
              </div>
              <p className="text-xs text-[#a1c0d1] mt-0.5">
                Dữ liệu khách hàng đăng ký tư vấn được lưu trực tiếp trên LocalStorage thiết bị
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng quản trị"
            className="w-9 h-9 rounded-full bg-[#0f383f] hover:bg-[#1f4f5a] text-white border border-[#1f4f5a] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Export CSV, Clear data, Refresh) */}
        <div className="px-6 py-3.5 border-b border-[#a1c0d1]/40 bg-[#f0f4f8] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#1f4f5a] font-medium">
            <UserCheck className="w-4 h-4 text-[#3b7a8c]" />
            <span>Tổng cộng: <strong className="text-[#00203d]">{leads.length}</strong> khách hàng</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLeads}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#a1c0d1] bg-white text-[#1f4f5a] hover:bg-[#f0f4f8] transition-colors"
              title="Tải lại danh sách"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#3b7a8c]" />
              <span>Làm mới</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3b7a8c] hover:bg-[#2e5e73] text-white font-medium transition-colors disabled:opacity-50 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#f0f4f8]" />
              <span>Xuất file CSV</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
                confirmClear
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'border-rose-200 text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmClear ? 'Bấm lần nữa để xóa hết' : 'Xóa dữ liệu test'}</span>
            </button>
          </div>
        </div>

        {/* Leads Table Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {leads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#6b99ab]">
              <Database className="w-12 h-12 stroke-[1.5] mb-3 text-[#a1c0d1]" />
              <p className="text-base font-semibold text-[#00203d]">Chưa có thông tin khách hàng nào</p>
              <p className="text-xs text-[#1f4f5a] mt-1 max-w-sm">
                Hãy gửi form tư vấn từ màn hình chính để thấy thông tin xuất hiện ngay tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead, idx) => {
                const dateFormatted = new Date(lead.createdAt).toLocaleString('vi-VN');
                return (
                  <div
                    key={lead.id || idx}
                    className="p-5 rounded-2xl border border-[#a1c0d1]/60 bg-white hover:border-[#3b7a8c] transition-all shadow-subtle space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-[#00203d]">
                            {lead.fullName}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f0f4f8] text-[#0f383f] border border-[#a1c0d1]">
                            Gói: {lead.packageName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#1f4f5a] flex-wrap">
                          <span className="flex items-center gap-1 text-[#2e5e73] font-semibold">
                            <Phone className="w-3.5 h-3.5 text-[#3b7a8c]" /> {lead.phone}
                          </span>
                          {lead.email && (
                            <span className="flex items-center gap-1 text-[#1f4f5a]">
                              <Mail className="w-3.5 h-3.5 text-[#6b99ab]" /> {lead.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[#6b99ab]">
                            <Calendar className="w-3.5 h-3.5" /> {dateFormatted}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold text-[#00203d]">
                          {lead.packagePrice}
                        </div>
                        <div className="text-[11px] text-[#6b99ab] font-medium">
                          Ngân sách: {lead.budget}
                        </div>
                      </div>
                    </div>

                    {/* Metadata details: Tên miền và ghi chú */}
                    <div className="pt-2 border-t border-[#f0f4f8] flex flex-wrap gap-2 text-xs">
                      {lead.domainIdea && lead.domainIdea !== 'Chưa chọn' && (
                        <div className="bg-[#f0f4f8] px-2.5 py-1 rounded-lg border border-[#a1c0d1]/60 text-[#1f4f5a]">
                          Tên miền: <strong className="font-mono text-[#00203d]">{lead.domainIdea}</strong>
                        </div>
                      )}
                      {lead.note && (
                        <div className="bg-[#f0f4f8] px-2.5 py-1 rounded-lg border border-[#a1c0d1]/60 text-[#1f4f5a] flex-1 min-w-[200px]">
                          Ghi chú: <span className="italic text-[#1f4f5a]/90">{lead.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#a1c0d1]/40 bg-[#f0f4f8] text-center text-xs text-[#1f4f5a] flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#3b7a8c]" />
          <span>Hệ thống lưu trữ độc lập trên Client (LocalStorage), đảm bảo dữ liệu không bị thất thoát khi kiểm thử.</span>
        </div>
      </div>
    </div>
  );
};

export default LeadsDrawer;
