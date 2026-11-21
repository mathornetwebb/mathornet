document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form.about-contact-form');
  if (!forms.length) return;

  forms.forEach((form) => {
    // Create status message container if not already present
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

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      const formData = new FormData(form);
      const payload = {
        formType: form.dataset.formType || 'kontakt',
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
          statusEl.style.display = 'block';
          statusEl.style.backgroundColor = '#f0fdf4';
          statusEl.style.color = '#166534';
          statusEl.style.border = '1px solid #bbf7d0';
          statusEl.textContent =
            payload.formType === 'aterforsaljare'
              ? 'Tack för din intresseanmälan! Vi återkommer till dig så snart som möjligt.'
              : 'Tack för ditt meddelande! Vi hör av oss inom 24 timmar.';
          form.reset();
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
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });
});
