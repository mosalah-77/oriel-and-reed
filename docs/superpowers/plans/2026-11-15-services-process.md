# Services and process

Add the next two homepage sections in the approved order: services after selected concepts, then the process from consultation to design proposal. Reuse the sections on `/studio` with a short introduction so Services/About has a working destination. Preserve all three user edits: hero gap, title travel and first project summary.

## Design and scope

The services section uses the existing olive accent as its background, with ivory text and three plain rows: space planning, interior design, furnishing and styling. The process returns to the ivory background and uses an ordered list of three steps. On desktop the steps sit in three columns; below 800px they stack. No extra image, icon, animation, dependency or contact mechanism is needed.

Affected files: `src/App.tsx`, `src/styles.css`, page tests, README and learning documentation. The `/studio` placeholder becomes a page, so the placeholder test must narrow to `/contact`. Existing project routes, hero, mobile menu and unknown-path handling remain intact. The closing invitation, contact flow, gallery interactions and per-page metadata stay outside this checkpoint.

## Steps and checks

1. Add one route/content test for the services, ordered process and homepage order. Expect it to fail before implementation.
2. Build two shared sections and the studio route; add responsive CSS using the existing tokens. Run `npm test` and `npm run build`; expect both to pass.
3. Inspect the homepage and studio page at desktop and phone sizes, verify headings, mobile navigation, content order and overflow. Check contrast on the olive background and run the local production performance check.
4. Have one fresh reviewer inspect the source and saved screenshots. Record results and provide one exercise changing the process grid's gap.

## Progress

- Confirmed the user's first project summary now reads: “An olive sofa and a reading chair beside the afternoon light.”
- Added shared service/process sections and the `/studio` route. The new test failed for missing services before implementation; all seven tests then passed. TypeScript and the production build passed.
- Desktop and phone screenshots are saved in `docs/previews/services-studio-desktop.jpg` and `services-studio-mobile.jpg`. The studio page has no horizontal overflow at 320, 390, 768, 1024, 1280 and 1440px. Homepage section order and its static phone hero were also checked.
- Enter activated Services/About from both desktop navigation and the mobile menu. After navigation the dialog was closed and body scrolling restored. The skip link focused `main`. No browser errors or warnings were recorded.
- Ivory on olive measures 6.58:1. The local production performance check reports zero failures, warnings, long tasks, layout shift or broken requests. Raw report: `docs/previews/services-performance.json`.
- A fresh reviewer inspected the source, tests, docs, four screenshots and performance report. No code fixes were recommended. The reminder to finish this plan and the learning log has been resolved.
- Deferred scope remains unchanged: per-page metadata, gallery interactions, closing invitation and contact. Public-host routing and physical-device, screen-reader, Safari and Firefox behavior are not established by these checks.
- Complete: learning exercise and contribution log updated; local preview ready.
