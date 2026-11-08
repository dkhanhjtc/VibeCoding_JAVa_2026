/**
 * VALIDATION UTILITIES - HOSTWISE AI
 */

import { TRAFFIC_TIERS } from './ruleEngine.js';

const WEBSITE_TYPE_IDS = ['ecommerce', 'company', 'blog', 'other'];
const PRODUCT_COUNTS = ['<30', '30-100', '100-300', '>300'];
const WEBSITE_COUNTS = ['1', '2-3', '4-5', '>5'];
const TECH_SKILLS = ['beginner', 'intermediate', 'expert'];
const MIN_CUSTOM_WEBSITES = 6;
const MAX_CUSTOM_WEBSITES = 10;
const MAX_SHOP_NAME_LENGTH = 60;
const MAX_DOMAIN_LENGTH = 63;
const MAX_BUDGET = 1000000000;

/**
 * Kiểm tra tính hợp lệ của số điện thoại di động Việt Nam (10 số, đầu số hợp lệ)
 * Các đầu số hợp lệ: 03, 05, 07, 08, 09 (hoặc +843, +845, +847, +848, +849)
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Vui lòng nhập số điện thoại' };
  }

  const cleanPhone = phone.trim().replace(/[\s.-]/g, '');

  // Chuẩn hóa đầu số 84 hoặc 0
  const vnPhoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

  if (!vnPhoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'Số điện thoại không đúng định dạng di động 10 số Việt Nam (VD: 0901234567)'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate form khảo sát nhu cầu Hosting
 */
export const validateNeedsForm = (formData) => {
  const errors = {};

  if ((formData.shopName || '').trim().length > MAX_SHOP_NAME_LENGTH) {
    errors.shopName = `Tên shop tối đa ${MAX_SHOP_NAME_LENGTH} ký tự`;
  }

  if (!WEBSITE_TYPE_IDS.includes(formData.websiteType)) {
    errors.websiteType = 'Vui lòng chọn loại website bạn muốn làm';
  } else if (formData.websiteType === 'other') {
    const otherType = (formData.websiteTypeOther || '').trim();
    if (otherType.length < 2 || otherType.length > MAX_SHOP_NAME_LENGTH) {
      errors.websiteTypeOther = `Vui lòng nhập loại website (2 - ${MAX_SHOP_NAME_LENGTH} ký tự)`;
    }
  }

  if (!PRODUCT_COUNTS.includes(formData.productCount)) {
    errors.productCount = 'Vui lòng chọn số sản phẩm';
  }

  if (!WEBSITE_COUNTS.includes(formData.websiteCount)) {
    errors.websiteCount = 'Vui lòng chọn số website';
  } else if (formData.websiteCount === '>5') {
    const customCount = Number(formData.websiteCountCustom);
    if (!Number.isInteger(customCount) || customCount < MIN_CUSTOM_WEBSITES || customCount > MAX_CUSTOM_WEBSITES) {
      errors.websiteCountCustom = `Vui lòng nhập số website từ ${MIN_CUSTOM_WEBSITES} đến ${MAX_CUSTOM_WEBSITES}`;
    }
  }

  if (!TECH_SKILLS.includes(formData.techSkill)) {
    errors.techSkill = 'Vui lòng chọn mức độ rành kỹ thuật';
  }

  if (!TRAFFIC_TIERS[formData.traffic]) {
    errors.traffic = 'Vui lòng chọn ước tính lượng truy cập mỗi tháng';
  }

  if (!formData.budget || !(Number(formData.budget) > 0)) {
    errors.budget = 'Vui lòng nhập ngân sách dự kiến cho hosting/tháng';
  } else if (Number(formData.budget) < 30000) {
    errors.budget = 'Ngân sách tối thiểu nên từ 30.000đ/tháng';
  } else if (Number(formData.budget) > MAX_BUDGET) {
    errors.budget = 'Ngân sách vượt quá mức hỗ trợ tư vấn';
  }

  if (formData.needsDomain && formData.domainIdea && formData.domainIdea.trim()) {
    // Nếu có nhập tên miền, kiểm tra ký tự hợp lệ cơ bản
    const domainClean = formData.domainIdea.trim().toLowerCase();
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,}){0,2}$/;
    if (domainClean.length > MAX_DOMAIN_LENGTH || !domainRegex.test(domainClean)) {
      errors.domainIdea = 'Tên miền không được chứa khoảng trắng hoặc ký tự đặc biệt';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate form thông tin liên hệ tư vấn
 */
export const validateConsultationForm = (formData) => {
  const errors = {};

  if (!formData.fullName || formData.fullName.trim().length < 2) {
    errors.fullName = 'Vui lòng nhập họ và tên của bạn (tối thiểu 2 ký tự)';
  }

  const phoneValidation = validatePhoneNumber(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }

  if (formData.email && formData.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Email không đúng định dạng';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

