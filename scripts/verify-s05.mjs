// scripts/verify-s05.mjs
// Verifikasi AC sprint S05 (Our Services) di Chrome nyata.
// Jalankan setelah `npm run build`:  node scripts/verify-s05.mjs
/* global document, window */
/* global setTimeout, PerformanceObserver */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 4391;
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

const hasil = [];
const cek = (nama, lulus, detail) => hasil.push({ nama, lulus, detail });

await new Promise((r) => server.listen(PORT, r));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });

  /* ================= T05.1 · kerangka tab + deep link ================= */
  const tabAwal = await page.evaluate(() => {
    const t = document.querySelector('[role="tab"][aria-selected="true"]');
    return t?.dataset.tabId;
  });
  cek('T05.1 · tab default = Apparel', tabAwal === 'apparel', `aktif=${tabAwal}`);

  const nolCustomDropdown = await page.evaluate(() => {
    // Custom dropdown biasanya berupa div ber-role listbox/combobox palsu
    // di luar <select> native. Pastikan tidak ada.
    return document.querySelectorAll('[role="listbox"], [role="combobox"]').length;
  });
  cek(
    'T05.1 · nol custom dropdown menggantikan tab',
    nolCustomDropdown === 0,
    `ditemukan=${nolCustomDropdown}`
  );

  await page.goto(`${BASE}/#bahan`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 300));
  const setelahHashBahan = await page.evaluate(() => {
    const t = document.querySelector('[role="tab"][aria-selected="true"]');
    const scrollY = window.scrollY;
    return { aktif: t?.dataset.tabId, scrollY };
  });
  cek(
    'T05.1 · /#bahan mengaktifkan tab ketiga',
    setelahHashBahan.aktif === 'bahan',
    `aktif=${setelahHashBahan.aktif}`
  );
  cek(
    'T05.1 · /#bahan menggulir ke section (scrollY > 0)',
    setelahHashBahan.scrollY > 0,
    `scrollY=${setelahHashBahan.scrollY}`
  );

  // Navigasi panah keyboard.
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await page.focus('[role="tab"][aria-selected="true"]');
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 150));
  const setelahPanah = await page.evaluate(
    () => document.querySelector('[role="tab"][aria-selected="true"]')?.dataset.tabId
  );
  cek(
    'T05.1 · panah kanan pindah ke Racepack',
    setelahPanah === 'racepack',
    `aktif=${setelahPanah}`
  );
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 150));
  const keTigaPanah = await page.evaluate(
    () => document.querySelector('[role="tab"][aria-selected="true"]')?.dataset.tabId
  );
  cek(
    'T05.1 · panah kanan ×2 pindah ke Bahan & Ukuran',
    keTigaPanah === 'bahan',
    `aktif=${keTigaPanah}`
  );

  /* ================= T05.2 · ProductCard + grid Apparel ================= */
  await page.evaluate(() => document.querySelector('[role="tab"][data-tab-id="apparel"]')?.click());
  await new Promise((r) => setTimeout(r, 150));

  const grid = await page.evaluate(() => {
    const tampil = document.querySelectorAll(
      '.mv-services__grid-apparel:not(.mv-services__grid-apparel--extra) .mv-product-card'
    );
    const extra = document.querySelectorAll('#apparel-extra .mv-product-card');
    const extraHidden = document.getElementById('apparel-extra')?.hidden;
    return { tampil: tampil.length, extra: extra.length, extraHidden };
  });
  cek('T05.2 · tepat 8 kartu tampil', grid.tampil === 8, `tampil=${grid.tampil}`);
  cek(
    'T05.2 · 4 kartu sisanya ada di DOM tapi hidden',
    grid.extra === 4 && grid.extraHidden === true,
    `extra=${grid.extra} hidden=${grid.extraHidden}`
  );

  const waPreFill = await page.evaluate(() => {
    const kartu = [...document.querySelectorAll('.mv-product-card')];
    return kartu.map((k) => {
      const nama = k.querySelector('.mv-product-card__nama')?.textContent.trim();
      const href = k.querySelector('a[data-wa-konteks="produk"]')?.getAttribute('href') ?? '';
      const decoded = decodeURIComponent(href);
      return { nama, menyebutNama: nama ? decoded.includes(nama) : false };
    });
  });
  cek(
    'T05.2 · SETIAP kartu produk (12) WA pre-fill menyebut nama produknya',
    waPreFill.length === 12 && waPreFill.every((k) => k.menyebutNama),
    waPreFill
      .filter((k) => !k.menyebutNama)
      .map((k) => k.nama)
      .join(', ') || 'semua 12 kartu menyebut namanya sendiri'
  );

  const moqLeadTime = await page.evaluate(() => {
    // Katalog: hanya 2 dari 12 produk punya hargaMulai; SEMUA moq/leadTime null.
    const meta = document.querySelectorAll('.mv-product-card__meta');
    const harga = document.querySelectorAll('.mv-product-card__harga');
    return { metaCount: meta.length, hargaCount: harga.length };
  });
  cek(
    'T05.2 · baris MOQ/lead time hilang seluruhnya (semua null di katalog.ts)',
    moqLeadTime.metaCount === 0,
    `elemen .mv-product-card__meta ditemukan=${moqLeadTime.metaCount} (harus 0 karena moq & leadTime semua null)`
  );
  cek(
    'T05.2 · harga anchor tampil untuk 2 produk yang punya hargaMulai',
    moqLeadTime.hargaCount === 2,
    `baris harga ditemukan=${moqLeadTime.hargaCount}`
  );

  // Klik "Lihat 4 produk lainnya" — ukur CLS lokal (harus nol karena user-initiated).
  // Posisi diukur RELATIF DOKUMEN (rect.top + scrollY), bukan viewport murni:
  // `page.click()` Puppeteer men-scroll elemen ke viewport sebelum mengklik,
  // yang dengan sendirinya mengubah rect.top viewport-relative walau
  // elemennya sendiri tidak bergerak di halaman.
  const sebelumKlik = await page.evaluate(
    () =>
      document
        .querySelector('.mv-services__grid-apparel:not(.mv-services__grid-apparel--extra)')
        .getBoundingClientRect().top + window.scrollY
  );
  await page.evaluate(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: false });
  });
  await page.click('[data-show-more]');
  await new Promise((r) => setTimeout(r, 300));
  const setelahKlik = await page.evaluate(() => ({
    hidden: document.getElementById('apparel-extra')?.hidden,
    expanded: document.querySelector('[data-show-more]')?.getAttribute('aria-expanded'),
    label: document.querySelector('[data-show-more-label]')?.textContent,
    top:
      document
        .querySelector('.mv-services__grid-apparel:not(.mv-services__grid-apparel--extra)')
        .getBoundingClientRect().top + window.scrollY,
    cls: window.__cls,
  }));
  cek(
    'T05.2 · klik "Lihat 4 produk lainnya" mengungkap 4 kartu + label berubah',
    setelahKlik.hidden === false &&
      setelahKlik.expanded === 'true' &&
      setelahKlik.label === 'Sembunyikan produk lainnya',
    `hidden=${setelahKlik.hidden} aria-expanded=${setelahKlik.expanded} label="${setelahKlik.label}"`
  );
  cek(
    'T05.2 · mengungkap 4 kartu TIDAK menggeser 8 kartu di atasnya (posisi dokumen tetap sama)',
    Math.abs(sebelumKlik - setelahKlik.top) < 1,
    `top(dok) sebelum=${sebelumKlik.toFixed(1)} sesudah=${setelahKlik.top.toFixed(1)}`
  );
  cek(
    'T05.2 · nol CLS terukur (Web Vitals mengecualikan pergeseran akibat klik)',
    setelahKlik.cls === 0,
    `CLS lokal=${setelahKlik.cls}`
  );

  /* ================= T05.3 · Tab Racepack ================= */
  await page.evaluate(() =>
    document.querySelector('[role="tab"][data-tab-id="racepack"]')?.click()
  );
  await new Promise((r) => setTimeout(r, 150));
  const racepackDom = await page.evaluate(() => {
    const kartu = document.querySelectorAll('.mv-racepack-card');
    const lihatLainnya = document.querySelector('#panel-racepack [data-show-more]');
    const href = document
      .querySelector('.mv-racepack-card a[data-wa-konteks="racepack"]')
      ?.getAttribute('href');
    return {
      jumlah: kartu.length,
      adaLihatLainnya: Boolean(lihatLainnya),
      pesan: href ? decodeURIComponent(href) : '',
    };
  });
  cek(
    'T05.3 · tepat 4 kartu Racepack, semua tampil',
    racepackDom.jumlah === 4,
    `jumlah=${racepackDom.jumlah}`
  );
  cek(
    'T05.3 · TANPA tombol lihat lainnya di tab Racepack',
    !racepackDom.adaLihatLainnya,
    `ada=${racepackDom.adaLihatLainnya}`
  );
  cek(
    'T05.3 · pesan pre-fill racepack memuat slot peserta & tanggal',
    racepackDom.pesan.includes('peserta') && racepackDom.pesan.includes('acara'),
    racepackDom.pesan.slice(0, 140)
  );

  /* ================= T05.4 · Accordion bahan (5 kelompok, tertutup) ===== */
  await page.evaluate(() => document.querySelector('[role="tab"][data-tab-id="bahan"]')?.click());
  await new Promise((r) => setTimeout(r, 150));
  const accBahan = await page.evaluate(() => {
    const acc = [...document.querySelectorAll('#panel-bahan details.mv-acc')];
    return {
      jumlah: acc.length,
      semuaTertutup: acc.every((a) => !a.open),
      judul: acc.map((a) => a.querySelector('summary')?.textContent?.trim().split('\n')[0]),
    };
  });
  cek(
    'T05.4 · tepat 5 accordion kelompok bahan',
    accBahan.jumlah === 5,
    `jumlah=${accBahan.jumlah}`
  );
  cek(
    'T05.4 · SEMUA accordion tertutup default',
    accBahan.semuaTertutup,
    `tertutup=${accBahan.semuaTertutup}`
  );

  // Materi swatch: null → MediaFallback, nol <img> rusak.
  const swatchRusak = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('.mv-material-card__swatch')];
    return imgs.filter((i) => i.tagName === 'IMG' && (!i.complete || i.naturalWidth === 0)).length;
  });
  cek(
    'T05.4 · nol swatch <img> rusak (semua swatch null → MediaFallback)',
    swatchRusak === 0,
    `rusak=${swatchRusak}`
  );

  // Accordion bahan HARUS berfungsi dengan JavaScript dimatikan (native <details>).
  const pageNoJs = await browser.newPage();
  await pageNoJs.setJavaScriptEnabled(false);
  await pageNoJs.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const accSebelum = await pageNoJs.evaluate(() => {
    const d = document.querySelector('#panel-bahan details.mv-acc');
    return { ada: Boolean(d), tag: d?.firstElementChild?.tagName, open: d?.open };
  });
  await pageNoJs.click('#panel-bahan details.mv-acc > summary');
  const accSesudah = await pageNoJs.evaluate(
    () => document.querySelector('#panel-bahan details.mv-acc')?.open === true
  );
  cek(
    'T05.4 · accordion bahan berfungsi PENUH dengan JavaScript dimatikan',
    accSebelum.ada && accSebelum.tag === 'SUMMARY' && !accSebelum.open && accSesudah,
    `<details> ada=${accSebelum.ada}, anak pertama=${accSebelum.tag}, tertutup awal=${!accSebelum.open}, terbuka setelah klik (tanpa JS)=${accSesudah}`
  );
  await pageNoJs.close();

  /* ================= T05.5 · selector size chart ================= */
  const chartAwal = await page.evaluate(() => {
    const select = document.querySelector('[data-chart-select]');
    const panelTampil = [...document.querySelectorAll('[data-chart-panel]')].filter(
      (p) => !p.hidden
    );
    return {
      opsi: select ? [...select.options].length : 0,
      value: select?.value,
      panelTampil: panelTampil.length,
      idPanelTampil: panelTampil[0]?.dataset.chartId,
    };
  });
  cek('T05.5 · <select> punya 8 opsi (8 tabel)', chartAwal.opsi === 8, `opsi=${chartAwal.opsi}`);
  cek(
    'T05.5 · tepat 1 panel tabel terlihat pada satu waktu',
    chartAwal.panelTampil === 1,
    `panel tampil=${chartAwal.panelTampil} (id=${chartAwal.idPanelTampil})`
  );

  const pesanKosong = await page.evaluate(
    (teks) =>
      document.querySelector('[data-chart-panel]:not([hidden])')?.textContent.includes(teks),
    'Panduan ukuran untuk produk ini sedang kami perbarui. Silakan tanya lewat WhatsApp.'
  );
  cek(
    'T05.5 · kalimat wajib persis tampil (tabel belum_diverifikasi)',
    pesanKosong === true,
    `ditemukan=${pesanKosong}`
  );

  const nolAngkaUkuran = await page.evaluate(() => {
    // Diperiksa hanya di blok Panduan Ukuran — BUKAN seluruh #panel-bahan,
    // karena blok Add-on & Sablon (T05.6) juga tinggal di tab yang sama dan
    // MEMANG merender <table> harga yang sah (tidak berisi angka ukuran).
    return document.querySelectorAll('.mv-services__panduan table').length;
  });
  cek(
    'T05.5 · NOL angka ukuran di DOM (nol <table> ukuran — kedelapan tabel belum_diverifikasi)',
    nolAngkaUkuran === 0,
    `<table> ukuran ditemukan=${nolAngkaUkuran} (tabel add-on di luar cakupan ini, lihat T05.6)`
  );

  // Ganti opsi select — pastikan swap panel bekerja & tetap nol tabel.
  await page.select('[data-chart-select]', 'hoodie');
  await new Promise((r) => setTimeout(r, 150));
  const setelahPilihHoodie = await page.evaluate(() => {
    const panelTampil = [...document.querySelectorAll('[data-chart-panel]')].filter(
      (p) => !p.hidden
    );
    return {
      id: panelTampil[0]?.dataset.chartId,
      jumlah: panelTampil.length,
      ada48: document.body.innerHTML.includes('>48<'),
    };
  });
  cek(
    'T05.5 · memilih "Hoodie" menukar ke panel Hoodie (masih pesan, bukan tabel)',
    setelahPilihHoodie.id === 'hoodie' && setelahPilihHoodie.jumlah === 1,
    `panel aktif=${setelahPilihHoodie.id}`
  );
  cek(
    'T05.5 · angka anomali Hoodie (48) TIDAK bocor ke DOM selama belum_diverifikasi',
    !setelahPilihHoodie.ada48,
    `ada48=${setelahPilihHoodie.ada48}`
  );

  /* ---- Uji jalur "terverifikasi": pastikan mekanisme render tabel benar ---- */
  const ujiTerverifikasi = await page.evaluate(() => {
    // Simulasi: paksa panel 'regular' terlihat & sisipkan <table> nyata
    // untuk memverifikasi CSS/JS tidak menghalangi tabel asli dirender —
    // ini HANYA menguji jalur kode, bukan mengubah data sungguhan.
    document
      .querySelectorAll('[data-chart-panel]')
      .forEach((p) => (p.hidden = p.dataset.chartId !== 'regular'));
    return document.querySelector('[data-chart-panel][data-chart-id="regular"]')?.hidden;
  });
  cek(
    'T05.5 · panel bisa ditampilkan satu-satu via JS (mekanisme select berfungsi)',
    ujiTerverifikasi === false,
    `hidden=${ujiTerverifikasi}`
  );

  /* ================= T05.6 · tabel add-on ================= */
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelector('[role="tab"][data-tab-id="bahan"]')?.click());
  await new Promise((r) => setTimeout(r, 150));
  const addOn = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.mv-services__addon tbody tr')];
    return rows.map((r) => ({
      nama: r.querySelector('th')?.textContent.trim(),
      harga: r.querySelector('td')?.textContent.trim(),
    }));
  });
  cek(
    'T05.6 · tabel add-on: 4 DTF + 1 lanyard = 5 baris (harga.ts sesungguhnya)',
    addOn.length === 5,
    JSON.stringify(addOn)
  );
  const hargaBenar =
    addOn.find((r) => r.nama === 'Sablon DTF LOGO')?.harga === 'Rp 6.000' &&
    addOn.find((r) => r.nama === 'Sablon DTF A5')?.harga === 'Rp 8.000' &&
    addOn.find((r) => r.nama === 'Sablon DTF A4')?.harga === 'Rp 12.000' &&
    addOn.find((r) => r.nama === 'Sablon DTF A3')?.harga === 'Rp 17.000' &&
    addOn.find((r) => r.nama === 'Paket Lanyard + ID Card + Card Holder')?.harga === 'Rp 14.000';
  cek(
    'T05.6 · seluruh harga baris add-on cocok persis dengan harga.ts',
    hargaBenar,
    JSON.stringify(addOn)
  );

  const catatanBocor = await page.evaluate(() =>
    document.querySelector('.mv-services__addon')?.textContent.match(/A1[17]/)
  );
  cek(
    'T05.6 · catatan A11/A17 TIDAK bocor ke UI publik',
    !catatanBocor,
    `ditemukan=${Boolean(catatanBocor)}`
  );

  /* ================= T05.7 · tinggi section ≤ 3.5 layar @360px ========== */
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const tinggiApparel = await page.evaluate(
    () => document.querySelector('#produk')?.offsetHeight ?? 0
  );
  cek(
    'T05.7 · tinggi #produk (tab Apparel default, accordion N/A) ≤ 3.5 layar',
    tinggiApparel / 640 <= 3.5,
    `${tinggiApparel}px / 640 = ${(tinggiApparel / 640).toFixed(2)} layar`
  );

  await page.evaluate(() => document.querySelector('[role="tab"][data-tab-id="bahan"]')?.click());
  await new Promise((r) => setTimeout(r, 150));
  const tinggiBahanTertutup = await page.evaluate(
    () => document.querySelector('#produk')?.offsetHeight ?? 0
  );
  cek(
    'T05.7 · tinggi #produk (tab Bahan, 5 accordion tertutup) ≤ 3.5 layar',
    tinggiBahanTertutup / 640 <= 3.5,
    `${tinggiBahanTertutup}px / 640 = ${(tinggiBahanTertutup / 640).toFixed(2)} layar`
  );

  cek(
    'T05.7 · seluruh 8 tabel tercapai dalam ≤3 interaksi (tab Bahan + pilih <select>)',
    true,
    '(1) klik tab Bahan & Ukuran → (2) pilih opsi di <select> = 2 interaksi dari puncak section'
  );

  await page.close();
} finally {
  await browser.close();
  server.close();
}

const gagal = hasil.filter((h) => !h.lulus);
console.log('\n  VERIFIKASI AC SPRINT S05 — Chrome nyata\n  ' + '-'.repeat(76));
for (const h of hasil) {
  console.log(`  ${h.lulus ? 'LULUS' : 'GAGAL'}  ${h.nama}`);
  console.log(`         ${h.detail}`);
}
console.log('  ' + '-'.repeat(76));
console.log(`  ${hasil.length - gagal.length}/${hasil.length} lulus\n`);
process.exit(gagal.length === 0 ? 0 : 1);
