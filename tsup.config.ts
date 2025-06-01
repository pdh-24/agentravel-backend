// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  format: ['esm'],
  splitting: false,
  clean: true,
  dts: false, // Kalau mau .d.ts, ubah ke true
  target: 'esnext',
  shims: false,
  esbuildOptions(options) {
    options.alias = {
      '@': './src', // Ini yang penting
    };
  },
});
