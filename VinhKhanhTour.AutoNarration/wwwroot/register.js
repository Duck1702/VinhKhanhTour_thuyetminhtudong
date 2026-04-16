const registerForm = document.getElementById('registerForm');
const messageBox = document.getElementById('authMessage');
const loginLink = document.getElementById('loginLink');

const labels = {
  vi: {
    title: 'Tạo tài khoản',
    subtitle: 'Tạo tài khoản chủ quán để quản lý nội dung và mã QR của quán.',
    fullName: 'Họ và tên',
    email: 'Email',
    password: 'Mật khẩu',
    passwordPlaceholder: 'Tối thiểu 6 ký tự',
    submit: 'Đăng ký',
    submitting: 'Đang tạo tài khoản...',
    switchText: 'Đã có tài khoản?',
    switchLink: 'Đăng nhập',
    success: 'Đăng ký thành công. Đang chuyển vào hệ thống...',
    failed: 'Đăng ký thất bại.',
    generic: 'Có lỗi xảy ra khi đăng ký.'
  },
  en: {
    title: 'Create account',
    subtitle: 'Create a new account to access all website features.',
    fullName: 'Full name',
    email: 'Email',
    password: 'Password',
    passwordPlaceholder: 'At least 6 characters',
    submit: 'Register',
    submitting: 'Creating account...',
    switchText: 'Already have an account?',
    switchLink: 'Login',
    success: 'Registration successful. Redirecting...',
    failed: 'Registration failed.',
    generic: 'An error occurred while registering.'
  },
  fr: {
    title: 'Creer un compte',
    subtitle: 'Creez un nouveau compte pour acceder a toutes les fonctionnalites.',
    fullName: 'Nom complet',
    email: 'Email',
    password: 'Mot de passe',
    passwordPlaceholder: 'Au moins 6 caracteres',
    submit: 'Inscription',
    submitting: 'Creation du compte...',
    switchText: 'Vous avez deja un compte ?',
    switchLink: 'Connexion',
    success: 'Inscription reussie. Redirection...',
    failed: 'Echec de l inscription.',
    generic: 'Une erreur est survenue pendant l inscription.'
  },
  ja: {
    title: 'アカウント作成',
    subtitle: '新しいアカウントを作成して全機能を利用します。',
    fullName: '氏名',
    email: 'メール',
    password: 'パスワード',
    passwordPlaceholder: '6文字以上',
    submit: '登録',
    submitting: '作成中...',
    switchText: 'すでにアカウントをお持ちですか？',
    switchLink: 'ログイン',
    success: '登録成功。移動中...',
    failed: '登録に失敗しました。',
    generic: '登録中にエラーが発生しました。'
  },
  ko: {
    title: '계정 만들기',
    subtitle: '모든 기능을 사용하려면 새 계정을 만드세요.',
    fullName: '이름',
    email: '이메일',
    password: '비밀번호',
    passwordPlaceholder: '최소 6자',
    submit: '회원가입',
    submitting: '계정 생성 중...',
    switchText: '이미 계정이 있나요?',
    switchLink: '로그인',
    success: '회원가입 성공. 이동 중...',
    failed: '회원가입에 실패했습니다.',
    generic: '회원가입 중 오류가 발생했습니다.'
  }
};

function getLang() {
  const queryLang = new URLSearchParams(window.location.search).get('lang');
  const lang = queryLang || window.siteI18n?.getSiteLanguage?.() || localStorage.getItem('siteLanguage') || 'vi';
  return labels[lang] ? lang : 'vi';
}

function t(key) {
  const lang = getLang();
  return labels[lang][key] || labels.vi[key] || key;
}

function applyText() {
  document.documentElement.lang = getLang();
  document.title = `${t('title')} - Vinh Khanh Tour`;

  const titleEl = document.querySelector('.auth-card h1');
  const subtitleEl = document.querySelector('.auth-subtitle');
  const labelSpans = registerForm?.querySelectorAll('label span');
  const passwordInput = document.getElementById('password');
  const submitBtn = registerForm?.querySelector('button[type="submit"]');
  const switchTextEl = document.querySelector('.auth-switch');

  if (titleEl) titleEl.textContent = t('title');
  if (subtitleEl) subtitleEl.textContent = t('subtitle');
  if (labelSpans?.[0]) labelSpans[0].textContent = t('fullName');
  if (labelSpans?.[1]) labelSpans[1].textContent = t('email');
  if (labelSpans?.[2]) labelSpans[2].textContent = t('password');
  if (passwordInput) passwordInput.placeholder = t('passwordPlaceholder');
  if (submitBtn) submitBtn.textContent = t('submit');
  if (switchTextEl && loginLink) {
    switchTextEl.firstChild.textContent = `${t('switchText')} `;
    loginLink.textContent = t('switchLink');
  }
}

function getReturnUrl() {
  const url = new URL(window.location.href);
  const lang = getLang();
  const returnUrl = url.searchParams.get('returnUrl') || `/?lang=${encodeURIComponent(lang)}`;
  if (!returnUrl.startsWith('/')) {
    return `/?lang=${encodeURIComponent(lang)}`;
  }

  return returnUrl;
}

function setMessage(text, isError) {
  if (!messageBox) {
    return;
  }

  messageBox.textContent = text;
  messageBox.classList.remove('hidden', 'success', 'error');
  messageBox.classList.add(isError ? 'error' : 'success');
}

async function checkAuthenticated() {
  try {
    const response = await fetch('/api/auth/me');
    if (response.ok) {
      window.location.href = '/';
    }
  } catch {
    // Ignore network checks and keep register page visible.
  }
}

async function onSubmit(event) {
  event.preventDefault();

  if (!registerForm) {
    return;
  }

  const submitButton = registerForm.querySelector('button[type="submit"]');
  const fullName = document.getElementById('fullName')?.value?.trim() || '';
  const email = document.getElementById('email')?.value?.trim() || '';
  const password = document.getElementById('password')?.value || '';
  const role = 'merchant';

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = t('submitting');
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, role })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || t('failed'));
    }

    // Lưu role vào localStorage
    localStorage.setItem('userRole', role);

    setMessage(t('success'), false);
    
    // Chuyển hướng dựa trên role
    const lang = getLang();
    const redirectUrl = `/merchant.html?lang=${encodeURIComponent(lang)}`;
    
    window.location.href = redirectUrl;
  } catch (error) {
    setMessage(error.message || t('generic'), true);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = t('submit');
    }
  }
}

if (loginLink) {
  loginLink.href = `/login.html?lang=${encodeURIComponent(getLang())}&returnUrl=${encodeURIComponent(getReturnUrl())}`;
}

if (registerForm) {
  registerForm.addEventListener('submit', onSubmit);
}

applyText();
void checkAuthenticated();
