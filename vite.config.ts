import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Plugin to redirect root / to /nexus-games/ during local development / preview
function devRootRedirect(): Plugin {
  return {
    name: 'dev-root-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '') {
          res.writeHead(302, { Location: '/nexus-games/' });
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/nexus-games/',
    plugins: [react(), devRootRedirect()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
