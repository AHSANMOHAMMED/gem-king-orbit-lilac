export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private music: GainNode | null = null;
  private wind: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;
  private unlocked = false;
  muted = false;

  unlock() {
    if (this.unlocked && this.ctx?.state === "running") return;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC({ latencyHint: "interactive" });
      this.master = this.ctx.createGain();
      this.sfx = this.ctx.createGain();
      this.music = this.ctx.createGain();
      this.sfx.gain.value = 0.7;
      this.music.gain.value = 0.22;
      this.master.gain.value = this.muted ? 0 : 0.85;
      this.sfx.connect(this.master);
      this.music.connect(this.master);
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    this.unlocked = true;
    this.startWind();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.85, this.ctx.currentTime, 0.03);
    }
  }

  resume() {
    if (this.ctx?.state === "suspended") void this.ctx.resume();
  }

  private startWind() {
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
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 0.18;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.music);
    src.start();
    this.wind = src;
    this.windGain = gain;
  }

  setWindIntensity(t: number) {
    if (!this.windGain || !this.ctx) return;
    const v = 0.12 + t * 0.22;
    this.windGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.2);
  }

  jump() {
    this.blip(180, 420, 0.09, 0.12, "triangle");
    this.noise(0.06, 0.08, 900, 0.4);
  }

  land() {
    this.blip(140, 70, 0.08, 0.18, "sine");
    this.noise(0.08, 0.14, 280, 0.7);
  }

  slide() {
    this.noise(0.16, 0.1, 700, 0.35);
  }

  coin() {
    this.blip(880, 1320, 0.07, 0.08, "sine");
    this.blip(1320, 1760, 0.05, 0.05, "sine", 0.04);
  }

  combo(n: number) {
    const f = 520 + Math.min(n, 12) * 40;
    this.blip(f, f * 1.5, 0.08, 0.09, "triangle");
  }

  nearMiss() {
    this.blip(1400, 1900, 0.04, 0.05, "square");
  }

  crash() {
    this.noise(0.28, 0.35, 220, 1.2);
    this.blip(180, 40, 0.22, 0.28, "sawtooth");
  }

  ui() {
    this.blip(520, 640, 0.05, 0.06, "sine");
  }

  private blip(
    f0: number,
    f1: number,
    dur: number,
    vol: number,
    type: OscillatorType,
    delay = 0,
  ) {
    if (!this.ctx || !this.sfx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.sfx);
    osc.start(t);
    osc.stop(t + dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
    };
  }

  private noise(dur: number, vol: number, freq: number, q: number) {
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
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.sfx);
    src.start();
    src.stop(t + dur + 0.02);
    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      g.disconnect();
    };
  }

  destroy() {
    try {
      this.wind?.stop();
    } catch {
      /* already stopped */
    }
    this.wind = null;
    void this.ctx?.close();
    this.ctx = null;
  }
}
