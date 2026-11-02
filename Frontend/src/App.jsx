import React, { useState, useRef } from 'react';
import Layout from './components/Layout.jsx';
import NeedsSurveyForm from './components/NeedsSurveyForm.jsx';
import RecommendationResult from './components/RecommendationResult.jsx';
import ConsultationModal from './components/ConsultationModal.jsx';
import LeadsDrawer from './components/LeadsDrawer.jsx';
import FAQAccordion from './components/FAQAccordion.jsx';
import Skeleton from './components/Skeleton.jsx';
import Toast from './components/Toast.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

import { requestHostingRecommendation } from './services/aiService.js';
import { calculateRecommendation } from './shared/ruleEngine.js';

export function App() {
  // 1. Quản lý State cốt lõi của ứng dụng
  const [formData, setFormData] = useState({
    shopName: '',
    websiteType: '',
    traffic: '',
    budget: '',
    needsDomain: true,
    domainIdea: ''
  });

  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const resultsRef = useRef(null);

  // 2. Xử lý khi người dùng submit form khảo sát
  const handleSurveySubmit = async (surveyValues) => {
    setFormData(surveyValues);
    setLoading(true);

    try {
      // Gọi service AI (tự động gọi API hoặc fallback về RuleEngine nếu backend chưa chạy)
      const result = await requestHostingRecommendation(surveyValues);
      setRecommendationData(result);

      // Bắn thông báo nhẹ
      setToastMessage({
        title: 'Phân tích hoàn tất',
        text: result.isFallback
          ? 'Đã chọn lọc cấu hình tối ưu qua thuật toán HostWise Smart Rules!'
          : 'AI Gemini đã phân tích và đề xuất gói phù hợp nhất với shop của bạn!',
        type: 'success'
      });

      // Tự động cuộn mượt (smooth scroll) xuống phần kết quả
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err) {
      console.error('Error in recommendation flow:', err);
      // Dự phòng khẩn cấp
      const fallback = calculateRecommendation(surveyValues);
      setRecommendationData(fallback);
      setToastMessage({
        title: 'Thông báo',
        text: 'Hệ thống đã kích hoạt bộ quy tắc phân tích cục bộ.',
        type: 'info'
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. Xử lý mở Modal đăng ký khi chọn 1 gói
  const handleSelectPackage = (pkg) => {
    setSelectedPackageForModal(pkg);
    setIsModalOpen(true);
  };

  // 4. Xử lý khi lưu lead thành công từ Modal
  const handleConsultationSuccess = (savedLead) => {
    setToastMessage({
      title: 'Đăng ký tư vấn thành công!',
      text: `Thông tin của ${savedLead.fullName} cho gói ${savedLead.packageName} đã được lưu vào hệ thống.`,
      type: 'success'
    });
  };

  return (
    <ErrorBoundary>
      <Layout onOpenLeadsDrawer={() => setIsDrawerOpen(true)}>
        {/* ----------------- HERO HEADER SECTION ----------------- */}
        <section aria-label="Giới thiệu HostWise AI" className="text-center pt-2 sm:pt-6 pb-8 sm:pb-12 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 tracking-wide uppercase shadow-2xs mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Góc Tư Vấn Cho Chủ Shop
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight leading-tight">
            Chọn đúng gói. <br className="hidden sm:inline" />
            <span className="text-[#111827] underline decoration-gray-300 decoration-wavy decoration-1 underline-offset-4">
              Yên tâm mở shop.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mt-4 max-w-xl mx-auto leading-relaxed">
            Không cần rành kỹ thuật. Từ nhu cầu kinh doanh thực tế của bạn, tìm hosting vừa đủ và tên miền dễ nhớ, tránh lãng phí ngân sách.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-7 text-xs font-bold text-gray-400">
            <span className="text-[#111827] flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center text-[11px]">1</span>
              Nhu cầu
            </span>
            <span className="text-gray-300">→</span>
            <span className={recommendationData ? 'text-[#111827] flex items-center gap-1' : 'text-gray-400'}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${recommendationData ? 'bg-[#111827] text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
              So sánh
            </span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-400 flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[11px]">3</span>
              Đăng ký
            </span>
          </div>
        </section>

        {/* ----------------- 01 / KHẢO SÁT NHU CẦU ----------------- */}
        <section id="khao-sat" aria-label="Khảo sát nhu cầu" className="max-w-4xl mx-auto mb-10">
          <NeedsSurveyForm
            initialValues={formData}
            onSubmit={handleSurveySubmit}
            isLoading={loading}
          />
        </section>

        {/* ----------------- SKELETON LOADING HOẶC KẾT QUẢ ĐỀ XUẤT ----------------- */}
        <div ref={resultsRef} className="scroll-mt-20">
          {loading ? (
            <Skeleton />
          ) : (
            recommendationData && (
              <RecommendationResult
                recommendationData={recommendationData}
                onSelectPackage={handleSelectPackage}
              />
            )
          )}
        </div>

        {/* ----------------- CÂU HỎI THƯỜNG GẶP (FAQ) ----------------- */}
        <section id="cau-hoi" aria-label="Câu hỏi thường gặp">
          <FAQAccordion />
        </section>

        {/* ----------------- POPUP MODAL ĐĂNG KÝ TƯ VẤN ----------------- */}
        <ConsultationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          packageData={selectedPackageForModal}
          surveyData={formData}
          domainRecommendation={recommendationData?.domainRecommendation}
          onSuccess={handleConsultationSuccess}
        />

        {/* ----------------- DRAWER QUẢN TRỊ LEADS (BGK) ----------------- */}
        <LeadsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* ----------------- TOAST THÔNG BÁO TỰ ĐỘNG TẮT ----------------- */}
        <Toast
          message={toastMessage}
          type={toastMessage?.type || 'success'}
          onClose={() => setToastMessage(null)}
          duration={3000}
        />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
