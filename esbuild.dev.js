import { create } from 'browser-sync';
import { build } from 'esbuild';
import { config } from './esbuild.config.js';

const bs = create();

const builder = await build({
  ...config,
  define: { 'process.env.NODE_ENV': '"development"' },
  sourcemap: true,
  incremental: true,
});

bs.watch('src/**/*.ts', (event, file) => {
  console.log(`- ${file} changed, rebuilding`);
  builder
    .rebuild()
    .then(() => bs.reload())
    .catch((err) => {
      console.err(err);
      process.exit(1);
    });
});

bs.watch('public/{index.html,assets/**/*}', (event, file) => {
  console.log(`- Asset ${file} changed, reloading`);
  bs.reload();
});

bs.init({
  server: 'public',
});
