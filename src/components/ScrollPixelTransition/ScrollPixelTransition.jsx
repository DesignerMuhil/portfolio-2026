
import { useCallback, useEffect, useRef } from "react";
import "./ScrollPixelTransition.css";

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const smooth = (t) => t * t * (3 - 2 * t);

function hash(x, y) {
  let h =
    Math.imul(x + 1, 0x27d4eb2d) ^
    Math.imul(y + 1, 0x165667b1);

  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);

  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export default function ScrollPixelTransition({
  progress = 0,
  gridSize = 110,
  randomness = 0.18,
  pixelColor = "#101010",
}) {
  const canvasRef = useRef(null);
  const drawRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (
      canvas.width !== Math.round(width * dpr) ||
      canvas.height !== Math.round(height * dpr)
    ) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const p = clamp(progress);

    // No pixel calculations are needed outside the transition.
    if (p <= 0 || p >= 1) return;

    const cols = Math.max(1, Math.floor(gridSize));
    const cell = width / cols;
    const rows = Math.ceil(height / cell);

    const covering = p < 0.5;
    const local = covering ? p * 2 : (p - 0.5) * 2;
    const randomnessAmount = clamp(randomness);
    const windowSize = 0.24;

    context.fillStyle = pixelColor;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const noise = hash(col, row);
        const directional = 1 - (col + 0.5) / cols;

        const delay = clamp(
          directional * (1 - randomnessAmount) +
            noise * randomnessAmount
        );

        const t = smooth(
          clamp(
            (local - delay * (1 - windowSize)) / windowSize
          )
        );

        const amount = covering ? t : 1 - t;

        if (amount <= 0.002) continue;

        context.globalAlpha = amount;

        const x = col * cell;
        const y = row * cell;

        context.fillRect(
          Math.round(x),
          Math.round(y),
          Math.ceil(x + cell) - Math.round(x),
          Math.ceil(y + cell) - Math.round(y)
        );
      }
    }

    context.globalAlpha = 1;
  }, [progress, gridSize, randomness, pixelColor]);

  // Redraw only when transition inputs change.
  useEffect(() => {
    drawRef.current = draw;
    draw();
  }, [draw]);

  // Redraw when the canvas dimensions change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      drawRef.current?.();
    });

    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="scroll-pixel-transition"
      aria-hidden="true"
    />
  );
}
