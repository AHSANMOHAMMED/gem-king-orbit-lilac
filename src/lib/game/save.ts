import { SAVE_KEY, SAVE_VERSION } from "./types";

export interface SaveData {
  version: number;
  highScore: number;
  muted: boolean;
}

const defaults: SaveData = {
  version: SAVE_VERSION,
  highScore: 0,
  muted: false,
};

function migrate(raw: Partial<SaveData> & { version?: number }): SaveData {
  const s: SaveData = { ...defaults, ...raw, version: raw.version ?? 0 };
  if (s.version < 1) s.version = 1;
  if (!Number.isFinite(s.highScore) || s.highScore < 0) s.highScore = 0;
  s.muted = Boolean(s.muted);
  s.version = SAVE_VERSION;
  return s;
}

export function loadSave(): SaveData {
  if (typeof window === "undefined") return { ...defaults };
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return migrate(parsed);
  } catch {
    return { ...defaults };
  }
}

export function writeSave(data: SaveData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({ ...data, version: SAVE_VERSION }));
  } catch {
    // private mode / quota — keep playing in memory
  }
}
