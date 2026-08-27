/* ═══════════════════════════════════════════════════════════════════════════
   ARSALAN KHAN — PORTFOLIO JAVASCRIPT
   Version: 1.0 | Production-Ready | Master Skill + UI/UX Pro Max
   Architecture: Module pattern — each system is a namespaced singleton
   ═══════════════════════════════════════════════════════════════════════════

   MODULE REGISTRY
   ──────────────────────────────────────────────────────────────────────────
   01. Utils          — debounce, throttle, lerp, clamp, isMobile
   02. ThemeManager   — dark/light toggle, CSS var updates, localStorage
   03. Loader         — split-panel loader with progress counter
   04. Cursor         — custom cursor with lerp tracking and hover states
   05. NavManager     — scroll spy, mobile menu, sticky behavior
   06. HeroScene      — Three.js particle system + mouse glow
   07. TypingEffect   — code block typewriter animation
   08. SkillsManager  — tab switching + circular progress + counters
   09. FilterManager  — project filter (pure JS, no deps)
   09b. ProjectModalManager — fullscreen project modal with PSO structure
   10. CounterManager — scroll-triggered number counters
   11. FormManager    — contact form validation + submission
   12. AOSCustom      — IntersectionObserver scroll reveal system
   13. MagneticButton — magnetic hover physics for CTA buttons
   14. TimelineDraw   — animated timeline tabs
   15. BackToTop      — scroll-to-top button visibility + action
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────────────────
   01. UTILS
   ───────────────────────────────────────────────────────────────────────── */
const Utils = (() => {
  const debounce = (fn, delay = 100) => {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
  };

  const throttle = (fn, limit = 16) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn(...args); }
    };
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const isMobile = () =>
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

  const isReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const prefersTouch = () => window.matchMedia('(hover: none)').matches;

  return { debounce, throttle, lerp, clamp, isMobile, isReducedMotion, prefersTouch };
})();


/* ─────────────────────────────────────────────────────────────────────────
   02. THEME MANAGER
   ───────────────────────────────────────────────────────────────────────── */
const ThemeManager = (() => {
  const STORAGE_KEY = 'ak-portfolio-theme';
  const toggle = document.getElementById('themeToggle');
  let isDark = true;

  const apply = (dark) => {
    isDark = dark;
    // Add transition class for smooth color switching
    document.body.classList.add('theme-transitioning');
    document.documentElement.classList.toggle('light-theme', !dark);
    if (toggle) toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    try { localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light'); } catch (err) { console.warn('localStorage unavailable (private mode?):', err); }
    // Remove transition class after animation completes
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 350);
    // Announce theme change to screen readers
    const msg = dark ? 'Dark theme activated' : 'Light theme activated';
    document.documentElement.setAttribute('aria-label', msg);
  };

  const init = () => {
    if (toggle && document.body.classList.contains('articles-page')) {
      toggle.innerHTML = `
        <svg class="theme-icon--dark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg class="theme-icon--light" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }

    let saved = 'dark';
    try { 
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        saved = stored;
      } else {
        // Respect OS-level dark/light preference if no saved preference
        saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
    } catch (_) {}
    apply(saved === 'dark');

    if (toggle) {
      toggle.addEventListener('click', () => apply(!isDark));
    }
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   03. LOADER
   ───────────────────────────────────────────────────────────────────────── */
const Loader = (() => {
  const el = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const count = document.getElementById('loaderCount');
  let progress = 0;
  let raf = null;

  const setProgress = (v) => {
    progress = Utils.clamp(v, 0, 100);
    if (bar) bar.style.width = `${progress}%`;
    if (count) count.textContent = String(Math.floor(progress)).padStart(2, '0');
  };

  const complete = () => {
    setProgress(100);
    // Brief pause, then reveal
    setTimeout(() => {
      if (el) el.classList.add('is-done');
      // Trigger hero content reveals
      setTimeout(() => {
        if (el) el.classList.add('is-hidden');
        // Kick off hero entrance
        document.querySelectorAll('#heroContent .reveal-item').forEach(item => {
          item.classList.add('is-visible');
        });
        document.querySelector('.hero__code-wrap')?.classList.add('is-visible');
      }, 700);
    }, 280);
  };

  const simulateProgress = () => {
    // Variable-speed counter: fast → slow → burst to 100
    const steps = [
      { target: 30, duration: 400 },
      { target: 70, duration: 700 },
      { target: 90, duration: 600 },
      { target: 98, duration: 800 },
    ];

    let stepIdx = 0;
    let startTime = null;
    let startVal = 0;

    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const step = steps[stepIdx];
      if (!step) return; // Real load takes over

      const t = Utils.clamp(elapsed / step.duration, 0, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(startVal + (step.target - startVal) * eased);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        startVal = step.target;
        stepIdx++;
        startTime = null;
        if (stepIdx < steps.length) {
          raf = requestAnimationFrame(tick);
        }
      }
    };

    raf = requestAnimationFrame(tick);
  };

  const init = () => {
    if (Utils.isReducedMotion()) {
      // Skip animation — just show
      complete();
      return;
    }

    simulateProgress();

    // Complete when page fully loaded
    if (document.readyState === 'complete') {
      setTimeout(complete, 200);
    } else {
      window.addEventListener('load', () => {
        cancelAnimationFrame(raf);
        complete();
      }, { once: true });
    }
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   04. CURSOR
   ───────────────────────────────────────────────────────────────────────── */
const Cursor = (() => {
  let dot = document.getElementById('cursorDot');
  let ring = document.getElementById('cursorRing');
  const wrapper = document.documentElement;

  let mx = 0, my = 0; // Mouse target
  let dx = 0, dy = 0; // Dot position
  let rx = 0, ry = 0; // Ring position
  let rafId = null;
  let active = false;
  let onMouseMoveHandler = null;
  let onMouseEnterHandler = null;
  let onMouseLeaveHandler = null;
  let onWindowLeaveHandler = null;
  let onWindowEnterHandler = null;

  const setClass = (cls) => {
    wrapper.className = wrapper.className.replace(/cursor--\S+/g, '').trim();
    if (cls) wrapper.classList.add(`cursor--${cls}`);
  };

  const update = () => {
    // Dot: tight follow
    dx = Utils.lerp(dx, mx, 0.4);
    dy = Utils.lerp(dy, my, 0.4);
    // Ring: smooth lag
    rx = Utils.lerp(rx, mx, 0.1);
    ry = Utils.lerp(ry, my, 0.1);

    if (dot) dot.style.transform = `translate(${dx - 4}px, ${dy - 4}px)`;
    if (ring) ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;

    rafId = requestAnimationFrame(update);
  };

  const onMouseMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!active) {
      active = true;
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    }
  };

  const onMouseEnter = (e) => {
    const el = e.target.closest('[data-cursor]');
    if (!el) return;
    setClass(el.dataset.cursor);
  };

  const onMouseLeave = (e) => {
    if (!e.target.closest('[data-cursor]')) return;
    setClass('');
  };

  const init = () => {
    if (Utils.prefersTouch()) return; // Skip on touch devices

    try {
      if (!dot) {
        dot = document.createElement('div');
        dot.className = 'cursor__dot';
        dot.id = 'cursorDot';
        dot.setAttribute('aria-hidden', 'true');
        document.body.appendChild(dot);
      }
      if (!ring) {
        ring = document.createElement('div');
        ring.className = 'cursor__ring';
        ring.id = 'cursorRing';
        ring.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ring);
      }
      if (document.body.classList.contains('articles-page')) {
        document.querySelectorAll('a, button').forEach(el => el.dataset.cursor = 'pointer');
      }

      onMouseMoveHandler = Utils.throttle((e) => onMouseMove(e), 10);
      onMouseEnterHandler = onMouseEnter;
      onMouseLeaveHandler = onMouseLeave;
      onWindowLeaveHandler = () => { setClass('hidden'); };
      onWindowEnterHandler = () => { setClass(''); };

      document.addEventListener('mousemove', onMouseMoveHandler);
      document.addEventListener('mouseover', onMouseEnterHandler);
      document.addEventListener('mouseout', onMouseLeaveHandler);
      document.addEventListener('mouseleave', onWindowLeaveHandler);
      document.addEventListener('mouseenter', onWindowEnterHandler);

      rafId = requestAnimationFrame(update);
    } catch (err) {
      console.error('Cursor initialization failed:', err);
    }
  };

  const cleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    if (onMouseMoveHandler) document.removeEventListener('mousemove', onMouseMoveHandler);
    if (onMouseEnterHandler) document.removeEventListener('mouseover', onMouseEnterHandler);
    if (onMouseLeaveHandler) document.removeEventListener('mouseout', onMouseLeaveHandler);
    if (onWindowLeaveHandler) document.removeEventListener('mouseleave', onWindowLeaveHandler);
    if (onWindowEnterHandler) document.removeEventListener('mouseenter', onWindowEnterHandler);
  };

  return { init, cleanup };
})();


/* ─────────────────────────────────────────────────────────────────────────
   05. NAV MANAGER
   ───────────────────────────────────────────────────────────────────────── */
const NavManager = (() => {
  const nav = document.querySelector('.nav');
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('navDrawer');
  const overlay = document.getElementById('navOverlay');
  const links = document.querySelectorAll('.nav__link');
  const drawerLinks = document.querySelectorAll('.nav__drawer-link');
  const scrollIndicator = document.getElementById('heroScroll');

  let drawerOpen = false;
  const sections = [];

  const openDrawer = () => {
    drawerOpen = true;
    drawer?.classList.add('is-open');
    overlay?.classList.add('is-visible');
    burger?.classList.add('is-open');
    burger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first link
    setTimeout(() => drawer?.querySelector('a')?.focus(), 100);
  };

  const closeDrawer = () => {
    drawerOpen = false;
    drawer?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
    burger?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const getActiveSection = () => {
    const scrollY = window.scrollY + 80 + window.innerHeight * 0.15;
    let active = null;
    for (const { id, top } of sections) {
      if (scrollY >= top) active = id;
    }
    return active;
  };

  const bottomNavLinks = document.querySelectorAll('.mobile-bottom-nav .nav__link');

  const updateActiveLink = () => {
    const activeId = getActiveSection();
    links.forEach(link => {
      const href = link.getAttribute('href')?.slice(1);
      link.classList.toggle('is-active', href === activeId);
    });
    drawerLinks.forEach(link => {
      const href = link.getAttribute('href')?.slice(1);
      link.classList.toggle('is-active', href === activeId);
    });
    // Sync mobile bottom navigation active state
    bottomNavLinks.forEach(link => {
      const href = link.getAttribute('href')?.slice(1);
      const isActive = href === activeId || 
        (href === 'hero' && !activeId) || 
        (href === 'projects' && activeId === 'projects') ||
        (href === 'skills' && activeId === 'skills') ||
        (href === 'contact' && activeId === 'contact');
      link.classList.toggle('is-active', href === activeId);
    });
  };

  const onScroll = Utils.throttle(() => {
    const scrolled = window.scrollY > 60;
    nav?.classList.toggle('is-scrolled', scrolled);

    // Hide scroll indicator after 100px
    if (scrollIndicator) {
      scrollIndicator.classList.toggle('is-hidden', window.scrollY > 100);
    }

    updateActiveLink();

    // Keep standalone document titles intact.
    if (sections.length) {
      const activeId = getActiveSection();
      if (activeId) {
        const label = activeId.charAt(0).toUpperCase() + activeId.slice(1);
        document.title = `Arsalan Khan — ${label}`;
      } else {
        document.title = 'Arsalan Khan — Full-Stack Developer & AI Engineer';
      }
    }
  }, 50);

  // Smooth scroll to anchor (native, Lenis optional)
  const smoothScrollTo = (href) => {
    const target = document.querySelector(href);
    if (!target) return;
    
    const lenis = typeof LenisInit !== 'undefined' ? LenisInit.getLenis() : null;
    if (lenis) {
      lenis.scrollTo(target, { offset: -64, duration: 1.2 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const bindAnchorLinks = () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        closeDrawer();
        smoothScrollTo(href);
      });
    });
  };

  const init = () => {
    // Collect section positions
    document.querySelectorAll('section[id]').forEach(section => {
      sections.push({
        id: section.id,
        get top() { return section.getBoundingClientRect().top + window.scrollY; }
      });
    });

    burger?.addEventListener('click', () => drawerOpen ? closeDrawer() : openDrawer());
    overlay?.addEventListener('click', closeDrawer);

    // Escape closes drawer
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawerOpen) closeDrawer();
    });

    bindAnchorLinks();
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Init state
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   06. HERO SCENE (Three.js Particle System + Mouse Glow)
   ───────────────────────────────────────────────────────────────────────── */
const HeroScene = (() => {
  const canvas = document.getElementById('heroCanvas');
  const glowEl = document.getElementById('heroGlow');
  let scene, camera, renderer, particles, geometry, positions;
  let mouseX = 0, mouseY = 0;
  let originPositions = [];
  let animating = false;
  let animationFrameId = null;
  let mouseMove = null;
  let resizeHandler = null;

  const PARTICLE_COUNT = Utils.isMobile() ? 800 : 2800;
  const ACCENT_RATIO = 0.05; // 5% green particles

  const updateGlow = Utils.throttle((e) => {
    if (!glowEl) return;
    glowEl.style.left = `${e.clientX}px`;
    glowEl.style.top = `${e.clientY}px`;
  }, 16);

  const initThree = () => {
    if (!canvas || typeof THREE === 'undefined') {
      console.warn('Three.js not loaded or canvas missing. 3D effects disabled.');
      return false;
    }

    try {
      scene = new THREE.Scene();

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Geometry
    geometry = new THREE.BufferGeometry();
    positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    originPositions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 900;
      const y = (Math.random() - 0.5) * 700;
      const z = (Math.random() - 0.5) * 400;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      originPositions[i3] = x;
      originPositions[i3 + 1] = y;
      originPositions[i3 + 2] = z;

      const isAccent = Math.random() < ACCENT_RATIO;
      if (isAccent) {
        colors[i3] = 137 / 255;
        colors[i3 + 1] = 233 / 255;
        colors[i3 + 2] = 0;
      } else {
        const g = 0.3 + Math.random() * 0.3; // dim gray
        colors[i3] = g; colors[i3 + 1] = g; colors[i3 + 2] = g;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: Utils.isMobile() ? 1.5 : 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    return true;
    } catch (err) {
      console.error('Three.js scene initialization failed:', err);
      return false;
    }
  };

  const animate = (time = 0) => {
    if (!animating) return;
    animationFrameId = requestAnimationFrame(animate);

    if (particles) {
      particles.rotation.y += 0.0003;
      particles.rotation.x += Math.sin(time * 0.0002) * 0.00005;
    }

    // Subtle mouse distortion on nearest particles (desktop only)
    if (!Utils.isMobile() && geometry) {
      const posAttr = geometry.attributes.position;
      const thresh = 80; // px radius of influence
      const cx = (mouseX / window.innerWidth - 0.5) * 900;
      const cy = -(mouseY / window.innerHeight - 0.5) * 700;

      for (let i = 0; i < Math.min(PARTICLE_COUNT, 300); i++) {
        const i3 = i * 3;
        const ox = originPositions[i3];
        const oy = originPositions[i3 + 1];
        const dist = Math.sqrt((ox - cx) ** 2 + (oy - cy) ** 2);

        if (dist < thresh) {
          const force = (1 - dist / thresh) * 18;
          const nx = ox + ((ox - cx) / dist) * force;
          const ny = oy + ((oy - cy) / dist) * force;
          posAttr.array[i3] = Utils.lerp(posAttr.array[i3], nx, 0.05);
          posAttr.array[i3 + 1] = Utils.lerp(posAttr.array[i3 + 1], ny, 0.05);
        } else {
          posAttr.array[i3] = Utils.lerp(posAttr.array[i3], ox, 0.04);
          posAttr.array[i3 + 1] = Utils.lerp(posAttr.array[i3 + 1], oy, 0.04);
        }
      }
      posAttr.needsUpdate = true;
    }

    renderer?.render(scene, camera);
  };

  const onResize = Utils.debounce(() => {
    if (!canvas || !renderer || !camera) return;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }, 200);

  const cleanup = () => {
    animating = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (mouseMove) document.removeEventListener('mousemove', mouseMove);
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    if (renderer) renderer.dispose();
    if (geometry) geometry.dispose();
  };

  const init = () => {
    if (Utils.isReducedMotion()) return;

    try {
      const ok = initThree();
      if (!ok) return;

      animating = true;
      animate();

      // Mouse tracking for distortion + glow
      mouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateGlow(e);
      };
      document.addEventListener('mousemove', mouseMove);

      resizeHandler = onResize;
      window.addEventListener('resize', resizeHandler, { passive: true });
    } catch (err) {
      console.error('HeroScene initialization failed:', err);
    }
  };

  return { init, cleanup };
})();


/* ─────────────────────────────────────────────────────────────────────────
   07. TYPING EFFECT (Hero Code Block)
   ───────────────────────────────────────────────────────────────────────── */
const TypingEffect = (() => {
  const output = document.getElementById('codeOutput');

  // Syntax-highlighted code lines — matches PRD ArsalanKhan class
    const CODE_LINES = [
    '<span class="cm"># arsalan@portfolio — v1.0</span>',
    '',
    '<span class="kw">class</span> <span class="cl">ArsalanKhan</span>:',
    '    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="bp">self</span>):',
    '        <span class="bp">self</span>.<span class="fn">name</span>     <span class="op">=</span> <span class="st">"Arsalan Khan (KTK)"</span>',
    '        <span class="bp">self</span>.<span class="fn">degree</span>   <span class="op">=</span> <span class="st">"BS Software Engineering"</span>',
    '        <span class="bp">self</span>.<span class="fn">focus</span>    <span class="op">=</span> [<span class="st">"Full Stack"</span>, <span class="st">"ML"</span>, <span class="st">"Cybersec"</span>]',
    '        <span class="bp">self</span>.<span class="fn">langs</span>    <span class="op">=</span> [<span class="st">"Python"</span>, <span class="st">"PHP"</span>, <span class="st">"JS"</span>]',
    '',
    '    <span class="kw">def</span> <span class="fn">current_work</span>(<span class="bp">self</span>):',
    '        <span class="kw">return</span> [',
    '            <span class="st">"PHP + MySQL web apps"</span>,',
    '            <span class="st">"React.js + Node.js backends"</span>,',
    '            <span class="st">"AI systems w/ Ollama"</span>,',
    '            <span class="st">"Cybersecurity research"</span>,',
    '        ]',
    '',
    '    <span class="kw">def</span> <span class="fn">is_available</span>(<span class="bp">self</span>):',
    '        <span class="kw">return</span> <span class="nm">True</span>  <span class="cm"># Let\'s build 🚀</span>',
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let rendered = '';
  let frameId = null;
  let initialTimeoutId = null;
  let paused = false;

  const CHAR_DELAY = 22;   // ms per char
  const LINE_DELAY = 120;  // ms pause after each line

  const stripHtml = (html) => html.replace(/<[^>]*>/g, '');

  const typeNext = () => {
    if (!output || paused) return;

    if (lineIdx >= CODE_LINES.length) return; // Done

    const line = CODE_LINES[lineIdx];
    const plainLen = stripHtml(line).length;

    if (line === '') {
      // Empty line — just append newline
      rendered += '\n';
      output.innerHTML = rendered;
      lineIdx++;
      charIdx = 0;
      frameId = setTimeout(typeNext, LINE_DELAY);
      return;
    }

    // Advance by one visible character
    charIdx++;
    // Reconstruct partial line with HTML intact, revealing `charIdx` plain chars
    const partial = revealPartial(line, charIdx);
    const lines = rendered.split('\n');
    lines[lineIdx] = partial;
    output.innerHTML = lines.join('\n');

    if (charIdx >= plainLen) {
      // Line complete
      rendered = lines.join('\n') + '\n';
      lineIdx++;
      charIdx = 0;
      frameId = setTimeout(typeNext, LINE_DELAY);
    } else {
      frameId = setTimeout(typeNext, CHAR_DELAY);
    }
  };

  // Reveal `n` plain-text characters from an HTML string preserving tags
  const revealPartial = (html, n) => {
    let count = 0;
    let result = '';
    let i = 0;
    while (i < html.length && count < n) {
      if (html[i] === '<') {
        // Copy entire tag
        const end = html.indexOf('>', i);
        result += html.slice(i, end + 1);
        i = end + 1;
      } else {
        result += html[i];
        count++;
        i++;
      }
    }
    // Close any unclosed span tags
    const openSpans = (result.match(/<span[^>]*>/g) || []).length;
    const closeSpans = (result.match(/<\/span>/g) || []).length;
    for (let j = 0; j < openSpans - closeSpans; j++) result += '</span>';
    return result;
  };

  const init = () => {
    if (!output) return;

    if (Utils.isReducedMotion()) {
      // Just show full code instantly
      output.innerHTML = CODE_LINES.join('\n');
      return;
    }

    // Start after loader finishes (delay matches loader duration ~3s)
    initialTimeoutId = setTimeout(() => {
      frameId = setTimeout(typeNext, 400);
    }, 2800);
  };

  const cleanup = () => {
    if (initialTimeoutId) clearTimeout(initialTimeoutId);
    if (frameId) clearTimeout(frameId);
    initialTimeoutId = null;
    frameId = null;
  };

  return { init, cleanup };
})();


/* ─────────────────────────────────────────────────────────────────────────
   08. SKILLS MANAGER
   ───────────────────────────────────────────────────────────────────────── */
const SkillsManager = (() => {
  const SKILLS_DATA = {
    frontend: [
      { name: 'HTML5',         icon: '⟨/⟩', pct: 95, level: 'Expert' },
      { name: 'CSS3',          icon: '{}',  pct: 90, level: 'Expert' },
      { name: 'JavaScript',    icon: 'JS',  pct: 88, level: 'Advanced' },
      { name: 'TypeScript',    icon: 'TS',  pct: 75, level: 'Advanced' },
      { name: 'React',         icon: '⚛',   pct: 82, level: 'Advanced' },
      { name: 'Next.js',       icon: '▲',   pct: 74, level: 'Advanced' },
    ],
    backend: [
      { name: 'Node.js',       icon: '⬡',   pct: 82, level: 'Advanced' },
      { name: 'Express.js',    icon: 'EX',  pct: 80, level: 'Advanced' },
      { name: 'REST API',      icon: '⟳',   pct: 85, level: 'Advanced' },
      { name: 'GraphQL',       icon: '◈',   pct: 65, level: 'Intermediate' },
    ],
    database: [
      { name: 'MongoDB',       icon: '🍃',  pct: 78, level: 'Advanced' },
      { name: 'MySQL',         icon: '🗄',  pct: 85, level: 'Advanced' },
      { name: 'PostgreSQL',    icon: '🐘',  pct: 74, level: 'Advanced' },
      { name: 'Firebase',      icon: '🔥',  pct: 76, level: 'Advanced' },
      { name: 'SQL',           icon: 'SQL', pct: 88, level: 'Expert' },
      { name: 'NoSQL',         icon: 'NSQ', pct: 80, level: 'Advanced' },
      { name: 'Vector DBs',    icon: '∴',   pct: 60, level: 'Intermediate' },
    ],
    security: [
      { name: 'JWT & OAuth',        icon: '🔑', pct: 80, level: 'Advanced' },
      { name: 'Password Hashing',   icon: '🔒', pct: 82, level: 'Advanced' },
      { name: 'Auth / AuthZ',       icon: '🛡',  pct: 82, level: 'Advanced' },
      { name: 'XSS Prevention',     icon: '⚠',  pct: 78, level: 'Advanced' },
      { name: 'CSRF Protection',    icon: '⛔', pct: 76, level: 'Advanced' },
      { name: 'SQLi Prevention',    icon: '🚫', pct: 78, level: 'Advanced' },
      { name: 'Input Validation',   icon: '✔',  pct: 85, level: 'Advanced' },
      { name: 'Security Headers',   icon: '📋', pct: 74, level: 'Advanced' },
      { name: 'Rate Limiting',      icon: '⏱',  pct: 72, level: 'Intermediate' },
      { name: 'HTTPS / TLS',        icon: '🔐', pct: 80, level: 'Advanced' },
      { name: 'OWASP Top 10',       icon: '📖', pct: 76, level: 'Advanced' },
      { name: 'Secure API Design',  icon: '🧩', pct: 80, level: 'Advanced' },
    ],
    tools: [
      { name: 'Git / GitHub',  icon: '⎇',   pct: 90, level: 'Expert' },
      { name: 'Docker',        icon: '🐳',  pct: 65, level: 'Intermediate' },
      { name: 'Vercel',        icon: '▲',   pct: 82, level: 'Advanced' },
      { name: 'Netlify',       icon: '◆',   pct: 78, level: 'Advanced' },
    ],
  };

  const grid = document.getElementById('skillsGrid');
  const tabs = document.querySelectorAll('.skills__tab');
  const CIRCUMFERENCE = 201; // 2π × 32

  const buildCard = ({ name, icon, pct, level }) => {
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
    return `
      <div class="skill-card reveal-up" role="article" aria-label="${name}: ${pct}%">
        <div class="skill-card__header">
          <div class="skill-card__icon" aria-hidden="true">${icon}</div>
          <span class="skill-card__name">${name}</span>
        </div>
        <div class="skill-card__progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${name} proficiency: ${pct}%">
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <circle class="track" cx="40" cy="40" r="32"/>
            <circle class="fill" cx="40" cy="40" r="32"
              style="stroke-dashoffset: ${CIRCUMFERENCE}"
              data-offset="${offset}"/>
          </svg>
          <span class="percent">${pct}%</span>
        </div>
        <span class="skill-card__level">${level}</span>
      </div>`;
  };

  const renderTab = (tabKey) => {
    const skills = SKILLS_DATA[tabKey] || [];
    if (!grid) return;
    grid.innerHTML = skills.map(buildCard).join('');
    // Re-observe new cards (safe call - AOSCustom may not be initialized yet)
    if (typeof AOSCustom !== 'undefined') AOSCustom?.observeNewElements?.();
    // Animate progress circles already in view
    animateVisibleCircles();
  };

  const animateCircle = (fillEl) => {
    if (fillEl.dataset.animated === '1') return;
    fillEl.dataset.animated = '1';
    const targetOffset = parseFloat(fillEl.dataset.offset);
    // Trigger CSS transition
    requestAnimationFrame(() => {
      fillEl.style.strokeDashoffset = targetOffset;
    });
  };

  const animateVisibleCircles = () => {
    document.querySelectorAll('.skill-card__progress .fill').forEach(fill => {
      const rect = fill.closest('.skill-card')?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight * 0.95) {
        animateCircle(fill);
      }
    });
  };

  const init = () => {
    // Render default tab
    renderTab('frontend');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        renderTab(tab.dataset.tab);
      });
    });

    // Animate circles on scroll
    window.addEventListener('scroll', Utils.throttle(animateVisibleCircles, 100), { passive: true });
    setTimeout(animateVisibleCircles, 3200); // initial pass after load
  };

  const cleanup = () => {
    // Remove tab listeners by cloning nodes (cheap reset)
    tabs.forEach(tab => tab.replaceWith(tab.cloneNode(true)));
  };

  return { init, cleanup };
})();


/* ─────────────────────────────────────────────────────────────────────────
   09. FILTER MANAGER (Projects)
   ───────────────────────────────────────────────────────────────────────── */
const FilterManager = (() => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  const applyFilter = (filter) => {
    cards.forEach(card => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.split(' ').includes(filter);

      if (show) {
        card.classList.remove('is-hidden');
        // Trigger re-animation with slight stagger
        card.style.animation = 'none';
        card.offsetHeight; // Force reflow
        card.style.animation = 'scale-in 350ms cubic-bezier(0.22, 1, 0.36, 1) forwards';
      } else {
        card.classList.add('is-hidden');
        card.style.animation = '';
      }
    });
  };

  const init = () => {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyFilter(btn.dataset.filter);
      });
    });

    // Keyboard on project cards (Enter/Space)
    cards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   09b. PROJECT MODAL MANAGER
   ───────────────────────────────────────────────────────────────────────── */
const ProjectModalManager = (() => {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('projectModalClose');
  const prevBtn = document.getElementById('projectModalPrev');
  const nextBtn = document.getElementById('projectModalNext');
  const cards = document.querySelectorAll('.project-card');
  
  let currentIndex = 0;
  
  // Project data with Problem/Solution/Outcome — kept honest: no invented metrics,
  // links are either verified real URLs or clearly marked as pending.
  const projects = [
    {
      id: 'kb-labs',
      title: 'KB Labs — Medical Diagnostics',
      category: 'Full-Stack Web Dev',
      categoryTag: 'web',
      image: 'images/projects/kb-labs-1.jpg',
      shortDesc: 'A full-stack booking and results platform for a medical testing lab: test catalog, package management, bookings, and a staff-facing admin dashboard.',
      longDesc: 'KB Labs needed a public-facing site where patients could browse test packages and book appointments, plus an internal admin panel for staff to manage packages, pricing, and bookings without touching code.',
      problem: 'The lab had no online presence — bookings happened by phone, and package pricing lived in spreadsheets that were easy to get out of sync with what staff quoted customers.',
      solution: 'Built a public site with a searchable test/package catalog and booking flow, backed by an admin dashboard where staff can add, edit, and deactivate packages and see booking activity in one place.',
      outcome: 'Gives the business a single source of truth for pricing and packages, and a booking flow that does not depend on phone availability.',
      techStack: ['React', 'Node.js', 'MySQL', 'Admin Panel'],
      links: [
        { label: 'GitHub', url: 'PENDING', icon: 'github' },
        { label: 'Live Demo', url: 'PENDING', icon: 'external-link' }
      ]
    },
    {
      id: 'brightbyte-dental-system',
      title: 'BrightByte Dental System',
      category: 'Static Website',
      categoryTag: 'static',
      image: 'images/projects/brightbyte-dental-1.jpg',
      shortDesc: 'A modern dental clinic management system built with clean UI, appointment management, patient records, billing, authentication, and scalable architecture.',
      longDesc: 'BrightByte Dental System is a modern dental clinic management system designed to provide a clean digital experience for managing dental clinic operations.',
      problem: 'Dental clinics need a centralized system for managing appointments, patient information, billing, and authentication instead of handling these operations separately.',
      solution: 'Built a modern dental management interface with appointment management, patient records, billing functionality, authentication, and a responsive user interface.',
      outcome: 'Provides a centralized and organized digital system for managing important dental clinic operations while maintaining a clean and professional user experience.',
      techStack: ['HTML5', 'CSS3', 'JavaScript'],
      links: [
        { label: 'GitHub', url: 'https://github.com/arsalan-khan-dev/brightbyte-dental-system', icon: 'github' },
        { label: 'Live Demo', url: 'https://arsalan-khan-dev.github.io/brightbyte-dental-system/', icon: 'external-link' }
      ]
    },
    {
      id: 'quick-turn-auto-keys',
      title: 'Quick Turn Auto Keys',
      category: 'Static Website',
      categoryTag: 'static',
      image: 'images/projects/quick-turn-auto-keys-1.jpg',
      shortDesc: 'A professional 37-page responsive static website for a 24/7 mobile automotive locksmith service, covering car key replacement, programming, repairs, lockouts, ignition services, service areas, vehicle brands, FAQs, blog content, and customer enquiries.',
      longDesc: 'A professional 37-page static website created for Quick Turn Auto Keys, a 24/7 mobile automotive locksmith service serving London and surrounding areas.',
      problem: 'The business needed a professional and informative online presence that could clearly present its locksmith services, supported vehicle brands, service areas, and contact options.',
      solution: 'Developed a complete responsive static website using HTML5, CSS3, and Vanilla JavaScript with dedicated pages for services, vehicle brands, service areas, FAQs, blog content, about information, and contact/quote functionality.',
      outcome: 'Created a professional mobile-friendly website that helps customers quickly understand the available services and contact the business for automotive locksmith assistance.',
      techStack: ['HTML5', 'CSS3', 'JavaScript'],
      links: [
        { label: 'Live Demo', url: 'https://auttokeys.com/', icon: 'external-link' }
      ]
    },
    {
      id: 'car-hub',
      title: 'Car Hub — Rental Management System',
      category: 'Full-Stack Web Dev',
      categoryTag: 'web',
      image: 'images/projects/car-hub-1.jpg',
      shortDesc: 'A car rental platform built for a real Peshawar-based business, with a complete admin panel: user management, car availability, bookings, and discounts.',
      longDesc: 'Car Hub is a rental management system built for a real car rental business. It covers the operational side: which cars are available, who has booked what, user accounts, and discount codes — run from a single admin panel.',
      problem: 'The business was tracking car availability and bookings manually, which made it easy to double-book a car or lose track of which vehicles were actually free on a given day.',
      solution: 'Built an admin panel with dedicated views for managing users, cars, availability, bookings, and discounts, backed by a relational database that enforces booking/availability consistency.',
      outcome: 'Replaced manual tracking with a single system of record for cars, users, and bookings that the business actually runs on.',
      techStack: ['Admin Panel', 'MySQL', 'Auth', 'CRUD'],
      links: [
        { label: 'GitHub', url: 'PENDING', icon: 'github' },
        { label: 'Live Demo', url: 'PENDING', icon: 'external-link' }
      ]
    },
    {
      id: 'nova-heaven',
      title: 'Nova Heaven — E-Commerce Store',
      category: 'Full-Stack Web Dev',
      categoryTag: 'web',
      image: 'images/projects/nova-heaven-1.jpg',
      shortDesc: 'A fashion and footwear storefront with product categories, cart, wishlist, and account flows — built for a clean, fast shopping experience.',
      longDesc: 'Nova Heaven is an e-commerce storefront covering the core shopping experience: browsing by category, viewing product detail, adding to cart or wishlist, and managing an account.',
      problem: 'Needed a storefront that felt fast and modern without the bloat of a full off-the-shelf e-commerce platform, tailored to a specific product catalog.',
      solution: 'Built a custom React storefront with category browsing, cart and wishlist state, and account flows, focused on a clean checkout path and mobile-friendly layout.',
      outcome: 'A lightweight, purpose-built storefront rather than a generic template, giving full control over the shopping experience.',
      techStack: ['React', 'Cart / Checkout', 'Responsive'],
      links: [
        { label: 'GitHub', url: 'PENDING', icon: 'github' },
        { label: 'Live Demo', url: 'PENDING', icon: 'external-link' }
      ]
    },
    {
      id: 'khan-travel',
      title: 'Khan Travel Agency',
      category: 'Full-Stack Web Dev',
      categoryTag: 'web',
      image: 'images/projects/khan-travel-1.jpg',
      shortDesc: 'A flight booking platform with search by route and date, passenger and class selection, and an admin dashboard for bookings, flights, and messages.',
      longDesc: 'Khan Travel Agency is a flight-booking platform: customers search by departure/destination and dates, pick passengers and class, and the business manages the resulting bookings, flights, and customer messages from an admin dashboard.',
      problem: 'A travel agency needed a way to take flight search and booking requests online instead of handling everything through calls and messages, plus visibility into bookings and revenue.',
      solution: 'Built a public search/booking flow and a staff dashboard showing bookings, revenue, active flights, and pending customer messages in one view.',
      outcome: 'Gives the agency a real dashboard view of bookings and messages instead of tracking requests across separate channels.',
      techStack: ['Dashboard', 'Booking Flow', 'Admin'],
      links: [
        { label: 'GitHub', url: 'PENDING', icon: 'github' },
        { label: 'Live Demo', url: 'PENDING', icon: 'external-link' }
      ]
    },
    {
      id: 'excellence-academy',
      title: 'Excellence Academy — School Website',
      category: 'Static Website',
      categoryTag: 'static',
      image: 'images/projects/excellence-academy-1.jpg',
      shortDesc: 'A full informational site for a school: admissions, academics, gallery, and events, organized around clear navigation for parents and prospective students.',
      longDesc: 'A multi-page site for a school covering admissions, academics, a photo gallery, and events — built so parents and prospective students can find what they need without hunting through menus.',
      problem: 'Schools often end up with cluttered, hard-to-navigate websites where key information (admissions, contact, academics) is buried.',
      solution: 'Designed a clear information architecture across Home, About, Academics, Admissions, Gallery, Events, and Contact, with consistent navigation and a values-driven About section.',
      outcome: 'A content-heavy site that stays easy to navigate instead of turning into a maze of sub-pages.',
      techStack: ['Multi-Page', 'Responsive', 'Content-Heavy'],
      links: [
        { label: 'GitHub', url: 'PENDING', icon: 'github' },
        { label: 'Live Demo', url: 'PENDING', icon: 'external-link' }
      ]
    },
    {
      id: 'rubi-assistant',
      title: 'Rubi — Portfolio Assistant',
      category: 'Chatbot / AI',
      categoryTag: 'ai',
      image: 'images/projects/rubi-assistant-1.jpg',
      shortDesc: 'A weighted-scoring chatbot widget embedded in this portfolio, built to answer visitor questions about skills, education, and projects with context-aware replies.',
      longDesc: 'Rubi is a chat widget built specifically for this portfolio. It answers common recruiter and visitor questions — skills, education, freelance availability, project details — using weighted keyword scoring rather than a generic canned-response bot.',
      problem: 'A static portfolio can\'t answer a visitor\'s specific question ("do you work with databases?", "are you available for freelance?") without them scrolling to find it themselves.',
      solution: 'Built a lightweight in-page assistant that matches visitor questions against a scored set of topics and responses, covering skills, education, and project details.',
      outcome: 'Lets a visitor get a direct answer to a specific question instead of scanning the whole page.',
      techStack: ['JavaScript', 'Keyword Scoring', 'Widget UI'],
      links: [
        { label: 'GitHub', url: 'PENDING', icon: 'github' }
      ]
    }
  ];

  const renderProject = (index) => {
    const proj = projects[index];
    if (!proj) return;

    // Update hero — real screenshot if available, else fall back to placeholder
    const placeholder = document.getElementById('projectModalPlaceholder');
    const imgEl = document.getElementById('projectModalImg');
    if (proj.image && imgEl) {
      imgEl.src = proj.image;
      imgEl.alt = `${proj.title} screenshot`;
      imgEl.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    } else {
      if (imgEl) imgEl.style.display = 'none';
      if (placeholder) {
        placeholder.style.display = 'flex';
        placeholder.style.setProperty('--hue', proj.hue || 150);
        placeholder.textContent = proj.title;
      }
    }

    // Update header
    document.getElementById('projectModalCategory').textContent = proj.category;
    document.getElementById('projectModalTitle').textContent = proj.title;
    document.getElementById('projectModalShortDesc').textContent = proj.shortDesc;

    // Update descriptions
    document.getElementById('projectModalLongDesc').textContent = proj.longDesc;
    document.getElementById('projectModalProblem').textContent = proj.problem;
    document.getElementById('projectModalSolution').textContent = proj.solution;
    document.getElementById('projectModalOutcome').textContent = proj.outcome;

    // Update tech stack
    const techEl = document.getElementById('projectModalTech');
    techEl.innerHTML = proj.techStack.map(tech => `<span class="tag">${tech}</span>`).join('');

    // Update links — pending links render as disabled, not as dead live-looking buttons
    const linksEl = document.getElementById('projectModalLinks');
    linksEl.innerHTML = proj.links.map(link => {
      const svg = link.icon === 'github' 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
      if (link.url === 'PENDING') {
        return `<span class="btn btn--ghost btn--disabled" aria-disabled="true" title="Link not yet added">${svg} ${link.label} (coming soon)</span>`;
      }
      return `<a href="${link.url}" class="btn btn--ghost" target="_blank" rel="noopener" aria-label="${link.label}">${svg} ${link.label}</a>`;
    }).join('');

    // Update counter
    document.getElementById('projectModalCounter').textContent = `${index + 1} / ${projects.length}`;

    currentIndex = index;
  };

  const showModal = (index) => {
    if (index < 0) index = projects.length - 1;
    if (index >= projects.length) index = 0;
    
    renderProject(index);
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  let lastFocusedCard = null;

  const hideModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    // Return focus to triggering card for accessibility
    if (lastFocusedCard) {
      setTimeout(() => lastFocusedCard?.focus(), 100);
      lastFocusedCard = null;
    }
  };

  const nextProject = () => {
    showModal(currentIndex + 1);
  };

  const prevProject = () => {
    showModal(currentIndex - 1);
  };

  const init = () => {
    if (!modal) return;

    // Close button
    if (closeBtn) closeBtn.addEventListener('click', hideModal);

    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevProject);
    if (nextBtn) nextBtn.addEventListener('click', nextProject);

    // Click on background to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') hideModal();
      if (e.key === 'ArrowLeft') prevProject();
      if (e.key === 'ArrowRight') nextProject();
    });

    // Click on project cards to open modal
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        lastFocusedCard = card;
        showModal(idx);
      });
    });
  };

  return { init, showModal, hideModal };
})();


/* ─────────────────────────────────────────────────────────────────────────
   10. COUNTER MANAGER (Animated stats)
   ───────────────────────────────────────────────────────────────────────── */
const CounterManager = (() => {
  const counters = document.querySelectorAll('[data-target]');
  let counterObserver = null;
  const activeRAFs = [];

  const animateCounter = (el) => {
    if (el.dataset.counted === '1') return;
    el.dataset.counted = '1';
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const t = Utils.clamp(elapsed / duration, 0, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - t, 4);
      const current = Math.floor(eased * target);
      el.textContent = current;

      if (t < 1) {
        const rafId = requestAnimationFrame(tick);
        activeRAFs.push(rafId);
      } else {
        el.textContent = target;
      }
    };

    const rafId = requestAnimationFrame(tick);
    activeRAFs.push(rafId);
  };

  const init = () => {
    counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateCounter(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  };

  const cleanup = () => {
    activeRAFs.forEach(rafId => cancelAnimationFrame(rafId));
    activeRAFs.length = 0;
    if (counterObserver) {
      counterObserver.disconnect();
      counterObserver = null;
    }
  };

  return { init, cleanup };
})();


/* ─────────────────────────────────────────────────────────────────────────
   11. FORM MANAGER
   ───────────────────────────────────────────────────────────────────────── */
const FormManager = (() => {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmit');
  const successEl = document.getElementById('formSuccess');
  let blurListeners = {};

  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    message: (v) => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.',
  };

  const showError = (fieldId, msg) => {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    input?.classList.toggle('has-error', !!msg);
    if (errorEl) errorEl.textContent = msg;
  };

  const clearErrors = () => {
    ['fname', 'femail', 'fmessage'].forEach(id => showError(id, ''));
  };

  const validate = (data) => {
    let valid = true;
    const map = { fname: 'name', femail: 'email', fmessage: 'message' };
    Object.entries(map).forEach(([inputId, field]) => {
      const err = validators[field]?.(data[field] || '');
      showError(inputId, err || '');
      if (err) valid = false;
    });
    return valid;
  };

  // Live validation
  const bindLiveValidation = () => {
    const fields = [
      { id: 'fname', field: 'name' },
      { id: 'femail', field: 'email' },
      { id: 'fmessage', field: 'message' },
    ];
    fields.forEach(({ id, field }) => {
      const handler = (e) => {
        const err = validators[field]?.(e.target.value) || '';
        showError(id, err);
      };
      const el = document.getElementById(id);
      if (el) {
        blurListeners[id] = handler;
        el.addEventListener('blur', handler);
      }
    });
  };

  const setLoading = (loading) => {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    const textEl = submitBtn.querySelector('.btn__text');
    const iconEl = submitBtn.querySelector('.btn__icon');
    if (loading) {
      if (textEl) textEl.textContent = 'Sending…';
      if (iconEl) iconEl.innerHTML = `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.4" stroke-dashoffset="10" style="animation:loader-spin 0.8s linear infinite;transform-origin:center"/>`;
    } else {
      if (textEl) textEl.textContent = 'Send Message';
      if (iconEl) iconEl.innerHTML = `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`;
    }
  };

  const showSuccess = (msg) => {
    if (!successEl) return;
    successEl.textContent = msg;
    successEl.classList.add('is-visible');
    setTimeout(() => successEl.classList.remove('is-visible'), 6000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    const data = {
      name: form.querySelector('#fname')?.value || '',
      email: form.querySelector('#femail')?.value || '',
      subject: form.querySelector('#fsubject')?.value || '',
      message: form.querySelector('#fmessage')?.value || '',
    };

    if (!validate(data)) return;

    setLoading(true);

    try {
      // ──────────────────────────────────────────────────────────────────────
      // CONTACT FORM SUBMISSION:
      // Messages are submitted to the connected Formspree endpoint.
      // ──────────────────────────────────────────────────────────────────────
      const endpoint = 'https://formspree.io/f/mnpqagzj';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showSuccess('✓ Message sent! I\'ll get back to you within 24 hours.');
        form.reset();
      } else {
        showError('femail', 'Failed to send. Please try again or email directly.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      showError('femail', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const init = () => {
    if (!form) return;
    form.addEventListener('submit', handleSubmit);
    bindLiveValidation();
  };

  const cleanup = () => {
    if (form) form.removeEventListener('submit', handleSubmit);
    ['fname', 'femail', 'fmessage'].forEach(id => {
      const el = document.getElementById(id);
      if (el && blurListeners[id]) el.removeEventListener('blur', blurListeners[id]);
    });
  };

  return { init, cleanup };
})();


/* ─────────────────────────────────────────────────────────────────────────
   12. AOS CUSTOM (IntersectionObserver Scroll Reveal)
   ───────────────────────────────────────────────────────────────────────── */
const AOSCustom = (() => {
  let observer = null;

  const makeObserver = () => new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Fire once
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  const observeAll = () => {
    document.querySelectorAll('.reveal-up, .reveal-item').forEach(el => {
      if (!el.classList.contains('is-visible')) {
        observer?.observe(el);
      }
    });
  };

  // Called by SkillsManager when new cards are injected
  const observeNewElements = () => {
    document.querySelectorAll('.reveal-up:not(.is-visible)').forEach(el => {
      observer?.observe(el);
    });
  };

  const init = () => {
    if (Utils.isReducedMotion()) {
      // Instantly make all visible
      document.querySelectorAll('.reveal-up, .reveal-item').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    observer = makeObserver();
    observeAll();
  };

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  return { init, observeNewElements, cleanup };
})();


/* ─────────────────────────────────────────────────────────────────────────
   13. MAGNETIC BUTTON
   ───────────────────────────────────────────────────────────────────────── */
const MagneticButton = (() => {
  const RADIUS = 80;
  const FORCE = 0.32;

  const onMove = (e, el) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < RADIUS) {
      const pullX = dx * FORCE;
      const pullY = dy * FORCE;
      el.style.transform = `translate(${pullX}px, ${pullY}px)`;
    }
  };

  const onLeave = (el) => {
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => { el.style.transition = ''; }, 500);
  };

  const init = () => {
    if (Utils.isMobile() || Utils.prefersTouch()) return;

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => onMove(e, el));
      el.addEventListener('mouseleave', () => onLeave(el));
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   14. TIMELINE TABS (About Section)
   ───────────────────────────────────────────────────────────────────────── */
const TimelineDraw = (() => {
  const init = () => {
    const tabBtns = document.querySelectorAll('.timeline__tab');
    const contents = document.querySelectorAll('.timeline__content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('aria-controls');

        tabBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        contents.forEach(c => c.classList.add('is-hidden'));

        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const panel = document.getElementById(target);
        if (panel) {
          panel.classList.remove('is-hidden');
          // Re-trigger reveal for newly shown cards
          panel.querySelectorAll('.timeline__card').forEach(card => {
            card.style.animation = 'reveal-up 400ms cubic-bezier(0.22,1,0.36,1) forwards';
          });
        }
      });
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   15. BACK TO TOP
   ───────────────────────────────────────────────────────────────────────── */
const BackToTop = (() => {
  const btn = document.getElementById('backToTop');

  const init = () => {
    if (!btn) return;

    window.addEventListener('scroll', Utils.throttle(() => {
      btn.classList.toggle('is-visible', window.scrollY > 400);
    }, 100), { passive: true });

    btn.addEventListener('click', () => {
      const lenis = typeof LenisInit !== 'undefined' ? LenisInit.getLenis() : null;
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   16. SERVICE CARD INTERACTION (corner trace animation augment)
   ───────────────────────────────────────────────────────────────────────── */
const ServiceCards = (() => {
  const init = () => {
    // Enhance service card icon rotation on hover
    document.querySelectorAll('.service-card').forEach(card => {
      const icon = card.querySelector('.service-card__icon');
      card.addEventListener('mouseenter', () => {
        if (icon) icon.style.transform = 'rotate(8deg) scale(1.05)';
      });
      card.addEventListener('mouseleave', () => {
        if (icon) icon.style.transform = '';
      });
    });
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   17. HERO SCROLL PARALLAX
   ───────────────────────────────────────────────────────────────────────── */
const HeroParallax = (() => {
  const hero = document.querySelector('.hero');
  const heroName = document.querySelector('.hero__name');
  const heroSub = document.querySelector('.hero__sub');

  const init = () => {
    if (!hero || Utils.isReducedMotion() || Utils.isMobile()) return;

    window.addEventListener('scroll', Utils.throttle(() => {
      const scrolled = window.scrollY;
      if (scrolled > window.innerHeight) return;
      const rate = scrolled * 0.3;
      if (heroName) heroName.style.transform = `translateY(${rate * 0.15}px)`;
      if (heroSub) heroSub.style.transform = `translateY(${rate * 0.08}px)`;
    }, 16), { passive: true });
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   18. LENIS SMOOTH SCROLL
   ───────────────────────────────────────────────────────────────────────── */
const LenisInit = (() => {
  let lenis = null;

  const init = () => {
    // Check if Lenis is available globally
    if (typeof window.Lenis === 'undefined') {
      console.warn('Lenis library not loaded. Smooth scroll disabled.');
      return;
    }
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP/ScrollTrigger not loaded. ScrollTrigger sync disabled.');
      try {
        lenis = new window.Lenis({ duration: 1.2, smoothWheel: true, smoothTouch: false });
      } catch(e) {}
      return;
    }

    try {
      // Register GSAP plugins
      gsap.registerPlugin(ScrollTrigger);
      if (typeof TextPlugin !== 'undefined') gsap.registerPlugin(TextPlugin);

      // Initialize Lenis with configuration
      lenis = new window.Lenis({
        duration: 1.2, // Duration of smooth scroll (seconds)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease-out cubic
        direction: 'vertical', // Vertical scroll
        gestureDirection: 'vertical',
        smoothWheel: true,
        smoothTouch: false,  // native scroll on mobile is better UX
        touchMultiplier: 2,
      });

      // Sync Lenis with GSAP ScrollTrigger (single, clean integration)
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0); // Prevents GSAP lag on tab refocus
    } catch (err) {
      console.error('Lenis initialization failed:', err);
    }
  };

  return { init, getLenis: () => lenis };
})();


/* ─────────────────────────────────────────────────────────────────────────
   INITIALIZATION ORCHESTRATION
   ───────────────────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────────────────
   21. SWIPE GESTURE SUPPORT (Mobile Gallery + Project Modal)
   ───────────────────────────────────────────────────────────────────────── */
const SwipeGestures = (() => {
  const addSwipe = (el, onLeft, onRight) => {
    if (!el) return;
    let startX = 0;
    let startY = 0;
    const THRESHOLD = 50;
    const ANGLE_THRESHOLD = 0.8; // cos(36°) — must be mostly horizontal

    el.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < THRESHOLD) return;
      const angle = Math.abs(dx) / dist;
      if (angle < ANGLE_THRESHOLD) return; // Too vertical — let scroll happen
      if (dx < 0) onLeft();
      else onRight();
    }, { passive: true });
  };

  const init = () => {
    // Lightbox swipe
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      addSwipe(
        lightbox,
        () => document.getElementById('lightboxNext')?.click(),
        () => document.getElementById('lightboxPrev')?.click()
      );
    }

    // Project modal swipe
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
      addSwipe(
        projectModal,
        () => document.getElementById('projectModalNext')?.click(),
        () => document.getElementById('projectModalPrev')?.click()
      );
    }
  };

  return { init };
})();


/* ─────────────────────────────────────────────────────────────────────────
   18. PAGE TRANSITIONS
   ───────────────────────────────────────────────────────────────────────── */
const PageTransition = (() => {
  const isInternalDocument = (link) => {
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return false;
    if (link.origin !== window.location.origin) return false;
    return link.pathname.endsWith('.html');
  };

  const init = () => {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a');
      if (!isInternalDocument(link)) return;

      event.preventDefault();
      document.body.classList.add('is-leaving');
      overlay.classList.add('is-leaving');
      window.setTimeout(() => { window.location.href = link.href; }, 480);
    });
  };

  return { init };
})();


document.addEventListener('DOMContentLoaded', () => {
  // Critical — runs first
  try {
    ThemeManager.init();
    Loader.init();
    LenisInit.init();
    NavManager.init();
    AOSCustom.init();
    CounterManager.init();
    TimelineDraw.init();
    FilterManager.init();
    ProjectModalManager.init();
    FormManager.init();
    BackToTop.init();
    ServiceCards.init();
    PageTransition.init();
  } catch (err) {
    console.error('Error during critical initialization:', err);
  }
});


/* ═══════════════════════════════════════════════
   19. RESUME DOWNLOAD BUTTON
   ═══════════════════════════════════════════════ */
const ResumeDownload = (() => {
  const init = () => {
    const btn = document.getElementById('downloadResumeBtn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('is-loading') || btn.classList.contains('is-success')) {
        e.preventDefault();
        return;
      }
      
      btn.classList.add('is-loading');

      const downloadLink = document.createElement('a');
      downloadLink.href = 'public/resume/Muhammad%20Arsalan%20Khan%20CV.pdf';
      downloadLink.download = 'Muhammad Arsalan Khan CV.pdf';
      downloadLink.hidden = true;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      
      setTimeout(() => {
        btn.classList.remove('is-loading');
        btn.classList.add('is-success');
        
        setTimeout(() => {
          btn.classList.remove('is-success');
        }, 3000);
      }, 1500);
    });
  };

  return { init };
})();

/* ═══════════════════════════════════════════════
   20. SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════ */
const ScrollProgress = (() => {
  const init = () => {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', Utils.throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
      }
    }, 16), { passive: true });
  };

  return { init };
})();

window.addEventListener('load', () => {
  // Non-critical / heavier features after full load
  try {
    Cursor.init();
    HeroScene.init();
    TypingEffect.init();
    SkillsManager.init();
    MagneticButton.init();
    HeroParallax.init();
    ResumeDownload.init();
    ScrollProgress.init();
    SwipeGestures.init();
  } catch (err) {
    console.error('Error during deferred module initialization:', err);
  }
});


/* ═══════════════════════════════════════════════════════════════════════
   GLOBAL ERROR HANDLING
   ═════════════════════════════════════════════════════════════════════ */
window.addEventListener('error', (event) => {
  console.error('Unhandled runtime error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});


/* ═══════════════════════════════════════════════════════════════════════
   END OF SCRIPT — Arsalan Khan Portfolio v1.0
   Modules: 17 | Lines: ~700+ | Architecture: Module singleton pattern
   Dependencies: Three.js (optional CDN), vanilla JS only otherwise
   ═══════════════════════════════════════════════════════════════════════ */