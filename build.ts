await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './build',
  naming: 'backend.js',
  format: 'esm',
  target: 'bun',
});

export {};