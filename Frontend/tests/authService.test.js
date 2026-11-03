import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hashPasswordSHA256, loginAdmin, isAdminAuthenticated, logoutAdmin, ADMIN_CREDENTIALS } from '../src/services/authService.js';

describe('authService - Admin Authentication & SHA-256 Hashing', () => {
  let sessionStore;

  beforeEach(() => {
    sessionStore = {};
    vi.stubGlobal('sessionStorage', {
      getItem: (key) => sessionStore[key] ?? null,
      setItem: (key, value) => { sessionStore[key] = String(value); },
      removeItem: (key) => { delete sessionStore[key]; },
      clear: () => { sessionStore = {}; }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('băm đúng chuỗi SHA-256 của mật khẩu demo Admin@2026!', async () => {
    const hash = await hashPasswordSHA256('Admin@2026!');
    expect(hash).toBe('f0ce0e86206541c60bc47be815f83eba98004f63c883e6d71ff5cc929cb5f9ca');
    expect(hash).toBe(ADMIN_CREDENTIALS.passwordHash);
  });

  it('đăng nhập thành công với tài khoản và mật khẩu đúng', async () => {
    const res = await loginAdmin('admin', 'Admin@2026!');
    expect(res.success).toBe(true);
    expect(isAdminAuthenticated()).toBe(true);
  });

  it('đăng nhập thành công với email thay thế', async () => {
    const res = await loginAdmin('admin@shopkhoisac.vn', 'Admin@2026!');
    expect(res.success).toBe(true);
    expect(isAdminAuthenticated()).toBe(true);
  });

  it('từ chối đăng nhập khi sai mật khẩu', async () => {
    const res = await loginAdmin('admin', 'WrongPassword123');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Tên đăng nhập hoặc mật khẩu không chính xác');
    expect(isAdminAuthenticated()).toBe(false);
  });

  it('từ chối đăng nhập khi sai tên đăng nhập', async () => {
    const res = await loginAdmin('user_hacker', 'Admin@2026!');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Tên đăng nhập hoặc mật khẩu không chính xác');
    expect(isAdminAuthenticated()).toBe(false);
  });

  it('đăng xuất admin xóa sạch phiên sessionStorage', async () => {
    await loginAdmin('admin', 'Admin@2026!');
    expect(isAdminAuthenticated()).toBe(true);

    logoutAdmin();
    expect(isAdminAuthenticated()).toBe(false);
  });
});
