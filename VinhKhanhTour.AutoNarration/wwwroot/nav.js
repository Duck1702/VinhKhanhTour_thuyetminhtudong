(function () {
  const nav = document.querySelector('nav');
  if (!nav) {
    return;
  }

  function createLanguageSelector() {
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
    nav.appendChild(wrapper);
  }

  createLanguageSelector();

  const selectedLang = window.siteI18n?.getSiteLanguage?.() || 'vi';
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
