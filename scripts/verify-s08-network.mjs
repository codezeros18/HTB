// scripts/verify-s08-network.mjs
// Bukti RUNTIME untuk AC yang tak bisa dilihat dari markup statis:
//   T08.2 — NOL request ke domain google sebelum interaksi; iframe google
//           baru muncul SETELAH tombol "Tampilkan peta" diklik.
//   T08.6 — 4 state form dipicu manual: validasi blur, submitting,
//           gagal (+ WhatsApp jalan keluar), honeypot → sukses diam-diam.
// Jalankan setelah `npm run build`:  node scripts/verify-s08-network.mjs
/* global document, setTimeout, URL */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 4388;
const BASE = `http://127.0.0.1:${PORT}`;

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
const cek = (nama, kondisi, detail = '') => {
  const ok = kondisi === true;
  if (ok) pass += 1;
  else fail += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${nama}${detail ? `  — ${detail}` : ''}`);
};

const isGoogle = (url) => /(^|\.)(google|gstatic|googleapis|ggpht)\.com/i.test(new URL(url).host);

await new Promise((r) => server.listen(PORT, r));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  // Beri waktu skrip inline (map-facade, contact-form) selesai pasang listener.
  await new Promise((r) => setTimeout(r, 300));

  /* ============ T08.2 · nol request google SEBELUM interaksi ============ */
  const googleSebelum = requests.filter(isGoogle);
  cek(
    'T08.2 NOL request ke domain google sebelum interaksi',
    googleSebelum.length === 0,
    `${googleSebelum.length} request${googleSebelum.length ? `: ${googleSebelum.join(', ')}` : ''}`
  );

  const jumlahIframeAwal = await page.$$eval('iframe', (els) => els.length);
  cek('T08.2 nol <iframe> di DOM sebelum interaksi', jumlahIframeAwal === 0);

  const jumlahRequestAwal = requests.length;

  /* ============ T08.2 · klik "Tampilkan peta" → iframe google muncul ============ */
  await page.click('[data-map-facade-trigger]');
  await new Promise((r) => setTimeout(r, 1500));

  const googleSesudah = requests.slice(jumlahRequestAwal).filter(isGoogle);
  cek(
    'T08.2 SETELAH klik: request google terjadi (facade benar-benar memuat Maps)',
    googleSesudah.length > 0,
    `${googleSesudah.length} request`
  );
  const iframeSrc = await page
    .$eval('.mv-location-card__peta-iframe', (el) => el.src)
    .catch(() => null);
  cek(
    'T08.2 iframe hasil klik ber-src google maps embed',
    Boolean(iframeSrc && iframeSrc.includes('google.com/maps')),
    iframeSrc ?? '(tidak ada)'
  );
  cek(
    'T08.2 tombol facade lain BELUM memicu iframe (hanya yang diklik)',
    (await page.$$eval('iframe', (els) => els.length)) === 1
  );

  // Muat ulang halaman bersih: iframe Google Maps asli (≈27 request, aplikasi
  // penuh) tidak boleh ikut campur saat menguji state form di bawah.
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 300));
  const reqSebelumForm = requests.length;

  /* ============ T08.6 · validasi saat blur ============ */
  await page.focus('#mv-kontak-nama');
  await page.click('#mv-kontak-instansi'); // memicu blur di nama (kosong, required)
  await new Promise((r) => setTimeout(r, 100));
  const errNamaTampil = await page.$eval('#mv-kontak-nama-err', (el) => !el.hidden);
  const ariaInvalid = await page.$eval('#mv-kontak-nama', (el) => el.getAttribute('aria-invalid'));
  cek('T08.6 blur field wajib kosong → pesan error tampil', errNamaTampil === true);
  cek('T08.6 blur field wajib kosong → aria-invalid="true"', ariaInvalid === 'true');

  await page.type('#mv-kontak-nama', 'Rina');
  await page.click('#mv-kontak-instansi');
  await new Promise((r) => setTimeout(r, 100));
  const errNamaHilang = await page.$eval('#mv-kontak-nama-err', (el) => el.hidden);
  cek(
    'T08.6 setelah diisi + blur → error hilang, aria-invalid dilepas',
    errNamaHilang === true &&
      (await page.$eval('#mv-kontak-nama', (el) => el.getAttribute('aria-invalid'))) === null
  );

  /* ============ T08.6 · submit tak lengkap → fokus ke field error ============ */
  await page.click('[data-submit]');
  await new Promise((r) => setTimeout(r, 100));
  const fokusKeError = await page.evaluate(() => document.activeElement?.id);
  cek(
    'T08.6 submit tak lengkap → fokus pindah ke field error pertama',
    fokusKeError === 'mv-kontak-kontak'
  );

  /* ============ T08.6 · submit lengkap, key null → state gagal + WA ============ */
  await page.type('#mv-kontak-kontak', '0812-3456-7890');
  await page.select('#mv-kontak-jenis', 'Racepack lomba lari');
  // requestSubmit() = perilaku klik tombol submit sesuai spec (validasi +
  // event 'submit'). Dipakai di sini karena page.click() headless kadang
  // "termakan" saat menutup dropdown <select> tepat sebelumnya — bukan
  // masalah produk; klik tombol nyata tetap diuji di blok honeypot.
  await page.$eval('[data-contact-form]', (f) => f.requestSubmit());
  await new Promise((r) => setTimeout(r, 400));

  const gagalTampil = await page.$eval('[data-gagal]', (el) => !el.hidden);
  const waJalanKeluar = await page.$eval('[data-gagal]', (el) =>
    Boolean(el.querySelector('a[href*="wa.me/6282168912769"]'))
  );
  const formMasihAda = await page.$eval('[data-contact-form]', (el) => !el.hidden);
  const tombolReset = await page.$eval('[data-submit]', (el) => ({
    disabled: el.disabled,
    teks: el.textContent.trim(),
  }));
  cek('T08.6 key null → state GAGAL tampil (nol request web3forms)', gagalTampil === true);
  cek('T08.6 state gagal menyediakan tombol WhatsApp jalan keluar', waJalanKeluar === true);
  cek('T08.6 state gagal TIDAK menyembunyikan form (data tak hilang)', formMasihAda === true);
  cek(
    'T08.6 setelah gagal, tombol submit kembali aktif + label semula',
    tombolReset.disabled === false && /kirim pesan/i.test(tombolReset.teks)
  );
  const web3 = requests.slice(reqSebelumForm).filter((u) => u.includes('web3forms'));
  cek('T08.6 NOL panggilan ke api.web3forms.com (key masih null)', web3.length === 0);

  /* ============ T08.5 · honeypot terisi → sukses diam-diam, tanpa kirim ============ */
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 200));
  await page.type('#mv-kontak-nama', 'Bot');
  await page.type('#mv-kontak-kontak', 'bot@spam.test');
  await page.select('#mv-kontak-jenis', 'Lainnya');
  await page.evaluate(() => {
    const hp = document.querySelector('[data-honeypot]');
    hp.value = 'http://spam.example';
  });
  const reqSebelumHp = requests.length;
  await page.click('[data-submit]');
  await new Promise((r) => setTimeout(r, 400));
  const suksesTampil = await page.$eval('[data-sukses]', (el) => !el.hidden);
  const formTersembunyi = await page.$eval('[data-contact-form]', (el) => el.hidden);
  const adaKirimJaringan = requests
    .slice(reqSebelumHp)
    .some((u) => u.includes('web3forms') || isGoogle(u));
  cek(
    'T08.5 honeypot terisi → state sukses (bot tidak diberi sinyal gagal)',
    suksesTampil === true && formTersembunyi === true
  );
  cek('T08.5 honeypot terisi → NOL request keluar', adaKirimJaringan === false);

  if (pageErrors.length) {
    fail += 1;
    console.log(`FAIL  nol error runtime di halaman — ${pageErrors.join(' | ')}`);
  } else {
    console.log('PASS  nol error runtime di halaman');
  }

  console.log(`\n${pass} PASS · ${fail} FAIL`);
} finally {
  await browser.close();
  server.close();
}

process.exit(fail === 0 ? 0 : 1);
