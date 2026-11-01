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
      className="fixed inset-0 z-50 overflow-hidden bg-[#111827]/75 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col border-l border-gray-200 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111827]">
                  Quản Trị Khách Hàng (Leads Store)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                  Dành Cho BGK
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Dữ liệu khách hàng đăng ký tư vấn được lưu trực tiếp trên LocalStorage thiết bị
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng quản trị"
            className="w-9 h-9 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Export CSV, Clear data, Refresh) */}
        <div className="px-6 py-3.5 border-b border-gray-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Tổng cộng: <strong className="text-[#111827]">{leads.length}</strong> khách hàng</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLeads}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
              title="Tải lại danh sách"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm mới</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] text-white font-medium hover:bg-[#1F2937] transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất file CSV</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
                confirmClear
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-red-200 text-red-600 hover:bg-red-50'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmClear ? 'Bấm lần nữa để xóa hết' : 'Xóa dữ liệu test'}</span>
            </button>
          </div>
        </div>

        {/* Leads Table Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {leads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <Database className="w-12 h-12 stroke-[1.5] mb-3 text-gray-300" />
              <p className="text-base font-semibold text-gray-700">Chưa có thông tin khách hàng nào</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
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
                    className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-all shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-[#111827]">
                            {lead.fullName}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-[#111827]">
                            Gói: {lead.packageName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <Phone className="w-3.5 h-3.5" /> {lead.phone}
                          </span>
                          {lead.email && (
                            <span className="flex items-center gap-1 text-gray-600">
                              <Mail className="w-3.5 h-3.5" /> {lead.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-gray-400">
                            <Calendar className="w-3.5 h-3.5" /> {dateFormatted}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold text-[#111827]">
                          {lead.packagePrice}
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium">
                          Ngân sách: {lead.budget}
                        </div>
                      </div>
                    </div>

                    {/* Metadata details: Tên miền và ghi chú */}
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2 text-xs">
                      {lead.domainIdea && lead.domainIdea !== 'Chưa chọn' && (
                        <div className="bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700">
                          Tên miền: <strong className="font-mono text-[#111827]">{lead.domainIdea}</strong>
                        </div>
                      )}
                      {lead.note && (
                        <div className="bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 flex-1 min-w-[200px]">
                          Ghi chú: <span className="italic text-gray-600">{lead.note}</span>
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
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-gray-400" />
          <span>Hệ thống lưu trữ độc lập trên Client (LocalStorage), đảm bảo dữ liệu không bị thất thoát khi kiểm thử.</span>
        </div>
      </div>
    </div>
  );
};

export default LeadsDrawer;
