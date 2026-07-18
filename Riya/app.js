/* ===========================================================
   For Riya — Birthday party (default) + optional 10-door mystery
   Customize messages & photos in CONFIG below.
   =========================================================== */

(() => {
  "use strict";

  const CONFIG = {
    wifeName: "Riya",
    age: 35,
    birthday: { month: 7, day: 19 },

    // Featured photos for mystery doors 3, 5, 7
    memories: [
      {
        src: "images/e0f8d9e3-a22e-47c0-a85a-580aaabb301e.JPG",
        caption: "Us, under one umbrella.",
        note: "Rain or shine — I’d choose this seat next to you every time.",
      },
      {
        src: "images/IMG_2719.jpeg",
        caption: "You, glowing.",
        note: "This smile held a whole universe inside it. I was already so proud of you.",
      },
      {
        src: "images/IMG_5759.jpeg",
        caption: "Our little three.",
        note: "Home isn’t four walls. It’s this — you, me, and the love we made.",
      },
    ],

    // Full album — every photo on the birthday party page (+ mystery scrapbook)
    photoFiles: [
      {
        src: "images/e0f8d9e3-a22e-47c0-a85a-580aaabb301e.JPG",
        caption: "Us under the blue umbrella — my favourite weather is whatever we’re in together.",
      },
      {
        src: "images/20220615_182220.JPG",
        caption: "Playful, strong, unstoppable — this is the joy I married.",
      },
      {
        src: "images/IMG_2719.jpeg",
        caption: "Sparkle dress, brighter smile — you made waiting for our baby feel like magic.",
      },
      {
        src: "images/IMG_0650.jpeg",
        caption: "City lights behind you, and still you were the brightest thing in the frame.",
      },
      {
        src: "images/IMG_3028.jpeg",
        caption: "Beach, balloons, and the two of us becoming three.",
      },
      {
        src: "images/IMG_0212.jpeg",
        caption: "The way you hold our baby — pure love, no filter needed.",
      },
      {
        src: "images/IMG_5759.jpeg",
        caption: "Lazy afternoon, full hearts. Our first little family selfie era.",
      },
      {
        src: "images/97130922-6e01-41eb-83db-c9a49c0d688f.JPG",
        caption: "Party balloons and the three of us — already a whole celebration.",
      },
      {
        src: "images/IMG_6982.jpeg",
        caption: "You and our little one — elegance and soft chaos, perfectly you.",
      },
      {
        src: "images/IMG_8992.jpeg",
        caption: "Little royalty in gold, and the queen who holds them close.",
      },
      {
        src: "images/IMG_8650.jpeg",
        caption: "Barefoot on the shore with our baby — free, happy, ours.",
      },
      {
        src: "images/IMG_9881.jpeg",
        caption: "Night beach smiles — my favourite team of three.",
      },
      {
        src: "images/IMG_9502.jpeg",
        caption: "Waterfalls, mist, and you leaning on me. Adventure looks good on us.",
      },
      {
        src: "images/IMG_7174.jpeg",
        caption: "Family night, festival lights — generations of love around our little one.",
      },
    ],

    storageKey: "riya-mystery-v1",
  };

  const TOTAL_STEPS = 10;

  const $ = (id) => document.getElementById(id);
  const gate = $("gate");
  const journey = $("journey");
  const finale = $("finale");
  const stageRoot = $("stageRoot");
  const progressFill = $("progressFill");
  const progressDots = $("progressDots");
  const stepNum = $("stepNum");
  const journeyLabel = $("journeyLabel");
  const journeyWhisper = $("journeyWhisper");

  let partyPath = "direct";
  let currentStep = 0;

  // ── Stars ──────────────────────────────────────────────
  function initStars() {
    const canvas = $("stars");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, stars;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      stars = Array.from({ length: Math.min(160, Math.floor((w * h) / 12000)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random(),
        s: Math.random() * 0.02 + 0.005,
      }));
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * s.s + s.a * 10));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 240, 255, ${tw})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(draw);
  }

  // ── Confetti ───────────────────────────────────────────
  const confetti = (() => {
    const canvas = $("confetti");
    if (!canvas) return { burst: () => {}, rain: () => {} };
    const ctx = canvas.getContext("2d");
    let w, h, parts = [], running = false;
    const COLORS = ["#f0c674", "#f472b6", "#c4b5fd", "#fff1d6", "#fb7185", "#a78bfa", "#fde68a"];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function spawn(n, opts = {}) {
      const { x = w / 2, y = h * 0.35, spread = 1, gravity = 0.12 } = opts;
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = (Math.random() * 8 + 4) * spread;
        parts.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * vel,
          vy: Math.sin(angle) * vel - Math.random() * 6,
          g: gravity,
          w: Math.random() * 8 + 4,
          h: Math.random() * 6 + 3,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.25,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          life: 1,
          decay: Math.random() * 0.008 + 0.004,
        });
      }
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      parts = parts.filter((p) => p.life > 0 && p.y < h + 40);
      for (const p of parts) {
        p.vy += p.g;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= p.decay;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (parts.length) requestAnimationFrame(tick);
      else {
        running = false;
        ctx.clearRect(0, 0, w, h);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    return {
      burst: (n = 120) => spawn(n, { x: w / 2, y: h * 0.3, spread: 1.2 }),
      rain: (n = 80) => {
        for (let i = 0; i < n; i++) {
          spawn(1, { x: Math.random() * w, y: -10, spread: 0.4, gravity: 0.08 });
        }
      },
    };
  })();

  function spawnBalloons(count = 14) {
    const el = $("balloons");
    if (!el) return;
    el.innerHTML = "";
    const colors = ["#f472b6", "#c4b5fd", "#f0c674", "#fb7185", "#a78bfa", "#fde68a", "#67e8f9"];
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "balloon";
      b.style.left = `${Math.random() * 100}%`;
      b.style.background = colors[i % colors.length];
      b.style.animationDuration = `${10 + Math.random() * 10}s`;
      b.style.animationDelay = `${Math.random() * 6}s`;
      b.style.width = `${28 + Math.random() * 16}px`;
      b.style.height = `${40 + Math.random() * 18}px`;
      el.appendChild(b);
    }
  }

  // ── Happy Birthday music ───────────────────────────────
  const music = (() => {
    let ctx = null;
    let playing = false;
    let nextNoteTime = 0;
    let noteIndex = 0;
    let timerId = null;
    let master = null;

    const Q = 0.48;
    const E = Q / 2;
    const DH = Q * 3;

    const SONG = [
      { n: 60, d: E }, { n: 60, d: E }, { n: 62, d: Q }, { n: 60, d: Q }, { n: 65, d: Q }, { n: 64, d: DH },
      { n: 60, d: E }, { n: 60, d: E }, { n: 62, d: Q }, { n: 60, d: Q }, { n: 67, d: Q }, { n: 65, d: DH },
      { n: 60, d: E }, { n: 60, d: E }, { n: 72, d: Q }, { n: 69, d: Q }, { n: 65, d: Q }, { n: 64, d: Q }, { n: 62, d: DH },
      { n: 70, d: E }, { n: 70, d: E }, { n: 69, d: Q }, { n: 65, d: Q }, { n: 67, d: Q }, { n: 65, d: DH },
    ];

    const CHORDS = [
      { at: 0, notes: [48, 52, 55] },
      { at: 6, notes: [48, 52, 55] },
      { at: 12, notes: [48, 53, 57] },
      { at: 19, notes: [43, 47, 50, 55] },
    ];

    function midiToFreq(m) {
      return 440 * Math.pow(2, (m - 69) / 12);
    }

    function ensure() {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain();
        master.gain.value = 0.18;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 3200;
        master.connect(filter);
        filter.connect(ctx.destination);
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }

    function playMelodyNote(midi, start, dur) {
      const freq = midiToFreq(midi);
      const end = start + dur;
      const lead = ctx.createOscillator();
      const leadG = ctx.createGain();
      lead.type = "square";
      lead.frequency.setValueAtTime(freq, start);
      const spark = ctx.createOscillator();
      const sparkG = ctx.createGain();
      spark.type = "triangle";
      spark.frequency.setValueAtTime(freq * 2, start);
      const attack = 0.018;
      const release = Math.min(0.1, dur * 0.25);
      const peak = 0.22;
      leadG.gain.setValueAtTime(0, start);
      leadG.gain.linearRampToValueAtTime(peak, start + attack);
      leadG.gain.setValueAtTime(peak * 0.85, Math.max(start + attack, end - release));
      leadG.gain.linearRampToValueAtTime(0, end);
      sparkG.gain.setValueAtTime(0, start);
      sparkG.gain.linearRampToValueAtTime(0.06, start + attack);
      sparkG.gain.linearRampToValueAtTime(0, end);
      lead.connect(leadG);
      leadG.connect(master);
      spark.connect(sparkG);
      sparkG.connect(master);
      lead.start(start);
      lead.stop(end + 0.02);
      spark.start(start);
      spark.stop(end + 0.02);
    }

    function playChord(notes, start, dur) {
      const end = start + dur;
      for (const midi of notes) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(midiToFreq(midi), start);
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(0.07, start + 0.04);
        g.gain.linearRampToValueAtTime(0.04, start + dur * 0.5);
        g.gain.linearRampToValueAtTime(0, end);
        osc.connect(g);
        g.connect(master);
        osc.start(start);
        osc.stop(end + 0.02);
      }
    }

    function schedule() {
      if (!playing || !ctx) return;
      const now = ctx.currentTime;
      while (nextNoteTime < now + 0.25) {
        const stepInSong = noteIndex % SONG.length;
        const { n, d } = SONG[stepInSong];
        const chord = CHORDS.find((c) => c.at === stepInSong);
        if (chord) playChord(chord.notes, nextNoteTime, Q * 2.5);
        playMelodyNote(n, nextNoteTime, d * 0.94);
        nextNoteTime += d;
        noteIndex++;
        if (noteIndex % SONG.length === 0) nextNoteTime += Q * 1.25;
      }
      timerId = setTimeout(schedule, 60);
    }

    function start() {
      ensure();
      if (playing) return;
      playing = true;
      noteIndex = 0;
      nextNoteTime = ctx.currentTime + 0.05;
      schedule();
      setMusicUI(true);
    }

    function stop() {
      playing = false;
      if (timerId) clearTimeout(timerId);
      timerId = null;
      setMusicUI(false);
    }

    function toggle() {
      if (playing) stop();
      else start();
      return playing;
    }

    return { start, stop, toggle, isPlaying: () => playing, ensure };
  })();

  function setMusicUI(on) {
    const btn = $("toggleMusic");
    if (!btn) return;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    if ($("musicIcon")) $("musicIcon").textContent = on ? "🎂" : "🔇";
    if ($("musicLabel")) $("musicLabel").textContent = on ? "Happy Birthday" : "Music off";
  }

  // ── Progress ───────────────────────────────────────────
  function saveProgress() {
    try {
      localStorage.setItem(CONFIG.storageKey, String(currentStep));
    } catch (_) {}
  }

  function loadProgress() {
    try {
      const v = parseInt(localStorage.getItem(CONFIG.storageKey), 10);
      if (!Number.isNaN(v) && v >= 0 && v <= TOTAL_STEPS) return v;
    } catch (_) {}
    return 0;
  }

  function buildProgressDots() {
    if (!progressDots) return;
    progressDots.innerHTML = "";
    for (let i = 0; i < TOTAL_STEPS; i++) {
      const d = document.createElement("div");
      d.className = "progress-dot";
      d.setAttribute("role", "listitem");
      d.title = `Door ${i + 1}`;
      progressDots.appendChild(d);
    }
  }

  function updateProgressUI() {
    const pct = ((currentStep >= TOTAL_STEPS ? TOTAL_STEPS : currentStep + 1) / TOTAL_STEPS) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (stepNum) stepNum.textContent = String(Math.min(currentStep + 1, TOTAL_STEPS));
    if (progressDots) {
      [...progressDots.children].forEach((el, i) => {
        el.classList.toggle("is-done", i < currentStep);
        el.classList.toggle("is-current", i === currentStep && currentStep < TOTAL_STEPS);
      });
    }
    if (journeyLabel) {
      journeyLabel.textContent =
        currentStep === 0
          ? `A secret for ${CONFIG.wifeName}`
          : currentStep < TOTAL_STEPS
            ? `Door ${currentStep + 1} of ${TOTAL_STEPS}`
            : "The reveal";
    }
  }

  // ── Stage helpers ──────────────────────────────────────
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function continueButton(label, onClick, disabled = false) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-magic";
    btn.disabled = disabled;
    btn.innerHTML = `<span class="btn-sparkle" aria-hidden="true">✦</span> ${label} <span class="btn-sparkle" aria-hidden="true">✦</span>`;
    btn.addEventListener("click", onClick);
    return btn;
  }

  function softSpark() {
    confetti.burst(40);
  }

  function goNext() {
    const card = stageRoot?.querySelector(".stage-card");
    if (card) {
      card.classList.add("is-exit");
      setTimeout(() => {
        currentStep += 1;
        saveProgress();
        if (currentStep >= TOTAL_STEPS) openFinale();
        else renderStage();
      }, 320);
    } else {
      currentStep += 1;
      saveProgress();
      if (currentStep >= TOTAL_STEPS) openFinale();
      else renderStage();
    }
  }

  function memoryBlock(index) {
    const m = CONFIG.memories[index] || {
      src: `images/${index + 1}.jpg`,
      caption: "A favourite memory",
      note: "This one is ours.",
    };
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <p class="memory-caption">${escapeHtml(m.caption)}</p>
      <div class="memory-frame" data-src="${m.src}">
        <div class="memory-placeholder">
          <span>📷</span>
          Photo coming soon<br/><small>${escapeHtml(m.src)}</small>
        </div>
      </div>
      <p class="stage-body" style="margin-bottom:14px">${escapeHtml(m.note)}</p>
    `;
    const frame = wrap.querySelector(".memory-frame");
    const img = new Image();
    img.alt = m.caption;
    img.onload = () => {
      frame.innerHTML = "";
      frame.appendChild(img);
    };
    img.onerror = () => {};
    img.src = m.src;
    return wrap;
  }

  /** Mini scrapbook strip for mystery doors — extra love from the album */
  function scrapbookStrip(indices, label) {
    const wrap = document.createElement("div");
    wrap.className = "scrapbook";
    if (label) {
      const p = document.createElement("p");
      p.className = "scrapbook-label";
      p.textContent = label;
      wrap.appendChild(p);
    }
    const row = document.createElement("div");
    row.className = "scrapbook-row";
    indices.forEach((i) => {
      const p = CONFIG.photoFiles[i];
      if (!p) return;
      const fig = document.createElement("figure");
      fig.className = "scrapbook-item";
      fig.innerHTML = `<img src="${p.src}" alt="${escapeAttr(p.caption)}" loading="lazy" /><figcaption>${escapeHtml(shortCap(p.caption))}</figcaption>`;
      row.appendChild(fig);
    });
    wrap.appendChild(row);
    return wrap;
  }

  // escape helpers used early — define if mystery renders before gallery
  function shortCap(text) {
    if (!text) return "♡";
    const t = String(text).split("—")[0].split(".")[0].trim();
    return t.length > 42 ? t.slice(0, 40) + "…" : t;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  // ── 10 stages ──────────────────────────────────────────
  const stages = [
    {
      render(root) {
        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 1 · Only for her</p>
            <h2 class="stage-title">A sealed letter<br/>found its way to you</h2>
            <div class="envelope" id="envelope" role="button" tabindex="0" aria-label="Open the envelope">
              <div class="envelope-body"></div>
              <div class="envelope-flap"></div>
              <div class="envelope-heart">💌</div>
            </div>
            <div class="stage-body" id="envMsg" hidden>
              <p class="surprise-pop"><strong>${CONFIG.wifeName}</strong> — if you’re reading this, someone who loves you more than words has prepared a small mystery.</p>
              <p>Ten doors. Ten little surprises. One truth waiting at the end.</p>
            </div>
            <div class="stage-actions" id="s1actions"></div>
            <p class="stage-hint">Tap the envelope to open it</p>
          </div>
        `);
        root.appendChild(card);
        const envelope = card.querySelector("#envelope");
        const msg = card.querySelector("#envMsg");
        const actions = card.querySelector("#s1actions");
        const hint = card.querySelector(".stage-hint");
        let opened = false;

        function openEnv() {
          if (opened) return;
          opened = true;
          envelope.classList.add("is-open");
          msg.hidden = false;
          msg.removeAttribute("hidden");
          if (hint) hint.textContent = "The first door is open…";
          softSpark();
          music.ensure();
          actions.appendChild(continueButton("Step into the mystery", () => goNext()));
        }

        envelope.addEventListener("click", openEnv);
        envelope.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openEnv();
          }
        });
      },
    },
    {
      render(root) {
        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 2 · A whisper</p>
            <h2 class="stage-title">Before the fireworks…</h2>
            <div class="stage-body">
              <p>I didn’t want this birthday to feel like another date on the calendar.</p>
              <p>I wanted you to feel <em style="color:var(--rose)">chosen</em> — slowly, carefully — the way I choose you every ordinary morning.</p>
              <p class="surprise-pop" style="color:var(--gold-soft);font-family:var(--font-display);font-size:1.25rem;margin-top:16px">
                You are my favourite person in every room.
              </p>
            </div>
            <div class="stage-actions"></div>
          </div>
        `);
        root.appendChild(card);
        card.querySelector(".stage-actions").appendChild(
          continueButton("I feel it — next door", () => goNext())
        );
        softSpark();
      },
    },
    {
      render(root) {
        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 3 · A memory</p>
            <h2 class="stage-title">Look what I kept</h2>
            <div id="memSlot"></div>
            <div class="stage-actions"></div>
            <p class="stage-hint">Add photo as images/1.jpg anytime</p>
          </div>
        `);
        root.appendChild(card);
        const slot = card.querySelector("#memSlot");
        slot.appendChild(memoryBlock(0));
        // Extra couple / fun moments in the mystery path
        slot.appendChild(scrapbookStrip([1, 3, 4], "More of your light…"));
        card.querySelector(".stage-actions").appendChild(
          continueButton("Hold this close — continue", () => goNext())
        );
      },
    },
    {
      render(root) {
        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 4 · A little test</p>
            <h2 class="stage-title">Quick — tell me true</h2>
            <p class="stage-body">What’s the best part of <em>us</em>?</p>
            <div class="quiz-options" id="quiz"></div>
            <p class="quiz-react" id="quizReact"></p>
            <div class="stage-actions" id="quizActions"></div>
          </div>
        `);
        root.appendChild(card);
        const opts = [
          { t: "The way we laugh at nothing", r: "Yes. Our private language of silly." },
          { t: "Coming home to each other", r: "Home isn’t a place. It’s you." },
          { t: "Dreaming about what’s next", r: "Every plan is better with your name in it." },
          { t: "All of it. Every bit.", r: "Correct. Full marks. Always." },
        ];
        const quiz = card.querySelector("#quiz");
        const react = card.querySelector("#quizReact");
        const actions = card.querySelector("#quizActions");
        let unlocked = false;

        opts.forEach((o) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "quiz-opt";
          b.textContent = o.t;
          b.addEventListener("click", () => {
            quiz.querySelectorAll(".quiz-opt").forEach((x) => x.classList.remove("is-picked"));
            b.classList.add("is-picked");
            react.textContent = o.r;
            softSpark();
            if (!unlocked) {
              unlocked = true;
              actions.appendChild(continueButton("That was easy — next", () => goNext()));
            }
          });
          quiz.appendChild(b);
        });
      },
    },
    {
      render(root) {
        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 5 · Another keep-sake</p>
            <h2 class="stage-title">Still us</h2>
            <div id="memSlot"></div>
            <div class="stage-actions"></div>
            <p class="stage-hint">Photo: images/2.jpg</p>
          </div>
        `);
        root.appendChild(card);
        const slot = card.querySelector("#memSlot");
        slot.appendChild(memoryBlock(1));
        slot.appendChild(scrapbookStrip([5, 6, 7], "Becoming a mother… becoming our world"));
        card.querySelector(".stage-actions").appendChild(
          continueButton("Unlock the next secret", () => goNext())
        );
      },
    },
    {
      render(root) {
        const NEED = 5;
        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 6 · Gather the light</p>
            <h2 class="stage-title">Catch every heart</h2>
            <p class="stage-body">Five little pieces of my heart are floating. Tap them all.</p>
            <p class="star-count">Caught: <strong id="caught">0</strong> / ${NEED}</p>
            <div class="star-field" id="starField"></div>
            <div class="stage-actions" id="starActions"></div>
          </div>
        `);
        root.appendChild(card);
        const field = card.querySelector("#starField");
        const caughtEl = card.querySelector("#caught");
        const actions = card.querySelector("#starActions");
        let caught = 0;
        const positions = [
          [12, 20], [70, 15], [40, 45], [78, 55], [22, 65],
        ];

        positions.forEach((pos, i) => {
          const s = document.createElement("button");
          s.type = "button";
          s.className = "collect-star";
          s.textContent = i % 2 === 0 ? "💕" : "✨";
          s.style.left = `${pos[0]}%`;
          s.style.top = `${pos[1]}%`;
          s.style.animationDelay = `${i * 0.2}s`;
          s.setAttribute("aria-label", `Collect heart ${i + 1}`);
          s.addEventListener("click", () => {
            if (s.classList.contains("is-caught")) return;
            s.classList.add("is-caught");
            caught += 1;
            caughtEl.textContent = String(caught);
            confetti.burst(25);
            if (caught >= NEED) {
              actions.innerHTML = "";
              const note = document.createElement("p");
              note.className = "stage-body surprise-pop";
              note.innerHTML =
                "You found them all.<br/><strong style='color:var(--gold-soft)'>They’re all yours anyway.</strong>";
              actions.appendChild(note);
              actions.appendChild(continueButton("My heart is full — continue", () => goNext()));
            }
          });
          field.appendChild(s);
        });
      },
    },
    {
      render(root) {
        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 7 · One more glance</p>
            <h2 class="stage-title">This one stays</h2>
            <div id="memSlot"></div>
            <div class="stage-actions"></div>
            <p class="stage-hint">Photo: images/3.jpg</p>
          </div>
        `);
        root.appendChild(card);
        const slot = card.querySelector("#memSlot");
        slot.appendChild(memoryBlock(2));
        slot.appendChild(scrapbookStrip([8, 9, 10, 11, 12, 13], "Adventures, festivals & forever"));
        card.querySelector(".stage-actions").appendChild(
          continueButton("Almost at the heart of it", () => goNext())
        );
      },
    },
    {
      render(root) {
        const reasons = [
          { front: "Tap me", back: "Your kindness when no one is watching" },
          { front: "Tap me", back: "The way you light up a room — and my days" },
          { front: "Tap me", back: "Your courage to grow, learn, and create" },
          { front: "Tap me", back: "Because loving you still feels like the best decision" },
        ];
        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 8 · Why you</p>
            <h2 class="stage-title">Reasons I love you</h2>
            <p class="stage-body">Open all four. There’s no wrong order.</p>
            <div class="reason-grid" id="reasons"></div>
            <p class="star-count">Opened: <strong id="rCount">0</strong> / 4</p>
            <div class="stage-actions" id="rActions"></div>
          </div>
        `);
        root.appendChild(card);
        const grid = card.querySelector("#reasons");
        const countEl = card.querySelector("#rCount");
        const actions = card.querySelector("#rActions");
        let openCount = 0;

        reasons.forEach((r) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "reason-card";
          b.innerHTML = `<span class="r-front">${r.front}</span><span class="r-back">${r.back}</span>`;
          b.addEventListener("click", () => {
            if (b.classList.contains("is-open")) return;
            b.classList.add("is-open");
            openCount += 1;
            countEl.textContent = String(openCount);
            softSpark();
            if (openCount >= 4) {
              actions.appendChild(
                continueButton("And still more reasons… next", () => goNext())
              );
            }
          });
          grid.appendChild(b);
        });
      },
    },
    {
      render(root) {
        const TARGET = "ILOVEYOU";
        const pieces = ["I", "L", "O", "V", "E", "Y", "O", "U"];
        const shuffled = [...pieces].sort(() => Math.random() - 0.5);

        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 9 · The key</p>
            <h2 class="stage-title">Unlock the last gift</h2>
            <p class="stage-body">Tap the letters in order to spell what I mean every day.</p>
            <div class="chest" id="chest" aria-hidden="true">🎁</div>
            <div class="lock-display" id="lockDisp">_ _ _ _ _ _ _ _</div>
            <div class="key-row" id="keyRow"></div>
            <p class="quiz-react" id="keyReact"></p>
            <div class="stage-actions" id="keyActions"></div>
            <p class="stage-hint">Spell: I LOVE YOU</p>
          </div>
        `);
        root.appendChild(card);
        const lockDisp = card.querySelector("#lockDisp");
        const keyRow = card.querySelector("#keyRow");
        const keyReact = card.querySelector("#keyReact");
        const actions = card.querySelector("#keyActions");
        const chest = card.querySelector("#chest");
        let built = "";
        let expectIndex = 0;

        function refreshLock() {
          const show = TARGET.split("").map((_, i) => (i < built.length ? TARGET[i] : "_"));
          lockDisp.textContent = `${show[0]} ${show.slice(1, 5).join("")} ${show.slice(5).join("")}`;
        }

        refreshLock();

        shuffled.forEach((letter) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "key-piece";
          b.textContent = letter;
          b.addEventListener("click", () => {
            if (letter !== TARGET[expectIndex]) {
              keyReact.textContent = "Almost — try the next letter in “I LOVE YOU”";
              b.animate(
                [
                  { transform: "translateX(0)" },
                  { transform: "translateX(-4px)" },
                  { transform: "translateX(4px)" },
                  { transform: "translateX(0)" },
                ],
                { duration: 280 }
              );
              return;
            }
            built += letter;
            expectIndex += 1;
            b.classList.add("is-used");
            b.disabled = true;
            refreshLock();
            softSpark();
            keyReact.textContent = "";

            if (built === TARGET) {
              chest.classList.add("is-open");
              chest.textContent = "💝";
              keyReact.textContent = "Unlocked. Forever.";
              confetti.burst(90);
              actions.appendChild(continueButton("Open the final door…", () => goNext()));
            }
          });
          keyRow.appendChild(b);
        });
      },
    },
    {
      render(root) {
        const card = el(`
          <div class="stage-card">
            <p class="stage-kicker">Door 10 · The last veil</p>
            <h2 class="stage-title">You’ve walked every step</h2>
            <div class="stage-body">
              <p>Ten doors. A few memories. A handful of hearts.</p>
              <p>I made this so that when the cake comes out — when family is near and the room softens — you already know how deeply you’re loved.</p>
              <p class="surprise-pop" style="color:var(--champagne);font-family:var(--font-display);font-size:1.3rem;margin-top:18px">
                Ready for your birthday, my love?
              </p>
            </div>
            <div class="stage-actions"></div>
          </div>
        `);
        root.appendChild(card);
        card.querySelector(".stage-actions").appendChild(
          continueButton("Yes — show me", () => goNext())
        );
      },
    },
  ];

  function renderStage() {
    if (!stageRoot) return;
    stageRoot.innerHTML = "";
    updateProgressUI();
    if (journeyWhisper) {
      const whispers = [
        "Take your time. Each door opens only for you.",
        "No rush. This path was built for one person.",
        "Something soft is waiting ahead…",
        "You’re doing beautifully.",
        "Halfway hearts, full love.",
        "Keep going — he’s proud of every step you take.",
        "Almost close enough to hear the music…",
        "These reasons were always true.",
        "One key left.",
        "The last door is the warmest.",
      ];
      journeyWhisper.textContent = whispers[currentStep] || whispers[0];
    }
    const stage = stages[currentStep];
    if (stage) stage.render(stageRoot);
  }

  // ── Views ──────────────────────────────────────────────
  function hideView(el) {
    if (!el) return;
    el.classList.add("is-hidden");
    el.hidden = true;
  }

  function showView(el) {
    if (!el) return;
    el.hidden = false;
    el.removeAttribute("hidden");
    el.classList.remove("is-hidden");
  }

  function openParty(fromMystery = false) {
    partyPath = fromMystery ? "mystery" : "direct";
    hideView(gate);
    hideView(journey);

    if (fromMystery) {
      currentStep = TOTAL_STEPS;
      saveProgress();
      if ($("heroEyebrow")) $("heroEyebrow").textContent = "You found every secret · July 19";
      if ($("heroLead")) {
        $("heroLead").innerHTML =
          'This whole path was built for one person.<br class="hide-sm" />You. My favourite adventure.';
      }
      const tryBtn = $("tryMysteryFromParty");
      if (tryBtn) tryBtn.style.display = "none";
    } else {
      if ($("heroEyebrow")) $("heroEyebrow").textContent = "A private celebration · July 19";
      if ($("heroLead")) {
        $("heroLead").innerHTML =
          'May this next chapter feel as vivid as your paintings,<br class="hide-sm" />as free as your travels, and as joyful as your favourite song.';
      }
    }

    showView(finale);
    music.ensure();
    music.start();
    spawnBalloons(18);
    confetti.burst(200);
    setTimeout(() => confetti.rain(80), 400);
    setTimeout(() => confetti.burst(120), 1100);
    initFinaleExtras();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startMystery(resume = false) {
    hideView(gate);
    hideView(finale);
    if (!resume) {
      currentStep = 0;
      saveProgress();
    } else {
      const saved = loadProgress();
      currentStep = saved >= TOTAL_STEPS ? 0 : saved;
    }
    buildProgressDots();
    showView(journey);
    renderStage();
    music.ensure();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openFinale() {
    openParty(true);
  }

  // ── Finale extras ──────────────────────────────────────
  let candlesLit = true;
  const CANDLE_COUNT = 5;

  function buildCandles() {
    const candlesEl = $("candles");
    if (!candlesEl) return;
    candlesEl.innerHTML = "";
    for (let i = 0; i < CANDLE_COUNT; i++) {
      const c = document.createElement("div");
      c.className = "candle";
      const f = document.createElement("div");
      f.className = "flame";
      f.style.animationDelay = `${i * 0.07}s`;
      c.appendChild(f);
      candlesEl.appendChild(c);
    }
  }

  function blowOut() {
    if (!candlesLit) return;
    candlesLit = false;
    $("cakeVisual")?.classList.add("is-blown");
    $("candles")?.querySelectorAll(".flame").forEach((f, i) => {
      setTimeout(() => f.classList.add("is-out"), i * 90);
    });
    if ($("cakeHint")) $("cakeHint").textContent = "Wish made ✨";
    const panel = $("wishPanel");
    if (panel) {
      panel.hidden = false;
      panel.removeAttribute("hidden");
    }
    confetti.burst(160);
    confetti.rain(50);
  }

  function lightAgain() {
    candlesLit = true;
    $("cakeVisual")?.classList.remove("is-blown");
    $("candles")?.querySelectorAll(".flame").forEach((f) => f.classList.remove("is-out"));
    if ($("cakeHint")) $("cakeHint").textContent = "Tap to blow out · make a wish";
    const panel = $("wishPanel");
    if (panel) {
      panel.hidden = true;
      panel.setAttribute("hidden", "");
    }
  }

  async function loadPhotos() {
    // Prefer the curated album list (all real filenames + captions)
    const found = [...CONFIG.photoFiles];
    for (const m of CONFIG.memories) {
      found.push({ src: m.src, caption: m.caption });
    }

    // De-dupe, keep first caption (curated list wins)
    const seen = new Set();
    const unique = found.filter((p) => {
      if (seen.has(p.src)) return false;
      seen.add(p.src);
      return true;
    });

    // Verify which files actually load
    const verified = [];
    await Promise.all(
      unique.map(
        (p) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              verified.push(p);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = p.src;
          })
      )
    );

    // Keep album order from CONFIG.photoFiles
    const order = CONFIG.photoFiles.map((p) => p.src);
    verified.sort((a, b) => {
      const ia = order.indexOf(a.src);
      const ib = order.indexOf(b.src);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
    return verified;
  }

  function initGallery(photos) {
    const track = $("galleryTrack");
    const empty = $("galleryEmpty");
    const dots = $("galleryDots");
    const wall = $("photoWall");
    if (!track) return;

    if (!photos.length) {
      if (empty) {
        empty.hidden = false;
        empty.removeAttribute("hidden");
      }
      return;
    }

    if (empty) {
      empty.hidden = true;
      empty.setAttribute("hidden", "");
    }

    track.innerHTML = "";
    if (dots) dots.innerHTML = "";
    if (wall) wall.innerHTML = "";

    photos.forEach((p, i) => {
      const slide = document.createElement("div");
      slide.className = "gal-slide";
      slide.innerHTML = `<img src="${p.src}" alt="${escapeAttr(p.caption || "Memory")}" loading="lazy"/><div class="cap">${escapeHtml(p.caption || "Memory")}</div>`;
      track.appendChild(slide);

      if (dots) {
        const d = document.createElement("button");
        d.type = "button";
        d.setAttribute("aria-label", `Photo ${i + 1}`);
        d.setAttribute("aria-selected", i === 0 ? "true" : "false");
        d.addEventListener("click", () => go(i));
        dots.appendChild(d);
      }

      // Collage wall — every photo, tappable to open in carousel
      if (wall) {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "wall-tile";
        tile.innerHTML = `<img src="${p.src}" alt="" loading="lazy" /><span class="wall-cap">${escapeHtml(shortCap(p.caption))}</span>`;
        tile.addEventListener("click", () => {
          go(i);
          $("memories")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        wall.appendChild(tile);
      }
    });

    let index = 0;
    function go(i) {
      index = (i + photos.length) % photos.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dots) {
        [...dots.children].forEach((el, j) => {
          el.setAttribute("aria-selected", j === index ? "true" : "false");
        });
      }
    }

    $("galPrev")?.addEventListener("click", () => go(index - 1));
    $("galNext")?.addEventListener("click", () => go(index + 1));
    setInterval(() => {
      if (photos.length > 1 && !document.hidden) go(index + 1);
    }, 4500);
    go(0);
  }

  function initReveal() {
    const els = document.querySelectorAll("#finale .reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    document.querySelectorAll("#finale .hero .reveal").forEach((el) => el.classList.add("is-visible"));
  }

  let finaleReady = false;
  function initFinaleExtras() {
    if (finaleReady) {
      initReveal();
      return;
    }
    finaleReady = true;
    buildCandles();
    $("blowCandles")?.addEventListener("click", blowOut);
    $("relight")?.addEventListener("click", lightAgain);
    $("toggleMusic")?.addEventListener("click", () => music.toggle());
    $("moreConfetti")?.addEventListener("click", () => {
      confetti.burst(140);
      confetti.rain(40);
    });
    $("finaleBurst")?.addEventListener("click", () => {
      confetti.burst(200);
      confetti.rain(80);
      spawnBalloons(10);
      if (!music.isPlaying()) music.start();
    });
    document.addEventListener("keydown", (e) => {
      if ((e.key === "m" || e.key === "M") && !finale.hidden) music.toggle();
    });
    loadPhotos().then(initGallery);
    initReveal();
  }

  // ── Boot ───────────────────────────────────────────────
  function boot() {
    initStars();
    buildProgressDots();

    const params = new URLSearchParams(location.search);
    if (params.has("reset")) {
      currentStep = 0;
      saveProgress();
    }

    if (params.has("finale") || params.has("party")) {
      openParty(false);
      return;
    }
    if (params.has("mystery")) {
      startMystery(true);
      return;
    }

    $("openGift")?.addEventListener("click", () => openParty(false));
    $("startMystery")?.addEventListener("click", () => startMystery(false));
    $("tryMysteryFromParty")?.addEventListener("click", () => {
      music.stop();
      startMystery(false);
    });

    showView(gate);
    hideView(journey);
    hideView(finale);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
