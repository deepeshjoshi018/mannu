/**
 * Visual effects: particles, petals, cursor, fireworks, parallax, floating hearts
 */
(function () {
  'use strict';

  /* --- Custom Cursor --- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  const useCursor = dot && ring && matchMedia('(min-width:769px) and (hover:hover) and (pointer:fine)').matches;
  if (useCursor) {
    document.body.classList.add('custom-cursor-active');
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    })();
    document.body.addEventListener('mouseover', (e) => {
      ring.classList.toggle('hover', !!e.target.closest('a,button,.gallery-item,.polaroid,.game-heart,.gift-box,.filter-btn'));
    });
  } else { dot?.remove(); ring?.remove(); }

  /* --- Particle Canvas --- */
  const pCanvas = document.getElementById('particleCanvas');
  if (pCanvas) {
    const ctx = pCanvas.getContext('2d');
    let W, H, pts = [];
    const resize = () => { W = pCanvas.width = innerWidth; H = pCanvas.height = innerHeight; };
    resize(); addEventListener('resize', resize);

    class Pt {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.r = Math.random() * 2.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.35; this.vy = (Math.random() - 0.5) * 0.35;
        this.a = Math.random() * 0.4 + 0.15;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.init();
      }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,143,177,${this.a})`; ctx.fill();
      }
    }
    for (let i = 0; i < 70; i++) pts.push(new Pt());

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => { p.update(); p.draw(); });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.strokeStyle = `rgba(236,64,122,${0.06 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(loop);
    })();
  }

  /* --- Rose Petals --- */
  const petalCanvas = document.getElementById('petalCanvas');
  if (petalCanvas) {
    const pCtx = petalCanvas.getContext('2d');
    let pW, pH, petals = [];
    const pResize = () => { pW = petalCanvas.width = innerWidth; pH = petalCanvas.height = innerHeight; };
    pResize(); addEventListener('resize', pResize);

    function spawnPetal() {
      petals.push({
        x: Math.random() * pW, y: -20,
        w: Math.random() * 12 + 8, h: Math.random() * 8 + 5,
        speed: Math.random() * 1.5 + 0.8, rot: Math.random() * 360,
        rotSpd: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.4 + 0.2,
        sway: Math.random() * 2,
        swayOff: Math.random() * Math.PI * 2,
      });
    }
    setInterval(spawnPetal, 600);

    (function petalLoop() {
      pCtx.clearRect(0, 0, pW, pH);
      petals = petals.filter((p) => p.y < pH + 30);
      petals.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.y * 0.02 + p.swayOff) * p.sway;
        p.rot += p.rotSpd;
        pCtx.save();
        pCtx.translate(p.x, p.y);
        pCtx.rotate((p.rot * Math.PI) / 180);
        pCtx.globalAlpha = p.opacity;
        pCtx.fillStyle = '#f48fb1';
        pCtx.beginPath();
        pCtx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
      });
      requestAnimationFrame(petalLoop);
    })();
  }

  /* --- Floating Hearts --- */
  const hearts = ['❤', '💕', '💗', '♥'];
  setInterval(() => {
    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 1 + 0.6) + 'rem';
    el.style.setProperty('--dur', (Math.random() * 5 + 6) + 's');
    el.style.color = `rgba(236,64,122,${Math.random() * 0.3 + 0.2})`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }, 2000);

  /* --- Fireworks --- */
  window.launchFireworks = function () {
    const fc = document.getElementById('fireworksCanvas');
    if (!fc) return;
    const fCtx = fc.getContext('2d');
    fc.width = innerWidth; fc.height = innerHeight;
    const particles = [];
    const colors = ['#ec407a', '#f48fb1', '#ce93d8', '#e8b4b8', '#fff', '#f5d0c5'];

    for (let b = 0; b < 6; b++) {
      setTimeout(() => {
        const cx = Math.random() * fc.width * 0.6 + fc.width * 0.2;
        const cy = Math.random() * fc.height * 0.4 + fc.height * 0.1;
        const col = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 60; i++) {
          const angle = (Math.PI * 2 * i) / 60;
          const speed = Math.random() * 5 + 3;
          particles.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, col, life: 1, size: Math.random() * 3 + 1 });
        }
      }, b * 400);
    }

    let frame = 0;
    (function fwLoop() {
      fCtx.fillStyle = 'rgba(10,5,15,0.15)';
      fCtx.fillRect(0, 0, fc.width, fc.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.life -= 0.012;
        if (p.life > 0) {
          fCtx.globalAlpha = p.life;
          fCtx.fillStyle = p.col;
          fCtx.beginPath(); fCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); fCtx.fill();
        }
      });
      fCtx.globalAlpha = 1;
      frame++;
      if (frame < 200) requestAnimationFrame(fwLoop);
      else fCtx.clearRect(0, 0, fc.width, fc.height);
    })();
  };

  /* --- Parallax --- */
  const hero = document.querySelector('.hero-parallax');
  if (hero) {
    addEventListener('scroll', () => {
      const y = scrollY * 0.3;
      hero.style.transform = `translateY(${y}px)`;
    }, { passive: true });
  }
})();
