'use client';

import { useEffect, useRef } from 'react';

import styles from '@/styles/CircuitBackground.module.css';

const COLUMN = 720;      // content column width, matches --maxw
const MIN_VIEWPORT = 1100;
const GUTTER_PAD = 32;   // keep traces clear of the column edge
const GLOW_RADIUS = 170;

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  via: boolean;
  glow: number;
}

function buildTraces(width: number, height: number): Segment[] {
  const segments: Segment[] = [];
  const gutter = (width - COLUMN) / 2 - GUTTER_PAD;
  if (gutter < 80) return segments;

  const lanes = Math.max(3, Math.round(height / 150));

  for (const side of ['left', 'right'] as const) {
    for (let lane = 0; lane < lanes; lane++) {
      let y = ((lane + 0.5) * height) / lanes + (Math.random() - 0.5) * 40;
      let x = side === 'left' ? gutter : width - gutter;
      const dir = side === 'left' ? -1 : 1;
      const steps = 3 + Math.floor(Math.random() * 3);

      for (let s = 0; s < steps; s++) {
        const run = 40 + Math.random() * 90;
        const diagonal = Math.random() < 0.45;
        const nx = x + dir * run;
        const ny = diagonal ? y + (Math.random() < 0.5 ? -run : run) * 0.6 : y;

        if (side === 'left' ? nx < 8 : nx > width - 8) break;
        if (ny < 8 || ny > height - 8) break;

        segments.push({ x1: x, y1: y, x2: nx, y2: ny, via: s > 0, glow: 0 });
        x = nx;
        y = ny;
      }
    }
  }

  return segments;
}

const CircuitBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < MIN_VIEWPORT) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let segments: Segment[] = [];
    let frame = 0;
    let running = false;
    const pointer = { x: -9999, y: -9999 };
    const colours = { base: '#23272e', accent: '#4cc9f0' };

    const readColours = () => {
      const style = getComputedStyle(document.documentElement);
      colours.base = style.getPropertyValue('--border').trim() || colours.base;
      colours.accent = style.getPropertyValue('--accent').trim() || colours.accent;
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const seg of segments) {
        const mx = (seg.x1 + seg.x2) / 2;
        const my = (seg.y1 + seg.y2) / 2;
        const dist = Math.hypot(mx - pointer.x, my - pointer.y);
        const target = dist < GLOW_RADIUS ? 1 - dist / GLOW_RADIUS : 0;
        seg.glow += (target - seg.glow) * 0.12;

        const lit = seg.glow > 0.02;
        ctx.strokeStyle = lit ? colours.accent : colours.base;
        ctx.globalAlpha = 0.28 + seg.glow * 0.6;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();

        if (seg.via) {
          ctx.fillStyle = lit ? colours.accent : colours.base;
          ctx.beginPath();
          ctx.arc(seg.x1, seg.y1, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      segments = buildTraces(window.innerWidth, window.innerHeight);
      draw();
    };

    const settled = () => segments.every((seg) => seg.glow < 0.02);

    const tick = () => {
      draw();
      if (settled() && pointer.x < -9000) {
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

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      start();
    };

    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
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
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    readColours();
    resize();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
};

export default CircuitBackground;
