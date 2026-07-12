// Renvo landing — FAQ accordion + smooth anchor scroll
document.querySelectorAll('.faq-q').forEach((q) => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('contact-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'Sending…';
    status.className = 'contact-status';
    try {
      const res = await fetch('https://formsubmit.co/ajax/RenvoAI@outlook.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm),
      });
      if (!res.ok) throw new Error('Request failed');
      status.textContent = "Thanks — we'll be in touch soon.";
      status.className = 'contact-status success';
      contactForm.reset();
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again.';
      status.className = 'contact-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
