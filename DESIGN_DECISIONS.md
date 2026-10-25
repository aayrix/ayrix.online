# Design decisions

- The repository has Hugo-rendered HTML under `public/`, no Hugo content source, and no requested prompt file. Keep `public/` as the source of truth for the transition, so no post content or current directory URL must be reconstructed or discarded.
- GitHub Actions already deploys `public/` from `master`. Keep that deploy model and commit generated static output; build checks run before upload.
- Build tooling starts with Node's built-in modules only. This avoids adding package downloads and runtime dependencies while the current repo's inputs are rendered pages. A script-generated manifest records the current article metadata.
- Existing articles about Hugo remain available as historical guides. Hugo itself is removed from active metadata and the site's stated technical domains.
- The requested high-end design and motion components are being applied progressively. Motion remains optional enhancement; initial improvements prioritize privacy, accessibility, and broken metadata/feed issues.
- Browser/Lighthouse validation and a real-phone visual review are unavailable from the present shell environment; these are reported as NOT VERIFIED rather than inferred.
