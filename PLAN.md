# PLAN — Ayrix redesign backlog

| ID | Task | Status | Acceptance test |
|----|------|--------|-----------------|
| T01 | Branch `redesign` + state files | done | SPEC/PLAN/PROGRESS/SCORECARD/DECISIONS exist |
| T02 | Custom theme scaffold: tokens, baseof, shell nav | doing | `hugo --minify` zero errors; all kinds render |
| T03 | Restore missing post markdown from `master` slugs | todo | All live slugs have `content/posts/*.md` |
| T04 | Hugo build in GitHub Actions (not raw `public/`) | todo | Workflow runs `hugo --minify`, uploads `public/` |
| T05 | JS bundle: ES modules, vendored GSAP/Lenis | todo | `hugo` builds; gzip main ≤150KB |
| T06 | View Transitions + fetch fallback router | todo | Nav between pages animates; fallback without VT API |
| T07 | Home boot sequence + split hero | todo | Skippable once/session; reduced-motion skips |
| T08 | Home interactive terminal | todo | help/guides/about/contact commands work |
| T09 | Home bento + Hugo-driven counters | todo | Counts match `.Site.RegularPages` in posts |
| T10 | Publications list + Flip filters | todo | Category/tag filter animates without layout jump |
| T11 | Guide: TOC spy, progress, prev/next | todo | Sticky TOC highlights; progress bar updates |
| T12 | Code blocks: copy + Copied animation | todo | Keyboard + click copy; visible feedback |
| T13 | Callout shortcodes | todo | `note`/`warn`/`tip` render in guides |
| T14 | Command palette + Pagefind | todo | Ctrl/Cmd+K search finds guides |
| T15 | Theme toggle circular reveal | todo | Light/dark persists; reveal from click point |
| T16 | Mobile menu motion | todo | Focus trap; escape closes |
| T17 | Shared-element card → article header | todo | Home guide click morphs title/cover |
| T18 | Clip-path wipe from click position | todo | Same on internal links |
| T19 | 404 command-not-found | todo | `/nope` shows terminal 404 |
| T20 | Light theme polish | todo | AA contrast on both themes |
| T21 | Reduced-motion + no-JS pass | todo | Core content readable JS off |
| T22 | README (run, add guide, customize) | todo | README sections present |
| T23 | Lighthouse CI on Home, Posts, one guide | todo | Targets in SPEC met (measured) |
| T24 | Link checker + slug audit | todo | No broken internal links |
| T25 | Fix `{year}` site-wide | todo | Footer shows current year, not literal |
