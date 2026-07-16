/* Interactive résumé visuals */
(function () {
  'use strict';

  /* ---- Live Siemens tenure (Feb 2022 → now) ---- */
  function siemensYears() {
    var start = new Date(2022, 1, 1); // Feb 2022
    var now = new Date();
    var ms = Math.max(0, now - start);
    var years = ms / (365.25 * 24 * 60 * 60 * 1000);
    return Math.round(years * 10) / 10;
  }

  function formatTenureLabel(y) {
    var whole = Math.floor(y);
    var months = Math.round((y - whole) * 12);
    if (months === 12) { whole += 1; months = 0; }
    if (whole <= 0) return months + ' mo ongoing';
    if (months === 0) return whole + '+ yr ongoing';
    return whole + ' yr ' + months + ' mo · ongoing';
  }

  var siemensY = siemensYears();
  var tenureLabel = formatTenureLabel(siemensY);
  var tenureEl = document.getElementById('siemens-tenure-label');
  if (tenureEl) tenureEl.textContent = tenureLabel;

  /* ---- Tenure bars ---- */
  var tenure = [
    { label: 'Siemens FS', years: siemensY, max: 6, current: true, display: siemensY.toFixed(1) + 'y+', sub: 'Ongoing' },
    { label: 'Hero Housing', years: 2.9, max: 6, display: '2.9y' },
    { label: 'Indiabulls', years: 2.2, max: 6, display: '2.2y' },
    { label: 'CRISIL', years: 2.9, max: 6, display: '2.9y' }
  ];

  var awards = [
    { label: 'Siemens', years: 4, max: 4, current: true, display: '4', sub: 'Current' },
    { label: 'CRISIL', years: 4, max: 4, display: '4' },
    { label: 'Indiabulls', years: 2, max: 4, display: '2' },
    { label: 'Hero', years: 1, max: 4, display: '1' }
  ];

  function renderBars(rootId, data) {
    var root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = '';
    data.forEach(function (d) {
      var row = document.createElement('div');
      row.className = 'rv-bar-row' + (d.current ? ' current' : '');
      var pct = Math.min(100, Math.round((d.years / d.max) * 100));
      var valClass = d.current ? 'rv-bar-val ongoing' : 'rv-bar-val';
      var valHtml = d.sub
        ? (d.display || d.years) + '<small>' + d.sub + '</small>'
        : (d.display || d.years);
      row.innerHTML =
        '<div class="rv-bar-label">' + d.label + '</div>' +
        '<div class="rv-bar-track"><div class="rv-bar-fill" data-w="' + pct + '%"></div></div>' +
        '<div class="' + valClass + '">' + valHtml + '</div>';
      root.appendChild(row);
    });
  }

  renderBars('tenure-bars', tenure);
  renderBars('award-bars', awards);

  function animateBars(root) {
    if (!root) return;
    root.querySelectorAll('.rv-bar-fill').forEach(function (el) {
      el.style.width = el.getAttribute('data-w');
    });
  }

  /* ---- Skill bars ---- */
  function initSkillBars() {
    document.querySelectorAll('.rv-sbar').forEach(function (el) {
      var pct = el.getAttribute('data-pct') || '0';
      el.style.setProperty('--pct', pct + '%');
    });
  }
  initSkillBars();

  /* ---- Radar chart ---- */
  function drawRadar() {
    var canvas = document.getElementById('skill-radar');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;
    var cx = W / 2;
    var cy = H / 2;
    var R = Math.min(W, H) * 0.34;

    var labels = [
      'Credit Risk',
      'Modelling',
      'Portfolio',
      'Automation',
      'Stakeholder',
      'Leadership'
    ];
    var values = [0.95, 0.88, 0.9, 0.92, 0.85, 0.9];
    var n = labels.length;

    function point(i, r) {
      var a = (-Math.PI / 2) + (i * 2 * Math.PI) / n;
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
    }

    ctx.clearRect(0, 0, W, H);

    // rings
    for (var ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (var i = 0; i < n; i++) {
        var p = point(i, (R * ring) / 4);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = ring === 4 ? 'rgba(13,148,136,0.35)' : 'rgba(15,60,72,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // axes
    for (var j = 0; j < n; j++) {
      var tip = point(j, R);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tip.x, tip.y);
      ctx.strokeStyle = 'rgba(15,60,72,0.12)';
      ctx.stroke();
    }

    // polygon
    ctx.beginPath();
    for (var k = 0; k < n; k++) {
      var q = point(k, R * values[k]);
      if (k === 0) ctx.moveTo(q.x, q.y);
      else ctx.lineTo(q.x, q.y);
    }
    ctx.closePath();
    var grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, R);
    grad.addColorStop(0, 'rgba(13,148,136,0.35)');
    grad.addColorStop(1, 'rgba(59,158,255,0.2)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 2;
    ctx.stroke();

    // dots + labels
    ctx.font = '600 10px "DM Sans", system-ui, sans-serif';
    ctx.fillStyle = '#0f2a32';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var m = 0; m < n; m++) {
      var d = point(m, R * values[m]);
      ctx.beginPath();
      ctx.arc(d.x, d.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0d9488';
      ctx.fill();
      var lp = point(m, R + 22);
      ctx.fillStyle = '#4a6a74';
      ctx.fillText(labels[m], lp.x, lp.y);
    }
  }

  drawRadar();
  window.addEventListener('resize', function () {
    // redraw only if canvas exists
    drawRadar();
  });

  /* ---- Intersection observers ---- */
  if ('IntersectionObserver' in window) {
    var barIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateBars(e.target);
          barIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    ['tenure-bars', 'award-bars'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) barIo.observe(el);
    });

    var skillIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          skillIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.rv-sbar').forEach(function (el) {
      skillIo.observe(el);
    });

    /* TOC highlight */
    var sections = document.querySelectorAll('.rv-section[id], .rv-hero[id]');
    var tocLinks = document.querySelectorAll('.rv-toc a');
    var tocIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          tocLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { tocIo.observe(s); });
  } else {
    animateBars(document.getElementById('tenure-bars'));
    animateBars(document.getElementById('award-bars'));
    document.querySelectorAll('.rv-sbar').forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();
