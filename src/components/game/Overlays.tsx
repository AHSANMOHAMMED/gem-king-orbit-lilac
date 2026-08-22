import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/game/store";
import { cn } from "@/lib/utils";

interface OverlaysProps {
  onPlay: () => void;
  onMute: () => void;
}

export function Overlays({ onPlay, onMute }: OverlaysProps) {
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

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      <header className="relative z-20 flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
        {playing ? (
          <div className="min-w-0">
            <p className="font-display text-2xl font-semibold tabular-nums leading-none tracking-tight text-paper sm:text-3xl">
              {score.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted">Best {highScore.toLocaleString()}</p>
          </div>
        ) : (
          <div />
        )}

        {playing && combo >= 2 ? (
          <div className="flex flex-col items-center">
            <p className="font-display text-xl font-semibold tabular-nums tracking-tight text-paper">
              x{combo}
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted">combo</p>
          </div>
        ) : (
          <div />
        )}

        <Button
          type="button"
          variant="icon"
          size="icon"
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={onMute}
          className="pointer-events-auto"
        >
          <span className="relative size-5">
            <Volume2
              className={cn(
                "absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)]",
                muted ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
              )}
            />
            <VolumeX
              className={cn(
                "absolute inset-0 size-5 transition-[opacity,transform,filter] duration-[var(--motion-fast)]",
                muted ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
              )}
            />
          </span>
        </Button>
      </header>

      {playing ? (
        <div className="mt-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <div className="mx-auto h-1 max-w-xs overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-dusk transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-out)]"
              style={{ width: `${Math.round(speedNorm * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-faint">
            Pace
          </p>
        </div>
      ) : null}

      {phase === "title" ? (
        <TitleScreen highScore={highScore} onPlay={onPlay} />
      ) : null}

      {phase === "gameover" ? (
        <GameOverScreen
          score={score}
          highScore={highScore}
          maxCombo={maxCombo}
          distance={distance}
          isNewHigh={isNewHigh}
          onPlay={onPlay}
        />
      ) : null}
    </div>
  );
}

function TitleScreen({ highScore, onPlay }: { highScore: number; onPlay: () => void }) {
  return (
    <div
      className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink/35 px-6"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        onPlay();
      }}
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <p className="stagger-in text-[11px] uppercase tracking-[0.28em] text-muted">
          Rooftop courier
        </p>
        <h1 className="stagger-in font-display mt-3 text-5xl font-semibold leading-none tracking-[-0.04em] text-paper text-balance sm:text-7xl">
          Duskline
        </h1>
        <p className="stagger-in mt-4 max-w-xs text-sm leading-relaxed text-muted text-pretty">
          Keep the line. Jump the crates. Slide the beams. The city only gets faster.
        </p>
        {highScore > 0 ? (
          <p className="stagger-in mt-5 font-display text-sm tabular-nums text-paper">
            Best {highScore.toLocaleString()}
          </p>
        ) : null}
        <Button type="button" className="stagger-in mt-8 min-w-44" onClick={onPlay}>
          Run
        </Button>
        <dl className="stagger-in mt-10 grid grid-cols-2 gap-x-8 gap-y-2 text-left text-xs text-muted">
          <dt className="text-faint">Jump</dt>
          <dd>Tap · Space</dd>
          <dt className="text-faint">Slide</dt>
          <dd>Swipe down · S</dd>
        </dl>
      </div>
    </div>
  );
}

function GameOverScreen({
  score,
  highScore,
  maxCombo,
  distance,
  isNewHigh,
  onPlay,
}: {
  score: number;
  highScore: number;
  maxCombo: number;
  distance: number;
  isNewHigh: boolean;
  onPlay: () => void;
}) {
  return (
    <div
      className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink/55 px-6"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        onPlay();
      }}
    >
      <div className="w-full max-w-sm rounded-[40px] border border-line bg-elevated/90 p-6 text-center sm:rounded-[48px] sm:p-8">
        <p className="stagger-in text-[11px] uppercase tracking-[0.28em] text-muted">
          Line broken
        </p>
        <p className="stagger-in font-display mt-3 text-5xl font-semibold tabular-nums tracking-tight text-paper">
          {score.toLocaleString()}
        </p>
        {isNewHigh ? (
          <p className="stagger-in mt-2 text-xs uppercase tracking-[0.18em] text-dusk">
            New record
          </p>
        ) : (
          <p className="stagger-in mt-2 text-xs text-muted">Best {highScore.toLocaleString()}</p>
        )}
        <div className="stagger-in mt-6 grid grid-cols-2 gap-3">
          <Stat label="Distance" value={`${distance} m`} />
          <Stat label="Combo" value={`x${maxCombo}`} />
        </div>
        <Button type="button" className="stagger-in mt-8 w-full" onClick={onPlay}>
          Again
        </Button>
        <p className="stagger-in mt-3 text-[11px] text-faint">Enter or tap</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-panel px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-1 font-display text-lg tabular-nums text-paper">{value}</p>
    </div>
  );
}
