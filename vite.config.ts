import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { copyFile, mkdir } from 'node:fs/promises';
import { createContactMiddleware } from './server/contact.ts';
import { projects } from './src/projects.ts';

const contactOptions = {
  outbox: resolve('.local/consultations'),
  testMode: process.env.ORIEL_CONTACT_TEST_MODE,
};

export default defineConfig({
  plugins: [react(), {
    name: 'local-contact-demo',
    configureServer(server) { server.middlewares.use(createContactMiddleware(contactOptions)); },
    configurePreviewServer(server) { server.middlewares.use(createContactMiddleware(contactOptions)); },
  }, {
    name: 'static-page-entrypoints',
    apply: 'build',
    async writeBundle() {
      for (const route of ['projects', 'studio', 'contact', ...projects.map(project => `projects/${project.slug}`)]) {
        await mkdir(`dist/${route}`, { recursive: true });
        await copyFile('dist/index.html', `dist/${route}/index.html`);
      }
      await copyFile('dist/index.html', 'dist/404.html');
    },
  }],
  server: {
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.local/**', '**/.release/**'] },
    watch: { ignored: ['**/.local/**', '**/.release/**'] },
  },
});
