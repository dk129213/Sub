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
  { code: 'hr', dir: '', prefix: '', htmlLang: 'hr',
    careersDir: 'careers', careersPrefix: '../', careersUrl: `${SITE}/careers/` },
  { code: 'en', dir: 'en', prefix: '../', htmlLang: 'en',
    careersDir: 'en/careers', careersPrefix: '../../', careersUrl: `${SITE}/en/careers/` },
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

const template = fs.readFileSync(path.join(ROOT, 'src', 'index.template.html'), 'utf8');
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

function buildCareers({ code, careersDir, careersPrefix, careersUrl, htmlLang }, template, T) {
  const strings = T[code];
  const meta = CAREERS_META[code];
  let html = reprefixAssets(template, careersPrefix);

  // Swap every translatable string for this language.
  html = html.replace(
    /(<([a-z][a-z0-9]*)[^>]*\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g,
    (whole, open, tag, key, _text, close) =>
      strings[key] === undefined ? whole : open + strings[key] + close
  );

  const base = careersUrl;
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
    // From /careers/ the English copy is ../en/careers/; from /en/careers/ the
    // Croatian one is two levels up.
    .replace(/(?:\.\.\/)*__EN_HREF__/, code === 'en' ? './' : '../en/careers/')
    .replace(/(?:\.\.\/)*__HR_HREF__/, code === 'en' ? '../../careers/' : './');

  const hreflang = [
    `<link rel="alternate" hreflang="hr" href="${SITE}/careers/" />`,
    `<link rel="alternate" hreflang="en" href="${SITE}/en/careers/" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}/careers/" />`,
  ].join('\n');
  html = html.replace(/<link rel="canonical"[^>]*\/>/, (m) => m + '\n' + hreflang);

  html = html.replace(/(\s*)<script src="([^"]*)careers\.js"/,
    `$1<script>window.SITE_LANG = ${JSON.stringify(code)};` +
    `window.APPLY_URL = ${JSON.stringify(careersPrefix + 'apply.php')};</script>` +
    `$1<script src="$2careers.js"`);

  return html;
}

const careersTemplate = fs.readFileSync(path.join(ROOT, 'src', 'careers.template.html'), 'utf8');
const careersT = careersStrings();

for (const lang of LANGS) {
  const html = buildCareers(lang, careersTemplate, careersT);
  const outDir = path.join(ROOT, lang.careersDir);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, 'index.html');
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
  { hr: `${SITE}/careers/`, en: `${SITE}/en/careers/`, priority: '0.6', freq: 'yearly' },
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

/* ─────────────── price list (NN 101/2026) ─────────────── */
/*
 * Machine-readable price list, generated from the same MENU_DATA the menu
 * renders from, so the published file cannot drift from the page.
 *
 * No official CSV schema exists - the decision lists required fields but not
 * column names, order or delimiter. These are the service columns from the
 * brief: semicolon separated, UTF-8 with BOM so Excel opens it correctly,
 * dot decimals for machine readability.
 *
 * A new timestamped file is written only when the content actually changes.
 * For a service provider the obligation is to republish on the day a price
 * changes, not daily, so regenerating an identical file every build would
 * just fill the archive with noise.
 */
const CJENIK_DIR = path.join(ROOT, 'cjenik');
const OBJECT_TYPE = 'restoran';
// ASCII only: the ministry's example filename contains a colon, which cannot
// exist on NTFS, and diacritics are awkward in URLs. Colon becomes a hyphen.
const OBJECT_ADDRESS = 'Setaliste dr. Franje Tudmana 2A Srebreno';
const OBJECT_CODE = 'P-01';

const CSV_HEADER = [
  'naziv_usluge', 'maloprodajna_cijena', 'posebni_oblik_prodaje',
  'naziv_posebnog_oblika_prodaje', 'dodatna_cijena', 'datum_dodatne_cijene',
].join(';');

function csvCell(v) {
  const s = String(v == null ? '' : v);
  return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function buildCsv() {
  const rows = [CSV_HEADER];
  const seen = new Set();
  for (const section of globalThis.MENU_DATA) {
    for (const item of section.items) {
      const push = (name, priced) => {
        const a = globalThis.anchorOf(priced);
        const key = name.toLowerCase();
        if (seen.has(key)) return;          // same dish name in two sections
        seen.add(key);
        rows.push([
          csvCell(name),
          Number(priced.price).toFixed(2),
          priced.isSpecialSale ? 'DA' : 'NE',
          csvCell(priced.specialSaleName || ''),
          Number(a.price).toFixed(2),
          globalThis.anchorDateLabel(a.date, 'hr'),
        ].join(';'));
      };
      push(`${section.hr} - ${item.hr}`, item);
      for (const ex of item.extras || []) push(`${section.hr} - ${item.hr} - ${ex.hr}`, ex);
    }
  }
  return rows.join('\r\n') + '\r\n';
}

function publishCjenik() {
  fs.mkdirSync(CJENIK_DIR, { recursive: true });
  const csv = buildCsv();
  const rowCount = csv.trim().split('\r\n').length - 1;

  const existing = fs.readdirSync(CJENIK_DIR).filter((f) => f.endsWith('.csv')).sort();
  const current = path.join(CJENIK_DIR, 'aktualni.csv');
  const previous = fs.existsSync(current) ? fs.readFileSync(current, 'utf8') : null;
  const BOM = '\ufeff';

  if (previous === BOM + csv) {
    console.log(`cjenik unchanged (${rowCount} services) - no new archive file`);
    return;
  }

  const now = new Date();
  const p2 = (n) => String(n).padStart(2, '0');
  const stamp = `${p2(now.getDate())}.${p2(now.getMonth() + 1)}.${now.getFullYear()}`;
  const time = `${p2(now.getHours())}-${p2(now.getMinutes())}`;   // ":" is illegal on NTFS
  const seq = String(existing.filter((f) => f !== 'aktualni.csv').length + 1).padStart(3, '0');
  const name = `${OBJECT_TYPE}_${OBJECT_ADDRESS}_${OBJECT_CODE}_${seq}_${stamp}_${time}.csv`;

  fs.writeFileSync(path.join(CJENIK_DIR, name), BOM + csv);
  fs.writeFileSync(current, BOM + csv);            // stable URL, always newest
  console.log(`cjenik updated (${rowCount} services) -> cjenik/${name}`);
}

publishCjenik();

/*
 * Archive page. The decision requires superseded price lists to stay publicly
 * available for at least 30 days, so nothing here is ever deleted automatically
 * - old files are listed alongside the current one.
 */
function writeCjenikIndex() {
  const files = fs.readdirSync(CJENIK_DIR)
    .filter((f) => f.endsWith('.csv') && f !== 'aktualni.csv')
    .sort().reverse();

  const rows = files.map((f) => {
    const m = f.match(/_(\d{2}\.\d{2}\.\d{4})_(\d{2})-(\d{2})\.csv$/);
    const when = m ? `${m[1]} ${m[2]}:${m[3]}` : '';
    const kb = (fs.statSync(path.join(CJENIK_DIR, f)).size / 1024).toFixed(1);
    return `      <li><a href="${encodeURIComponent(f)}" download>${f}</a>` +
           `<span class="meta">${when} · ${kb} KB</span></li>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="hr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Cjenik — Sub Gourmet</title>
<meta name="description" content="Cjenik proizvoda i usluga u strojno čitljivom obliku (CSV) te arhiva prethodnih cjenika." />
<meta name="robots" content="noindex, follow" />
<link rel="stylesheet" href="../styles.css" />
<style>
  .cjenik { max-width: 820px; margin: 0 auto; padding: 80px 24px 120px; }
  .cjenik h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(34px, 6vw, 54px); margin-bottom: 18px; }
  .cjenik p { color: var(--ink-soft); line-height: 1.7; max-width: 62ch; }
  .cjenik .current { display: inline-flex; align-items: center; gap: 10px; margin: 26px 0 40px;
    padding: 14px 22px; border: 1px solid var(--gold); color: var(--gold);
    font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; }
  .cjenik h2 { font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--gold-deep); margin: 40px 0 14px; }
  .cjenik ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .cjenik li { display: flex; flex-wrap: wrap; gap: 4px 14px; align-items: baseline;
    padding-bottom: 10px; border-bottom: 1px solid var(--rule); font-size: 14px; }
  .cjenik li a { color: var(--ink); word-break: break-all; }
  .cjenik li a:hover { color: var(--gold); }
  .cjenik .meta { color: var(--ink-mute); font-size: 12px; }
  .cjenik .back { display: inline-block; margin-top: 44px; color: var(--gold); font-size: 13px; }
</style>
</head>
<body>
  <main class="cjenik">
    <h1>Cjenik</h1>
    <p>
      Cjenik usluga u strojno čitljivom obliku (CSV, UTF-8), objavljen u skladu s
      Odlukom o objavi cjenika proizvoda i usluga (NN 101/2026). Uz svaku je
      cijenu navedena i dodatna cijena — redovna cijena na dan 10.9.2026.
    </p>
    <a class="current" href="aktualni.csv" download>Preuzmi aktualni cjenik (CSV)</a>
    <p>
      Objekt: Sub Gourmet, Šetalište dr. Franje Tuđmana 2A, 20207 Srebreno.
      Cjenik se ponovno objavljuje na dan promjene cijena. Prethodne verzije
      ostaju dostupne najmanje 30 dana.
    </p>
    <h2>Arhiva</h2>
    <ul>
${rows || '      <li><span class="meta">Još nema arhiviranih cjenika.</span></li>'}
    </ul>
    <a class="back" href="../">&larr; Natrag na naslovnicu</a>
  </main>
</body>
</html>
`;
  fs.writeFileSync(path.join(CJENIK_DIR, 'index.html'), html);
  console.log(`wrote cjenik/index.html (${files.length} archived)`);
}

writeCjenikIndex();
