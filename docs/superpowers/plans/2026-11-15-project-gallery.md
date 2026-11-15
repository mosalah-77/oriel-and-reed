# Project filters and image viewer

> Implementation uses the existing inline workflow, followed by one fresh review. The user has authorized this bounded milestone; the approved editorial design continues.

**Goal:** filter the Projects index by room and open each reference image in an accessible modal viewer, including from its detail page.

**Architecture:** derive room options and visible results from the existing project data. Use React state for the selected filter and image. Reuse the native dialog pattern already used by the mobile menu, and share the responsive image markup. No new dependencies, assets or network service.

**Spec:** the original portfolio brief supplied in the project chat, plus the current request to add filters, an accessible viewer and one small exercise.

## Scope and decisions

- Preserve the ivory/charcoal/olive palette, serif typography, existing layouts and all user edits, including `messageMin: 30`.
- On `/projects`, add All rooms and data-derived room buttons with a selected state and a live result count. The homepage keeps its three featured concepts.
- Image buttons open a viewer; separate project-title links retain the detail route. Add the same viewer to detail pages.
- Show one image at a time, its concept title and honest reference credit. Close with the visible button or Escape. Keep focus inside, restore the opener and page scrolling on close, and fit the image on phones and short screens.
- Request the viewer image only when opened. Reserve its space and provide an explicit loading/error state. Use local known image paths and React text rendering.
- Share `ProjectImage` in its own file. Keep filter state and existing project page components in App; put the modal behavior in `ImageViewer.tsx`.
- No carousel, zoom engine, extra photography, public deployment or page-metadata changes in this milestone.

## Implementation and checks

- [x] Add failing page checks for filters, distinct image/detail controls and the viewer's accessible content.
- [x] Implement filtering, shared responsive image markup and the native viewer.
- [x] Run the full test suite and production build.
- [x] Exercise every filter, reset, keyboard activation, focus containment, Escape, close-button return, repeated open/close, detail-page viewer and image failure.
- [x] Inspect 320/390/768/1024/1440 widths and a short landscape viewport; verify overflow, image fitting and scrolling restoration. No motion is added.
- [x] Run the performance check, review the complete change, update the learning log and provide one data-edit exercise.

## Review focus

Filter changes must not hide the selected control or change focus. Dialog cleanup must work with React Strict Mode and repeated openings. A failed image must not leave an unexplained blank frame. A portrait phone and a short landscape screen must keep Close reachable. Card links must remain separate from image buttons.

## Progress

- Verified the user's 30-character limit in source.
- Inspected the current gallery and native menu implementation. Checked dialog behavior against WAI-ARIA APG and MDN.
- The existing project is separate from Halvern and is not a Git repository; no commit or worktree operation is part of this milestone.
- Three new page checks failed before implementation; all 18 tests and the build then passed.
- The browser assertion caught focus leaving the dialog after its last link. Explicit Tab and Shift+Tab wrap fixed it, verified RED→GREEN.
- All filters, three images, detail entry, repeated close/reopen, missing-image feedback and responsive bounds were verified in the live browser. Evidence is in `docs/previews/`.
- The production homepage performance check passed. It does not measure modal performance; that scope is stated in the learning log.
- Final review: no material findings. No durable design-system change was needed. Documentation and the next data-label exercise are ready; the user's exercise remains pending.
