/**
 * Main init: loader, nav, scroll reveal
 */
(function () {
  'use strict';

  const loader = document.getElementById('loader');
  const fill = document.querySelector('.loader-bar-fill');
  let prog = 0;

  const progTimer = setInterval(() => {
    if (prog < 88) { prog += Math.random() * 6; if (fill) fill.style.width = prog + '%'; }
  }, 180);

  function hideLoader() {
    clearInterval(progTimer);
    if (fill) fill.style.width = '100%';
    setTimeout(() => loader?.classList.add('hidden'), 500);
  }

  function setupNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    toggle?.addEventListener('click', () => links?.classList.toggle('open'));
    links?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
  }

  function setupReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal, .polaroid').forEach((el) => obs.observe(el));

    // Re-observe dynamically added elements
    setTimeout(() => {
      document.querySelectorAll('.dream-card, .polaroid').forEach((el) => obs.observe(el));
    }, 500);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    setupNav();
    Features.init();
    HeartGame.init();

    try { await Gallery.init(); } catch (e) { console.error(e); }

    hideLoader();
    setTimeout(setupReveal, 200);
  });
})();
