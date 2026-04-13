const loginForm = document.getElementById('loginForm');
const messageBox = document.getElementById('authMessage');
const registerLink = document.getElementById('registerLink');

const labels = {
  vi: {
    title: 'Đăng nhập',
    subtitle: 'Đăng nhập để sử dụng các chức năng AI, bản đồ và thuyết minh tự động.',
    email: 'Email',
    password: 'Mật khẩu',
    passwordPlaceholder: 'Tối thiểu 6 ký tự',
    submit: 'Đăng nhập',
    submitting: 'Đang đăng nhập...',
    switchText: 'Chưa có tài khoản?',
    switchLink: 'Đăng ký ngay',
    success: 'Đăng nhập thành công. Đang chuyển trang...',
    failed: 'Đăng nhập thất bại.',
    generic: 'Có lỗi xảy ra khi đăng nhập.'
  },
  en: {
    title: 'Login',
    subtitle: 'Login to use AI features, map, and automatic narration.',
    email: 'Email',
    password: 'Password',
    passwordPlaceholder: 'At least 6 characters',
    submit: 'Login',
    submitting: 'Logging in...',
    switchText: 'No account yet?',
    switchLink: 'Register now',
    success: 'Login successful. Redirecting...',
    failed: 'Login failed.',
    generic: 'An error occurred while logging in.'
  },
  fr: {
    title: 'Connexion',
    subtitle: 'Connectez-vous pour utiliser les fonctions IA, la carte et la narration automatique.',
    email: 'Email',
    password: 'Mot de passe',
    passwordPlaceholder: 'Au moins 6 caracteres',
    submit: 'Connexion',
    submitting: 'Connexion...',
    switchText: 'Pas de compte ?',
    switchLink: 'Inscrivez-vous',
    success: 'Connexion reussie. Redirection...',
    failed: 'Echec de connexion.',
    generic: 'Une erreur est survenue pendant la connexion.'
  },
  ja: {
    title: 'ログイン',
    subtitle: 'AI機能、地図、自動ナレーションを利用するにはログインしてください。',
    email: 'メール',
    password: 'パスワード',
    passwordPlaceholder: '6文字以上',
    submit: 'ログイン',
    submitting: 'ログイン中...',
    switchText: 'アカウントをお持ちでないですか？',
    switchLink: '新規登録',
    success: 'ログイン成功。移動中...',
    failed: 'ログインに失敗しました。',
    generic: 'ログイン中にエラーが発生しました。'
  },
  ko: {
    title: '로그인',
    subtitle: 'AI 기능, 지도, 자동 내레이션을 사용하려면 로그인하세요.',
    email: '이메일',
    password: '비밀번호',
    passwordPlaceholder: '최소 6자',
    submit: '로그인',
    submitting: '로그인 중...',
    switchText: '계정이 없나요?',
    switchLink: '회원가입',
    success: '로그인 성공. 이동 중...',
    failed: '로그인에 실패했습니다.',
    generic: '로그인 중 오류가 발생했습니다.'
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
  const emailLabel = document.querySelector('label[for="email"] span') || loginForm?.querySelectorAll('label span')?.[0];
  const passwordLabel = document.querySelector('label[for="password"] span') || loginForm?.querySelectorAll('label span')?.[1];
  const passwordInput = document.getElementById('password');
  const submitBtn = loginForm?.querySelector('button[type="submit"]');
  const switchTextEl = document.querySelector('.auth-switch');

  if (titleEl) titleEl.textContent = t('title');
  if (subtitleEl) subtitleEl.textContent = t('subtitle');
  if (emailLabel) emailLabel.textContent = t('email');
  if (passwordLabel) passwordLabel.textContent = t('password');
  if (passwordInput) passwordInput.placeholder = t('passwordPlaceholder');
  if (submitBtn) submitBtn.textContent = t('submit');
  if (switchTextEl && registerLink) {
    switchTextEl.firstChild.textContent = `${t('switchText')} `;
    registerLink.textContent = t('switchLink');
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
    // Ignore network checks and keep login page visible.
  }
}

async function onSubmit(event) {
  event.preventDefault();

  if (!loginForm) {
    return;
  }

  const submitButton = loginForm.querySelector('button[type="submit"]');
  const email = document.getElementById('email')?.value?.trim() || '';
  const password = document.getElementById('password')?.value || '';
  const role = document.querySelector('input[name="role"]:checked')?.value || 'user';

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = t('submitting');
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
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
    let redirectUrl = `/?lang=${encodeURIComponent(lang)}`;
    if (role === 'merchant') {
      redirectUrl = `/merchant.html?lang=${encodeURIComponent(lang)}`;
    } else if (role === 'admin') {
      redirectUrl = `/admin.html?lang=${encodeURIComponent(lang)}`;
    }
    
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

if (registerLink) {
  registerLink.href = `/register.html?lang=${encodeURIComponent(getLang())}&returnUrl=${encodeURIComponent(getReturnUrl())}`;
}

function setupRoleSelector() {
  const roleTabs = document.querySelectorAll('.role-tab');
  const roleInput = document.getElementById('selectedRole');

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      if (roleInput) {
        roleInput.value = tab.dataset.role || 'user';
      }

      const roleContents = document.querySelectorAll('.role-tab-content');
      roleContents.forEach(content => content.classList.remove('active'));
      
      const activeContent = document.querySelector(`.role-tab-content[data-role="${tab.dataset.role}"]`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', onSubmit);
}

applyText();
setupRoleSelector();
void checkAuthenticated();
