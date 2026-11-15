import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { createContactMiddleware } from './server/contact.ts';

const contactOptions = {
  outbox: resolve('.local/consultations'),
  testMode: process.env.ORIEL_CONTACT_TEST_MODE,
};

export default defineConfig({
  plugins: [react(), {
    name: 'local-contact-demo',
    configureServer(server) { server.middlewares.use(createContactMiddleware(contactOptions)); },
    configurePreviewServer(server) { server.middlewares.use(createContactMiddleware(contactOptions)); },
  }],
  server: {
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.local/**'] },
    watch: { ignored: ['**/.local/**'] },
  },
});
