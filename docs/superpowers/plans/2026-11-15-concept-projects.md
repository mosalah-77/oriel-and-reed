# Studio introduction and concept projects

Approved continuation of the guided portfolio build. Preserve the user's `2.5rem` hero gap and `-8px` title travel.

## Scope

Add the short studio introduction and three concept previews after the hero. Use one wide preview followed by two smaller previews. Supply working detail links through one reusable template and a simple Projects index. All work is fictional; licensed images are references, with source attribution. Filtering, the image viewer, services, process and contact remain later milestones.

Affected files: `src/App.tsx`, `src/styles.css`, new `src/projects.ts`, local image variants, page tests, asset credits, README and learning documentation. Existing header, mobile menu, hero motion and unfinished route behavior must keep working. No dependency, server endpoint or external script is needed.

## Implementation and checks

1. Add route and content checks for the three previews, detail pages and invalid project paths. Run `npm test`; expect the new checks to fail before implementation.
2. Create the shared project data, preview component and detail template. Add responsive CSS using the existing fonts, colors and gutters. Use local WebP images, explicit dimensions, lazy loading below the fold and normal links. Run tests and the production build; expect both to pass.
3. Inspect desktop and mobile, keyboard activation, image loading, route navigation and hero motion. Run the existing local production performance check. Request one independent review of this milestone.
4. Record the evidence and authorship. Show the running result and one exercise: edit a project summary and see it update in both lists.

## Decisions

- Use normal links and the existing path dispatch. Three static project entries do not need a router or CMS.
- Images are cropped and encoded locally from verified Unsplash sources. The kitchen image is a render and is labelled accordingly.
- There is no Git repository here, so the plan and learning log carry the review record; no branch or commit is created in another project.

## Progress

- Source licences verified; responsive images prepared at 640, 1280 and 1920px. Largest new file: 298,230 bytes.
- The new homepage/index and detail checks failed before implementation. All six tests passed after implementation; TypeScript and the production build passed.
- Browser checks passed at 320, 390, 768, 1024 and 1440px without horizontal overflow. Keyboard focus reached the first card with a visible outline; Enter opened the kitchen detail, and its back link opened the index. All four homepage images loaded.
- Hero regression check at 1440px reached `translateY(-8px)` while retaining its layout dimensions. The mobile eligibility check remained static. No browser errors or warnings were recorded.
- Taste's production performance check passed with zero failures or warnings, layout shift, long tasks and broken requests. Raw evidence: `docs/previews/concepts-performance.json`.
- Independent review found no blocking correctness or security issues. A screenshot capture-state artifact was removed by recapturing from the top without keyboard focus.
- Final: minor (deferred): project pages still use the common document title. Add specific browser titles in the page-metadata pass.
- Review limits: the reviewer inspected source and saved evidence; the implementer performed the live checks and licence verification. Public-host fallback routing and physical devices remain untested.
- Complete: running preview, asset credits, learning notes and one practical exercise are ready.
