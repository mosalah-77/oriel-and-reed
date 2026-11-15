# Twelve-pass verification loop — November 15–16, 2026

Scope: accessibility, responsiveness, performance and security for the local Oriel & Reed portfolio. Twelve distinct passes were completed, with focused regressions after fixes. Seven issues were corrected. This is a local verification record, not a public deployment or accessibility certification.

All six user edits are preserved: hero gap `2.5rem`, title travel `-8px`, the olive-room summary, process gap `3rem`, message minimum `30`, and room label `Sitting room`.

| Pass | Scope | Result and evidence |
| --- | --- | --- |
| 1 | Baseline and routes | Baseline 18/18 tests passed. Final production checks loaded all seven content routes plus the missing-page view, each with one main heading and one descriptive title. No browser warnings or errors. [Route record](previews/verification-production-routes.json). |
| 2 | Automated accessibility and semantics | Local axe-core 4.11.4 scans report zero violations and zero incomplete checks across all eight routes at 1440px and 390px. The heading-order finding was fixed. [Desktop](previews/verification-axe-desktop.json), [phone](previews/verification-axe-mobile.json), [before](previews/verification-axe-before.json). |
| 3 | Keyboard navigation and focus | Skip link focuses main content; the form tabs through name, email, brief and submit. Menu and viewer wrap Tab/Shift+Tab, close with Escape, return focus and release scrolling. Crossing the desktop breakpoint closes the mobile menu. The menu’s initial reverse-Tab escape was reproduced and fixed. [Gallery keyboard record](previews/verification-gallery-keyboard.json). |
| 4 | Responsive layout | All eight routes at 320, 390, 768, 1024 and 1440px: 40 checks, no horizontal overflow or obscured first heading after Skip. Desktop/phone screenshots were visually reviewed. [Matrix](previews/verification-responsive.json). |
| 5 | Text enlargement and short screens | All eight routes at five widths with a 200% base font, plus 844×390 and 320×568 at normal text: 56 checks pass. Header/content wrapping and sticky-header skip offsets were corrected. Enlarged viewer text wraps normally; short-screen menu and viewer controls remain reachable. [Before](previews/verification-skip-before.json), [after](previews/verification-text-after.json), [landscape](previews/verification-viewer-landscape.json). |
| 6 | Motion and static fallbacks | Desktop scrolling from 0 to 225px changes the hero transforms, without changing layout dimensions; reversing restores the initial values. At 390px both transforms and animation names are `none`. A production capture with reduced motion emulated shows the static hero. Unsupported CSS support is guarded in source. [Measurements](previews/verification-motion.json), [reduced-motion capture](previews/verification-reduced-motion.png). |
| 7 | Gallery and image resilience | Sitting room, Kitchen, Bedroom and All rooms produce the right cards/counts and retain filter focus. All three images open; repeated opening/closing and the detail entry work. The missing-image fixture announces failure and returns focus/scrolling after close. [Keyboard/state evidence](previews/verification-gallery-keyboard.json), [failure evidence](previews/verification-image-failure.json). |
| 8 | Contact states and recovery | A 29-character brief is rejected. Slow submission disables the form and announces pending; one real synthetic receipt is saved with mode 0600 and success receives focus. Rejection and a nonresponding endpoint preserve the entered text and enable retry. Neither failure saves a receipt. The synthetic browser receipt was removed after verification. [State evidence](previews/verification-contact-states.json). |
| 9 | Homepage performance | Final production measurements use three loads at each of 1440px and 390px. No budget failures/warnings, measured layout shift, long tasks or broken requests. [Homepage report](previews/verification-home-performance.json). |
| 10 | Other-route performance | The same production checks cover Projects, Services/About, Contact and all three detail pages. Projects’ first visible image was initially lazy; prioritizing that image removes the warning, while home previews and later index images remain lazy. [Original finding](previews/verification-projects-performance-before.json), [final Projects report](previews/verification-projects-performance.json), [all-route summary](previews/verification-performance-summary.json). |
| 11 | Security and adversarial requests | Zero known dependency advisories. Integration checks cover validation, control characters, unknown fields, unsafe IDs, origin/host/method/content type, declared/chunked body limits, the five-second body deadline, interrupted uploads, rate limits, atomic duplicate/conflicting retries, private permissions and storage errors. Direct/raw and Vite filesystem requests cannot read receipts. Encoded separators return the empty app shell, not receipt data. No server implementation, receipts, test fixture or axe code in the build. [Dependency audit](previews/verification-dependency-audit.json), [build check](previews/verification-build-security.json). |
| 12 | Independent review and final regression | A separate read-only review confirmed the fixes and identified the sticky-header case that was then reproduced and corrected. Final review found no additional material issue. All 24 tests and TypeScript/build pass; the final 16 page accessibility scans and 96 layout/skip checks pass. [Test output](previews/verification-tests.txt). |

## Reproducible findings and fixes

1. **Skipped heading level on Projects.** Its h1 was followed by h3 card titles. Index cards now use h2; homepage cards retain h3 below their section heading. Styling covers both. The new test failed before the fix, then passed.
2. **Identical browser titles.** Every route used the homepage title. One React-managed title now uses the route or authored project title, including the missing-page view. Tests and browser checks confirm one title per document.
3. **Mobile-menu focus escape.** Shift+Tab from Close moved focus to the browser/body. The menu now reuses the image viewer’s small focus-wrap handler and explicitly focuses its opener before opening. Both directions, Escape, return focus and breakpoint cleanup passed.
4. **Overflow with enlarged text.** At 390px/200%, the wordmark pushed Menu off-screen and the process heading exceeded the page. At 320px/200%, long words also widened the services/closing layouts. Header/actions can wrap, the menu button does not shrink, and text may break inside a word when necessary. Standard-size layouts retain their approved composition.
5. **Cramped enlarged viewer title.** At 390px/200%, the Close button squeezed the title into a very narrow column. The heading row now wraps, giving the title and button usable lines.
6. **Skip content covered by a wrapped sticky header.** At 1440px/200%, the header measured 257px while the old scroll offset was 144px; the Projects heading began at 240px. A ResizeObserver now updates a CSS variable with the actual header height. Main/services/process scroll offsets use it. There is no scroll listener; the observer disconnects on cleanup. All 96 final layout checks also assert main focus and an unobscured first heading.
7. **Visible Projects image marked lazy.** Route-specific measurement found the first image above the fold at both sizes. It now uses the shared image component’s eager/high-priority option. A regression checks that later images and homepage project previews stay lazy.

The product changes are small: existing React/platform APIs, one shared focus handler, and CSS wrapping. Axe is development-only. No runtime package, delivery integration, animation framework or new product feature was added.

## Manual accessibility follow-up

The menu and invalid-contact states scan with zero violations/incomplete checks. The enlarged viewer scan has zero violations and one incomplete contrast rule covering its title and caption: axe could not resolve backgrounds where the modal overlaps the page. Their computed foreground/background colors were checked separately: ink on paper is **13.14:1**, muted caption on paper **4.94:1**. The title/caption sit on the opaque paper dialog. Controls and the enlarged heading were inspected visually. [Viewer scan](previews/verification-viewer-axe.json), [computed colors](previews/verification-viewer-landscape.json), [ratios](previews/verification-build-security.json).

The text tests change the root font from its default 100% to 200%; they are base-font/reflow tests, not an operating-system text-size or browser-zoom test. Viewport checks use browser/iframe dimensions, not physical devices. The automated tags and exact checks are visible in the local harness.

## Final production measurements

All seven routes passed at both widths, with three loads per size: zero budget warnings/failures, zero measured CLS, zero long tasks and zero broken requests. Transfers include the checker’s page scroll, so lazy images reached during that scroll count.

| Route | 1440px transfer | 390px transfer |
| --- | ---: | ---: |
| Home | 753.7 KiB | 290.2 KiB |
| Projects | 469.6 KiB | 229.8 KiB |
| Services / About | 121.2 KiB | 120.7 KiB |
| Contact | 121.2 KiB | 120.7 KiB |
| Olive sitting room | 412.7 KiB | 172.9 KiB |
| Timber kitchen | 312.8 KiB | 145.7 KiB |
| Linen bedroom | 345.1 KiB | 152.7 KiB |

Final build: JavaScript 213.63 kB (66.86 kB gzip); CSS 15.93 kB (3.95 kB gzip). Axe and all test harnesses are excluded. The shared header observer adds no scroll handler and produced no measured layout shift or long task in these local checks.

## Repeat the checks

Run `npm test` and `npm run build`. Endpoint tests create temporary loopback servers and remove only their own synthetic data. In an environment that restricts socket binding, they need local-socket permission.

With `npm run dev` running, open `/tests/accessibility.html`. Use **Scan all pages** at 1440 and 390; **Check responsive matrix** and **Check text and short screens** also verify skip-link focus and heading visibility. **Scan current state** audits an opened menu/viewer or the form’s validation state. The harness loads axe locally and sends no audit data to an external service.

The existing `tests/hero-motion.browser.js` and `tests/project-gallery.browser.js` provide read-only assertions for live state. `/tests/viewer-fixture.html` exercises a missing image. `node tests/contact-timeout-server.mjs` serves the built form at `127.0.0.1:5177`; it consumes requests without saving or acknowledging them. Wait for the form to recover, then stop that server. Slow/rejection fixture commands are in [the contact walkthrough](contact.md).

## Limits and scope

No physical-device, Safari, Firefox or screen-reader speech testing was performed. Automated accessibility checks and source review do not establish full WCAG conformance. Unsupported-browser motion fallback was reviewed in CSS; those browsers were not run. Reduced-motion capture is visual evidence, not a frame-rate measurement.

Performance uses local loopback delivery and Taste’s CPU-rendered Chrome checker, with three loads per size. Its timing/transfer results are not field data, a mobile-network simulation, modal interaction latency or a physical-device benchmark. Both desktop and phone measurements name their actual route.

This remains a loopback-only contact demo. No email is sent or appointment booked. Public hosting, public security headers, abuse controls for a shared service, real delivery and deployed fallback routing are outside this verification. No new production infrastructure was introduced.

## References

The audit used [Vercel’s web interface guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), the [axe-core API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md), the [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and React’s [document title behavior](https://react.dev/reference/react-dom/components/title). The approved editorial design and static-mobile/reduced-motion requirements take precedence over Taste’s unrelated composition/motion defaults; this report does not claim a full Taste design-gate pass.
