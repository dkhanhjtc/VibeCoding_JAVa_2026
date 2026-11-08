import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { requestHostingRecommendation } from '../src/services/aiService.js';
import { clearTestLeads, exportLeadsToCSV, getLeads, saveLead } from '../src/services/leadsStore.js';

const survey = { productCount: '30-100', websiteCount: '1', techSkill: 'beginner', websiteType: 'ecommerce', traffic: '5k-20k', budget: 150000, needsDomain: false };

const aiResponse = {
  bestMatchId: 'standard',
  alternativeIds: ['entry', 'pro'],
  headline: 'Gói Đồng hành vừa đủ',
  reasons: ['Lý do một.', 'Lý do hai.'],
  domainExtension: 'vn',
  domainAdvice: 'Đuôi .vn tạo niềm tin.',
  provider: 'AI gemini-3.5-flash-lite'
};

const mockApi = (payload, ok = true) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 404, json: async () => payload }));
};

describe('requestHostingRecommendation', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('dùng kết quả AI khi hợp lệ', async () => {
    mockApi(aiResponse);
    const result = await requestHostingRecommendation(survey);
    expect(result.isFallback).toBe(false);
    expect(result.provider).toBe('AI gemini-3.5-flash-lite');
  });

  it.each([
    ['API 404', () => mockApi({}, false)],
    ['API báo fallback', () => mockApi({ fallback: true, reason: 'x' })],
    ['dữ liệu AI sai', () => mockApi({ ...aiResponse, bestMatchId: 'x' })],
    ['mất mạng', () => vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))]
  ])('%s thì dùng rule engine và gắn nhãn rõ ràng', async (_label, setup) => {
    setup();
    const result = await requestHostingRecommendation(survey);
    expect(result.isFallback).toBe(true);
    expect(result.provider).toBe('Đề Xuất Dự Phòng (Fallback)');
    expect(result.alternatives).toHaveLength(2);
  });
});

describe('leadsStore', () => {
  let store;
  let exportedBlob;

  beforeEach(() => {
    store = {};
    vi.stubGlobal('localStorage', {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => { store[key] = value; }
    });
    vi.stubGlobal('document', {
      createElement: () => ({ setAttribute() {}, click() {} }),
      body: { appendChild() {}, removeChild() {} }
    });
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => { exportedBlob = blob; return 'blob:x'; });
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('danh sách ban đầu rỗng, không có khách giả', () => {
    expect(getLeads()).toEqual([]);
  });

  it('lưu khách mới lên đầu danh sách', () => {
    saveLead({ fullName: 'An', phone: '0901234567', budget: 150000 });
    saveLead({ fullName: 'Bình', phone: '0911234567', budget: 150000 });
    expect(getLeads().map(lead => lead.fullName)).toEqual(['Bình', 'An']);
    expect(getLeads()[0].budget).toBe('150.000đ/tháng');
  });

  it.each(['{hỏng', '{"a":1}'])('localStorage hỏng (%s) không làm app sập', (raw) => {
    store.leads_data = raw;
    expect(getLeads()).toEqual([]);
    expect(saveLead({ fullName: 'An', phone: '0901234567' }).fullName).toBe('An');
  });

  it('xóa dữ liệu không nạp lại khách giả', () => {
    saveLead({ fullName: 'An', phone: '0901234567' });
    clearTestLeads();
    expect(getLeads()).toEqual([]);
  });

  it('CSV escape dấu ngoặc kép và chặn công thức Excel', async () => {
    saveLead({ fullName: '=HYPERLINK("x")', phone: '0901234567', email: 'a"b@c.vn' });
    expect(exportLeadsToCSV()).toBe(true);
    const csv = await exportedBlob.text();
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
    expect(csv).toContain('"a""b@c.vn"');
  });
});
