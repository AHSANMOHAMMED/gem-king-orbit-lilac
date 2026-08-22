export type Phase = "title" | "playing" | "dying" | "gameover";

export type ObstacleKind = "crate" | "stack" | "vent" | "beam" | "sign" | "pipe";

export interface Obstacle {
  active: boolean;
  kind: ObstacleKind;
  x: number;
  y: number;
  w: number;
  h: number;
  cleared: boolean;
  nearMissed: boolean;
}

export interface Coin {
  active: boolean;
  x: number;
  y: number;
  r: number;
  collected: boolean;
  phase: number;
}

export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  kind: "dust" | "spark" | "scrap" | "land" | "wind";
  rot: number;
  spin: number;
}

export interface Floater {
  active: boolean;
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  text: string;
  color: string;
}

export interface HudSnapshot {
  phase: Phase;
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  distance: number;
  speedNorm: number;
  isNewHigh: boolean;
  muted: boolean;
}

export const WORLD_H = 720;
export const GROUND_Y = 548;
export const PLAYER_W = 48;
export const PLAYER_H = 64;
export const PLAYER_SLIDE_H = 30;
export const GRAVITY = 2650;
export const JUMP_V = -920;
export const JUMP_CUT = 0.42;
export const MAX_FALL = 1550;
export const SLIDE_TIME = 0.46;
export const COYOTE = 0.09;
export const JUMP_BUFFER = 0.13;
export const SLIDE_BUFFER = 0.12;
export const SPEED_START = 340;
export const SPEED_MAX = 740;
export const STEP = 1 / 60;
export const SAVE_KEY = "duskline-save";
export const SAVE_VERSION = 1;
