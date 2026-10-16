/* ==========================================================================
   Whitney Luus Designs — Interactions (vanilla JS, no dependencies)
   ========================================================================== */

(function () {
  'use strict';

  const EMAILJS_CONFIG = {
    publicKey: '2_KTmFQU3vvqmcDf7',
    serviceId: 'service_i0ny6tl',
    contactTemplate: 'template_tcioscd',
    mailingTemplate: 'template_dd3ioou'
  };

  const tagColors = [
    'var(--yellow)', 'var(--yellow10)', 'var(--yellow9)', 'var(--yellow8)',
    'var(--red)', 'var(--red10)', 'var(--red9)', 'var(--red8)', 'var(--red7)',
    'var(--green)', 'var(--green10)', 'var(--green9)', 'var(--green8)', 'var(--green7)',
    'var(--pink)', 'var(--pink10)', 'var(--pink9)', 'var(--pink8)', 'var(--pink7)',
    'var(--purple)', 'var(--purple10)', 'var(--purple9)', 'var(--purple8)', 'var(--purple7)',
    'var(--blue)', 'var(--blue10)', 'var(--blue9)', 'var(--blue8)', 'var(--blue7)'
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /* ------------------------------------------------------------------
     Splash screen
     ------------------------------------------------------------------ */
  function initSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return;

    document.body.classList.add('splash-lock');

    const finish = () => {
      splash.classList.add('is-done');
      document.body.classList.remove('splash-lock');
      window.setTimeout(() => splash.remove(), 600);
    };

    // Minimum splash time so the icon pop-in is visible
    const minTime = new Promise((resolve) => window.setTimeout(resolve, 1100));
    const loaded = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, { once: true });
      // Safety net if a resource hangs
      window.setTimeout(resolve, 3500);
    });

    Promise.all([minTime, loaded]).then(finish);
  }

  /* ------------------------------------------------------------------
     Hero headline word split
     ------------------------------------------------------------------ */
  function initHeroSplit() {
    document.querySelectorAll('[data-split]').forEach((el) => {
      const parts = [];
      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent
            .split(/\s+/)
            .filter(Boolean)
            .forEach((word) => parts.push({ text: word }));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          parts.push({ el: node });
        }
      });

      el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      el.innerHTML = '';

      parts.forEach((part, i) => {
        let node;
        if (part.el) {
          node = part.el;
          node.classList.add('word');
        } else {
          node = document.createElement('span');
          node.className = 'word';
          node.textContent = part.text;
        }
        node.style.setProperty('--i', i);
        node.setAttribute('aria-hidden', 'true');
        el.appendChild(node);
        if (i < parts.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }

  /* ------------------------------------------------------------------
     Tech marquee — clone track for seamless loop
     ------------------------------------------------------------------ */
  function initMarquee() {
    document.querySelectorAll('[data-marquee] .marquee-track').forEach((track) => {
      const clone = document.createDocumentFragment();
      Array.from(track.childNodes).forEach((node) => clone.appendChild(node.cloneNode(true)));
      track.appendChild(clone);
    });
  }

  /* ------------------------------------------------------------------
     Smooth scroll + mobile nav close
     ------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      if (!(e.target instanceof Element)) return;
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileNav();
      history.pushState(null, '', id);
    });
  }

  /* ------------------------------------------------------------------
     Mobile nav
     ------------------------------------------------------------------ */
  const menuBtn = document.querySelector('.mobile-menu');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobileNav() {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    mobileNav.hidden = true;
  }

  function initMobileNav() {
    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      menuBtn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mobileNav.hidden = open;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100 && menuBtn.getAttribute('aria-expanded') === 'true') closeMobileNav();
    });
  }

  /* ------------------------------------------------------------------
     Scroll spy
     ------------------------------------------------------------------ */
  function initScrollSpy() {
    const sections = document.querySelectorAll('#home, #services, #process, #faq, #about, #contact');
    const navLinks = document.querySelectorAll('nav .nav-links li');
    if (!sections.length || !navLinks.length) return;

    const setActive = (id) => {
      navLinks.forEach((li) => {
        const link = li.querySelector('a');
        li.classList.toggle('active', link && link.getAttribute('href') === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.15, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((item) => observer.observe(item));
  }

  /* ------------------------------------------------------------------
     Services tabs
     ------------------------------------------------------------------ */
  function initServiceTabs() {
    const tabs = Array.from(document.querySelectorAll('.services-btn[role="tab"]'));
    const panel = document.getElementById('service-panel');
    if (!tabs.length || !panel) return;

    const panes = Array.from(panel.querySelectorAll('.service-pane'));

    const colorTags = (pane) => {
      const colors = shuffle(tagColors.slice());
      pane.querySelectorAll('.tag').forEach((tag, i) => {
        tag.style.backgroundColor = colors[i % colors.length];
      });
    };

    const activate = (tab, focus = false, animate = true) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.classList.toggle('active', selected);
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', tab.id);

      const active = panes.find((pane) => pane.dataset.service === tab.dataset.service);
      if (!active) return;

      const swap = () => {
        panes.forEach((pane) => { pane.hidden = pane !== active; });
        colorTags(active);
      };

      if (!animate) {
        swap();
      } else {
        panel.classList.add('is-switching');
        window.setTimeout(() => {
          swap();
          panel.classList.remove('is-switching');
        }, 180);
      }

      if (focus) tab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(index + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(index - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
          e.preventDefault();
          activate(next, true);
        }
      });
    });

    // Sync the initially-visible pane without the fade transition
    if (tabs[0]) activate(tabs[0], false, false);
  }

  /* ------------------------------------------------------------------
     Forms (EmailJS)
     ------------------------------------------------------------------ */
  function setStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove('is-success', 'is-error');
    if (type) el.classList.add(type);
  }

  function setFieldError(input, errorEl, message) {
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errorEl.id);
      errorEl.textContent = message;
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      errorEl.textContent = '';
    }
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function initContactForm() {
    const form = document.getElementById('contact_form');
    if (!form) return;

    const status = form.parentElement.querySelector('.form-status');
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    const submit = form.querySelector('.submit-btn');

    const validators = [
      {
        input: name,
        error: form.querySelector('#name-error'),
        validate: (v) => (v ? '' : 'Name is required.')
      },
      {
        input: email,
        error: form.querySelector('#email-error'),
        validate: (v) => (!v ? 'Email is required.' : EMAIL_RE.test(v) ? '' : 'Please enter a valid email.')
      },
      {
        input: message,
        error: form.querySelector('#message-error'),
        validate: (v) => (v ? '' : 'Message is required.')
      }
    ];

    validators.forEach(({ input, error, validate }) => {
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') {
          setFieldError(input, error, validate(input.value.trim()));
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(status, '', null);

      let valid = true;
      validators.forEach(({ input, error, validate }) => {
        const msg = validate(input.value.trim());
        setFieldError(input, error, msg);
        if (msg) valid = false;
      });

      if (!valid) {
        setStatus(status, 'Please fix the highlighted fields.', 'is-error');
        return;
      }

      if (typeof emailjs === 'undefined') {
        setStatus(status, 'Something went wrong! Please email me directly.', 'is-error');
        return;
      }

      submit.disabled = true;
      submit.style.opacity = '0.6';

      try {
        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.contactTemplate, {
          name: name.value.trim(),
          surname: form.querySelector('#surname').value.trim(),
          number: form.querySelector('#number').value.trim(),
          email: email.value.trim(),
          message: message.value.trim()
        });
        setStatus(status, "Your message was received! I'll be in touch soon.", 'is-success');
        form.reset();
        validators.forEach(({ input, error }) => setFieldError(input, error, ''));
      } catch (err) {
        setStatus(status, 'Something went wrong! Please try again or email me directly.', 'is-error');
      } finally {
        submit.disabled = false;
        submit.style.opacity = '';
      }
    });
  }

  function initMailingForm() {
    const form = document.getElementById('mailing_form');
    if (!form) return;

    const status = document.querySelector('.mailing-form-status');
    const emailInput = form.querySelector('#mailing_email');
    const submit = form.querySelector('.mailing-list-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(status, '', null);

      const email = emailInput.value.trim();
      if (!email) {
        setStatus(status, 'Email is required.', 'is-error');
        return;
      }
      if (!EMAIL_RE.test(email)) {
        setStatus(status, 'Please enter a valid email.', 'is-error');
        return;
      }

      if (typeof emailjs === 'undefined') {
        setStatus(status, 'Something went wrong! Please try again.', 'is-error');
        return;
      }

      submit.disabled = true;
      submit.style.opacity = '0.6';

      try {
        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.mailingTemplate, { email });
        setStatus(status, "You've been added to the mailing list successfully.", 'is-success');
        form.reset();
      } catch (err) {
        setStatus(status, 'Failed to add you to the mailing list. Please try again.', 'is-error');
      } finally {
        submit.disabled = false;
        submit.style.opacity = '';
      }
    });
  }

  /* ------------------------------------------------------------------
     Back to top
     ------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let ticking = false;
    const toggle = () => {
      btn.hidden = window.scrollY < 600;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(toggle);
    }, { passive: true });

    toggle();
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  function initYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initEmailJS();
    initSplash();
    initHeroSplit();
    initMarquee();
    initSmoothScroll();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initServiceTabs();
    initContactForm();
    initMailingForm();
    initBackToTop();
    initYear();
  });
})();
