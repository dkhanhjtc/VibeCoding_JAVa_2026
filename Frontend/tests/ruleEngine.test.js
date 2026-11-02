import { describe, expect, it } from 'vitest';
import { HOSTING_PACKAGES } from '../src/shared/packages.js';
import { calculateRecommendation, normalizeDomainName, TRAFFIC_TIERS } from '../src/shared/ruleEngine.js';

const TRAFFICS = Object.keys(TRAFFIC_TIERS);
const WEBSITE_TYPES = ['ecommerce', 'company', 'blog'];
const BUDGETS = [30000, 50000, 100000, 150000, 250000, 299000, 500000, 1000000];

const allSurveys = TRAFFICS.flatMap(traffic => WEBSITE_TYPES.flatMap(websiteType => (
  BUDGETS.map(budget => ({ traffic, websiteType, budget, needsDomain: true, domainIdea: 'gomxinh' }))
)));

describe('calculateRecommendation', () => {
  it.each(allSurveys)('luôn trả 1 gói tốt nhất + 2 gói thay thế khác nhau: %o', (survey) => {
    const { bestMatch, alternatives } = calculateRecommendation(survey);
    const ids = [bestMatch.id, ...alternatives.map(pkg => pkg.id)];
    expect(new Set(ids).size).toBe(3);
  });

  it.each(allSurveys)('vượt ngân sách thì có cảnh báo, không vượt thì không: %o', (survey) => {
    const { bestMatch, budgetNote } = calculateRecommendation(survey);
    expect(Boolean(budgetNote)).toBe(bestMatch.priceMonthly > survey.budget);
  });

  it('không chọn gói vượt ngân sách khi gói nhỏ hơn đã đủ lượng khách', () => {
    const result = calculateRecommendation({ traffic: '20k-100k', websiteType: 'company', budget: 250000 });
    expect(result.bestMatch.id).toBe('pro');
    expect(result.budgetNote).toBeNull();
  });

  it('ngân sách đủ thì nâng lên gói thoải mái hơn', () => {
    const result = calculateRecommendation({ traffic: '20k-100k', websiteType: 'company', budget: 299000 });
    expect(result.bestMatch.id).toBe('turbo');
  });

  it('thiếu ngân sách vẫn giữ gói tối thiểu và đưa ra gói vừa túi tiền', () => {
    const result = calculateRecommendation({ traffic: '>100k', websiteType: 'ecommerce', budget: 100000 });
    expect(result.bestMatch.id).toBe('turbo');
    expect(result.budgetNote.gap).toBe(199000);
    expect(result.alternatives.map(pkg => pkg.id)).toContain('standard');
  });

  it('shop bán hàng ít khách được ưu tiên gói có sao lưu hằng ngày nếu đủ tiền', () => {
    const survey = { traffic: '<5k', websiteType: 'ecommerce' };
    expect(calculateRecommendation({ ...survey, budget: 150000 }).bestMatch.id).toBe('standard');
    expect(calculateRecommendation({ ...survey, budget: 60000 }).bestMatch.id).toBe('entry');
  });

  it('blog không bị đẩy lên gói lớn hơn dù ngân sách dư', () => {
    const result = calculateRecommendation({ traffic: '<5k', websiteType: 'blog', budget: 1000000 });
    expect(result.bestMatch.id).toBe('entry');
  });

  it('không mua tên miền thì không cộng tiền tên miền', () => {
    const result = calculateRecommendation({ traffic: '5k-20k', websiteType: 'ecommerce', budget: 150000, needsDomain: false });
    expect(result.domainRecommendation).toBeNull();
    expect(result.costSummary.totalFirstYear).toBe(result.bestMatch.priceYearly);
  });

  it('mua tên miền thì tổng chi phí năm đầu gồm cả tên miền', () => {
    const result = calculateRecommendation({ traffic: '5k-20k', websiteType: 'ecommerce', budget: 150000, needsDomain: true, domainIdea: 'mayhandmade.vn' });
    expect(result.domainRecommendation.suggestedDomain).toBe('mayhandmade.vn');
    expect(result.costSummary.totalFirstYear).toBe(1188000 + 450000);
  });

  it('giá gói theo năm khớp danh mục', () => {
    for (const pkg of HOSTING_PACKAGES) {
      expect(pkg.priceYearly).toBe(pkg.priceMonthly * 12);
    }
  });
});

describe('normalizeDomainName', () => {
  it.each([
    ['mayhandmade.vn', '', 'mayhandmade'],
    ['www.GomXinh.com.vn', '', 'gomxinh'],
    ['', 'Mây Handmade', 'mayhandmade'],
    ['', 'Đồ Gốm Đẹp', 'dogomdep'],
    ['', '', 'shopcuaban']
  ])('%s + %s -> %s', (idea, shopName, expected) => {
    expect(normalizeDomainName(idea, shopName)).toBe(expected);
  });
});
