# Ayrix.online redesign — SPEC (fixed goal)

## Stack
Hugo (custom theme `ayrix`), vanilla ES modules, CSS variables, GSAP (+ ScrollTrigger, Flip), Lenis, CSS View Transitions API with fetch-and-swap fallback, Pagefind or Fuse.js for search. Deploy via GitHub Actions to GitHub Pages. No backend, no paid services.

## Content & IA
Keep all existing content, slugs (`/posts/<slug>/`), sections: Home, Publications, Tags, Categories, About, Contact. Do not invent guide content.

## Design
Dark “terminal meets spaceship” (`#07111f` base, electric green/cyan accent) + light theme. Display font + JetBrains Mono. Bento homepage. Sticky side nav (desktop) / bottom tab bar (mobile). Design tokens: color, spacing, radius, easing, duration.

## Must-have features
a) Consistent transition language: shared-element morph card→article header, clip-path wipe from click, staggered entrance, sliding nav underline, persistent logo.

b) Component transitions: theme toggle (circular reveal), mobile menu, filters (GSAP Flip), command palette (Ctrl/Cmd+K), tabs, accordions.

c) Home: boot-sequence intro (once/session, skippable), split-text hero, live typing terminal demo, animated counters from Hugo data, bento featured guides, pinned Technical Domains, footer with dynamic year.

d) Guide page: sticky TOC + scroll-spy, reading progress, read time, code copy + “Copied!” animation, callout shortcodes, prev/next.

e) Interactive homepage terminal (help, guides, about, contact); 404 “command not found”.

## Quality bar
Lighthouse mobile: Perf ≥90, A11y 100, BP 100, SEO 100. Animate transform/opacity only. `prefers-reduced-motion`. Works without JS. WCAG AA. 320px–4K. JS ≤150 KB gzipped (excluding lazy chunks).

## Clarifications (append-only)
- 2026-09-24: Resumed on branch `redesign` from `website-version`; `master` currently deploys prebuilt `public/` only.
