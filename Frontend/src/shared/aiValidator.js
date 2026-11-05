/**
 * AI RESPONSE VALIDATOR - HOSTWISE AI
 * Kiểm tra cấu trúc và tính hợp lệ của dữ liệu phản hồi từ Gemini API.
 * AI chỉ được chọn gói và viết lời giải thích; giá tiền luôn lấy từ danh mục nội bộ.
 */

import { HOSTING_PACKAGES, DOMAIN_PRICING, getPackageById } from './packages.js';
import { buildCostSummary, buildDomainRecommendation, getBudgetNote, getMinimumPackageIndex } from './ruleEngine.js';

const MAX_HEADLINE_LENGTH = 120;
const MAX_TEXT_LENGTH = 300;

const invalid = (error) => ({ isValid: false, error });

// Chặn link và mã HTML để AI không chèn nội dung lạ vào giao diện
const UNSAFE_TEXT = /https?:\/\/|www\.|<[^>]*>/i;

const cleanText = (value, maxLength) => {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text && text.length <= maxLength && !UNSAFE_TEXT.test(text) ? text : null;
};

export const validateAIResponse = (data, formData) => {
  if (!data || typeof data !== 'object') {
    return invalid('Dữ liệu phản hồi rỗng hoặc không đúng định dạng JSON');
  }

  const bestMatch = getPackageById(data.bestMatchId);
  if (!bestMatch) {
    return invalid(`Gói tối ưu không có trong danh mục: ${data.bestMatchId}`);
  }

  const alternativeIds = Array.isArray(data.alternativeIds) ? data.alternativeIds : [];
  const alternatives = alternativeIds.map(getPackageById);
  const uniqueIds = new Set([data.bestMatchId, ...alternativeIds]);
  if (alternatives.length !== 2 || alternatives.some(pkg => !pkg) || uniqueIds.size !== 3) {
    return invalid('Cần đúng 2 gói thay thế hợp lệ và khác gói tối ưu');
  }

  // Chặn gợi ý sai nghiệp vụ: gói quá nhỏ so với lượng khách, hoặc vượt ngân sách không cần thiết
  const budget = Number(formData.budget);
  const bestIndex = HOSTING_PACKAGES.indexOf(bestMatch);
  const minimumIndex = getMinimumPackageIndex(formData.traffic);
  if (bestIndex < minimumIndex) {
    return invalid('Gói được chọn quá nhỏ so với lượng khách dự kiến');
  }
  if (bestMatch.priceMonthly > budget && bestIndex !== minimumIndex) {
    return invalid('Gói được chọn vượt ngân sách trong khi có gói nhỏ hơn vẫn đáp ứng được');
  }

  const reasons = Array.isArray(data.reasons) ? data.reasons.map(reason => cleanText(reason, MAX_TEXT_LENGTH)) : [];
  if (reasons.length < 2 || reasons.length > 5 || reasons.some(reason => !reason)) {
    return invalid('Cần từ 2 đến 5 lý do giải thích hợp lệ');
  }

  const extensionKey = data.domainExtension === 'com' ? 'com' : 'vn';
  if (formData.needsDomain && !DOMAIN_PRICING[data.domainExtension]) {
    return invalid('Đuôi tên miền AI đề xuất không được hỗ trợ');
  }

  const domainRecommendation = buildDomainRecommendation(
    formData,
    extensionKey,
    cleanText(data.domainAdvice, MAX_TEXT_LENGTH)
  );

  return {
    isValid: true,
    data: {
      isFallback: false,
      provider: data.provider || 'AI Gemini',
      analysisTimestamp: new Date().toISOString(),
      bestMatch,
      alternatives,
      headline: cleanText(data.headline, MAX_HEADLINE_LENGTH) || `Gói ${bestMatch.name} là lựa chọn phù hợp cho bạn`,
      reasons,
      budgetNote: getBudgetNote(bestMatch, budget),
      domainRecommendation,
      costSummary: buildCostSummary(bestMatch, domainRecommendation)
    }
  };
};
