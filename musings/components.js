// Shared musing chrome: scroll progress + chapter pill.
// Per-musing custom JS (interactives, etc.) lives inline in the page.

(function () {
  const bar = document.getElementById('progressBar');
  const pill = document.getElementById('chapterPill');
  const num = document.getElementById('chapterNum');
  const title = document.getElementById('chapterTitle');
  const sections = [...document.querySelectorAll('.section-break')];

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (bar) bar.style.width = pct + '%';

    if (!pill) return;
    let active = null;
    for (const s of sections) {
      if (s.getBoundingClientRect().top < 140) active = s;
    }
    if (active) {
      num.textContent = active.dataset.chapter;
      title.textContent = active.dataset.title;
      pill.classList.add('visible');
    } else {
      pill.classList.remove('visible');
    }
  }

  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
