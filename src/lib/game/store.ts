import { create } from "zustand";
import type { HudSnapshot, Phase } from "./types";

interface GameStore extends HudSnapshot {
  patch: (partial: Partial<HudSnapshot>) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  phase: "title" as Phase,
  score: 0,
  highScore: 0,
  combo: 0,
  maxCombo: 0,
  distance: 0,
  speedNorm: 0,
  isNewHigh: false,
  muted: false,
  patch: (partial) => set(partial),
}));
