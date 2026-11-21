document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form.about-contact-form');
  if (!forms.length) return;

  function renderThankYou(form, formType, originalHtml) {
    const isReseller = formType === 'aterforsaljare';
    const baseUrl = isReseller ? '/aterforsaljare' : '/kontakt';
    const title = isReseller ? 'Tack för din intresseanmälan!' : 'Tack för ditt meddelande!';
    const body = isReseller
      ? 'Vi har tagit emot din intresseanmälan och återkommer till dig så snart som möjligt.'
      : 'Vi har tagit emot din förfrågan och hör av oss inom 24 timmar.';

    form.innerHTML = `
      <div class="contact-thank-you" style="text-align: center; padding: 2.5rem 1.5rem;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #f0fdf4; border: 1px solid #bbf7d0; color: #64b000; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 style="font-size: 1.85rem; font-weight: 800; color: #111827; margin-bottom: 0.75rem; letter-spacing: -0.02em;">${title}</h2>
        <p style="font-size: 1.05rem; color: #4b5563; max-width: 420px; margin: 0 auto 2rem auto; line-height: 1.6;">${body}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;">
          <a href="/" style="display: inline-flex; align-items: center; justify-content: center; background: #64b000; color: #ffffff; padding: 0.85rem 1.75rem; border-radius: 8px; font-weight: 600; font-size: 0.95rem; text-decoration: none;">Tillbaka till startsidan</a>
          <button type="button" class="reset-contact-form-btn" style="display: inline-flex; align-items: center; justify-content: center; background: #f3f4f6; color: #111827; padding: 0.85rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 0.95rem; border: 1px solid #e5e7eb; cursor: pointer;">Skicka ett nytt meddelande</button>
        </div>
      </div>
    `;

    const resetBtn = form.querySelector('.reset-contact-form-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        try {
          window.history.pushState({}, '', baseUrl);
        } catch (e) {}
        form.innerHTML = originalHtml;
        attachFormHandler(form);
      });
    }
  }

  function attachFormHandler(form) {
    const formType = form.dataset.formType || 'kontakt';
    const originalHtml = form.innerHTML;

    // Create status message container for errors
    let statusEl = form.querySelector('.form-status-message');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'form-status-message';
      statusEl.setAttribute('role', 'status');
      statusEl.setAttribute('aria-live', 'polite');
      statusEl.style.display = 'none';
      statusEl.style.marginTop = '1rem';
      statusEl.style.padding = '0.95rem 1.15rem';
      statusEl.style.borderRadius = '8px';
      statusEl.style.fontSize = '0.95rem';
      statusEl.style.fontWeight = '500';
      statusEl.style.lineHeight = '1.5';
      statusEl.style.textAlign = 'left';
      form.appendChild(statusEl);
    }

    // If user lands directly on /kontakt-tack or /aterforsaljare-tack, show thank-you view
    const currentPath = window.location.pathname.replace(/\/+$/, '');
    if (currentPath.endsWith('-tack')) {
      renderThankYou(form, formType, originalHtml);
      return;
    }

    form.onsubmit = async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      const formData = new FormData(form);
      const payload = {
        formType,
        company: formData.get('company') || '',
        orgnr: formData.get('orgnr') || '',
        name: formData.get('name') || formData.get('contact') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        address: formData.get('address') || '',
        zip: formData.get('zip') || '',
        city: formData.get('city') || '',
        businessType: formData.get('type') || '',
        message: formData.get('message') || '',
        website: formData.get('website') || '',
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.textContent = 'Skickar...';
      }
      statusEl.style.display = 'none';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          const thankYouUrl = formType === 'aterforsaljare' ? '/aterforsaljare-tack' : '/kontakt-tack';

          // Update URL for Google Ads & Google Tag Manager (History Change / Pageview trigger)
          try {
            window.history.pushState({ formSubmitted: true, formType }, '', thankYouUrl);
          } catch (err) {}

          // Push event to GTM dataLayer if present
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'form_submit_success',
            form_type: formType,
            page_path: thankYouUrl,
          });

          // Replace form with clean thank-you box
          renderThankYou(form, formType, originalHtml);
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error(data.error || 'Något gick fel');
        }
      } catch (err) {
        statusEl.style.display = 'block';
        statusEl.style.backgroundColor = '#fef2f2';
        statusEl.style.color = '#991b1b';
        statusEl.style.border = '1px solid #fecaca';
        statusEl.textContent =
          'Kunde inte skicka meddelandet just nu. Försök igen eller mejla oss direkt på info@mathornet.se.';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
          submitBtn.textContent = originalBtnText;
        }
      }
    };
  }

  forms.forEach((form) => attachFormHandler(form));
});
