/* Riya Studio — shared interactivity */

(function () {
  'use strict';

  const MODE_KEY = 'riya-mode';

  function getMode() {
    return localStorage.getItem(MODE_KEY) || 'professional';
  }

  function setMode(mode) {
    localStorage.setItem(MODE_KEY, mode);
    document.documentElement.setAttribute('data-mode', mode);
    document.querySelectorAll('[data-mode-btn]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-mode-btn') === mode);
    });
  }

  function initMode() {
    var preferred = document.body.getAttribute('data-preferred-mode');
    var mode = preferred || getMode();
    setMode(mode);

    document.querySelectorAll('[data-mode-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-mode-btn');
        setMode(next);
      });
    });
  }

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    var nav = document.querySelector('.site-nav');

    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? '✕' : '☰';
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('open');
          toggle.textContent = '☰';
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    if (nav) {
      var onScroll = function () {
        nav.classList.toggle('scrolled', window.scrollY > 12);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Mark active nav link
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path) a.classList.add('active');
    });
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(function (el) { io.observe(el); });
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var duration = 1400;
      var start = performance.now();

      function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        var value = target * eased;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { io.observe(el); });
  }

  function initCursorGlow() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    var x = 0, y = 0, tx = 0, ty = 0;

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    function loop() {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
      requestAnimationFrame(loop);
    }
    loop();
  }

  function initLightbox() {
    var cards = document.querySelectorAll('[data-lightbox]');
    if (!cards.length) return;

    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Close">✕</button>' +
      '<div class="lightbox-inner">' +
      '  <div class="lightbox-frame"></div>' +
      '  <h3 class="lb-title"></h3>' +
      '  <p class="lb-meta" style="margin:0;color:var(--text-muted)"></p>' +
      '</div>';
    document.body.appendChild(lb);

    var frame = lb.querySelector('.lightbox-frame');
    var title = lb.querySelector('.lb-title');
    var meta = lb.querySelector('.lb-meta');
    var closeBtn = lb.querySelector('.lightbox-close');

    function open(card) {
      var bg = card.getAttribute('data-bg') || '';
      var t = card.getAttribute('data-title') || '';
      var m = card.getAttribute('data-meta') || '';
      frame.innerHTML = '';
      if (bg.startsWith('linear') || bg.startsWith('#') || bg.startsWith('rgb')) {
        frame.style.background = bg;
        frame.innerHTML = '<div class="art-placeholder">Artwork preview</div>';
      } else if (bg) {
        frame.style.background = '';
        var img = document.createElement('img');
        img.src = bg;
        img.alt = t;
        frame.appendChild(img);
      }
      title.textContent = t;
      meta.textContent = m;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    cards.forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function () { open(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(card);
        }
      });
    });
    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function initPortalParallax() {
    var sides = document.querySelectorAll('.portal-side');
    if (!sides.length || !window.matchMedia('(hover: hover)').matches) return;

    sides.forEach(function (side) {
      side.addEventListener('mousemove', function (e) {
        var rect = side.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        var orb = side.querySelector('.orb');
        if (orb) {
          orb.style.transform = 'translate(' + px * 30 + 'px,' + py * 24 + 'px)';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMode();
    initNav();
    initReveal();
    initCounters();
    initCursorGlow();
    initLightbox();
    initPortalParallax();
  });
})();
