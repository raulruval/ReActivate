import { build } from 'esbuild';
import { unlink } from 'fs';
import { config } from './esbuild.config.js';

unlink('public/bundle.js.map', () => undefined);

await build({
  ...config,
  define: { 'process.env.NODE_ENV': '"production"' },
  sourcemap: false,
  minify: true,
}).catch((err) => {
  console.err(err);
  process.exit(1);
});
