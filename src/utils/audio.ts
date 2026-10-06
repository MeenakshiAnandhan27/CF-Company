/**
 * Realistic Web Audio API synthesiser for physical book page-turn sound.
 * Zero external audio files, works offline, zero latency.
 */
class FlipbookAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check if muted preference exists in localStorage
    try {
      const saved = localStorage.getItem('cf_flipbook_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      // Ignore
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('cf_flipbook_muted', String(muted));
    } catch {
      // Ignore
    }
  }

  public toggleMuted(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playPageTurn() {
    if (this.isMuted) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return;

      if (!this.ctx) {
        this.ctx = new AudioContextClass();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const ctx = this.ctx;
      const duration = 0.16; // 160ms soft paper turn
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const channelData = buffer.getChannelData(0);

      // Synthesize soft parchment paper friction
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Soft pinkish curve for paper rustle
        const progress = i / bufferSize;
        const envelope = Math.sin(progress * Math.PI);
        // Low-pass filtered noise
        lastVal = (lastVal + 0.08 * white) / 1.08;
        channelData[i] = lastVal * envelope * 2.2;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Bandpass filter centered around 1400Hz for crisp book page rustle
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(1.4, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
    } catch {
      // Audio context might fail on blocked permissions; fail silently
    }
  }
}

export const flipbookAudio = new FlipbookAudioSynthesizer();
