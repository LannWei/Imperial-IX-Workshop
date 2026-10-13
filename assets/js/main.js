/* Collaborative Lab Automation Workshop Series: navigation, programme index and the hero loop diagram. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ Header */

  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------ Mobile menu */

  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setMenu(false); });

  /* ------------------------------------------------------------ Current section in nav */

  const links = [...document.querySelectorAll('.nav-list a')];
  const sections = [...document.querySelectorAll('main > section')];
  const inBand = new Set();
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? inBand.add(e.target) : inBand.delete(e.target)));
    const current = sections.find((s) => inBand.has(s));
    links.forEach((a) => {
      if (current && current.id && a.getAttribute('href') === `#${current.id}`) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ------------------------------------------------------------ Programme index
     Fills the right-hand column of the agenda list from each event's details,
     so a seminar only has to be edited in one place. */

  const isTbc = (text) => !text || /to be (confirmed|announced)|\bTB[AC]\b/i.test(text);

  document.querySelectorAll('[data-agenda-for]').forEach((slot) => {
    const event = document.getElementById(slot.dataset.agendaFor);
    if (!event) return;

    let date = '';
    event.querySelectorAll('.event-meta > div').forEach((row) => {
      const key = row.querySelector('dt')?.textContent.trim().toLowerCase();
      if (key === 'date') date = row.querySelector('dd')?.textContent.trim();
    });
    slot.textContent = isTbc(date) ? 'Date TBC' : date;
    slot.classList.toggle('is-set', !isTbc(date));

    if (event.dataset.status === 'confirmed') {
      const names = [...event.querySelectorAll('.speaker-name')]
        .map((n) => n.textContent.trim())
        .filter((n) => !isTbc(n));
      const title = slot.parentElement.querySelector('.t');
      if (names.length && title) {
        const who = document.createElement('small');
        who.className = 'who';
        who.textContent = names.join(' & ');
        title.append(who);
      }
    }
  });

  /* ------------------------------------------------------------ Hero: closed-loop diagram
     A dot travels round the loop; each stage lights up in turn:
     AI agents → (plan) → robots → (execute) → experiments → (learn) → AI agents. */

  const loop = document.getElementById('loop');
  if (!loop || reduceMotion) return;

  const nodes = [...loop.querySelectorAll('.loop-node')];
  const edges = [...loop.querySelectorAll('.loop-edge')];
  const dot = loop.querySelector('.loop-dot');
  const CX = 260;
  const CY = 250;
  const R = 140;
  const STOPS = [-90, 30, 150]; // node positions on the ring, in degrees
  const DWELL = 1300;
  const TRAVEL = 1700;
  const STEP = DWELL + TRAVEL;
  const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2);

  const render = (ms) => {
    const e = ms % (STEP * STOPS.length);
    const i = Math.floor(e / STEP);
    const local = e - i * STEP;
    const moving = local >= DWELL;
    nodes.forEach((n, k) => n.classList.toggle('is-active', k === i && !moving));
    edges.forEach((edge, k) => edge.classList.toggle('is-active', k === i && moving));
    const p = moving ? ease((local - DWELL) / TRAVEL) : 0;
    const a = ((STOPS[i] + 120 * p) * Math.PI) / 180;
    dot.setAttribute('cx', (CX + R * Math.cos(a)).toFixed(1));
    dot.setAttribute('cy', (CY + R * Math.sin(a)).toFixed(1));
    dot.classList.toggle('is-visible', moving);
  };

  // Only animate while the diagram is on screen and the tab is visible.
  let elapsed = 0;
  let last = null;
  let running = false;
  let inView = false;
  const tick = (t) => {
    if (last !== null) elapsed += t - last;
    last = t;
    render(elapsed);
    if (inView && !document.hidden) requestAnimationFrame(tick);
    else { running = false; last = null; }
  };
  const start = () => {
    if (running || !inView || document.hidden) return;
    running = true;
    requestAnimationFrame(tick);
  };
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; start(); }).observe(loop);
  document.addEventListener('visibilitychange', start);
})();
