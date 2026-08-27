// scripts/check-budget.mjs
// Membaca dist/ setelah `npm run build` dan menggagalkan (exit 1) bila
// melewati BATAS KERAS di CLAUDE.md "Performance budget".
// Target (bukan batas keras) hanya diperingatkan, tidak menggagalkan.

import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';

// [target, batas keras] dalam byte
const KB = 1024;
const MB = 1024 * 1024;
const LIMITS = {
  jsGzip: { label: 'JS terkirim (gzip)', target: 45 * KB, hard: 80 * KB },
  cssGzip: { label: 'CSS (gzip)', target: 14 * KB, hard: 25 * KB },
  initialPage: { label: 'Berat halaman awal', target: 850 * KB, hard: 1.2 * MB },
  fontsTotal: { label: 'Total font', target: 95 * KB, hard: 120 * KB },
};

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push({ path: p, size: s.size });
  }
  return out;
}

function gzipLen(path) {
  return gzipSync(readFileSync(path), { level: 9 }).length;
}

function fmt(bytes) {
  if (bytes >= MB) return (bytes / MB).toFixed(2) + ' MB';
  return (bytes / KB).toFixed(1) + ' KB';
}

if (!existsSync(DIST)) {
  console.error(`[check:budget] Folder "${DIST}/" tidak ada. Jalankan "npm run build" dulu.`);
  process.exit(1);
}

const files = walk(DIST);
const byExt = (e) => files.filter((f) => extname(f.path).toLowerCase() === e);

const jsFiles = byExt('.js').concat(byExt('.mjs'));
const cssFiles = byExt('.css');
const fontFiles = byExt('.woff2').concat(byExt('.woff'), byExt('.ttf'));
const htmlFiles = byExt('.html');

const jsGzip = jsFiles.reduce((n, f) => n + gzipLen(f.path), 0);
const cssGzip = cssFiles.reduce((n, f) => n + gzipLen(f.path), 0);
const fontsTotal = fontFiles.reduce((n, f) => n + f.size, 0);

// "Halaman awal" = HTML terbesar + seluruh CSS + seluruh JS + font (tak terkompresi).
// Proxy konservatif: gambar per-section dimuat lazy dan tidak dihitung di sini.
const biggestHtml = htmlFiles.reduce((m, f) => Math.max(m, f.size), 0);
const cssRaw = cssFiles.reduce((n, f) => n + f.size, 0);
const jsRaw = jsFiles.reduce((n, f) => n + f.size, 0);
const initialPage = biggestHtml + cssRaw + jsRaw + fontsTotal;

const measured = {
  jsGzip,
  cssGzip,
  initialPage,
  fontsTotal,
};

const extra = {
  jsGzip: `${jsFiles.length} file`,
  cssGzip: `${cssFiles.length} file`,
  initialPage: `html ${fmt(biggestHtml)} + css ${fmt(cssRaw)} + js ${fmt(jsRaw)} + font ${fmt(fontsTotal)}`,
  fontsTotal: `${fontFiles.length} file`,
};

let hardFail = false;
let targetWarn = false;

console.log('\n  KATEGORI                     AKTUAL      TARGET     BATAS KERAS   STATUS');
console.log('  ' + '-'.repeat(78));
for (const [key, cfg] of Object.entries(LIMITS)) {
  const val = measured[key];
  const overHard = val > cfg.hard;
  const overTarget = val > cfg.target;
  if (overHard) hardFail = true;
  if (overTarget && !overHard) targetWarn = true;
  const status = overHard ? 'GAGAL (batas keras)' : overTarget ? 'di atas target' : 'ok';
  console.log(
    '  ' +
      cfg.label.padEnd(28) +
      fmt(val).padStart(9) +
      fmt(cfg.target).padStart(12) +
      fmt(cfg.hard).padStart(14) +
      '   ' +
      status
  );
  console.log('  ' + ' '.repeat(28) + `(${extra[key]})`);
}
console.log('  ' + '-'.repeat(78));

if (hardFail) {
  console.error('\n  ✖ BATAS KERAS DILANGGAR — build tidak boleh dicentang DONE.\n');
  process.exit(1);
}
if (targetWarn) {
  console.warn('\n  ⚠ Di atas target tapi masih di bawah batas keras — catat utang teknis.\n');
  process.exit(0);
}
console.log('\n  ✔ Semua kategori di bawah target.\n');
process.exit(0);
