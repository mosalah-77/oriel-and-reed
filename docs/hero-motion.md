# Hero scroll motion

Scroll slowly down the homepage, then back up. On a desktop with motion enabled, the image grows from 97% to 100% of its reserved area. The title moves up by 8px and shrinks to 98%. Both stay fully opaque. Your `2.5rem` spacing choice is preserved.

## How it works

1. `animation-timeline: scroll(root block)` uses the page's vertical scroll position as the animation clock.
2. `animation-range: 0px 12rem` spreads the change across the first 192px of scrolling at the default root font size. Scrolling back reverses it. The `1ms` duration is a compatibility value; the scroll position controls progress.
3. The keyframes change `transform`. The original layout boxes keep their size, so the effect does not push the following content around.
4. The media query enables motion only from 800px wide, with a fine pointer, hover and no reduced-motion preference. The support query requires both timeline and range features. Outside those conditions, the existing static CSS remains in force.

This is a visual enhancement. The page stays readable and the links work without it. It does not intercept scrolling, pin the hero, hide content or add extra scrolling space. If a short viewport has no scroll range, there is no scrolling to animate.

## Completed exercise

The user changed the final frame of `hero-title-recede` in `src/styles.css` from `-12px` to `-8px`:

```css
to { transform: translateY(-8px) scale(.98); }
```

The title now travels a little less. The scale and media queries are unchanged. The edit was verified at the beginning of the concept-project milestone.

## Repeat the browser check

On the homepage, paste `tests/hero-motion.browser.js` into the browser console and call `checkHeroMotion()`. Run it at the top and after scrolling. It throws an error if motion is enabled under the wrong conditions, content is hidden, a static fallback is transformed or the page overflows horizontally.

On an eligible desktop, the two transform matrices should change while `layoutWidth` and `layoutHeight` stay the same. On a phone or with reduced motion emulated in the browser's rendering tools, both animations should be `none` and both transforms should remain `none`. Return to the top to confirm the initial values are restored. This is a browser check, separate from `npm test`.

## Performance and security

The finished site also moves selected section headings, process steps and the closing invitation upward by 8px as they enter the viewport. `animation-timeline: view(block)` follows each element's entrance, within the same desktop and motion-preference guards as the hero. The content stays opaque and its layout space does not change. Call `checkSectionMotion()` from the same browser helper to inspect this separately from the hero.

The animation adds CSS only. It has no JavaScript scroll listener, timer, React state update, new library or network request. It animates neither dimensions nor margins, and it does not permanently reserve compositor layers with `will-change`.

The desktop hero image was reduced from 593,628 to 290,626 bytes at the same dimensions. Fonts and images remain local.

The final local production check passed at desktop and phone sizes across three loads each: zero long tasks, zero measured layout shift and no broken requests. Desktop transfer was 396.3 KiB; mobile was 172.2 KiB. These local measurements do not replace testing on real devices. Raw results are in `docs/previews/motion-performance.json`.

The package audit identified published advisories affecting the previous Vite version. Vite is now pinned to 8.3.8 and the lockfile is updated. The final `npm audit` found zero known vulnerabilities. This is a dependency advisory check, not a guarantee that all security risks are absent. The development server remains bound to `127.0.0.1`.

References: [CSS animation timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline), [reduced motion preferences](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), [Vite advisory](https://github.com/advisories/GHSA-rq7h-c2jc-7f22), [Vite 8.3.8 release](https://github.com/vitejs/vite/releases/tag/v8.3.8).
