# Site audit

Audit date: 2026-10-26. The repository root does not contain `AYRIX_HTML_CSS_WORLD_PROMPT.md`; this audit uses the complete specification supplied in the task.

## Repository and deployment

- Published site is committed under `public/`; `.github/workflows/deploy-static.yaml` deploys that directory to GitHub Pages from `master` with Actions.
- Custom domain files exist at `/CNAME` and `public/CNAME`; add `.nojekyll` to the published tree during the plain HTML transition.
- There are 74 HTML documents under `public/`: home, about, contact, 404, publications and archive pages, post pages, paginated taxonomy pages, and redirect pages.
- There are 11 article pages under `/posts/<slug>/` (excluding `/posts/` and pagination). Existing article folders are retained.
- CSS: six hashed legacy stylesheets plus `ayrix-studio.css`, `ayrix-redesign.css`, and `ayrix-motion.css` in `public/assets/css/`. JS: `signal-loader.js` (third-party signal loader) plus repository Python helper scripts.
- Images: PNG banners/covers and SVG topic logos; no local fonts. Largest existing images are five cover PNGs between 1.4 and 1.9 MB; Claude/Codex banners are about 0.4 MB. No AVIF/WebP variants.
- Hugo leftovers: `.hugo_build.lock`, `layouts/`, Hugo logo, Hugo content guide/category/tags, and generator metadata on home. The existing deployment itself ships prebuilt static HTML.
- Existing sitemap has `//localhost:1313/` URLs, so it is invalid for production. RSS exists at `/index.xml`; taxonomy and post feed XML files exist. `robots.txt` points to the sitemap. A 404 exists.

## Article inventory

The static output contains these article slugs (the exact published titles and dates are present in each page head; taxonomy assignments are embedded in the post footer/metadata):

| Title | Slug | Date | Category | Tags |
|---|---|---|---|---|
| Welcome to Ayrix — Developer Guides & Tutorials | `welcome-to-aayrix-blog` | 2026-06-01 | welcome | welcome, blog, developer, tutorials |
| How to Install Arch Linux — Complete Step-by-Step Guide | `install-arch-linux-complete-guide` | 2026-06-02 | arch-linux | arch-linux, linux, installation, guide, terminal |
| GitHub CLI (gh) — Complete Guide with Copy-Paste Commands | `github-cli-complete-guide` | 2026-06-03 | github | github, github-cli, gh, terminal, devtools |
| How to Make Hugo Pages — Complete Guide with All Commands | `hugo-pages-complete-guide` | 2026-06-04 | hugo | hugo, static-site, github-pages, webdev, markdown |
| GitHub — Full Install & Usage Guide with All Commands | `github-install-and-usage-guide` | 2026-06-05 | github | github, git, version-control, ssh, devtools |
| How to Install Ubuntu — Complete Step-by-Step Guide | `install-ubuntu-complete-guide` | 2026-06-06 | ubuntu | ubuntu, linux, installation, guide, terminal |
| My First Post | `my-first-post` | 2026-06-08 | introduction | introduction, blog |
| Install & Configure Codex CLI on Ubuntu — Ayrix | `codex-cli-ubuntu-guide` | 2026-08-29 | ai-tools | codex-cli, ubuntu, linux, ai, installation |
| Cursor AI — Complete Developer Guide for Linux | `cursor-ai-complete-developer-guide` | 2026-08-29 | cursor | cursor, ai, devtools, guide, tutorials |
| How to Install Claude Code on Ubuntu: Complete CLI Guide | `claude-code-ubuntu-cli-guide` | 2026-09-05 | ai-tools | claude-code, ubuntu, linux, ai, installation |
| How to Install Codex CLI and Connect Your OpenAI Account on Ubuntu | `codex-cli-ubuntu-openai-agent-guide` | 2026-09-05 | ai-tools | codex-cli, ubuntu, linux, ai, openai |

The source is already flattened output, so authoritative source front matter is unavailable. A manifest will be derived from the published HTML while preserving article bodies and URLs.

## Baseline and known issues

- `public/` is approximately 11 MB; images account for about 9.2 MB. Individual article HTML ranges from roughly 48–60 KB. No browser/Lighthouse baseline was available in this audit.
- Homepage live fetch: title is just “Ayrix”; raw `{year}` appears; “a Artificial Intelligence”; email appears in HTML; 10+ guides in visible copy while 6+ appears in metadata; metadata theme color is `#17251d` while site theme uses `#07111f`.
- Many pages have Hugo generator metadata, external Google Fonts requests, duplicated signals script, inconsistent metadata/theme colors, and old `aayrix.github.io` share URLs. The site advertises Hugo as a current domain although the site is transitioning away from it.
- Page markup repeats header/footer and head metadata across the generated documents. Exact repetition count has not been computed; effectively all published pages are generated copies.
- Production sitemap is broken (`//localhost:1313`). Plain HTML source, `.nojekyll`, content CSP, comprehensive link/accessibility audits, and image optimization are absent.
- No baseline browser console, keyboard, layout-shift, or mobile layout testing was available in this environment.

## Priorities

1. Remove remote signal/font requests and stale generator metadata; fix year, email exposure, grammar, brand/count inconsistencies, page metadata, theme colors, and sitemap.
2. Keep all existing URLs and article content; build maintainable plain HTML tooling around the current published output.
3. Add accessibility and performance improvements with progressive enhancement; identify unavailable verification clearly.

## Tooling decision

Treat `public/` as the actual authorable static site because no Hugo content source or requested prompt file is present. Preserve all files and paths. Add a zero-dependency Node build/check entry point and manifest, and keep generated HTML committed for GitHub Pages. Avoid adding third-party runtime or dev dependencies until a local package/dependency install is authorized and available. Document the limitations of starting from generated output in `DESIGN_DECISIONS.md`.
