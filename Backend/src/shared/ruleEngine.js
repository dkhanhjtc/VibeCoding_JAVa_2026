/**
 * RULE ENGINE & FALLBACK RECOMMENDATION - HOSTWISE AI
 * Thuật toán tính toán đề xuất gói tối ưu & cơ chế dự phòng an toàn
 */

import { HOSTING_PACKAGES, DOMAIN_PRICING, getPackageById } from './packages.js';

export const calculateRecommendation = (formData) => {
  const { websiteType = 'ecommerce', traffic = '5k-20k', budget = 150000, needsDomain = true, domainIdea = '' } = formData;
  const numBudget = Number(budget) || 150000;

  let bestMatchId = 'standard';
  let altIds = ['entry', 'pro'];

  // Quy tắc dựa trên traffic và websiteType
  if (traffic === '<5k') {
    if (numBudget < 90000 || websiteType === 'blog') {
      bestMatchId = 'entry';
      altIds = ['standard', 'pro'];
    } else {
      bestMatchId = 'standard';
      altIds = ['entry', 'pro'];
    }
  } else if (traffic === '5k-20k') {
    if (numBudget >= 160000 && websiteType === 'ecommerce') {
      bestMatchId = 'standard';
      altIds = ['entry', 'pro'];
    } else {
      bestMatchId = 'standard';
      altIds = ['entry', 'pro'];
    }
  } else if (traffic === '20k-100k') {
    if (numBudget >= 250000) {
      bestMatchId = 'turbo';
      altIds = ['pro', 'standard'];
    } else {
      bestMatchId = 'pro';
      altIds = ['standard', 'turbo'];
    }
  } else { // >100k
    bestMatchId = numBudget >= 400000 ? 'enterprise' : 'turbo';
    altIds = ['pro', 'enterprise'].filter(id => id !== bestMatchId);
    if (altIds.length < 2) altIds = ['standard', 'pro'];
  }

  const bestPackage = getPackageById(bestMatchId);
  const alternatives = altIds.map(id => getPackageById(id));

  // Phân tích lý do bình dân, dễ hiểu cho chủ shop
  let headline = `${bestPackage.name} là vừa đủ. Chưa cần gói lớn hơn.`;
  let reasons = [];

  if (bestPackage.id === 'entry') {
    headline = 'Gói Khởi Đầu là lựa chọn kinh tế nhất cho bạn';
    reasons = [
      `Dung lượng 5 GB NVMe vừa vặn cho website giới thiệu hoặc blog cá nhân ít ảnh dung lượng cao.`,
      `Đáp ứng tốt mức lưu lượng dưới 5.000 khách/tháng mà không lo tốn kém chi phí ban đầu.`,
      `Tiết kiệm ngân sách tối đa, chỉ ${bestPackage.priceMonthly.toLocaleString('vi-VN')}đ/tháng.`
    ];
  } else if (bestPackage.id === 'standard') {
    reasons = [
      `Dung lượng 15 GB NVMe thoải mái chứa 300 - 800 sản phẩm và hình ảnh bán hàng sắc nét.`,
      `Băng thông mượt mà cho 10.000 - 20.000 lượt khách ghé thăm/tháng mà không bị nghẽn giỏ hàng.`,
      `Sao lưu tự động mỗi ngày (giữ 14 ngày) – lỡ bấm nhầm thao tác vẫn khôi phục dữ liệu tức thì.`,
      `Hỗ trợ 24/7 trực tuyến giúp giải quyết sự cố kỹ thuật ngay trong đêm khi khách đang đặt hàng.`
    ];
  } else if (bestPackage.id === 'pro') {
    headline = 'Gói Phát Triển đáp ứng hoàn hảo cho shop có lượng truy cập cao';
    reasons = [
      `Ổ cứng 30 GB NVMe dư sức cho catalog sản phẩm đồ sộ và các chiến dịch quảng cáo TikTok/Facebook.`,
      `Chịu tải 30.000 - 50.000 khách đồng thời trong những ngày siêu sale mà web vẫn load dưới 1.5 giây.`,
      `Cho phép chạy tới 3 website riêng biệt (VD: 1 web bán lẻ + 1 web đại lý + 1 landing page).`
    ];
  } else {
    headline = `Gói ${bestPackage.name} mang lại hạ tầng Cloud mạnh mẽ nhất`;
    reasons = [
      `Hạ tầng tài nguyên độc lập, chịu tải trên 100.000 lượt truy cập/tháng.`,
      `Sao lưu đa điểm liên tục, bảo mật cấp độ doanh nghiệp và chống tấn công DDoS.`,
      `Chuyên viên hỗ trợ riêng đồng hành kỹ thuật mọi lúc.`
    ];
  }

  // Lời khuyên tên miền
  let cleanDomain = (domainIdea || 'shopcuaban').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!cleanDomain) cleanDomain = 'shopcuaban';

  let domainRecommendation = {
    suggestedDomain: `${cleanDomain}.vn`,
    extension: '.vn',
    priceYearly: DOMAIN_PRICING.vn.priceYearly,
    renewalYearly: DOMAIN_PRICING.vn.renewalYearly,
    advice: 'Vì bạn phục vụ khách hàng tại Việt Nam, đuôi tên miền .vn giúp khách hàng an tâm, tin cậy về nguồn gốc shop, đồng thời được Google ưu tiên hiển thị kết quả tìm kiếm tại khu vực VN.'
  };

  if (websiteType === 'blog' || numBudget < 100000) {
    domainRecommendation = {
      suggestedDomain: `${cleanDomain}.com`,
      extension: '.com',
      priceYearly: DOMAIN_PRICING.com.priceYearly,
      renewalYearly: DOMAIN_PRICING.com.renewalYearly,
      advice: 'Đuôi tên miền quốc tế .com có mức phí cực kỳ tiết kiệm (chỉ 280.000đ/năm đầu), quen thuộc với mọi người dùng internet và dễ nhớ.'
    };
  }

  return {
    isFallback: true,
    provider: 'RuleEngine v2.0 (HostWise Smart Algorithm)',
    analysisTimestamp: new Date().toISOString(),
    bestMatch: bestPackage,
    alternatives: alternatives,
    headline,
    reasons,
    domainRecommendation,
    costSummary: {
      monthlyHosting: bestPackage.priceMonthly,
      yearlyHosting: bestPackage.priceYearly,
      yearlyDomain: needsDomain ? domainRecommendation.priceYearly : 0,
      totalFirstYear: bestPackage.priceYearly + (needsDomain ? domainRecommendation.priceYearly : 0),
      totalRenewalYear: bestPackage.renewalYearly + (needsDomain ? domainRecommendation.renewalYearly : 0)
    }
  };
};

