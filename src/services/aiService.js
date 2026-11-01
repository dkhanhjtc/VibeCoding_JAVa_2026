/**
 * AI SERVICE - HOSTWISE AI
 * Gửi yêu cầu phân tích tới API hoặc tự động fallback thuật toán nội bộ
 */

import { calculateRecommendation } from '../shared/ruleEngine.js';
import { validateAIResponse } from '../shared/aiValidator.js';

export const requestHostingRecommendation = async (formData) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const json = await response.json();
    const validation = validateAIResponse(json);

    if (validation.isValid) {
      return validation.data;
    } else {
      console.warn('AI response validation failed, using fallback:', validation.error);
      return calculateRecommendation(formData);
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.info('Backend API unavailable or timed out. Activating smart Fallback Rule Engine:', err.message);
    
    // Tạo độ trễ tự nhiên (1.8s) để người dùng kịp quan sát Skeleton loading mượt mà
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const fallbackResult = calculateRecommendation(formData);
    return {
      ...fallbackResult,
      isFallback: true,
      provider: 'Đề Xuất Dự Phòng (Fallback)'
    };
  }
};

