/**
 * AI SERVICE - HOSTWISE AI
 * Gửi yêu cầu phân tích tới API hoặc tự động fallback thuật toán nội bộ
 */

import { calculateRecommendation } from '../shared/ruleEngine.js';
import { validateAIResponse } from '../shared/aiValidator.js';

const REQUEST_TIMEOUT_MS = 15000;

export const requestHostingRecommendation = async (formData) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const json = await response.json();
    if (json.fallback) {
      throw new Error(json.reason || 'API requested fallback');
    }

    const validation = validateAIResponse(json, formData);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    return validation.data;
  } catch (err) {
    console.info('Activating smart Fallback Rule Engine:', err.message);
    return { ...calculateRecommendation(formData), provider: 'Đề Xuất Dự Phòng (Fallback)' };
  }
};
