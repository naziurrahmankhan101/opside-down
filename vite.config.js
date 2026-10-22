import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// every generated page in services/ is its own entry (multi-page build)
const servicePages = Object.fromEntries(
  readdirSync(resolve(__dirname, 'services'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => [`services/${f.replace('.html', '')}`, resolve(__dirname, 'services', f)]),
);

export default defineConfig({
  // Keep paths as-is (avoids realpath redirection issues on some Windows setups)
  resolve: { preserveSymlinks: true },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html'), ...servicePages },
      output: {
        manualChunks: { three: ['three'] },
      },
    },
  },
});
