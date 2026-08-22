import { GameAudio } from "./audio";
import { GameInput } from "./input";
import { mulberry32, pick, randRange, xmur3 } from "./rng";
import { loadSave, writeSave, type SaveData } from "./save";
import { useGameStore } from "./store";
import {
  COYOTE,
  GRAVITY,
  GROUND_Y,
  JUMP_BUFFER,
  JUMP_CUT,
  JUMP_V,
  MAX_FALL,
  PLAYER_H,
  PLAYER_SLIDE_H,
  PLAYER_W,
  SLIDE_BUFFER,
  SLIDE_TIME,
  SPEED_MAX,
  SPEED_START,
  STEP,
  WORLD_H,
  type Coin,
  type Floater,
  type HudSnapshot,
  type Obstacle,
  type ObstacleKind,
  type Particle,
  type Phase,
} from "./types";

const POOL_OBS = 32;
const POOL_COIN = 48;
const POOL_PART = 160;
const POOL_FLOAT = 16;

interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  grounded: boolean;
  sliding: boolean;
  slideT: number;
  dead: boolean;
  deathT: number;
  rot: number;
  rv: number;
  runPhase: number;
  landSquash: number;
  jumpStretch: number;
  coyote: number;
  jumpBuf: number;
  slideBuf: number;
  scarf: { x: number; y: number }[];
}

export class DusklineGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: GameInput;
  private audio: GameAudio;
  private reducedMotion: boolean;

  private raf = 0;
  private acc = 0;
  private last = 0;
  private destroyed = false;
  private hudClock = 0;

  private phase: Phase = "title";
  private scroll = 0;
  private speed = SPEED_START;
  private distance = 0;
  private score = 0;
  private combo = 0;
  private comboT = 0;
  private maxCombo = 0;
  private isNewHigh = false;
  private save: SaveData;

  private viewW = 1280;
  private viewH = 720;
  private scale = 1;
  private originY = 0;
  private cssW = 1280;
  private cssH = 720;

  private player: Player;
  private obstacles: Obstacle[] = [];
  private coins: Coin[] = [];
  private particles: Particle[] = [];
  private floaters: Floater[] = [];

  private nextSpawn = 900;
  private spawnCount = 0;
  private lastKind: ObstacleKind | "none" = "none";
  private rng: () => number = mulberry32(1);
  private decoRng: () => number = mulberry32(2);
  private seed = 1;

  private trauma = 0;
  private flash = 0;
  private hitstop = 0;
  private timeScale = 1;
  private introT = 0;
  private titleScroll = 0;

  constructor(canvas: HTMLCanvasElement, opts?: { reducedMotion?: boolean }) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D is not available");
    this.ctx = ctx;
    this.reducedMotion = Boolean(opts?.reducedMotion);
    this.input = new GameInput(canvas);
    this.audio = new GameAudio();
    this.save = loadSave();
    this.audio.setMuted(this.save.muted);
    this.player = this.freshPlayer();
    this.allocPools();
    this.seedWorld(Date.now() & 0xfffffff);
    this.syncHud(true);
    this.resize();
    this.onResize = this.onResize.bind(this);
    this.onVis = this.onVis.bind(this);
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVis);
  }

  start() {
    this.last = performance.now();
    const loop = (now: number) => {
      if (this.destroyed) return;
      this.raf = requestAnimationFrame(loop);
      let dt = (now - this.last) / 1000;
      this.last = now;
      if (dt > 0.1) dt = 0.1;
      this.acc += dt;
      const cap = STEP * 8;
      if (this.acc > cap) this.acc = cap;
      while (this.acc >= STEP) {
        this.fixedUpdate(STEP);
        this.acc -= STEP;
      }
      this.draw(this.acc / STEP);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.input.destroy();
    this.audio.destroy();
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVis);
  }

  play() {
    this.audio.unlock();
    this.audio.ui();
    this.resetRun();
    this.phase = "playing";
    this.syncHud(true);
  }

  toggleMute() {
    this.save.muted = !this.save.muted;
    this.audio.setMuted(this.save.muted);
    writeSave(this.save);
    this.syncHud(true);
  }

  private onResize() {
    this.resize();
  }

  private onVis() {
    if (document.hidden) {
      this.acc = 0;
    } else {
      this.audio.resume();
      this.last = performance.now();
    }
  }

  private freshPlayer(): Player {
    return {
      x: 220,
      y: GROUND_Y - PLAYER_H,
      w: PLAYER_W,
      h: PLAYER_H,
      vy: 0,
      grounded: true,
      sliding: false,
      slideT: 0,
      dead: false,
      deathT: 0,
      rot: 0,
      rv: 0,
      runPhase: 0,
      landSquash: 0,
      jumpStretch: 0,
      coyote: 0,
      jumpBuf: 0,
      slideBuf: 0,
      scarf: Array.from({ length: 6 }, (_, i) => ({ x: 220 - i * 10, y: GROUND_Y - 40 })),
    };
  }

  private allocPools() {
    this.obstacles = Array.from({ length: POOL_OBS }, () => ({
      active: false,
      kind: "crate",
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      cleared: false,
      nearMissed: false,
    }));
    this.coins = Array.from({ length: POOL_COIN }, () => ({
      active: false,
      x: 0,
      y: 0,
      r: 10,
      collected: false,
      phase: 0,
    }));
    this.particles = Array.from({ length: POOL_PART }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      size: 2,
      color: "#ecece6",
      kind: "dust",
      rot: 0,
      spin: 0,
    }));
    this.floaters = Array.from({ length: POOL_FLOAT }, () => ({
      active: false,
      x: 0,
      y: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      text: "",
      color: "#ecece6",
    }));
  }

  private seedWorld(seed: number) {
    this.seed = seed;
    this.rng = mulberry32(seed);
    this.decoRng = mulberry32(xmur3(`duskline-${seed}`));
  }

  private resetRun() {
    this.seedWorld((Math.random() * 0xffffffff) | 0);
    this.scroll = 0;
    this.speed = SPEED_START;
    this.distance = 0;
    this.score = 0;
    this.combo = 0;
    this.comboT = 0;
    this.maxCombo = 0;
    this.isNewHigh = false;
    this.nextSpawn = 980;
    this.spawnCount = 0;
    this.lastKind = "none";
    this.trauma = 0;
    this.flash = 0;
    this.hitstop = 0;
    this.timeScale = 1;
    this.introT = 0.9;
    this.player = this.freshPlayer();
    this.player.x = this.playerX();
    for (const o of this.obstacles) o.active = false;
    for (const c of this.coins) c.active = false;
    for (const p of this.particles) p.active = false;
    for (const f of this.floaters) f.active = false;
  }

  private playerX() {
    return Math.min(280, Math.max(150, this.viewW * 0.22));
  }

  private resize() {
    const parent = this.canvas.parentElement;
    const w = parent?.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || window.innerHeight;
    this.cssW = w;
    this.cssH = h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.floor(w * dpr));
    this.canvas.height = Math.max(1, Math.floor(h * dpr));
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let scale = Math.min(h / 620, w / 620);
    if (w / scale < 620) scale = w / 620;
    this.scale = scale;
    this.viewW = w / scale;
    this.viewH = h / scale;
    const groundScreen = h * 0.78;
    this.originY = groundScreen / scale - GROUND_Y;
    this.player.x = this.playerX();
  }

  private fixedUpdate(dt: number) {
    if (this.input.consumeMute()) this.toggleMute();

    if (this.phase === "title") {
      if (this.input.consumeStart() || this.input.consumeJump()) this.play();
      this.titleScroll += 70 * dt;
      this.player.runPhase += dt * 10;
      this.updateScarf(dt, 70);
      this.spawnTitleDust(dt);
      this.updateParticles(dt);
      return;
    }

    if (this.phase === "gameover") {
      if (this.input.consumeStart() || this.input.consumeJump()) this.play();
      this.updateParticles(dt);
      this.updateFloaters(dt);
      this.decayJuice(dt);
      return;
    }

    if (this.hitstop > 0) {
      this.hitstop -= dt;
      this.decayJuice(dt);
      return;
    }

    const sim = dt * this.timeScale;

    if (this.phase === "playing") {
      this.handleInput(sim);
      this.stepPlayer(sim);
      this.stepWorld(sim);
      this.spawnAhead();
      this.collide();
      this.updateCombo(sim);
    } else if (this.phase === "dying") {
      this.stepDeath(sim);
      this.stepWorld(sim * 0.45);
    }

    this.updateParticles(sim);
    this.updateFloaters(sim);
    this.updateScarf(sim, this.speed);
    this.decayJuice(dt);
    this.audio.setWindIntensity(this.speedNorm());
    this.hudClock += dt;
    if (this.hudClock > 0.08) {
      this.hudClock = 0;
      this.syncHud(false);
    }
  }

  private handleInput(dt: number) {
    if (this.input.consumeJump()) this.player.jumpBuf = JUMP_BUFFER;
    if (this.input.consumeSlide()) this.player.slideBuf = SLIDE_BUFFER;
    this.player.jumpBuf = Math.max(0, this.player.jumpBuf - dt);
    this.player.slideBuf = Math.max(0, this.player.slideBuf - dt);

    if (this.player.jumpBuf > 0 && (this.player.grounded || this.player.coyote > 0) && !this.player.dead) {
      this.doJump();
    }
    if (this.player.slideBuf > 0 && this.player.grounded && !this.player.sliding && !this.player.dead) {
      this.doSlide();
    }
  }

  private doJump() {
    const p = this.player;
    p.vy = JUMP_V;
    p.grounded = false;
    p.coyote = 0;
    p.jumpBuf = 0;
    p.sliding = false;
    p.slideT = 0;
    p.h = PLAYER_H;
    p.y = Math.min(p.y, GROUND_Y - PLAYER_H);
    p.jumpStretch = 1;
    p.landSquash = 0;
    this.audio.jump();
    this.burst(p.x + p.w * 0.4, GROUND_Y - 4, 8, "dust", 80, -40);
  }

  private doSlide() {
    const p = this.player;
    p.sliding = true;
    p.slideT = SLIDE_TIME;
    p.slideBuf = 0;
    p.h = PLAYER_SLIDE_H;
    p.y = GROUND_Y - PLAYER_SLIDE_H;
    this.audio.slide();
    this.burst(p.x + p.w, GROUND_Y - 6, 10, "dust", 140, -20);
  }

  private stepPlayer(dt: number) {
    const p = this.player;
    p.x = this.playerX();

    if (p.sliding) {
      p.slideT -= dt;
      if (p.slideT <= 0 && !this.input.isSlideHeld()) {
        p.sliding = false;
        p.h = PLAYER_H;
        p.y = GROUND_Y - PLAYER_H;
      } else if (p.slideT <= 0) {
        p.slideT = 0.05;
      }
    }

    const wasGrounded = p.grounded;
    p.vy += GRAVITY * dt;
    if (p.vy > MAX_FALL) p.vy = MAX_FALL;
    p.y += p.vy * dt;

    const floor = GROUND_Y - p.h;
    if (p.y >= floor) {
      p.y = floor;
      if (!wasGrounded && p.vy > 220) {
        p.landSquash = Math.min(1, p.vy / 1100);
        this.audio.land();
        this.burst(p.x + p.w * 0.5, GROUND_Y, 12, "land", 90, -80);
        if (!this.reducedMotion) this.trauma = Math.min(1, this.trauma + 0.12);
      }
      p.vy = 0;
      p.grounded = true;
      p.coyote = COYOTE;
      p.jumpStretch *= Math.exp(-14 * dt);
    } else {
      p.grounded = false;
      p.coyote = Math.max(0, p.coyote - dt);
    }

    if (p.sliding && p.grounded) {
      if (this.rng() > 0.4) this.burst(p.x + p.w, GROUND_Y - 4, 1, "dust", 90, -10);
    }
    p.runPhase += dt * (p.grounded ? 11 + this.speed * 0.012 : 4);
    p.landSquash = Math.max(0, p.landSquash - dt * 4.2);
    if (!p.grounded && p.vy < 0) p.jumpStretch = Math.min(1, p.jumpStretch + dt * 3);
    else p.jumpStretch = Math.max(0, p.jumpStretch - dt * 5);

    p.rot *= Math.exp(-8 * dt);
  }

  private stepDeath(dt: number) {
    const p = this.player;
    p.deathT += dt;
    p.vy += GRAVITY * 0.7 * dt;
    p.y += p.vy * dt;
    p.rot += p.rv * dt;
    p.x += 40 * dt;
    this.timeScale = Math.max(0.2, this.timeScale - dt * 0.8);
    if (p.deathT > 0.85) {
      this.phase = "gameover";
      this.persistHigh();
      this.syncHud(true);
    }
  }

  private stepWorld(dt: number) {
    const t = this.distance / 2800;
    this.speed = SPEED_START + (SPEED_MAX - SPEED_START) * (1 - Math.exp(-t));
    this.scroll += this.speed * dt;
    this.distance += this.speed * dt * 0.08;
    this.score += this.speed * dt * 0.12;

    if (this.introT > 0) this.introT -= dt;

    const cull = this.scroll - 220;
    for (const o of this.obstacles) {
      if (!o.active) continue;
      if (o.x + o.w < cull) o.active = false;
    }
    for (const c of this.coins) {
      if (!c.active) continue;
      c.phase += dt * 6;
      if (c.x + c.r < cull) c.active = false;
    }
  }

  private spawnAhead() {
    if (this.phase !== "playing" || this.introT > 0) return;
    const horizon = this.scroll + this.viewW + 80;
    while (this.nextSpawn < horizon) {
      this.placePattern(this.nextSpawn);
      const react = Math.max(0.55, 0.95 - this.spawnCount * 0.012);
      const gap = this.speed * react + randRange(this.rng, 70, 180);
      this.nextSpawn += gap;
      this.spawnCount += 1;
    }
  }

  private placePattern(x: number) {
    const dens = Math.min(1, this.spawnCount / 28);
    const kinds: ObstacleKind[] = ["crate", "crate", "vent", "beam", "sign"];
    if (dens > 0.2) kinds.push("stack", "pipe");
    if (dens > 0.45) kinds.push("stack", "beam", "pipe");
    let kind = pick(this.rng, kinds);

    if (this.lastKind === "beam" || this.lastKind === "sign" || this.lastKind === "pipe") {
      if (kind === "beam" || kind === "sign" || kind === "pipe") kind = pick(this.rng, ["crate", "vent", "stack"]);
    }
    if (this.lastKind === "stack" && kind === "stack") kind = "crate";

    this.lastKind = kind;
    switch (kind) {
      case "crate":
        this.spawnObs("crate", x, GROUND_Y - 50, 54, 50);
        if (this.rng() > 0.35) this.coinArc(x + 24, GROUND_Y - 128, 3, 22);
        break;
      case "stack":
        this.spawnObs("stack", x, GROUND_Y - 92, 56, 92);
        this.coinArc(x + 26, GROUND_Y - 188, 4, 26);
        break;
      case "vent":
        this.spawnObs("vent", x, GROUND_Y - 38, 78, 38);
        if (this.rng() > 0.5) this.coinArc(x + 36, GROUND_Y - 110, 3, 18);
        break;
      case "beam":
        this.spawnObs("beam", x, GROUND_Y - 220, 96, 184);
        break;
      case "sign":
        this.spawnObs("sign", x, GROUND_Y - 214, 110, 178);
        break;
      case "pipe":
        this.spawnObs("pipe", x, GROUND_Y - 248, 28, 212);
        break;
    }

    if (dens > 0.55 && this.rng() > 0.72 && kind === "crate") {
      this.spawnObs("beam", x + 240 + this.speed * 0.32, GROUND_Y - 220, 90, 184);
    }
  }

  private spawnObs(kind: ObstacleKind, x: number, y: number, w: number, h: number) {
    const o = this.obstacles.find((it) => !it.active);
    if (!o) return;
    o.active = true;
    o.kind = kind;
    o.x = x;
    o.y = y;
    o.w = w;
    o.h = h;
    o.cleared = false;
    o.nearMissed = false;
  }

  private coinArc(cx: number, cy: number, n: number, spread: number) {
    for (let i = 0; i < n; i++) {
      const c = this.coins.find((it) => !it.active);
      if (!c) return;
      const t = n === 1 ? 0.5 : i / (n - 1);
      c.active = true;
      c.collected = false;
      c.x = cx + (t - 0.5) * spread * 2;
      c.y = cy - Math.sin(t * Math.PI) * 28;
      c.r = 9;
      c.phase = t * 2;
    }
  }

  private collide() {
    const p = this.player;
    const hb = this.hitbox();

    for (const o of this.obstacles) {
      if (!o.active) continue;
      const ox = o.x - this.scroll;
      if (aabb(hb.x, hb.y, hb.w, hb.h, ox, o.y, o.w, o.h)) {
        this.kill(o);
        return;
      }
      if (!o.cleared && ox + o.w < hb.x) {
        o.cleared = true;
        this.addCombo(1, p.x + p.w, p.y);
        this.score += 12 * Math.max(1, this.combo);
      }
      if (!o.nearMissed && !o.cleared && ox < hb.x + hb.w + 10) {
        const gap = Math.min(
          Math.abs(hb.y + hb.h - o.y),
          Math.abs(o.y + o.h - hb.y),
        );
        const closeX = hb.x + hb.w > ox - 8 && hb.x < ox + o.w + 8;
        if (closeX && gap < 16) {
          o.nearMissed = true;
          this.addCombo(1, p.x + p.w * 0.5, p.y - 10);
          this.score += 18 * this.combo;
          this.audio.nearMiss();
          this.spawnFloater(p.x + 20, p.y - 24, "close", "#c4785a");
          if (!this.reducedMotion) this.flash = Math.max(this.flash, 0.18);
        }
      }
    }

    for (const c of this.coins) {
      if (!c.active || c.collected) continue;
      const cx = c.x - this.scroll;
      if (aabb(hb.x, hb.y, hb.w, hb.h, cx - c.r, c.y - c.r, c.r * 2, c.r * 2)) {
        c.collected = true;
        c.active = false;
        this.score += 25;
        this.audio.coin();
        this.spawnFloater(cx, c.y, "+25", "#ecece6");
        this.burst(cx, c.y, 6, "spark", 60, -40);
      }
    }
  }

  private hitbox() {
    const p = this.player;
    const padX = 8;
    const padY = p.sliding ? 2 : 6;
    return {
      x: p.x + padX,
      y: p.y + padY,
      w: p.w - padX * 2,
      h: p.h - padY - 2,
    };
  }

  private addCombo(n: number, x: number, y: number) {
    this.combo += n;
    this.comboT = 2.4;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    if (this.combo >= 2) {
      this.audio.combo(this.combo);
      this.spawnFloater(x, y - 18, `x${this.combo}`, "#ecece6");
    }
  }

  private updateCombo(dt: number) {
    if (this.combo <= 0) return;
    this.comboT -= dt;
    if (this.comboT <= 0) this.combo = 0;
  }

  private kill(o: Obstacle) {
    const p = this.player;
    p.dead = true;
    p.vy = -480;
    p.rv = randRange(this.rng, 6, 10) * (this.rng() > 0.5 ? 1 : -1);
    p.sliding = false;
    this.phase = "dying";
    this.hitstop = this.reducedMotion ? 0.02 : 0.09;
    this.trauma = this.reducedMotion ? 0.2 : 0.85;
    this.flash = 0.7;
    this.timeScale = 0.55;
    this.audio.crash();
    this.burst(p.x + p.w * 0.5, p.y + p.h * 0.4, 28, "spark", 220, -200);
    this.burst(o.x - this.scroll + o.w * 0.5, o.y + o.h * 0.5, 14, "scrap", 160, -80);
    this.persistHigh();
    this.syncHud(true);
  }

  private persistHigh() {
    const rounded = Math.floor(this.score);
    if (rounded > this.save.highScore) {
      this.save.highScore = rounded;
      this.isNewHigh = true;
      writeSave(this.save);
    }
  }

  private burst(
    x: number,
    y: number,
    n: number,
    kind: Particle["kind"],
    spd: number,
    lift: number,
  ) {
    const colors =
      kind === "spark"
        ? ["#ecece6", "#c4785a", "#c8ccc4"]
        : kind === "scrap"
          ? ["#3a3b42", "#c4785a", "#8a8c92"]
          : ["#6a6560", "#8a8c92", "#c8ccc4"];
    for (let i = 0; i < n; i++) {
      const p = this.particles.find((it) => !it.active);
      if (!p) return;
      const a = randRange(this.rng, -Math.PI, 0);
      const s = randRange(this.rng, spd * 0.3, spd);
      p.active = true;
      p.x = x + randRange(this.rng, -6, 6);
      p.y = y;
      p.vx = Math.cos(a) * s * 0.4 - this.speed * 0.15;
      p.vy = Math.sin(a) * s + lift * this.rng();
      p.life = randRange(this.rng, 0.25, 0.7);
      p.maxLife = p.life;
      p.size = randRange(this.rng, 1.5, kind === "scrap" ? 6 : 3.5);
      p.color = pick(this.rng, colors);
      p.kind = kind;
      p.rot = this.rng() * Math.PI;
      p.spin = randRange(this.rng, -8, 8);
    }
  }

  private spawnTitleDust(dt: number) {
    if (this.rng() > dt * 8) return;
    const p = this.particles.find((it) => !it.active);
    if (!p) return;
    p.active = true;
    p.x = randRange(this.rng, 0, this.viewW);
    p.y = randRange(this.rng, GROUND_Y - 280, GROUND_Y - 20);
    p.vx = -randRange(this.rng, 20, 70);
    p.vy = randRange(this.rng, -8, 8);
    p.life = randRange(this.rng, 1.2, 2.4);
    p.maxLife = p.life;
    p.size = randRange(this.rng, 1, 2.4);
    p.color = "rgba(236,236,230,0.35)";
    p.kind = "wind";
    p.rot = 0;
    p.spin = 0;
  }

  private spawnFloater(x: number, y: number, text: string, color: string) {
    const f = this.floaters.find((it) => !it.active);
    if (!f) return;
    f.active = true;
    f.x = x;
    f.y = y;
    f.vy = -46;
    f.life = 0.7;
    f.maxLife = 0.7;
    f.text = text;
    f.color = color;
  }

  private updateParticles(dt: number) {
    for (const p of this.particles) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 420 * dt;
      p.rot += p.spin * dt;
    }
  }

  private updateFloaters(dt: number) {
    for (const f of this.floaters) {
      if (!f.active) continue;
      f.life -= dt;
      if (f.life <= 0) {
        f.active = false;
        continue;
      }
      f.y += f.vy * dt;
      f.vy *= Math.exp(-2 * dt);
    }
  }

  private updateScarf(dt: number, speed: number) {
    const p = this.player;
    const anchorX = p.x + 8;
    const anchorY = p.y + (p.sliding ? 10 : 18);
    let px = anchorX;
    let py = anchorY;
    const spacing = 9;
    for (let i = 0; i < p.scarf.length; i++) {
      const s = p.scarf[i]!;
      const targetX = px - spacing - speed * dt * 0.15;
      const targetY = py + Math.sin(p.runPhase * 0.7 + i * 0.6) * (p.grounded ? 2.2 : 4);
      s.x += (targetX - s.x) * (1 - Math.exp(-18 * dt));
      s.y += (targetY - s.y) * (1 - Math.exp(-14 * dt));
      px = s.x;
      py = s.y;
    }
  }

  private decayJuice(dt: number) {
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    this.flash = Math.max(0, this.flash - dt * 2.4);
  }

  private speedNorm() {
    return (this.speed - SPEED_START) / (SPEED_MAX - SPEED_START);
  }

  private snapshot(): HudSnapshot {
    return {
      phase: this.phase,
      score: Math.floor(this.score),
      highScore: this.save.highScore,
      combo: this.combo,
      maxCombo: this.maxCombo,
      distance: Math.floor(this.distance),
      speedNorm: this.speedNorm(),
      isNewHigh: this.isNewHigh,
      muted: this.save.muted,
    };
  }

  private syncHud(force: boolean) {
    const snap = this.snapshot();
    const cur = useGameStore.getState();
    if (
      !force &&
      cur.phase === snap.phase &&
      cur.combo === snap.combo &&
      cur.muted === snap.muted &&
      Math.abs(cur.score - snap.score) < 4
    ) {
      return;
    }
    useGameStore.getState().patch(snap);
  }

  private draw(alpha: number) {
    const ctx = this.ctx;
    const w = this.cssW;
    const h = this.cssH;
    ctx.save();
    ctx.fillStyle = "#0b0c0f";
    ctx.fillRect(0, 0, w, h);

    const shake = this.reducedMotion ? 0 : this.trauma * this.trauma;
    const t = performance.now() * 0.001;
    const ox = shake * 14 * Math.sin(t * 47);
    const oy = shake * 10 * Math.cos(t * 41);
    const rot = shake * 0.012 * Math.sin(t * 29);

    ctx.translate(w / 2, h / 2);
    ctx.rotate(rot);
    ctx.translate(-w / 2 + ox, -h / 2 + oy);
    ctx.scale(this.scale, this.scale);
    ctx.translate(0, this.originY);

    const scroll = this.phase === "title" ? this.titleScroll : this.scroll;
    this.drawSky(ctx);
    this.drawParallax(ctx, scroll);
    this.drawGround(ctx, scroll);
    this.drawCoins(ctx, scroll);
    this.drawObstacles(ctx, scroll);
    this.drawPlayer(ctx, alpha);
    this.drawParticles(ctx);
    this.drawFloaters(ctx);
    this.drawHorizonDust(ctx, scroll);

    ctx.restore();

    if (this.flash > 0) {
      ctx.fillStyle = `rgba(236,236,230,${this.flash * 0.35})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  private drawSky(ctx: CanvasRenderingContext2D) {
    const g = ctx.createLinearGradient(0, -this.originY - 40, 0, GROUND_Y);
    g.addColorStop(0, "#121018");
    g.addColorStop(0.42, "#2a2228");
    g.addColorStop(0.72, "#8b5a4a");
    g.addColorStop(0.88, "#c4785a");
    g.addColorStop(1, "#3a2a28");
    ctx.fillStyle = g;
    ctx.fillRect(-40, -this.originY - 80, this.viewW + 80, this.viewH + 160);

    const sunX = this.viewW * 0.72;
    const sunY = GROUND_Y - 210;
    const rg = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 220);
    rg.addColorStop(0, "rgba(236, 196, 160, 0.95)");
    rg.addColorStop(0.18, "rgba(196, 120, 90, 0.7)");
    rg.addColorStop(1, "rgba(196, 120, 90, 0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 220, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8c4a8";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 34, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawParallax(ctx: CanvasRenderingContext2D, scroll: number) {
    this.drawCityLayer(ctx, scroll * 0.12, 0.35, 90, "#16141a");
    this.drawCityLayer(ctx, scroll * 0.28, 0.55, 150, "#101014");
    this.drawCityLayer(ctx, scroll * 0.5, 0.78, 230, "#0c0c10");
  }

  private drawCityLayer(
    ctx: CanvasRenderingContext2D,
    scroll: number,
    alpha: number,
    maxH: number,
    color: string,
  ) {
    const tile = 140;
    const start = Math.floor(scroll / tile) - 1;
    const end = start + Math.ceil(this.viewW / tile) + 3;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    for (let i = start; i <= end; i++) {
      const rng = mulberry32((i * 374761) ^ (Math.floor(maxH) * 13));
      const x = i * tile - (scroll % tile) - tile;
      const count = 2 + Math.floor(rng() * 3);
      let cx = x;
      for (let b = 0; b < count; b++) {
        const bw = 28 + rng() * 46;
        const bh = 40 + rng() * maxH;
        const by = GROUND_Y - bh - 8;
        roundRect(ctx, cx, by, bw, bh + 12, 2);
        ctx.fill();
        if (maxH > 160 && rng() > 0.45) {
          ctx.fillStyle = `rgba(236, 196, 160, ${0.08 + rng() * 0.18})`;
          const cols = 2 + Math.floor(rng() * 3);
          const rows = 3 + Math.floor(rng() * 5);
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (rng() > 0.35) {
                ctx.fillRect(cx + 6 + c * 8, by + 10 + r * 12, 4, 6);
              }
            }
          }
          ctx.fillStyle = color;
        }
        if (rng() > 0.7) {
          ctx.fillRect(cx + bw * 0.45, by - 16, 3, 16);
        }
        cx += bw + 8 + rng() * 18;
      }
    }
    ctx.restore();
  }

  private drawGround(ctx: CanvasRenderingContext2D, scroll: number) {
    const y = GROUND_Y;
    ctx.fillStyle = "#14151a";
    ctx.fillRect(-40, y, this.viewW + 80, this.viewH);
    ctx.fillStyle = "#1c1d24";
    ctx.fillRect(-40, y, this.viewW + 80, 18);
    ctx.fillStyle = "#2a2b32";
    ctx.fillRect(-40, y, this.viewW + 80, 3);

    const tile = 96;
    const start = Math.floor(scroll / tile) - 1;
    const end = start + Math.ceil(this.viewW / tile) + 2;
    for (let i = start; i <= end; i++) {
      const rng = mulberry32((i * 7919) ^ 17);
      const x = i * tile - (scroll % tile);
      ctx.strokeStyle = "rgba(236,236,230,0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 80);
      ctx.stroke();
      if (rng() > 0.72) {
        ctx.fillStyle = "#1a1b22";
        ctx.fillRect(x + 12, y - 10, 22, 10);
      }
      if (rng() > 0.82) {
        ctx.fillStyle = "#8a8c92";
        ctx.globalAlpha = 0.25;
        ctx.fillRect(x + 40, y + 8, 18, 4);
        ctx.globalAlpha = 1;
      }
    }

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(-40, y + 18, this.viewW + 80, 90);
  }

  private drawObstacles(ctx: CanvasRenderingContext2D, scroll: number) {
    for (const o of this.obstacles) {
      if (!o.active) continue;
      const x = o.x - scroll;
      if (x > this.viewW + 40 || x + o.w < -40) continue;
      switch (o.kind) {
        case "crate":
        case "stack":
          this.drawCrate(ctx, x, o.y, o.w, o.h);
          break;
        case "vent":
          this.drawVent(ctx, x, o.y, o.w, o.h);
          break;
        case "beam":
        case "sign":
          this.drawBeam(ctx, x, o.y, o.w, o.h, o.kind === "sign");
          break;
        case "pipe":
          this.drawPipe(ctx, x, o.y, o.w, o.h);
          break;
      }
    }
  }

  private drawCrate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, GROUND_Y + 4, w * 0.42, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, "#3a342f");
    g.addColorStop(1, "#241f1c");
    ctx.fillStyle = g;
    roundRect(ctx, x, y, w, h, 4);
    ctx.fill();
    ctx.strokeStyle = "rgba(236,236,230,0.12)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.strokeStyle = "rgba(196,120,90,0.35)";
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 8);
    ctx.lineTo(x + w - 8, y + h - 8);
    ctx.moveTo(x + w - 8, y + 8);
    ctx.lineTo(x + 8, y + h - 8);
    ctx.stroke();
    if (h > 70) {
      ctx.strokeStyle = "rgba(236,236,230,0.08)";
      ctx.beginPath();
      ctx.moveTo(x + 4, y + h * 0.48);
      ctx.lineTo(x + w - 4, y + h * 0.48);
      ctx.stroke();
    }
  }

  private drawVent(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(x + 4, GROUND_Y, w - 8, 5);
    ctx.fillStyle = "#2a2d34";
    roundRect(ctx, x, y, w, h, 3);
    ctx.fill();
    ctx.fillStyle = "#1a1c22";
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(x + 8 + i * 16, y + 8, 10, h - 14);
    }
    ctx.fillStyle = "#c4785a";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x + w - 10, y + 6, 4, 4);
    ctx.globalAlpha = 1;
  }

  private drawBeam(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, sign: boolean) {
    ctx.fillStyle = "#1a1b20";
    ctx.fillRect(x + w * 0.5 - 4, -this.originY - 20, 8, y + 24 + this.originY);
    ctx.fillStyle = "#2c2e36";
    roundRect(ctx, x, y, w, 18, 2);
    ctx.fill();
    if (sign) {
      ctx.fillStyle = "#ecece6";
      roundRect(ctx, x + 6, y + 20, w - 12, h - 28, 4);
      ctx.fill();
      ctx.fillStyle = "#0b0c0f";
      ctx.font = "700 16px Syne, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("LINE", x + w / 2, y + 56);
      ctx.fillStyle = "#c4785a";
      ctx.fillRect(x + 18, y + h - 22, w - 36, 4);
    } else {
      ctx.fillStyle = "#24262e";
      roundRect(ctx, x + 6, y + 16, w - 12, h - 16, 3);
      ctx.fill();
      ctx.fillStyle = "rgba(196,120,90,0.45)";
      ctx.fillRect(x + 12, y + 28, w - 24, 5);
      ctx.fillStyle = "rgba(236,236,230,0.08)";
      ctx.fillRect(x + 14, y + 48, w - 28, h - 70);
    }
  }

  private drawPipe(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = "#1a1b20";
    ctx.fillRect(x + w * 0.5 - 3, -this.originY - 20, 6, y + this.originY + 8);
    const g = ctx.createLinearGradient(x, y, x + w, y);
    g.addColorStop(0, "#3a3d46");
    g.addColorStop(0.5, "#8a8c92");
    g.addColorStop(1, "#2a2c32");
    ctx.fillStyle = g;
    roundRect(ctx, x, y, w, h, w / 2);
    ctx.fill();
    ctx.fillStyle = "#1c1d22";
    ctx.fillRect(x - 4, y + h - 14, w + 8, 10);
  }

  private drawCoins(ctx: CanvasRenderingContext2D, scroll: number) {
    for (const c of this.coins) {
      if (!c.active) continue;
      const x = c.x - scroll;
      const bob = Math.sin(c.phase) * 3;
      ctx.save();
      ctx.translate(x, c.y + bob);
      ctx.rotate(c.phase * 0.4);
      ctx.fillStyle = "rgba(236, 196, 160, 0.25)";
      ctx.beginPath();
      ctx.arc(0, 0, c.r + 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ecece6";
      ctx.beginPath();
      ctx.ellipse(0, 0, c.r, c.r * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c4785a";
      ctx.beginPath();
      ctx.ellipse(0, 0, c.r * 0.45, c.r * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, _alpha: number) {
    const p = this.player;
    const squash = 1 - p.landSquash * 0.28 + p.jumpStretch * 0.16;
    const stretch = 1 + p.landSquash * 0.22 - p.jumpStretch * 0.12;
    const bob = p.grounded && !p.sliding ? Math.sin(p.runPhase) * 2.2 : 0;

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w * 0.5, GROUND_Y + 5, 18 * stretch, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = "#c4785a";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(p.x + 10, p.y + 16);
    for (const s of p.scarf) ctx.lineTo(s.x, s.y);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h / 2 + bob);
    ctx.rotate(p.rot + (p.sliding ? 1.2 : 0));
    ctx.scale(
      stretch * (p.sliding ? 1.28 : 1),
      squash * (p.sliding ? 0.52 : 1),
    );

    const hw = p.w / 2;
    const hh = p.h / 2;
    const leg = Math.sin(p.runPhase) * (p.grounded && !p.sliding ? 10 : 4);

    ctx.strokeStyle = "#0b0c0f";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-6, hh - 8);
    ctx.lineTo(-8, hh + 6 + leg);
    ctx.moveTo(6, hh - 8);
    ctx.lineTo(10, hh + 6 - leg);
    ctx.stroke();
    ctx.strokeStyle = "#ecece6";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#ecece6";
    roundRect(ctx, -hw + 6, -hh + 10, p.w - 12, p.h - 22, 8);
    ctx.fill();

    ctx.fillStyle = "#ecece6";
    ctx.beginPath();
    ctx.arc(2, -hh + 10, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0b0c0f";
    ctx.beginPath();
    ctx.arc(6, -hh + 9, 2.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ecece6";
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    const arm = p.sliding ? 8 : Math.sin(p.runPhase + Math.PI) * 8;
    ctx.beginPath();
    ctx.moveTo(hw - 10, -4);
    ctx.lineTo(hw + 2, arm);
    ctx.stroke();

    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      if (!p.active) continue;
      const a = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.kind === "scrap") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawFloaters(ctx: CanvasRenderingContext2D) {
    ctx.font = "700 16px Syne, sans-serif";
    ctx.textAlign = "center";
    for (const f of this.floaters) {
      if (!f.active) continue;
      ctx.globalAlpha = Math.max(0, f.life / f.maxLife);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
      ctx.globalAlpha = 1;
    }
  }

  private drawHorizonDust(ctx: CanvasRenderingContext2D, scroll: number) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#ecece6";
    const n = 18;
    for (let i = 0; i < n; i++) {
      const rng = mulberry32(9000 + i);
      const x = ((rng() * this.viewW * 2 - (scroll * 0.4 + i * 40)) % (this.viewW + 80)) - 40;
      const y = GROUND_Y - 40 - rng() * 200;
      ctx.beginPath();
      ctx.arc(x, y, 1 + rng() * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function aabb(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

