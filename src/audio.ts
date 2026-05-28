/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a powerful racing engine sound with pitch acceleration (Vruuum!)
  playEngineRev() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Create primary oscillators for engine rumble
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      // Configure oscillator waveforms (sawtooth creates rich engine harmonics)
      osc1.type = "sawtooth";
      osc2.type = "sawtooth";

      // Configure filter for deep muffler sound
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.3); // Accelerate
      filter.frequency.exponentialRampToValueAtTime(450, now + 1.2); // Settle down
      filter.Q.value = 4;

      // Base engine frequencies (Isac's 2nd birthday, let's start low)
      osc1.frequency.setValueAtTime(60, now);
      osc1.frequency.exponentialRampToValueAtTime(320, now + 0.3);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 1.2);

      osc2.frequency.setValueAtTime(60.5, now); // Slightly detuned for chorusing
      osc2.frequency.exponentialRampToValueAtTime(325, now + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(80.5, now + 1.2);

      // Volume envelope (Revv up and down)
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.35, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      // Connect nodes
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Add a tiny bit of sound synthesis noise for exhaust crackles
      const bufferSize = ctx.sampleRate * 1.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 300;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.012, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // Start all synthesizers
      osc1.start(now);
      osc2.start(now);
      noise.start(now);

      osc1.stop(now + 1.4);
      osc2.stop(now + 1.4);
      noise.stop(now + 1.4);
    } catch (e) {
      console.warn("Audio Context blocked, waiting for user click", e);
    }
  }

  // Play retro cute "honk honk!" horn sound (For Mate/Mater)
  playHonk() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const honkSound = (timeOffset: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Mate's old truck horn is metallic and slightly detuned
        osc.type = "triangle";
        osc.frequency.setValueAtTime(260, now + timeOffset);
        osc.frequency.setValueAtTime(270, now + timeOffset + 0.05);

        gainNode.gain.setValueAtTime(0, now + timeOffset);
        gainNode.gain.linearRampToValueAtTime(0.2, now + timeOffset + 0.02);
        gainNode.gain.linearRampToValueAtTime(0.2, now + timeOffset + 0.18);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.22);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.25);
      };

      // Honk twice!
      honkSound(0);
      honkSound(0.28);
    } catch (e) {
      console.warn("Audio Context blocked", e);
    }
  }

  // Play race start light beep sequence
  playStarterBeep(highPitch: boolean) {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = highPitch ? 1200 : 640;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + (highPitch ? 0.45 : 0.22));

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn("Audio context not ready", e);
    }
  }

  // Play success sound (victory rally)
  playSuccessFanfare() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      
      const freqs = [330, 392, 523, 659, 784]; // Arpeggio major chord
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.value = freq;
        
        const startTime = now + (idx * 0.1);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export const carsAudio = new AudioSynthesizer();
