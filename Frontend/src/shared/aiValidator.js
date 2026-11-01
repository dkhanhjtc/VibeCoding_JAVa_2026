/**
 * AI RESPONSE VALIDATOR - HOSTWISE AI
 * Kiểm tra cấu trúc và tính hợp lệ của dữ liệu phản hồi từ Gemini API
 */

import { getPackageById } from './packages.js';

export const validateAIResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Dữ liệu phản hồi rỗng hoặc không đúng định dạng JSON' };
  }

  // Phải có bestMatch hoặc bestMatchId
  let bestMatch = data.bestMatch;
  if (!bestMatch && data.bestMatchId) {
    bestMatch = getPackageById(data.bestMatchId);
  }

  if (!bestMatch || !bestMatch.id) {
    return { isValid: false, error: 'Thiếu thông tin gói tối ưu (bestMatch)' };
  }

  // Chuẩn hóa alternatives
  let alternatives = data.alternatives || [];
  if (alternatives.length === 0 && data.alternativeIds && Array.isArray(data.alternativeIds)) {
    alternatives = data.alternativeIds.map(id => getPackageById(id));
  }

  return {
    isValid: true,
    data: {
      isFallback: false,
      provider: data.provider || 'AI Gemini 1.5 Pro',
      bestMatch,
      alternatives,
      headline: data.headline || `${bestMatch.name} là lựa chọn tối ưu cho bạn`,
      reasons: Array.isArray(data.reasons) && data.reasons.length > 0 ? data.reasons : [
        `Gói ${bestMatch.name} đáp ứng chuẩn xác nhu cầu dung lượng và lưu lượng truy cập dự kiến.`,
        `Tối ưu ngân sách đầu tư ban đầu mà vẫn đảm bảo tốc độ tải trang nhanh và ổn định.`
      ],
      domainRecommendation: data.domainRecommendation || {
        suggestedDomain: 'shopcuaban.vn',
        extension: '.vn',
        advice: 'Tên miền .vn giúp tăng độ tin cậy và nhận diện thương hiệu tại Việt Nam.'
      },
      costSummary: data.costSummary || {
        monthlyHosting: bestMatch.priceMonthly,
        yearlyHosting: bestMatch.priceYearly,
        yearlyDomain: 450000,
        totalFirstYear: bestMatch.priceYearly + 450000,
        totalRenewalYear: bestMatch.renewalYearly + 550000
      }
    }
  };
};

