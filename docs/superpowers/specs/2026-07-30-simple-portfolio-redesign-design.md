# Simple Portfolio Redesign — Design

**Date:** 2026-07-30
**Status:** Approved for planning
**Repo:** vscode-portfolio (Next.js 16, React 19, TypeScript, CSS Modules)

## Problem

The current portfolio renders as a VS Code clone: sidebar, title bar, tab bar, bottom bar, file explorer, command palette, and terminal. Visitors have to learn the metaphor before they can read the content, and most never find the projects. The site also still positions the author as an embedded systems engineer, while the current CV positions him as a Senior AI / ML Systems Engineer working on edge inference and embodied AI.

## Goal

Replace the VS Code interface with a simple, text-first, centered-column site in the spirit of https://amankumar.ai — a visitor should reach any piece of content in one click and read it without decoding a metaphor. Re-anchor the site's positioning on AI/ML systems work, with hardware as the foundation of that story.

## Decisions

| Decision | Choice |
|---|---|
| Old VS Code UI | Deleted entirely (recoverable from git history) |
| Page set | Home, Projects, Experience, Articles, About, Contact |
| Visual direction | Reference site's bones, own identity; text-first, images where they earn their place |
| Styling | CSS Modules + CSS-variable design tokens (no new dependencies) |
| Theme | Dark default, light toggle, persisted in localStorage |
| Accent | Electric blue / cyan |
| Positioning | AI/ML systems engineer (edge inference, embodied AI); hardware as depth |
| Awards | Folded into About |
| GitHub calendar | Folded into About; `/github` page deleted |
| Rollout | Feature branch, big-bang merge |

## Architecture

### Routes

Eight routes total, six static pages plus two dynamic detail routes.

| Route | Content source | Purpose |
|---|---|---|
| `/` | `data/profile.ts`, first 3 of `data/projects.ts`, first 2 of `data/articles.ts` | Hero, selected work, latest writing, links |
| `/experience` | `data/experience.ts`, `data/education.ts` | Career timeline, education, resume link |
| `/projects` | `data/projects.ts` | Filterable grid of project cards |
| `/projects/[slug]` | `data/projects.ts` | Full write-up and media gallery |
| `/articles` | `data/articles.ts` | Article list |
| `/articles/[slug]` | `data/articles.ts` | Long-form reader |
| `/about` | `data/about.ts`, `data/publications.ts`, `data/awards.ts` | Bio, skills, publications, recognition, GitHub activity, languages |
| `/contact` | `data/profile.ts` | Channels to reach the author |

Removed routes: `/awards`, `/github`, `/settings`.

### Components

Three new shell components, each with one job:

- `components/SiteHeader.tsx` — wordmark (`Ibrahim|`), nav links, theme toggle. Sticky at the top. On narrow viewports the nav stays a single wrapping row of short labels; no hamburger drawer.
- `components/SiteFooter.tsx` — social links and a short "built with" line.
- `components/Container.tsx` — the single layout primitive: a centered column, `max-width: 720px`, consistent horizontal padding. Every page composes with it.

One new content component:

- `components/ContentBlocks.tsx` — renders `ContentBlock[]` (`h2 | h3 | h4 | p | li | img | video`). Today this switch statement is duplicated in `app/projects/[slug]/page.tsx` and `app/articles/[slug]/page.tsx`; both consume the shared component instead. Consecutive `li` blocks are grouped into a single `<ul>`.

Kept and restyled: `ProjectCard.tsx`, `WPArticleCard.tsx`.

Deleted components: `Layout`, `Sidebar`, `Titlebar`, `Tabsbar`, `Tab`, `Bottombar`, `Explorer`, `CommandPalette`, `Terminal`, `ThemeInfo`, `Breadcrumbs`, `Illustration`, `ContactCode`, `ArticleCard`, `RepoCard`. Deleted lib: `lib/files.ts`, `lib/themes.ts`. Their `.module.css` files go with them: about 1,900 of the repo's 3,527 CSS lines are deleted outright, and most of the remaining ~1,600 (the page modules) are rewritten against the new tokens.

### Data layer

`data/projects.ts`, `data/articles.ts`, and `data/awards.ts` are not modified. The redesign is a presentation-layer change; the largest and most valuable content carries over untouched.

New data files, all plain typed arrays with no runtime logic:

```ts
// data/profile.ts
export const profile: Profile; // name, tagline, shortBio, socials[], email, resumeUrl

// data/experience.ts
export const experience: Experience[];

// data/education.ts
export const education: Education[];

// data/publications.ts
export const publications: Publication[];

// data/about.ts
export const about: About; // bioParagraphs[], skillGroups[], languages[]
```

New types in `types/index.ts`:

```ts
export interface SocialLink { label: string; url: string; icon: string; }

export interface Profile {
  name: string;
  tagline: string;
  shortBio: string;
  email: string;
  resumeUrl: string;
  socials: SocialLink[];
}

export interface ExperienceRole { title: string; period: string; }

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

export interface SkillGroup { label: string; items: string[]; }

export interface About {
  bioParagraphs: string[];
  skillGroups: SkillGroup[];
  languages: string[];
}
```

Date formats follow existing repo convention: human-readable strings in `period` and `date` fields on experience, education, and publications (for example `"Mar 2022 – Present"`, `"September 2021"`, `"July 2025"`), and the existing ISO `YYYY-MM-DD` format stays as-is in `data/articles.ts`.

Types removed with the pages that used them: `Article` (the DEV.to shape — articles actually use `WPArticle`), `Repo`, `User`.

The `Experience` shape is driven by the real CV: the TII entry has three nested role titles (Senior AI Engineer, AI Engineer, Research Engineer) under one company and period, and two focus blocks (Edge AI & Embodied Intelligence, 2024–present; UAV, Immersive & Streaming Systems, 2022–2024). `roles[]` and `focuses[]` exist to express exactly that without special-casing.

Content for the new data files is transcribed from `ressources_for_CV/CV_Ibrahim_Khadraoui.md`.

## Visual system

### Tokens

A single `styles/tokens.css` defines CSS custom properties on `:root`, overridden under `[data-theme='light']`.

```
--bg          #0b0d10   light: #ffffff
--bg-subtle   #14171c   light: #f6f7f9
--border      #23272e   light: #e4e7eb
--text        #e6e8ea   light: #15181c
--text-muted  #9aa1a9   light: #5c646d
--accent      #4cc9f0   light: #0284c7
```

The light-mode accent is darker than the dark-mode one so link text clears WCAG AA (4.5:1) against white. Accent is used for link hover, the active nav item, and tag borders — never for body text.

### Typography

Two families, both self-hosted through `next/font` (no external CDN request):

- `--font-sans`: Inter — all readable text.
- `--font-mono`: JetBrains Mono — wordmark, dates, tags, inline code. The only carryover from the old identity.

Type scale, four steps: `2rem`, `1.25rem`, `1rem`, `0.875rem`. Line height 1.65 for body, 1.2 for headings. Body copy is capped at `68ch` inside the 720px container.

### Spacing

4px base. Tokens `--s1` through `--s6` map to 4, 8, 16, 24, 48, 80px. Vertical gap between page sections is `--s6`.

### Motion

Deliberately near-zero: 150ms color transitions on hover, nothing else. No scroll-triggered animation, no reveal effects. There is nothing for `prefers-reduced-motion` to disable.

### Theme toggle

Reuses the existing inline pre-paint script pattern in `app/layout.tsx` (reads localStorage before first paint to avoid a flash of the wrong theme), reduced from eight VS Code themes to `dark | light`. Default is dark when no preference is stored. The script is wrapped so a blocked or throwing `localStorage` falls back to dark instead of breaking the page.

### Images

`next/image` is used for project and article card thumbnails, where intrinsic sizes are known. Detail-page galleries and `ContentBlock` images keep native `<img>`, because `ContentBlock.src` carries no dimensions and there is no value in inventing them. Videos remain `<video controls preload="metadata">`.

## Page layouts

### `/` — Home

Hero (name, one-line positioning, two-sentence bio), then *Selected work* as three project cards, then *Latest writing* as two article rows, then a compact row of links. Nothing else. A visitor should get the whole picture in about a screen and a half.

### `/experience`

A changelog-style timeline. Each entry shows company, role, and date range in a muted mono meta line, followed by bullets and a row of tag pills. TII renders as one entry containing its three nested role titles and two focus blocks. Freelance PCB Design & Embedded (2018–2022) follows. Below the timeline: an Education section with both degrees, then a "View full resume" link to the PDF.

The resume PDF is copied from `ressources_for_CV/CV_Ibrahim_Khadraoui.pdf` to `public/` so it is served as a static asset. `ressources_for_CV/` itself stays out of the deployed site.

### `/projects`

Heading, then a category filter rendered as a plain row of text buttons (`all`, `professional`, `hardware`, `hobby`, `open-source`) driven by the existing `Project.category` field. Filtering is client-side component state; it does not sync to the URL. Then a two-column card grid that collapses to one column below 700px.

### `/projects/[slug]` and `/articles/[slug]`

The same skeleton: back link, title, meta line, `<ContentBlocks />`. Project pages additionally render the media gallery from `images[]` and `videos[]`; article pages do not. Both routes keep their existing `generateStaticParams` and `notFound()` behavior for unknown slugs.

### `/about`

Bio in first person (longer than the home page version), skills grouped by the CV's categories, publications (six entries, linked, mono dates), recognition and awards from `data/awards.ts`, the GitHub contribution calendar via the existing `react-github-calendar` dependency, and languages.

### `/contact`

Heading, one line of copy, and a list of channels: email, GitHub, LinkedIn, ResearchGate. No form and no backend.

## Metadata and SEO

- Root metadata in `app/layout.tsx` is rewritten for the AI/ML systems positioning. The keyword list, currently PCB- and VS Code-oriented, is replaced with terms matching the new positioning while retaining the name variants.
- Every page exports its own `metadata` with a distinct title and description.
- The Open Graph image currently points at an imgur GIF of the VS Code interface. It is replaced with a static image committed to `public/`.
- The `vscode-portfolio` package name and any remaining copy referencing the editor metaphor are updated.

## Verification

The repo has no test framework, and this is a statically generated content site with no business logic. Adding Vitest or Playwright for this change is not justified; verification is build-, lint-, and inspection-based instead.

Done means all of the following hold:

1. `bun run build` completes with no type errors and no Next.js route errors.
2. Lint is clean. Note: `next lint` was removed in Next.js 16, and this repo runs 16.2.10, so the existing `"lint": "next lint"` script in `package.json` is already broken. It is replaced with `"lint": "eslint ."` as part of this work; `eslint.config.mjs` (flat config, `next/core-web-vitals` + `next/typescript`) needs no change.
3. All eight routes render correctly at 375px and 1440px, in both dark and light themes, checked via the project's `verify` skill.
4. An unknown project or article slug returns the 404 page.
5. No file imports a deleted component, and no orphaned `.module.css` remains.
6. `grep -ri "vscode" --exclude-dir=node_modules --exclude-dir=.git` returns nothing outside of documentation and this design document.
7. Light-mode and dark-mode text/background pairs meet WCAG AA contrast.

## Out of scope

- Rewriting project or article content; only presentation changes.
- A CMS or MDX migration; content stays in typed TypeScript files.
- Search, comments, analytics beyond the existing Vercel Analytics, or i18n.
- Any redirect layer for `/awards`, `/github`, and `/settings`; those URLs are not externally linked and will simply 404.
