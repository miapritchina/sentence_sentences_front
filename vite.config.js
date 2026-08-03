import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base so the build works when hosted under a subpath,
  // e.g. GitHub Pages at /sentence_sentences_front/.
  base: './',
  plugins: [react()],
});
