// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NeedsSurveyForm from '../src/components/NeedsSurveyForm.jsx';

afterEach(cleanup);

const renderForm = () => {
  const onSubmit = vi.fn();
  const { container } = render(<NeedsSurveyForm onSubmit={onSubmit} />);
  const field = (id) => container.querySelector(`#${id}`);
  return { onSubmit, field, form: container.querySelector('form') };
};

const fillRequired = (field) => {
  fireEvent.change(field('websiteType'), { target: { value: 'ecommerce' } });
  fireEvent.change(field('traffic'), { target: { value: '5k-20k' } });
  fireEvent.change(field('budget'), { target: { value: '150000' } });
  fireEvent.change(field('productCount'), { target: { value: '30-100' } });
  fireEvent.change(field('websiteCount'), { target: { value: '1' } });
  fireEvent.change(field('techSkill'), { target: { value: 'beginner' } });
};

describe('NeedsSurveyForm', () => {
  it('mở trang với các ô bắt buộc chưa được chọn', () => {
    const { field } = renderForm();
    expect(field('shopName').value).toBe('');
    expect(field('websiteType').value).toBe('');
    expect(field('traffic').value).toBe('');
    expect(field('budget').value).toBe('');
  });

  it('form trống thì không gửi và báo lỗi từng ô bắt buộc', () => {
    const { onSubmit, form } = renderForm();
    fireEvent.submit(form);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/chọn loại website/)).toBeTruthy();
    expect(screen.getByText(/ước tính lượng truy cập/)).toBeTruthy();
    expect(screen.getByText(/nhập ngân sách/)).toBeTruthy();
  });

  it('chọn đủ thì gửi đúng dữ liệu', () => {
    const { onSubmit, form, field } = renderForm();
    fillRequired(field);
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      websiteType: 'ecommerce',
      traffic: '5k-20k',
      budget: 150000,
      needsDomain: true
    }));
  });

  it('chọn lại ô bị lỗi thì lỗi biến mất', () => {
    const { form, field } = renderForm();
    fireEvent.submit(form);
    fireEvent.change(field('websiteType'), { target: { value: 'blog' } });
    expect(screen.queryByText(/chọn loại website/)).toBeNull();
  });

  it('mặc định có mua tên miền và hiện ô nhập tên miền', () => {
    const { field } = renderForm();
    expect(field('needsDomain').checked).toBe(true);
    expect(field('domainIdea')).toBeTruthy();
  });

  it('bỏ tick mua tên miền thì ẩn ô tên miền và gửi needsDomain false', () => {
    const { onSubmit, form, field } = renderForm();
    fillRequired(field);
    fireEvent.click(field('needsDomain'));
    expect(field('domainIdea')).toBeNull();
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ needsDomain: false }));
  });

  it('tên miền sai định dạng thì báo lỗi và không gửi', () => {
    const { onSubmit, form, field } = renderForm();
    fillRequired(field);
    fireEvent.change(field('domainIdea'), { target: { value: 'shop của tôi' } });
    fireEvent.submit(form);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/Tên miền không được chứa/)).toBeTruthy();
  });

  it('nút Mẫu điền dữ liệu ví dụ gửi được ngay', () => {
    const { onSubmit, form } = renderForm();
    fireEvent.click(screen.getByRole('button', { name: /Mẫu/ }));
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ shopName: 'Mây Handmade' }));
  });

  it('chọn loại website Khác thì hiện ô nhập và bắt buộc nhập', () => {
    const { onSubmit, form, field } = renderForm();
    fillRequired(field);
    expect(field('websiteTypeOther')).toBeNull();
    fireEvent.change(field('websiteType'), { target: { value: 'other' } });
    expect(field('websiteTypeOther')).toBeTruthy();
    fireEvent.submit(form);
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.change(field('websiteTypeOther'), { target: { value: 'Website đặt lịch spa' } });
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ websiteType: 'other', websiteTypeOther: 'Website đặt lịch spa' }));
  });

  it('chọn trên 5 website thì hiện ô nhập số lượng', () => {
    const { onSubmit, form, field } = renderForm();
    fillRequired(field);
    expect(field('websiteCountCustom')).toBeNull();
    fireEvent.change(field('websiteCount'), { target: { value: '>5' } });
    fireEvent.change(field('websiteCountCustom'), { target: { value: '12' } });
    fireEvent.submit(form);
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.change(field('websiteCountCustom'), { target: { value: '8' } });
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ websiteCount: '>5', websiteCountCustom: '8' }));
  });
});
