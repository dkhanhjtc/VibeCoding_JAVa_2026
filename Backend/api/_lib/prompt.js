/**
 * PROMPT BUILDER - HOSTWISE AI (TV2)
 * Xây dựng prompt cho Google Gemini API để phân tích nhu cầu hosting
 */

export const buildRecommendationPrompt = (surveyData) => {
  return `
Bạn là chuyên gia tư vấn hạ tầng website và tên miền cho các shop online tại Việt Nam.
Hãy phân tích nhu cầu dưới đây và đưa ra gợi ý chọn gói hosting chuẩn xác nhất:

THÔNG TIN SHOP:
- Tên shop: ${surveyData.shopName || 'Shop online'}
- Mô hình website: ${surveyData.websiteType} (ecommerce: bán hàng có giỏ hàng, company: giới thiệu doanh nghiệp, blog: viết bài chia sẻ)
- Lượng khách dự kiến: ${surveyData.traffic} lượt/tháng
- Ngân sách hosting dự trù: ${Number(surveyData.budget || 150000).toLocaleString('vi-VN')} đ/tháng
- Nhu cầu tên miền: ${surveyData.needsDomain ? `Có mua kèm tên miền (${surveyData.domainIdea || 'shop'})` : 'Không mua tên miền'}

YÊU CẦU TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON (không bọc trong markdown tick):
{
  "bestMatchId": "standard", // chọn 1 trong: "entry", "standard", "pro", "turbo", "enterprise"
  "alternativeIds": ["entry", "pro"], // 2 gói thay thế
  "headline": "Đồng hành là vừa đủ. Chưa cần gói lớn hơn.",
  "reasons": [
    "Dung lượng 15 GB NVMe thoải mái chứa ảnh sản phẩm sắc nét.",
    "Băng thông mượt mà cho 10.000 - 20.000 lượt khách ghé thăm/tháng.",
    "Hỗ trợ 24/7 trực tuyến giúp giải quyết sự cố kỹ thuật ngay trong đêm."
  ],
  "domainRecommendation": {
    "suggestedDomain": "${(surveyData.domainIdea || 'shopcuaban').replace(/[^a-z0-9]/g, '')}.vn",
    "extension": ".vn",
    "priceYearly": 450000,
    "advice": "Tên miền .vn giúp tăng độ tin cậy và ưu tiên hiển thị tìm kiếm tại Việt Nam."
  }
}
`.trim();
};

