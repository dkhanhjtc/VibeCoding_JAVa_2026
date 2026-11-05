// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ConsultationModal from '../src/components/ConsultationModal.jsx';
import { getLeads } from '../src/services/leadsStore.js';
import { getPackageById } from '../src/shared/packages.js';

const domainRecommendation = { suggestedDomain: 'gomxinh.vn', priceYearly: 450000, renewalYearly: 550000 };

const renderModal = (props = {}) => {
  const onSuccess = vi.fn();
  const { container } = render(
    <ConsultationModal
      isOpen
      onClose={() => {}}
      onSuccess={onSuccess}
      packageData={getPackageById('standard')}
      surveyData={{ shopName: 'Gốm Xinh', budget: 150000, needsDomain: true }}
      domainRecommendation={domainRecommendation}
      {...props}
    />
  );
  const field = (id) => container.querySelector(`#${id}`);
  return { onSuccess, field, checkbox: container.querySelector('input[type="checkbox"]'), form: container.querySelector('form') };
};

const type = (input, value) => fireEvent.change(input, { target: { value } });

const fillValid = ({ field, checkbox }) => {
  type(field('fullName'), 'Khách Thử');
  type(field('phone'), '0901234567');
  fireEvent.click(checkbox);
};

const vnd = (value) => `${value.toLocaleString('vi-VN')}đ`;

describe('ConsultationModal', () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it('mở form trống, chưa tick đồng ý', () => {
    const { field, checkbox } = renderModal();
    expect(field('fullName').value).toBe('');
    expect(field('phone').value).toBe('');
    expect(field('email').value).toBe('');
    expect(checkbox.checked).toBe(false);
  });

  it('có mua tên miền thì cộng phí tên miền vào tổng năm đầu', () => {
    renderModal();
    expect(screen.getByText('gomxinh.vn')).toBeTruthy();
    expect(screen.getByText(vnd(1188000 + 450000))).toBeTruthy();
  });

  it('không mua tên miền thì không có dòng tên miền và không cộng phí', () => {
    renderModal({ domainRecommendation: null });
    expect(screen.queryByText('gomxinh.vn')).toBeNull();
    expect(screen.getAllByText(vnd(1188000)).length).toBe(2);
  });

  it('form trống thì báo lỗi và không lưu khách', () => {
    const { form, onSuccess } = renderModal();
    fireEvent.submit(form);
    expect(screen.getByText(/nhập họ và tên/)).toBeTruthy();
    expect(screen.getByText(/nhập số điện thoại/)).toBeTruthy();
    expect(screen.getByText(/xác nhận đồng ý/)).toBeTruthy();
    expect(getLeads()).toEqual([]);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('chưa tick đồng ý thì không lưu', () => {
    const { form, field } = renderModal();
    type(field('fullName'), 'Khách Thử');
    type(field('phone'), '0901234567');
    fireEvent.submit(form);
    expect(getLeads()).toEqual([]);
  });

  it.each([
    ['số điện thoại sai', 'phone', '123', /không đúng định dạng/],
    ['email sai', 'email', 'abc', /Email không đúng định dạng/]
  ])('%s thì báo lỗi và không lưu', (_label, id, value, message) => {
    const modal = renderModal();
    const { form, field } = modal;
    fillValid(modal);
    type(field(id), value);
    fireEvent.submit(form);
    expect(screen.getByText(message)).toBeTruthy();
    expect(getLeads()).toEqual([]);
  });

  it('hợp lệ thì lưu đúng khách và báo thành công', () => {
    const modal = renderModal();
    const { form, onSuccess } = modal;
    fillValid(modal);
    fireEvent.submit(form);
    expect(getLeads()[0]).toMatchObject({
      fullName: 'Khách Thử',
      phone: '0901234567',
      packageName: 'Đồng hành',
      domainIdea: 'gomxinh.vn'
    });
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('không mua tên miền thì lưu đúng ghi chú tên miền', () => {
    const modal = renderModal({ domainRecommendation: null });
    const { form } = modal;
    fillValid(modal);
    fireEvent.submit(form);
    expect(getLeads()[0].domainIdea).toBe('Không mua kèm tên miền');
  });

  it('không mở thì không hiển thị gì', () => {
    const { form } = renderModal({ isOpen: false });
    expect(form).toBeNull();
  });
});
