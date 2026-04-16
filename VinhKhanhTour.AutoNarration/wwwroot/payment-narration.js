(function () {
  const PARTICIPANT_KEY = 'vktour.publicParticipantId';

  function getLanguage() {
    const lang = window.siteI18n?.getSiteLanguage?.() || localStorage.getItem('siteLanguage') || 'vi';
    const supported = new Set(['vi', 'en', 'fr', 'ja', 'ko']);
    return supported.has(lang) ? lang : 'vi';
  }

  function getOrCreateParticipantId() {
    const existing = localStorage.getItem(PARTICIPANT_KEY);
    if (existing && existing.trim()) {
      return existing;
    }

    const generated = globalThis.crypto?.randomUUID?.() || `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(PARTICIPANT_KEY, generated);
    return generated;
  }

  function toCurrencyText(value, currencyCode, locale) {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: currencyCode === 'VND' ? 0 : 2
      }).format(Number(value || 0));
    } catch {
      return `${Number(value || 0)} ${currencyCode}`;
    }
  }

  function getLocaleByLanguage(lang) {
    switch (lang) {
      case 'en': return 'en-US';
      case 'fr': return 'fr-FR';
      case 'ja': return 'ja-JP';
      case 'ko': return 'ko-KR';
      default: return 'vi-VN';
    }
  }

  function ensureModal() {
    let modal = document.getElementById('narrationPaymentModal');
    if (modal) {
      return modal;
    }

    modal = document.createElement('div');
    modal.id = 'narrationPaymentModal';
    modal.className = 'narration-payment-modal hidden';
    modal.innerHTML = `
      <div class="narration-payment-backdrop" data-payment-close></div>
      <div class="narration-payment-card">
        <h3 id="narrationPaymentTitle">Thanh toán nghe thuyết minh</h3>
        <p id="narrationPaymentDesc">Mỗi lượt nghe có phí theo ngôn ngữ bạn chọn.</p>
        <div class="narration-payment-amounts">
          <p><strong>Số tiền:</strong> <span id="narrationPaymentAmount"></span></p>
          <p><strong>Quy đổi VND:</strong> <span id="narrationPaymentAmountVnd"></span></p>
        </div>
        <div class="narration-payment-actions">
          <button id="narrationPaymentCancel" type="button" class="button button-secondary">Hủy</button>
          <button id="narrationPaymentConfirm" type="button" class="button button-primary">Thanh toán & nghe</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  async function openPaymentDialog(quote) {
    const modal = ensureModal();
    const amountEl = document.getElementById('narrationPaymentAmount');
    const amountVndEl = document.getElementById('narrationPaymentAmountVnd');
    const cancelBtn = document.getElementById('narrationPaymentCancel');
    const confirmBtn = document.getElementById('narrationPaymentConfirm');
    const backdrop = modal.querySelector('[data-payment-close]');

    const locale = getLocaleByLanguage(quote.language);
    if (amountEl) {
      amountEl.textContent = toCurrencyText(quote.amount, quote.currencyCode, locale);
    }
    if (amountVndEl) {
      amountVndEl.textContent = toCurrencyText(quote.amountVnd, 'VND', 'vi-VN');
    }

    modal.classList.remove('hidden');

    return await new Promise((resolve) => {
      const cleanup = () => {
        modal.classList.add('hidden');
        cancelBtn?.removeEventListener('click', onCancel);
        confirmBtn?.removeEventListener('click', onConfirm);
        backdrop?.removeEventListener('click', onCancel);
      };

      const onCancel = () => {
        cleanup();
        resolve(false);
      };

      const onConfirm = () => {
        cleanup();
        resolve(true);
      };

      cancelBtn?.addEventListener('click', onCancel);
      confirmBtn?.addEventListener('click', onConfirm);
      backdrop?.addEventListener('click', onCancel);
    });
  }

  async function payForNarration(input) {
    const locationId = String(input?.locationId || '').trim();
    const targetLanguage = String(input?.targetLanguage || getLanguage()).trim().toLowerCase();
    if (!locationId) {
      throw new Error('Thiếu locationId để thanh toán.');
    }

    const quoteRes = await fetch(`/api/public/narrations/pricing?lang=${encodeURIComponent(targetLanguage)}`);
    const quote = await quoteRes.json();
    if (!quoteRes.ok) {
      throw new Error(quote?.message || 'Không lấy được thông tin giá nghe thuyết minh.');
    }

    const accepted = await openPaymentDialog(quote);
    if (!accepted) {
      throw new Error('Bạn đã hủy thanh toán.');
    }

    const participantId = getOrCreateParticipantId();
    const payRes = await fetch('/api/public/narrations/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantId,
        locationId,
        targetLanguage
      })
    });

    const payResult = await payRes.json();
    if (!payRes.ok || !payResult?.paymentToken) {
      throw new Error(payResult?.message || 'Thanh toán không thành công.');
    }

    return {
      participantId,
      paymentToken: payResult.paymentToken
    };
  }

  window.narrationPayment = {
    getOrCreateParticipantId,
    payForNarration
  };
})();
