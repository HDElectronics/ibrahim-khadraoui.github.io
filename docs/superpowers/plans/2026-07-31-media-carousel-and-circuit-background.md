# Media Carousel & Circuit Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a media carousel (viewer + thumbnail strip + full-screen lightbox) to project galleries and multi-image content runs, and a cursor-reactive PCB-trace canvas that fills only the empty gutters beside the 720px column.

**Architecture:** Three new client components. `MediaCarousel` owns selection state and renders a viewer plus a thumb strip; `MediaLightbox` owns the modal (focus trap, scroll lock, keyboard); `CircuitBackground` owns a fixed canvas painted only outside the content column. Two integration points: the project detail gallery, and the existing `groupBlocks` pre-pass in `ContentBlocks`.

**Tech Stack:** Next.js 16.2.10 App Router, React 19, TypeScript 5.8, CSS Modules, canvas 2D. Package manager: `npm` (bun is NOT installed). No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-31-media-carousel-and-circuit-background-design.md`

## Testing Note

This repo has no test framework and none is being added — ratified by the project owner during the redesign. Every task gates on:

```bash
npm run build      # must exit 0
npm run lint       # must exit 0  (script is `eslint app components data types`)
```

plus a browser pass the controller runs. Implementers do build + lint + curl only; they do not open a browser and do not start or stop servers. A dev server is already running on port 3000. Never delete `.next/`.

## Global Constraints

- Next.js **16.2.10**, React **19**, App Router. **No new npm dependencies.**
- CSS Modules only. Every colour, space, font and radius must reference a token from `styles/tokens.css`. No raw hex outside that file. Accepted raw-pixel exceptions: `1px` borders, `text-underline-offset: 3px`, `letter-spacing: -0.02em`, component dimensions (fixed widths/heights of a UI element), and media-query breakpoints.
- Type scale is exactly four steps: `--fs-xl` 2rem, `--fs-lg` 1.25rem, `--fs-md` 1rem, `--fs-sm` 0.875rem. Accent is never body text.
- Transitions on DOM elements: **150ms colour only** (`var(--t-color)`). No slide/fade on media changes. The canvas animation is the one sanctioned exception, and it is scoped to `CircuitBackground`.
- `app/layout.tsx`, `app/projects/[slug]/page.tsx` and `app/articles/[slug]/page.tsx` stay **Server Components**. Only the three new components carry `'use client'`.
- Native `<img>` with `/* eslint-disable-next-line @next/next/no-img-element */` for all gallery/content media — ratified, because these sources carry no dimensions. Never `next/image` here.
- **No data file may be modified.** `data/projects.ts`, `data/articles.ts`, `data/awards.ts`, etc. are read-only.
- **Never touch `eslint.config.mjs`** — protected by a repo hook. If you think it needs changing, stop and say so.
- Commit after each task, Conventional Commits. Stage only that task's files; never `git add -A`. Pre-existing dirty files (`.gitignore`, `next-env.d.ts`, `tsconfig.tsbuildinfo`, `more_ressources/`, `texput.log`) must stay unstaged.

## File Structure

| File | Responsibility |
|---|---|
| `types/index.ts` (modify) | Add the `MediaItem` type |
| `components/MediaLightbox.tsx` + `styles/MediaLightbox.module.css` | Full-screen modal: focus trap, scroll lock, keyboard, prev/next |
| `components/MediaCarousel.tsx` + `styles/MediaCarousel.module.css` | Viewer + thumb strip + counter; opens the lightbox |
| `components/CircuitBackground.tsx` + `styles/CircuitBackground.module.css` | Gutter-only animated canvas |
| `app/projects/[slug]/page.tsx` (modify) | Gallery section uses the carousel |
| `components/ContentBlocks.tsx` (modify) | `groupBlocks` gains a media-run rule |
| `app/layout.tsx` (modify) | Mounts `CircuitBackground` |

---

### Task 1: MediaItem type, MediaLightbox, MediaCarousel

Builds both components with no call sites yet, so they can be reviewed in isolation before anything renders them.

**Files:**
- Modify: `types/index.ts`
- Create: `components/MediaLightbox.tsx`, `styles/MediaLightbox.module.css`
- Create: `components/MediaCarousel.tsx`, `styles/MediaCarousel.module.css`

**Interfaces:**
- Consumes: nothing.
- Produces: `MediaItem { type: 'img' | 'video'; src: string }` exported from `@/types`; `<MediaCarousel items={MediaItem[]} alt={string} />` default export; `<MediaLightbox items alt index onIndexChange onClose />` default export.

- [ ] **Step 1: Add the `MediaItem` type to `types/index.ts`**

Append (keep everything already in the file):

```ts
export interface MediaItem {
  type: 'img' | 'video';
  src: string;
}
```

- [ ] **Step 2: Create `components/MediaLightbox.tsx`**

```tsx
'use client';

import { useCallback, useEffect, useRef } from 'react';
import { VscChevronLeft, VscChevronRight, VscClose } from 'react-icons/vsc';

import { MediaItem } from '@/types';

import styles from '@/styles/MediaLightbox.module.css';

interface MediaLightboxProps {
  items: MediaItem[];
  alt: string;
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}

const MediaLightbox = ({
  items,
  alt,
  index,
  onIndexChange,
  onClose,
}: MediaLightboxProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (delta: number) => {
      const n = items.length;
      onIndexChange(((index + delta) % n + n) % n);
    },
    [index, items.length, onIndexChange]
  );

  // Lock body scroll for as long as the dialog is mounted.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Move focus in on open, and keep Tab inside the dialog.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [onClose, step]);

  const item = items[index];

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — media viewer`}
      ref={dialogRef}
    >
      <button
        type="button"
        ref={closeRef}
        className={styles.close}
        onClick={onClose}
        aria-label="Close viewer"
      >
        <VscClose size={20} />
      </button>

      {items.length > 1 && (
        <button
          type="button"
          className={`${styles.nav} ${styles.prev}`}
          onClick={(event) => {
            event.stopPropagation();
            step(-1);
          }}
          aria-label="Previous item"
        >
          <VscChevronLeft size={24} />
        </button>
      )}

      <div className={styles.stage} onClick={(event) => event.stopPropagation()}>
        {item.type === 'video' ? (
          <video className={styles.media} controls autoPlay playsInline>
            <source src={item.src} type="video/mp4" />
          </video>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className={styles.media} src={item.src} alt={alt} />
        )}
        {items.length > 1 && (
          <p className={styles.counter}>
            {index + 1} / {items.length}
          </p>
        )}
      </div>

      {items.length > 1 && (
        <button
          type="button"
          className={`${styles.nav} ${styles.next}`}
          onClick={(event) => {
            event.stopPropagation();
            step(1);
          }}
          aria-label="Next item"
        >
          <VscChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default MediaLightbox;
```

- [ ] **Step 3: Create `styles/MediaLightbox.module.css`**

```css
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s3);
  padding: var(--s4);
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(4px);
}

.stage {
  display: grid;
  gap: var(--s2);
  justify-items: center;
  max-width: 100%;
  max-height: 100%;
}

.media {
  max-width: 100%;
  max-height: 80vh;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-subtle);
  object-fit: contain;
}

.counter {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.close {
  position: absolute;
  top: var(--s4);
  right: var(--s4);
}

.close,
.nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--t-color), border-color var(--t-color);
}

.close:hover,
.nav:hover {
  color: var(--accent);
  border-color: var(--accent);
}

@media (max-width: 700px) {
  .nav {
    position: absolute;
    bottom: var(--s4);
  }

  .prev {
    left: var(--s4);
  }

  .next {
    right: var(--s4);
  }
}
```

- [ ] **Step 4: Create `components/MediaCarousel.tsx`**

All hooks run before any early return — do not move the `items.length` checks above them.

```tsx
'use client';

import { useState } from 'react';

import MediaLightbox from '@/components/MediaLightbox';
import { MediaItem } from '@/types';

import styles from '@/styles/MediaCarousel.module.css';

interface MediaCarouselProps {
  items: MediaItem[];
  alt: string;
}

const MediaCarousel = ({ items, alt }: MediaCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  const safeIndex = Math.min(index, items.length - 1);
  const current = items[safeIndex];

  const renderMedia = (item: MediaItem, className: string) =>
    item.type === 'video' ? (
      <video className={className} controls preload="metadata" playsInline>
        <source src={item.src} type="video/mp4" />
      </video>
    ) : (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img className={className} src={item.src} alt={alt} />
    );

  // A lone item needs no carousel chrome.
  if (items.length === 1) {
    return <div className={styles.single}>{renderMedia(current, styles.media)}</div>;
  }

  const step = (delta: number) => {
    const n = items.length;
    setIndex(((safeIndex + delta) % n + n) % n);
  };

  return (
    <div
      className={styles.carousel}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          step(1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      <button
        type="button"
        className={styles.viewer}
        onClick={() => setOpen(true)}
        aria-label={`Expand ${alt} media ${safeIndex + 1} of ${items.length}`}
      >
        {renderMedia(current, styles.media)}
      </button>

      <div className={styles.bar}>
        <p className={styles.counter}>
          {safeIndex + 1} / {items.length}
        </p>
      </div>

      <ul className={styles.thumbs}>
        {items.map((item, i) => (
          <li key={item.src}>
            <button
              type="button"
              className={i === safeIndex ? `${styles.thumb} ${styles.active}` : styles.thumb}
              onClick={() => setIndex(i)}
              aria-current={i === safeIndex ? 'true' : undefined}
              aria-label={`Show item ${i + 1}`}
            >
              {item.type === 'video' ? (
                <>
                  <video className={styles.thumbMedia} preload="metadata" muted playsInline>
                    <source src={item.src} type="video/mp4" />
                  </video>
                  <span className={styles.playBadge} aria-hidden="true">
                    ▶
                  </span>
                </>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img className={styles.thumbMedia} src={item.src} alt="" />
              )}
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <MediaLightbox
          items={items}
          alt={alt}
          index={safeIndex}
          onIndexChange={setIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default MediaCarousel;
```

- [ ] **Step 5: Create `styles/MediaCarousel.module.css`**

```css
.carousel {
  display: grid;
  gap: var(--s2);
}

.single .media,
.viewer .media {
  width: 100%;
}

.viewer {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
}

.media {
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-subtle);
}

.bar {
  display: flex;
  justify-content: flex-end;
}

.counter {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.thumbs {
  list-style: none;
  display: flex;
  gap: var(--s2);
  overflow-x: auto;
  padding-bottom: var(--s2);
}

.thumb {
  position: relative;
  display: block;
  width: 72px;
  height: 54px;
  flex: none;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-subtle);
  cursor: pointer;
  transition: border-color var(--t-color);
}

.thumb:hover {
  border-color: var(--accent);
}

.active {
  border-color: var(--accent);
}

.thumbMedia {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playBadge {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-sm);
  color: var(--text);
  background: color-mix(in srgb, var(--bg) 45%, transparent);
}
```

- [ ] **Step 6: Verify**

```bash
npm run build && npm run lint
```

Both must exit 0. Nothing renders these components yet, so there is nothing to curl.

- [ ] **Step 7: Commit**

```bash
git add types/index.ts components/MediaCarousel.tsx components/MediaLightbox.tsx \
        styles/MediaCarousel.module.css styles/MediaLightbox.module.css
git commit -m "feat(media): add carousel and lightbox components"
```

---

### Task 2: Use the carousel in the project gallery

**Files:**
- Modify: `app/projects/[slug]/page.tsx`
- Modify: `styles/ProjectDetailPage.module.css`

**Interfaces:**
- Consumes: `<MediaCarousel items alt />` and `MediaItem` from Task 1.
- Produces: nothing.

- [ ] **Step 1: Replace the gallery block in `app/projects/[slug]/page.tsx`**

Add the imports:

```tsx
import MediaCarousel from '@/components/MediaCarousel';
import { MediaItem } from '@/types';
```

Inside the component, after the `notFound()` guard, build the list:

```tsx
const galleryItems: MediaItem[] = [
  ...project.images.map((src) => ({ type: 'img' as const, src })),
  ...(project.videos ?? []).map((src) => ({ type: 'video' as const, src })),
];
```

Replace the entire existing `<section className={styles.gallery}>` block — the one that maps `project.images` to `<img>` and `project.videos` to `<video>` — with:

```tsx
{galleryItems.length > 0 && (
  <section className={styles.gallery}>
    <h2 className={styles.galleryTitle}>Gallery</h2>
    <MediaCarousel items={galleryItems} alt={project.title} />
  </section>
)}
```

Keep the rest of the page exactly as it is: the back link, header, tags, `externalUrl` link, and the `<ContentBlocks>` call.

- [ ] **Step 2: Drop the now-unused `.media` rule**

`styles/ProjectDetailPage.module.css` has a `.media` rule that only the old stacked gallery used. Remove it **only if** nothing else in that file's JSX references `styles.media` — grep first. Keep `.gallery` and `.galleryTitle`.

- [ ] **Step 3: Verify**

```bash
npm run build && npm run lint
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/projects/misc-pcb-designs
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/projects/uav-xr
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/projects/falcon
curl -s http://localhost:3000/projects/misc-pcb-designs | grep -c "thumb"
```

All three routes must return 200. `falcon` has exactly 1 image and must render without carousel chrome. The thumb grep on `misc-pcb-designs` must be greater than 0.

- [ ] **Step 4: Commit**

```bash
git add "app/projects/[slug]/page.tsx" styles/ProjectDetailPage.module.css
git commit -m "feat(projects): render gallery as a carousel"
```

---

### Task 3: Group runs of inline media into a carousel

**Files:**
- Modify: `components/ContentBlocks.tsx`
- Modify: `styles/ContentBlocks.module.css` (only if a wrapper rule is needed)

**Interfaces:**
- Consumes: `<MediaCarousel items alt />` from Task 1.
- Produces: nothing.

`ContentBlocks` currently builds groups of two kinds: `{ kind: 'list', items }` for runs of `li`, and `{ kind: 'block', block }` for everything else. Add a third kind for media runs.

- [ ] **Step 1: Extend `groupBlocks` in `components/ContentBlocks.tsx`**

Widen the `Group` union:

```ts
type Group =
  | { kind: 'list'; items: string[] }
  | { kind: 'media'; items: MediaItem[] }
  | { kind: 'block'; block: ContentBlock };
```

In the grouping loop, handle `img`/`video` the same way `li` is handled — append to a trailing media group, or start one:

```ts
if (block.type === 'img' || block.type === 'video') {
  if (!block.src) continue;
  const last = groups[groups.length - 1];
  if (last && last.kind === 'media') {
    last.items.push({ type: block.type, src: block.src });
  } else {
    groups.push({ kind: 'media', items: [{ type: block.type, src: block.src }] });
  }
  continue;
}
```

Keep the existing `li` branch and the `else` branch unchanged.

- [ ] **Step 2: Render media groups**

In the render map, before the existing `switch`, handle the new kind. A run of 1 must render exactly as it does today — inline, not as a carousel:

```tsx
if (group.kind === 'media') {
  if (group.items.length === 1) {
    const only = group.items[0];
    return only.type === 'video' ? (
      <video key={index} className={styles.media} controls preload="metadata" playsInline>
        <source src={only.src} type="video/mp4" />
      </video>
    ) : (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img key={index} src={only.src} alt={alt} className={styles.media} />
    );
  }
  return <MediaCarousel key={index} items={group.items} alt={alt} />;
}
```

Add `import MediaCarousel from '@/components/MediaCarousel';` and `import { MediaItem } from '@/types';`. Then remove the now-dead `case 'img':` and `case 'video':` arms from the `switch`, since media never reaches it any more.

**`ContentBlocks` must stay a Server Component** — it has no `'use client'` today and must not gain one. It may render `MediaCarousel`, which is a client component; that composition is legal in the App Router.

- [ ] **Step 3: Verify**

```bash
npm run build && npm run lint
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/articles/esp32-round-tft-gc9a01-widgets
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/articles/wifi-based-device
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/articles/atc-aerial-traffic-control
```

All 200. `wifi-based-device` and `car-odometer-atmega328p` each contain one run of 2 and should now show a carousel there; `esp32-round-tft-gc9a01-widgets` has four isolated images and must show all four inline, unchanged. Report the thumb-count grep for each.

- [ ] **Step 4: Commit**

```bash
git add components/ContentBlocks.tsx styles/ContentBlocks.module.css
git commit -m "feat(content): group consecutive media blocks into a carousel"
```

---

### Task 4: CircuitBackground

**Files:**
- Create: `components/CircuitBackground.tsx`, `styles/CircuitBackground.module.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `<CircuitBackground />`, no props.

- [ ] **Step 1: Create `components/CircuitBackground.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `styles/CircuitBackground.module.css`**

```css
.canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

@media (max-width: 1099px) {
  .canvas {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .canvas {
    display: none;
  }
}
```

- [ ] **Step 3: Mount it in `app/layout.tsx`**

Add `import CircuitBackground from '@/components/CircuitBackground';` and render it as the first child of `<body>`, before `<SiteHeader />`. Change nothing else — the metadata block, fonts, theme script and Analytics stay exactly as they are.

The canvas sits at `z-index: 0` with `position: fixed`. `SiteHeader` is already `position: sticky; z-index: 10`, so it stays above. If content ends up visually behind the canvas, add `position: relative; z-index: 1;` to `main` in `styles/globals.css` — reason it through rather than adding it pre-emptively, and say what you did.

- [ ] **Step 4: Verify**

```bash
npm run build && npm run lint
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
curl -s http://localhost:3000/ | grep -c "canvas"
```

Home must be 200 and the canvas element must be present in the markup.

- [ ] **Step 5: Commit**

```bash
git add components/CircuitBackground.tsx styles/CircuitBackground.module.css app/layout.tsx
git commit -m "feat(background): add cursor-reactive circuit canvas in the gutters"
```

---

## Controller verification (not an implementer task)

After Task 4, the controller runs the browser sweep:

- All 8 routes at 375px and 1440px in both themes: no horizontal overflow, no console errors.
- `/projects/misc-pcb-designs` shows one viewer plus a scrolling thumb strip, not 22 stacked images.
- `/projects/falcon` (1 image) shows no carousel chrome.
- Lightbox opens, traps focus, closes on Esc and backdrop, restores focus, and leaves the page scrollable.
- Canvas: absent below 1100px, present and animating at 1440px, colours follow the theme toggle, never causes horizontal overflow.
