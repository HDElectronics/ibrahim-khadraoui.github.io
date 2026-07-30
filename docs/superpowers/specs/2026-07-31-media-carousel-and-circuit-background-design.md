# Media Carousel & Circuit Background — Design

**Date:** 2026-07-31
**Status:** Approved for planning
**Repo:** vscode-portfolio (Next.js 16.2.10, React 19, TypeScript, CSS Modules), branch `redesign`
**Builds on:** `docs/superpowers/specs/2026-07-30-simple-portfolio-redesign-design.md`

## Problem

Two gaps in the redesigned site.

**Media presentation.** Project detail pages render every gallery item stacked full-width. `misc-pcb-designs` is a 22-image scroll wall; `uav-xr` is 8 images plus 4 videos. A visitor cannot see what a project contains without scrolling past all of it, and cannot jump to a specific image.

**Wasted horizontal space.** The content column is capped at 720px. At 1440px and above, roughly 360px on each side is empty. The site reads as dark and sparse on wide screens.

## Goal

Add a media carousel — one large viewer with a thumbnail strip beneath it, expanding to a full-screen lightbox on click — and a subtle animated circuit-trace background that occupies only the empty gutters, reacting to the cursor.

Neither feature may compromise what the redesign achieved: fast, readable, text-first pages that work at 375px and in both themes.

## Scope decision, based on the real data

Consecutive-media runs were measured across all content before scoping:

| Location | Runs |
|---|---|
| Project gallery arrays (`images` + `videos`) | 22, 12, 7, 5, 4, 4, 4, 3, 3, 2, 2, 1, 1, 1 |
| Article `content[]` blocks | almost all runs of 1; exactly two runs of 2 |
| Project `content[]` blocks | none — zero `img`/`video` blocks exist |

Therefore:

- **Project galleries always use the carousel.** This is where the problem is.
- **Inline content media uses the carousel only for runs of 2 or more.** A lone image inside a write-up illustrates the paragraph above it; wrapping it in carousel chrome would be a regression. Runs of 1 render exactly as they do today.
- **No special handling for project content blocks** — none exist. The `ContentBlocks` change covers them automatically if any are added later.

## Components

### `MediaCarousel` (client)

`components/MediaCarousel.tsx` + `styles/MediaCarousel.module.css`

```ts
interface MediaItem { type: 'img' | 'video'; src: string }
interface MediaCarouselProps { items: MediaItem[]; alt: string }
```

- Fewer than 2 items: renders the single item plain, with no carousel chrome. The component is safe to use unconditionally.
- **Main pane** — the selected item. Images use a native `<img>`; videos use `<video controls preload="metadata" playsInline>`. Native `<img>` rather than `next/image` for the same reason ratified in the redesign: these sources carry no width/height, and inventing dimensions distorts material of genuinely different shapes.
- **Thumbnail strip** — a horizontally scrollable row of `<button>`s beneath the viewer. The active thumb is outlined in accent and carries `aria-current="true"`. Video thumbs render a muted `preload="metadata"` frame with a ▶ badge overlaid.
- **Counter** — `3 / 12` in mono, so the visitor knows the gallery's size without counting thumbs.
- **Keyboard** — ← and → move the selection when the carousel has focus. Thumbs are real buttons and are tab-reachable.
- Clicking the main pane opens the lightbox at the current index.

### `MediaLightbox` (client)

`components/MediaLightbox.tsx` + `styles/MediaLightbox.module.css`

A separate file because correct modal behaviour is the fiddliest part of this work and does not belong tangled in the carousel.

- Full-viewport overlay, `role="dialog"`, `aria-modal="true"`, labelled by the item's alt text.
- Prev/next controls and ←/→ keys; Esc closes; clicking the backdrop closes; clicking the media itself does not.
- **Focus management:** the trigger element is recorded on open, focus moves to the close button, Tab cycles within the dialog, and focus returns to the trigger on close.
- **Scroll lock:** `overflow: hidden` on `document.body` while open, restored on close — including on unmount, so a route change cannot strand the page unscrollable.

### `CircuitBackground` (client)

`components/CircuitBackground.tsx` + `styles/CircuitBackground.module.css`

Mounted once in `app/layout.tsx`, before `SiteHeader`.

- A fixed, full-viewport `<canvas>` with `pointer-events: none`, painted behind all content.
- **Gutters only.** The drawable region is everything outside the centred 720px column. Nothing is ever drawn behind text.
- A trace network is generated once on mount: orthogonal and 45° segments walking outward from the column edge, with vias (small filled circles) at direction changes — the visual language of a PCB, not of falling characters.
- **Cursor interaction:** segments within a radius of the pointer brighten toward `--accent` and decay back to `--border`.
- **Theme-aware:** a canvas cannot read CSS custom properties. Colours are sampled via `getComputedStyle(document.documentElement)` on mount and re-sampled when a `MutationObserver` sees `data-theme` change on `<html>`.

**Off switches, all required:**

| Condition | Behaviour |
|---|---|
| Viewport under 1100px | Canvas not rendered at all (gutters too narrow to be worth it) |
| `prefers-reduced-motion: reduce` | Canvas not rendered at all |
| Tab hidden (`document.hidden`) | Animation loop stopped |
| No glow decaying and pointer idle | Animation loop stopped — idle cost is zero |
| Device pixel ratio | Capped at 2, so 3x displays do not pay for a 3x canvas |

## Integration points

1. **`app/projects/[slug]/page.tsx`** — the gallery section becomes a single `<MediaCarousel>` fed `project.images` followed by `project.videos`. The existing condition that renders the gallery when either array is non-empty is preserved.
2. **`components/ContentBlocks.tsx`** — the existing `groupBlocks` pre-pass already collapses consecutive `li` blocks into one `<ul>`. It gains a second grouping rule: a run of 2 or more consecutive `img`/`video` blocks becomes a carousel group. Runs of 1 fall through to the current inline rendering, unchanged.

`groupBlocks` is the right place because it already owns "look at neighbouring blocks and decide how to render the run", and both detail pages consume it, so both benefit from one change.

## Constraints inherited from the redesign

These are not re-litigated; the new work must comply:

- CSS Modules with tokens from `styles/tokens.css`. No raw hex outside that file. No raw pixel spacing beyond the accepted exceptions (`1px` borders, `text-underline-offset: 3px`, `letter-spacing: -0.02em`, component dimensions, media-query breakpoints).
- Type scale is the existing four steps. Accent is never body text.
- Motion budget: the redesign allows only 150ms hover colour transitions. **The canvas is an explicit, scoped exception to that budget** — it is the feature being requested. Carousel and lightbox transitions stay within the existing 150ms colour-only rule; no slide or fade animation on media changes.
- No new npm dependencies. Everything here is React state, canvas 2D, and CSS.
- `app/projects/[slug]/page.tsx`, `app/articles/[slug]/page.tsx` and `app/layout.tsx` must remain Server Components. Only the three new components carry `'use client'`.
- No data file is modified. Both features read existing shapes.
- `eslint.config.mjs` must not be touched (protected by a repo hook).

## Verification

Same gate as the redesign — no test framework is being added.

1. `npm run build` and `npm run lint` both exit 0.
2. All 8 routes render at 375px and 1440px in both themes with no horizontal overflow and no console errors.
3. `/projects/misc-pcb-designs` (22 items) and `/projects/uav-xr` (8 images + 4 videos) render one viewer plus a scrollable thumb strip, not a stack.
4. A project with a single media item renders it plain, with no carousel chrome.
5. Lightbox: opens on click, traps focus, closes on Esc and on backdrop click, restores focus to the trigger, and leaves `document.body` scrollable afterwards.
6. Articles still show isolated inline images in place; the two runs of 2 become carousels.
7. Canvas is absent from the DOM below 1100px and under `prefers-reduced-motion`, never causes horizontal overflow, and its colours change when the theme is toggled.

## Out of scope

- Captions or per-image alt text — `ContentBlock` and the project gallery arrays carry no caption field, and adding one means editing data files.
- Touch-swipe gestures on the carousel. Thumbs and arrows are reachable on touch; swipe can follow if it proves missed.
- Preloading or responsive `srcset` for gallery media.
- Any change to the GitHub calendar's pinned dark colour scheme, the `metadataBase` origin, or `bun.lock` — those are tracked as separate follow-ups.
