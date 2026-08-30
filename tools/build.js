/**
 * Compiles app.jsx and menu-data.jsx to the committed app.js / menu-data.js.
 *
 * The site loads React from a CDN and ships pre-compiled JS - there is no
 * bundler. Run this after editing either .jsx file:
 *
 *   npm install --no-save @babel/core@7 @babel/preset-react@7
 *   node tools/build.js
 */
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const name of ['app', 'menu-data']) {
  const src = fs.readFileSync(path.join(ROOT, name + '.jsx'), 'utf8');
  const { code } = babel.transformSync(src, {
    presets: [[require.resolve('@babel/preset-react'), { runtime: 'classic' }]],
    filename: name + '.jsx',
    compact: false,
    retainLines: false,
  });
  fs.writeFileSync(path.join(ROOT, name + '.js'), code + '\n');
  console.log('built', name + '.js');
}
