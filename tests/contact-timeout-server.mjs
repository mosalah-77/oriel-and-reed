// Local failure fixture: serve the production UI, consume POSTs and never acknowledge a save.
import { preview } from 'vite';

const server = await preview({
  configFile: false,
  preview: { host: '127.0.0.1', port: 5177, strictPort: true },
  plugins: [{
    name: 'contact-timeout-fixture',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== '/api/consultations') return next();
        req.resume();
        res.setTimeout(20_000, () => res.destroy());
      });
    },
  }],
});
server.printUrls();
