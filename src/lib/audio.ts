export class SoundManager {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;
  
    constructor() {
      // Initialize on user interaction usually, but we'll try straight away
      // or lazy load on first play
    }
  
    private getContext() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      return this.ctx;
    }
  
    // Small "pop" for picking up an item - High pitch, very short
    playPop() {
      if (!this.enabled) return;
      try {
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
  
        // SINE wave = smooth "bloop"
        osc.type = 'sine';
        // Pitch up slightly
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
  
        // Quick envelope
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {
        console.warn('Audio play failed', e);
      }
    }
  
    // Click/Snap sound for dropping or connecting - Sharp, percussive, wooden/plastic feel
    playSnap() {
      if (!this.enabled) return;
      try {
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
  
        // TRIANGLE has some harmonics, good for "body"
        osc.type = 'triangle';
        // Quick pitch drop = "hit"
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);
  
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch (e) {
        console.warn('Audio play failed', e);
      }
    }
  
    // Pleasant "Success" chord - Bright, major, lingering
    playSuccess() {
      if (!this.enabled) return;
      try {
        const ctx = this.getContext();
        const now = ctx.currentTime;
  
        // Bb Major 7 (Bb, D, F, A) - dreamy
        const notes = [466.16, 587.33, 698.46, 880.00]; 
        
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
  
          osc.type = 'sine';
          osc.frequency.value = freq;
  
          // Stagger starts heavily for "shimmer" effect
          const start = now + i * 0.06;
          const end = start + 0.8;
  
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.08, start + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, end);
  
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(end);
        });
      } catch (e) {
        console.warn('Audio play failed', e);
      }
    }
  
    // Dull "Failure" thud - Low, flat, short
    playFailure() {
      if (!this.enabled) return;
      try {
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
  
        // SAWTOOTH filtered? Or just Square. Square is "buzzy".
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.15);
  
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  
        // Simple low pass filter to make it a "thud" not a "buzz"
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (e) {
        console.warn('Audio play failed', e);
      }
    }
  
    toggle(state: boolean) {
      this.enabled = state;
    }
  }
  
  export const soundManager = new SoundManager();
