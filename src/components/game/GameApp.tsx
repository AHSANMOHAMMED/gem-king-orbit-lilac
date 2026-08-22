import { useEffect, useRef } from "react";
import { Overlays } from "@/components/game/Overlays";
import { DusklineGame } from "@/lib/game/engine";

export function GameApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<DusklineGame | null>(null);

  useEffect(() => {
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

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-ink text-paper">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none select-none"
        onContextMenu={(e) => e.preventDefault()}
      />
      <Overlays
        onPlay={() => gameRef.current?.play()}
        onMute={() => gameRef.current?.toggleMute()}
      />
    </main>
  );
}
