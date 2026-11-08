import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Layout from './components/Layout.jsx';
import NeedsSurveyForm from './components/NeedsSurveyForm.jsx';
import { AIExplainerCard, DomainCard, CalloutBanner } from './components/RecommendationResult.jsx';
import ComparisonTable from './components/ComparisonTable.jsx';
import ConsultationModal from './components/ConsultationModal.jsx';
import AdminLoginModal from './components/AdminLoginModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import FAQAccordion from './components/FAQAccordion.jsx';
import Skeleton from './components/Skeleton.jsx';
import Toast from './components/Toast.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

import { requestHostingRecommendation } from './services/aiService.js';
import { calculateRecommendation } from './shared/ruleEngine.js';
import { isAdminAuthenticated } from './services/authService.js';

gsap.registerPlugin(useGSAP);

export function App() {
  // 1. Quản lý View & State cốt lõi của ứng dụng
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'admin'
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const [formData, setFormData] = useState({
    shopName: '',
    websiteType: '',
    websiteTypeOther: '',
    productCount: '',
    websiteCount: '',
    websiteCountCustom: '',
    traffic: '',
    budget: '',
    techSkill: '',
    needsDomain: true,
    domainIdea: ''
  });

  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const resultsRef = useRef(null);


  // Smooth entrance when recommendation data updates or finishes loading
  useGSAP(() => {
    if (!loading && recommendationData && resultsRef.current) {
      gsap.fromTo(
        resultsRef.current,
        { autoAlpha: 0.85, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform' }
      );
    }
  }, { dependencies: [loading, recommendationData] });

  // 2. Xử lý mở Admin View hoặc Modal Login
  const handleOpenAdminLogin = () => {
    if (isAdminAuthenticated()) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (user) => {
    setCurrentView('admin');
    setIsAdminLoginOpen(false);
    setToastMessage({
      title: 'Đăng nhập thành công!',
      text: `Chào mừng ${user.displayName || 'Quản trị viên'} đến hệ thống quản lý leads.`,
      type: 'success'
    });
  };

  const handleAdminLogout = () => {
    setCurrentView('home');
    setToastMessage({
      title: 'Đã đăng xuất',
      text: 'Phiên quản trị viên đã kết thúc an toàn.',
      type: 'info'
    });
  };

  // 3. Xử lý khi người dùng submit form khảo sát
  const handleSurveySubmit = async (surveyValues) => {
    setFormData(surveyValues);
    setLoading(true);

    try {
      const result = await requestHostingRecommendation(surveyValues);
      setRecommendationData(result);

      setToastMessage({
        title: 'Phân tích hoàn tất',
        text: result.isFallback
          ? 'Đã chọn lọc cấu hình tối ưu qua thuật toán HostWise Smart Rules!'
          : 'AI Gemini đã phân tích và đề xuất gói phù hợp nhất với shop của bạn!',
        type: 'success'
      });

      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err) {
      console.error('Error in recommendation flow:', err);
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

  // 4. Xử lý mở Modal đăng ký khi chọn 1 gói
  const handleSelectPackage = (pkg) => {
    setSelectedPackageForModal(pkg);
    setIsModalOpen(true);
  };

  // 5. Xử lý khi lưu lead thành công từ Modal
  const handleConsultationSuccess = (savedLead) => {
    setToastMessage({
      title: 'Đăng ký tư vấn thành công!',
      text: `Thông tin của ${savedLead.fullName} cho gói ${savedLead.packageName} đã được lưu vào hệ thống.`,
      type: 'success'
    });
  };

  const allPackages = recommendationData
    ? [recommendationData.bestMatch, ...(recommendationData.alternatives || [])]
    : [];

  // Nếu đang ở chế độ xem Admin Dashboard
  if (currentView === 'admin') {
    return (
      <ErrorBoundary>
        <AdminDashboard
          onBackToHome={() => setCurrentView('home')}
          onLogout={handleAdminLogout}
        />
        <Toast
          message={toastMessage}
          type={toastMessage?.type || 'success'}
          onClose={() => setToastMessage(null)}
          duration={3000}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Layout onOpenAdminLogin={handleOpenAdminLogin}>
        {/* ----------------- HERO HEADER SECTION ----------------- */}
        <section aria-label="Giới thiệu tư vấn" className="text-center pt-2 sm:pt-6 pb-6 sm:pb-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#a1c0d1]/40 text-[11px] font-bold text-[#0f383f] tracking-wide uppercase shadow-subtle mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b7a8c] animate-ping"></span>
            Góc tư vấn cho chủ shop
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#00203d] tracking-tight leading-tight">
            Chọn đúng gói. <br className="hidden sm:inline" />
            <span className="text-[#00203d]">
              Yên tâm mở shop.
            </span>
          </h1>

          <p className="text-xs sm:text-base text-[#1f4f5a] mt-3 max-w-xl mx-auto leading-relaxed">
            Không cần rành kỹ thuật. Từ nhu cầu của bạn, tìm hosting vừa đủ và tên miền dễ nhớ.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 text-xs font-semibold text-[#6b99ab]">
            <span className="text-[#00203d] font-bold">
              01 Nhu cầu
            </span>
            <span className="text-[#6b99ab]">→</span>
            <span className={recommendationData ? 'text-[#00203d] font-bold' : 'text-[#6b99ab]'}>
              02 So sánh
            </span>
            <span className="text-[#6b99ab]">→</span>
            <span className="text-[#6b99ab]">
              03 Đăng ký
            </span>
          </div>
        </section>

        {/* ----------------- MAIN TWO-COLUMN LAYOUT (DESKTOP) / STACK (MOBILE) ----------------- */}
        <div ref={resultsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start mb-8 sm:mb-12">
          {/* Left Column: Form & AI Explainer */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <section id="khao-sat" aria-label="Khảo sát nhu cầu">
              <NeedsSurveyForm
                initialValues={formData}
                onSubmit={handleSurveySubmit}
                isLoading={loading}
              />
            </section>

            {loading ? (
              <div className="p-4 bg-white rounded-3xl border border-[#a1c0d1]/60 shadow-card">
                <Skeleton />
              </div>
            ) : (
              <AIExplainerCard recommendationData={recommendationData} />
            )}
          </div>

          {/* Right Column: Comparison Table & Domain Box */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {loading ? (
              <div className="p-6 bg-white rounded-3xl border border-[#a1c0d1]/60 shadow-card">
                <Skeleton />
              </div>
            ) : (
              <>
                {!recommendationData && (
                  <div className="p-6 bg-white rounded-3xl border border-dashed border-[#a1c0d1] text-center text-sm text-[#1f4f5a]">
                    Điền nhu cầu bên trái rồi bấm <strong>Xem gợi ý cho shop</strong> để nhận 3 gói phù hợp.
                  </div>
                )}

                <ComparisonTable
                  packages={allPackages}
                  bestMatchId={recommendationData?.bestMatch?.id}
                  domainRecommendation={recommendationData?.domainRecommendation}
                  onSelect={handleSelectPackage}
                />

                {recommendationData && (
                  <DomainCard
                    domainRecommendation={recommendationData.domainRecommendation}
                    bestMatch={recommendationData.bestMatch}
                    costSummary={recommendationData.costSummary}
                    shopName={formData.shopName}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* ----------------- CALLOUT BANNER (SECTION 03) ----------------- */}
        {recommendationData && (
          <section aria-label="Kêu gọi hành động" className="mb-10 sm:mb-14">
            <CalloutBanner
              bestMatch={recommendationData.bestMatch}
              onSelectPackage={handleSelectPackage}
            />
          </section>
        )}

        {/* ----------------- CÂU HỎI THƯỜNG GẶP (FAQ) ----------------- */}
        <section id="cau-hoi" aria-label="Câu hỏi thường gặp" className="mb-12">
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

        {/* ----------------- POPUP MODAL ĐĂNG NHẬP ADMIN ----------------- */}
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={handleAdminLoginSuccess}
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
