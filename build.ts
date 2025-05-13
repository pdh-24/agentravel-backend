await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './build',
  naming: 'backend.js',
  format: 'cjs',
  target: 'bun',
});

export {};