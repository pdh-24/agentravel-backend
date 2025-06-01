import * as path from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  clean: true,
  format: ['esm'],
  target: 'esnext',
  esbuildOptions(options) {
    options.plugins = [
      {
        name: 'alias-plugin',
        setup(build) {
          build.onResolve({ filter: /^@\// }, args => {
            return {
              path: path.resolve(process.cwd(), args.path.replace(/^@\//, '')),
            };
          });
        },
      },
    ];
  },
});
