/**
 * Features: countdown, love meter, typewriter, reasons, compliments,
 * password letter, gift box, music, theme toggle, dreams
 */
const Features = (function () {
  'use strict';

  let reasonSeen = new Set();
  let msgIdx = 0, charIdx = 0, typing = false;

  function initHero() {
    document.getElementById('heroEyebrow').textContent = CONFIG.hero.eyebrow;
    document.getElementById('heroTitle').textContent = CONFIG.hero.title;
    document.getElementById('heroSubtitle').textContent = CONFIG.hero.subtitle;
  }

  /* Birthday Countdown */
  function initCountdown() {
    const { day, month } = CONFIG.birthday;

    function tick() {
      const now = new Date();
      let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0);
      if (now >= target) target = new Date(now.getFullYear() + 1, month - 1, day);

      const diff = target - now;
      const isToday = diff < 86400000 && now.getDate() === day && now.getMonth() === month - 1;

      if (isToday) {
        document.getElementById('countdownNote').textContent = '🎉 Happy Birthday Mannu! Today is YOUR day! 🎂';
        ['cdDays','cdHours','cdMins','cdSecs'].forEach((id) => document.getElementById(id).textContent = '🎂');
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      document.getElementById('cdDays').textContent = String(d).padStart(2, '0');
      document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
      document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
      document.getElementById('cdSecs').textContent = String(s).padStart(2, '0');
      document.getElementById('countdownNote').textContent = `Until Mannu's birthday on ${CONFIG.birthday.label} 🎂`;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* Love Meter */
  function initLoveMeter() {
    const bar = document.getElementById('lovemeterBar');
    const label = document.getElementById('lovemeterLabel');
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => { bar.style.width = '100%'; }, 300);
        setTimeout(() => { label.textContent = '∞ Infinite Love for Mannu ❤️'; }, 2800);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(document.getElementById('lovemeter'));
  }

  /* Typewriter */
  function initTypewriter() {
    const out = document.getElementById('typewriterOutput');
    const msgs = CONFIG.typewriterMessages;

    function typeMsg() {
      if (charIdx < msgs[msgIdx].length) {
        out.textContent += msgs[msgIdx][charIdx++];
        setTimeout(typeMsg, 45);
      } else {
        setTimeout(() => {
          out.textContent = '';
          charIdx = 0;
          msgIdx = (msgIdx + 1) % msgs.length;
          typeMsg();
        }, 2500);
      }
    }

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !typing) { typing = true; typeMsg(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(document.getElementById('messages'));
  }

  /* 100 Reasons */
  function initReasons() {
    const text = document.getElementById('reasonText');
    const num = document.getElementById('reasonNumber');
    const counter = document.getElementById('reasonCounter');

    function showReason() {
      const pool = CONFIG.reasons100.filter((_, i) => !reasonSeen.has(i));
      if (!pool.length) { reasonSeen.clear(); }
      const idx = Math.floor(Math.random() * CONFIG.reasons100.length);
      reasonSeen.add(idx);
      text.style.opacity = '0';
      setTimeout(() => {
        num.textContent = `#${idx + 1}`;
        text.textContent = CONFIG.reasons100[idx];
        text.style.opacity = '1';
        counter.textContent = `${reasonSeen.size} / 100 discovered`;
      }, 200);
    }

    document.getElementById('reasonBtn')?.addEventListener('click', showReason);
    showReason();
  }

  /* Compliments */
  function initCompliments() {
    const el = document.getElementById('complimentText');
    function show() {
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = CONFIG.compliments[Math.floor(Math.random() * CONFIG.compliments.length)];
        el.style.opacity = '1';
      }, 200);
    }
    document.getElementById('complimentBtn')?.addEventListener('click', show);
    show();
  }

  /* Dreams */
  function initDreams() {
    const grid = document.getElementById('dreamsGrid');
    CONFIG.dreams.forEach((d) => {
      const card = document.createElement('div');
      card.className = 'dream-card reveal';
      card.innerHTML = `<div class="dream-icon">${d.icon}</div><h3>${d.title}</h3><p>${d.text}</p>`;
      grid.appendChild(card);
    });
  }

  /* Password Letter */
  function initLetter() {
    const lock = document.getElementById('letterLock');
    const content = document.getElementById('letterContent');
    const err = document.getElementById('letterError');

    function unlock() {
      const val = document.getElementById('letterPassword').value.trim().toLowerCase();
      if (val === CONFIG.letterPassword.toLowerCase()) {
        lock.hidden = true;
        content.hidden = false;
        document.getElementById('letterBody').textContent = CONFIG.loveLetter;
        err.hidden = true;
      } else {
        err.hidden = false;
        document.getElementById('letterPassword').value = '';
      }
    }

    document.getElementById('letterUnlock')?.addEventListener('click', unlock);
    document.getElementById('letterPassword')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') unlock(); });
  }

  /* Gift Box + Fireworks */
  function initSurprise() {
    const box = document.getElementById('giftBox');
    const msg = document.getElementById('surpriseMessage');
    let opened = false;

    box?.addEventListener('click', () => {
      if (opened) return;
      opened = true;
      box.classList.add('open');
      if (typeof launchFireworks === 'function') launchFireworks();
      setTimeout(() => {
        msg.hidden = false;
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 800);
    });
  }

  /* Theme Toggle */
  function initTheme() {
    const btn = document.getElementById('themeToggle');
    const html = document.documentElement;
    btn?.addEventListener('click', () => {
      const next = html.dataset.theme === 'night' ? 'day' : 'night';
      html.dataset.theme = next;
      btn.textContent = next === 'night' ? '🌙' : '☀️';
      localStorage.setItem('mannu-theme', next);
    });
    const saved = localStorage.getItem('mannu-theme');
    if (saved) { html.dataset.theme = saved; btn.textContent = saved === 'night' ? '🌙' : '☀️'; }
  }

  /* Music Player */
  function initMusic() {
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    const slider = document.getElementById('volumeSlider');
    const panel = document.getElementById('musicPlayer');
    if (!audio) return;

    audio.volume = 0.4;
    panel?.classList.add('visible');

    toggle?.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {
          alert('Add a romantic song as music/love.mp3 to enable music! 🎵');
        });
        toggle.classList.add('playing');
      } else {
        audio.pause();
        toggle.classList.remove('playing');
      }
    });

    slider?.addEventListener('input', () => { audio.volume = slider.value / 100; });
  }

  return {
    init() {
      initHero();
      initCountdown();
      initLoveMeter();
      initTypewriter();
      initReasons();
      initCompliments();
      initDreams();
      initLetter();
      initSurprise();
      initTheme();
      initMusic();
    },
  };
})();
