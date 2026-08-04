import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // App source lives in app/; the repo root holds the CI-committed build
  // output that GitHub Pages serves.
  root: 'app',
  // Relative base so the build works when hosted under a subpath,
  // e.g. GitHub Pages at /sentence_sentences_front/.
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [react()],
});
