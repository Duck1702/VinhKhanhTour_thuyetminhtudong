(function () {
  const langSelect = document.getElementById('demoLanguage');
  const stopBtn = document.getElementById('stopDemoSpeech');
  const status = document.getElementById('demoStatus');
  const grid = document.getElementById('demoLocationsGrid');
  const audioPlayer = document.getElementById('demoAudioPlayer');

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let voices = [];

  const langMap = {
    vi: 'vi-VN',
    en: 'en-US',
    fr: 'fr-FR',
    ja: 'ja-JP',
    ko: 'ko-KR'
  };

  function setStatus(message, warning) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('warning', Boolean(warning));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function getSelectedLanguage() {
    return langSelect?.value || 'vi';
  }

  function refreshVoices() {
    if (!speechSupported) return;
    voices = window.speechSynthesis.getVoices();
  }

  function pickVoice(langCode) {
    const bcp47 = langMap[langCode] || 'en-US';
    const primary = bcp47.split('-')[0];

    const exact = voices.find((v) => v.lang.toLowerCase() === bcp47.toLowerCase());
    if (exact) {
      return exact;
    }

    if (langCode === 'vi') {
      const viNamed = voices.find((v) => {
        const name = (v.name || '').toLowerCase();
        const lang = (v.lang || '').toLowerCase();
        return lang.startsWith('vi') || name.includes('viet') || name.includes('hoaimy');
      });

      if (viNamed) {
        return viNamed;
      }
    }

    return voices.find((v) => v.lang.toLowerCase().startsWith(primary.toLowerCase())) || null;
  }

  function buildNarration(location, lang) {
    const localized = window.localizeLocationData ? window.localizeLocationData(location, lang) : location;
    return `${localized.name}. ${localized.shortIntro} ${localized.highlight}. ${localized.descriptionVi}`;
  }

  function speakLocation(location) {
    if (!speechSupported) {
      setStatus('Trình duyệt không hỗ trợ Web Speech API.', true);
      return;
    }

    const lang = getSelectedLanguage();
    const utterance = new SpeechSynthesisUtterance(buildNarration(location, lang));
    utterance.lang = langMap[lang] || 'vi-VN';
    utterance.rate = 1;
    utterance.pitch = 1;

    const voice = pickVoice(lang);
    if (!voice) {
      if (lang === 'vi') {
        speakWithSystemDefault(
          location,
          lang,
          'Thiết bị chưa có voice tiếng Việt chuẩn. Đang đọc bằng giọng hệ thống mặc định (có thể hơi khác giọng).'
        );
        return;
      }

      playServerFallback(location, lang);
      return;
    }

    utterance.voice = voice;

    utterance.onstart = function () {
      setStatus(`Đang đọc: ${location.name} (${utterance.lang} - ${voice.name})`, false);
    };

    utterance.onend = function () {
      setStatus(`Đã đọc xong: ${location.name}`, false);
    };

    utterance.onerror = function () {
      setStatus('Không thể đọc bằng Web Speech API trên thiết bị này.', true);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function speakWithSystemDefault(location, lang, notice) {
    if (!speechSupported) {
      setStatus('Trình duyệt không hỗ trợ Web Speech API.', true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(buildNarration(location, lang));
    utterance.lang = langMap[lang] || 'vi-VN';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = function () {
      setStatus(notice || `Đang đọc bằng giọng hệ thống: ${location.name}`, true);
    };

    utterance.onend = function () {
      setStatus(`Đã đọc xong: ${location.name}`, false);
    };

    utterance.onerror = function () {
      setStatus('Không thể đọc bằng giọng hệ thống mặc định.', true);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  async function playServerFallback(location, lang) {
    if (!audioPlayer) {
      setStatus('Không thể phát fallback audio trên trang demo.', true);
      return;
    }

    const warning = lang === 'vi'
      ? 'Thiết bị chưa có voice tiếng Việt. Đang chuyển sang phát audio từ server...'
      : `Không tìm thấy voice ${langMap[lang] || lang}. Đang chuyển sang phát audio từ server...`;

    setStatus(warning, true);

    try {
      const response = await fetch('/api/narrations/instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: location.id,
          targetLanguage: lang
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.detail || result?.message || 'Không tạo được audio fallback.');
      }

      if (result.voiceName === 'demo-fallback-tone') {
        speakWithSystemDefault(
          location,
          lang,
          'Server chưa cấu hình Speech API nên không tạo được giọng cloud. Đang đọc bằng giọng hệ thống mặc định.'
        );
        return;
      }

      audioPlayer.classList.remove('hidden');
      audioPlayer.src = result.audioUrl;
      await audioPlayer.play();
      setStatus(`Đang phát fallback audio: ${location.name} (${langMap[lang] || lang})`, false);
    } catch (error) {
      setStatus(error.message || 'Không thể phát fallback audio.', true);
    }
  }

  function renderLocations(locations) {
    if (!grid) return;

    grid.innerHTML = locations.map((location) => `
      <article class="card">
        <h3>${escapeHtml(location.name)}</h3>
        <p>${escapeHtml(location.shortIntro)}</p>
        <p style="margin-top:.4rem; color:var(--text-secondary);">${escapeHtml(location.bestTime)} | ${escapeHtml(location.category)}</p>
        <button class="button button-primary" type="button" data-speak-id="${escapeHtml(location.id)}">Nghe demo miễn phí</button>
      </article>
    `).join('');

    grid.querySelectorAll('[data-speak-id]').forEach((btn) => {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-speak-id');
        const location = locations.find((x) => x.id === id);
        if (location) {
          speakLocation(location);
        }
      });
    });
  }

  async function init() {
    if (speechSupported) {
      refreshVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = refreshVoices;
      }
    } else {
      setStatus('Trình duyệt không hỗ trợ Web Speech API. Demo sẽ dùng fallback audio từ server.', true);
    }

    try {
      const response = await fetch('/api/locations');
      if (!response.ok) {
        throw new Error('Không tải được dữ liệu địa điểm.');
      }

      const data = await response.json();
      const locations = Array.isArray(data) ? data : (data.value || []);
      renderLocations(locations);
      setStatus('Sẵn sàng demo. Chọn ngôn ngữ và bấm nghe thử.', false);
    } catch (error) {
      setStatus(error.message || 'Lỗi tải dữ liệu.', true);
    }
  }

  stopBtn?.addEventListener('click', function () {
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
    setStatus('Đã dừng đọc.', false);
  });

  init();
})();
