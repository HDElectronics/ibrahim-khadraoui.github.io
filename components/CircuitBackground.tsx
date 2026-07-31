'use client';

import { useEffect, useRef } from 'react';

import styles from '@/styles/CircuitBackground.module.css';

const COLUMN = 720;      // content column width, matches --maxw
const MIN_VIEWPORT = 1100;
const GUTTER_PAD = 32;   // keep traces clear of the column edge
const GLOW_RADIUS = 200;
const IDLE_EPSILON = 0.002;

// Real-PCB routing vocabulary: parallel bus bundles on a fixed grid,
// shared 45° jogs with staggered corners, vias at the breakouts.
const PITCH = 8;         // spacing between traces within a bus
const BUS_GAP = 24;      // gap between adjacent bus bundles
const EDGE = 12;         // clearance from viewport edges
const MIN_JOG_GAP = 90;  // vertical distance between two jogs of one bus

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  via: boolean;
}

const snap = (v: number) => Math.round(v / PITCH) * PITCH;

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const rgba = ([r, g, b]: [number, number, number], a: number) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;

function buildTraces(width: number, height: number): Segment[] {
  const segments: Segment[] = [];
  const gutterWidth = (width - COLUMN) / 2 - GUTTER_PAD;
  if (gutterWidth < 80) return segments;

  const pushVia = (x: number, y: number) => {
    segments.push({ x1: x, y1: y, x2: x, y2: y, via: true });
  };

  for (const side of ['left', 'right'] as const) {
    // Gutter coordinates: 0 at the outer viewport edge, growing inward.
    const toScreen = (x: number) => (side === 'left' ? x : width - x);

    let cursor = snap(EDGE + PITCH);
    while (cursor + PITCH * 2 < gutterWidth) {
      const laneCount = 2 + Math.floor(Math.random() * 4); // 2–5 traces per bus
      const busWidth = (laneCount - 1) * PITCH;
      if (cursor + busWidth >= gutterWidth) break;

      // One shared route per bundle: vertical runs joined by 45° jogs at
      // well-separated heights, like a routed bus changing channels.
      const jogYs = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () =>
        snap(EDGE * 4 + Math.random() * (height - EDGE * 10))
      )
        .sort((a, b) => a - b)
        .filter((y, i, arr) => i === 0 || y - arr[i - 1] >= MIN_JOG_GAP);

      const route: { y: number; dx: number }[] = [];
      let busX = cursor;
      for (const jogY of jogYs) {
        const roomIn = gutterWidth - busWidth - busX - PITCH;
        const roomOut = busX - EDGE;
        const inward = Math.random() < 0.5;
        const room = inward ? roomIn : roomOut;
        const dx = Math.min(snap(24 + Math.random() * 56), snap(room));
        if (dx < PITCH * 2) continue;
        route.push({ y: jogY, dx: inward ? dx : -dx });
        busX += inward ? dx : -dx;
      }

      for (let lane = 0; lane < laneCount; lane++) {
        let gx = cursor + lane * PITCH;
        let y = EDGE;
        let x = toScreen(gx);
        pushVia(x, y);

        for (const { y: jogY, dx } of route) {
          // Stagger the bend per lane so the bundle keeps its spacing
          // through the corner — the classic parallel-trace look.
          const bendY = jogY + lane * PITCH;
          if (bendY > height - EDGE * 4) break;

          segments.push({ x1: x, y1: y, x2: x, y2: bendY, via: false });
          const nx = toScreen(gx + dx);
          const ny = bendY + Math.abs(dx); // 45°: dy equals |dx|
          segments.push({ x1: x, y1: bendY, x2: nx, y2: ny, via: false });
          gx += dx;
          x = nx;
          y = ny;
        }

        const endY = height - EDGE;
        if (y < endY) {
          segments.push({ x1: x, y1: y, x2: x, y2: endY, via: false });
        }
        pushVia(x, endY);
      }

      cursor = snap(cursor + busWidth + BUS_GAP + Math.random() * PITCH * 2);
    }
  }

  return segments;
}

const CircuitBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const viewportQuery = window.matchMedia(`(min-width: ${MIN_VIEWPORT}px)`);

    let segments: Segment[] = [];
    let frame = 0;
    let resizeFrame = 0;
    let running = false;
    let active = false;
    const pointer = { x: -9999, y: -9999, inside: false };
    const light = { x: 0, y: 0, intensity: 0 };
    const colours = {
      base: '#23272e',
      accent: [76, 201, 240] as [number, number, number],
      core: [255, 255, 255] as [number, number, number],
      dark: true,
    };

    const readColours = () => {
      const style = getComputedStyle(document.documentElement);
      colours.base = style.getPropertyValue('--border').trim() || colours.base;
      colours.accent = hexToRgb(style.getPropertyValue('--accent').trim() || '#4cc9f0');
      colours.dark = (document.documentElement.dataset.theme ?? 'dark') !== 'light';
      // Hot centre of the light: near-white in dark mode, pure accent on light.
      colours.core = colours.dark
        ? (colours.accent.map((c) => Math.round(c + (255 - c) * 0.7)) as [
            number,
            number,
            number,
          ])
        : colours.accent;
    };

    // Paints the current frame and reports how far the light still is from
    // the pointer, so the caller can tell whether anything actually changed.
    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Copper layer: every trace and via, dim and unlit.
      ctx.globalAlpha = 0.32;
      ctx.strokeStyle = colours.base;
      ctx.fillStyle = colours.base;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const seg of segments) {
        if (seg.via) continue;
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }
      ctx.stroke();
      ctx.beginPath();
      for (const seg of segments) {
        if (!seg.via) continue;
        ctx.moveTo(seg.x1 + 2, seg.y1);
        ctx.arc(seg.x1, seg.y1, 2, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.globalAlpha = 1;

      // The light trails the pointer and fades in and out smoothly.
      const targetI = pointer.inside ? 1 : 0;
      if (light.intensity < 0.02 && targetI > 0) {
        light.x = pointer.x;
        light.y = pointer.y;
      }
      let posDelta = 0;
      if (targetI > 0) {
        const dx = pointer.x - light.x;
        const dy = pointer.y - light.y;
        posDelta = Math.hypot(dx, dy) / GLOW_RADIUS;
        light.x += dx * 0.16;
        light.y += dy * 0.16;
      }
      const iDelta = targetI - light.intensity;
      light.intensity += iDelta * 0.08;
      const maxDelta = Math.max(posDelta * 0.3, Math.abs(iDelta));

      const intensity = light.intensity;
      if (intensity > 0.02) {
        const reach = GLOW_RADIUS * 1.4;
        const near = segments.filter(
          (seg) =>
            Math.min(seg.x1, seg.x2) < light.x + reach &&
            Math.max(seg.x1, seg.x2) > light.x - reach &&
            Math.min(seg.y1, seg.y2) < light.y + reach &&
            Math.max(seg.y1, seg.y2) > light.y - reach
        );

        const tracePath = () => {
          ctx.beginPath();
          for (const seg of near) {
            if (seg.via) continue;
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
        };

        ctx.save();
        // Additive blending reads as emitted light on the dark board; on the
        // light theme it would wash out to white, so paint normally there.
        if (colours.dark) ctx.globalCompositeOperation = 'lighter';
        ctx.shadowColor = rgba(colours.accent, 0.9 * intensity);

        // Wide halo bleeding off the traces.
        const halo = ctx.createRadialGradient(
          light.x, light.y, 0,
          light.x, light.y, reach
        );
        halo.addColorStop(0, rgba(colours.accent, 0.5 * intensity));
        halo.addColorStop(0.5, rgba(colours.accent, 0.16 * intensity));
        halo.addColorStop(1, rgba(colours.accent, 0));
        ctx.shadowBlur = 16 * intensity;
        ctx.strokeStyle = halo;
        ctx.lineWidth = 3;
        tracePath();
        ctx.stroke();

        // Hot core directly under the light.
        const core = ctx.createRadialGradient(
          light.x, light.y, 0,
          light.x, light.y, reach * 0.7
        );
        core.addColorStop(0, rgba(colours.core, 0.95 * intensity));
        core.addColorStop(0.6, rgba(colours.core, 0.25 * intensity));
        core.addColorStop(1, rgba(colours.core, 0));
        ctx.shadowBlur = 6 * intensity;
        ctx.strokeStyle = core;
        ctx.lineWidth = 1.3;
        tracePath();
        ctx.stroke();

        // Via pads catch the glow like solder points.
        ctx.shadowBlur = 10 * intensity;
        ctx.fillStyle = halo;
        ctx.beginPath();
        for (const seg of near) {
          if (!seg.via) continue;
          ctx.moveTo(seg.x1 + 2.5, seg.y1);
          ctx.arc(seg.x1, seg.y1, 2.5, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
      }

      return maxDelta;
    };

    const rebuild = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      segments = buildTraces(window.innerWidth, window.innerHeight);
      draw();
    };

    const tick = () => {
      const maxDelta = draw();
      if (maxDelta < IDLE_EPSILON) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      // Coalesce a burst of resize events (e.g. dragging a window edge)
      // into a single rebuild on the next frame.
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        rebuild();
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      start();
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      start();
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        running = false;
      } else {
        start();
      }
    };

    const observer = new MutationObserver(() => {
      readColours();
      draw();
    });

    const setup = () => {
      if (active) return;
      active = true;
      readColours();
      rebuild();
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
      window.addEventListener('resize', onResize);
      window.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerleave', onPointerLeave);
      document.addEventListener('visibilitychange', onVisibility);
    };

    const teardown = () => {
      if (!active) return;
      active = false;
      cancelAnimationFrame(frame);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = 0;
      running = false;
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const onViewportChange = () => {
      if (viewportQuery.matches) {
        setup();
      } else {
        teardown();
      }
    };

    onViewportChange();
    viewportQuery.addEventListener('change', onViewportChange);

    return () => {
      viewportQuery.removeEventListener('change', onViewportChange);
      teardown();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
};

export default CircuitBackground;
