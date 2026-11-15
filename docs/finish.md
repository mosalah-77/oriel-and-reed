# Finishing check — November 16, 2026

The first version is complete as a local portfolio demo. Its four main pages, three concept pages, filters, viewer and controlled consultation flow are implemented. The earlier [twelve-pass audit](verification-loop.md) remains the full verification record; the checks below cover the small finishing changes.

## Finishing changes

- Added the brief's remaining section entrances: 8px of CSS movement on eligible desktops, with fully visible content and static mobile/reduced-motion fallbacks.
- Reworked the README around setup, features, evidence, ownership and the form's limits. All six guided user edits remain intact.
- Added `.nvmrc`, a Node engine requirement and a GitHub Actions workflow for installation, tests and build. Action versions are pinned by commit and the workflow has read-only repository permissions.
- Excluded dependencies, build output, private receipts, environment files, keys and release scratch files from Git. Normalised local machine paths in the saved test transcript and removed a machine-specific attachment reference from a historical plan.

## Checks performed

| Check | Result |
| --- | --- |
| Automated suite | 24 tests passed, including real HTTP validation, timeout, retry and protected-file checks |
| TypeScript and production build | Passed; JavaScript 213.63 kB (66.86 kB gzip), CSS 16.24 kB (4.02 kB gzip) |
| Fresh setup | Copied only source/configuration/assets/tests into an isolated folder; `npm ci`, all 24 tests and `npm run build` passed |
| Desktop motion | Section entrance moved from 8px to 0px at 900px scroll and reversed when returning to the top; layout dimensions remained stable |
| Mobile fallback | At 390px, the hero and all nine selected homepage elements had no animation or transform |
| Reduced-motion view | Inspected a full production-page capture with reduced motion enabled; all sections remained visible |
| Shared studio sections | Seven selected elements used the same entrance rules; browser error/warning log was empty |
| Homepage performance | Three production loads at each of 1440px and 390px; zero failures, warnings, layout shifts, long tasks and broken requests |

The fresh install used Node 26.6.0 and npm 11.18.0 on macOS. The offline attempt found an incomplete package cache; downloading the pinned packages from npm succeeded. npm reported zero known vulnerabilities and an unapproved optional `fsevents` install script; installation, tests and build succeeded without approving it. Linux/Node 22 execution is left to the repository workflow.

The final homepage transferred 751.8 KiB at desktop width and 288.4 KiB at phone width in the local checker. The older seven-route report and these homepage results use different local serving runs; small differences are not field performance improvements.

Evidence: [motion values](previews/finish-motion.json), [performance report](previews/finish-performance.json), [desktop preview](previews/finish-home-desktop.png), [phone preview](previews/finish-home-mobile.png), [reduced-motion capture](previews/finish-reduced.png).

## Handoff and limits

Use `npm run dev` for editing and `npm run preview` after building to review the generated site. Use fictional form details. No email is sent, no appointment is booked and no public submission service is configured.

Physical-device testing, screen-reader speech, Safari, Firefox and public-host routing remain unchecked. The audit tools and viewport emulation do not establish full accessibility conformance. A public deployment must handle the form's demo status and route fallback explicitly.

The project has not been added to a résumé. Its [contribution log](learning-log.md) records the user's guided edits separately from AI implementation and verification.

## One small exercise

In the project folder, run:

```sh
git log -1 --oneline
```

The short identifier names the latest commit: a saved snapshot of the tracked files. `.gitignore` keeps dependencies and private form receipts out of that snapshot. Editing a file changes the working copy; it does not rewrite the saved commit.
