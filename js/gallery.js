/**
 * Gallery, Polaroid wall, Lightbox
 */
const Gallery = (function () {
  'use strict';
  let photos = [], filtered = [], lbIdx = 0, lbList = [];

  async function load() {
    let raw = CONFIG.embeddedPhotos;
    if (!raw?.length) {
      try { raw = (await (await fetch('js/photos.json')).json()).photos; } catch (_) {}
    }
    photos = (raw || []).map((p) => ({
      ...p, src: getPhotoUrl(p),
      category: getPhotoCategory(p.name),
      caption: getPhotoCaption(p.name),
    }));
    filtered = [...photos];
    renderMasonry();
    renderPolaroids();
    renderHeroStrip();
  }

  function renderMasonry() {
    const el = document.getElementById('galleryMasonry');
    if (!el) return;
    el.innerHTML = '';
    filtered.forEach((p, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `<div class="gallery-item-inner">
        <img src="${p.src}" alt="${p.caption}" loading="${i < 6 ? 'eager' : 'lazy'}" onerror="this.src='${p.drive||''}'">
        <div class="gallery-overlay"><span>${p.caption}</span></div>
      </div>`;
      item.addEventListener('click', () => { lbList = [...filtered]; openLb(i); });
      el.appendChild(item);
      setTimeout(() => item.classList.add('visible'), i * 50);
    });
  }

  function renderPolaroids() {
    const wall = document.getElementById('polaroidWall');
    if (!wall) return;
    const picks = [...photos].sort(() => Math.random() - 0.5).slice(0, Math.min(12, photos.length));
    picks.forEach((p, i) => {
      const rot = (i % 2 === 0 ? -1 : 1) * (Math.random() * 5 + 2);
      const div = document.createElement('div');
      div.className = 'polaroid reveal';
      div.style.setProperty('--rot', rot + 'deg');
      div.innerHTML = `<img src="${p.src}" alt="${p.caption}" loading="lazy" onerror="this.src='${p.drive||''}'"><p>${p.caption}</p>`;
      div.addEventListener('click', () => {
        lbList = [...photos];
        lbIdx = photos.indexOf(p);
        openLb(lbIdx);
      });
      wall.appendChild(div);
    });
  }

  function renderHeroStrip() {
    const strip = document.getElementById('heroStrip');
    if (!strip) return;
    [0, 3, 6, 9, 12].forEach((idx, i) => {
      const p = photos[idx];
      if (!p) return;
      const img = document.createElement('img');
      img.src = p.src; img.alt = 'Mannu';
      img.style.setProperty('--r', (i % 2 ? 5 : -5) + 'deg');
      img.style.setProperty('--d', i * 0.4 + 's');
      img.onerror = () => { if (p.drive) img.src = p.drive; };
      strip.appendChild(img);
    });
  }

  function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        filtered = f === 'all' ? [...photos] : photos.filter((p) => p.category === f);
        renderMasonry();
      });
    });
  }

  function openLb(i) {
    lbIdx = i;
    updateLb();
    const lb = document.getElementById('lightbox');
    lb.hidden = false;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('open');
    lb.hidden = true;
    document.body.style.overflow = '';
  }

  function updateLb() {
    const p = lbList[lbIdx];
    if (!p) return;
    document.getElementById('lbImg').src = p.src;
    document.getElementById('lbCaption').textContent = p.caption;
    document.getElementById('lbCounter').textContent = `${lbIdx + 1} / ${lbList.length}`;
  }

  function setupLb() {
    document.getElementById('lbClose')?.addEventListener('click', closeLb);
    document.getElementById('lbPrev')?.addEventListener('click', () => { lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; updateLb(); });
    document.getElementById('lbNext')?.addEventListener('click', () => { lbIdx = (lbIdx + 1) % lbList.length; updateLb(); });
    document.getElementById('lightbox')?.addEventListener('click', (e) => { if (e.target.id === 'lightbox') closeLb(); });
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('lightbox')?.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') document.getElementById('lbPrev')?.click();
      if (e.key === 'ArrowRight') document.getElementById('lbNext')?.click();
    });
  }

  return { init() { setupFilters(); setupLb(); return load(); }, getPhotos: () => photos };
})();
