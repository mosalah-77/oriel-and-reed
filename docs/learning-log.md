# Learning and contribution log

## Milestone 1: header and static hero, November 15, 2026

**User decisions:** requested a separate interior studio portfolio, approved Oriel & Reed's design direction and chose to begin with the header and static hero before animation.

**AI implementation:** project setup, React markup, plain CSS, native dialog menu, local font and image preparation, asset credits, page output tests and documentation.

**Guided user work:** changed `--hero-gap` from `1.5rem` to `2.5rem` in `src/styles.css`. The updated value was present when the next milestone began and has been preserved.

**Concept:** React provides the page structure and menu state. CSS controls the appearance. A custom property such as `--hero-gap` gives related spacing rules one shared value. Vite updates the running page when a file is saved.

**Verification:** the initial page test failed because the application module did not yet exist. After implementation, all three Node tests passed. TypeScript and the production build passed. The live preview was checked at 320, 390, 768, 1024 and 1440 pixels wide, with no horizontal page overflow. The menu opens with focus on Close, Tab reaches its links, Escape restores focus to Menu, and crossing the desktop breakpoint closes the dialog and restores page scrolling. The skip link focuses the main content. Projects and Contact links reach their explicit unfinished-page notices and return home. No browser warnings or errors were recorded in these checks.

**Design review:** an independent reviewer checked the source and desktop, phone and menu screenshots and found no actionable defects within this milestone. Taste's first automated pass flagged its required hero entrance, scroll moment, full-screen sections, category heading, hard fact, button styling and wrapper conventions. Those do not match the approved static editorial milestone, so this is not reported as a full Taste gate pass. Its image-size finding prompted a correction to responsive source selection for the portrait crop. Screenshots are saved in `docs/previews/`.

**Not checked:** physical devices, screen readers, Safari and Firefox. There is no deployed site or completed inquiry flow to verify yet.

**Scope decisions:** navigation destinations display explicit unfinished-page notices. No animation, backend, form submission or fabricated client work is included in this milestone. The user-approved typography and static scope take precedence over Taste's full-site composition and motion rules.

## Milestone 2: hero scroll motion, November 15, 2026

**User decisions:** approved the static design and requested subtle scroll motion, static mobile and reduced-motion versions, an explanation, and attention to performance and security.

**AI implementation:** CSS keyframes and media/support queries, the browser assertion check, a smaller desktop image encoding, the Vite security update and the motion walkthrough. No animation library or client JavaScript was added.

**Guided user work:** changed the title's final `translateY` value from `-12px` to `-8px`. The updated value was verified when the next milestone began and has been preserved.

**Verification:** the browser assertion first failed because the desktop animation was absent, then passed after implementation. Forward scrolling changed both transforms without changing their layout dimensions; reverse scrolling restored their starting values. At 390px, scrolling left both elements static. Checks also passed at 320, 768, 1024 and 1440px with no horizontal overflow. A capture with reduced motion emulated showed the full-size static title and image. All three page tests and the production build pass with Vite 8.3.8. The final dependency audit reports zero known vulnerabilities.

**Measured performance:** Taste's production check ran three loads each at 1440px and 390px. It reported zero failures, warnings, long tasks, layout shift and broken requests. Transfer was 396.3 KiB on desktop and 172.2 KiB on mobile in that local test. The desktop image fell from 593,628 to 290,626 bytes. The measurements are local browser results, not field performance or a frame-rate benchmark. The raw report is `docs/previews/motion-performance.json`.

**Independent review:** a fresh reviewer checked the CSS, assertion script, saved previews, asset dimensions, dependency metadata and performance report. No actionable defects were found within the milestone. The browser self-check returns measurements for comparison; progression and reversal were separately asserted in the live preview.

**Limits:** no physical-device, Safari, Firefox or screen-reader testing in this milestone. Unsupported-browser fallback is guarded in CSS; those browsers were not separately run. Remaining pages and the inquiry endpoint are still outside this milestone.

## Milestone 3: studio introduction and concept projects, November 15, 2026

**User decisions:** completed the motion exercise and asked to continue with the guided build. The `2.5rem` hero gap and `-8px` title movement remain unchanged.

**AI implementation:** studio introduction, one wide concept preview followed by two smaller previews, a shared project list, the Projects index and reusable concept-detail template. Codex wrote the fictional proposals, sourced and optimized the reference images, added source credits and updated the tests and documentation. The kitchen reference is a 3D render and is labelled as such.

**Guided user work:** changed the first project's summary in `src/projects.ts` to “An olive sofa and a reading chair beside the afternoon light.” The user confirmed that both the homepage and Projects index updated. The saved edit was verified at the beginning of milestone 4.

**Concept:** an array stores the project data once. React's `.map()` turns the entries into cards, and the detail view reads the matching entry using its slug. The layout and content can change independently.

**Verification:** the two new route/content tests failed before implementation. All six tests then passed, including invalid project paths and local image-file checks. TypeScript and the production build passed. Browser checks at 320, 390, 768, 1024 and 1440px found no horizontal overflow. The grid stacks below 800px. Tab reached the first project with a visible 2px focus outline, Enter opened a concept detail page, and Back to projects opened the index. All homepage images loaded. The desktop hero still reaches its final `-8px` position without changing its layout height, and the mobile motion eligibility check stays static. Browser logs contained no errors or warnings.

**Performance and security:** no dependency, external script, form, endpoint or JavaScript scroll handler was added. Project paths only match known local entries; route input is not inserted into HTML or used as an asset URL. All images and fonts are local. New images have explicit dimensions, responsive WebP sources and native lazy loading in the previews. The detail image loads eagerly. Taste's production check ran three loads at each of 1440px and 390px: zero failures, warnings, layout shift, long tasks and broken requests. Total measured transfer was 746.9 KiB on desktop and 283.5 KiB on mobile. These are local measurements, not field or physical-device results. Raw report: `docs/previews/concepts-performance.json`.

**Independent review:** a fresh reviewer inspected the implementation, tests, documentation, performance report and four screenshots. No blocking correctness or security issues were found. A screenshot capture-state artifact was corrected by capturing from the top without keyboard focus. One minor item is deferred: give each project its own browser document title during the page-metadata pass. The reviewer did not repeat the live browser tests or licence verification.

**Limits and next scope:** filters, the image viewer, services, process, the closing contact section and the inquiry flow remain later milestones. No physical-device, screen-reader, Safari, Firefox or public-host routing tests were performed. The local preview is still bound to `127.0.0.1:5173`.

## Milestone 4: services and process, November 15, 2026

**User decisions:** confirmed the summary exercise updated both project lists and requested the services and process sections, followed by another small exercise.

**AI implementation:** three service descriptions on an olive background and an ordered process from consultation to proposal. Two shared components appear after the homepage concepts and on the Services/About page, which now has a short introduction. No images, dependencies, animation, backend or form were added. The user's hero spacing, motion and project-summary edits remain unchanged.

**Guided user work:** changed `.process-list`'s `gap` from `2rem` to `3rem` in `src/styles.css`. The user confirmed the spacing updated on both pages. The saved value was verified at the beginning of milestone 5 and has been preserved.

**Concept:** CSS Grid can arrange the same content in equal columns on desktop and a single column on mobile. `gap` controls the space between those columns or rows without changing the order of the content.

**Verification:** the new route/content check failed before implementation, then all seven tests passed. The check covers service descriptions, the ordered three-step process, one main heading and homepage section order. TypeScript and the production build passed. The studio page was checked at 320, 390, 768, 1024, 1280 and 1440px without horizontal overflow. Desktop and mobile screenshots show the services and process layouts. Enter activated Services/About from desktop navigation and the mobile menu; the destination had no open dialog or lingering scroll lock. The skip link focused the main content. The homepage's phone hero remained static, and its new sections follow the concept previews. No browser errors or warnings were recorded.

**Performance and security:** ivory body text on olive measures 6.58:1. All new content is static React markup, with no new input, third-party request, state or credential handling. Taste's local production check ran three loads each at 1440px and 390px with zero failures, warnings, long tasks, layout shift and broken requests. Measured total transfer was 747.9 KiB on desktop and 284.5 KiB on mobile, about 1 KiB more than the previous milestone. The report is `docs/previews/services-performance.json`; these are local results, not measurements on physical devices.

**Independent review:** a fresh reviewer inspected the source, tests, documentation, four screenshots and saved performance report. No code fixes were recommended. The reviewer flagged the planned documentation wrap-up, which is now complete. The reviewer did not repeat browser automation or the test/build commands.

**Limits:** the closing consultation invitation, contact flow, project filters, image viewer and per-page browser titles remain later work. No physical-device, Safari, Firefox, screen-reader or public-host routing checks were performed in this milestone.

## Milestone 5: closing invitation and contact, November 15, 2026

**User decisions:** completed the spacing exercise on both pages and requested the closing consultation section, contact page and another small exercise. The original brief calls for a real submission in a controlled test environment, with an honest demo state when email delivery is not configured.

**AI implementation:** a shared closing invitation, responsive three-field contact page, shared validation, accessible form states and a local Vite endpoint. The endpoint saves private JSON receipts, validates independently, restricts requests to same-origin loopback traffic and bounds body size, time and request rate. Atomic writes and stable request IDs make unchanged retries safe. Only Node development type definitions were added; there is no new runtime library or external delivery service. All previous user edits remain intact.

**Guided user work:** changed `messageMin` from `20` to `30` in `src/contact-validation.ts` and confirmed the validation works. The saved value was verified at the beginning of milestone 6 and has been preserved.

**Concept:** browser validation gives useful feedback, while server validation protects the data boundary. Sharing the limits keeps field hints and both checks consistent. A success message appears only after the server confirms that the receipt was saved.

**Verification:** the new contact page and endpoint tests failed before implementation. All 15 tests now pass, along with TypeScript and the production build. HTTP integration checks cover Unicode and length limits, invalid types and control characters, private file permissions, concurrent duplicate retries, conflicting payloads, invalid JSON, extra fields, unsafe IDs, origin/method/content-type restrictions, both declared and chunked oversized bodies, storage failure, intentional rejection, rate limiting and storage configuration. The initial sandbox could not bind local test sockets; a minimal listener reproduced `EPERM`. The unchanged HTTP tests passed with authorized local socket access.

**Browser checks:** empty submission focuses the first invalid field; all three errors are associated with their controls. Tab moves through name, email, brief and submit in order. Real fictional requests were saved in development and preview, with focus moved to the success heading. A slow preview showed disabled fields and a live pending message. A rejecting preview retained the entered details, enabled retry and announced a failure. The contact page was checked at 320, 390, 768, 1024 and 1440px without horizontal overflow, with 16px input text. The closing invitation was inspected on desktop and phone; Enter followed its link to Contact. The normal preview recorded no browser warnings or errors. Screenshots and responsive measurements are in `docs/previews/`.

**Storage checks:** real synthetic receipts used mode `0600` in directories with mode `0700`. Both the direct `.local` URL and the Vite `/@fs/` URL returned 403. The rejecting preview saved nothing. Built assets contained no receipts or server implementation. A first bundle check incorrectly treated the deliberately fictional email in the validation hint as stored data; the corrected check verifies receipt IDs and server-only code instead.

**Independent review:** a fresh reviewer found that an environment override could move receipts into a publicly served folder. The override was removed, keeping storage fixed under `.local/consultations`. Its regression test failed first, then passed. A separate boundary check exposed a control character accepted in an email; that check also failed before the validator was corrected. The full 15-test suite and build passed after both fixes. No other material findings were reported. The reviewer read the code and saved evidence but did not repeat browser or command execution.

**Performance:** Taste's local production check ran three loads at each of 1440px and 390px, with zero failures, warnings, layout shift, long tasks or broken requests. Measured transfer was 750.2 KiB on desktop and 286.8 KiB on mobile. This measurement preceded the final storage-setting removal and small email-validation correction; neither changes page layout or assets. The report is `docs/previews/contact-performance.json`. These are local browser measurements, not field results.

**Limits:** the adapter runs only in local development and preview. No email is sent and no appointment is booked. Public submission infrastructure, filters, image viewing and per-page browser titles remain later work. Physical devices, Safari, Firefox, screen readers, request-body timeout behavior and public-host routing were not tested in this milestone.

## Milestone 6: project filters and image viewer, November 15, 2026

**User decisions:** completed the 30-character validation exercise and requested project filters, an accessible image viewer and another small exercise. The shared minimum is now 30; earlier spacing, motion and copy edits remain intact.

**AI implementation:** room filters and a live result count on Projects, separate image buttons and detail links, a shared responsive image component, and a native image dialog on the index and detail pages. The viewer shows the concept title, local image and reference credit, with loading and failure feedback. It contains keyboard focus, supports Escape and a visible Close button, restores the opener and releases the scroll lock. The homepage retains its three featured concepts. No dependencies, photography, server endpoints or animations were added.

**Guided user work:** changed the first project's `room` value from `Living room` to `Sitting room` in `src/projects.ts` and confirmed the filter works. The saved value was verified at the start of milestone 7 and is preserved. The filter, captions and detail-page label derive from this data. Instructions are in `docs/project-gallery.md`.

**Concept:** React state holds the chosen room. An array filter selects matching projects without modifying the source list; a map renders the selected entries. A Set creates unique filter labels from the same data.

**Verification:** the three new page/viewer checks failed before implementation, then the full suite passed with 18 tests. TypeScript and the production build pass. Live browser checks verified all three room filters, All rooms, counts and retained filter focus, plus Enter and Space activation. All three images opened successfully, and the detail-page entry point used the same viewer. The initial native dialog let Tab leave the page after the source link; the browser assertion failed, then passed after explicit forward/reverse focus wrapping was added. Repeated opening, Escape and the Close button restored focus and scrolling. The viewer image is removed on close. A development-only fixture exercised a genuinely missing local image under React Strict Mode, producing an announced failure and a working close/return path. A real uncached image briefly displayed Loading image before completing.

**Responsive checks:** the gallery/viewer was inspected at 320, 390, 768, 1024 and 1440px, plus an 844×390 landscape viewport. No horizontal overflow was found. The dialog stayed within the viewport, kept Close reachable and used `object-fit: contain`. Room-filter controls measured 44px high. The normal gallery tab recorded no browser errors or warnings; the failure fixture deliberately requests a missing asset. Desktop, phone and landscape evidence is saved in `docs/previews/`.

**Performance and security:** source URLs come from the existing authored project records; the viewer mounts no image while closed and keeps responsive local WebP sources. No external script, HTML injection, credential or new form boundary was introduced. Taste's production **homepage** smoke check ran three loads at each of 1440px and 390px with zero failures, warnings, layout shift, long tasks or broken requests. Transfer was 751.5 KiB on desktop and 288.1 KiB on mobile, about 1.3 KiB above the previous milestone. This is a homepage/build comparison, not a measured Projects or modal performance benchmark. The report is `docs/previews/gallery-performance.json`; it predates moving the small View image label from the bottom to the top of its image.

**Independent review:** a fresh reviewer inspected the scoped code, tests and desktop/phone captures and found no material issue. The existing palette, typography and image treatment remain consistent; the interaction pattern is documented in `docs/project-gallery.md`, with no new design system. The reviewer clarified the homepage scope of the performance report and did not independently repeat browser or command execution.

**Limits:** physical devices, screen readers, Safari and Firefox were not run. Filter state resets on page navigation. The viewer shows one image at a time; there is no carousel or zoom engine. Per-page browser titles and public delivery remain outside this milestone.


## Milestone 7: verification loop, November 15–16, 2026

**User decisions:** confirmed the Sitting room filter exercise and requested at least ten verification passes covering accessibility, responsiveness, performance and security. The six user-authored edits were checked and preserved.

**AI work:** completed twelve distinct passes and corrected seven reproducible issues: skipped project heading levels, generic page titles, mobile-menu focus escape, enlarged-text overflow, a cramped enlarged viewer title, a sticky header covering skipped-to content, and lazy loading of the Projects page’s first visible image. The small shared focus handler and header-height observer use existing React/browser APIs. Axe-core 4.11.4 was added only as a development checker; no runtime dependency was added.

**Verification:** final 24/24 tests and TypeScript/build pass. All eight routes scan with zero axe violations or incomplete checks at both 1440px and 390px. Forty standard viewport cases and 56 enlarged-text/short-screen cases pass horizontal bounds, main focus and heading visibility checks. Keyboard, filters, viewer failure/cleanup, motion, real local save, rejection and browser timeout states were checked. The independent review found the enlarged sticky-header issue; it was reproduced, fixed and rechecked. Final review found no additional material issue.

**Performance and security:** all seven content routes were measured on the final production build, three loads each at desktop and phone sizes. There were no performance warnings/failures, measured layout shifts, long tasks or broken requests. npm audit reports zero known advisories. The endpoint suite now also covers request-body deadline, interrupted upload and protected-file URL variants. Synthetic receipts remain private, test-only submissions were cleaned up, and built assets contain no server implementation, receipts or audit fixture. Temporary servers were stopped; the normal loopback preview remains available.

**Evidence and limits:** the [twelve-pass ledger](verification-loop.md) contains findings, before/after results, final route measurements, repeatable checks and primary references. Base-font enlargement and viewport emulation do not replace physical devices, real screen-reader use, Safari or Firefox testing. The local form sends no email and books no appointment; public delivery remains outside this milestone. The learning log records the user's edits separately from this AI implementation and verification work.

## Milestone 8: finishing, November 16, 2026

**User direction:** accepted the verification work and asked to finish the project. The original brief calls for a live preview, a clean GitHub project, setup instructions, asset credits, honest contribution notes and known limits.

**AI work:** added the remaining restrained section entrances, finished the README and handoff, added a pinned GitHub check and prepared the source for version control. The entrance uses the existing desktop and reduced-motion guards, changes only an 8px transform and keeps content visible. No runtime library, public form service or account feature was added. The six user edits from earlier milestones remain unchanged.

**Verification:** all 24 tests and the build pass, including from a fresh dependency install in an isolated source copy. Desktop section movement, reversal and stable dimensions were checked, along with the static phone fallback and shared studio sections. A fresh production homepage performance check at desktop and phone sizes reported no failures, warnings, layout shifts, long tasks or broken requests. See the [finishing record](finish.md) for evidence and limits.

**Learning action:** inspect the final snapshot with `git log -1 --oneline`. This action is offered, not recorded as completed. The repository includes the user's design decisions and six guided edits; the implementation, tests and finishing documentation remain AI-generated work.
