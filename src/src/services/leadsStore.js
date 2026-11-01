/**
 * LEADS STORE SERVICE - HOSTWISE AI
 * Quản lý danh sách khách hàng tiềm năng bằng LocalStorage & Xuất CSV
 */

const STORAGE_KEY = 'leads_data';

// Dữ liệu mẫu ban đầu để BGK dễ dàng nghiệm thu tính năng ngay lập tức
const INITIAL_SAMPLE_LEADS = [
  {
    id: 'lead-1',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    fullName: 'Nguyễn Khánh Linh',
    phone: '0901234567',
    email: 'linh.mayhandmade@gmail.com',
    packageName: 'Đồng hành',
    packagePrice: '99.000đ/tháng',
    budget: '150.000đ/tháng',
    domainIdea: 'mayhandmade.vn',
    note: 'Tư vấn thêm về cổng thanh toán online và cài đặt WooCommerce.'
  },
  {
    id: 'lead-2',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    fullName: 'Trần Minh Quân',
    phone: '0987654321',
    email: 'quan.ceramics@gmail.com',
    packageName: 'Phát triển',
    packagePrice: '179.000đ/tháng',
    budget: '250.000đ/tháng',
    domainIdea: 'gomquangnam.vn',
    note: 'Cần hỗ trợ chuyển website WordPress từ nhà cung cấp cũ sang.'
  }
];

export const getLeads = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Khởi tạo dữ liệu mẫu lần đầu nếu chưa có
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LEADS));
      return INITIAL_SAMPLE_LEADS;
    }
    return JSON.parse(raw);
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
      `"${dateStr}"`,
      `"${(l.fullName || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.packageName || ''}"`,
      `"${l.packagePrice || ''}"`,
      `"${l.budget || ''}"`,
      `"${l.domainIdea || ''}"`,
      `"${(l.note || '').replace(/"/g, '""')}"`
    ].join(',');
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

