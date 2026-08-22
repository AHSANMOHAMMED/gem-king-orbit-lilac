import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Volume2, t as VolumeX } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BUJ9U3V_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,opacity,background-color,color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/40 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-paper text-ink hover:opacity-90",
			ghost: "bg-transparent text-paper border border-line hover:bg-elevated",
			icon: "bg-elevated/80 text-paper border border-line hover:bg-panel"
		},
		size: {
			lg: "h-12 px-8 text-sm tracking-wide rounded-[20px]",
			md: "h-11 px-5 text-sm rounded-[16px]",
			icon: "size-11 rounded-[14px]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "lg"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	"data-ui": true,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
var useGameStore = create((set) => ({
	phase: "title",
	score: 0,
	highScore: 0,
	combo: 0,
	maxCombo: 0,
	distance: 0,
	speedNorm: 0,
	isNewHigh: false,
	muted: false,
	patch: (partial) => set(partial)
}));
function Overlays({ onPlay, onMute }) {
	const phase = useGameStore((s) => s.phase);
	const score = useGameStore((s) => s.score);
	const highScore = useGameStore((s) => s.highScore);
	const combo = useGameStore((s) => s.combo);
	const maxCombo = useGameStore((s) => s.maxCombo);
	const distance = useGameStore((s) => s.distance);
	const speedNorm = useGameStore((s) => s.speedNorm);
	const isNewHigh = useGameStore((s) => s.isNewHigh);
	const muted = useGameStore((s) => s.muted);
	const playing = phase === "playing" || phase === "dying";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-20 flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6",
				children: [
					playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-semibold tabular-nums leading-none tracking-tight text-paper sm:text-3xl",
							children: score.toLocaleString()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: ["Best ", highScore.toLocaleString()]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
					playing && combo >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-xl font-semibold tabular-nums tracking-tight text-paper",
							children: ["x", combo]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-[0.18em] text-muted",
							children: "combo"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "icon",
						size: "icon",
						"aria-label": muted ? "Unmute" : "Mute",
						onClick: onMute,
						className: "pointer-events-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative size-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: cn("absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)]", muted ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: cn("absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)]", muted ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]") })]
						})
					})
				]
			}),
			playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto h-1 max-w-xs overflow-hidden rounded-full bg-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-dusk transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
						style: { width: `${Math.round(speedNorm * 100)}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-faint",
					children: "Pace"
				})]
			}) : null,
			phase === "title" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, {
				highScore,
				onPlay
			}) : null,
			phase === "gameover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameOverScreen, {
				score,
				highScore,
				maxCombo,
				distance,
				isNewHigh,
				onPlay
			}) : null
		]
	});
}
function TitleScreen({ highScore, onPlay }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink/35 px-6",
		onPointerDown: (e) => {
			if (e.target.closest("button")) return;
			onPlay();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-w-md flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stagger-in text-[11px] uppercase tracking-[0.28em] text-muted",
					children: "Rooftop courier"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "stagger-in font-display mt-3 text-5xl font-semibold leading-none tracking-[-0.04em] text-paper text-balance sm:text-7xl",
					children: "Duskline"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stagger-in mt-4 max-w-xs text-sm leading-relaxed text-muted text-pretty",
					children: "Keep the line. Jump the crates. Slide the beams. The city only gets faster."
				}),
				highScore > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "stagger-in mt-5 font-display text-sm tabular-nums text-paper",
					children: ["Best ", highScore.toLocaleString()]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					className: "stagger-in mt-8 min-w-44",
					onClick: onPlay,
					children: "Run"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "stagger-in mt-10 grid grid-cols-2 gap-x-8 gap-y-2 text-left text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-faint",
							children: "Jump"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Tap · Space" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-faint",
							children: "Slide"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Swipe down · S" })
					]
				})
			]
		})
	});
}
function GameOverScreen({ score, highScore, maxCombo, distance, isNewHigh, onPlay }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink/55 px-6",
		onPointerDown: (e) => {
			if (e.target.closest("button")) return;
			onPlay();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-[40px] border border-line bg-elevated/90 p-6 text-center sm:rounded-[48px] sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stagger-in text-[11px] uppercase tracking-[0.28em] text-muted",
					children: "Line broken"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stagger-in font-display mt-3 text-5xl font-semibold tabular-nums tracking-tight text-paper",
					children: score.toLocaleString()
				}),
				isNewHigh ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stagger-in mt-2 text-xs uppercase tracking-[0.18em] text-dusk",
					children: "New record"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "stagger-in mt-2 text-xs text-muted",
					children: ["Best ", highScore.toLocaleString()]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in mt-6 grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Distance",
						value: `${distance} m`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Combo",
						value: `x${maxCombo}`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					className: "stagger-in mt-8 w-full",
					onClick: onPlay,
					children: "Again"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stagger-in mt-3 text-[11px] text-faint",
					children: "Enter or tap"
				})
			]
		})
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[16px] bg-panel px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-[0.16em] text-faint",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-lg tabular-nums text-paper",
			children: value
		})]
	});
}
var GameAudio = class {
	ctx = null;
	master = null;
	sfx = null;
	music = null;
	wind = null;
	windGain = null;
	unlocked = false;
	muted = false;
	unlock() {
		if (this.unlocked && this.ctx?.state === "running") return;
		if (!this.ctx) {
			const AC = window.AudioContext || window.webkitAudioContext;
			this.ctx = new AC({ latencyHint: "interactive" });
			this.master = this.ctx.createGain();
			this.sfx = this.ctx.createGain();
			this.music = this.ctx.createGain();
			this.sfx.gain.value = .7;
			this.music.gain.value = .22;
			this.master.gain.value = this.muted ? 0 : .85;
			this.sfx.connect(this.master);
			this.music.connect(this.master);
			this.master.connect(this.ctx.destination);
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
		this.unlocked = true;
		this.startWind();
	}
	setMuted(muted) {
		this.muted = muted;
		if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : .85, this.ctx.currentTime, .03);
	}
	resume() {
		if (this.ctx?.state === "suspended") this.ctx.resume();
	}
	startWind() {
		if (!this.ctx || !this.music || this.wind) return;
		const ctx = this.ctx;
		const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
		const src = ctx.createBufferSource();
		src.buffer = buffer;
		src.loop = true;
		const filter = ctx.createBiquadFilter();
		filter.type = "bandpass";
		filter.frequency.value = 420;
		filter.Q.value = .7;
		const gain = ctx.createGain();
		gain.gain.value = .18;
		src.connect(filter);
		filter.connect(gain);
		gain.connect(this.music);
		src.start();
		this.wind = src;
		this.windGain = gain;
	}
	setWindIntensity(t) {
		if (!this.windGain || !this.ctx) return;
		const v = .12 + t * .22;
		this.windGain.gain.setTargetAtTime(v, this.ctx.currentTime, .2);
	}
	jump() {
		this.blip(180, 420, .09, .12, "triangle");
		this.noise(.06, .08, 900, .4);
	}
	land() {
		this.blip(140, 70, .08, .18, "sine");
		this.noise(.08, .14, 280, .7);
	}
	slide() {
		this.noise(.16, .1, 700, .35);
	}
	coin() {
		this.blip(880, 1320, .07, .08, "sine");
		this.blip(1320, 1760, .05, .05, "sine", .04);
	}
	combo(n) {
		const f = 520 + Math.min(n, 12) * 40;
		this.blip(f, f * 1.5, .08, .09, "triangle");
	}
	nearMiss() {
		this.blip(1400, 1900, .04, .05, "square");
	}
	crash() {
		this.noise(.28, .35, 220, 1.2);
		this.blip(180, 40, .22, .28, "sawtooth");
	}
	ui() {
		this.blip(520, 640, .05, .06, "sine");
	}
	blip(f0, f1, dur, vol, type, delay = 0) {
		if (!this.ctx || !this.sfx) return;
		const t = this.ctx.currentTime + delay;
		const osc = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(f0, t);
		osc.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(vol, t + .012);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		osc.connect(g);
		g.connect(this.sfx);
		osc.start(t);
		osc.stop(t + dur + .02);
		osc.onended = () => {
			osc.disconnect();
			g.disconnect();
		};
	}
	noise(dur, vol, freq, q) {
		if (!this.ctx || !this.sfx) return;
		const ctx = this.ctx;
		const n = Math.floor(ctx.sampleRate * dur);
		const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
		const src = ctx.createBufferSource();
		src.buffer = buffer;
		const filter = ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = freq;
		filter.Q.value = q;
		const g = ctx.createGain();
		const t = ctx.currentTime;
		g.gain.setValueAtTime(vol, t);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		src.connect(filter);
		filter.connect(g);
		g.connect(this.sfx);
		src.start();
		src.stop(t + dur + .02);
		src.onended = () => {
			src.disconnect();
			filter.disconnect();
			g.disconnect();
		};
	}
	destroy() {
		try {
			this.wind?.stop();
		} catch {}
		this.wind = null;
		this.ctx?.close();
		this.ctx = null;
	}
};
var GAME_CODES = /* @__PURE__ */ new Set([
	"Space",
	"ArrowUp",
	"ArrowDown",
	"KeyW",
	"KeyS",
	"KeyZ",
	"KeyX",
	"Enter",
	"KeyP",
	"KeyM"
]);
var GameInput = class {
	keys = /* @__PURE__ */ new Set();
	jumpQueued = false;
	slideQueued = false;
	startQueued = false;
	muteQueued = false;
	pointerId = null;
	pointerStartY = 0;
	pointerStartX = 0;
	pointerDidSlide = false;
	swipeThreshold = 36;
	canvas;
	unbind = [];
	constructor(canvas) {
		this.canvas = canvas;
		this.bind();
	}
	bind() {
		const onKeyDown = (e) => {
			if (GAME_CODES.has(e.code)) e.preventDefault();
			if (e.repeat) return;
			this.keys.add(e.code);
			if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW" || e.code === "KeyZ") {
				this.jumpQueued = true;
				this.startQueued = true;
			}
			if (e.code === "ArrowDown" || e.code === "KeyS" || e.code === "KeyX") this.slideQueued = true;
			if (e.code === "Enter") this.startQueued = true;
			if (e.code === "KeyM") this.muteQueued = true;
		};
		const onKeyUp = (e) => {
			this.keys.delete(e.code);
		};
		const clearKeys = () => this.keys.clear();
		const onPointerDown = (e) => {
			if (e.button !== 0 && e.pointerType === "mouse") return;
			if (e.target?.closest("[data-ui]")) return;
			this.canvas.setPointerCapture(e.pointerId);
			this.pointerId = e.pointerId;
			this.pointerStartY = e.clientY;
			this.pointerStartX = e.clientX;
			this.pointerDidSlide = false;
			this.startQueued = true;
		};
		const onPointerMove = (e) => {
			if (this.pointerId !== e.pointerId) return;
			const dy = e.clientY - this.pointerStartY;
			const dx = e.clientX - this.pointerStartX;
			if (!this.pointerDidSlide && dy > this.swipeThreshold && dy > Math.abs(dx) * .7) {
				this.pointerDidSlide = true;
				this.slideQueued = true;
			}
		};
		const onPointerUp = (e) => {
			if (this.pointerId !== e.pointerId) return;
			const dy = e.clientY - this.pointerStartY;
			const dx = e.clientX - this.pointerStartX;
			if (!this.pointerDidSlide && dy < this.swipeThreshold && Math.abs(dx) < this.swipeThreshold * 1.6) this.jumpQueued = true;
			if (!this.pointerDidSlide && dy < -this.swipeThreshold) this.jumpQueued = true;
			this.pointerId = null;
		};
		const onPointerCancel = (e) => {
			if (this.pointerId === e.pointerId) this.pointerId = null;
		};
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("blur", clearKeys);
		document.addEventListener("visibilitychange", clearKeys);
		this.canvas.addEventListener("pointerdown", onPointerDown);
		this.canvas.addEventListener("pointermove", onPointerMove);
		this.canvas.addEventListener("pointerup", onPointerUp);
		this.canvas.addEventListener("pointercancel", onPointerCancel);
		this.unbind = [
			() => window.removeEventListener("keydown", onKeyDown),
			() => window.removeEventListener("keyup", onKeyUp),
			() => window.removeEventListener("blur", clearKeys),
			() => document.removeEventListener("visibilitychange", clearKeys),
			() => this.canvas.removeEventListener("pointerdown", onPointerDown),
			() => this.canvas.removeEventListener("pointermove", onPointerMove),
			() => this.canvas.removeEventListener("pointerup", onPointerUp),
			() => this.canvas.removeEventListener("pointercancel", onPointerCancel)
		];
	}
	consumeJump() {
		if (!this.jumpQueued) return false;
		this.jumpQueued = false;
		return true;
	}
	consumeSlide() {
		if (!this.slideQueued) return false;
		this.slideQueued = false;
		return true;
	}
	consumeStart() {
		if (!this.startQueued) return false;
		this.startQueued = false;
		return true;
	}
	consumeMute() {
		if (!this.muteQueued) return false;
		this.muteQueued = false;
		return true;
	}
	isSlideHeld() {
		return this.keys.has("ArrowDown") || this.keys.has("KeyS") || this.keys.has("KeyX");
	}
	destroy() {
		for (const fn of this.unbind) fn();
		this.unbind = [];
	}
};
function xmur3(str) {
	let h = 1779033703 ^ str.length;
	for (let i = 0; i < str.length; i++) {
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
		h = h << 13 | h >>> 19;
	}
	h = Math.imul(h ^ h >>> 16, 2246822507);
	h = Math.imul(h ^ h >>> 13, 3266489909);
	return (h ^= h >>> 16) >>> 0;
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function randRange(rng, a, b) {
	return a + rng() * (b - a);
}
function pick(rng, arr) {
	return arr[Math.floor(rng() * arr.length)];
}
var GRAVITY = 2650;
var JUMP_V = -920;
var MAX_FALL = 1550;
var SLIDE_TIME = .46;
var COYOTE = .09;
var JUMP_BUFFER = .13;
var SLIDE_BUFFER = .12;
var STEP = 1 / 60;
var SAVE_KEY = "duskline-save";
var defaults = {
	version: 1,
	highScore: 0,
	muted: false
};
function migrate(raw) {
	const s = {
		...defaults,
		...raw,
		version: raw.version ?? 0
	};
	if (s.version < 1) s.version = 1;
	if (!Number.isFinite(s.highScore) || s.highScore < 0) s.highScore = 0;
	s.muted = Boolean(s.muted);
	s.version = 1;
	return s;
}
function loadSave() {
	if (typeof window === "undefined") return { ...defaults };
	try {
		const raw = window.localStorage.getItem(SAVE_KEY);
		if (!raw) return { ...defaults };
		return migrate(JSON.parse(raw));
	} catch {
		return { ...defaults };
	}
}
function writeSave(data) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(SAVE_KEY, JSON.stringify({
			...data,
			version: 1
		}));
	} catch {}
}
var POOL_OBS = 32;
var POOL_COIN = 48;
var POOL_PART = 160;
var POOL_FLOAT = 16;
var DusklineGame = class {
	canvas;
	ctx;
	input;
	audio;
	reducedMotion;
	raf = 0;
	acc = 0;
	last = 0;
	destroyed = false;
	hudClock = 0;
	phase = "title";
	scroll = 0;
	speed = 340;
	distance = 0;
	score = 0;
	combo = 0;
	comboT = 0;
	maxCombo = 0;
	isNewHigh = false;
	save;
	viewW = 1280;
	viewH = 720;
	scale = 1;
	originY = 0;
	cssW = 1280;
	cssH = 720;
	player;
	obstacles = [];
	coins = [];
	particles = [];
	floaters = [];
	nextSpawn = 900;
	spawnCount = 0;
	lastKind = "none";
	rng = mulberry32(1);
	decoRng = mulberry32(2);
	seed = 1;
	trauma = 0;
	flash = 0;
	hitstop = 0;
	timeScale = 1;
	introT = 0;
	titleScroll = 0;
	constructor(canvas, opts) {
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
		this.seedWorld(Date.now() & 268435455);
		this.syncHud(true);
		this.resize();
		this.onResize = this.onResize.bind(this);
		this.onVis = this.onVis.bind(this);
		window.addEventListener("resize", this.onResize);
		document.addEventListener("visibilitychange", this.onVis);
	}
	start() {
		this.last = performance.now();
		const loop = (now) => {
			if (this.destroyed) return;
			this.raf = requestAnimationFrame(loop);
			let dt = (now - this.last) / 1e3;
			this.last = now;
			if (dt > .1) dt = .1;
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
	onResize() {
		this.resize();
	}
	onVis() {
		if (document.hidden) this.acc = 0;
		else {
			this.audio.resume();
			this.last = performance.now();
		}
	}
	freshPlayer() {
		return {
			x: 220,
			y: 484,
			w: 48,
			h: 64,
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
			scarf: Array.from({ length: 6 }, (_, i) => ({
				x: 220 - i * 10,
				y: 508
			}))
		};
	}
	allocPools() {
		this.obstacles = Array.from({ length: POOL_OBS }, () => ({
			active: false,
			kind: "crate",
			x: 0,
			y: 0,
			w: 0,
			h: 0,
			cleared: false,
			nearMissed: false
		}));
		this.coins = Array.from({ length: POOL_COIN }, () => ({
			active: false,
			x: 0,
			y: 0,
			r: 10,
			collected: false,
			phase: 0
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
			spin: 0
		}));
		this.floaters = Array.from({ length: POOL_FLOAT }, () => ({
			active: false,
			x: 0,
			y: 0,
			vy: 0,
			life: 0,
			maxLife: 1,
			text: "",
			color: "#ecece6"
		}));
	}
	seedWorld(seed) {
		this.seed = seed;
		this.rng = mulberry32(seed);
		this.decoRng = mulberry32(xmur3(`duskline-${seed}`));
	}
	resetRun() {
		this.seedWorld(Math.random() * 4294967295 | 0);
		this.scroll = 0;
		this.speed = 340;
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
		this.introT = .9;
		this.player = this.freshPlayer();
		this.player.x = this.playerX();
		for (const o of this.obstacles) o.active = false;
		for (const c of this.coins) c.active = false;
		for (const p of this.particles) p.active = false;
		for (const f of this.floaters) f.active = false;
	}
	playerX() {
		return Math.min(280, Math.max(150, this.viewW * .22));
	}
	resize() {
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
		const groundScreen = h * .78;
		this.originY = groundScreen / scale - 548;
		this.player.x = this.playerX();
	}
	fixedUpdate(dt) {
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
			this.stepWorld(sim * .45);
		}
		this.updateParticles(sim);
		this.updateFloaters(sim);
		this.updateScarf(sim, this.speed);
		this.decayJuice(dt);
		this.audio.setWindIntensity(this.speedNorm());
		this.hudClock += dt;
		if (this.hudClock > .08) {
			this.hudClock = 0;
			this.syncHud(false);
		}
	}
	handleInput(dt) {
		if (this.input.consumeJump()) this.player.jumpBuf = JUMP_BUFFER;
		if (this.input.consumeSlide()) this.player.slideBuf = SLIDE_BUFFER;
		this.player.jumpBuf = Math.max(0, this.player.jumpBuf - dt);
		this.player.slideBuf = Math.max(0, this.player.slideBuf - dt);
		if (this.player.jumpBuf > 0 && (this.player.grounded || this.player.coyote > 0) && !this.player.dead) this.doJump();
		if (this.player.slideBuf > 0 && this.player.grounded && !this.player.sliding && !this.player.dead) this.doSlide();
	}
	doJump() {
		const p = this.player;
		p.vy = JUMP_V;
		p.grounded = false;
		p.coyote = 0;
		p.jumpBuf = 0;
		p.sliding = false;
		p.slideT = 0;
		p.h = 64;
		p.y = Math.min(p.y, 484);
		p.jumpStretch = 1;
		p.landSquash = 0;
		this.audio.jump();
		this.burst(p.x + p.w * .4, 544, 8, "dust", 80, -40);
	}
	doSlide() {
		const p = this.player;
		p.sliding = true;
		p.slideT = SLIDE_TIME;
		p.slideBuf = 0;
		p.h = 30;
		p.y = 518;
		this.audio.slide();
		this.burst(p.x + p.w, 542, 10, "dust", 140, -20);
	}
	stepPlayer(dt) {
		const p = this.player;
		p.x = this.playerX();
		if (p.sliding) {
			p.slideT -= dt;
			if (p.slideT <= 0 && !this.input.isSlideHeld()) {
				p.sliding = false;
				p.h = 64;
				p.y = 484;
			} else if (p.slideT <= 0) p.slideT = .05;
		}
		const wasGrounded = p.grounded;
		p.vy += GRAVITY * dt;
		if (p.vy > 1550) p.vy = MAX_FALL;
		p.y += p.vy * dt;
		const floor = 548 - p.h;
		if (p.y >= floor) {
			p.y = floor;
			if (!wasGrounded && p.vy > 220) {
				p.landSquash = Math.min(1, p.vy / 1100);
				this.audio.land();
				this.burst(p.x + p.w * .5, 548, 12, "land", 90, -80);
				if (!this.reducedMotion) this.trauma = Math.min(1, this.trauma + .12);
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
			if (this.rng() > .4) this.burst(p.x + p.w, 544, 1, "dust", 90, -10);
		}
		p.runPhase += dt * (p.grounded ? 11 + this.speed * .012 : 4);
		p.landSquash = Math.max(0, p.landSquash - dt * 4.2);
		if (!p.grounded && p.vy < 0) p.jumpStretch = Math.min(1, p.jumpStretch + dt * 3);
		else p.jumpStretch = Math.max(0, p.jumpStretch - dt * 5);
		p.rot *= Math.exp(-8 * dt);
	}
	stepDeath(dt) {
		const p = this.player;
		p.deathT += dt;
		p.vy += GRAVITY * .7 * dt;
		p.y += p.vy * dt;
		p.rot += p.rv * dt;
		p.x += 40 * dt;
		this.timeScale = Math.max(.2, this.timeScale - dt * .8);
		if (p.deathT > .85) {
			this.phase = "gameover";
			this.persistHigh();
			this.syncHud(true);
		}
	}
	stepWorld(dt) {
		const t = this.distance / 2800;
		this.speed = 340 + 400 * (1 - Math.exp(-t));
		this.scroll += this.speed * dt;
		this.distance += this.speed * dt * .08;
		this.score += this.speed * dt * .12;
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
	spawnAhead() {
		if (this.phase !== "playing" || this.introT > 0) return;
		const horizon = this.scroll + this.viewW + 80;
		while (this.nextSpawn < horizon) {
			this.placePattern(this.nextSpawn);
			const react = Math.max(.55, .95 - this.spawnCount * .012);
			const gap = this.speed * react + randRange(this.rng, 70, 180);
			this.nextSpawn += gap;
			this.spawnCount += 1;
		}
	}
	placePattern(x) {
		const dens = Math.min(1, this.spawnCount / 28);
		const kinds = [
			"crate",
			"crate",
			"vent",
			"beam",
			"sign"
		];
		if (dens > .2) kinds.push("stack", "pipe");
		if (dens > .45) kinds.push("stack", "beam", "pipe");
		let kind = pick(this.rng, kinds);
		if (this.lastKind === "beam" || this.lastKind === "sign" || this.lastKind === "pipe") {
			if (kind === "beam" || kind === "sign" || kind === "pipe") kind = pick(this.rng, [
				"crate",
				"vent",
				"stack"
			]);
		}
		if (this.lastKind === "stack" && kind === "stack") kind = "crate";
		this.lastKind = kind;
		switch (kind) {
			case "crate":
				this.spawnObs("crate", x, 498, 54, 50);
				if (this.rng() > .35) this.coinArc(x + 24, 420, 3, 22);
				break;
			case "stack":
				this.spawnObs("stack", x, 456, 56, 92);
				this.coinArc(x + 26, 360, 4, 26);
				break;
			case "vent":
				this.spawnObs("vent", x, 510, 78, 38);
				if (this.rng() > .5) this.coinArc(x + 36, 438, 3, 18);
				break;
			case "beam":
				this.spawnObs("beam", x, 328, 96, 184);
				break;
			case "sign":
				this.spawnObs("sign", x, 334, 110, 178);
				break;
			case "pipe": this.spawnObs("pipe", x, 300, 28, 212);
		}
		if (dens > .55 && this.rng() > .72 && kind === "crate") this.spawnObs("beam", x + 240 + this.speed * .32, 328, 90, 184);
	}
	spawnObs(kind, x, y, w, h) {
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
	coinArc(cx, cy, n, spread) {
		for (let i = 0; i < n; i++) {
			const c = this.coins.find((it) => !it.active);
			if (!c) return;
			const t = n === 1 ? .5 : i / (n - 1);
			c.active = true;
			c.collected = false;
			c.x = cx + (t - .5) * spread * 2;
			c.y = cy - Math.sin(t * Math.PI) * 28;
			c.r = 9;
			c.phase = t * 2;
		}
	}
	collide() {
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
				const gap = Math.min(Math.abs(hb.y + hb.h - o.y), Math.abs(o.y + o.h - hb.y));
				if (hb.x + hb.w > ox - 8 && hb.x < ox + o.w + 8 && gap < 16) {
					o.nearMissed = true;
					this.addCombo(1, p.x + p.w * .5, p.y - 10);
					this.score += 18 * this.combo;
					this.audio.nearMiss();
					this.spawnFloater(p.x + 20, p.y - 24, "close", "#c4785a");
					if (!this.reducedMotion) this.flash = Math.max(this.flash, .18);
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
	hitbox() {
		const p = this.player;
		const padX = 8;
		const padY = p.sliding ? 2 : 6;
		return {
			x: p.x + padX,
			y: p.y + padY,
			w: p.w - 16,
			h: p.h - padY - 2
		};
	}
	addCombo(n, x, y) {
		this.combo += n;
		this.comboT = 2.4;
		if (this.combo > this.maxCombo) this.maxCombo = this.combo;
		if (this.combo >= 2) {
			this.audio.combo(this.combo);
			this.spawnFloater(x, y - 18, `x${this.combo}`, "#ecece6");
		}
	}
	updateCombo(dt) {
		if (this.combo <= 0) return;
		this.comboT -= dt;
		if (this.comboT <= 0) this.combo = 0;
	}
	kill(o) {
		const p = this.player;
		p.dead = true;
		p.vy = -480;
		p.rv = randRange(this.rng, 6, 10) * (this.rng() > .5 ? 1 : -1);
		p.sliding = false;
		this.phase = "dying";
		this.hitstop = this.reducedMotion ? .02 : .09;
		this.trauma = this.reducedMotion ? .2 : .85;
		this.flash = .7;
		this.timeScale = .55;
		this.audio.crash();
		this.burst(p.x + p.w * .5, p.y + p.h * .4, 28, "spark", 220, -200);
		this.burst(o.x - this.scroll + o.w * .5, o.y + o.h * .5, 14, "scrap", 160, -80);
		this.persistHigh();
		this.syncHud(true);
	}
	persistHigh() {
		const rounded = Math.floor(this.score);
		if (rounded > this.save.highScore) {
			this.save.highScore = rounded;
			this.isNewHigh = true;
			writeSave(this.save);
		}
	}
	burst(x, y, n, kind, spd, lift) {
		const colors = kind === "spark" ? [
			"#ecece6",
			"#c4785a",
			"#c8ccc4"
		] : kind === "scrap" ? [
			"#3a3b42",
			"#c4785a",
			"#8a8c92"
		] : [
			"#6a6560",
			"#8a8c92",
			"#c8ccc4"
		];
		for (let i = 0; i < n; i++) {
			const p = this.particles.find((it) => !it.active);
			if (!p) return;
			const a = randRange(this.rng, -Math.PI, 0);
			const s = randRange(this.rng, spd * .3, spd);
			p.active = true;
			p.x = x + randRange(this.rng, -6, 6);
			p.y = y;
			p.vx = Math.cos(a) * s * .4 - this.speed * .15;
			p.vy = Math.sin(a) * s + lift * this.rng();
			p.life = randRange(this.rng, .25, .7);
			p.maxLife = p.life;
			p.size = randRange(this.rng, 1.5, kind === "scrap" ? 6 : 3.5);
			p.color = pick(this.rng, colors);
			p.kind = kind;
			p.rot = this.rng() * Math.PI;
			p.spin = randRange(this.rng, -8, 8);
		}
	}
	spawnTitleDust(dt) {
		if (this.rng() > dt * 8) return;
		const p = this.particles.find((it) => !it.active);
		if (!p) return;
		p.active = true;
		p.x = randRange(this.rng, 0, this.viewW);
		p.y = randRange(this.rng, 268, 528);
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
	spawnFloater(x, y, text, color) {
		const f = this.floaters.find((it) => !it.active);
		if (!f) return;
		f.active = true;
		f.x = x;
		f.y = y;
		f.vy = -46;
		f.life = .7;
		f.maxLife = .7;
		f.text = text;
		f.color = color;
	}
	updateParticles(dt) {
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
	updateFloaters(dt) {
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
	updateScarf(dt, speed) {
		const p = this.player;
		const anchorX = p.x + 8;
		const anchorY = p.y + (p.sliding ? 10 : 18);
		let px = anchorX;
		let py = anchorY;
		const spacing = 9;
		for (let i = 0; i < p.scarf.length; i++) {
			const s = p.scarf[i];
			const targetX = px - spacing - speed * dt * .15;
			const targetY = py + Math.sin(p.runPhase * .7 + i * .6) * (p.grounded ? 2.2 : 4);
			s.x += (targetX - s.x) * (1 - Math.exp(-18 * dt));
			s.y += (targetY - s.y) * (1 - Math.exp(-14 * dt));
			px = s.x;
			py = s.y;
		}
	}
	decayJuice(dt) {
		this.trauma = Math.max(0, this.trauma - dt * 1.6);
		this.flash = Math.max(0, this.flash - dt * 2.4);
	}
	speedNorm() {
		return (this.speed - 340) / 400;
	}
	snapshot() {
		return {
			phase: this.phase,
			score: Math.floor(this.score),
			highScore: this.save.highScore,
			combo: this.combo,
			maxCombo: this.maxCombo,
			distance: Math.floor(this.distance),
			speedNorm: this.speedNorm(),
			isNewHigh: this.isNewHigh,
			muted: this.save.muted
		};
	}
	syncHud(force) {
		const snap = this.snapshot();
		const cur = useGameStore.getState();
		if (!force && cur.phase === snap.phase && cur.combo === snap.combo && cur.muted === snap.muted && Math.abs(cur.score - snap.score) < 4) return;
		useGameStore.getState().patch(snap);
	}
	draw(alpha) {
		const ctx = this.ctx;
		const w = this.cssW;
		const h = this.cssH;
		ctx.save();
		ctx.fillStyle = "#0b0c0f";
		ctx.fillRect(0, 0, w, h);
		const shake = this.reducedMotion ? 0 : this.trauma * this.trauma;
		const t = performance.now() * .001;
		const ox = shake * 14 * Math.sin(t * 47);
		const oy = shake * 10 * Math.cos(t * 41);
		const rot = shake * .012 * Math.sin(t * 29);
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
			ctx.fillStyle = `rgba(236,236,230,${this.flash * .35})`;
			ctx.fillRect(0, 0, w, h);
		}
	}
	drawSky(ctx) {
		const g = ctx.createLinearGradient(0, -this.originY - 40, 0, 548);
		g.addColorStop(0, "#121018");
		g.addColorStop(.42, "#2a2228");
		g.addColorStop(.72, "#8b5a4a");
		g.addColorStop(.88, "#c4785a");
		g.addColorStop(1, "#3a2a28");
		ctx.fillStyle = g;
		ctx.fillRect(-40, -this.originY - 80, this.viewW + 80, this.viewH + 160);
		const sunX = this.viewW * .72;
		const sunY = 338;
		const rg = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 220);
		rg.addColorStop(0, "rgba(236, 196, 160, 0.95)");
		rg.addColorStop(.18, "rgba(196, 120, 90, 0.7)");
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
	drawParallax(ctx, scroll) {
		this.drawCityLayer(ctx, scroll * .12, .35, 90, "#16141a");
		this.drawCityLayer(ctx, scroll * .28, .55, 150, "#101014");
		this.drawCityLayer(ctx, scroll * .5, .78, 230, "#0c0c10");
	}
	drawCityLayer(ctx, scroll, alpha, maxH, color) {
		const tile = 140;
		const start = Math.floor(scroll / tile) - 1;
		const end = start + Math.ceil(this.viewW / tile) + 3;
		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.fillStyle = color;
		for (let i = start; i <= end; i++) {
			const rng = mulberry32(i * 374761 ^ Math.floor(maxH) * 13);
			const x = i * tile - scroll % tile - tile;
			const count = 2 + Math.floor(rng() * 3);
			let cx = x;
			for (let b = 0; b < count; b++) {
				const bw = 28 + rng() * 46;
				const bh = 40 + rng() * maxH;
				const by = 548 - bh - 8;
				roundRect(ctx, cx, by, bw, bh + 12, 2);
				ctx.fill();
				if (maxH > 160 && rng() > .45) {
					ctx.fillStyle = `rgba(236, 196, 160, ${.08 + rng() * .18})`;
					const cols = 2 + Math.floor(rng() * 3);
					const rows = 3 + Math.floor(rng() * 5);
					for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (rng() > .35) ctx.fillRect(cx + 6 + c * 8, by + 10 + r * 12, 4, 6);
					ctx.fillStyle = color;
				}
				if (rng() > .7) ctx.fillRect(cx + bw * .45, by - 16, 3, 16);
				cx += bw + 8 + rng() * 18;
			}
		}
		ctx.restore();
	}
	drawGround(ctx, scroll) {
		const y = 548;
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
			const rng = mulberry32(i * 7919 ^ 17);
			const x = i * tile - scroll % tile;
			ctx.strokeStyle = "rgba(236,236,230,0.04)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x, 628);
			ctx.stroke();
			if (rng() > .72) {
				ctx.fillStyle = "#1a1b22";
				ctx.fillRect(x + 12, 538, 22, 10);
			}
			if (rng() > .82) {
				ctx.fillStyle = "#8a8c92";
				ctx.globalAlpha = .25;
				ctx.fillRect(x + 40, 556, 18, 4);
				ctx.globalAlpha = 1;
			}
		}
		ctx.fillStyle = "rgba(0,0,0,0.35)";
		ctx.fillRect(-40, 566, this.viewW + 80, 90);
	}
	drawObstacles(ctx, scroll) {
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
				case "pipe": this.drawPipe(ctx, x, o.y, o.w, o.h);
			}
		}
	}
	drawCrate(ctx, x, y, w, h) {
		ctx.fillStyle = "rgba(0,0,0,0.28)";
		ctx.beginPath();
		ctx.ellipse(x + w / 2, 552, w * .42, 5, 0, 0, Math.PI * 2);
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
			ctx.moveTo(x + 4, y + h * .48);
			ctx.lineTo(x + w - 4, y + h * .48);
			ctx.stroke();
		}
	}
	drawVent(ctx, x, y, w, h) {
		ctx.fillStyle = "rgba(0,0,0,0.25)";
		ctx.fillRect(x + 4, 548, w - 8, 5);
		ctx.fillStyle = "#2a2d34";
		roundRect(ctx, x, y, w, h, 3);
		ctx.fill();
		ctx.fillStyle = "#1a1c22";
		for (let i = 0; i < 4; i++) ctx.fillRect(x + 8 + i * 16, y + 8, 10, h - 14);
		ctx.fillStyle = "#c4785a";
		ctx.globalAlpha = .5;
		ctx.fillRect(x + w - 10, y + 6, 4, 4);
		ctx.globalAlpha = 1;
	}
	drawBeam(ctx, x, y, w, h, sign) {
		ctx.fillStyle = "#1a1b20";
		ctx.fillRect(x + w * .5 - 4, -this.originY - 20, 8, y + 24 + this.originY);
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
	drawPipe(ctx, x, y, w, h) {
		ctx.fillStyle = "#1a1b20";
		ctx.fillRect(x + w * .5 - 3, -this.originY - 20, 6, y + this.originY + 8);
		const g = ctx.createLinearGradient(x, y, x + w, y);
		g.addColorStop(0, "#3a3d46");
		g.addColorStop(.5, "#8a8c92");
		g.addColorStop(1, "#2a2c32");
		ctx.fillStyle = g;
		roundRect(ctx, x, y, w, h, w / 2);
		ctx.fill();
		ctx.fillStyle = "#1c1d22";
		ctx.fillRect(x - 4, y + h - 14, w + 8, 10);
	}
	drawCoins(ctx, scroll) {
		for (const c of this.coins) {
			if (!c.active) continue;
			const x = c.x - scroll;
			const bob = Math.sin(c.phase) * 3;
			ctx.save();
			ctx.translate(x, c.y + bob);
			ctx.rotate(c.phase * .4);
			ctx.fillStyle = "rgba(236, 196, 160, 0.25)";
			ctx.beginPath();
			ctx.arc(0, 0, c.r + 5, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#ecece6";
			ctx.beginPath();
			ctx.ellipse(0, 0, c.r, c.r * .72, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#c4785a";
			ctx.beginPath();
			ctx.ellipse(0, 0, c.r * .45, c.r * .32, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}
	drawPlayer(ctx, _alpha) {
		const p = this.player;
		const squash = 1 - p.landSquash * .28 + p.jumpStretch * .16;
		const stretch = 1 + p.landSquash * .22 - p.jumpStretch * .12;
		const bob = p.grounded && !p.sliding ? Math.sin(p.runPhase) * 2.2 : 0;
		ctx.fillStyle = "rgba(0,0,0,0.32)";
		ctx.beginPath();
		ctx.ellipse(p.x + p.w * .5, 553, 18 * stretch, 5, 0, 0, Math.PI * 2);
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
		ctx.scale(stretch * (p.sliding ? 1.28 : 1), squash * (p.sliding ? .52 : 1));
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
	drawParticles(ctx) {
		for (const p of this.particles) {
			if (!p.active) continue;
			const a = Math.max(0, p.life / p.maxLife);
			ctx.save();
			ctx.globalAlpha = a;
			ctx.translate(p.x, p.y);
			ctx.rotate(p.rot);
			ctx.fillStyle = p.color;
			if (p.kind === "scrap") ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .6);
			else {
				ctx.beginPath();
				ctx.arc(0, 0, p.size, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();
		}
	}
	drawFloaters(ctx) {
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
	drawHorizonDust(ctx, scroll) {
		ctx.save();
		ctx.globalAlpha = .08;
		ctx.fillStyle = "#ecece6";
		const n = 18;
		for (let i = 0; i < n; i++) {
			const rng = mulberry32(9e3 + i);
			const x = (rng() * this.viewW * 2 - (scroll * .4 + i * 40)) % (this.viewW + 80) - 40;
			const y = 508 - rng() * 200;
			ctx.beginPath();
			ctx.arc(x, y, 1 + rng() * 1.4, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}
};
function aabb(ax, ay, aw, ah, bx, by, bw, bh) {
	return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function roundRect(ctx, x, y, w, h, r) {
	const rr = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + rr, y);
	ctx.arcTo(x + w, y, x + w, y + h, rr);
	ctx.arcTo(x + w, y + h, x, y + h, rr);
	ctx.arcTo(x, y + h, x, y, rr);
	ctx.arcTo(x, y, x + w, y, rr);
	ctx.closePath();
}
function GameApp() {
	const canvasRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const game = new DusklineGame(canvas, { reducedMotion });
		gameRef.current = game;
		game.start();
		return () => {
			game.destroy();
			gameRef.current = null;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-ink text-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "absolute inset-0 h-full w-full touch-none select-none",
			onContextMenu: (e) => e.preventDefault()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlays, {
			onPlay: () => gameRef.current?.play(),
			onMute: () => gameRef.current?.toggleMute()
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { Home as component };
