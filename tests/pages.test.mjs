import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { existsSync } from 'node:fs';

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
after(() => server.close());
const { default: App } = await server.ssrLoadModule('/src/App.tsx');
const { projects } = await server.ssrLoadModule('/src/projects.ts');
const render = (path) => renderToStaticMarkup(createElement(App, { path }));
const concepts = [
  ['olive-room', 'Olive sitting room'],
  ['timber-kitchen', 'Timber kitchen'],
  ['linen-bedroom', 'Linen bedroom'],
];

test('each route has a descriptive document title', () => {
  const titles = [
    ['/', 'Interior design studio'], ['/projects', 'Project concepts'],
    ['/studio', 'Services &amp; approach'], ['/contact', 'Contact'], ['/missing-page', 'Page not found'],
    ...concepts.map(([slug, title]) => [`/projects/${slug}`, title]),
  ];
  for (const [path, title] of titles) {
    assert.ok(render(path).includes(`<title>${title} | Oriel &amp; Reed</title>`), path);
  }
});

test('project headings follow the page or section heading', () => {
  for (const [path, level] of [['/', 3], ['/projects', 2]]) {
    const html = render(path);
    for (const [slug, title] of concepts) {
      assert.ok(html.includes(`<h${level} id="${slug}-title">${title}</h${level}>`), path);
    }
  }
});

test('Projects prioritizes its first visible image while home previews remain lazy', () => {
  const indexImages = [...render('/projects').matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  assert.match(indexImages[0], /loading="eager"/);
  assert.match(indexImages[0], /fetchPriority="high"/);
  for (const image of indexImages.slice(1)) assert.match(image, /loading="lazy"/);
  const homeImages = [...render('/').matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  for (const image of homeImages.slice(1)) assert.match(image, /loading="lazy"/);
});

test('home has one heading, an accessible room image and real navigation targets', () => {
  const html = render('/');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /Oriel &amp; Reed<\/h1>/);
  assert.match(html, /alt="[^\"]*sofa[^\"]*"/);
  for (const path of ['/projects', '/studio', '/contact']) {
    assert.ok(html.includes(`href="${path}"`));
  }
  assert.doesNotMatch(html, /href="#"|href=""/);
});

test('contact has a labelled local-demo form and the closing invitation links to it', () => {
  const html = render('/contact');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<form\b/);
  for (const field of ['name', 'email', 'message']) {
    assert.ok(html.includes(`for="contact-${field}"`));
    assert.ok(html.includes(`id="contact-${field}"`));
  }
  assert.match(html, /Local demo/);
  assert.match(html, /email delivery is not connected/);
  assert.match(html, /Save test request/);
  assert.doesNotMatch(html, /This page is part of a later milestone|name="phone"|name="address"/);
  for (const path of ['/', '/studio']) {
    const page = render(path);
    assert.ok(page.indexOf('Have a room in mind?') > page.indexOf('From conversation to a plan.'));
    assert.match(page, /Have a room in mind\?[\s\S]*href="\/contact"/);
  }
});

test('unknown paths do not silently display the homepage', () => {
  for (const path of ['/missing-page', '/projects/missing', '/projects/olive-room/extra', '/projects/%3Cscript%3E']) {
    assert.match(render(path), /Page not found/);
  }
});

test('home and project index link to all three clearly labelled concepts', () => {
  assert.match(render('/'), /A home, room by room\./);
  for (const path of ['/', '/projects']) {
    const html = render(path);
    for (const [slug, title] of concepts) {
      assert.ok(html.includes(`href="/projects/${slug}"`));
      assert.ok(html.includes(title));
    }
    assert.equal((html.match(/Concept study ·/g) || []).length, 3);
    assert.match(html, /reference images/i);
    assert.doesNotMatch(html, /This page is part of a later milestone/);
  }
});

test('project filters expose their selection and keep image buttons separate from detail links', () => {
  const html = render('/projects');
  assert.match(html, /role="group" aria-label="Filter projects by room"/);
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
  assert.match(html, /aria-pressed="true"[^>]*>All rooms<\/button>/);
  for (const room of new Set(projects.map(project => project.room))) {
    assert.ok(html.includes(`>${room}</button>`));
  }
  assert.match(html, /role="status"[^>]*>3 concepts shown/);
  for (const [slug, title] of concepts) {
    assert.ok(html.includes(`aria-label="View image: ${title}"`));
    assert.ok(html.includes(`href="/projects/${slug}"`));
  }
  for (const [, content] of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) assert.doesNotMatch(content, /<a\b/);
  assert.doesNotMatch(render('/'), /Filter projects by room|View image:/);
});

test('each detail page offers its reference image in the accessible viewer', () => {
  for (const [slug, title] of concepts) {
    const html = render(`/projects/${slug}`);
    assert.ok(html.includes(`aria-label="View image: ${title}"`));
    assert.match(html, /aria-haspopup="dialog"/);
    assert.match(html, /class="image-viewer"/);
  }
});

test('the viewer names its image and credit and requests no image while closed', async () => {
  const { default: ImageViewer } = await server.ssrLoadModule('/src/ImageViewer.tsx');
  const closed = renderToStaticMarkup(createElement(ImageViewer, { project: null, onClose() {} }));
  assert.doesNotMatch(closed, /<img\b|rel="preload"/);
  const html = renderToStaticMarkup(createElement(ImageViewer, { project: projects[1], onClose() {} }));
  assert.match(html, /<dialog[^>]*aria-labelledby="image-viewer-title"/);
  assert.match(html, /id="image-viewer-title">Timber kitchen<\/h2>/);
  assert.match(html, /Close image/);
  assert.ok(html.includes(projects[1].alt));
  assert.ok(html.includes(projects[1].source));
  assert.match(html, /Reference render/);
});

test('each concept has a distinct detail page with an honest brief and image credit', () => {
  for (const [slug, title] of concepts) {
    const html = render(`/projects/${slug}`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(`${title}</h1>`));
    assert.match(html, /Fictional design proposal/);
    assert.match(html, /The brief/);
    assert.match(html, /Design direction/);
    assert.match(html, /Reference (image|render) by/);
    assert.match(html, /Back to projects/);
    assert.doesNotMatch(html, /Page not found|This page is part of a later milestone/);
  }
});

test('all rendered project image variants exist locally', () => {
  for (const path of ['/', '/projects', ...concepts.map(([slug]) => `/projects/${slug}`)]) {
    const html = render(path);
    for (const match of html.matchAll(/\/images\/[\w-]+\.webp/g)) {
      assert.ok(existsSync(`public${match[0]}`), `Missing image: ${match[0]}`);
    }
  }
});

test('home and studio explain the services and ordered consultation process', () => {
  for (const path of ['/', '/studio']) {
    const html = render(path);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    for (const service of ['Space planning', 'Interior design', 'Furnishing &amp; styling']) {
      assert.ok(html.includes(`<dt>${service}</dt>`), `${path} should explain ${service}`);
    }
    const process = html.match(/<ol\b[^>]*>([\s\S]*?)<\/ol>/)?.[1];
    assert.ok(process, `${path} should have an ordered process`);
    const steps = ['Talk through the space', 'Agree the direction', 'Review the proposal'];
    assert.equal((process.match(/<li\b/g) || []).length, steps.length);
    assert.ok(steps.every((step, index) => process.includes(step)
      && (index === 0 || process.indexOf(steps[index - 1]) < process.indexOf(step))));
    assert.doesNotMatch(html, /This page is part of a later milestone/);
  }
  const home = render('/');
  assert.ok(home.indexOf('Selected concepts') < home.indexOf('Design services'));
  assert.ok(home.indexOf('Design services') < home.indexOf('From conversation to a plan.'));
  assert.match(render('/studio'), /Services &amp; approach<\/h1>/);
});
