(() => {
  const root = document.documentElement;
  const body = document.body;
  const loader = document.querySelector('.loader');
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const topButton = document.querySelector('.back-to-top');
  const header = document.querySelector('.site-header');
  const themeKey = 'timur-portfolio-theme';

  const storedTheme = localStorage.getItem(themeKey);
  if (storedTheme === 'light' || storedTheme === 'dark') root.dataset.theme = storedTheme;
  const updateThemeLabel = () => {
    const light = root.dataset.theme === 'light';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.title = light ? 'Switch to dark theme' : 'Switch to light theme';
  };
  updateThemeLabel();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(themeKey, root.dataset.theme);
    updateThemeLabel();
  });

  window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 450));
  setTimeout(() => loader.classList.add('done'), 2200);

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    navLinks.classList.toggle('open', open);
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  }));
  document.addEventListener('click', event => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    }
  });

  const phrases = ['Aspiring Software Developer', 'IT Student', 'Future Problem Solver'];
  const typed = document.querySelector('.typed-text');
  let phraseIndex = 0, letterIndex = phrases[0].length, deleting = true;
  const typeNext = () => {
    const phrase = phrases[phraseIndex];
    if (deleting) {
      letterIndex--;
      typed.textContent = phrase.slice(0, Math.max(0, letterIndex));
      if (letterIndex <= 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    } else {
      const nextPhrase = phrases[phraseIndex];
      letterIndex++;
      typed.textContent = nextPhrase.slice(0, letterIndex);
      if (letterIndex >= nextPhrase.length) { deleting = true; setTimeout(typeNext, 1700); return; }
    }
    setTimeout(typeNext, deleting ? 38 : 65);
  };
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(typeNext, 1900);

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...navLinks.querySelectorAll('a')];
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(anchor => {
        const active = anchor.getAttribute('href') === `#${entry.target.id}`;
        if (active) anchor.setAttribute('aria-current', 'location');
        else anchor.removeAttribute('aria-current');
        anchor.classList.toggle('active', active);
      });
    });
  }, { rootMargin: '-32% 0px -58% 0px' });
  sections.forEach(section => activeObserver.observe(section));

  const updateScroll = () => {
    const y = window.scrollY;
    topButton.classList.toggle('visible', y > 500);
    header.classList.toggle('scrolled', y > 10);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', event => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }));

  document.getElementById('year').textContent = new Date().getFullYear();

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const glow = document.querySelector('.cursor-glow');
    let scheduled = false;
    window.addEventListener('pointermove', event => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
        scheduled = false;
      });
    }, { passive: true });
  }
})();
