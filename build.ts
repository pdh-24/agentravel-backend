await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './build',
  naming: 'backend.ts',
  format: 'esm',
  target: 'bun',
});

export {};