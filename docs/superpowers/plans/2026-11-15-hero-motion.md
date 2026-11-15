# Hero scroll motion

The user approved the static design and requested subtle scroll animation, a static mobile and reduced-motion version, an explanation, and attention to performance and security.

Focal moment: as the visitor starts scrolling, the room image grows from 97% to 100% of its reserved area. The studio title moves upward by 12px and shrinks by 2%, shifting attention toward the room. Text remains opaque. The motion reverses on upward scrolling.

Continuity: preserve native scrolling, the current page structure and the user's `2.5rem` hero gap. No pinned section or extra scrolling space.

Feedback: navigation and menu behavior remain as implemented.

Budget: CSS transforms only, two elements, the first `12rem` of document scroll. No new dependency, JavaScript listener, animation loop, network request or data processing. Existing layout boxes retain their size.

1. Add a browser assertion check and confirm it detects missing desktop motion.
2. Add keyframes inside support and media queries. Enable only on wide screens with a fine pointer, hover and no reduced-motion preference. All other cases retain the static layout.
3. Check forward and reverse scrolling, unchanged layout dimensions, mobile, reduced motion, navigation, production performance, package advisories and the build. Record measured results and one small exercise.

Scope: `src/styles.css`, the browser self-check and learning documents. No React caller, route, API, asset or package change is needed. Unsupported animation features leave the existing static design intact.

Ruling after verification: the dependency audit found published Vite advisories. Update Vite from 8.0.13 to 8.3.8 within the same major version, update the lockfile and restart the local server. The final audit reports zero known vulnerabilities.

Ruling after performance measurement: the desktop image exceeded Taste's preferred single-image budget. Re-encode the existing 1920 × 1406 WebP at quality 78, preserving its dimensions and content. This reduces it from 593,628 to 290,626 bytes. No image-processing dependency is added to the project.
