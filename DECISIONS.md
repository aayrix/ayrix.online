# DECISIONS

## 2026-09-24 — Source of truth
- **Choice:** Develop on branch `redesign` from `website-version` (full Hugo tree), not `master` (prebuilt `public/` only).
- **Why:** SPEC requires Hugo custom theme and CI build; editing generated HTML would fork content and break slugs.

## 2026-09-24 — Theme name `ayrix`
- **Choice:** New theme at `themes/ayrix/` rather than extending PaperMod indefinitely.
- **Why:** SPEC demands custom theme, design tokens, and transition shell; PaperMod layout conflicts with bento/side-nav app shell.

## 2026-09-24 — Incremental JS
- **Choice:** Start with minimal vanilla module (`theme.js`) for shell behavior; add GSAP/Lenis in T05.
- **Why:** Keep iteration 1 reviewable; meet progressive enhancement before heavy motion deps.
