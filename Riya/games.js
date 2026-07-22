/* ===========================================================
   Riya Studio — Vibe Coded Arcade
   All games pure HTML/CSS/JS. High scores in localStorage.
   =========================================================== */
(function () {
  'use strict';

  function storageGet(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  }
  function storageSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  }
  function $(id) { return document.getElementById(id); }

  /* ---------- 2048 ---------- */
  (function init2048() {
    var size = 4;
    var board = [];
    var score = 0;
    var best = storageGet('riya-2048-best', 0);
    var elBoard = $('m2048-board');
    var elScore = $('m2048-score');
    var elBest = $('m2048-best');
    var elStatus = $('m2048-status');
    if (!elBoard) return;
    elBest.textContent = best;

    function emptyCells() {
      var cells = [];
      for (var r = 0; r < size; r++)
        for (var c = 0; c < size; c++)
          if (!board[r][c]) cells.push([r, c]);
      return cells;
    }

    function spawn() {
      var cells = emptyCells();
      if (!cells.length) return;
      var pick = cells[Math.floor(Math.random() * cells.length)];
      board[pick[0]][pick[1]] = Math.random() < 0.9 ? 2 : 4;
    }

    function tileClass(n) {
      if (!n) return 't0';
      var p = Math.min(11, Math.round(Math.log(n) / Math.LN2));
      return 't' + p;
    }

    function render() {
      elBoard.innerHTML = '';
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          var n = board[r][c];
          var cell = document.createElement('div');
          cell.className = 'm2048-cell ' + tileClass(n);
          cell.textContent = n || '';
          elBoard.appendChild(cell);
        }
      }
      elScore.textContent = score;
      if (score > best) {
        best = score;
        elBest.textContent = best;
        storageSet('riya-2048-best', best);
      }
    }

    function slideLine(line) {
      var arr = line.filter(function (x) { return x; });
      var out = [];
      var gained = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i] === arr[i + 1]) {
          var v = arr[i] * 2;
          out.push(v);
          gained += v;
          i++;
        } else {
          out.push(arr[i]);
        }
      }
      while (out.length < size) out.push(0);
      return { line: out, gained: gained };
    }

    function move(dir) {
      var prev = JSON.stringify(board);
      var gained = 0;
      var r, c, line, res, rotated;

      function getRow(rr) { return board[rr].slice(); }
      function setRow(rr, row) { board[rr] = row; }
      function getCol(cc) {
        var col = [];
        for (r = 0; r < size; r++) col.push(board[r][cc]);
        return col;
      }
      function setCol(cc, col) {
        for (r = 0; r < size; r++) board[r][cc] = col[r];
      }

      if (dir === 'left') {
        for (r = 0; r < size; r++) {
          res = slideLine(getRow(r));
          setRow(r, res.line);
          gained += res.gained;
        }
      } else if (dir === 'right') {
        for (r = 0; r < size; r++) {
          res = slideLine(getRow(r).reverse());
          setRow(r, res.line.reverse());
          gained += res.gained;
        }
      } else if (dir === 'up') {
        for (c = 0; c < size; c++) {
          res = slideLine(getCol(c));
          setCol(c, res.line);
          gained += res.gained;
        }
      } else if (dir === 'down') {
        for (c = 0; c < size; c++) {
          res = slideLine(getCol(c).reverse());
          setCol(c, res.line.reverse());
          gained += res.gained;
        }
      }

      if (JSON.stringify(board) !== prev) {
        score += gained;
        spawn();
        render();
        if (isGameOver()) elStatus.textContent = 'Game over — New game to try again';
        else if (boardHas(2048)) elStatus.textContent = 'You hit 2048! Keep going…';
      }
    }

    function boardHas(n) {
      for (var r = 0; r < size; r++)
        for (var c = 0; c < size; c++)
          if (board[r][c] === n) return true;
      return false;
    }

    function isGameOver() {
      if (emptyCells().length) return false;
      var r, c;
      for (r = 0; r < size; r++)
        for (c = 0; c < size; c++) {
          var v = board[r][c];
          if (c + 1 < size && board[r][c + 1] === v) return false;
          if (r + 1 < size && board[r + 1][c] === v) return false;
        }
      return true;
    }

    function newGame() {
      board = [];
      for (var r = 0; r < size; r++) board.push([0, 0, 0, 0]);
      score = 0;
      spawn();
      spawn();
      elStatus.textContent = 'Use ← ↑ → ↓ or swipe on mobile';
      render();
    }

    document.addEventListener('keydown', function (e) {
      if (!elBoard.closest('.game-shell')) return;
      var map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
      if (!map[e.key]) return;
      // Only when 2048 section roughly in view or focused
      var rect = elBoard.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      e.preventDefault();
      move(map[e.key]);
    });

    var touchStart = null;
    elBoard.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    }, { passive: true });
    elBoard.addEventListener('touchend', function (e) {
      if (!touchStart) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - touchStart.x;
      var dy = t.clientY - touchStart.y;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
      else move(dy > 0 ? 'down' : 'up');
      touchStart = null;
    }, { passive: true });

    $('m2048-new').addEventListener('click', newGame);
    newGame();
  })();

  /* ---------- NEON SNAKE ---------- */
  (function initSnake() {
    var canvas = $('snake-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var grid = 20;
    var cells = canvas.width / grid;
    var snake, dir, nextDir, food, score, running, tick, speed;
    var best = storageGet('riya-snake-best', 0);
    $('snake-best').textContent = best;

    function reset() {
      snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      speed = 140;
      placeFood();
      updateHud();
    }

    function placeFood() {
      do {
        food = {
          x: Math.floor(Math.random() * cells),
          y: Math.floor(Math.random() * cells)
        };
      } while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
    }

    function updateHud() {
      $('snake-score').textContent = score;
      $('snake-len').textContent = snake.length;
      if (score > best) {
        best = score;
        $('snake-best').textContent = best;
        storageSet('riya-snake-best', best);
      }
    }

    function draw() {
      ctx.fillStyle = '#fff5f8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // grid faint
      ctx.strokeStyle = 'rgba(15,80,100,0.08)';
      for (var i = 0; i <= cells; i++) {
        ctx.beginPath();
        ctx.moveTo(i * grid, 0);
        ctx.lineTo(i * grid, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * grid);
        ctx.lineTo(canvas.width, i * grid);
        ctx.stroke();
      }
      // food
      ctx.shadowColor = '#e85a8a';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#e85a8a';
      ctx.beginPath();
      ctx.arc(food.x * grid + grid / 2, food.y * grid + grid / 2, grid * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // snake
      snake.forEach(function (s, i) {
        var t = i / Math.max(1, snake.length - 1);
        ctx.fillStyle = i === 0 ? '#0d9488' : 'rgba(13,148,136,' + (0.95 - t * 0.45) + ')';
        ctx.shadowColor = '#14b8a6';
        ctx.shadowBlur = i === 0 ? 10 : 0;
        ctx.fillRect(s.x * grid + 1, s.y * grid + 1, grid - 2, grid - 2);
      });
      ctx.shadowBlur = 0;
      if (!running) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f2a32';
        ctx.font = '600 20px "Cormorant Garamond", serif';
        ctx.textAlign = 'center';
        ctx.fillText(score ? 'Crashed · ' + score + ' pts' : 'Press Start', canvas.width / 2, canvas.height / 2);
      }
    }

    function step() {
      if (!running) return;
      dir = nextDir;
      var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= cells || head.y >= cells ||
          snake.some(function (s) { return s.x === head.x && s.y === head.y; })) {
        running = false;
        clearInterval(tick);
        draw();
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10 + Math.floor(snake.length / 2);
        placeFood();
        if (speed > 55) speed -= 3;
        clearInterval(tick);
        tick = setInterval(step, speed);
      } else {
        snake.pop();
      }
      updateHud();
      draw();
    }

    function setDir(nx, ny) {
      if (dir.x + nx === 0 && dir.y + ny === 0) return;
      nextDir = { x: nx, y: ny };
    }

    document.addEventListener('keydown', function (e) {
      var k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].indexOf(k) === -1) return;
      var rect = canvas.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      e.preventDefault();
      if (k === 'arrowup' || k === 'w') setDir(0, -1);
      if (k === 'arrowdown' || k === 's') setDir(0, 1);
      if (k === 'arrowleft' || k === 'a') setDir(-1, 0);
      if (k === 'arrowright' || k === 'd') setDir(1, 0);
    });

    var swipe0 = null;
    canvas.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      swipe0 = { x: t.clientX, y: t.clientY };
    }, { passive: true });
    canvas.addEventListener('touchend', function (e) {
      if (!swipe0) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - swipe0.x;
      var dy = t.clientY - swipe0.y;
      if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0);
      else setDir(0, dy > 0 ? 1 : -1);
      swipe0 = null;
    }, { passive: true });

    $('snake-start').addEventListener('click', function () {
      clearInterval(tick);
      reset();
      running = true;
      tick = setInterval(step, speed);
      draw();
      canvas.focus && canvas.focus();
    });

    reset();
    running = false;
    draw();
  })();

  /* ---------- BRICK BREAKER ---------- */
  (function initBreak() {
    var canvas = $('break-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var paddle, ball, bricks, score, lives, level, running, raf;
    var best = storageGet('riya-break-best', 0);
    $('break-best').textContent = best;
    var mouseX = W / 2;

    function makeLevel(lv) {
      bricks = [];
      var rows = Math.min(8, 3 + lv);
      var cols = 10;
      var bw = (W - 40) / cols;
      var colors = ['#0d9488', '#14b8a6', '#e85a8a', '#f472b6', '#2dd4bf', '#f9a8d4'];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          bricks.push({
            x: 20 + c * bw,
            y: 40 + r * 22,
            w: bw - 4,
            h: 16,
            hp: 1 + Math.floor((lv - 1) / 2) + (r === 0 ? 1 : 0),
            color: colors[(r + lv) % colors.length]
          });
        }
      }
    }

    function resetBall() {
      ball = { x: W / 2, y: H - 60, vx: 3.2 + level * 0.25, vy: -3.6 - level * 0.2, r: 7 };
    }

    function startLevel() {
      cancelAnimationFrame(raf);
      paddle = { w: Math.max(60, 100 - level * 4), h: 12, x: W / 2 - 50, y: H - 28 };
      score = score || 0;
      if (!lives || lives <= 0) { lives = 3; score = 0; level = 1; }
      makeLevel(level);
      resetBall();
      running = true;
      $('break-hint').textContent = 'Level ' + level + ' — clear all bricks';
      loop();
    }

    function hud() {
      $('break-score').textContent = score;
      $('break-level').textContent = level;
      $('break-lives').textContent = lives;
      if (score > best) {
        best = score;
        $('break-best').textContent = best;
        storageSet('riya-break-best', best);
      }
    }

    function loop() {
      if (!running) return;
      // paddle
      paddle.x = Math.max(0, Math.min(W - paddle.w, mouseX - paddle.w / 2));
      // ball
      ball.x += ball.vx;
      ball.y += ball.vy;
      if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
      if (ball.y < ball.r) ball.vy *= -1;
      // paddle hit
      if (ball.y + ball.r >= paddle.y && ball.y + ball.r <= paddle.y + paddle.h + 4 &&
          ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.vy > 0) {
        var hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.vx = hit * 4.5;
        ball.vy = -Math.abs(ball.vy);
      }
      // bricks
      for (var i = bricks.length - 1; i >= 0; i--) {
        var b = bricks[i];
        if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
            ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
          ball.vy *= -1;
          b.hp--;
          score += 10 * level;
          if (b.hp <= 0) bricks.splice(i, 1);
          break;
        }
      }
      if (!bricks.length) {
        level++;
        score += 100 * level;
        makeLevel(level);
        resetBall();
        $('break-hint').textContent = 'Level up! → ' + level;
      }
      if (ball.y > H) {
        lives--;
        if (lives <= 0) {
          running = false;
          $('break-hint').textContent = 'Game over — Start to play again';
          hud();
          draw(true);
          return;
        }
        resetBall();
      }
      hud();
      draw(false);
      raf = requestAnimationFrame(loop);
    }

    function draw(overlay) {
      ctx.fillStyle = '#fff5f8';
      ctx.fillRect(0, 0, W, H);
      bricks.forEach(function (b) {
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.hp > 1 ? 1 : 0.85;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.globalAlpha = 1;
      });
      ctx.fillStyle = '#0d9488';
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.beginPath();
      ctx.fillStyle = '#0f2a32';
      ctx.shadowColor = '#e85a8a';
      ctx.shadowBlur = 8;
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      if (overlay) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#0f2a32';
        ctx.font = '600 22px "Cormorant Garamond", serif';
        ctx.textAlign = 'center';
        ctx.fillText('Score ' + score, W / 2, H / 2);
      }
    }

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * (W / rect.width);
    });
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      var rect = canvas.getBoundingClientRect();
      var t = e.changedTouches[0];
      mouseX = (t.clientX - rect.left) * (W / rect.width);
    }, { passive: false });

    level = 1;
    lives = 3;
    score = 0;
    makeLevel(1);
    resetBall();
    running = false;
    draw(true);
    $('break-start').addEventListener('click', function () {
      if (!running && lives <= 0) { lives = 3; score = 0; level = 1; }
      if (!running && lives > 0 && bricks.length === 0) { /* ok */ }
      startLevel();
    });
    hud();
  })();

  /* ---------- PORTFOLIO TYCOON ---------- */
  (function initTycoon() {
    var elCap = $('ty-capital');
    var elRate = $('ty-rate');
    var elPower = $('ty-click-power');
    var elList = $('ty-upgrades');
    var elClick = $('ty-click');
    if (!elCap) return;

    var defaults = {
      capital: 0,
      clickPower: 1,
      upgrades: [
        { id: 'intern', name: 'Junior analyst', desc: 'Auto +0.5/s', base: 15, owned: 0, rate: 0.5 },
        { id: 'pq', name: 'Power Query bot', desc: 'Auto +3/s', base: 100, owned: 0, rate: 3 },
        { id: 'desk', name: 'Credit desk', desc: 'Auto +12/s', base: 500, owned: 0, rate: 12 },
        { id: 'ai', name: 'AI co-pilot', desc: 'Auto +40/s', base: 2500, owned: 0, rate: 40 },
        { id: 'region', name: 'Regional book', desc: 'Auto +150/s', base: 12000, owned: 0, rate: 150 },
        { id: 'tech', name: 'Digital stack', desc: 'Auto +600/s', base: 60000, owned: 0, rate: 600 }
      ]
    };

    var state = storageGet('riya-tycoon', null);
    if (!state || !state.upgrades) state = JSON.parse(JSON.stringify(defaults));
    // merge new upgrade defs if older save
    defaults.upgrades.forEach(function (u, i) {
      if (!state.upgrades[i]) state.upgrades[i] = JSON.parse(JSON.stringify(u));
      else {
        state.upgrades[i].name = u.name;
        state.upgrades[i].desc = u.desc;
        state.upgrades[i].base = u.base;
        state.upgrades[i].rate = u.rate;
      }
    });

    function costOf(u) {
      return Math.floor(u.base * Math.pow(1.15, u.owned));
    }

    function rate() {
      return state.upgrades.reduce(function (s, u) { return s + u.owned * u.rate; }, 0);
    }

    function format(n) {
      if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
      if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
      return Math.floor(n).toString();
    }

    function render() {
      elCap.textContent = format(state.capital);
      elRate.textContent = format(rate());
      elPower.textContent = format(state.clickPower);
      elList.innerHTML = '';
      state.upgrades.forEach(function (u, idx) {
        var cost = costOf(u);
        var row = document.createElement('button');
        row.type = 'button';
        row.className = 'ty-upgrade' + (state.capital >= cost ? '' : ' disabled');
        row.innerHTML =
          '<div class="ty-u-left"><strong>' + u.name + '</strong><span>' + u.desc + ' · owned ' + u.owned + '</span></div>' +
          '<div class="ty-u-cost">' + format(cost) + '</div>';
        row.addEventListener('click', function () {
          if (state.capital < cost) return;
          state.capital -= cost;
          u.owned++;
          if (u.id === 'intern' && u.owned % 5 === 0) state.clickPower += 1;
          if (u.id === 'ai') state.clickPower += 2;
          save();
          render();
        });
        elList.appendChild(row);
      });
    }

    function save() { storageSet('riya-tycoon', state); }

    elClick.addEventListener('click', function () {
      state.capital += state.clickPower;
      elClick.classList.remove('pulse');
      void elClick.offsetWidth;
      elClick.classList.add('pulse');
      save();
      render();
    });

    $('ty-reset').addEventListener('click', function () {
      if (!confirm('Reset Portfolio Tycoon progress?')) return;
      state = JSON.parse(JSON.stringify(defaults));
      save();
      render();
    });

    setInterval(function () {
      var r = rate();
      if (r > 0) {
        state.capital += r / 10; // 10 ticks per sec
        save();
        render();
      }
    }, 100);

    render();
  })();

  /* ---------- PATTERN PULSE (SIMON) ---------- */
  (function initSimon() {
    var pads = document.querySelectorAll('.simon-pad');
    var seq = [];
    var input = [];
    var playing = false;
    var accepting = false;
    var best = storageGet('riya-simon-best', 0);
    if (!$('simon-best')) return;
    $('simon-best').textContent = best;

    function flash(i) {
      return new Promise(function (resolve) {
        var pad = pads[i];
        pad.classList.add('lit');
        setTimeout(function () {
          pad.classList.remove('lit');
          setTimeout(resolve, 120);
        }, 380);
      });
    }

    async function playSeq() {
      accepting = false;
      $('simon-msg').textContent = 'Watch…';
      playing = true;
      for (var i = 0; i < seq.length; i++) {
        await flash(seq[i]);
      }
      accepting = true;
      input = [];
      $('simon-msg').textContent = 'Your turn';
      playing = false;
    }

    function nextRound() {
      seq.push(Math.floor(Math.random() * 4));
      $('simon-round').textContent = seq.length;
      if (seq.length - 1 > best) {
        best = seq.length - 1;
        // best = completed rounds
      }
      playSeq();
    }

    function fail() {
      accepting = false;
      var achieved = Math.max(0, seq.length - 1);
      if (achieved > best) {
        best = achieved;
        storageSet('riya-simon-best', best);
        $('simon-best').textContent = best;
      }
      $('simon-msg').textContent = 'Missed! Round ' + achieved + ' — Start to try again';
      seq = [];
      $('simon-round').textContent = '0';
    }

    pads.forEach(function (pad) {
      pad.addEventListener('click', function () {
        if (!accepting) return;
        var i = parseInt(pad.getAttribute('data-i'), 10);
        flash(i);
        input.push(i);
        var idx = input.length - 1;
        if (input[idx] !== seq[idx]) {
          fail();
          return;
        }
        if (input.length === seq.length) {
          accepting = false;
          var achieved = seq.length;
          if (achieved > best) {
            best = achieved;
            storageSet('riya-simon-best', best);
            $('simon-best').textContent = best;
          }
          $('simon-msg').textContent = 'Nice! Next round…';
          setTimeout(nextRound, 600);
        }
      });
    });

    $('simon-start').addEventListener('click', function () {
      seq = [];
      input = [];
      nextRound();
    });
  })();

  /* ---------- MEMORY MATCH+ ---------- */
  (function initMemory() {
    var SYMBOLS_EASY = ['🌍', '🎨', '📊', '☕', '🧭', '🎲', '🌱', '⚡'];
    var SYMBOLS_HARD = SYMBOLS_EASY.concat(['🎵', '✈️', '💎', '🔥']);
    var mode = 'easy';
    var first = null, second = null, lock = false, moves = 0, matches = 0, total = 8;
    var grid = $('memory-grid');
    if (!grid) return;

    var bestEasy = storageGet('riya-mem-easy', null);
    if (bestEasy !== null) $('mem-best-easy').textContent = bestEasy;

    function shuffle(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr;
    }

    function start() {
      moves = 0; matches = 0; first = null; second = null; lock = false;
      var base = mode === 'hard' ? SYMBOLS_HARD : SYMBOLS_EASY;
      total = base.length;
      $('mem-moves').textContent = '0';
      $('mem-pairs').textContent = '0';
      $('mem-total').textContent = String(total);
      grid.className = 'memory-grid' + (mode === 'hard' ? ' hard' : '');
      var deck = shuffle(base.concat(base));
      grid.innerHTML = '';
      deck.forEach(function (symbol, i) {
        var tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'mem-tile';
        tile.dataset.symbol = symbol;
        tile.setAttribute('aria-label', 'Tile ' + (i + 1));
        tile.addEventListener('click', function () { flip(tile); });
        grid.appendChild(tile);
      });
    }

    function flip(tile) {
      if (lock || tile.classList.contains('flipped') || tile.classList.contains('matched')) return;
      tile.textContent = tile.dataset.symbol;
      tile.classList.add('flipped');
      if (!first) { first = tile; return; }
      second = tile;
      lock = true;
      moves++;
      $('mem-moves').textContent = String(moves);
      if (first.dataset.symbol === second.dataset.symbol) {
        first.classList.add('matched');
        second.classList.add('matched');
        matches++;
        $('mem-pairs').textContent = String(matches);
        first = null; second = null; lock = false;
        if (matches === total && mode === 'easy') {
          if (bestEasy === null || moves < bestEasy) {
            bestEasy = moves;
            storageSet('riya-mem-easy', bestEasy);
            $('mem-best-easy').textContent = bestEasy;
          }
        }
      } else {
        setTimeout(function () {
          first.classList.remove('flipped'); first.textContent = '';
          second.classList.remove('flipped'); second.textContent = '';
          first = null; second = null; lock = false;
        }, 650);
      }
    }

    document.querySelectorAll('[data-mem-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        mode = btn.getAttribute('data-mem-mode');
        start();
      });
    });
    $('mem-restart').addEventListener('click', start);
    start();
  })();

  /* ---------- RISK RADAR PRO ---------- */
  (function initRadar() {
    var arena = $('risk-arena');
    var startBtn = $('risk-start');
    if (!arena || !startBtn) return;

    var score = 0, wave = 1, combo = 0, timeLeft = 0;
    var running = false, spawnTimer = null, clockTimer = null, waveTimer = null;
    var best = storageGet('riya-radar-best', 0);
    $('risk-best').textContent = best;

    function clearDots() {
      arena.querySelectorAll('.risk-dot').forEach(function (d) { d.remove(); });
    }

    function setIdle(text) {
      clearDots();
      var idle = document.createElement('p');
      idle.className = 'risk-idle';
      idle.id = 'risk-idle-msg';
      idle.textContent = text;
      arena.appendChild(idle);
    }

    function endAll() {
      running = false;
      clearInterval(spawnTimer);
      clearInterval(clockTimer);
      clearTimeout(waveTimer);
      startBtn.disabled = false;
      startBtn.textContent = 'Play again';
      if (score > best) {
        best = score;
        storageSet('riya-radar-best', best);
        $('risk-best').textContent = best;
      }
      $('risk-msg').textContent = 'Session over · score ' + score;
      setIdle('Final score: ' + score + ' · Best: ' + best);
    }

    function spawnDot() {
      if (!running) return;
      var good = Math.random() > 0.36;
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'risk-dot ' + (good ? 'good' : 'bad');
      dot.textContent = good ? '✓' : '✗';
      var size = 40 + Math.random() * 22;
      var maxX = Math.max(10, arena.clientWidth - size - 8);
      var maxY = Math.max(10, arena.clientHeight - size - 8);
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = Math.random() * maxX + 'px';
      dot.style.top = Math.random() * maxY + 'px';
      var life = Math.max(450, 1100 - wave * 60 + Math.random() * 400);
      var gone = false;
      function remove() {
        if (gone) return;
        gone = true;
        if (dot.parentNode) dot.parentNode.removeChild(dot);
      }
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!running || gone) return;
        if (good) {
          combo++;
          var mult = 1 + Math.floor(combo / 5);
          var add = 2 * mult;
          score += add;
          $('risk-msg').textContent = '+' + add + ' (×' + mult + ' combo)';
        } else {
          combo = 0;
          score = Math.max(0, score - 3);
          $('risk-msg').textContent = '−3 risk · combo reset';
        }
        $('risk-score').textContent = String(score);
        $('risk-combo').textContent = String(combo);
        remove();
      });
      var idle = $('risk-idle-msg');
      if (idle) idle.remove();
      arena.appendChild(dot);
      setTimeout(remove, life);
    }

    function startWave() {
      $('risk-wave').textContent = String(wave);
      var interval = Math.max(280, 700 - wave * 40);
      clearInterval(spawnTimer);
      spawnTimer = setInterval(spawnDot, interval);
      // each wave lasts 20s then escalates
      clearTimeout(waveTimer);
      waveTimer = setTimeout(function () {
        if (!running) return;
        wave++;
        $('risk-msg').textContent = 'Wave ' + wave + ' — faster!';
        startWave();
      }, 20000);
    }

    startBtn.addEventListener('click', function () {
      if (running) return;
      running = true;
      score = 0;
      wave = 1;
      combo = 0;
      timeLeft = 90; // 90 second sessions — long enough to engage
      $('risk-score').textContent = '0';
      $('risk-wave').textContent = '1';
      $('risk-combo').textContent = '0';
      startBtn.disabled = true;
      startBtn.textContent = 'Live…';
      $('risk-msg').textContent = '90 seconds · ride the waves';
      clearDots();
      var idle = $('risk-idle-msg');
      if (idle) idle.remove();

      clockTimer = setInterval(function () {
        timeLeft--;
        if (timeLeft <= 0) endAll();
        else if (timeLeft % 15 === 0) $('risk-msg').textContent = timeLeft + 's left · wave ' + wave;
      }, 1000);

      spawnDot();
      startWave();
    });
  })();

})();
