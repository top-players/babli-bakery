/* Web Audio API Synthesizer for Order Alert Chime */

export function playOrderAlertChime() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Ensure context is running (browsers block un-muted audio before user interaction)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Helper for single note chime
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Envelope: fast attack, smooth decay
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.6, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // 3-Tone Bakery Bell: G5 -> C6 -> E6 (Happy Attention Chime)
    playNote(783.99, now, 0.4);        // G5
    playNote(1046.50, now + 0.18, 0.4); // C6
    playNote(1318.51, now + 0.36, 0.7); // E6

  } catch (err) {
    console.warn("Web Audio Chime failed:", err);
  }
}
