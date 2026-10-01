import confetti from 'canvas-confetti';

export function fireConfetti(originX = 0.5, originY = 0.6) {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'],
      ticks: 200,
      gravity: 0.9,
      scalar: 1.1,
    });
  } catch {
    // Graceful fallback if canvas is restricted
  }
}

export function fireBigConfetti() {
  try {
    const end = Date.now() + 1000;
    const colors = ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Graceful fallback
  }
}
