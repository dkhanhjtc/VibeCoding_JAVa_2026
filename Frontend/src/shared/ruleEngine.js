/**
 * RULE ENGINE & FALLBACK RECOMMENDATION - HOSTWISE AI
 * Thuật toán tính toán đề xuất gói tối ưu & cơ chế dự phòng an toàn
 */

import { HOSTING_PACKAGES, DOMAIN_PRICING, getPackageById } from './packages.js';

// minId: gói nhỏ nhất còn chịu được lượng khách; comfortId: gói nên dùng nếu ngân sách cho phép
export const TRAFFIC_TIERS = {
  '<5k': { label: 'dưới 5.000', minId: 'entry', comfortId: 'entry' },
  '5k-20k': { label: '5.000 - 20.000', minId: 'standard', comfortId: 'standard' },
  '20k-100k': { label: '20.000 - 100.000', minId: 'pro', comfortId: 'turbo' },
  '>100k': { label: 'trên 100.000', minId: 'turbo', comfortId: 'enterprise' }
};

const STORAGE_REASONS = {
  ecommerce: 'đủ chứa ảnh sản phẩm và dữ liệu đơn hàng của shop',
  company: 'đủ cho các trang giới thiệu, hình ảnh và hồ sơ công ty',
  blog: 'đủ cho bài viết và hình ảnh minh họa',
  other: 'đủ cho nội dung và hình ảnh của website'
};

// Số website tối đa trong mỗi khoảng lựa chọn của form
const WEBSITE_COUNT_NEEDS = { '1': 1, '2-3': 3, '4-5': 5 };

const formatVnd = (value) => Number(value).toLocaleString('vi-VN');

const packageIndex = (id) => HOSTING_PACKAGES.findIndex(pkg => pkg.id === id);

export const getWebsitesNeeded = ({ websiteCount, websiteCountCustom } = {}) => {
  if (websiteCount === '>5') return Number(websiteCountCustom) || 6;
  return WEBSITE_COUNT_NEEDS[websiteCount] || 1;
};

// Gói nhỏ nhất vừa chịu được lượng khách vừa chạy đủ số website
export const getMinimumPackageIndex = (traffic, websitesNeeded = 1) => {
  const trafficIndex = packageIndex((TRAFFIC_TIERS[traffic] || TRAFFIC_TIERS['5k-20k']).minId);
  const websitesIndex = HOSTING_PACKAGES.findIndex(pkg => pkg.websites >= websitesNeeded);
  return Math.max(trafficIndex, websitesIndex === -1 ? HOSTING_PACKAGES.length - 1 : websitesIndex);
};

const pickBestIndex = (traffic, websiteType, budget, websitesNeeded) => {
  const tier = TRAFFIC_TIERS[traffic] || TRAFFIC_TIERS['5k-20k'];
  const minimumIndex = getMinimumPackageIndex(traffic, websitesNeeded);
  // Shop bán hàng cần sao lưu hằng ngày và dung lượng ảnh nên tối thiểu là gói Đồng hành
  const comfortIndex = Math.max(packageIndex(tier.comfortId), websiteType === 'ecommerce' ? 1 : 0, minimumIndex);
  return HOSTING_PACKAGES[comfortIndex].priceMonthly <= budget ? comfortIndex : minimumIndex;
};

const pickAlternatives = (bestIndex, budget) => {
  const isOverBudget = HOSTING_PACKAGES[bestIndex].priceMonthly > budget;
  // Vượt ngân sách thì luôn đưa ra gói lớn nhất còn nằm trong ngân sách để chủ shop cân nhắc
  const affordableIndex = HOSTING_PACKAGES.findLastIndex(pkg => pkg.priceMonthly <= budget);
  const lowerIndex = isOverBudget && affordableIndex >= 0 ? affordableIndex : bestIndex - 1;

  const candidates = [lowerIndex, bestIndex + 1, bestIndex - 1, bestIndex + 2, bestIndex - 2];
  const picked = candidates.filter((index, position) => (
    HOSTING_PACKAGES[index] && index !== bestIndex && candidates.indexOf(index) === position
  ));
  return picked.slice(0, 2).map(index => HOSTING_PACKAGES[index]);
};

export const getBudgetNote = (pkg, budget) => {
  const gap = pkg.priceMonthly - budget;
  if (gap <= 0) return null;
  return {
    gap,
    message: `Gói này cao hơn ngân sách ${formatVnd(budget)}đ/tháng của bạn ${formatVnd(gap)}đ/tháng, vì đây là gói nhỏ nhất đủ cho lượng khách và số website bạn cần.`
  };
};

const toAsciiSlug = (text) => text
  .toLowerCase()
  .replace(/đ/g, 'd')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/^-+|-+$/g, '');

// Chỉ giữ phần tên: "www.mayhandmade.vn" -> "mayhandmade"; chưa có ý tưởng thì lấy theo tên shop
export const normalizeDomainName = (domainIdea = '', shopName = '') => {
  const nameOnly = domainIdea.trim().toLowerCase().replace(/^www\./, '').split('.')[0];
  return toAsciiSlug(nameOnly) || toAsciiSlug(shopName) || 'shopcuaban';
};

const DOMAIN_ADVICE = {
  vn: 'Vì bạn phục vụ khách hàng tại Việt Nam, đuôi tên miền .vn giúp khách hàng an tâm, tin cậy về nguồn gốc shop.',
  com: `Đuôi tên miền quốc tế .com có mức phí tiết kiệm (chỉ ${formatVnd(DOMAIN_PRICING.com.priceYearly)}đ/năm đầu), quen thuộc với mọi người dùng internet và dễ nhớ.`
};

export const buildDomainRecommendation = (formData, extensionKey, advice) => {
  if (!formData.needsDomain) return null;
  const pricing = DOMAIN_PRICING[extensionKey];
  return {
    suggestedDomain: `${normalizeDomainName(formData.domainIdea, formData.shopName)}${pricing.extension}`,
    extension: pricing.extension,
    priceYearly: pricing.priceYearly,
    renewalYearly: pricing.renewalYearly,
    advice: advice || DOMAIN_ADVICE[extensionKey]
  };
};

export const buildCostSummary = (pkg, domainRecommendation) => ({
  monthlyHosting: pkg.priceMonthly,
  yearlyHosting: pkg.priceYearly,
  yearlyDomain: domainRecommendation?.priceYearly || 0,
  totalFirstYear: pkg.priceYearly + (domainRecommendation?.priceYearly || 0),
  totalRenewalYear: pkg.renewalYearly + (domainRecommendation?.renewalYearly || 0)
});

export const calculateRecommendation = (formData) => {
  const { websiteType = 'ecommerce', traffic = '5k-20k', budget = 150000, needsDomain = true } = formData;
  const numBudget = Number(budget) || 150000;
  const tier = TRAFFIC_TIERS[traffic] || TRAFFIC_TIERS['5k-20k'];
  const websitesNeeded = getWebsitesNeeded(formData);

  const bestIndex = pickBestIndex(traffic, websiteType, numBudget, websitesNeeded);
  const bestPackage = HOSTING_PACKAGES[bestIndex];
  const budgetNote = getBudgetNote(bestPackage, numBudget);

  const headline = budgetNote
    ? `Gói ${bestPackage.name} là mức tối thiểu cho nhu cầu của bạn`
    : `Gói ${bestPackage.name} là vừa đủ. Chưa cần gói lớn hơn.`;

  // Phân tích lý do bình dân, dễ hiểu cho chủ shop
  const reasons = [
    `Bạn dự kiến ${tier.label} lượt khách mỗi tháng, gói này phục vụ được ${bestPackage.traffic}.`,
    `Dung lượng ${bestPackage.storage} ${STORAGE_REASONS[websiteType] || STORAGE_REASONS.ecommerce}.`,
    `Dữ liệu được sao lưu tự động (${bestPackage.backup.toLowerCase()}), lỡ thao tác nhầm vẫn khôi phục được.`
  ];
  if (websitesNeeded > 1) {
    reasons.splice(1, 0, `Bạn cần ${websitesNeeded} website, gói này chạy được tối đa ${bestPackage.websites} website.`);
  }
  if (!budgetNote) {
    reasons.push(`Chi phí ${formatVnd(bestPackage.priceMonthly)}đ/tháng nằm trong ngân sách ${formatVnd(numBudget)}đ/tháng của bạn.`);
  }

  const extensionKey = websiteType === 'blog' || numBudget < 100000 ? 'com' : 'vn';
  const domainRecommendation = buildDomainRecommendation({ ...formData, needsDomain }, extensionKey);

  return {
    isFallback: true,
    provider: 'RuleEngine v2.0 (HostWise Smart Algorithm)',
    analysisTimestamp: new Date().toISOString(),
    bestMatch: getPackageById(bestPackage.id),
    alternatives: pickAlternatives(bestIndex, numBudget),
    headline,
    reasons,
    budgetNote,
    domainRecommendation,
    costSummary: buildCostSummary(bestPackage, domainRecommendation)
  };
};
