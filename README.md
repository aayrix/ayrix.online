# Ayrix

Ayrix is a static technical publication hosted at [ayrix.online](https://ayrix.online). Published pages live in `public/` and use directory-style URLs. The existing guides remain as static HTML so current URLs and article text stay intact.

## Local preview

With Node.js 22 or a recent Python installed:

```sh
node tools/build.mjs
node tools/check.mjs
python3 -m http.server 8000 --directory public
```

Open `http://localhost:8000/`. The GitHub Actions workflow publishes `public/` from `master` after the static checks pass.

## Updating a guide

The current repository contains rendered HTML rather than source markdown/front matter. Edit the corresponding `public/posts/<slug>/index.html` and retain its folder path. Then run the build and check commands above. `data/posts.json` is generated from article metadata when `node tools/build.mjs` runs; do not edit it as the canonical content source. New articles should use an existing article page as a template and register under `public/posts/<new-slug>/index.html`.

## Project notes

See [SITE_AUDIT.md](SITE_AUDIT.md), [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md), and [CONTENT_REVIEW.md](CONTENT_REVIEW.md) for transition details and outstanding verification.
