export const config = {
  entryPoints: ['./src/main.ts'],
  bundle: true,
  platform: 'browser',
  outfile: 'public/bundle.js',
  loader: {
    '.woff': 'file',
    '.svg': 'file',
    '.png': 'file',
  },
  target: 'es6',
};
