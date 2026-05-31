/* ============================================================
   script.js — Lab 06: Full JavaScript Implementation
   Muhammad Usman bin Rahman Shuja — Personal Portfolio

   TABLE OF CONTENTS
   01. DOM Ready Helper
   02. Preloader
   03. Custom Cursor
   04. Header — Scroll Shrink
   05. Mobile Navigation Toggle
   06. Theme Toggle (Dark / Light Mode)
   07. Typing Animation
   08. Scroll Reveal (IntersectionObserver)
   09. Skill Progress Bars Animation
   10. Active Navigation Highlight
   11. Project Filtering
   12. Avatar Cursor Tracking
   13. Contact Form Validation
   14. Scroll-To-Top Button
   15. Footer Year Auto-Update
   16. Init — Wire Everything Up
============================================================ */

'use strict';

/* ============================================================
   01. DOM READY HELPER
   Runs callback after DOM is fully parsed.
   Equivalent to $(document).ready() in jQuery.
============================================================ */
function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    // DOMContentLoaded already fired (script deferred or at bottom)
    callback();
  }
}



/* ============================================================
   02. PRELOADER
   - CSS keeps the preloader visible by default
   - On window 'load' (all assets done), we fade it out
   - Adds .preloader--hidden class (CSS handles the fade)
   - Then sets display:none after transition completes
============================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Ensure the preloader is visible on start
  preloader.style.display = 'flex';

  window.addEventListener('load', () => {
  //     document.querySelectorAll(".progress-bar__fill").forEach(bar => {
  //   bar.style.width = bar.dataset.progress + "%";
  // });
    // Small delay so the user sees the animation complete
    setTimeout(() => {
      preloader.classList.add('preloader--hidden');

      // Remove from DOM flow after CSS transition ends (600ms)
      preloader.addEventListener('transitionend', () => {
        preloader.style.display = 'none';
        // Reveal hero section elements now that page is loaded
        revealHeroElements();
      }, { once: true });
    }, 400);
  });
}


/* ============================================================
   03. CUSTOM CURSOR
   - cursor-dot: snaps instantly to mouse position
   - cursor-ring: trails behind with lerp (smooth interpolation)
   - Only active on non-touch (pointer: fine) devices
   - Adds body.cursor--hover when hovering interactive elements
============================================================ */
function initCustomCursor() {
  // Only run on devices that have a precise pointer (mouse)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Make cursors visible
  dot.style.display  = 'block';
  ring.style.display = 'block';

  // Current and target positions
  let mouseX = 0, mouseY = 0; // where mouse actually is
  let ringX  = 0, ringY  = 0; // where ring currently is (lerped)

  // Lerp factor — how fast ring chases the dot (0-1)
  // Lower = more lag / trail effect
  const LERP = 0.12;

  // Track actual mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Snap dot immediately
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Animate ring with lerp on every frame
  function animateRing() {
    ringX += (mouseX - ringX) * LERP;
    ringY += (mouseY - ringY) * LERP;

    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect: enlarge ring when over interactive elements
  const hoverTargets = 'a, button, [role="button"], input, textarea, .filter-btn, .project-card, .social__link';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor--hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor--hover');
    }
  });

  // Hide cursors when mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '';
    ring.style.opacity = '';
  });
}


/* ============================================================
   04. HEADER — SCROLL SHRINK
   Adds .header--scrolled class when page is scrolled past
   the header height. CSS handles the visual change.
============================================================ */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const SCROLL_THRESHOLD = 60; // px before header shrinks

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load in case page is already scrolled
}


/* ============================================================
   05. MOBILE NAVIGATION TOGGLE
   - Hamburger button toggles mobile menu open/close
   - Clicking any mobile nav link closes the menu
   - Pressing Escape key closes the menu
   - Updates aria-expanded attribute for accessibility
============================================================ */
function initMobileNav() {
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  if (!menuBtn || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    mobileMenu.classList.add('nav__mobile--open');
    menuBtn.classList.add('nav__hamburger--open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close navigation menu');
    // Prevent body scroll while menu is open
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    mobileMenu.classList.remove('nav__mobile--open');
    menuBtn.classList.remove('nav__hamburger--open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  // Toggle on hamburger click
  menuBtn.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Close when any mobile link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close when clicking outside the menu
  document.addEventListener('click', (e) => {
    if (isOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      closeMenu();
    }
  });
}


/* ============================================================
   06. THEME TOGGLE (Dark / Light Mode)
   - Reads saved preference from localStorage on page load
   - Toggles body.dark-mode class on button click
   - Saves new preference to localStorage
   - Updates aria-label for accessibility
============================================================ */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const STORAGE_KEY = 'mu-portfolio-theme';
  const DARK_CLASS  = 'dark-mode';

  // Load saved theme or fall back to OS preference
  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    // Respect OS dark mode preference if no saved preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add(DARK_CLASS);
      document.body.setAttribute('data-theme', 'dark');
      toggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      document.body.classList.remove(DARK_CLASS);
      document.body.setAttribute('data-theme', 'light');
      toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Apply theme immediately on load (before any paint)
  applyTheme(getSavedTheme());

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains(DARK_CLASS);
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  });
}


/* ============================================================
   07. TYPING ANIMATION
   - Cycles through an array of role strings
   - Types each character one by one, then deletes
   - Loops infinitely
   - Targets #typed-text span
============================================================ */
function initTypingAnimation() {
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  // The roles to cycle through
  const roles = [
    'Software Engineer',
    'Full Stack Developer',
    'Python Developer', 
    'AI Systems Engineer',
    'Data Scientist',
    'UI/UX Designer',
    'Machine Learning Enthusiast',
  ];

  let roleIndex   = 0;  // which role we're on
  let charIndex   = 0;  // which character in the current role
  let isDeleting  = false;
  let isPaused    = false;

  // Timing constants (ms)
  const TYPE_SPEED   = 90;   // ms per character when typing
  const DELETE_SPEED = 50;   // ms per character when deleting
  const PAUSE_AFTER  = 1800; // pause after fully typed
  const PAUSE_BEFORE = 400;  // pause before starting next word

  function tick() {
    const currentRole = roles[roleIndex];

    if (isPaused) return; // pause loop handled by setTimeout below

    if (!isDeleting) {
      // — Typing phase —
      typedEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // Finished typing — pause before deleting
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }

      setTimeout(tick, TYPE_SPEED);

    } else {
      // — Deleting phase —
      typedEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Finished deleting — move to next role
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;

        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          tick();
        }, PAUSE_BEFORE);
        return;
      }

      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Start after a short delay so it's not immediate on load
  setTimeout(tick, 1200);
}


/* ============================================================
   08. SCROLL REVEAL (IntersectionObserver)
   - Watches all elements with [data-scroll-reveal]
   - Adds .revealed class when element enters viewport
   - Respects data-delay attribute for staggered animations
   - CSS in style.css handles the actual animation
============================================================ */
function initScrollReveal() {
  // Skip if browser doesn't support IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    // Fallback: reveal everything immediately
    document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const revealElements = document.querySelectorAll('[data-scroll-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.getAttribute('data-delay') || '0';

        // Apply delay if specified
        if (delay && delay !== '0') {
          el.style.transitionDelay = parseInt(delay) + 'ms';
        }

        el.classList.add('revealed');

        // Once revealed, no need to keep observing
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,    // trigger when 12% of element is visible
    rootMargin: '0px 0px -60px 0px' // offset bottom so it triggers a bit before edge
  });

  revealElements.forEach(el => observer.observe(el));
}

/* Helper: reveal hero section immediately after preloader */
function revealHeroElements() {
  const heroEls = document.querySelectorAll('.section--hero [data-scroll-reveal]');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, i * 150); // stagger each hero element by 150ms
  });
}


/* ============================================================
   09. SKILL PROGRESS BARS ANIMATION
   - Reads data-progress="N" from .progress-bar__fill elements
   - Animates width from 0 to N% when the skills section
     enters the viewport (one-shot via IntersectionObserver)
============================================================ */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  if (!skillSection) return;

  const bars = document.querySelectorAll('.progress-bar__fill[data-progress]');
  if (!bars.length) return;

  let animated = false; // only animate once

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;

        bars.forEach((bar, index) => {
          const target = parseInt(bar.getAttribute('data-progress')) || 0;

          // Stagger each bar slightly
          setTimeout(() => {
            bar.style.width = target + '%';
          }, index * 80);
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(skillSection);
}

function initSkillCount() {
  const skills = document.querySelectorAll('.progress-bar__fill[data-progress]');
  const counter = document.querySelector('.skills-count');

  if (!counter) return;

  const count = skills.length;
  counter.textContent = count > 0 ? count + '+' : '0+';
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-card__number[data-target]");
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let current = 0;

    const step = Math.ceil(target / 30);

    const update = () => {
      current += step;
      counter.textContent = current >= target ? target + "+" : current + "+";

      if (current < target) {
        requestAnimationFrame(update);
      }
    };

    update();
  });
}

function initCoreInterests() {
  const categories = document.querySelectorAll("[data-skill-category]");

  const count = categories.length;

  const display = document.querySelector("[data-core-interests]");
  if (display) {
    display.textContent = count + "+";
  }
}

/* ============================================================
   10. ACTIVE NAVIGATION HIGHLIGHT
   - Uses IntersectionObserver to watch each section
   - Highlights the corresponding nav link when section
     is at least 40% visible in the viewport
   - Updates both desktop (.nav__link) and mobile (.nav__mobile-link)
============================================================ */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link[data-section]');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link[data-section]');

  if (!sections.length || !navLinks.length) return;

  // Track which section is most visible
  const sectionVisibility = {};

  function setActiveLink(sectionId) {
    // Desktop links
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
    });
    // Mobile links
    mobileLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      sectionVisibility[entry.target.id] = entry.intersectionRatio;
    });

    // Find the section with the highest visibility ratio
    let maxRatio   = 0;
    let activeSectionId = 'home';

    Object.entries(sectionVisibility).forEach(([id, ratio]) => {
      if (ratio > maxRatio) {
        maxRatio = ratio;
        activeSectionId = id;
      }
    });

    setActiveLink(activeSectionId);
  }, {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
    rootMargin: '-10% 0px -10% 0px'
  });

  sections.forEach(section => {
    sectionVisibility[section.id] = 0;
    observer.observe(section);
  });
}


/* ============================================================
   11. PROJECT FILTERING
   - Filter buttons have data-filter="category" attribute
   - Project cards have data-category="category" attribute
   - "all" shows everything
   - Matching cards are shown, non-matching are hidden
   - Active filter button gets .filter-btn--active class
============================================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const projectCards = Array.from(document.querySelectorAll('.project-card[data-category]'));
  const showMoreBtn = document.querySelector('#show-more-btn');

  const SHOW_LIMIT = 12;

  let currentFilter = 'all';
  let visibleCount = SHOW_LIMIT;
  let filteredCards = [];

  // =========================
  // GET FILTERED CARDS
  // =========================
  function getFilteredCards() {
    return projectCards.filter(card => {
      const category = card.getAttribute('data-category');
      return currentFilter === 'all' || category === currentFilter;
    });
  }

  // =========================
  // RENDER FUNCTION
  // =========================
  function renderProjects() {
    filteredCards = getFilteredCards();

    // reset visible count if list changes
    if (visibleCount > filteredCards.length) {
      visibleCount = SHOW_LIMIT;
    }

    projectCards.forEach(card => {
      card.style.display = 'none';
    });

    filteredCards.forEach((card, index) => {
      if (index < visibleCount) {
        card.style.display = 'block';

        // animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px) scale(0.96)';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });
        });
      }
    });

    updateShowMoreButton();
  }

  // =========================
  // SHOW MORE BUTTON LOGIC
  // =========================
  function updateShowMoreButton() {
    if (!showMoreBtn) return;

    if (visibleCount >= filteredCards.length) {
      showMoreBtn.style.display = 'none';
    } else {
      showMoreBtn.style.display = 'inline-flex';
    }
  }

  // =========================
  // FILTER CLICK
  // =========================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      currentFilter = btn.getAttribute('data-filter');
      visibleCount = SHOW_LIMIT;

      renderProjects();
    });
  });

  // =========================
  // SHOW MORE CLICK
  // =========================
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      visibleCount += SHOW_LIMIT;
      renderProjects();
    });
  }

  // =========================
  // INIT
  // =========================
  renderProjects();

  // optional counter
  const counter = document.querySelector(".projects-count");
  if (counter) {
    counter.textContent = `${projectCards.length}+`;
  }
}
/* ============================================================
   12. AVATAR CURSOR TRACKING
   - The #avatar div gently tilts toward the cursor
   - Uses requestAnimationFrame for smooth lerp movement
   - Max tilt angle: ±12deg on both axes
   - Only active on devices with a precise pointer
============================================================ */
function initAvatarTracking() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const avatar = document.getElementById('avatar');
  if (!avatar) return;

  const MAX_TILT = 12; // degrees
  const LERP_FACTOR = 0.06;

  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;

  document.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;

    // Normalize to -1 … +1 range based on cursor position
    const normX = (e.clientX / innerWidth  - 0.5) * 2;
    const normY = (e.clientY / innerHeight - 0.5) * 2;

    targetTiltY =  normX * MAX_TILT; // left/right → rotate Y
    targetTiltX = -normY * MAX_TILT; // up/down   → rotate X
  });

  function animateTilt() {
    currentTiltX += (targetTiltX - currentTiltX) * LERP_FACTOR;
    currentTiltY += (targetTiltY - currentTiltY) * LERP_FACTOR;

    avatar.style.transform =
      `perspective(600px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;

    requestAnimationFrame(animateTilt);
  }

  animateTilt();

  // Reset when mouse leaves the page
  document.addEventListener('mouseleave', () => {
    targetTiltX = 0;
    targetTiltY = 0;
  });
}


/* ============================================================
   13. CONTACT FORM VALIDATION
   - Validates: name, email, subject, message fields
   - Shows inline error messages on each field
   - Highlights invalid inputs with .is-invalid class
   - Shows .form-notification on submit success or failure
   - Uses preventDefault() to stop default form submission
============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Field config: [inputId, errorSpanId, validationFn, errorMessage]
  const fields = [
    {
      id:    'contact-name',
      error: 'name-error',
      test:  (val) => val.trim().length >= 2,
      msg:   'Please enter your full name (at least 2 characters).',
    },
    {
      id:    'contact-email',
      error: 'email-error',
      test:  (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      msg:   'Please enter a valid email address.',
    },
    {
      id:    'contact-subject',
      error: 'subject-error',
      test:  (val) => val.trim().length >= 3,
      msg:   'Please enter a subject (at least 3 characters).',
    },
    {
      id:    'contact-message',
      error: 'message-error',
      test:  (val) => val.trim().length >= 10,
      msg:   'Please enter a message (at least 10 characters).',
    },
  ];

  const notification = document.getElementById('form-notification');

  // Show/hide inline error for a single field
  function validateField(fieldConfig) {
    const input    = document.getElementById(fieldConfig.id);
    const errorEl  = document.getElementById(fieldConfig.error);
    if (!input || !errorEl) return true;

    const isValid = fieldConfig.test(input.value);

    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      errorEl.textContent = '';
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      errorEl.textContent = fieldConfig.msg;
    }

    return isValid;
  }

  // Live validation: validate a field as user types/blurs
  fields.forEach(fieldConfig => {
    const input = document.getElementById(fieldConfig.id);
    if (!input) return;

    input.addEventListener('blur',  () => validateField(fieldConfig));
    input.addEventListener('input', () => {
      // Only re-validate if already marked invalid (don't nag while typing)
      if (input.classList.contains('is-invalid')) {
        validateField(fieldConfig);
      }
    });
  });

  // Full validation on submit
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Always prevent default for static site

    let allValid = true;

    fields.forEach(fieldConfig => {
      const valid = validateField(fieldConfig);
      if (!valid) allValid = false;
    });

    if (!notification) return;

    if (allValid) {
      // Success state
      notification.removeAttribute('hidden');
      notification.className = 'form-notification form-notification--success';
      notification.textContent =
        '✓ Thank you! Your message has been received. I will get back to you soon.';

      // Reset form after success
      setTimeout(() => {
        form.reset();
        fields.forEach(({ id }) => {
          const input = document.getElementById(id);
          if (input) {
            input.classList.remove('is-valid', 'is-invalid');
          }
        });
        // Hide notification after a few seconds
        setTimeout(() => {
          notification.setAttribute('hidden', '');
          notification.textContent = '';
        }, 5000);
      }, 800);

    } else {
      // Error state
      notification.removeAttribute('hidden');
      notification.className = 'form-notification form-notification--error';
      notification.textContent =
        '✗ Please fix the errors above before sending.';

      // Scroll to first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
    }
  });
}


/* ============================================================
   14. SCROLL-TO-TOP BUTTON
   - Shows button (#scroll-top-btn) after scrolling 300px
   - Smooth scrolls to top when clicked
   - CSS controls opacity; we manage the [hidden] attribute
============================================================ */
function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  const SHOW_AFTER = 300; // px

  function onScroll() {
    if (window.scrollY > SHOW_AFTER) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // check on load
}


/* ============================================================
   15. FOOTER YEAR AUTO-UPDATE
   Writes the current year into #current-year span.
============================================================ */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


/* ============================================================
   16. SMOOTH SCROLL FOR ANCHOR LINKS
   Intercepts clicks on href="#section" links for consistent
   smooth scrolling, accounting for the fixed header height.
============================================================ */
function initSmoothScroll() {
  const HEADER_OFFSET = 70; // matches --header-h in CSS

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const targetY =
      targetEl.getBoundingClientRect().top +
      window.scrollY -
      HEADER_OFFSET;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
}


/* ============================================================
   INIT — WIRE EVERYTHING UP
   Called once DOM is ready. Each feature is independent;
   if one fails it won't break the others.
============================================================ */
onDOMReady(() => {

  // UI utilities (run first, no dependencies)
  initFooterYear();
  initThemeToggle();       // must run early to avoid flash of wrong theme
  initPreloader();         // sets up load event listener

  // Navigation
  initHeaderScroll();
  initMobileNav();
  initActiveNav();
  initSmoothScroll();

  // Hero section
  initTypingAnimation();
  initAvatarTracking();

  // Scroll-driven features
  initScrollReveal();
  initSkillBars();
  initSkillCount(); 
  initCoreInterests();
  initCounters();
  initScrollToTop();

  // Interactive components
  initProjectFilter();
  initContactForm();

  // Cursor (last — relies on body classes being set)
  initCustomCursor();

  // Accessibility: if page loads mid-way (e.g. browser restored scroll),
  // immediately reveal elements that are already in view
  setTimeout(() => {
    document.querySelectorAll('[data-scroll-reveal]:not(.revealed)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
  }, 100);

});