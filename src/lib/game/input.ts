const GAME_CODES = new Set([
  "Space",
  "ArrowUp",
  "ArrowDown",
  "KeyW",
  "KeyS",
  "KeyZ",
  "KeyX",
  "Enter",
  "KeyP",
  "KeyM",
]);

export class GameInput {
  private keys = new Set<string>();
  private jumpQueued = false;
  private slideQueued = false;
  private startQueued = false;
  private muteQueued = false;
  private pointerId: number | null = null;
  private pointerStartY = 0;
  private pointerStartX = 0;
  private pointerDidSlide = false;
  private swipeThreshold = 36;
  private canvas: HTMLCanvasElement;
  private unbind: Array<() => void> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.bind();
  }

  private bind() {
    const onKeyDown = (e: KeyboardEvent) => {
      if (GAME_CODES.has(e.code)) e.preventDefault();
      if (e.repeat) return;
      this.keys.add(e.code);
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW" || e.code === "KeyZ") {
        this.jumpQueued = true;
        this.startQueued = true;
      }
      if (e.code === "ArrowDown" || e.code === "KeyS" || e.code === "KeyX") {
        this.slideQueued = true;
      }
      if (e.code === "Enter") this.startQueued = true;
      if (e.code === "KeyM") this.muteQueued = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    };
    const clearKeys = () => this.keys.clear();

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-ui]")) return;
      this.canvas.setPointerCapture(e.pointerId);
      this.pointerId = e.pointerId;
      this.pointerStartY = e.clientY;
      this.pointerStartX = e.clientX;
      this.pointerDidSlide = false;
      this.startQueued = true;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (this.pointerId !== e.pointerId) return;
      const dy = e.clientY - this.pointerStartY;
      const dx = e.clientX - this.pointerStartX;
      if (!this.pointerDidSlide && dy > this.swipeThreshold && dy > Math.abs(dx) * 0.7) {
        this.pointerDidSlide = true;
        this.slideQueued = true;
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      if (this.pointerId !== e.pointerId) return;
      const dy = e.clientY - this.pointerStartY;
      const dx = e.clientX - this.pointerStartX;
      if (!this.pointerDidSlide && dy < this.swipeThreshold && Math.abs(dx) < this.swipeThreshold * 1.6) {
        this.jumpQueued = true;
      }
      if (!this.pointerDidSlide && dy < -this.swipeThreshold) {
        this.jumpQueued = true;
      }
      this.pointerId = null;
    };
    const onPointerCancel = (e: PointerEvent) => {
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
      () => this.canvas.removeEventListener("pointercancel", onPointerCancel),
    ];
  }

  consumeJump(): boolean {
    if (!this.jumpQueued) return false;
    this.jumpQueued = false;
    return true;
  }

  consumeSlide(): boolean {
    if (!this.slideQueued) return false;
    this.slideQueued = false;
    return true;
  }

  consumeStart(): boolean {
    if (!this.startQueued) return false;
    this.startQueued = false;
    return true;
  }

  consumeMute(): boolean {
    if (!this.muteQueued) return false;
    this.muteQueued = false;
    return true;
  }

  isSlideHeld(): boolean {
    return this.keys.has("ArrowDown") || this.keys.has("KeyS") || this.keys.has("KeyX");
  }

  destroy() {
    for (const fn of this.unbind) fn();
    this.unbind = [];
  }
}
