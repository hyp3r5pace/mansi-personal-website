"use client";

import { useEffect, useRef } from "react";

/**
 * Needle-and-thread cursor trail. A short marigold filament follows the
 * pointer with eased lag; a small "needle" dot leads the line. Renders
 * to a single canvas pinned to the viewport so it doesn't affect layout
 * or block pointer events.
 *
 * Disabled on coarse pointers (touch) and when the user prefers reduced
 * motion. The effect is purely decorative — no information lives in it.
 */
const TRAIL_LENGTH = 16;
const FOLLOW = 0.22;

export function CursorThread() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Trail buffer: index 0 is the needle, rest is the silk thread.
    const points: { x: number; y: number }[] = Array.from(
      { length: TRAIL_LENGTH },
      () => ({ x: width / 2, y: height / 2 }),
    );
    let mouseX = width / 2;
    let mouseY = height / 2;
    let active = false;
    let raf = 0;

    function onMove(e: PointerEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      active = true;
    }
    function onLeave() {
      active = false;
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Move the needle toward the cursor with easing
      const head = points[0]!;
      head.x += (mouseX - head.x) * FOLLOW;
      head.y += (mouseY - head.y) * FOLLOW;

      // Each successive bead follows the one before it (chain)
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]!;
        const cur = points[i]!;
        cur.x += (prev.x - cur.x) * 0.35;
        cur.y += (prev.y - cur.y) * 0.35;
      }

      if (active) {
        // Silk thread — fading marigold polyline
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1]!;
          const b = points[i]!;
          const t = 1 - i / points.length;
          ctx.strokeStyle = `rgba(201, 122, 26, ${t * 0.55})`;
          ctx.lineWidth = 1 + t * 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        // Needle — small indigo bead at the head
        ctx.fillStyle = "rgba(31, 42, 86, 0.85)";
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(frame);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-10 hidden md:block"
    />
  );
}
