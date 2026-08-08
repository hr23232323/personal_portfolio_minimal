const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    const startedAt = contactForm.querySelector('[name="started_at"]');
    const status = contactForm.querySelector('#contact-status');
    const submit = contactForm.querySelector('button[type="submit"]');
    const defaultStatus = status.textContent;

    startedAt.value = Date.now().toString();

    contactForm.addEventListener('input', () => {
        if (status.dataset.state === 'error') {
            status.textContent = defaultStatus;
            delete status.dataset.state;
        }
    });

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        const endpoint = contactForm.dataset.endpoint;
        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData.entries());

        submit.disabled = true;
        submit.textContent = 'Sending...';
        status.textContent = 'Sending your note directly to Harsh.';
        delete status.dataset.state;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Request failed');

            contactForm.reset();
            startedAt.value = Date.now().toString();
            status.textContent = 'Sent. Thanks for reaching out. I’ll get back to you soon.';
            status.dataset.state = 'success';
            submit.textContent = 'Note sent ✓';
        } catch {
            status.textContent = 'Something went wrong. Please email me directly instead.';
            status.dataset.state = 'error';
            submit.textContent = 'Send a note ↗';
            submit.disabled = false;
        }
    });
}
