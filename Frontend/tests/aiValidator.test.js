import { describe, expect, it } from 'vitest';
import { validateAIResponse } from '../src/shared/aiValidator.js';

const survey = { productCount: '30-100', websiteCount: '1', techSkill: 'beginner', shopName: 'Gốm Xinh', websiteType: 'ecommerce', traffic: '5k-20k', budget: 150000, needsDomain: true, domainIdea: 'gomxinh' };

const aiResponse = {
  bestMatchId: 'standard',
  alternativeIds: ['entry', 'pro'],
  headline: 'Gói Đồng hành vừa đủ cho shop',
  reasons: ['Đủ chỗ cho ảnh sản phẩm.', 'Phục vụ được lượng khách của bạn.'],
  domainExtension: 'vn',
  domainAdvice: 'Đuôi .vn tạo niềm tin với khách Việt.'
};

describe('validateAIResponse', () => {
  it('chấp nhận phản hồi đúng và tự tính chi phí từ danh mục', () => {
    const { isValid, data } = validateAIResponse({ ...aiResponse, priceYearly: 1 }, survey);
    expect(isValid).toBe(true);
    expect(data.isFallback).toBe(false);
    expect(data.domainRecommendation.suggestedDomain).toBe('gomxinh.vn');
    expect(data.costSummary.totalFirstYear).toBe(1188000 + 450000);
  });

  it.each([
    ['không phải object', null],
    ['gói không tồn tại', { ...aiResponse, bestMatchId: 'hacker-plan' }],
    ['thiếu gói thay thế', { ...aiResponse, alternativeIds: ['entry'] }],
    ['gói thay thế là chuỗi', { ...aiResponse, alternativeIds: 'entry,pro' }],
    ['gói thay thế không tồn tại', { ...aiResponse, alternativeIds: ['entry', 'x'] }],
    ['gói thay thế trùng nhau', { ...aiResponse, alternativeIds: ['pro', 'pro'] }],
    ['gói thay thế trùng gói tốt nhất', { ...aiResponse, alternativeIds: ['standard', 'pro'] }],
    ['thiếu lý do', { ...aiResponse, reasons: [] }],
    ['lý do không phải chuỗi', { ...aiResponse, reasons: ['ok', 42] }],
    ['lý do chứa link', { ...aiResponse, reasons: ['ok', 'Xem tại https://abc.vn'] }],
    ['lý do chứa mã HTML', { ...aiResponse, reasons: ['ok', '<img src=x>'] }],
    ['đuôi tên miền lạ', { ...aiResponse, domainExtension: 'xyz' }]
  ])('từ chối: %s', (_label, response) => {
    expect(validateAIResponse(response, survey).isValid).toBe(false);
  });

  it('từ chối gói quá nhỏ so với lượng khách', () => {
    const response = { ...aiResponse, bestMatchId: 'entry', alternativeIds: ['standard', 'pro'] };
    expect(validateAIResponse(response, survey).isValid).toBe(false);
  });

  it('từ chối gói vượt ngân sách khi gói nhỏ hơn vẫn đủ', () => {
    const response = { ...aiResponse, bestMatchId: 'pro', alternativeIds: ['entry', 'standard'] };
    expect(validateAIResponse(response, survey).isValid).toBe(false);
  });

  it('từ chối gói không chạy đủ số website cần', () => {
    expect(validateAIResponse(aiResponse, { ...survey, websiteCount: '2-3' }).isValid).toBe(false);
  });

  it('chấp nhận gói tối thiểu vượt ngân sách và kèm cảnh báo', () => {
    const { isValid, data } = validateAIResponse(aiResponse, { ...survey, budget: 60000 });
    expect(isValid).toBe(true);
    expect(data.budgetNote.gap).toBe(39000);
  });

  it('không mua tên miền thì không tính phí tên miền', () => {
    const { data } = validateAIResponse(aiResponse, { ...survey, needsDomain: false });
    expect(data.domainRecommendation).toBeNull();
    expect(data.costSummary.totalFirstYear).toBe(1188000);
  });
});
