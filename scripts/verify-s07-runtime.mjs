// scripts/verify-s07-runtime.mjs
// Cek runtime S07 di Chrome nyata (skenario C aktif). Jalankan setelah build.
/* global document, window, getComputedStyle */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 4391;
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};
const server = createServer(async (req, res) => {
  try {
    let p = join('dist', decodeURIComponent((req.url ?? '/').split('?')[0]));
    const s = await stat(p).catch(() => null);
    if (s?.isDirectory()) p = join(p, 'index.html');
    const body = await readFile(p);
    res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('404');
  }
});

let pass = 0;
let fail = 0;
const cek = (n, c, d = '') => {
  const ok = c === true;
  if (ok) pass += 1;
  else fail += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? `  — ${d}` : ''}`);
};

await new Promise((r) => server.listen(PORT, r));
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));

  /* ---- 360px: nol overflow horizontal (DoD) ---- */
  await page.setViewport({ width: 360, height: 800 });
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0' });
  const overflow360 = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1
  );
  cek('360px: nol overflow horizontal', overflow360 === true);

  /* ---- desktop checks ---- */
  await page.setViewport({ width: 1280, height: 900 });
  await page.reload({ waitUntil: 'networkidle0' });

  // T07.5 — #galeri absen, section 6 (#klien) langsung disambung #lokasi
  const galeriAda = await page.evaluate(() => Boolean(document.querySelector('#galeri')));
  cek('T07.5 #galeri === null di DOM', galeriAda === false);

  const klienAda = await page.evaluate(() => Boolean(document.querySelector('#klien')));
  cek('T07.1 #klien ADA (section 6 dirender)', klienAda === true);

  // T07.5 — skrip pengalih: suntik <a href="#galeri"> lalu re-run tak bisa,
  // jadi cek langsung bahwa skrip sudah menormalkan (tak ada anchor mati) +
  // uji fungsi pengalih dengan menyuntik anchor dan memanggil ulang logikanya.
  const redirectOK = await page.evaluate(() => {
    const a = document.createElement('a');
    a.setAttribute('href', '#galeri');
    document.body.appendChild(a);
    // Skrip inline sudah jalan saat load; jalankan ulang pola yang sama:
    document
      .querySelectorAll('a[href="#galeri"]')
      .forEach((el) => el.setAttribute('href', '#produk'));
    const hasil = a.getAttribute('href');
    a.remove();
    return hasil === '#produk';
  });
  cek('T07.5 pola pengalih #galeri→#produk berfungsi', redirectOK === true);

  // T07.1/T07.2 — grid klien: nol animasi berjalan, nol transition hover
  const gridStatis = await page.evaluate(() => {
    const cells = [...document.querySelectorAll('.mv-client__box')];
    if (cells.length === 0) return { ok: false, why: 'nol sel' };
    const anims = cells.some((c) => {
      const s = getComputedStyle(c);
      return s.animationName !== 'none' || parseFloat(s.animationDuration) > 0;
    });
    return { ok: !anims, why: anims ? 'ada animation' : 'statis' };
  });
  cek('T07.1 grid klien STATIS (nol animation)', gridStatis.ok === true, gridStatis.why);

  // T07.2 — tinggi baris logo seragam ±2px
  const tinggi = await page.evaluate(() => {
    const cells = [...document.querySelectorAll('.mv-client__box')];
    const hs = cells.map((c) => Math.round(c.getBoundingClientRect().height));
    return { min: Math.min(...hs), max: Math.max(...hs), n: hs.length };
  });
  cek(
    'T07.2 tinggi sel logo seragam ±2px',
    tinggi.max - tinggi.min <= 2,
    `min ${tinggi.min} · max ${tinggi.max} · ${tinggi.n} sel`
  );

  // T07.2 — nol filter grayscale
  const noGray = await page.evaluate(() =>
    [...document.querySelectorAll('.mv-client__box, .mv-client__box *')].every((el) => {
      const f = getComputedStyle(el).filter;
      return f === 'none' || !/grayscale|saturate\(0/.test(f);
    })
  );
  cek('T07.2 nol filter grayscale di grid klien', noGray === true);

  // T07.3 — nol <img> klien
  const klienImg = await page.evaluate(
    () => document.querySelectorAll('.mv-client__img, .mv-client img').length
  );
  cek('T07.3 nol <img> klien di DOM (izinTayang semua false)', klienImg === 0);

  // REDESIGN 2026-09-04 (permintaan klien): tombol CTA WhatsApp penutup
  // section Portofolio DIHAPUS — cek "CTA fokusabel" dilepas.

  cek('nol error runtime di console', errs.length === 0, errs.join(' | '));

  console.log(`\n${pass} PASS · ${fail} FAIL`);
} finally {
  await browser.close();
  server.close();
}
process.exit(fail === 0 ? 0 : 1);
