(function () {
  const labels = {
    vi: {
      title: 'Tài khoản cá nhân',
      subtitle: 'Theo dõi lịch sử truy cập, lộ trình đã gợi ý và các lần tạo thuyết minh của bạn.',
      logout: 'Đăng xuất',
      metricVisits: 'Lượt truy cập gần đây',
      metricNarrations: 'Lượt tạo thuyết minh',
      metricRoutes: 'Lịch trình đã gợi ý',
      visitTitle: 'Đã đi tới đâu',
      routeTitle: 'Gợi ý lịch trình đã tạo',
      narrationTitle: 'Lịch sử thuyết minh',
      noData: 'Chưa có dữ liệu.',
      dashboardError: 'Không tải được dữ liệu tài khoản.',
      customContent: 'Nội dung tùy chỉnh'
    },
    en: {
      title: 'My Account',
      subtitle: 'Track your visits, generated routes, and narration history.',
      logout: 'Logout',
      metricVisits: 'Recent visits',
      metricNarrations: 'Narrations generated',
      metricRoutes: 'Routes generated',
      visitTitle: 'Visited pages',
      routeTitle: 'Generated route suggestions',
      narrationTitle: 'Narration history',
      noData: 'No data yet.',
      dashboardError: 'Unable to load account data.',
      customContent: 'Custom content'
    },
    fr: {
      title: 'Mon compte',
      subtitle: 'Consultez votre historique de navigation, itineraires et narrations.',
      logout: 'Deconnexion',
      metricVisits: 'Visites recentes',
      metricNarrations: 'Narrations generees',
      metricRoutes: 'Itineraires generes',
      visitTitle: 'Pages visitees',
      routeTitle: 'Itineraires suggeres',
      narrationTitle: 'Historique narration',
      noData: 'Aucune donnee.',
      dashboardError: 'Impossible de charger les donnees du compte.',
      customContent: 'Contenu personnalise'
    },
    ja: {
      title: 'マイアカウント',
      subtitle: '訪問履歴、作成ルート、ナレーション履歴を確認できます。',
      logout: 'ログアウト',
      metricVisits: '最近の訪問',
      metricNarrations: '生成したナレーション',
      metricRoutes: '生成したルート',
      visitTitle: '訪問したページ',
      routeTitle: '作成したルート提案',
      narrationTitle: 'ナレーション履歴',
      noData: 'データがありません。',
      dashboardError: 'アカウントデータを読み込めません。',
      customContent: 'カスタム内容'
    },
    ko: {
      title: '내 계정',
      subtitle: '방문 기록, 생성한 경로, 내레이션 기록을 확인하세요.',
      logout: '로그아웃',
      metricVisits: '최근 방문',
      metricNarrations: '생성한 내레이션',
      metricRoutes: '생성한 경로',
      visitTitle: '방문한 페이지',
      routeTitle: '생성한 경로 추천',
      narrationTitle: '내레이션 기록',
      noData: '데이터가 없습니다.',
      dashboardError: '계정 데이터를 불러올 수 없습니다.',
      customContent: '사용자 지정 내용'
    }
  };

  const accountFullName = document.getElementById('accountFullName');
  const accountEmail = document.getElementById('accountEmail');
  const accountLogoutBtn = document.getElementById('accountLogoutBtn');
  const metricVisits = document.getElementById('metricVisits');
  const metricNarrations = document.getElementById('metricNarrations');
  const metricRoutes = document.getElementById('metricRoutes');
  const metricVisitsLabel = document.getElementById('metricVisitsLabel');
  const metricNarrationsLabel = document.getElementById('metricNarrationsLabel');
  const metricRoutesLabel = document.getElementById('metricRoutesLabel');
  const visitHistoryList = document.getElementById('visitHistoryList');
  const routeHistoryList = document.getElementById('routeHistoryList');
  const narrationHistoryList = document.getElementById('narrationHistoryList');
  const accountPageTitle = document.getElementById('accountPageTitle');
  const accountPageSubtitle = document.getElementById('accountPageSubtitle');
  const visitHistoryTitle = document.getElementById('visitHistoryTitle');
  const routeHistoryTitle = document.getElementById('routeHistoryTitle');
  const narrationHistoryTitle = document.getElementById('narrationHistoryTitle');

  function getLang() {
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    const lang = queryLang || window.siteI18n?.getSiteLanguage?.() || localStorage.getItem('siteLanguage') || 'vi';
    return labels[lang] ? lang : 'vi';
  }

  function t(key) {
    const lang = getLang();
    return labels[lang][key] || labels.vi[key] || key;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatDateTime(value) {
    if (!value) {
      return '';
    }

    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) {
      return '';
    }

    return dt.toLocaleString();
  }

  function applyStaticText() {
    if (accountPageTitle) accountPageTitle.textContent = t('title');
    if (accountPageSubtitle) accountPageSubtitle.textContent = t('subtitle');
    if (accountLogoutBtn) accountLogoutBtn.textContent = t('logout');
    if (metricVisitsLabel) metricVisitsLabel.textContent = t('metricVisits');
    if (metricNarrationsLabel) metricNarrationsLabel.textContent = t('metricNarrations');
    if (metricRoutesLabel) metricRoutesLabel.textContent = t('metricRoutes');
    if (visitHistoryTitle) visitHistoryTitle.textContent = t('visitTitle');
    if (routeHistoryTitle) routeHistoryTitle.textContent = t('routeTitle');
    if (narrationHistoryTitle) narrationHistoryTitle.textContent = t('narrationTitle');
  }

  function renderHistoryList(container, items) {
    if (!container) {
      return;
    }

    if (!items || items.length === 0) {
      container.innerHTML = `<li>${escapeHtml(t('noData'))}</li>`;
      return;
    }

    container.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
  }

  async function loadDashboard() {
    try {
      const response = await fetch('/api/account/dashboard');
      if (!response.ok) {
        throw new Error(t('dashboardError'));
      }

      const data = await response.json();
      const user = data.user || {};
      const metrics = data.metrics || {};
      const visits = Array.isArray(data.visitHistory) ? data.visitHistory : [];
      const routes = Array.isArray(data.routeHistory) ? data.routeHistory : [];
      const narrations = Array.isArray(data.narrationHistory) ? data.narrationHistory : [];

      if (accountFullName) accountFullName.textContent = user.fullName || t('title');
      if (accountEmail) accountEmail.textContent = user.email || '';
      if (metricVisits) metricVisits.textContent = String(metrics.totalVisits ?? visits.length ?? 0);
      if (metricNarrations) metricNarrations.textContent = String(metrics.totalNarrations ?? narrations.length ?? 0);
      if (metricRoutes) metricRoutes.textContent = String(metrics.totalRoutes ?? routes.length ?? 0);

      renderHistoryList(visitHistoryList, visits.map((x) => `${escapeHtml(x.path || '/')} - ${formatDateTime(x.visitedAt)}`));

      renderHistoryList(routeHistoryList, routes.map((x) => {
        const pref = x.preferences ? ` | ${escapeHtml(x.preferences)}` : '';
        const stops = x.stopSummary ? ` | ${escapeHtml(x.stopSummary)}` : '';
        return `${escapeHtml(x.planTitle || '')}${pref}${stops} - ${formatDateTime(x.createdAt)}`;
      }));

      renderHistoryList(narrationHistoryList, narrations.map((x) => {
        const locationName = x.locationName || t('customContent');
        return `${escapeHtml(locationName)} | ${escapeHtml(x.targetLanguage || '')} | ${escapeHtml(x.voiceName || '')} - ${formatDateTime(x.generatedAt)}`;
      }));
    } catch (error) {
      if (accountFullName) {
        accountFullName.textContent = error.message || t('dashboardError');
      }
      renderHistoryList(visitHistoryList, []);
      renderHistoryList(routeHistoryList, []);
      renderHistoryList(narrationHistoryList, []);
    }
  }

  function initLogout() {
    if (!accountLogoutBtn) {
      return;
    }

    accountLogoutBtn.addEventListener('click', async () => {
      accountLogoutBtn.setAttribute('disabled', 'disabled');

      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } finally {
        const lang = getLang();
        window.location.href = `/login.html?lang=${encodeURIComponent(lang)}`;
      }
    });
  }

  applyStaticText();
  initLogout();
  void loadDashboard();
})();
