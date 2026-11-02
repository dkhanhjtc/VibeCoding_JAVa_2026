import { describe, expect, it } from 'vitest';
import { validateConsultationForm, validateNeedsForm, validatePhoneNumber } from '../src/shared/validation.js';

const needs = { shopName: 'Gốm Xinh', websiteType: 'blog', traffic: '<5k', budget: 100000, needsDomain: true, domainIdea: 'gomxinh.com.vn' };

describe('validateNeedsForm', () => {
  it('chấp nhận dữ liệu đúng', () => {
    expect(validateNeedsForm(needs).isValid).toBe(true);
  });

  it.each([
    ['websiteType', { websiteType: '' }],
    ['websiteType', { websiteType: 'casino' }],
    ['traffic', { traffic: '' }],
    ['traffic', { traffic: 'rất nhiều' }],
    ['budget', { budget: '' }],
    ['budget', { budget: -5 }],
    ['budget', { budget: 'abc' }],
    ['budget', { budget: 29999 }],
    ['budget', { budget: 2000000000 }],
    ['domainIdea', { domainIdea: 'shop của tôi' }],
    ['domainIdea', { domainIdea: `${'a'.repeat(64)}` }],
    ['shopName', { shopName: 'a'.repeat(61) }]
  ])('báo lỗi trường %s với %o', (field, override) => {
    expect(validateNeedsForm({ ...needs, ...override }).errors[field]).toBeTruthy();
  });

  it('không mua tên miền thì bỏ qua ý tưởng tên miền', () => {
    expect(validateNeedsForm({ ...needs, needsDomain: false, domainIdea: 'sai định dạng' }).isValid).toBe(true);
  });
});

describe('validatePhoneNumber', () => {
  it.each(['0901234567', '0351234567', '+84901234567', '090 123 4567', '090.123.4567'])('chấp nhận %s', (phone) => {
    expect(validatePhoneNumber(phone).isValid).toBe(true);
  });

  it.each(['', '123', '0101234567', '09012345678', 'abcdefghij', null])('từ chối %s', (phone) => {
    expect(validatePhoneNumber(phone).isValid).toBe(false);
  });
});

describe('validateConsultationForm', () => {
  it('email để trống vẫn hợp lệ', () => {
    expect(validateConsultationForm({ fullName: 'An', phone: '0901234567', email: '' }).isValid).toBe(true);
  });

  it('báo lỗi tên, số điện thoại và email sai', () => {
    const { errors } = validateConsultationForm({ fullName: ' ', phone: '123', email: 'a"b' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'fullName', 'phone']);
  });
});
