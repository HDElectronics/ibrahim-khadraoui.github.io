# Simple Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the VS Code-style portfolio interface with a simple, text-first, centered-column site, and re-anchor the site's positioning from "embedded systems engineer" to "AI / ML systems engineer".

**Architecture:** A single layout primitive (`Container`, 720px centered column) plus a sticky header and footer wrap every page. All colors, spacing, and typography come from CSS custom properties in `styles/tokens.css`, with a `[data-theme='light']` override. Content stays in typed TypeScript files under `data/`; the existing `projects.ts`, `articles.ts`, and `awards.ts` are not modified, and five new data files carry the CV-derived content.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19, TypeScript 5.8, CSS Modules, `next/font` (Inter + JetBrains Mono), `react-icons`, `react-github-calendar`. Package manager: `bun`. No new dependencies are added.

**Source of truth for content:** `ressources_for_CV/CV_Ibrahim_Khadraoui.md`.
**Spec:** `docs/superpowers/specs/2026-07-30-simple-portfolio-redesign-design.md`.

## Testing Note — Read This First

This repo has **no test framework**, and the spec deliberately does not add one: the site is statically generated content with no business logic. There is no meaningful unit to assert on that `tsc` does not already prove.

So the usual TDD red/green cycle is replaced by a **verification cycle that every task must run before its commit**:

```bash
bun run build      # type errors + Next.js route errors  -> must exit 0
bunx eslint .      # lint                                 -> must exit 0
```

Plus a visual check on `bun run dev` (http://localhost:3000) at 375px and 1440px widths, in **both** themes, for every route the task touched.

Note: `bun run lint` is **broken on this repo today** — the script is `next lint`, and `next lint` was removed in Next.js 16. Task 10 fixes the script. Until then, use `bunx eslint .` directly.

Do not mark a task complete if `bun run build` fails.

## Global Constraints

- Next.js **16.2.10**, React **19**. App Router only. Do not downgrade or add a framework.
- **No new npm dependencies.** Everything needed is already installed.
- Styling is **CSS Modules + CSS custom properties**. No Tailwind, no CSS-in-JS, no inline `style` attributes except where a value is computed at runtime.
- Every color, space, font, and radius in a `.module.css` file must reference a token from `styles/tokens.css`. No raw hex values outside `tokens.css`.
- Container width is **720px max**, body copy capped at **68ch**.
- Type scale is exactly four steps: `2rem`, `1.25rem`, `1rem`, `0.875rem`.
- Theme: **dark is the default**. `data-theme` attribute on `<html>`, values `dark` | `light`, persisted in `localStorage` under key `theme`.
- Accent: `#4cc9f0` dark, `#0284c7` light. Accent is never used for body text.
- Motion: 150ms color transitions on hover only. No scroll animations, no reveal effects.
- Positioning copy: the site leads with **AI / ML systems engineering (edge inference, embodied AI)**; hardware and PCB work is depth, not the headline. Never reintroduce "Embedded Systems Engineer" as the primary role label.
- All external links carry `target="_blank" rel="noopener noreferrer"`.
- Commit after every task. Conventional Commits format.

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `styles/tokens.css` | All design tokens; dark `:root` + `[data-theme='light']` override |
| `components/Container.tsx` + `.module.css` | The one layout primitive: centered 720px column |
| `components/SiteHeader.tsx` + `.module.css` | Wordmark, nav, theme toggle |
| `components/SiteFooter.tsx` + `.module.css` | Social links, colophon line |
| `components/ThemeToggle.tsx` + `.module.css` | Client-side dark/light switch |
| `components/ContentBlocks.tsx` + `.module.css` | Shared `ContentBlock[]` renderer |
| `components/ProjectFilter.tsx` + `.module.css` | Client-side category filter + grid |
| `components/GithubActivity.tsx` + `.module.css` | Client wrapper for the contribution calendar |
| `data/profile.ts` | Name, tagline, bio, email, resume URL, socials |
| `data/experience.ts` | Career timeline from the CV |
| `data/education.ts` | Two degrees |
| `data/publications.ts` | Six publications |
| `data/about.ts` | Long bio, skill groups, hobbies, languages |
| `app/experience/page.tsx` + `styles/ExperiencePage.module.css` | New route |

**Modified:** `app/layout.tsx`, `styles/globals.css`, `types/index.ts`, `app/page.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/articles/page.tsx`, `app/articles/[slug]/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `components/ProjectCard.tsx`, `components/WPArticleCard.tsx`, `package.json`, `README.md`, and the corresponding page `.module.css` files.

**Deleted (Task 10):** `components/{Layout,Sidebar,Titlebar,Tabsbar,Tab,Bottombar,Explorer,CommandPalette,Terminal,ThemeInfo,Breadcrumbs,Illustration,ContactCode,ArticleCard,RepoCard}.tsx`, `lib/files.ts`, `lib/themes.ts`, `app/{awards,github,settings}/`, `styles/themes.css`, and the `.module.css` files of all deleted components and pages.

**Never touched:** `data/projects.ts`, `data/articles.ts`, `data/awards.ts`, `public/projects/**`, `public/articles/**`.

---

### Task 1: Branch, design tokens, fonts, and the new shell

Everything after this task renders inside the new shell. At the end of this task the old pages will look unstyled and wrong — that is expected and is fixed page by page in Tasks 3–9.

**Files:**
- Create: `styles/tokens.css`
- Create: `components/Container.tsx`, `styles/Container.module.css`
- Create: `components/ThemeToggle.tsx`, `styles/ThemeToggle.module.css`
- Create: `components/SiteHeader.tsx`, `styles/SiteHeader.module.css`
- Create: `components/SiteFooter.tsx`, `styles/SiteFooter.module.css`
- Modify: `styles/globals.css` (full rewrite)
- Modify: `app/layout.tsx` (full rewrite)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `<Container>{children}</Container>` — default export, props `{ children: React.ReactNode; className?: string }`.
  - `<SiteHeader />`, `<SiteFooter />` — default exports, no props.
  - CSS tokens `--bg --bg-subtle --border --text --text-muted --accent --font-sans --font-mono --fs-xl --fs-lg --fs-md --fs-sm --lh-body --lh-heading --s1..--s6 --radius --maxw --measure --t-color`.
  - Font CSS variables `--font-inter` and `--font-jetbrains-mono` set on `<html>` by `app/layout.tsx`.

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b redesign
git status --short   # .gitignore, data/projects.ts, tsconfig.tsbuildinfo may be dirty; leave them alone
```

- [ ] **Step 2: Write `styles/tokens.css`**

```css
:root {
  /* color — dark is the default theme */
  --bg: #0b0d10;
  --bg-subtle: #14171c;
  --border: #23272e;
  --text: #e6e8ea;
  --text-muted: #9aa1a9;
  --accent: #4cc9f0;

  /* typography */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
  --fs-xl: 2rem;
  --fs-lg: 1.25rem;
  --fs-md: 1rem;
  --fs-sm: 0.875rem;
  --lh-body: 1.65;
  --lh-heading: 1.2;

  /* space — 4px base */
  --s1: 4px;
  --s2: 8px;
  --s3: 16px;
  --s4: 24px;
  --s5: 48px;
  --s6: 80px;

  /* layout */
  --radius: 6px;
  --maxw: 720px;
  --measure: 68ch;

  /* motion */
  --t-color: 150ms ease;
}

[data-theme='light'] {
  --bg: #ffffff;
  --bg-subtle: #f6f7f9;
  --border: #e4e7eb;
  --text: #15181c;
  --text-muted: #5c646d;
  --accent: #0284c7;
}
```

- [ ] **Step 3: Rewrite `styles/globals.css`**

The current file `@import`s Source Sans Pro from Google Fonts over the network. Delete that import — fonts now come from `next/font`.

```css
@import './tokens.css';

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  color-scheme: dark;
}

[data-theme='light'] {
  color-scheme: light;
}

body {
  min-height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: var(--fs-md);
  line-height: var(--lh-body);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  line-height: var(--lh-heading);
  font-weight: 600;
}

a {
  color: inherit;
  text-decoration: none;
}

p a,
li a {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--border);
  transition: color var(--t-color), text-decoration-color var(--t-color);
}

p a:hover,
li a:hover {
  color: var(--accent);
  text-decoration-color: var(--accent);
}

img,
video {
  max-width: 100%;
  height: auto;
  display: block;
}

::selection {
  background: var(--accent);
  color: var(--bg);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

- [ ] **Step 4: Create `components/Container.tsx` and its CSS**

`components/Container.tsx`:

```tsx
import styles from '@/styles/Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => (
  <div className={className ? `${styles.container} ${className}` : styles.container}>
    {children}
  </div>
);

export default Container;
```

`styles/Container.module.css`:

```css
.container {
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding-inline: var(--s4);
}
```

- [ ] **Step 5: Create `components/ThemeToggle.tsx` and its CSS**

`components/ThemeToggle.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { VscColorMode } from 'react-icons/vsc';

import styles from '@/styles/ThemeToggle.module.css';

type Theme = 'dark' | 'light';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // storage blocked (private mode / cookie policy) — theme still applies for this page view
    }
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <VscColorMode size={16} />
    </button>
  );
};

export default ThemeToggle;
```

`styles/ThemeToggle.module.css`:

```css
.toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--t-color), border-color var(--t-color);
}

.toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
}
```

- [ ] **Step 6: Create `components/SiteHeader.tsx` and its CSS**

`components/SiteHeader.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Container from '@/components/Container';
import ThemeToggle from '@/components/ThemeToggle';

import styles from '@/styles/SiteHeader.module.css';

const NAV = [
  { href: '/projects', label: 'projects' },
  { href: '/experience', label: 'experience' },
  { href: '/articles', label: 'articles' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
];

const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.wordmark}>
          Ibrahim<span className={styles.caret}>|</span>
        </Link>

        <nav className={styles.nav}>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? `${styles.link} ${styles.active}` : styles.link}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
};

export default SiteHeader;
```

`styles/SiteHeader.module.css`:

```css
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s3);
  min-height: 56px;
  flex-wrap: wrap;
  padding-block: var(--s2);
}

.wordmark {
  font-family: var(--font-mono);
  font-size: var(--fs-md);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.caret {
  color: var(--accent);
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--s3);
  flex-wrap: wrap;
}

.link {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  transition: color var(--t-color);
}

.link:hover {
  color: var(--text);
}

.active {
  color: var(--accent);
}

@media (max-width: 560px) {
  .inner {
    justify-content: center;
  }

  .nav {
    gap: var(--s2) var(--s3);
    justify-content: center;
  }
}
```

- [ ] **Step 7: Create `components/SiteFooter.tsx` and its CSS**

This wants `profile.socials`, which does not exist until Task 2. To keep this task self-contained and buildable, the footer links are hardcoded here and rewired to `profile` in Task 2, Step 7.

`components/SiteFooter.tsx`:

```tsx
import Container from '@/components/Container';

import styles from '@/styles/SiteFooter.module.css';

const LINKS = [
  { href: 'https://github.com/HDElectronics', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/ibrahim-khadraoui/', label: 'LinkedIn' },
  { href: 'https://www.researchgate.net/profile/Ibrahim-Khadraoui', label: 'ResearchGate' },
  { href: 'mailto:khadraouiibrahim@gmail.com', label: 'Email' },
];

const SiteFooter = () => (
  <footer className={styles.footer}>
    <Container className={styles.inner}>
      <div className={styles.links}>
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className={styles.colophon}>Built with Next.js. Deployed on Vercel.</p>
    </Container>
  </footer>
);

export default SiteFooter;
```

`styles/SiteFooter.module.css`:

```css
.footer {
  margin-top: var(--s6);
  border-top: 1px solid var(--border);
  padding-block: var(--s4);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s3);
  flex-wrap: wrap;
}

.links {
  display: flex;
  gap: var(--s3);
  flex-wrap: wrap;
}

.link {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  transition: color var(--t-color);
}

.link:hover {
  color: var(--accent);
}

.colophon {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
```

- [ ] **Step 8: Rewrite `app/layout.tsx`**

This removes the `Layout` import (the VS Code shell), wires `next/font`, and cuts the theme script from eight themes to two. Metadata is finalized in Task 11.

```tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Ibrahim Khadraoui | Portfolio',
    template: 'Ibrahim Khadraoui | %s',
  },
  description:
    'Ibrahim Khadraoui is an AI / ML systems engineer working on edge inference and embodied AI.',
};

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('theme');
      document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
```

Note: `styles/themes.css` is no longer imported. Do not delete the file yet — Task 10 handles deletions.

- [ ] **Step 9: Verify the build and the shell**

```bash
bun run build
bunx eslint .
bun run dev
```

Expected: build exits 0. On http://localhost:3000 the sticky header and footer render on every route. Page bodies still carry old VS Code-era styling and look wrong — correct at this stage. Click the theme toggle: background flips between `#0b0d10` and `#ffffff`, and the choice survives a reload with no flash of the wrong color.

- [ ] **Step 10: Commit**

```bash
git add styles/tokens.css styles/globals.css styles/Container.module.css \
        styles/ThemeToggle.module.css styles/SiteHeader.module.css styles/SiteFooter.module.css \
        components/Container.tsx components/ThemeToggle.tsx \
        components/SiteHeader.tsx components/SiteFooter.tsx app/layout.tsx
git commit -m "feat(shell): add design tokens, fonts, and simple site shell"
```

---

### Task 2: Types and CV-derived data files

Pure data. No UI changes, so the visual check is only "nothing regressed".

**Files:**
- Modify: `types/index.ts`
- Create: `data/profile.ts`, `data/experience.ts`, `data/education.ts`, `data/publications.ts`, `data/about.ts`
- Modify: `components/SiteFooter.tsx` (rewire to `profile.socials`)
- Copy: `ressources_for_CV/CV_Ibrahim_Khadraoui.pdf` → `public/CV_Ibrahim_Khadraoui.pdf`

**Interfaces:**
- Consumes: `Container`, `SiteFooter` (Task 1).
- Produces: `profile: Profile`, `experience: Experience[]`, `education: Education[]`, `publications: Publication[]`, `about: About`, and the types in Step 1. Tasks 3–9 all read from these.

- [ ] **Step 1: Append the new types to `types/index.ts`**

Keep every existing type in the file as-is. `Article`, `Repo`, and `User` are removed later, in Task 10. Append:

```ts
export type SocialIcon = 'github' | 'linkedin' | 'mail' | 'link';

export interface SocialLink {
  label: string;
  url: string;
  icon: SocialIcon;
}

export interface Profile {
  name: string;
  tagline: string;
  shortBio: string;
  email: string;
  resumeUrl: string;
  socials: SocialLink[];
}

export interface ExperienceRole {
  title: string;
  period: string;
}

export interface ExperienceFocus {
  label: string;
  period?: string;
  bullets: string[];
}

export interface Experience {
  company: string;
  location: string;
  period: string;
  roles: ExperienceRole[];
  focuses: ExperienceFocus[];
  tags: string[];
}

export interface Education {
  degree: string;
  institution: string;
  date: string;
  detail?: string;
}

export interface Publication {
  title: string;
  venue: string;
  date: string;
  url?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Hobby {
  title: string;
  text: string;
}

export interface About {
  bioParagraphs: string[];
  skillGroups: SkillGroup[];
  hobbies: Hobby[];
  languages: string[];
}
```

`Hobby` is not in the spec's type list. It is added deliberately: commit `7223bac` added a Hobbies section to the About page, and dropping it would be a content regression the spec never asked for.

- [ ] **Step 2: Create `data/profile.ts`**

```ts
import { Profile } from '@/types';

export const profile: Profile = {
  name: 'Ibrahim Khadraoui',
  tagline: 'AI / ML Systems Engineer — Edge Inference & Embodied AI',
  shortBio:
    'I take research models all the way to production hardware — architecture port, quantization, compiler work, serving layer, and the robot or edge device it finally runs on. Eight years across embedded systems, UAV and streaming platforms, and now large language and vision-language-action models at TII.',
  email: 'khadraouiibrahim@gmail.com',
  resumeUrl: '/CV_Ibrahim_Khadraoui.pdf',
  socials: [
    { label: 'GitHub', url: 'https://github.com/HDElectronics', icon: 'github' },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ibrahim-khadraoui/',
      icon: 'linkedin',
    },
    {
      label: 'ResearchGate',
      url: 'https://www.researchgate.net/profile/Ibrahim-Khadraoui',
      icon: 'link',
    },
    { label: 'Email', url: 'mailto:khadraouiibrahim@gmail.com', icon: 'mail' },
  ],
};
```

- [ ] **Step 3: Create `data/experience.ts`**

Transcribed from the "Professional Experience" section of the CV.

```ts
import { Experience } from '@/types';

export const experience: Experience[] = [
  {
    company: 'Technology Innovation Institute (TII)',
    location: 'Abu Dhabi, UAE',
    period: 'Mar 2022 – Present',
    roles: [
      { title: 'Senior AI Engineer', period: 'Nov 2025 – Present' },
      { title: 'AI Engineer', period: 'Jul 2024 – Nov 2025' },
      { title: 'Research Engineer', period: 'Mar 2022 – Jul 2024' },
    ],
    focuses: [
      {
        label: 'Edge AI & Embodied Intelligence',
        period: '2024 – Present',
        bullets: [
          'Own the inference and deployment path for FalconVLA, TII’s 8B vision-language-action model family, from PyTorch research checkpoint to a running policy on physical bimanual robot hardware.',
          'Optimized a model’s TensorRT path to run 1.72× faster than PyTorch (101.4 ms vs 174 ms per query) at identical action accuracy.',
          'Authored the upstream Falcon-H1 implementation in llama.cpp (merged PR ggml-org/llama.cpp#14534), and implemented Falcon3VLM support — vision tower, projector, tokenizer, and HF→GGUF converters.',
          'Ported the same models to MLX for native inference on Apple silicon.',
          'Built voice2action, a multi-service conversational robot control platform — LangGraph agent with confirm-before-execute, VLM scene grounding, self-hosted ASR/TTS, three-camera WebRTC streaming, and 3D URDF visualisation.',
          'Fine-tuned large language models with LoRA and detection models for downstream deployment.',
          'Mentored new joiners and interns, and reviewed pull requests from BlueOC, an external vendor building a VLM + object-detection surveillance pipeline.',
        ],
      },
      {
        label: 'UAV, Immersive & Streaming Systems',
        period: '2022 – 2024',
        bullets: [
          'Engineered a VR-controlled UAV system operated remotely over 70 km on a 5G network, with live 360° video — airframe and electronics, cloud control pipeline, and haptic feedback conveying real-time telemetry. Demonstrated publicly at GITEX Dubai 2022 and featured by NAS Daily.',
          'Designed and built a smart glove from scratch — board layout, soldering, and firmware — used as the drone’s control interface.',
          'Collaborated with the Live in Five team on the A2RL autonomous racing competition: decoded the full EMM protocol and developed the camera-view switching algorithm used for the viewer experience.',
          'Built a VR application in A-Frame for visualising Gaussian splatting models produced at TII.',
          'Awarded the Nova Award for the quarter, in a research environment of senior scientists.',
        ],
      },
    ],
    tags: [
      'TensorRT',
      'llama.cpp',
      'ggml',
      'MLX',
      'vLLM',
      'ROS 2',
      'C++',
      'Python',
      'WebRTC',
      'MQTT',
    ],
  },
  {
    company: 'Freelance — PCB Design & Embedded C/C++',
    location: 'Remote',
    period: '2018 – 2022',
    roles: [{ title: 'PCB Design & Embedded Engineer', period: '2018 – 2022' }],
    focuses: [
      {
        label: 'Hardware and firmware for IoT products',
        bullets: [
          'Worked directly with companies to build smart IoT solutions end to end — schematic capture and PCB layout, through firmware, up to the platform running on top.',
          'Delivered complete hardware and firmware prototypes for universities, researchers, and startups, covering the full path from concept to a reliable working device.',
        ],
      },
    ],
    tags: ['KiCad', 'STM32', 'ATmega328P', 'Embedded C', 'IoT'],
  },
];
```

- [ ] **Step 4: Create `data/education.ts` and `data/publications.ts`**

`data/education.ts`:

```ts
import { Education } from '@/types';

export const education: Education[] = [
  {
    degree: 'Master’s Degree, Embedded Systems Electronics',
    institution:
      'University of Science and Technology Houari Boumediene (USTHB)',
    date: 'September 2021',
    detail:
      'Thesis: heavy-carrying mobile robot with human-following capability using Ultra-Wideband localisation and ROS.',
  },
  {
    degree: 'Bachelor’s Degree, Electronics',
    institution:
      'University of Science and Technology Houari Boumediene (USTHB)',
    date: 'September 2019',
    detail:
      'Project: smart sorting machine with RFID identification and database-backed inventory.',
  },
];
```

`data/publications.ts`:

```ts
import { Publication } from '@/types';

export const publications: Publication[] = [
  {
    title: 'ALRM: Agentic LLM for Robotic Manipulation',
    venue: 'arXiv:2601.19510',
    date: 'January 2026',
    url: 'https://arxiv.org/abs/2601.19510',
  },
  {
    title:
      'Falcon-H1: A Family of Hybrid-Head Language Models Redefining Efficiency and Performance',
    venue: 'arXiv:2507.22448',
    date: 'July 2025',
    url: 'https://arxiv.org/abs/2507.22448',
  },
  {
    title:
      '360-Degree Video Super Resolution and Quality Enhancement Challenge: Methods and Results',
    venue: 'arXiv:2411.06738',
    date: 'November 2024',
    url: 'https://arxiv.org/abs/2411.06738',
  },
  {
    title:
      'Energy Cost of Coding Omnidirectional Videos using ARM and x86 Platforms',
    venue: 'GMSys ’24, 2nd ACM Green Multimedia Systems Workshop @ MMSys',
    date: 'April 2024',
    url: 'https://athena.itec.aau.at/gmsys24/',
  },
  {
    title: 'Locomotion-based UAV Control Toward the Internet of Senses',
    venue:
      'IEEE Transactions on Circuits and Systems II: Express Briefs, vol. 70, no. 5',
    date: 'May 2023',
    url: 'https://doi.org/10.1109/TCSII.2023.3257363',
  },
  {
    title: 'Virtual Reality and Multimedia Towards the Internet of Senses',
    venue: 'Wireless World Research Forum',
    date: '2022',
  },
];
```

- [ ] **Step 5: Create `data/about.ts`**

Skill groups merge the CV's "Core Strengths" table with the technology tags already on the current About page. Hobbies are carried over verbatim from `app/about/page.tsx`.

```ts
import { About } from '@/types';

export const about: About = {
  bioParagraphs: [
    'I’m an ML systems engineer who takes research models all the way to production hardware. I own the full path — architecture port, quantization, compiler work, serving layer, and the robot or edge device it finally runs on.',
    'Eight years of engineering across embedded systems, UAV and streaming platforms, and for the last two years large language and vision-language-action models at the Technology Innovation Institute, where I have brought model inference down from seconds to milliseconds while holding numerical parity against the reference implementation.',
    'What I enjoy most is using models to build real applications — taking something that works only in a research notebook and turning it into a system a person or a robot can actually use. That is why my work tends to end at a working device rather than at a benchmark table.',
  ],
  skillGroups: [
    {
      label: 'Inference optimization',
      items: ['TensorRT', 'MLX', 'ggml / GGUF', 'llama.cpp', 'ONNX Runtime', 'RKNN'],
    },
    {
      label: 'LLM / VLM serving',
      items: [
        'vLLM',
        'SGLang',
        'TensorRT-LLM',
        'TTFT & throughput benchmarking',
        'Whisper (ASR)',
        'Piper (TTS)',
      ],
    },
    {
      label: 'Model adaptation',
      items: ['LoRA fine-tuning', 'Object detection fine-tuning', 'YOLOv5', 'VLM / VLA'],
    },
    {
      label: 'Robotics & control',
      items: [
        'ROS 1',
        'ROS 2',
        'MoveIt',
        'Nav2',
        'SLAM Toolbox',
        'Inverse kinematics',
        'Mobile ALOHA',
      ],
    },
    {
      label: 'Drones / UAV',
      items: ['PX4', 'MAVLink', 'MAVSDK', 'Frame assembly', 'Firmware flashing', 'PID tuning'],
    },
    {
      label: 'Video & media',
      items: ['H.264 / H.265', 'WebRTC', 'RTMP / RTSP', 'FFmpeg', 'GStreamer'],
    },
    {
      label: 'Communication protocols',
      items: ['MQTT', 'AMQP / RabbitMQ', 'ZeroMQ', 'HTTP / REST', 'WebSocket', 'Bluetooth BLE'],
    },
    {
      label: 'Systems & infrastructure',
      items: ['Linux internals', 'Docker / Compose', 'systemd / udev', 'FastAPI'],
    },
    {
      label: 'Hardware',
      items: [
        'KiCad',
        'EasyEDA',
        'Schematic capture',
        'PCB layout',
        'STM32',
        'ESP32',
        'ATmega328P',
      ],
    },
    {
      label: 'Languages',
      items: ['Python (expert)', 'C++ / C (strong, low-level)'],
    },
  ],
  hobbies: [
    {
      title: 'FPV Drone Flying',
      text: 'I fly FPV using a real FPV drone controller, mostly through FPV drone simulator games for now.',
    },
    {
      title: 'DCS World',
      text: 'Combat flight simulation with a joystick and a VR headset. I know how to pilot the Su-25T.',
    },
    {
      title: 'PCB Design',
      text: 'Now that I work in AI day to day, PCB design has become more of a hobby — I still take on the occasional board.',
    },
  ],
  languages: ['Arabic (native)', 'French (fluent)', 'English (professional)'],
};
```

- [ ] **Step 6: Copy the resume PDF into `public/`**

```bash
cp ressources_for_CV/CV_Ibrahim_Khadraoui.pdf public/CV_Ibrahim_Khadraoui.pdf
git check-ignore -v public/CV_Ibrahim_Khadraoui.pdf || echo "not ignored — good"
```

If the file reports as ignored, remove the matching rule from `.gitignore` before committing.

- [ ] **Step 7: Rewire `SiteFooter` to use `profile.socials`**

Replace the hardcoded `LINKS` array in `components/SiteFooter.tsx`:

```tsx
import Container from '@/components/Container';
import { profile } from '@/data/profile';

import styles from '@/styles/SiteFooter.module.css';

const SiteFooter = () => (
  <footer className={styles.footer}>
    <Container className={styles.inner}>
      <div className={styles.links}>
        {profile.socials.map((social) => (
          <a
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {social.label}
          </a>
        ))}
      </div>
      <p className={styles.colophon}>Built with Next.js. Deployed on Vercel.</p>
    </Container>
  </footer>
);

export default SiteFooter;
```

- [ ] **Step 8: Verify**

```bash
bun run build
bunx eslint .
```

Expected: both exit 0. Then on `bun run dev`, open http://localhost:3000/CV_Ibrahim_Khadraoui.pdf — the PDF must load.

- [ ] **Step 9: Commit**

```bash
git add types/index.ts data/profile.ts data/experience.ts data/education.ts \
        data/publications.ts data/about.ts components/SiteFooter.tsx \
        public/CV_Ibrahim_Khadraoui.pdf
git commit -m "feat(data): add profile, experience, education, publications, and about data"
```

---

### Task 3: Home page

**Files:**
- Modify: `app/page.tsx` (full rewrite)
- Modify: `styles/HomePage.module.css` (full rewrite)

**Interfaces:**
- Consumes: `profile` (Task 2), `Container` (Task 1), `projects` and `articles` (existing data files).
- Produces: nothing consumed by later tasks.

Home shows the first 3 entries of `projects` and the first 2 of `articles` — array order is the curation mechanism, and no `featured` flag is introduced. Project links here are plain rows, not `ProjectCard`s; cards live on `/projects`.

- [ ] **Step 1: Rewrite `app/page.tsx`**

```tsx
import Link from 'next/link';

import Container from '@/components/Container';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { articles } from '@/data/articles';

import styles from '@/styles/HomePage.module.css';

const HomePage = () => {
  const selected = projects.slice(0, 3);
  const latest = articles.slice(0, 2);

  return (
    <Container className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.tagline}>{profile.tagline}</p>
        <p className={styles.bio}>{profile.shortBio}</p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Selected work</h2>
          <Link href="/projects" className={styles.seeAll}>
            all projects →
          </Link>
        </div>

        <ul className={styles.list}>
          {selected.map((project) => (
            <li key={project.slug}>
              <Link href={project.link} className={styles.row}>
                <span className={styles.rowTitle}>{project.title}</span>
                <span className={styles.rowText}>
                  {project.hook ?? project.description}
                </span>
                <span className={styles.rowTags}>
                  {project.tags.slice(0, 4).join(' · ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Latest writing</h2>
          <Link href="/articles" className={styles.seeAll}>
            all articles →
          </Link>
        </div>

        <ul className={styles.list}>
          {latest.map((article) => (
            <li key={article.slug}>
              <Link href={`/articles/${article.slug}`} className={styles.row}>
                <span className={styles.rowTitle}>{article.title}</span>
                <span className={styles.rowTags}>
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <p className={styles.cta}>
          <Link href="/experience" className={styles.ctaLink}>
            See where I&apos;ve worked
          </Link>{' '}
          or{' '}
          <Link href="/contact" className={styles.ctaLink}>
            get in touch
          </Link>
          .
        </p>
      </section>
    </Container>
  );
};

export default HomePage;
```

- [ ] **Step 2: Rewrite `styles/HomePage.module.css`**

```css
.page {
  padding-block: var(--s5);
}

.hero {
  margin-bottom: var(--s6);
}

.name {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}

.tagline {
  margin-top: var(--s2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.bio {
  margin-top: var(--s4);
  max-width: var(--measure);
  color: var(--text-muted);
}

.section {
  margin-bottom: var(--s6);
}

.sectionHead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--s3);
  margin-bottom: var(--s4);
}

.sectionTitle {
  font-size: var(--fs-lg);
}

.seeAll {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  transition: color var(--t-color);
}

.seeAll:hover {
  color: var(--accent);
}

.list {
  list-style: none;
  display: grid;
  gap: var(--s2);
}

.row {
  display: grid;
  gap: var(--s1);
  padding: var(--s3);
  margin-inline: calc(var(--s3) * -1);
  border-radius: var(--radius);
  transition: background var(--t-color);
}

.row:hover {
  background: var(--bg-subtle);
}

.rowTitle {
  display: block;
  font-weight: 600;
}

.rowText {
  display: block;
  max-width: var(--measure);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.rowTags {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.cta {
  color: var(--text-muted);
}

.ctaLink {
  color: var(--text);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--border);
  transition: color var(--t-color), text-decoration-color var(--t-color);
}

.ctaLink:hover {
  color: var(--accent);
  text-decoration-color: var(--accent);
}
```

- [ ] **Step 3: Verify**

```bash
bun run build && bunx eslint .
```

Then on `bun run dev`, check `/` at 375px and 1440px in both themes: hero, three project rows, two article rows, closing line. No horizontal scrollbar at 375px.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx styles/HomePage.module.css
git commit -m "feat(home): rebuild home page on the simple layout"
```

---

### Task 4: Experience page

**Files:**
- Create: `app/experience/page.tsx`, `styles/ExperiencePage.module.css`

**Interfaces:**
- Consumes: `experience`, `education`, `profile` (Task 2), `Container` (Task 1).
- Produces: the `/experience` route that `SiteHeader`'s nav already links to.

- [ ] **Step 1: Create `app/experience/page.tsx`**

```tsx
import { Metadata } from 'next';

import Container from '@/components/Container';
import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { education } from '@/data/education';

import styles from '@/styles/ExperiencePage.module.css';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Career timeline of Ibrahim Khadraoui — AI / ML systems engineering at TII, UAV and streaming systems, and freelance embedded hardware.',
};

const ExperiencePage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Experience</h1>
      <p className={styles.subtitle}>A changelog from my journey.</p>
    </header>

    <ol className={styles.timeline}>
      {experience.map((entry) => (
        <li key={entry.company} className={styles.entry}>
          <div className={styles.entryHead}>
            <h2 className={styles.company}>{entry.company}</h2>
            <span className={styles.meta}>
              {entry.location} · {entry.period}
            </span>
          </div>

          <ul className={styles.roles}>
            {entry.roles.map((role) => (
              <li key={role.title} className={styles.role}>
                <span className={styles.roleTitle}>{role.title}</span>
                <span className={styles.rolePeriod}>{role.period}</span>
              </li>
            ))}
          </ul>

          {entry.focuses.map((focus) => (
            <section key={focus.label} className={styles.focus}>
              <h3 className={styles.focusLabel}>
                {focus.label}
                {focus.period && (
                  <span className={styles.focusPeriod}>{focus.period}</span>
                )}
              </h3>
              <ul className={styles.bullets}>
                {focus.bullets.map((bullet) => (
                  <li key={bullet} className={styles.bullet}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className={styles.tags}>
            {entry.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Education</h2>
      <ul className={styles.education}>
        {education.map((item) => (
          <li key={item.degree} className={styles.educationItem}>
            <span className={styles.degree}>{item.degree}</span>
            <span className={styles.meta}>
              {item.institution} · {item.date}
            </span>
            {item.detail && <p className={styles.detail}>{item.detail}</p>}
          </li>
        ))}
      </ul>
    </section>

    <a
      href={profile.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.resume}
    >
      View full resume (PDF) →
    </a>
  </Container>
);

export default ExperiencePage;
```

- [ ] **Step 2: Create `styles/ExperiencePage.module.css`**

```css
.page {
  padding-block: var(--s5);
}

.header {
  margin-bottom: var(--s6);
}

.title {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: var(--s2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.timeline {
  list-style: none;
  display: grid;
  gap: var(--s6);
}

.entry {
  display: grid;
  gap: var(--s4);
}

.entryHead {
  display: grid;
  gap: var(--s1);
}

.company {
  font-size: var(--fs-lg);
}

.meta {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.roles {
  list-style: none;
  display: grid;
  gap: var(--s1);
  padding-left: var(--s3);
  border-left: 1px solid var(--border);
}

.role {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
  align-items: baseline;
}

.roleTitle {
  font-weight: 600;
  font-size: var(--fs-sm);
}

.rolePeriod {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.focus {
  display: grid;
  gap: var(--s3);
}

.focusLabel {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--s2);
  font-size: var(--fs-md);
  color: var(--accent);
}

.focusPeriod {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.bullets {
  display: grid;
  gap: var(--s2);
  padding-left: var(--s4);
}

.bullet {
  max-width: var(--measure);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s2);
}

.tag {
  padding: 2px var(--s2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.section {
  margin-top: var(--s6);
  display: grid;
  gap: var(--s4);
}

.sectionTitle {
  font-size: var(--fs-lg);
}

.education {
  list-style: none;
  display: grid;
  gap: var(--s4);
}

.educationItem {
  display: grid;
  gap: var(--s1);
}

.degree {
  font-weight: 600;
}

.detail {
  max-width: var(--measure);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.resume {
  display: inline-block;
  margin-top: var(--s5);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.resume:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

- [ ] **Step 3: Verify**

```bash
bun run build && bunx eslint .
```

On `/experience`: TII renders as one entry with three role lines and two focus blocks, then Freelance, then Education, then the resume link. Click the resume link — the PDF opens. Check 375px: no horizontal overflow, tags wrap.

- [ ] **Step 4: Commit**

```bash
git add app/experience/page.tsx styles/ExperiencePage.module.css
git commit -m "feat(experience): add experience timeline page"
```

---

### Task 5: Projects list page, filter, and card

**Files:**
- Create: `components/ProjectFilter.tsx`, `styles/ProjectFilter.module.css`
- Modify: `components/ProjectCard.tsx` (full rewrite)
- Modify: `styles/ProjectCard.module.css` (full rewrite)
- Modify: `app/projects/page.tsx` (full rewrite)
- Modify: `styles/ProjectsPage.module.css` (full rewrite)

**Interfaces:**
- Consumes: `projects` (existing), `Container` (Task 1).
- Produces: `<ProjectCard project={project} />` — note the `index` prop is **removed**; the new card has no numbering. `<ProjectFilter projects={projects} />` — client component owning filter state.

The page stays a server component so it can export `metadata`; the filter is a separate client component.

- [ ] **Step 1: Rewrite `components/ProjectCard.tsx`**

```tsx
import Image from 'next/image';
import Link from 'next/link';

import { Project } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const heroImage = project.images?.[0];

  return (
    <Link href={project.link} className={styles.card}>
      {heroImage && (
        <div className={styles.thumb}>
          <Image
            src={heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 700px) 100vw, 340px"
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.text}>{project.hook ?? project.description}</p>
        <p className={styles.tags}>{project.tags.slice(0, 4).join(' · ')}</p>
        {project.comingSoon && <span className={styles.badge}>Work in progress</span>}
      </div>
    </Link>
  );
};

export default ProjectCard;
```

The autoplaying hero video is dropped from cards — several autoplaying videos on one page is exactly the noise this redesign removes. Videos remain on detail pages.

- [ ] **Step 2: Rewrite `styles/ProjectCard.module.css`**

```css
.card {
  display: grid;
  gap: var(--s3);
  padding: var(--s3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  transition: border-color var(--t-color);
}

.card:hover {
  border-color: var(--accent);
}

.thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--bg-subtle);
}

.image {
  object-fit: cover;
}

.body {
  display: grid;
  gap: var(--s2);
}

.title {
  font-size: var(--fs-md);
}

.text {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.tags {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.badge {
  justify-self: start;
  padding: 2px var(--s2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
```

- [ ] **Step 3: Create `components/ProjectFilter.tsx`**

```tsx
'use client';

import { useState } from 'react';

import ProjectCard from '@/components/ProjectCard';
import { Project, ProjectCategory } from '@/types';

import styles from '@/styles/ProjectFilter.module.css';

type Filter = ProjectCategory | 'all';

const FILTERS: Filter[] = ['all', 'professional', 'hardware', 'hobby', 'open-source'];

interface ProjectFilterProps {
  projects: Project[];
}

const ProjectFilter = ({ projects }: ProjectFilterProps) => {
  const [filter, setFilter] = useState<Filter>('all');

  const visible =
    filter === 'all'
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter projects by category">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={
              filter === option ? `${styles.filter} ${styles.active}` : styles.filter
            }
          >
            {option}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {visible.length === 0 && <p className={styles.empty}>Nothing here yet.</p>}
    </>
  );
};

export default ProjectFilter;
```

- [ ] **Step 4: Create `styles/ProjectFilter.module.css`**

```css
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
  margin-bottom: var(--s5);
}

.filter {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  transition: color var(--t-color);
}

.filter:hover {
  color: var(--text);
}

.active {
  color: var(--accent);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s4);
}

.empty {
  color: var(--text-muted);
}

@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Rewrite `app/projects/page.tsx`**

```tsx
import { Metadata } from 'next';

import Container from '@/components/Container';
import ProjectFilter from '@/components/ProjectFilter';
import { projects } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Projects by Ibrahim Khadraoui — edge AI inference, robotics, UAV systems, and custom hardware.',
};

const ProjectsPage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Projects</h1>
      <p className={styles.subtitle}>
        Systems I&apos;ve built end to end — from model inference on edge
        hardware to the boards the models run on.
      </p>
    </header>

    <ProjectFilter projects={projects} />
  </Container>
);

export default ProjectsPage;
```

- [ ] **Step 6: Rewrite `styles/ProjectsPage.module.css`**

```css
.page {
  padding-block: var(--s5);
}

.header {
  margin-bottom: var(--s5);
}

.title {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: var(--s2);
  max-width: var(--measure);
  color: var(--text-muted);
}
```

- [ ] **Step 7: Verify**

```bash
bun run build && bunx eslint .
```

On `/projects`: the filter row renders, clicking `hardware` narrows the grid, clicking `all` restores it. Grid is 2-col at 1440px, 1-col at 375px. Every card image loads (no broken `next/image` requests in the console).

- [ ] **Step 8: Commit**

```bash
git add components/ProjectCard.tsx components/ProjectFilter.tsx \
        styles/ProjectCard.module.css styles/ProjectFilter.module.css \
        app/projects/page.tsx styles/ProjectsPage.module.css
git commit -m "feat(projects): rebuild projects list with category filter"
```

---

### Task 6: Shared ContentBlocks renderer and both detail pages

The `ContentBlock[]` switch is currently duplicated in `app/projects/[slug]/page.tsx` and `app/articles/[slug]/page.tsx`, and the two copies already disagree (the project version renders `li` without a bullet and ignores `video`; the article version prefixes `li` with `•` and handles `video`). One component replaces both.

**Files:**
- Create: `components/ContentBlocks.tsx`, `styles/ContentBlocks.module.css`
- Modify: `app/projects/[slug]/page.tsx` (full rewrite)
- Modify: `styles/ProjectDetailPage.module.css` (full rewrite)
- Modify: `app/articles/[slug]/page.tsx` (full rewrite)
- Modify: `styles/ArticleDetailPage.module.css` (full rewrite)

**Interfaces:**
- Consumes: `ContentBlock` type (existing), `Container` (Task 1).
- Produces: `<ContentBlocks blocks={blocks} alt={alt} />` where `blocks: ContentBlock[]` and `alt: string` (used as alt text for images inside the blocks).

- [ ] **Step 1: Create `components/ContentBlocks.tsx`**

Consecutive `li` blocks are grouped into a single `<ul>` so lists are semantically real lists, which neither current implementation does.

```tsx
import { ContentBlock } from '@/types';

import styles from '@/styles/ContentBlocks.module.css';

interface ContentBlocksProps {
  blocks: ContentBlock[];
  alt: string;
}

type Group =
  | { kind: 'list'; items: string[] }
  | { kind: 'block'; block: ContentBlock };

function groupBlocks(blocks: ContentBlock[]): Group[] {
  const groups: Group[] = [];

  for (const block of blocks) {
    if (block.type === 'li') {
      const last = groups[groups.length - 1];
      if (last && last.kind === 'list') {
        last.items.push(block.text ?? '');
      } else {
        groups.push({ kind: 'list', items: [block.text ?? ''] });
      }
    } else {
      groups.push({ kind: 'block', block });
    }
  }

  return groups;
}

const ContentBlocks = ({ blocks, alt }: ContentBlocksProps) => (
  <div className={styles.content}>
    {groupBlocks(blocks).map((group, index) => {
      if (group.kind === 'list') {
        return (
          <ul key={index} className={styles.list}>
            {group.items.map((item, itemIndex) => (
              <li key={itemIndex} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        );
      }

      const { block } = group;

      switch (block.type) {
        case 'h2':
          return (
            <h2 key={index} className={styles.h2}>
              {block.text}
            </h2>
          );
        case 'h3':
          return (
            <h3 key={index} className={styles.h3}>
              {block.text}
            </h3>
          );
        case 'h4':
          return (
            <h4 key={index} className={styles.h4}>
              {block.text}
            </h4>
          );
        case 'img':
          return block.src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={index} src={block.src} alt={alt} className={styles.media} />
          ) : null;
        case 'video':
          return block.src ? (
            <video
              key={index}
              className={styles.media}
              controls
              preload="metadata"
              playsInline
            >
              <source src={block.src} type="video/mp4" />
            </video>
          ) : null;
        case 'p':
        default:
          return (
            <p key={index} className={styles.p}>
              {block.text}
            </p>
          );
      }
    })}
  </div>
);

export default ContentBlocks;
```

Native `<img>` is used deliberately — `ContentBlock.src` carries no width/height, so `next/image` would require inventing dimensions. The eslint disable comment is required because `next/core-web-vitals` flags raw `<img>`.

- [ ] **Step 2: Create `styles/ContentBlocks.module.css`**

```css
.content {
  display: grid;
  gap: var(--s4);
  max-width: var(--measure);
}

.h2 {
  margin-top: var(--s4);
  font-size: var(--fs-lg);
}

.h3 {
  margin-top: var(--s3);
  font-size: var(--fs-md);
}

.h4 {
  font-size: var(--fs-md);
  color: var(--text-muted);
}

.p {
  color: var(--text-muted);
}

.list {
  display: grid;
  gap: var(--s2);
  padding-left: var(--s4);
}

.listItem {
  color: var(--text-muted);
}

.media {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-subtle);
}
```

- [ ] **Step 3: Rewrite `app/projects/[slug]/page.tsx`**

`generateStaticParams`, `generateMetadata`, and `notFound()` behavior are preserved exactly.

```tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from '@/components/Container';
import ContentBlocks from '@/components/ContentBlocks';
import { projects } from '@/data/projects';

import styles from '@/styles/ProjectDetailPage.module.css';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project?.title ?? 'Project',
    description: project?.description,
  };
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <Container className={styles.page}>
      <Link href="/projects" className={styles.back}>
        ← Back to projects
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
        <p className={styles.tags}>{project.tags.join(' · ')}</p>
        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.external}
          >
            View source on GitHub →
          </a>
        )}
      </header>

      {project.content && (
        <ContentBlocks blocks={project.content} alt={project.title} />
      )}

      {(project.images.length > 0 || (project.videos?.length ?? 0) > 0) && (
        <section className={styles.gallery}>
          <h2 className={styles.galleryTitle}>Gallery</h2>
          {project.images.map((src) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={src} src={src} alt={project.title} className={styles.media} />
          ))}
          {project.videos?.map((src) => (
            <video
              key={src}
              className={styles.media}
              controls
              preload="metadata"
              playsInline
            >
              <source src={src} type="video/mp4" />
            </video>
          ))}
        </section>
      )}
    </Container>
  );
};

export default ProjectDetailPage;
```

- [ ] **Step 4: Rewrite `styles/ProjectDetailPage.module.css`**

```css
.page {
  padding-block: var(--s5);
}

.back {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  transition: color var(--t-color);
}

.back:hover {
  color: var(--accent);
}

.header {
  display: grid;
  gap: var(--s3);
  margin-block: var(--s4) var(--s5);
}

.title {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}

.description {
  max-width: var(--measure);
  color: var(--text-muted);
}

.tags {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.external {
  justify-self: start;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.external:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.gallery {
  display: grid;
  gap: var(--s4);
  margin-top: var(--s6);
}

.galleryTitle {
  font-size: var(--fs-lg);
}

.media {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-subtle);
}
```

- [ ] **Step 5: Rewrite `app/articles/[slug]/page.tsx`**

```tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from '@/components/Container';
import ContentBlocks from '@/components/ContentBlocks';
import { articles } from '@/data/articles';

import styles from '@/styles/ArticleDetailPage.module.css';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return {
    title: article?.title ?? 'Article',
    description: article?.excerpt,
  };
}

const ArticleDetailPage = async ({ params }: ArticleDetailPageProps) => {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <Container className={styles.page}>
      <Link href="/articles" className={styles.back}>
        ← Back to articles
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.meta}>
          {new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      <ContentBlocks blocks={article.content} alt={article.title} />
    </Container>
  );
};

export default ArticleDetailPage;
```

The standalone cover image is dropped: every article's `cover` is also the first image inside `content`, so rendering both showed it twice.

- [ ] **Step 6: Rewrite `styles/ArticleDetailPage.module.css`**

```css
.page {
  padding-block: var(--s5);
}

.back {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  transition: color var(--t-color);
}

.back:hover {
  color: var(--accent);
}

.header {
  display: grid;
  gap: var(--s2);
  margin-block: var(--s4) var(--s5);
}

.title {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
  max-width: var(--measure);
}

.meta {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
```

- [ ] **Step 7: Verify**

```bash
bun run build && bunx eslint .
```

Check `/projects/uav-xr` and `/articles/atc-aerial-traffic-control`: headings, paragraphs, and grouped bullet lists render; videos play with controls; the gallery appears only on the project page. Then confirm 404s still work:

```
http://localhost:3000/projects/does-not-exist
http://localhost:3000/articles/does-not-exist
```

Both must render the Next.js 404 page, not crash.

- [ ] **Step 8: Commit**

```bash
git add components/ContentBlocks.tsx styles/ContentBlocks.module.css \
        "app/projects/[slug]/page.tsx" styles/ProjectDetailPage.module.css \
        "app/articles/[slug]/page.tsx" styles/ArticleDetailPage.module.css
git commit -m "refactor(content): extract shared ContentBlocks renderer and restyle detail pages"
```

---

### Task 7: Articles list page

**Files:**
- Modify: `components/WPArticleCard.tsx` (full rewrite)
- Create: `styles/WPArticleCard.module.css`
- Modify: `app/articles/page.tsx` (full rewrite)
- Modify: `styles/ArticlesPage.module.css` (full rewrite)

`WPArticleCard` currently imports `styles/ArticleCard.module.css`, which belongs to the deleted `ArticleCard` component. It gets its own stylesheet so Task 10 can delete `ArticleCard.module.css` cleanly.

**Interfaces:**
- Consumes: `articles` (existing), `Container` (Task 1).
- Produces: `<WPArticleCard article={article} />` — the `index` prop is **removed**.

- [ ] **Step 1: Rewrite `components/WPArticleCard.tsx`**

```tsx
import Link from 'next/link';

import { WPArticle } from '@/types';

import styles from '@/styles/WPArticleCard.module.css';

interface WPArticleCardProps {
  article: WPArticle;
}

const WPArticleCard = ({ article }: WPArticleCardProps) => (
  <Link href={`/articles/${article.slug}`} className={styles.card}>
    <span className={styles.date}>
      {new Date(article.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </span>
    <h2 className={styles.title}>{article.title}</h2>
    <p className={styles.excerpt}>{article.excerpt}</p>
  </Link>
);

export default WPArticleCard;
```

- [ ] **Step 2: Create `styles/WPArticleCard.module.css`**

```css
.card {
  display: grid;
  gap: var(--s2);
  padding: var(--s3);
  margin-inline: calc(var(--s3) * -1);
  border-radius: var(--radius);
  transition: background var(--t-color);
}

.card:hover {
  background: var(--bg-subtle);
}

.date {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.title {
  font-size: var(--fs-md);
  max-width: var(--measure);
}

.excerpt {
  max-width: var(--measure);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
```

- [ ] **Step 3: Rewrite `app/articles/page.tsx`**

The current subtitle says the articles are about "PCBs and embedded systems" — replaced to match the new positioning.

```tsx
import { Metadata } from 'next';

import Container from '@/components/Container';
import WPArticleCard from '@/components/WPArticleCard';
import { articles } from '@/data/articles';

import styles from '@/styles/ArticlesPage.module.css';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Write-ups by Ibrahim Khadraoui on edge AI inference, robotics, UAV systems, and embedded hardware.',
};

const ArticlesPage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Articles</h1>
      <p className={styles.subtitle}>
        Write-ups on the systems I build — model inference on edge hardware,
        robotics, drones, and the boards underneath.
      </p>
    </header>

    <div className={styles.list}>
      {articles.map((article) => (
        <WPArticleCard key={article.slug} article={article} />
      ))}
    </div>
  </Container>
);

export default ArticlesPage;
```

- [ ] **Step 4: Rewrite `styles/ArticlesPage.module.css`**

```css
.page {
  padding-block: var(--s5);
}

.header {
  margin-bottom: var(--s5);
}

.title {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: var(--s2);
  max-width: var(--measure);
  color: var(--text-muted);
}

.list {
  display: grid;
  gap: var(--s2);
}
```

- [ ] **Step 5: Verify**

```bash
bun run build && bunx eslint .
```

On `/articles`: all articles listed, order matches `data/articles.ts`, each row links to its detail page.

- [ ] **Step 6: Commit**

```bash
git add components/WPArticleCard.tsx styles/WPArticleCard.module.css \
        app/articles/page.tsx styles/ArticlesPage.module.css
git commit -m "feat(articles): rebuild articles list on the simple layout"
```

---

### Task 8: About page

**Files:**
- Create: `components/GithubActivity.tsx`, `styles/GithubActivity.module.css`
- Modify: `app/about/page.tsx` (full rewrite)
- Modify: `styles/AboutPage.module.css` (full rewrite)

**Interfaces:**
- Consumes: `about`, `publications`, `profile` (Task 2), `awards` (existing `data/awards.ts`, type `Award`), `Container` (Task 1), `react-github-calendar`.
- Produces: `<GithubActivity />` — no props.

`react-github-calendar` is client-side, so it is imported into a tiny client wrapper rather than making the whole page a client component (the page must stay a server component to export `metadata`).

- [ ] **Step 1: Create `components/GithubActivity.tsx` and its CSS**

`components/GithubActivity.tsx`:

```tsx
'use client';

import GitHubCalendar from 'react-github-calendar';

import styles from '@/styles/GithubActivity.module.css';

const GithubActivity = () => (
  <div className={styles.calendar}>
    <GitHubCalendar
      username="HDElectronics"
      colorScheme="dark"
      blockSize={11}
      blockMargin={3}
      fontSize={12}
    />
  </div>
);

export default GithubActivity;
```

`styles/GithubActivity.module.css`:

```css
.calendar {
  overflow-x: auto;
  color: var(--text-muted);
  font-size: var(--fs-sm);
}
```

`colorScheme` is pinned to `dark` rather than following the theme toggle: the library reads it as a prop, not a CSS variable, and wiring it to the toggle would require lifting theme state into React context — scope the spec does not ask for. Note this in the commit body.

- [ ] **Step 2: Rewrite `app/about/page.tsx`**

```tsx
import { Metadata } from 'next';

import Container from '@/components/Container';
import GithubActivity from '@/components/GithubActivity';
import { about } from '@/data/about';
import { publications } from '@/data/publications';
import { awards } from '@/data/awards';
import { profile } from '@/data/profile';

import styles from '@/styles/AboutPage.module.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Ibrahim Khadraoui — AI / ML systems engineer working on edge inference and embodied AI, with a background in embedded hardware.',
};

const AboutPage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>About</h1>
      <p className={styles.tagline}>{profile.tagline}</p>
    </header>

    <section className={styles.section}>
      {about.bioParagraphs.map((paragraph) => (
        <p key={paragraph} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Skills</h2>
      <dl className={styles.skills}>
        {about.skillGroups.map((group) => (
          <div key={group.label} className={styles.skillGroup}>
            <dt className={styles.skillLabel}>{group.label}</dt>
            <dd className={styles.skillItems}>{group.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Publications</h2>
      <ul className={styles.publications}>
        {publications.map((publication) => (
          <li key={publication.title} className={styles.publication}>
            {publication.url ? (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.publicationTitle}
              >
                {publication.title}
              </a>
            ) : (
              <span className={styles.publicationTitle}>{publication.title}</span>
            )}
            <span className={styles.publicationMeta}>
              {publication.venue} · {publication.date}
            </span>
          </li>
        ))}
      </ul>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Recognition</h2>
      <ul className={styles.awards}>
        {awards.map((award) => (
          <li key={award.title} className={styles.award}>
            <span className={styles.awardTitle}>{award.title}</span>
            <span className={styles.awardMeta}>
              {award.organization} · {award.date}
            </span>
            <p className={styles.awardText}>{award.description}</p>
          </li>
        ))}
      </ul>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>GitHub activity</h2>
      <GithubActivity />
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Hobbies</h2>
      <ul className={styles.hobbies}>
        {about.hobbies.map((hobby) => (
          <li key={hobby.title} className={styles.hobby}>
            <span className={styles.hobbyTitle}>{hobby.title}</span>
            <p className={styles.hobbyText}>{hobby.text}</p>
          </li>
        ))}
      </ul>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Languages</h2>
      <p className={styles.paragraph}>{about.languages.join(' · ')}</p>
    </section>
  </Container>
);

export default AboutPage;
```

- [ ] **Step 3: Rewrite `styles/AboutPage.module.css`**

```css
.page {
  padding-block: var(--s5);
}

.header {
  margin-bottom: var(--s6);
}

.title {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}

.tagline {
  margin-top: var(--s2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
}

.section {
  display: grid;
  gap: var(--s4);
  margin-bottom: var(--s6);
}

.sectionTitle {
  font-size: var(--fs-lg);
}

.paragraph {
  max-width: var(--measure);
  color: var(--text-muted);
}

.skills {
  display: grid;
  gap: var(--s3);
}

.skillGroup {
  display: grid;
  gap: var(--s1);
}

.skillLabel {
  font-size: var(--fs-sm);
  font-weight: 600;
}

.skillItems {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.publications,
.awards,
.hobbies {
  list-style: none;
  display: grid;
  gap: var(--s4);
}

.publication,
.award,
.hobby {
  display: grid;
  gap: var(--s1);
}

.publicationTitle,
.awardTitle,
.hobbyTitle {
  max-width: var(--measure);
  font-weight: 600;
  transition: color var(--t-color);
}

a.publicationTitle:hover {
  color: var(--accent);
}

.publicationMeta,
.awardMeta {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.awardText,
.hobbyText {
  max-width: var(--measure);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
```

- [ ] **Step 4: Verify**

```bash
bun run build && bunx eslint .
```

On `/about`: bio, skills, six publications with working arXiv/DOI links, the Nova Award, the GitHub calendar (scrolls horizontally at 375px rather than overflowing the page), hobbies, languages.

- [ ] **Step 5: Commit**

```bash
git add app/about/page.tsx styles/AboutPage.module.css \
        components/GithubActivity.tsx styles/GithubActivity.module.css
git commit -m "feat(about): rebuild about page with publications, awards, and GitHub activity

The GitHub calendar's colorScheme is pinned to dark; the library takes it
as a prop rather than reading a CSS variable, and following the theme
toggle would need theme state lifted into React context."
```

---

### Task 9: Contact page

**Files:**
- Modify: `app/contact/page.tsx` (full rewrite)
- Modify: `styles/ContactPage.module.css` (full rewrite)

**Interfaces:**
- Consumes: `profile` and the `SocialIcon` type (Task 2), `Container` (Task 1), `react-icons/vsc`.
- Produces: nothing consumed by later tasks. This is the last page importing `ContactCode`, so Task 10 can delete it after this.

- [ ] **Step 1: Rewrite `app/contact/page.tsx`**

```tsx
import { Metadata } from 'next';
import { VscGithub, VscMail, VscLinkExternal, VscAccount } from 'react-icons/vsc';

import Container from '@/components/Container';
import { profile } from '@/data/profile';
import { SocialIcon } from '@/types';

import styles from '@/styles/ContactPage.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Ibrahim Khadraoui.',
};

const ICONS: Record<SocialIcon, React.ComponentType<{ size?: number }>> = {
  github: VscGithub,
  linkedin: VscAccount,
  mail: VscMail,
  link: VscLinkExternal,
};

const ContactPage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Contact</h1>
      <p className={styles.subtitle}>
        Open to new opportunities and collaborations. Email is the fastest way
        to reach me.
      </p>
    </header>

    <ul className={styles.list}>
      {profile.socials.map((social) => {
        const Icon = ICONS[social.icon];
        return (
          <li key={social.url}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.row}
            >
              <Icon size={16} />
              <span className={styles.label}>{social.label}</span>
              <span className={styles.value}>
                {social.url.replace(/^mailto:|^https?:\/\/(www\.)?/, '')}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  </Container>
);

export default ContactPage;
```

- [ ] **Step 2: Rewrite `styles/ContactPage.module.css`**

```css
.page {
  padding-block: var(--s5);
}

.header {
  margin-bottom: var(--s5);
}

.title {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: var(--s2);
  max-width: var(--measure);
  color: var(--text-muted);
}

.list {
  list-style: none;
  display: grid;
  gap: var(--s2);
}

.row {
  display: flex;
  align-items: center;
  gap: var(--s3);
  flex-wrap: wrap;
  padding: var(--s3);
  margin-inline: calc(var(--s3) * -1);
  border-radius: var(--radius);
  color: var(--text-muted);
  transition: background var(--t-color), color var(--t-color);
}

.row:hover {
  background: var(--bg-subtle);
  color: var(--text);
}

.label {
  min-width: 120px;
  font-weight: 600;
  color: var(--text);
}

.value {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
}
```

- [ ] **Step 3: Verify**

```bash
bun run build && bunx eslint .
```

On `/contact`: four rows with icons; the email row opens the mail client; the other three open in new tabs.

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx styles/ContactPage.module.css
git commit -m "feat(contact): rebuild contact page as a plain channel list"
```

---

### Task 10: Delete the VS Code shell

Nothing imports these any more — Tasks 1–9 removed every reference. This task proves that, then deletes them.

**Files:**
- Delete: `components/{Layout,Sidebar,Titlebar,Tabsbar,Tab,Bottombar,Explorer,CommandPalette,Terminal,ThemeInfo,Breadcrumbs,Illustration,ContactCode,ArticleCard,RepoCard}.tsx`
- Delete: `lib/files.ts`, `lib/themes.ts`
- Delete: `app/awards/`, `app/github/`, `app/settings/`
- Delete: `styles/{Layout,Sidebar,Titlebar,Tabsbar,Tab,Bottombar,Explorer,CommandPalette,Terminal,ThemeInfo,Breadcrumbs,ContactCode,ArticleCard,RepoCard,AwardsPage,GithubPage,SettingsPage}.module.css`, `styles/themes.css`
- Modify: `types/index.ts` (drop `Article`, `Repo`, `User`)
- Modify: `package.json` (fix the `lint` script)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

- [ ] **Step 1: Prove nothing imports the doomed modules**

```bash
grep -rn "components/\(Layout\|Sidebar\|Titlebar\|Tabsbar\|Tab\|Bottombar\|Explorer\|CommandPalette\|Terminal\|ThemeInfo\|Breadcrumbs\|Illustration\|ContactCode\|ArticleCard\|RepoCard\)\|lib/files\|lib/themes\|styles/themes.css" \
  --include="*.tsx" --include="*.ts" --include="*.css" app components lib styles
```

Expected: no output. If anything is listed, fix that import before deleting — do not proceed.

- [ ] **Step 2: Delete the component, lib, and route files**

```bash
git rm components/Layout.tsx components/Sidebar.tsx components/Titlebar.tsx \
       components/Tabsbar.tsx components/Tab.tsx components/Bottombar.tsx \
       components/Explorer.tsx components/CommandPalette.tsx components/Terminal.tsx \
       components/ThemeInfo.tsx components/Breadcrumbs.tsx components/Illustration.tsx \
       components/ContactCode.tsx components/ArticleCard.tsx components/RepoCard.tsx
git rm lib/files.ts lib/themes.ts
git rm -r app/awards app/github app/settings
```

- [ ] **Step 3: Delete the orphaned stylesheets**

```bash
git rm styles/Layout.module.css styles/Sidebar.module.css styles/Titlebar.module.css \
       styles/Tabsbar.module.css styles/Tab.module.css styles/Bottombar.module.css \
       styles/Explorer.module.css styles/CommandPalette.module.css styles/Terminal.module.css \
       styles/ThemeInfo.module.css styles/Breadcrumbs.module.css styles/ContactCode.module.css \
       styles/ArticleCard.module.css styles/RepoCard.module.css styles/AwardsPage.module.css \
       styles/GithubPage.module.css styles/SettingsPage.module.css styles/themes.css
```

- [ ] **Step 4: Remove the dead types from `types/index.ts`**

Delete the `Article`, `Repo`, and `User` interfaces. `Article` is the DEV.to shape and was only used by the deleted `ArticleCard`; articles use `WPArticle`. `Repo` and `User` were only used by the deleted `/github` page and `RepoCard`.

Keep: `ProjectCategory`, `Project`, `Award`, `ContentBlock`, `WPArticle`, and everything added in Task 2.

- [ ] **Step 5: Fix the broken lint script in `package.json`**

Change:

```json
"lint": "next lint"
```

to:

```json
"lint": "eslint ."
```

`next lint` was removed in Next.js 16 and this repo runs 16.2.10, so the current script fails regardless of this redesign.

- [ ] **Step 6: Verify**

```bash
bun run build
bun run lint          # now works — this is the check that Step 5 landed
```

Both must exit 0. Then confirm the deleted routes are gone:

```
http://localhost:3000/awards     -> 404
http://localhost:3000/github     -> 404
http://localhost:3000/settings   -> 404
```

Walk all eight live routes once more in both themes to confirm nothing lost its styling.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: remove the VS Code shell, dead routes, and orphaned styles

Deletes 15 components, 2 lib modules, 3 routes, and 18 stylesheets left
over from the editor-metaphor design. Also fixes the lint script: next
lint was removed in Next.js 16."
```

---

### Task 11: Metadata, SEO, and final sweep

**Files:**
- Modify: `app/layout.tsx` (metadata block only)
- Modify: `package.json` (`name` field)
- Create: `public/og.png`
- Modify: `README.md`

**Interfaces:**
- Consumes: the finished pages from Tasks 3–9.
- Produces: the finished site.

- [ ] **Step 1: Create the Open Graph image**

The current OG image is `https://imgur.com/JXJ9mpO.gif` — an animation of the VS Code interface that no longer exists, hosted off-site. Replace it with a local 1200×630 PNG at `public/og.png`.

Simplest correct source: screenshot the new home page at 1200×630 in the browser and save it as `public/og.png`. Any 1200×630 PNG showing the new design is acceptable; do not link to an external host.

- [ ] **Step 2: Update the metadata block in `app/layout.tsx`**

Replace the `metadata` export written in Task 1 with the full version:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://ibrahim-khadraoui-portfolio-seven.vercel.app'),
  title: {
    default: 'Ibrahim Khadraoui | AI / ML Systems Engineer',
    template: 'Ibrahim Khadraoui | %s',
  },
  description:
    'Ibrahim Khadraoui is an AI / ML systems engineer working on edge inference and embodied AI — taking research models to production on robots and edge devices.',
  keywords: [
    'ibrahim khadraoui',
    'ai systems engineer',
    'ml systems engineer',
    'edge inference',
    'embodied ai',
    'vision language action',
    'llama.cpp',
    'tensorrt',
    'mlx',
    'robotics engineer',
    'embedded systems engineer',
    'pcb design',
    'hdelectronics',
  ],
  openGraph: {
    type: 'website',
    title: 'Ibrahim Khadraoui | AI / ML Systems Engineer',
    description:
      'Edge inference and embodied AI — taking research models to production on robots and edge devices.',
    url: '/',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ibrahim Khadraoui | AI / ML Systems Engineer',
    description:
      'Edge inference and embodied AI — taking research models to production on robots and edge devices.',
    images: ['/og.png'],
  },
};
```

If the deployed domain differs from the URL above, use the real one — `metadataBase` must match the production origin or OG image URLs resolve wrong.

- [ ] **Step 3: Rename the package and update the README**

In `package.json`, change `"name": "vscode-portfolio"` to `"name": "ibrahim-portfolio"`.

In `README.md`, remove descriptions of the VS Code interface (sidebar, tabs, command palette, terminal, theme switcher) and describe the current site instead. Keep any license and attribution sections intact.

- [ ] **Step 4: Run the full verification sweep**

```bash
bun run build
bun run lint
grep -rin "vscode" --include="*.ts" --include="*.tsx" --include="*.css" --include="*.json" \
  app components data lib styles types package.json
```

The grep must return no results. (`docs/` and `README.md` may still mention it historically; the check above deliberately excludes them.)

Then on `bun run dev`, walk every route at 375px and 1440px in **both** themes:

```
/  /projects  /projects/uav-xr  /experience  /articles
/articles/atc-aerial-traffic-control  /about  /contact
/projects/does-not-exist  (404)  /articles/does-not-exist  (404)
```

Confirm for each: no horizontal scrollbar at 375px, header nav wraps rather than overflows, all text meets contrast against its background in both themes, and no console errors.

- [ ] **Step 5: Commit and open the pull request**

```bash
git add app/layout.tsx package.json public/og.png README.md
git commit -m "feat(seo): reposition metadata for AI/ML systems engineering

Replaces the off-site imgur OG image with a local og.png, updates
keywords from PCB-only to AI/ML plus embedded, and renames the package."

git push -u origin redesign
gh pr create --title "Replace VS Code portfolio UI with a simple centered-column site" \
  --body "Implements docs/superpowers/specs/2026-07-30-simple-portfolio-redesign-design.md"
```

Review the Vercel preview deployment before merging.

---

## Post-merge follow-ups (not in scope)

- The old `/awards`, `/github`, and `/settings` URLs 404 by design — no redirects, since nothing external links to them. If search console later shows traffic, add redirects in `next.config.ts`.
- `data/projects.ts` has uncommitted local modifications predating this work. They are unrelated to the redesign; handle them separately.
