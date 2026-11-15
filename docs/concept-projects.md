# Concept projects

The homepage now has a short studio introduction and three linked concept previews. The Projects page shows the same list, and each link opens a shared detail layout with a brief, design direction and image credit.

## How it works

`src/projects.ts` is an array: a list of three project objects. Each object holds a title, summary, image credit and proposed design. `ProjectList` uses `.map()` to render one card for each object. The `slug` supplies both the stable React key and the URL. The detail page finds the matching object and passes it to `ProjectDetail`. Editing the data updates every place that reads it.

## One small exercise

Completed by the user: the first project's summary in `src/projects.ts` now reads:

```ts
summary: 'An olive sofa and a reading chair beside the afternoon light.',
```

The user confirmed that both the homepage and `/projects` show the new sentence. The slug and image fields are unchanged.

## Images and safety

The imagery is licensed reference material, not completed studio work. Each detail page identifies the source. Local WebP variants let the browser choose an appropriate size; explicit dimensions reserve space before images load. Below-the-fold previews use native lazy loading, while the main detail image loads eagerly.

Project URLs only select one of the three local entries. URL text is never inserted into HTML or used to fetch an image. No dependencies, external scripts, forms or endpoints were added.
