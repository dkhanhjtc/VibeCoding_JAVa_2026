/**
 * LEADS STORE SERVICE - HOSTWISE AI
 * Quản lý danh sách khách hàng tiềm năng bằng LocalStorage & Xuất CSV
 */

const STORAGE_KEY = 'leads_data';

// Bọc ô CSV an toàn: escape dấu ", chặn Excel hiểu nội dung người dùng nhập thành công thức
const toCsvCell = (value) => {
  const text = String(value ?? '');
  const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
};

export const getLeads = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading leads from localStorage:', error);
    return [];
  }
};

export const saveLead = (leadInput) => {
  try {
    const existing = getLeads();
    const newLead = {
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString(),
      fullName: leadInput.fullName || '',
      phone: leadInput.phone || '',
      email: leadInput.email || '',
      packageName: leadInput.packageName || 'Đồng hành',
      packagePrice: leadInput.packagePrice || '99.000đ/tháng',
      budget: leadInput.budget ? `${Number(leadInput.budget).toLocaleString('vi-VN')}đ/tháng` : '150.000đ/tháng',
      domainIdea: leadInput.domainIdea || 'Chưa chọn',
      note: leadInput.note || ''
    };

    const updated = [newLead, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLead;
  } catch (error) {
    console.error('Error saving lead:', error);
    throw error;
  }
};

export const clearTestLeads = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (error) {
    console.error('Error clearing leads:', error);
    return [];
  }
};

export const exportLeadsToCSV = () => {
  const leads = getLeads();
  if (!leads || leads.length === 0) {
    alert('Chưa có dữ liệu khách hàng nào để xuất file!');
    return false;
  }

  // Tiêu đề cột
  const headers = ['Thời gian', 'Họ và tên', 'Số điện thoại', 'Email', 'Gói hosting', 'Giá gói', 'Ngân sách', 'Tên miền', 'Ghi chú'];
  
  // Format từng dòng CSV
  const rows = leads.map(l => {
    const dateStr = new Date(l.createdAt).toLocaleString('vi-VN');
    return [
      dateStr,
      l.fullName,
      l.phone,
      l.email,
      l.packageName,
      l.packagePrice,
      l.budget,
      l.domainIdea,
      l.note
    ].map(toCsvCell).join(',');
  });

  // UTF-8 BOM (\uFEFF) giúp Excel trên Windows hiển thị đúng 100% tiếng Việt
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `hostwise_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return true;
};

