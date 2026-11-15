# Project filters and image viewer

The Projects page now has room filters and a result count. Select All rooms to restore the full collection. Image buttons open a larger, uncropped view of the local reference image; project titles still open the concept details. Detail-page images use the same viewer.

## How it works

React state remembers the selected room. `.filter()` returns only matching project entries, and `.map()` renders those results. The original project list stays intact. Filter labels come from the room values in that list, with duplicates removed by a `Set`. The viewer keeps separate state for the selected image, so opening and closing it leaves the chosen filter in place.

## Completed exercise

The user changed the first project's room label in `src/projects.ts` from:

```ts
room: 'Living room',
```

to:

```ts
room: 'Sitting room',
```

The user confirmed that “Sitting room” filters to the olive room. The caption and detail-page label also derive from this data. The edit is preserved and was checked again during the [verification loop](verification-loop.md).

## Keyboard and image behavior

Tab reaches each filter, image button and project link. Enter or Space activates a button. The selected filter has an underline and `aria-pressed`; a live result count reports changes without moving focus.

The viewer uses a native `<dialog>` with an accessible title. Opening it focuses Close image and makes the background inert. Tab and Shift+Tab wrap between Close and the source credit; Escape or Close dismisses it. Focus returns to the image button and the previous page scrolling is restored. The image uses `object-fit: contain`, so the viewer does not add a crop. Loading and failure messages explain an image that has not appeared.

The responsive image component is shared by cards, details and the viewer. The viewer mounts its image only when open, uses the existing local WebP variants and requests no third-party script or extra image set. There is no added animation, carousel or zoom engine.

## Checks and repeatable failure case

Run `npm test` and `npm run build` for the page, contact and type checks. The page tests derive expected room labels from the data, so the exercise does not require a test edit. For browser checks, paste `tests/project-gallery.browser.js` into the console and call `checkProjectGallery()` after changing a filter or moving focus within the viewer. It checks the current result count, room match, modal focus, scroll lock and horizontal overflow; it does not drive interactions for you.

With the development server running, open `/tests/viewer-fixture.html` and activate Open missing image. It uses the real component with a deliberately missing local file under React Strict Mode. The viewer should announce a failure, close normally and return focus. The fixture is excluded from the production build.

The [learning log](learning-log.md) records the browser checks, screenshots, performance measurement and remaining limits. The interaction follows the [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and uses the platform behavior described in [MDN's dialog reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).
