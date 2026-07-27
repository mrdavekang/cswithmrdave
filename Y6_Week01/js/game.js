/* ==========================================================================
   LAB LAUNCH — 2D PLATFORMER ENGINE
   Original, gentle side-scroller. No enemies, no lives, no pits, no timers.
   All artwork is drawn in code (canvas) — no external assets.
   ========================================================================== */
(function () {
  "use strict";

  const VIEW_W = 960;
  const VIEW_H = 380;
  const FLOOR_Y = 320;
  const GRAVITY = 0.62;
  const MOVE_SPEED = 3.4;
  const JUMP_VEL = -11.5;
  const ROOM_W = 480;

  function LabGame(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.opts = opts || {};
    this.stations = opts.stations || [];   // [{id,label,icon}]
    this.onTerminal = opts.onTerminal || function () {};
    this.onChip = opts.onChip || function () {};
    this.onLevelComplete = opts.onLevelComplete || function () {};
    this.reducedMotion = !!opts.reducedMotion;
    this.avatarHue = typeof opts.avatarHue === "number" ? opts.avatarHue : 174;

    canvas.width = VIEW_W;
    canvas.height = VIEW_H;

    this.levelW = ROOM_W * (this.stations.length + 1) + 200;
    this.player = {
      x: 60, y: FLOOR_Y - 46, w: 30, h: 46,
      vx: 0, vy: 0, onGround: true, facing: 1, walk: 0
    };
    this.checkpoint = { x: 60, y: this.player.y };
    this.input = { left: false, right: false, jump: false };
    this.paused = false;
    this.finished = false;
    this.tick = 0;
    this.nearTerminal = null;

    this.terminals = [];
    this.doors = [];
    this.chips = [];
    this.platforms = [{ x: 0, y: FLOOR_Y, w: this.levelW, h: VIEW_H - FLOOR_Y }];

    for (let i = 0; i < this.stations.length; i++) {
      const baseX = ROOM_W * i + 250;
      this.terminals.push({
        id: this.stations[i].id,
        label: this.stations[i].label,
        icon: this.stations[i].icon || "🖥️",
        x: baseX, y: FLOOR_Y - 62, w: 46, h: 62,
        done: false
      });
      this.doors.push({
        x: ROOM_W * (i + 1) - 40, y: FLOOR_Y - 110, w: 26, h: 110,
        open: false, openAmount: 0, afterTerminal: this.stations[i].id
      });
      // small raised platform with a bonus chip in each room
      const px = ROOM_W * i + 90;
      this.platforms.push({ x: px, y: FLOOR_Y - 78, w: 90, h: 14 });
      this.chips.push({ x: px + 38, y: FLOOR_Y - 108, taken: false });
      this.chips.push({ x: baseX - 80, y: FLOOR_Y - 34, taken: false });
    }
    // exit marker
    this.exit = { x: this.levelW - 120, y: FLOOR_Y - 84, w: 60, h: 84 };

    this.cameraX = 0;
    this._raf = null;
    this._boundLoop = this.loop.bind(this);
    this._onKeyDown = this.handleKey.bind(this, true);
    this._onKeyUp = this.handleKey.bind(this, false);
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
    this._raf = requestAnimationFrame(this._boundLoop);
  }

  LabGame.prototype.handleKey = function (down, e) {
    if (this.paused && down) { return; }
    const k = e.key.toLowerCase();
    let used = true;
    if (k === "arrowleft" || k === "a") { this.input.left = down; }
    else if (k === "arrowright" || k === "d") { this.input.right = down; }
    else if (k === "arrowup" || k === "w" || k === " " || k === "z") { this.input.jump = down; }
    else if (down && (k === "e" || k === "enter")) { this.tryInteract(); }
    else { used = false; }
    if (used && document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) { return; }
    if (used) { e.preventDefault(); }
  };

  LabGame.prototype.setInput = function (name, val) {
    if (name === "interact" && val) { this.tryInteract(); return; }
    this.input[name] = val;
  };

  LabGame.prototype.tryInteract = function () {
    if (this.paused || this.finished) { return; }
    if (this.nearTerminal && !this.nearTerminal.done) {
      this.pause();
      this.onTerminal(this.nearTerminal.id);
    }
  };

  LabGame.prototype.markTerminalDone = function (id) {
    for (const t of this.terminals) {
      if (t.id === id) { t.done = true; }
    }
    for (const d of this.doors) {
      if (d.afterTerminal === id) { d.open = true; }
    }
    this.checkpoint = { x: this.player.x, y: this.player.y };
  };

  LabGame.prototype.pause = function () { this.paused = true; this.input.left = this.input.right = this.input.jump = false; };
  LabGame.prototype.resume = function () { this.paused = false; };

  LabGame.prototype.destroy = function () {
    cancelAnimationFrame(this._raf);
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
    this.destroyed = true;
  };

  /* ---------- update ---------- */

  LabGame.prototype.update = function () {
    if (this.paused || this.finished) { return; }
    const p = this.player;
    this.tick++;

    p.vx = 0;
    if (this.input.left) { p.vx = -MOVE_SPEED; p.facing = -1; }
    if (this.input.right) { p.vx = MOVE_SPEED; p.facing = 1; }
    if (this.input.jump && p.onGround) { p.vy = JUMP_VEL; p.onGround = false; }

    p.vy += GRAVITY;
    if (p.vy > 14) { p.vy = 14; }

    // horizontal
    p.x += p.vx;
    if (p.x < 10) { p.x = 10; }
    if (p.x + p.w > this.levelW - 10) { p.x = this.levelW - 10 - p.w; }
    for (const d of this.doors) {
      if (!d.open && this.rectHit(p.x, p.y, p.w, p.h, d.x, d.y, d.w, d.h)) {
        if (p.vx > 0) { p.x = d.x - p.w; } else if (p.vx < 0) { p.x = d.x + d.w; }
      }
    }
    if (p.vx !== 0 && p.onGround) { p.walk += 0.25; } else if (p.onGround) { p.walk = 0; }

    // vertical
    p.y += p.vy;
    p.onGround = false;
    for (const pl of this.platforms) {
      if (this.rectHit(p.x, p.y, p.w, p.h, pl.x, pl.y, pl.w, pl.h)) {
        if (p.vy >= 0 && p.y + p.h - p.vy <= pl.y + 1) {
          p.y = pl.y - p.h; p.vy = 0; p.onGround = true;
        } else if (p.vy < 0 && p.y - p.vy >= pl.y + pl.h - 1) {
          p.y = pl.y + pl.h; p.vy = 0;
        }
      }
    }
    // safety net: never fall out of the world
    if (p.y > VIEW_H + 60) { p.x = this.checkpoint.x; p.y = this.checkpoint.y; p.vy = 0; }

    // doors animate open
    for (const d of this.doors) {
      if (d.open && d.openAmount < 1) { d.openAmount = Math.min(1, d.openAmount + (this.reducedMotion ? 1 : 0.06)); }
    }

    // chips
    for (const c of this.chips) {
      if (!c.taken && this.rectHit(p.x, p.y, p.w, p.h, c.x - 10, c.y - 10, 20, 20)) {
        c.taken = true;
        this.onChip();
      }
    }

    // near terminal?
    this.nearTerminal = null;
    for (const t of this.terminals) {
      if (!t.done && Math.abs((p.x + p.w / 2) - (t.x + t.w / 2)) < 58) {
        this.nearTerminal = t;
        break;
      }
    }

    // exit
    const allDone = this.terminals.every(function (t) { return t.done; });
    if (allDone && this.rectHit(p.x, p.y, p.w, p.h, this.exit.x, this.exit.y, this.exit.w, this.exit.h)) {
      this.finished = true;
      this.onLevelComplete();
    }

    // camera
    const target = p.x + p.w / 2 - VIEW_W / 2;
    const max = this.levelW - VIEW_W;
    const clamped = Math.max(0, Math.min(max, target));
    if (this.reducedMotion) { this.cameraX = clamped; }
    else { this.cameraX += (clamped - this.cameraX) * 0.12; }
  };

  LabGame.prototype.rectHit = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  };

  /* ---------- draw ---------- */

  LabGame.prototype.draw = function () {
    const ctx = this.ctx;
    const cam = this.cameraX;
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    // background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    grad.addColorStop(0, "#16244a");
    grad.addColorStop(1, "#0d1836");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // parallax circuit wall
    ctx.save();
    ctx.translate(-cam * 0.4, 0);
    ctx.strokeStyle = "rgba(64,224,208,0.10)";
    ctx.lineWidth = 2;
    for (let x = 0; x < this.levelW * 0.6 + VIEW_W; x += 120) {
      ctx.strokeRect(x + 20, 40, 70, 50);
      ctx.beginPath();
      ctx.moveTo(x + 55, 90); ctx.lineTo(x + 55, 140); ctx.lineTo(x + 100, 140);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 100, 140, 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(-cam, 0);

    // room strip lights
    for (let i = 0; i <= this.stations.length; i++) {
      const rx = ROOM_W * i;
      ctx.fillStyle = "rgba(143,125,255,0.12)";
      ctx.fillRect(rx + 10, 18, ROOM_W - 60, 8);
    }

    // platforms
    for (const pl of this.platforms) {
      ctx.fillStyle = "#22345c";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.fillStyle = "#40e0d0";
      ctx.fillRect(pl.x, pl.y, pl.w, 3);
      // circuit detail on the floor
      if (pl.h > 20) {
        ctx.strokeStyle = "rgba(64,224,208,0.15)";
        ctx.lineWidth = 1;
        for (let x = pl.x; x < pl.x + pl.w; x += 60) {
          ctx.strokeRect(x + 12, pl.y + 14, 34, 20);
        }
      }
    }

    // chips
    for (const c of this.chips) {
      if (c.taken) { continue; }
      const bob = this.reducedMotion ? 0 : Math.sin((this.tick + c.x) * 0.06) * 4;
      ctx.save();
      ctx.translate(c.x, c.y + bob);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#40e0d0";
      ctx.fillRect(-8, -8, 16, 16);
      ctx.fillStyle = "#8f7dff";
      ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();
      ctx.fillStyle = "rgba(64,224,208,0.25)";
      ctx.beginPath();
      ctx.ellipse(c.x, FLOOR_Y - 2, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // terminals
    for (const t of this.terminals) {
      ctx.fillStyle = t.done ? "#1f4d3d" : "#2a3d68";
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.fillStyle = t.done ? "#35d07f" : "#ffb84d";
      ctx.fillRect(t.x + 6, t.y + 8, t.w - 12, 26);
      ctx.fillStyle = "#0d1836";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(t.done ? "✓" : "?", t.x + t.w / 2, t.y + 27);
      // glow
      if (!t.done) {
        const pulse = this.reducedMotion ? 0.35 : 0.25 + 0.15 * Math.sin(this.tick * 0.08);
        ctx.fillStyle = "rgba(255,184,77," + pulse + ")";
        ctx.beginPath();
        ctx.ellipse(t.x + t.w / 2, t.y + t.h, 34, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#b8c6e2";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(t.label, t.x + t.w / 2, t.y - 10);
    }

    // doors
    for (const d of this.doors) {
      const h = d.h * (1 - d.openAmount);
      ctx.fillStyle = "#31488a";
      ctx.fillRect(d.x - 6, d.y - 8, d.w + 12, 8);
      if (h > 2) {
        ctx.fillStyle = d.open ? "rgba(53,208,127,0.8)" : "#4a5fa8";
        ctx.fillRect(d.x, d.y, d.w, h);
        ctx.fillStyle = d.open ? "#b8ffd9" : "#ff7d7d";
        ctx.fillRect(d.x + d.w / 2 - 3, d.y + 8, 6, 6);
      }
      if (!d.open) {
        ctx.fillStyle = "rgba(255,125,125,0.6)";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("LOCKED", d.x + d.w / 2, d.y - 14);
      }
    }

    // exit portal
    const allDone = this.terminals.every(function (t) { return t.done; });
    ctx.fillStyle = allDone ? "rgba(53,208,127,0.25)" : "rgba(184,198,226,0.12)";
    ctx.fillRect(this.exit.x, this.exit.y, this.exit.w, this.exit.h);
    ctx.strokeStyle = allDone ? "#35d07f" : "#55688f";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.exit.x, this.exit.y, this.exit.w, this.exit.h);
    ctx.fillStyle = allDone ? "#b8ffd9" : "#8fa2c8";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("EXIT", this.exit.x + this.exit.w / 2, this.exit.y - 8);

    // player (original robot avatar)
    this.drawPlayer(ctx);

    ctx.restore();

    // interaction prompt (screen space)
    if (this.nearTerminal && !this.nearTerminal.done && !this.paused) {
      ctx.fillStyle = "rgba(14,22,48,0.9)";
      const msg = "Press E / Enter (or tap ⚡) to use the terminal";
      ctx.font = "bold 15px sans-serif";
      const w = ctx.measureText(msg).width + 30;
      ctx.fillRect(VIEW_W / 2 - w / 2, 12, w, 34);
      ctx.strokeStyle = "#40e0d0";
      ctx.strokeRect(VIEW_W / 2 - w / 2, 12, w, 34);
      ctx.fillStyle = "#eaf1ff";
      ctx.textAlign = "center";
      ctx.fillText(msg, VIEW_W / 2, 34);
    }
  };

  LabGame.prototype.drawPlayer = function (ctx) {
    const p = this.player;
    const bounce = p.onGround && p.vx !== 0 && !this.reducedMotion ? Math.abs(Math.sin(p.walk)) * 2 : 0;
    const x = p.x, y = p.y - bounce;
    const hue = this.avatarHue;
    ctx.save();
    // body
    ctx.fillStyle = "hsl(" + hue + ", 65%, 55%)";
    roundRect(ctx, x, y + 14, p.w, p.h - 22, 6);
    ctx.fill();
    // head
    ctx.fillStyle = "hsl(" + hue + ", 55%, 70%)";
    roundRect(ctx, x + 2, y, p.w - 4, 18, 6);
    ctx.fill();
    // visor
    ctx.fillStyle = "#0d1836";
    roundRect(ctx, x + (p.facing === 1 ? 8 : 4), y + 4, 18, 9, 4);
    ctx.fill();
    ctx.fillStyle = "#40e0d0";
    ctx.fillRect(x + (p.facing === 1 ? 12 : 8) + (p.facing === 1 ? 4 : 0), y + 6, 4, 5);
    // antenna
    ctx.strokeStyle = "hsl(" + hue + ", 55%, 70%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + p.w / 2, y);
    ctx.lineTo(x + p.w / 2, y - 7);
    ctx.stroke();
    ctx.fillStyle = "#ffb84d";
    ctx.beginPath();
    ctx.arc(x + p.w / 2, y - 9, 3, 0, Math.PI * 2);
    ctx.fill();
    // legs
    ctx.fillStyle = "hsl(" + hue + ", 65%, 40%)";
    const step = p.onGround && p.vx !== 0 && !this.reducedMotion ? Math.sin(p.walk) * 4 : 0;
    ctx.fillRect(x + 5 + step, y + p.h - 9, 8, 9);
    ctx.fillRect(x + p.w - 13 - step, y + p.h - 9, 8, 9);
    ctx.restore();
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  LabGame.prototype.loop = function () {
    if (this.destroyed) { return; }
    this.update();
    this.draw();
    this._raf = requestAnimationFrame(this._boundLoop);
  };

  window.LabGame = LabGame;
})();
