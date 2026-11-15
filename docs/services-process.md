# Services and process

The homepage now explains space planning, interior design, and furnishing and styling. A three-step process follows: talk through the space, agree the direction, and review the proposal. The Services/About page uses the same sections with a short studio introduction.

The copy describes a fictional studio's proposed approach. It does not claim completed client work or promise an appointment. The following milestone adds a [local contact demo](contact.md).

## How the layout works

CSS Grid arranges the process steps. `repeat(3, minmax(0, 1fr))` gives them three equal columns. `gap` sets the space between them. Below 800px, a media query changes the grid to one column, so the same content reads vertically on a phone. The order stays the same at both sizes.

## Completed exercise

The user changed `.process-list` in `src/styles.css` from `gap: 2rem` to:

```css
gap: 3rem;
```

The user confirmed that the spacing updated on both pages. The steps now have more space between columns on desktop and between rows on mobile. Both pages share the component and CSS.

## Implementation notes

Services use a description list, pairing each service name with its explanation. The process is an ordered list. Its decorative numbers are hidden from assistive technology, which can read the list structure directly. There are no new images, dependencies, animations, forms, network requests or application state.

The olive section uses the existing palette. Ivory body text on the olive background has a calculated contrast ratio of 6.58:1.
