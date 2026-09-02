/**
 * Renders the React app to static HTML, once per language:
 *
 *   /index.html      Croatian
 *   /en/index.html   English
 *
 * Why: the page is built by React at runtime, so the HTML a crawler receives
 * is an empty <div id="root">. Google will execute the JavaScript eventually,
 * but slower and less reliably than reading markup. Worse, one URL that swaps
 * languages with JavaScript only ever gets indexed in one of them.
 *
 * Each file therefore carries the fully rendered page in its own language,
 * with its own title, description and hreflang. The browser still boots React
 * on top for the interactive parts.
 *
 *   npm install --no-save @babel/core@7 @babel/preset-react@7 react@18 react-dom@18
 *   node tools/prerender.js
 *
 * Run tools/build.js first - this consumes the compiled app.js.
 */
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://subgourmet.hr';

/** '' for the site root, 'en' for the English copy. */
const LANGS = [
  { code: 'hr', dir: '', prefix: '', htmlLang: 'hr' },
  { code: 'en', dir: 'en', prefix: '../', htmlLang: 'en' },
];

function renderLang(code) {
  // app.js reads MENU_DATA and SITE_LANG off the global object, and skips
  // mounting when module.exports exists. Reset the cache so each language
  // re-evaluates against a fresh SITE_LANG.
  globalThis.SITE_LANG = code;
  globalThis.React = React;
  globalThis.ReactDOM = { createRoot: () => ({ render() {} }) };

  for (const f of ['menu-data.js', 'app.js']) {
    delete require.cache[require.resolve(path.join(ROOT, f))];
  }
  require(path.join(ROOT, 'menu-data.js'));          // sets globalThis.MENU_DATA
  const { App } = require(path.join(ROOT, 'app.js'));

  return ReactDOMServer.renderToStaticMarkup(React.createElement(App));
}

/**
 * Rewrites the document-relative asset URLs in index.html for a page that
 * lives one directory down. Anchors (#menu) and absolute URLs are left alone.
 */
function reprefix(html, prefix) {
  if (!prefix) return html;
  return html.replace(
    /((?:href|src|content|imagesrcset)=")(?!https?:|\/\/|\/|#|data:|mailto:|tel:)/g,
    (_, attr) => attr + prefix
  );
}

/*
 * The rendered markup needs a narrower rule than the template. Only the image
 * paths are document-relative; "careers.html" must stay as-is so it resolves
 * to the copy in this language's own directory, and the language switcher's
 * "./" and "../" are already correct.
 */
function reprefixBody(body, prefix) {
  if (!prefix) return body;
  return body.replace(/(^|["\s])images\//g, (_, before) => before + prefix + 'images/');
}

function buildPage({ code, dir, prefix, htmlLang }, template, translations) {
  const t = translations[code];
  // No path rewriting here: app.js already emits ASSETS-prefixed image URLs,
  // and it must, because the client re-render would otherwise undo them.
  const body = renderLang(code);

  // reprefix only rewrites the first URL of an attribute; srcset/imagesrcset
  // hold several, comma-separated, so sweep the rest with the body rule. It
  // cannot double-prefix: "../images/" has a slash before "images/", not a
  // quote or space.
  let html = reprefixBody(reprefix(template, prefix), prefix);

  html = html
    .replace(/<html lang="[^"]*">/, `<html lang="${htmlLang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t.pageTitle}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${t.pageDesc}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${SITE}/${dir ? dir + '/' : ''}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t.pageTitle}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${SITE}/${dir ? dir + '/' : ''}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${code === 'hr' ? 'hr_HR' : 'en_GB'}$2`)
    .replace(/(<meta property="og:locale:alternate" content=")[^"]*(")/, `$1${code === 'hr' ? 'en_GB' : 'hr_HR'}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t.pageTitle}$2`);

  // Tell search engines the two pages are translations of one another.
  const hreflang = [
    `<link rel="alternate" hreflang="hr" href="${SITE}/" />`,
    `<link rel="alternate" hreflang="en" href="${SITE}/en/" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
  ].join('\n');
  html = html.replace(/<link rel="canonical"[^>]*\/>/, (m) => m + '\n' + hreflang);

  // app.js needs to know which language this page is before it renders.
  html = html.replace(/(\s*)<script src="([^"]*)menu-data\.js"/,
    `$1<script>window.SITE_LANG = ${JSON.stringify(code)};</script>$1<script src="$2menu-data.js"`);

  // Drop the noscript stand-in: the real content is in the page now.
  html = html.replace(/\n\s*<!-- The page is rendered by React[\s\S]*?<\/noscript>\n/, '\n');

  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

const template = fs.readFileSync(path.join(ROOT, 'index.template.html'), 'utf8');
globalThis.SITE_LANG = 'hr';
globalThis.React = React;
globalThis.ReactDOM = { createRoot: () => ({ render() {} }) };
require(path.join(ROOT, 'menu-data.js'));
const { TRANSLATIONS } = require(path.join(ROOT, 'app.js'));

for (const lang of LANGS) {
  const html = buildPage(lang, template, TRANSLATIONS);
  const outDir = path.join(ROOT, lang.dir);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, 'index.html');
  fs.writeFileSync(out, html);
  const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
  console.log(`prerendered ${path.relative(ROOT, out).replace(/\\/g, '/')}  (${lang.code}, ${kb} KB)`);
}

/* ─────────────── careers page ─────────────── */
/*
 * careers.html is plain HTML rather than React, so its text is substituted
 * here from the same table careers.js uses. Every data-i18n element holds
 * text and nothing else, which is why a straight replacement is safe.
 */
function careersStrings() {
  const src = fs.readFileSync(path.join(ROOT, 'careers.js'), 'utf8');
  const start = src.indexOf('var T = {');
  const end = src.indexOf('\nvar lang =');
  // eslint-disable-next-line no-new-func
  return new Function('EMAIL', src.slice(start, end) + '; return T;')('info@subgourmet.hr');
}

const CAREERS_META = {
  hr: {
    title: 'Postani dio tima — Posao u Sub Gourmetu, Srebreno | Jobs',
    desc: 'Otvorena prijava za posao u restoranu Sub Gourmet, Srebreno (Župa Dubrovačka). Konobar, kuhar i pomoćni kuhar. Prijavite se online uz životopis.',
  },
  en: {
    title: 'Join the Team — Jobs at Sub Gourmet, Srebreno',
    desc: 'Open job application at Sub Gourmet restaurant in Srebreno, Zupa Dubrovacka, Croatia. Waiter, cook and assistant cook. Apply online with your CV.',
  },
};

/*
 * careers.html links to sibling pages (index.html, careers.html) as well as to
 * shared assets. Only the assets live at the site root, so a blanket rewrite
 * would send /en/careers.html back to the Croatian pages. Prefix stylesheets,
 * scripts and images; leave page links relative to the page's own directory.
 */
function reprefixAssets(html, prefix) {
  if (!prefix) return html;
  return html.replace(
    /((?:href|src)=")(images\/[^"]*|[^"\/]*\.(?:css|js))(")/g,
    (_, attr, url, end) => attr + prefix + url + end
  );
}

function buildCareers({ code, dir, prefix, htmlLang }, template, T) {
  const strings = T[code];
  const meta = CAREERS_META[code];
  let html = reprefixAssets(template, prefix);

  // Swap every translatable string for this language.
  html = html.replace(
    /(<([a-z][a-z0-9]*)[^>]*\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g,
    (whole, open, tag, key, _text, close) =>
      strings[key] === undefined ? whole : open + strings[key] + close
  );

  const base = `${SITE}/${dir ? dir + '/' : ''}careers.html`;
  html = html
    .replace(/<html lang="[^"]*">/, `<html lang="${htmlLang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${meta.desc}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${base}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${meta.title}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${base}$2`)
    .replace(/(<meta property="og:locale" content=")[^"]*(")/, `$1${code === 'hr' ? 'hr_HR' : 'en_GB'}$2`)
    .replace(/(<meta property="og:locale:alternate" content=")[^"]*(")/, `$1${code === 'hr' ? 'en_GB' : 'hr_HR'}$2`)
    // reprefix has already put "../" before the placeholder; swallow it, since
    // these hrefs are written relative to the page's own directory.
    .replace(/(?:\.\.\/)?__EN_HREF__/, code === 'en' ? './careers.html' : 'en/careers.html')
    .replace(/(?:\.\.\/)?__HR_HREF__/, code === 'en' ? '../careers.html' : './careers.html');

  const hreflang = [
    `<link rel="alternate" hreflang="hr" href="${SITE}/careers.html" />`,
    `<link rel="alternate" hreflang="en" href="${SITE}/en/careers.html" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}/careers.html" />`,
  ].join('\n');
  html = html.replace(/<link rel="canonical"[^>]*\/>/, (m) => m + '\n' + hreflang);

  html = html.replace(/(\s*)<script src="([^"]*)careers\.js"/,
    `$1<script>window.SITE_LANG = ${JSON.stringify(code)};</script>$1<script src="$2careers.js"`);

  return html;
}

const careersTemplate = fs.readFileSync(path.join(ROOT, 'careers.template.html'), 'utf8');
const careersT = careersStrings();

for (const lang of LANGS) {
  const html = buildCareers(lang, careersTemplate, careersT);
  const outDir = path.join(ROOT, lang.dir);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, 'careers.html');
  fs.writeFileSync(out, html);
  console.log('prerendered ' + path.relative(ROOT, out).split(path.sep).join('/') + '  (' + lang.code + ')');
}

/* ─────────────── sitemap ─────────────── */
/*
 * Generated here so it cannot drift from the pages actually produced. Each
 * entry carries xhtml:link alternates, which is how Google is told the two
 * language versions are the same page.
 */
const today = new Date().toISOString().slice(0, 10);
const PAIRS = [
  { hr: `${SITE}/`, en: `${SITE}/en/`, priority: '1.0', freq: 'monthly',
    image: `${SITE}/images/p1.jpg`, title: 'Sub Gourmet dining room, Srebreno' },
  { hr: `${SITE}/careers.html`, en: `${SITE}/en/careers.html`, priority: '0.6', freq: 'yearly' },
];

const urls = [];
for (const pair of PAIRS) {
  for (const code of ['hr', 'en']) {
    const alts = [
      `      <xhtml:link rel="alternate" hreflang="hr" href="${pair.hr}" />`,
      `      <xhtml:link rel="alternate" hreflang="en" href="${pair.en}" />`,
      `      <xhtml:link rel="alternate" hreflang="x-default" href="${pair.hr}" />`,
    ].join('\n');
    const image = pair.image && code === 'hr'
      ? `\n    <image:image>\n      <image:loc>${pair.image}</image:loc>\n` +
        `      <image:title>${pair.title}</image:title>\n    </image:image>`
      : '';
    urls.push(
      `  <url>\n    <loc>${pair[code]}</loc>\n    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>${pair.freq}</changefreq>\n    <priority>${pair.priority}</priority>\n` +
      `${alts}${image}\n  </url>`
    );
  }
}

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n' +
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
  urls.join('\n') + '\n</urlset>\n');
console.log(`wrote sitemap.xml (${urls.length} URLs)`);
