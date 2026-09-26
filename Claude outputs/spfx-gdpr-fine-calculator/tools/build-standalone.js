/* Builds the single file version: one .aspx (and an identical .txt) holding the
 * whole calculator, with nothing loaded from anywhere.
 *
 *   node tools/build-standalone.js [outDir]
 *
 * Default outDir is ./standalone/dist.
 *
 * It bundles standalone/entry.ts, which imports the same four modules the
 * SharePoint Framework web part imports, and drops the result into
 * standalone/page.template.html. Building both from one source is the point: a
 * change to the method reaches the web part and the page together, or neither.
 *
 * Needs esbuild. `npx esbuild` will fetch it if it is not installed.
 *
 * The checks at the end are not decoration. Each one has a specific failure in
 * mind:
 *   - `<%` and `%>` are ASP.NET code delimiters. SharePoint serves an .aspx
 *     from a document library through the ASP.NET pipeline, so either sequence
 *     anywhere in the file, even inside a string, can throw a parser error
 *     instead of rendering the page.
 *   - `</script` inside the bundle would close the inline script tag early.
 *   - an em dash is banned in everything this project ships.
 *   - any http:// or https:// reference outside the enforcement tracker links
 *     in the peer table would break the claim that the page calls nothing.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ENTRY = path.join(ROOT, 'standalone', 'entry.ts');
const TEMPLATE = path.join(ROOT, 'standalone', 'page.template.html');
const OUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'standalone', 'dist');

function fail(message) {
  console.error('build-standalone: ' + message);
  process.exit(1);
}

/* ------------------------------------------------------------------ bundle --- */

const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'fc-')), 'bundle.js');

const args = [
  '--yes', 'esbuild', ENTRY,
  '--bundle',
  '--format=iife',
  '--target=es2017',
  '--platform=browser',
  '--charset=utf8',
  '--outfile=' + tmp
];

try {
  execFileSync('npx', args, { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
} catch (e) {
  fail('esbuild failed. Run it by hand to see why:\n  npx esbuild ' + args.slice(2).join(' '));
}

let bundle = fs.readFileSync(tmp, 'utf8').replace(/\s+$/, '');

/* ---------------------------------------------------------------- assemble --- */

const rowCount = (bundle.match(/"ETid-/g) || []).length
  || (function () {
    /* Fallback: count rows by the leading id field of each tuple, whatever the
       prefix turns out to be. Asserted below, so a wrong count cannot ship. */
    const m = bundle.match(/FINE_ROWS\s*=\s*\[([\s\S]*?)\n\]/);
    return m ? (m[1].match(/\n?\s*\[/g) || []).length : 0;
  })();

const dataPath = path.join(ROOT, 'src', 'webparts', 'gdprFineCalculator', 'calculator', 'fineData.ts');
const dataSrc = fs.readFileSync(dataPath, 'utf8');
const declared = (dataSrc.match(/^\[".*\]?,?$/gm) || []).length;

if (!rowCount || (declared && rowCount !== declared)) {
  fail('could not agree on the row count: counted ' + rowCount + ' in the bundle, '
    + declared + ' in fineData.ts. The template says the number out loud, so it has to be right.');
}

const builtOn = new Date().toISOString().slice(0, 10);

let page = fs.readFileSync(TEMPLATE, 'utf8');
if (page.indexOf('__BUNDLE__') === -1) { fail('the template has no __BUNDLE__ marker'); }

page = page
  .split('__ROWCOUNT__').join(String(rowCount))
  .split('__BUILTON__').join(builtOn)
  .replace('__BUNDLE__', function () { return bundle; });

/* ------------------------------------------------------------------ checks --- */

if (page.indexOf('__') !== -1 && /__[A-Z]+__/.test(page)) {
  fail('an unreplaced placeholder is left in the page: ' + (page.match(/__[A-Z]+__/) || [])[0]);
}
if (page.indexOf('<%') !== -1 || page.indexOf('%>') !== -1) {
  fail('the page contains an ASP.NET code delimiter (<% or %>), which will throw a parser error when SharePoint serves it');
}
if (bundle.toLowerCase().indexOf('</script') !== -1) {
  fail('the bundle contains </script, which would close the inline script tag early');
}
if (page.indexOf(String.fromCharCode(0x2014)) !== -1) {
  fail('an em dash reached the page');
}

const ALLOWED_URL = 'https://www.enforcementtracker.com/';
const urls = (page.match(/https?:\/\/[^\s"'<>)]+/g) || []).filter(function (u) {
  return u.indexOf(ALLOWED_URL) !== 0;
});
if (urls.length) {
  fail('the page references an external URL, so it would not be self contained:\n  ' + urls.join('\n  '));
}

/* No subresource of any kind. These are the attributes a browser would fetch. */
if (/<(script|link|img|iframe|source|video|audio|object|embed)\b[^>]*\b(src|href)\s*=/i.test(page)) {
  fail('the page has a tag that would load something from outside the file');
}
if (/url\(\s*(?!['"]?data:)/i.test(page)) {
  fail('the page has a CSS url() that is not a data: URI');
}

/* --------------------------------------------------------------------- out --- */

fs.mkdirSync(OUT_DIR, { recursive: true });
const aspx = path.join(OUT_DIR, 'gdpr-fine-calculator.aspx');
const txt = path.join(OUT_DIR, 'gdpr-fine-calculator.aspx.txt');
fs.writeFileSync(aspx, page);
fs.writeFileSync(txt, page);

const kb = function (n) { return (n / 1024).toFixed(0) + ' KB'; };
console.log('wrote ' + aspx + '  (' + kb(Buffer.byteLength(page)) + ')');
console.log('wrote ' + txt + '  (identical, for the create-a-txt-then-rename route)');
console.log('  ' + rowCount + ' decisions inlined, bundle ' + kb(Buffer.byteLength(bundle)));
console.log('  no external references, no ASP.NET delimiters, no em dash');
