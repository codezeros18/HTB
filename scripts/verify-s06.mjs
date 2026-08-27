// scripts/verify-s06.mjs
// Verifikasi AC sprint S06 (Our Production Process) di Chrome nyata.
// Jalankan setelah `npm run build`:  node scripts/verify-s06.mjs
/* global document, window, getComputedStyle, navigator */
/* global setTimeout, PerformanceObserver */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 4384;
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

  /* ================= T06.1 · struktur semantik ================= */
  const semantik = await page.evaluate(() => {
    const sec = document.getElementById('proses');
    const ol = sec?.querySelector('ol.mv-proses__list');
    const li = ol ? [...ol.children].filter((c) => c.tagName === 'LI') : [];
    return {
      adaSection: Boolean(sec),
      olTag: ol?.tagName,
      jumlahLi: li.length,
      // Tiap <li> harus punya <h3> + paragraf deskripsi.
      semuaPunyaH3: li.every((l) => Boolean(l.querySelector('h3'))),
      semuaPunyaDesc: li.every((l) => Boolean(l.querySelector('.mv-proses__desc'))),
      // Urutan nama tahap sesuai DOM.
      urutanNama: li.map((l) => l.querySelector('h3')?.textContent.trim()),
      // Nomor visual harus aria-hidden (redundant: <ol> sudah menomori).
      nomorAriaHidden: [...(sec?.querySelectorAll('.mv-proses__nomor') ?? [])].every(
        (n) => n.getAttribute('aria-hidden') === 'true'
      ),
      // <ol> tidak boleh punya list-style yang menghilangkan semantik? (semantik
      // tetap ada walau list-style:none — yang penting tag-nya <ol>/<li>)
      panelAriaHidden: sec?.querySelector('.mv-proses__panel')?.getAttribute('aria-hidden'),
    };
  });

  const URUTAN_BENAR = [
    'Kedatangan Bahan',
    'Pembuatan Pola Produksi',
    'Cutting Bahan',
    'Grouping Bahan per Size',
    'Numbering',
    'Sewing',
    'Buang Benang',
    'Setrika Uap',
    'QC & Pemasangan Elemen',
    'QC Akhir',
    'Packing',
  ];

  cek(
    'T06.1 · <ol> dengan TEPAT 11 <li> (bukan div bernomor)',
    semantik.olTag === 'OL' && semantik.jumlahLi === 11,
    `tag=${semantik.olTag} jumlah <li>=${semantik.jumlahLi}`
  );
  cek(
    'T06.1 · tiap tahap punya <h3> + paragraf deskripsi',
    semantik.semuaPunyaH3 && semantik.semuaPunyaDesc,
    `h3 lengkap=${semantik.semuaPunyaH3} deskripsi lengkap=${semantik.semuaPunyaDesc}`
  );
  cek(
    'T06.1 · urutan 11 tahap persis BLUEPRINT §1.4 (tanpa melompat)',
    JSON.stringify(semantik.urutanNama) === JSON.stringify(URUTAN_BENAR),
    semantik.urutanNama.join(' → ')
  );
  cek(
    'T06.1 · panel media aria-hidden="true" (dekorasi, info ada di teks)',
    semantik.panelAriaHidden === 'true',
    `aria-hidden=${semantik.panelAriaHidden}`
  );
  cek(
    'T06.1 · nomor visual aria-hidden (redundan dgn penomoran <ol>)',
    semantik.nomorAriaHidden,
    `semua nomor aria-hidden=${semantik.nomorAriaHidden}`
  );

  /* ================= T06.2 · sticky = CSS murni ================= */
  const sticky = await page.evaluate(() => {
    const panel = document.querySelector('.mv-proses__panel');
    const cs = getComputedStyle(panel);
    const grid = getComputedStyle(document.querySelector('.mv-proses'));
    return {
      position: cs.position,
      top: cs.insetBlockStart,
      alignSelf: cs.alignSelf,
      display: grid.display,
      cols: grid.gridTemplateColumns,
    };
  });
  cek(
    'T06.2 · panel memakai position:sticky (desktop)',
    sticky.position === 'sticky',
    `position=${sticky.position} top=${sticky.top} align-self=${sticky.alignSelf}`
  );
  cek(
    'T06.2 · grid 2 kolom aktif di ≥1024px (5fr / 7fr)',
    sticky.display === 'grid' && sticky.cols.split(' ').length === 2,
    `display=${sticky.display} columns=${sticky.cols}`
  );

  // Panel benar-benar MENEMPEL saat digulir (bukan sekadar deklarasi CSS).
  // Pengukuran dimulai SETELAH titik lengket tercapai — sebelum itu panel
  // memang masih ikut mengalir bersama dokumen (perilaku sticky yang benar),
  // jadi membandingkan posisi awal vs akhir akan salah baca.
  const menempel = await page.evaluate(async () => {
    const sec = document.getElementById('proses');
    const panel = document.querySelector('.mv-proses__panel');
    const stickyTop = parseFloat(getComputedStyle(panel).insetBlockStart);

    sec.scrollIntoView();
    await new Promise((r) => setTimeout(r, 200));
    // Gulir sampai panel benar-benar terkunci di posisi lengketnya.
    window.scrollBy(0, 1200);
    await new Promise((r) => setTimeout(r, 250));
    const t1 = panel.getBoundingClientRect().top;

    // Gulir LAGI — kalau sticky bekerja, top-nya tidak boleh bergeser.
    window.scrollBy(0, 1500);
    await new Promise((r) => setTimeout(r, 250));
    const t2 = panel.getBoundingClientRect().top;

    return { t1: Math.round(t1), t2: Math.round(t2), stickyTop };
  });
  cek(
    'T06.2 · panel benar-benar menempel saat digulir (top viewport terkunci)',
    Math.abs(menempel.t1 - menempel.t2) <= 2 && Math.abs(menempel.t1 - menempel.stickyTop) <= 2,
    `top setelah gulir 1200px=${menempel.t1}px → +1500px lagi=${menempel.t2}px (titik lengket CSS=${menempel.stickyTop}px)`
  );

  /* ================= T06.3 · satu observer + crossfade + CLS ============ */
  const kartuAwal = await page.evaluate(() => {
    const k = [...document.querySelectorAll('[data-stage-card]')];
    return {
      total: k.length,
      aktif: k.filter((c) => c.classList.contains('is-active')).length,
      indexAktif: k.findIndex((c) => c.classList.contains('is-active')),
      transition: getComputedStyle(k[0]).transitionDuration,
    };
  });
  cek(
    'T06.3 · tepat 1 kartu aktif pada satu waktu (11 kartu ditumpuk)',
    kartuAwal.total === 11 && kartuAwal.aktif === 1,
    `total=${kartuAwal.total} aktif=${kartuAwal.aktif} (index ${kartuAwal.indexAktif})`
  );
  cek(
    'T06.3 · crossfade 240ms pada opacity kartu',
    kartuAwal.transition === '0.24s',
    `transition-duration=${kartuAwal.transition}`
  );

  // Gulir melewati beberapa blok — kartu aktif & progress harus berubah.
  const setelahGulir = await page.evaluate(async () => {
    const sec = document.getElementById('proses');
    const blok = [...sec.querySelectorAll('[data-stage]')];
    blok[5].scrollIntoView({ block: 'center' });
    await new Promise((r) => setTimeout(r, 500));
    const kartu = [...document.querySelectorAll('[data-stage-card]')];
    const bar = document.querySelector('[data-progress-bar]');
    return {
      indexAktif: kartu.findIndex((c) => c.classList.contains('is-active')),
      progress: bar?.style.getPropertyValue('--progress'),
      barTransform: getComputedStyle(bar).transform,
    };
  });
  cek(
    'T06.3 · kartu berganti saat blok ke-6 melewati garis tengah viewport',
    setelahGulir.indexAktif === 5,
    `index kartu aktif=${setelahGulir.indexAktif} (harap 5 = tahap 06)`
  );
  cek(
    'T06.3 · progress bar terisi sesuai posisi (6/11 ≈ 0.545)',
    Math.abs(Number(setelahGulir.progress) - 6 / 11) < 0.001,
    `--progress=${setelahGulir.progress} transform=${setelahGulir.barTransform}`
  );

  // Jumlah IntersectionObserver yang benar-benar dibuat (bukan 11).
  const jumlahObserver = await page.evaluate(async () => {
    // Muat ulang dengan instrumentasi konstruktor IO.
    return new Promise((resolve) => {
      window.__ioCount = 0;
      const Asli = window.IntersectionObserver;
      window.IntersectionObserver = function (...args) {
        window.__ioCount += 1;
        return new Asli(...args);
      };
      window.IntersectionObserver.prototype = Asli.prototype;
      resolve(true);
    });
  });
  void jumlahObserver;

  // Instrumentasi harus dipasang SEBELUM skrip halaman jalan → pakai
  // evaluateOnNewDocument di page baru.
  const pageIO = await browser.newPage();
  await pageIO.setViewport({ width: 1280, height: 900 });
  await pageIO.evaluateOnNewDocument(() => {
    window.__ioSignatures = [];
    const Asli = window.IntersectionObserver;
    window.IntersectionObserver = class extends Asli {
      constructor(cb, opts) {
        super(cb, opts);
        window.__ioSignatures.push(
          `${opts?.rootMargin ?? 'default'}|${JSON.stringify(opts?.threshold ?? 'default')}`
        );
      }
    };
  });
  await pageIO.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await pageIO.evaluate(() => document.getElementById('proses')?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 400));
  const io = await pageIO.evaluate(() => ({
    total: window.__ioSignatures.length,
    unik: [...new Set(window.__ioSignatures)],
    stepper: window.__ioSignatures.filter((s) => s.startsWith('-50% 0px -50% 0px')).length,
  }));
  cek(
    'T06.3 · SATU observer bersama untuk 11 blok (bukan 11 instance)',
    io.stepper === 1,
    `observer dgn rootMargin stepper = ${io.stepper} · total IO di halaman = ${io.total} (${io.unik.length} signature unik: ${io.unik.join(' , ')})`
  );
  await pageIO.close();

  // CLS kontribusi section = 0 saat kartu bertukar.
  const clsSection = await page.evaluate(async () => {
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
    let skor = 0;
    const sumber = [];
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        skor += e.value;
        for (const s of e.sources ?? []) {
          sumber.push(s.node?.className || s.node?.nodeName || '?');
        }
      }
    });
    po.observe({ type: 'layout-shift', buffered: false });

    const sec = document.getElementById('proses');
    const blok = [...sec.querySelectorAll('[data-stage]')];
    // Lewati seluruh 11 blok — memaksa 11 pergantian kartu.
    for (const b of blok) {
      b.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 220));
    }
    await new Promise((r) => setTimeout(r, 400));
    po.disconnect();
    return { skor, sumber: [...new Set(sumber)] };
  });
  cek(
    'T06.3 · CLS kontribusi section = 0 saat melewati 11 pergantian kartu',
    clsSection.skor === 0,
    `skor=${clsSection.skor} sumber=${clsSection.sumber.join(', ') || 'tidak ada'}`
  );

  /* ================= T06.4 · Rencana B ================= */
  const rencanaB = await page.evaluate(() => {
    const sec = document.getElementById('proses');
    const wrap = sec.querySelector('.mv-proses');
    const frame = sec.querySelector('.mv-proses__frame');
    const cs = getComputedStyle(frame);
    const nomor = sec.querySelector('.mv-proses__card-nomor');
    return {
      varian: wrap?.dataset.varian,
      jumlahImg: sec.querySelectorAll('img').length,
      bgFrame: cs.backgroundColor,
      fontSizeNomor: getComputedStyle(nomor).fontSize,
      warnaNomor: getComputedStyle(nomor).color,
      adaNamaTahapDiPanel: Boolean(sec.querySelector('.mv-proses__card-nama')?.textContent.trim()),
    };
  });
  cek(
    'T06.4 · varian "stepper" aktif (diturunkan dari data, 0 media < 6)',
    rencanaB.varian === 'stepper',
    `data-varian=${rencanaB.varian}`
  );
  cek(
    'T06.4 · NOL elemen <img> di seluruh section',
    rencanaB.jumlahImg === 0,
    `<img> ditemukan=${rencanaB.jumlahImg}`
  );
  const rgb = rencanaB.bgFrame.match(/[\d.]+/g)?.map(Number) ?? [];
  const abuNetral =
    rgb.length >= 3 &&
    Math.abs(rgb[0] - rgb[1]) < 6 &&
    Math.abs(rgb[1] - rgb[2]) < 6 &&
    rgb[0] >= 150 &&
    rgb[0] <= 240;
  cek(
    'T06.4 · panel BUKAN kotak abu netral (latar bertint aksen)',
    !abuNetral,
    `background=${rencanaB.bgFrame}`
  );
  cek(
    'T06.4 · nomor tahap raksasa 180px + nama tahap tampil di panel',
    parseFloat(rencanaB.fontSizeNomor) === 180 && rencanaB.adaNamaTahapDiPanel,
    `font-size nomor=${rencanaB.fontSizeNomor} warna=${rencanaB.warnaNomor} nama tahap ada=${rencanaB.adaNamaTahapDiPanel}`
  );

  /* ================= T06.5 · mobile <1024px ================= */
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const mobile = await page.evaluate(() => {
    const sec = document.getElementById('proses');
    const semua = [...sec.querySelectorAll('*')];
    const sticky = semua.filter((el) => getComputedStyle(el).position === 'sticky');
    const panel = sec.querySelector('.mv-proses__panel');
    const babak = [...sec.querySelectorAll('.mv-proses__babak')].filter(
      (b) => getComputedStyle(b).display !== 'none'
    );
    const li = sec.querySelectorAll('ol.mv-proses__list > li');
    return {
      jumlahSticky: sticky.length,
      stickyClass: sticky.map((s) => s.className),
      panelDisplay: getComputedStyle(panel).display,
      judulBabak: babak.map((b) => b.textContent.replace(/\s+/g, ' ').trim()),
      jumlahTahap: li.length,
      namaTahap: [...li].map((l) => l.querySelector('h3')?.textContent.trim()),
    };
  });
  cek(
    'T06.5 · di 360px TIDAK ADA elemen position:sticky aktif',
    mobile.jumlahSticky === 0,
    `sticky ditemukan=${mobile.jumlahSticky} ${mobile.stickyClass.join(', ')}`
  );
  cek(
    'T06.5 · panel sticky dimatikan TOTAL (display:none), bukan dikecilkan',
    mobile.panelDisplay === 'none',
    `panel display=${mobile.panelDisplay}`
  );
  cek(
    'T06.5 · keempat judul babak muncul sebagai pemisah',
    mobile.judulBabak.length === 4,
    mobile.judulBabak.join(' | ')
  );
  cek(
    'T06.5 · kesebelas nama tahap tetap ada di dalam babaknya',
    mobile.jumlahTahap === 11 && JSON.stringify(mobile.namaTahap) === JSON.stringify(URUTAN_BENAR),
    `${mobile.jumlahTahap} tahap, urutan cocok=${JSON.stringify(mobile.namaTahap) === JSON.stringify(URUTAN_BENAR)}`
  );

  await page.close();

  /* ================= T06.6 · DEGRADASI 1: JavaScript mati ============= */
  const pageNoJs = await browser.newPage();
  await pageNoJs.setViewport({ width: 1280, height: 900 });
  await pageNoJs.setJavaScriptEnabled(false);
  await pageNoJs.goto(`${BASE}/`, { waitUntil: 'load' });
  const noJs = await pageNoJs.evaluate(() => {
    const sec = document.getElementById('proses');
    const panel = sec.querySelector('.mv-proses__panel');
    const li = sec.querySelectorAll('ol.mv-proses__list > li');
    const kartuAktif = [...sec.querySelectorAll('[data-stage-card]')].filter((c) =>
      c.classList.contains('is-active')
    );
    return {
      posisiPanel: getComputedStyle(panel).position,
      jumlahTahap: li.length,
      kartuAktif: kartuAktif.length,
      progressDisplay: getComputedStyle(sec.querySelector('[data-progress-bar]')).display,
      htmlJs: document.documentElement.classList.contains('js'),
    };
  });
  cek(
    'T06.6 · [JS MATI] sticky TETAP bekerja (CSS murni, position:sticky)',
    noJs.posisiPanel === 'sticky',
    `position=${noJs.posisiPanel} · html.js=${noJs.htmlJs} (bukti JS benar-benar mati)`
  );
  cek(
    'T06.6 · [JS MATI] 11 tahap tetap lengkap terbaca',
    noJs.jumlahTahap === 11,
    `jumlah tahap=${noJs.jumlahTahap}`
  );
  cek(
    'T06.6 · [JS MATI] panel tidak kosong — kartu tahap 01 aktif dari SSR',
    noJs.kartuAktif === 1,
    `kartu aktif=${noJs.kartuAktif}`
  );
  cek(
    'T06.6 · [JS MATI] progress bar disembunyikan (tak bisa terisi tanpa JS)',
    noJs.progressDisplay === 'none',
    `display=${noJs.progressDisplay}`
  );
  await pageNoJs.close();

  /* ================= T06.6 · DEGRADASI 2: reduced-motion ============== */
  const pageRM = await browser.newPage();
  await pageRM.setViewport({ width: 1280, height: 900 });
  await pageRM.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await pageRM.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const rm = await pageRM.evaluate(() => {
    const sec = document.getElementById('proses');
    const panel = sec.querySelector('.mv-proses__panel');
    const kartu = sec.querySelector('[data-stage-card]');
    const bar = sec.querySelector('[data-progress-bar]');
    return {
      posisiPanel: getComputedStyle(panel).position,
      kartuTransition: getComputedStyle(kartu).transitionDuration,
      barTransition: getComputedStyle(bar).transitionDuration,
      jumlahTahap: sec.querySelectorAll('ol.mv-proses__list > li').length,
    };
  });
  cek(
    'T06.6 · [REDUCED-MOTION] crossfade dimatikan (transition 0s)',
    rm.kartuTransition === '0s',
    `kartu transition=${rm.kartuTransition}`
  );
  cek(
    'T06.6 · [REDUCED-MOTION] progress bar tidak dianimasikan (transition 0s)',
    rm.barTransition === '0s',
    `bar transition=${rm.barTransition}`
  );
  cek(
    'T06.6 · [REDUCED-MOTION] STICKY TETAP AKTIF (bukan animasi, jangan dimatikan)',
    rm.posisiPanel === 'sticky',
    `position=${rm.posisiPanel}`
  );
  cek(
    'T06.6 · [REDUCED-MOTION] 11 tahap tetap lengkap',
    rm.jumlahTahap === 11,
    `jumlah tahap=${rm.jumlahTahap}`
  );

  // Pergantian kartu harus TETAP terjadi (hanya transisinya yang hilang).
  const rmSwap = await pageRM.evaluate(async () => {
    const blok = [...document.querySelectorAll('#proses [data-stage]')];
    blok[3].scrollIntoView({ block: 'center' });
    await new Promise((r) => setTimeout(r, 400));
    const kartu = [...document.querySelectorAll('[data-stage-card]')];
    return kartu.findIndex((c) => c.classList.contains('is-active'));
  });
  cek(
    'T06.6 · [REDUCED-MOTION] pergantian kartu tetap berfungsi (seketika)',
    rmSwap === 3,
    `index kartu aktif=${rmSwap} (harap 3)`
  );
  await pageRM.close();

  /* ================= T06.6 · DEGRADASI 3: Save-Data ================== */
  const pageSD = await browser.newPage();
  await pageSD.setViewport({ width: 1280, height: 900 });
  await pageSD.setExtraHTTPHeaders({ 'Save-Data': 'on' });
  await pageSD.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      get: () => ({ saveData: true, effectiveType: '2g' }),
    });
  });
  await pageSD.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const sd = await pageSD.evaluate(() => {
    const sec = document.getElementById('proses');
    return {
      penanda: sec.querySelector('.mv-proses')?.hasAttribute('data-save-data'),
      jumlahTahap: sec.querySelectorAll('ol.mv-proses__list > li').length,
      jumlahImg: sec.querySelectorAll('img').length,
      jumlahVideo: sec.querySelectorAll('video').length,
    };
  });
  cek(
    'T06.6 · [SAVE-DATA] terdeteksi & section ditandai data-save-data',
    sd.penanda === true,
    `penanda dipasang=${sd.penanda}`
  );
  cek(
    'T06.6 · [SAVE-DATA] section tetap lengkap (11 tahap), nol media berat',
    sd.jumlahTahap === 11 && sd.jumlahImg === 0 && sd.jumlahVideo === 0,
    `tahap=${sd.jumlahTahap} img=${sd.jumlahImg} video=${sd.jumlahVideo} — Rencana B memang nol media, jadi tak ada klip untuk diganti poster`
  );
  await pageSD.close();

  /* ============ T06.7 · DEGRADASI 4: tanpa IntersectionObserver =======
     Diuji DUA skenario berbeda, karena keduanya menghasilkan keadaan
     JavaScript yang TIDAK sama dan sempat menyembunyikan bug nyata:

       A. "browser lama"  — properti benar-benar tidak ada di window.
                            `'IntersectionObserver' in window` → false
       B. "di-stub"       — properti ADA tapi bernilai undefined.
                            `'IntersectionObserver' in window` → TRUE,
                            lalu `new IntersectionObserver()` melempar.
                            Ini yang persis disebut AC ("di-undefined
                            secara paksa") dan yang paling sering lolos
                            dari pengujian.
  */
  const jalankanUjiNoIO = async (label, stub) => {
    const p = await browser.newPage();
    await p.setViewport({ width: 1280, height: 900 });
    const errorKonsol = [];
    p.on('console', (m) => {
      if (m.type() === 'error') errorKonsol.push(m.text());
    });
    p.on('pageerror', (e) => errorKonsol.push(`pageerror: ${e.message}`));
    await p.evaluateOnNewDocument(stub);
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    const hasilUji = await p.evaluate(() => {
      const sec = document.getElementById('proses');
      const wrap = sec.querySelector('.mv-proses');
      const li = sec.querySelectorAll('ol.mv-proses__list > li');
      const babak = [...sec.querySelectorAll('.mv-proses__babak')].filter(
        (b) => getComputedStyle(b).display !== 'none'
      );
      return {
        ioValid: typeof window.IntersectionObserver === 'function',
        penanda: wrap?.hasAttribute('data-no-io'),
        jumlahTahap: li.length,
        namaTahap: [...li].map((l) => l.querySelector('h3')?.textContent.trim()),
        panelDisplay: getComputedStyle(sec.querySelector('.mv-proses__panel')).display,
        wrapDisplay: getComputedStyle(wrap).display,
        babakTampil: babak.length,
      };
    });
    await p.close();

    // Pisahkan error yang berasal dari section INI vs modul lain.
    const errorObserverBersama = errorKonsol.filter((e) => /IntersectionObserver/i.test(e));
    const errorLain = errorKonsol.filter((e) => !/IntersectionObserver/i.test(e));

    cek(
      `T06.7 [${label}] · IntersectionObserver tidak valid (uji benar-benar aktif)`,
      hasilUji.ioValid === false,
      `typeof window.IntersectionObserver === 'function' → ${hasilUji.ioValid}`
    );
    cek(
      `T06.7 [${label}] · section jatuh ke daftar vertikal (data-no-io)`,
      hasilUji.penanda === true &&
        hasilUji.panelDisplay === 'none' &&
        hasilUji.wrapDisplay === 'block',
      `penanda=${hasilUji.penanda} panel=${hasilUji.panelDisplay} wrap=${hasilUji.wrapDisplay}`
    );
    cek(
      `T06.7 [${label}] · 11 tahap tetap lengkap & urut`,
      hasilUji.jumlahTahap === 11 &&
        JSON.stringify(hasilUji.namaTahap) === JSON.stringify(URUTAN_BENAR),
      `${hasilUji.jumlahTahap} tahap, urutan cocok=${JSON.stringify(hasilUji.namaTahap) === JSON.stringify(URUTAN_BENAR)}`
    );
    cek(
      `T06.7 [${label}] · pemisah babak ikut tampil di mode fallback`,
      hasilUji.babakTampil === 4,
      `judul babak tampil=${hasilUji.babakTampil}`
    );

    return { errorKonsol, errorObserverBersama, errorLain };
  };

  // --- Skenario A: browser lama, properti benar-benar tidak ada ---
  const A = await jalankanUjiNoIO('A: properti tidak ada', () => {
    delete window.IntersectionObserver;
  });
  cek(
    'T06.7 [A: properti tidak ada] · NOL error di console',
    A.errorKonsol.length === 0,
    A.errorKonsol.join(' | ') || 'tidak ada error'
  );

  // --- Skenario B: di-stub undefined (bunyi persis AC) ---
  const B = await jalankanUjiNoIO('B: di-stub undefined', () => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      get: () => undefined,
    });
  });
  cek(
    'T06.7 [B: di-stub undefined] · NOL error dari Process.astro sendiri',
    B.errorLain.length === 0,
    B.errorLain.join(' | ') || 'tidak ada error di luar observer.ts bersama'
  );
  cek(
    'T06.7 [B: di-stub undefined] · NOL error dari observer.ts bersama (S02, di luar cakupan S06)',
    B.errorObserverBersama.length === 0,
    B.errorObserverBersama.length === 0
      ? 'tidak ada error'
      : `${B.errorObserverBersama.length} error dari observer.ts (dipanggil BaseLayout/Navbar, BUKAN Process.astro): ${B.errorObserverBersama[0]}`
  );
} finally {
  await browser.close();
  server.close();
}

const gagal = hasil.filter((h) => !h.lulus);
console.log('\n  VERIFIKASI AC SPRINT S06 — Chrome nyata\n  ' + '-'.repeat(76));
for (const h of hasil) {
  console.log(`  ${h.lulus ? 'LULUS' : 'GAGAL'}  ${h.nama}`);
  console.log(`         ${h.detail}`);
}
console.log('  ' + '-'.repeat(76));
console.log(`  ${hasil.length - gagal.length}/${hasil.length} lulus\n`);
process.exit(gagal.length === 0 ? 0 : 1);
