/**
 * Compiles app.jsx and menu-data.jsx to the committed app.js / menu-data.js,
 * then verifies the gallery against the files on disk.
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

// ─────────────── build ───────────────
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

// ─────────────── gallery check ───────────────
/*
 * A gallery entry declares the source width, and Picture builds its srcset by
 * clamping the width ladder to it. tools/optimize-images.py clamps to the file's
 * REAL width. When the declared width is even a pixel off, the two disagree and
 * the page requests a derivative that was never generated - the photo silently
 * fails to load, with nothing in the console to explain it. That shipped once
 * (f15 was declared 1200 but is 1199), so the build now refuses to pass it.
 */

/** Reads width/height straight out of a JPEG's SOF marker - no dependencies. */
function jpegSize(buf) {
  let i = 2; // skip SOI
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    const len = buf.readUInt16BE(i + 2);
    const isSOF = marker >= 0xc0 && marker <= 0xcf &&
                  marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSOF) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

function checkGallery() {
  const src = fs.readFileSync(path.join(ROOT, 'app.jsx'), 'utf8');

  // Shorthands such as `const L = { w: 1800, h: 1200 };`
  const shorthand = {};
  for (const m of src.matchAll(/const ([LPW]) = \{ w: (\d+), h: (\d+) \}/g)) {
    shorthand[m[1]] = { w: +m[2], h: +m[3] };
  }

  // Must mirror widthsFor() in app.jsx.
  const LADDER = [800, 1600];
  const EXTRA = { p1: [2200] };
  const widthsFor = (srcW, name) =>
    [...new Set(LADDER.concat(EXTRA[name] || []).map((w) => Math.min(w, srcW)))].sort((a, b) => a - b);

  const problems = [];
  let entries = 0;

  for (const m of src.matchAll(/\{ name: '([a-z0-9]+)',\s*(?:\.\.\.([LPW])|w: (\d+), h: (\d+)),/g)) {
    const [, name, kind, wLit, hLit] = m;
    const declared = kind ? shorthand[kind] : { w: +wLit, h: +hLit };
    if (!declared) { problems.push(`${name}: unknown shorthand ...${kind}`); continue; }
    entries++;

    const jpeg = path.join(ROOT, 'images', `${name}.jpg`);
    if (!fs.existsSync(jpeg)) { problems.push(`${name}: images/${name}.jpg is missing`); continue; }

    const actual = jpegSize(fs.readFileSync(jpeg));
    if (actual && (actual.w !== declared.w || actual.h !== declared.h)) {
      problems.push(
        `${name}: declared ${declared.w}x${declared.h} but images/${name}.jpg is ` +
        `${actual.w}x${actual.h} - use the real size`
      );
    }

    // Every candidate the browser could pick has to exist.
    for (const w of widthsFor(declared.w, name)) {
      for (const ext of ['avif', 'webp']) {
        const rel = `images/opt/${name}-${w}.${ext}`;
        if (!fs.existsSync(path.join(ROOT, rel))) {
          problems.push(`${name}: srcset points at ${rel}, which does not exist`);
        }
      }
    }
  }

  if (problems.length) {
    console.error(`\ngallery check FAILED (${problems.length} problem(s)):`);
    for (const p of problems) console.error('  - ' + p);
    console.error('\nRun tools/optimize-images.py, or correct the dimensions in app.jsx.');
    process.exit(1);
  }
  console.log(`gallery check passed (${entries} photos, all derivatives present)`);
}

checkGallery();
