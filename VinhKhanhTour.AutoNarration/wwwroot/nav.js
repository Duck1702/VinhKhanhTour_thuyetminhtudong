(function () {
  const nav = document.querySelector('nav');
  if (!nav) {
    return;
  }

  const authMessages = {
    vi: { account: 'Tài khoản cá nhân', login: 'Đăng nhập', register: 'Đăng ký', logout: 'Đăng xuất' },
    en: { account: 'My Account', login: 'Login', register: 'Register', logout: 'Logout' },
    fr: { account: 'Mon compte', login: 'Connexion', register: 'Inscription', logout: 'Deconnexion' },
    ja: { account: 'マイアカウント', login: 'ログイン', register: '登録', logout: 'ログアウト' },
    ko: { account: '내 계정', login: '로그인', register: '회원가입', logout: '로그아웃' }
  };

  function getLang() {
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    const current = queryLang || window.siteI18n?.getSiteLanguage?.() || localStorage.getItem('siteLanguage') || 'vi';
    return authMessages[current] ? current : 'vi';
  }

  function t(key) {
    const lang = getLang();
    return authMessages[lang][key] || authMessages.vi[key] || key;
  }

  function getNavTools() {
    let tools = nav.querySelector('.nav-tools');
    if (tools) {
      return tools;
    }

    tools = document.createElement('div');
    tools.className = 'nav-tools';
    nav.appendChild(tools);
    return tools;
  }

  function createLanguageSelector() {
    // Skip language selector for admin and merchant pages (Vietnamese only)
    const path = (window.location.pathname || '/').toLowerCase();
    if (path.includes('admin') || path.includes('merchant')) {
      return;
    }

    if (nav.querySelector('.language-switcher')) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'language-switcher';

    const label = document.createElement('label');
    label.setAttribute('for', 'site-language-select');
    const current = window.siteI18n?.getSiteLanguage?.() || 'vi';
    label.textContent = window.siteI18n?.translate?.('label_language', current) || 'Language';

    const select = document.createElement('select');
    select.id = 'site-language-select';
    select.setAttribute('aria-label', 'Site language');

    const options = [
      { value: 'vi', label: 'Tiếng Việt' },
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'Francais' },
      { value: 'ja', label: '日本語' },
      { value: 'ko', label: '한국어' }
    ];

    options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      select.appendChild(option);
    });

    select.value = current;

    select.addEventListener('change', () => {
      const selected = select.value || 'vi';
      if (window.siteI18n?.setSiteLanguage) {
        window.siteI18n.setSiteLanguage(selected);
      }

      const url = new URL(window.location.href);
      url.searchParams.set('lang', selected);
      window.location.href = url.toString();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    getNavTools().appendChild(wrapper);
  }

  async function fetchCurrentUser() {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  }

  function getReturnUrl() {
    const path = `${window.location.pathname || '/'}${window.location.search || ''}`;
    return encodeURIComponent(path || '/');
  }

  function withLang(path) {
    const lang = getLang();
    const url = new URL(path, window.location.origin);
    url.searchParams.set('lang', lang);
    return `${url.pathname}${url.search}`;
  }

  function createAuthActions(user) {
    // No auth buttons displayed - admin/merchant access only via direct URLs
  }

  createLanguageSelector();
  void fetchCurrentUser().then(createAuthActions);

  const selectedLang = getLang();
  nav.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) {
      return;
    }

    const url = new URL(href, window.location.origin);
    url.searchParams.set('lang', selectedLang);
    link.setAttribute('href', `${url.pathname}${url.search}`);
  });

  const path = (window.location.pathname || '/').toLowerCase();
  const normalizedPath = path === '/index.html' ? '/' : path;

  nav.querySelectorAll('.nav-links a').forEach((link) => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (!href || href.startsWith('#')) {
      return;
    }

    const linkPath = new URL(href, window.location.origin).pathname.toLowerCase();
    const normalizedHref = linkPath === '/index.html' ? '/' : linkPath;
    const isActive = normalizedHref === normalizedPath;

    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
})();
