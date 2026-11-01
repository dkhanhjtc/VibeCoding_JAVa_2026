/**
 * HOSTING PACKAGES CATALOG - HOSTWISE AI
 * Phục vụ tư vấn chọn gói hosting cho chủ shop online nhỏ & doanh nghiệp
 */

export const HOSTING_PACKAGES = [
  {
    id: 'entry',
    name: 'Khởi đầu',
    tagline: 'Cho bước khởi đầu nhỏ',
    priceMonthly: 59000,
    priceYearly: 708000,
    renewalMonthly: 79000,
    renewalYearly: 948000,
    storage: '5 GB NVMe',
    traffic: '2.000 - 5.000 lượt/tháng',
    websites: 1,
    ssl: 'Miễn phí · tự gia hạn',
    backup: 'Mỗi tuần · giữ 7 ngày',
    support: 'Chat giờ hành chính',
    suitableFor: 'Shop mới thử bán, ít hình ảnh',
    recommendedFor: ['blog', 'newbie'],
    popular: false,
    features: [
      'Ổ cứng 5 GB NVMe siêu tốc',
      'Phù hợp ~3.000 lượt truy cập/tháng',
      'Chạy 1 website duy nhất',
      'Chứng chỉ bảo mật SSL miễn phí',
      'Sao lưu tự động hàng tuần',
      'Hỗ trợ kỹ thuật giờ hành chính'
    ]
  },
  {
    id: 'standard',
    name: 'Đồng hành',
    tagline: 'Vừa vặn với shop của bạn',
    priceMonthly: 99000,
    priceYearly: 1188000,
    renewalMonthly: 129000,
    renewalYearly: 1548000,
    storage: '15 GB NVMe',
    traffic: '10.000 - 20.000 lượt/tháng',
    websites: 1,
    ssl: 'Miễn phí · tự gia hạn',
    backup: 'Mỗi ngày · giữ 14 ngày',
    support: 'Chat 24/7',
    suitableFor: 'Shop nhỏ bán ổn định, WooCommerce',
    recommendedFor: ['ecommerce', 'growth'],
    popular: true, // Thường là Best Match
    features: [
      'Ổ cứng 15 GB NVMe tốc độ cao',
      'Tải mượt 10.000 - 20.000 khách/tháng',
      'Tối ưu riêng cho WordPress / WooCommerce',
      'Chứng chỉ bảo mật SSL Let\'s Encrypt',
      'Sao lưu mỗi ngày · Lưu trữ 14 ngày',
      'Hỗ trợ trực tuyến 24/7 giải quyết ngay'
    ]
  },
  {
    id: 'pro',
    name: 'Phát triển',
    tagline: 'Dành cho shop quy mô lớn',
    priceMonthly: 179000,
    priceYearly: 2148000,
    renewalMonthly: 229000,
    renewalYearly: 2748000,
    storage: '30 GB NVMe',
    traffic: '30.000 - 50.000 lượt/tháng',
    websites: 3,
    ssl: 'Miễn phí · tự gia hạn',
    backup: 'Mỗi ngày · giữ 30 ngày',
    support: 'Chat ưu tiên 24/7',
    suitableFor: 'Shop mở rộng nhiều kênh, chạy quảng cáo',
    recommendedFor: ['company', 'ads'],
    popular: false,
    features: [
      'Ổ cứng 30 GB NVMe cao cấp',
      'Chịu tải chiến dịch Ads 30.000 - 50.000 khách',
      'Chạy đồng thời đến 3 website',
      'Sao lưu hàng ngày · Giữ 30 ngày an tâm',
      'Bảo vệ chống DDoS tự động',
      'Kênh hỗ trợ ưu tiên phản hồi dưới 5 phút'
    ]
  },
  {
    id: 'turbo',
    name: 'Tăng tốc',
    tagline: 'Sức mạnh Cloud dành cho Brand',
    priceMonthly: 299000,
    priceYearly: 3588000,
    renewalMonthly: 349000,
    renewalYearly: 4188000,
    storage: '60 GB NVMe',
    traffic: '50.000 - 100.000 lượt/tháng',
    websites: 5,
    ssl: 'Miễn phí · tự gia hạn',
    backup: 'Mỗi ngày · giữ 30 ngày',
    support: 'Chuyên viên riêng 24/7',
    suitableFor: 'Thương hiệu lớn, sàn thương mại mini',
    recommendedFor: ['enterprise'],
    popular: false,
    features: [
      'Ổ cứng 60 GB NVMe Enterprise',
      'Cấu hình Cloud Dedicated vCPU & RAM riêng',
      'Chạy đến 5 website',
      'Sao lưu 2 lần/ngày · Giữ 30 ngày',
      'Hạ tầng cân bằng tải LiteSpeed Web Server',
      'Chuyên viên kỹ thuật riêng đồng hành'
    ]
  },
  {
    id: 'enterprise',
    name: 'Doanh nghiệp',
    tagline: 'Hạ tầng Cloud độc lập tối đa',
    priceMonthly: 499000,
    priceYearly: 5988000,
    renewalMonthly: 549000,
    renewalYearly: 6588000,
    storage: '120 GB NVMe Enterprise',
    traffic: '>100.000 lượt/tháng',
    websites: 10,
    ssl: 'Miễn phí · tự gia hạn',
    backup: 'Realtime snapshot',
    support: 'Hotline VIP 24/7',
    suitableFor: 'Chuỗi bán lẻ & Doanh nghiệp lớn',
    recommendedFor: ['enterprise'],
    popular: false,
    features: [
      '120 GB NVMe Enterprise siêu phân luồng',
      'Không giới hạn lưu lượng truy cập',
      'IP tĩnh riêng biệt (Dedicated IP)',
      'Snapshot sao lưu tức thì',
      'Cam kết SLA 99.99% Uptime',
      'Hỗ trợ kỹ thuật qua Hotline VIP riêng'
    ]
  }
];

export const DOMAIN_PRICING = {
  vn: {
    extension: '.vn',
    label: 'Tên miền Quốc gia Việt Nam',
    priceYearly: 450000,
    renewalYearly: 550000,
    recommendedFor: 'Bán hàng tại Việt Nam, tăng độ uy tín với khách hàng nội địa và được ưu tiên SEO Google tại VN.'
  },
  com: {
    extension: '.com',
    label: 'Tên miền Thương mại Quốc tế',
    priceYearly: 280000,
    renewalYearly: 350000,
    recommendedFor: 'Phổ biến toàn cầu, quen thuộc, chi phí tiết kiệm, phù hợp kinh doanh quốc tế lẫn trong nước.'
  }
};

export const getPackageById = (id) => {
  return HOSTING_PACKAGES.find(pkg => pkg.id === id) || HOSTING_PACKAGES[1]; // default standard
};

