/**
 * AUTHENTICATION SERVICE - HOSTWISE AI / SHOP KHỞI SẮC
 * Quản lý xác thực quyền Quản trị viên (Admin) bằng Web Crypto API SHA-256 Native
 */

// Mật khẩu demo: "Admin@2026!"
// SHA-256: f0ce0e86206541c60bc47be815f83eba98004f63c883e6d71ff5cc929cb5f9ca
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  alternateUsername: 'admin@shopkhoisac.vn',
  passwordHash: 'f0ce0e86206541c60bc47be815f83eba98004f63c883e6d71ff5cc929cb5f9ca',
  displayName: 'Quản trị viên (Admin)'
};

const STORAGE_KEY = 'hostwise_admin_auth';
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 giờ

function getSessionStorage() {
  if (typeof window !== 'undefined' && window.sessionStorage) return window.sessionStorage;
  if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) return globalThis.sessionStorage;
  return null;
}

/**
 * Băm mật khẩu bằng Native Web Crypto API SHA-256
 */
export async function hashPasswordSHA256(password) {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Xác thực đăng nhập Admin
 */
export async function loginAdmin(username, rawPassword) {
  if (!username || !rawPassword) {
    return {
      success: false,
      error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.'
    };
  }

  const cleanUser = username.trim().toLowerCase();
  const isUserValid = cleanUser === ADMIN_CREDENTIALS.username || cleanUser === ADMIN_CREDENTIALS.alternateUsername;

  if (!isUserValid) {
    return {
      success: false,
      error: 'Tên đăng nhập hoặc mật khẩu không chính xác'
    };
  }

  try {
    const hashedInput = await hashPasswordSHA256(rawPassword);
    
    if (hashedInput === ADMIN_CREDENTIALS.passwordHash) {
      const sessionData = {
        authenticated: true,
        user: ADMIN_CREDENTIALS.username,
        displayName: ADMIN_CREDENTIALS.displayName,
        loginAt: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION_MS
      };

      const storage = getSessionStorage();
      if (storage) {
        storage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      }

      return {
        success: true,
        user: sessionData
      };
    } else {
      return {
        success: false,
        error: 'Tên đăng nhập hoặc mật khẩu không chính xác'
      };
    }
  } catch (err) {
    console.error('Lỗi khi băm mật khẩu:', err);
    return {
      success: false,
      error: 'Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.'
    };
  }
}

/**
 * Kiểm tra trạng thái đăng nhập Admin hiện tại
 */
export function isAdminAuthenticated() {
  const storage = getSessionStorage();
  if (!storage) return false;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);
    if (data?.authenticated && data.expiresAt > Date.now()) {
      return true;
    }

    storage.removeItem(STORAGE_KEY);
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Đăng xuất Admin
 */
export function logoutAdmin() {
  const storage = getSessionStorage();
  if (storage) {
    storage.removeItem(STORAGE_KEY);
  }
  return true;
}
