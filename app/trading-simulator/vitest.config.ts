import { defineConfig } from 'vitest/config';
import path from 'node:path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@components': path.resolve('./src/components'),
      '@utils': path.resolve('./src/utils'),
      '@features': path.resolve('./src/components/features'),
      '@forms': path.resolve('./src/components/forms'),
      '@ui': path.resolve('./src/components/ui'),
      '@layout': path.resolve('./src/components/layout'),
      '@i18n': path.resolve('./src/i18n'),
      '../src': path.resolve('./src'),
    }
  }
}); 