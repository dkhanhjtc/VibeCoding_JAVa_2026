import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { validateNeedsForm } from '../shared/validation.js';
import { Button, FormInput, FormSelect, SectionBadge } from './UIPrimitives.jsx';

export const NeedsSurveyForm = ({
  initialValues,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    shopName: initialValues?.shopName || '',
    websiteType: initialValues?.websiteType || '',
    productCount: initialValues?.productCount || '',
    websiteCount: initialValues?.websiteCount || '',
    traffic: initialValues?.traffic || '',
    budget: initialValues?.budget || '',
    techSkill: initialValues?.techSkill || '',
    needsDomain: initialValues?.needsDomain ?? true,
    domainIdea: initialValues?.domainIdea || ''
  });

  const [errors, setErrors] = useState({});

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFillExample = () => {
    setFormData({
      shopName: 'Mây Handmade',
      websiteType: 'ecommerce',
      productCount: '80',
      websiteCount: '1',
      traffic: '5k-20k',
      budget: 150000,
      techSkill: 'beginner',
      needsDomain: true,
      domainIdea: 'mayhandmade.vn'
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateNeedsForm({
      websiteType: formData.websiteType,
      productCount: formData.productCount,
      websiteCount: formData.websiteCount,
      techSkill: formData.techSkill,
      traffic: formData.traffic,
      budget: formData.budget,
      needsDomain: formData.needsDomain,
      domainIdea: formData.domainIdea
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit?.(formData);
  };

  return (
    <div className="bg-white border border-[#a1c0d1]/60 rounded-3xl p-5 sm:p-6 shadow-card transition-all">
      {/* Header with clean SectionBadge */}
      <SectionBadge
        tag="01 / HIỂU SHOP CỦA BẠN"
        title="Shop bạn cần gì?"
        subtitle="Bấm Mẫu nếu muốn xem nhanh một ví dụ."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleFillExample}
            title="Điền lại thông tin ví dụ mẫu"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3b7a8c]" />
            <span>Mẫu</span>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên shop */}
        <FormInput
          id="shopName"
          label="Tên shop"
          value={formData.shopName}
          onChange={(e) => handleFieldChange('shopName', e.target.value)}
          placeholder="Ví dụ: Mây Handmade"
        />

        {/* Bạn muốn làm website gì? */}
        <FormSelect
          id="websiteType"
          label="Bạn muốn làm website gì?"
          value={formData.websiteType}
          onChange={(e) => handleFieldChange('websiteType', e.target.value)}
          error={errors.websiteType}
        >
          <option value="">-- Chọn --</option>          
          <option value="ecommerce">Bán đồ handmade · WooCommerce</option>
          <option value="company">Giới thiệu doanh nghiệp / Dịch vụ</option>
          <option value="blog">Blog / Tin tức cá nhân</option>
        </FormSelect>

        {/* Row: Số sản phẩm & Số website */}
        <div className="grid grid-cols-2 gap-3">
          <FormSelect
            id="productCount"
            label="Số sản phẩm"
            value={formData.productCount}
            onChange={(e) => handleFieldChange('productCount', e.target.value)}
            error={errors.productCount}
          >
            <option value="">-- Chọn --</option>
            <option value="30">Dưới 30 sản phẩm</option>
            <option value="80">80 sản phẩm</option>
            <option value="300">300 sản phẩm</option>
            <option value="1000">Trên 1.000 sản phẩm</option>
          </FormSelect>

          <FormSelect
            id="websiteCount"
            label="Số website"
            value={formData.websiteCount}
            onChange={(e) => handleFieldChange('websiteCount', e.target.value)}
            error={errors.websiteCount}
          >
            <option value="">-- Chọn --</option>
            <option value="1">1 website</option>
            <option value="3">3 website</option>
            <option value="5">Nhiều website</option>
          </FormSelect>
        </div>

        {/* Lượt khách dự kiến mỗi tháng */}
        <FormSelect
          id="traffic"
          label="Lượt khách dự kiến mỗi tháng"
          value={formData.traffic}
          onChange={(e) => handleFieldChange('traffic', e.target.value)}
          helper="Một lượt là một lần khách ghé website."
          error={errors.traffic}
        >
          <option value="">-- Chọn --</option>
          <option value="<5k">Dưới 5.000 lượt</option>
          <option value="5k-20k">5.000 - 20.000 lượt</option>
          <option value="20k-100k">20.000 - 100.000 lượt</option>
          <option value=">100k">Trên 100.000 lượt</option>
        </FormSelect>

        {/* Ngân sách hosting mỗi tháng */}
        <FormSelect
          id="budget"
          label="Ngân sách hosting mỗi tháng"
          value={formData.budget}
          onChange={(e) => handleFieldChange('budget', Number(e.target.value))}
          error={errors.budget}
        >
          <option value="">-- Chọn --</option>
          <option value={100000}>Tối đa 100.000đ</option>
          <option value={150000}>Tối đa 150.000đ</option>
          <option value={300000}>Tối đa 300.000đ</option>
          <option value={500000}>Tối đa 500.000đ</option>
          <option value={1000000}>Trên 1.000.000đ</option>
        </FormSelect>

        {/* Có mua kèm tên miền không? */}
        <div className="p-3.5 rounded-2xl bg-[#f0f4f8] border border-[#a1c0d1]/60 space-y-3">
          <label htmlFor="needsDomain" className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#00203d]">
            <input
              id="needsDomain"
              type="checkbox"
              checked={formData.needsDomain}
              onChange={(e) => handleFieldChange('needsDomain', e.target.checked)}
              className="w-4 h-4 rounded border-[#a1c0d1] accent-[#3b7a8c]"
            />
            Mua kèm tên miền cho shop
          </label>

          {formData.needsDomain && (
            <FormInput
              id="domainIdea"
              label="Tên miền bạn thích (không dấu, viết liền)"
              value={formData.domainIdea}
              onChange={(e) => handleFieldChange('domainIdea', e.target.value)}
              placeholder="Ví dụ: mayhandmade hoặc mayhandmade.vn"
              helper="Để trống thì hệ thống tự gợi ý theo tên shop."
              error={errors.domainIdea}
              maxLength={63}
            />
          )}
        </div>
        
        {/* Bạn có rành kỹ thuật không? */}
        <FormSelect
          id="techSkill"
          label="Bạn có rành kỹ thuật không?"
          value={formData.techSkill}
          onChange={(e) => handleFieldChange('techSkill', e.target.value)}
          error={errors.techSkill}
        >
          <option value="">-- Chọn --</option>
          <option value="beginner">Chưa rành, cần được hướng dẫn</option>
          <option value="intermediate">Biết cơ bản, có thể tự cài WordPress</option>
          <option value="expert">Rất rành kỹ thuật / Developer</option>
        </FormSelect>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="navy"
            size="md"
            className="w-full group"
            isLoading={isLoading}
          >
            <span>{isLoading ? 'Đang phân tích cấu hình...' : 'Xem gợi ý cho shop'}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#3b7a8c]" />
          </Button>
          <p className="text-center text-[11px] text-[#6b99ab] mt-2">
            Chưa cần rành kỹ thuật, chỉ cần chọn theo nhu cầu.
          </p>
        </div>
      </form>
    </div>
  );
};

export default NeedsSurveyForm;
