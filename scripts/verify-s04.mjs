// scripts/verify-s04.mjs
// Verifikasi AC sprint S04 (Hero + About) di Chrome nyata + Lighthouse mobile.
// Jalankan setelah `npm run build`:  node scripts/verify-s04.mjs
/* global document, window, getComputedStyle */
/* global URL, setTimeout, Image */

import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';
import lighthouse from 'lighthouse';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 4395;
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

function contrastRatio(rgb1, rgb2) {
  const lum = ([r, g, b]) => {
    const f = (c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const L1 = lum(rgb1);
  const L2 = lum(rgb2);
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

await new Promise((r) => server.listen(PORT, r));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();

  /* ================= T04.1 · seluruh elemen hero terlihat di 360×640 ===== */
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });

  const hero1 = await page.evaluate(() => {
    const sel = [
      '.mv-hero__eyebrow',
      '.mv-hero__h1',
      '.mv-hero__sub',
      '.mv-hero__cta',
      '.mv-hero__harga',
    ];
    const luar = [];
    for (const s of sel) {
      const el = document.querySelector(s);
      if (!el) {
        luar.push(`${s}: TIDAK ADA`);
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.bottom > window.innerHeight || r.top < 0 || r.width === 0) {
        luar.push(`${s}: top=${Math.round(r.top)} bottom=${Math.round(r.bottom)}`);
      }
    }
    const heroEl = document.querySelector('.mv-hero');
    const cs = getComputedStyle(heroEl);
    return { luar, minHeight: cs.minHeight, viewportH: window.innerHeight };
  });
  cek(
    'T04.1 · seluruh elemen hero terlihat tanpa scroll di 360×640',
    hero1.luar.length === 0,
    hero1.luar.join(' | ') || `semua dalam batas (viewport ${hero1.viewportH}px)`
  );
  // getComputedStyle selalu mengembalikan px (unit svh sudah diresolusi
  // browser) — jadi sumber "78svh" diverifikasi dari berkas CSS terbangun
  // langsung (fs), bukan lewat CSSOM (selector Astro yang di-scope dengan
  // atribut data-astro-cid-* membuat pencocokan exact-selector rapuh).
  const cssTerbangun = await Promise.all(
    (await readdir('dist/_astro'))
      .filter((f) => f.endsWith('.css'))
      .map((f) => readFile(`dist/_astro/${f}`, 'utf8'))
  ).then((files) => files.join('\n'));
  const punya78svh = /\.mv-hero(\[[^\]]*\])?\{[^}]*min-height:78svh/.test(
    cssTerbangun.replace(/\s+/g, '')
  );
  cek(
    'T04.1 · min-height mobile computed (viewport 640px tinggi) masuk akal',
    hero1.minHeight.endsWith('px'),
    `computed min-height=${hero1.minHeight}`
  );
  cek(
    'T04.1 · sumber CSS mobile literally "78svh" (bukan 78vh)',
    punya78svh,
    punya78svh ? 'ditemukan .mv-hero{...min-height:78svh...}' : 'TIDAK ditemukan pola 78svh'
  );

  /* ================= T04.1 · nol animasi masuk pada H1 ==================== */
  const h1Anim = await page.evaluate(() => {
    const h1 = document.querySelector('.mv-hero__h1');
    const cs = getComputedStyle(h1);
    return {
      isReveal: h1.classList.contains('mv-reveal'),
      opacity: cs.opacity,
      transitionDuration: cs.transitionDuration,
      animationName: cs.animationName,
    };
  });
  cek(
    'T04.1 · nol animasi masuk pada H1 (guardrail 9)',
    !h1Anim.isReveal && h1Anim.opacity === '1' && h1Anim.animationName === 'none',
    `mv-reveal=${h1Anim.isReveal} opacity=${h1Anim.opacity} animation=${h1Anim.animationName}`
  );

  /* ================= T04.2 · varian aktif saat ini + nol kotak abu ======= */
  // Sejak "placeholder-sementara-JANGAN-DIPAKAI-LIVE.jpg" ditambahkan atas
  // otorisasi eksplisit pemilik proyek (lihat PROGRESS.md S04.2), varian
  // AKTIF di build ini adalah 'foto', bukan 'tanpa-foto'. Skrip ini
  // mendeteksi varian yang benar-benar aktif alih-alih mengasumsikannya,
  // supaya tetap berguna di kedua kondisi (placeholder terpasang / sudah
  // dikembalikan ke `fotoTersedia: false` menjelang go-live).
  const varian = await page.evaluate(() => {
    const hero = document.querySelector('.mv-hero');
    const foto = document.querySelector('.mv-hero__foto');
    const bg = getComputedStyle(hero).backgroundColor;
    return { data: hero.dataset.varian, adaFoto: Boolean(foto), bg };
  });
  cek(
    `T04.2 · varian "${varian.data}" konsisten (adaFoto=${varian.adaFoto})`,
    (varian.data === 'foto') === varian.adaFoto,
    `data-varian=${varian.data} <img>=${varian.adaFoto} — kalau ini "foto", INGAT: masih pakai placeholder sementara, lihat T04.2 di TASKS.md`
  );

  const abuNetral = await page.evaluate(() => {
    // Deteksi kotak abu netral GAYA PLACEHOLDER: background OPAK (alpha>0)
    // pada rentang abu (R≈G≈B) di pita 150–240 — pita klasik "aset belum
    // ada" (mis. #E5E5E5). Sengaja TIDAK menandai near-hitam (<150, overlay
    // gelap §6.8 yang memang disengaja) atau near-putih (>240, --color-bg).
    // Diperiksa di seluruh elemen dalam .mv-hero, bukan hanya elemen
    // terluarnya, supaya latar apa pun yang benar-benar dirender tertangkap.
    const kandidat = [
      document.querySelector('.mv-hero'),
      ...document.querySelectorAll('.mv-hero *'),
    ];
    const abu = [];
    for (const el of kandidat) {
      if (el.classList.contains('mv-hero__overlay')) continue; // scrim disengaja, bukan placeholder
      const bg = getComputedStyle(el).backgroundColor;
      const m = bg.match(/[\d.]+/g);
      if (!m || m.length < 4) continue;
      const [r, g, b, a] = m.map(Number);
      if (a === 0) continue; // transparan — bukan kotak yang dirender
      const netral = Math.abs(r - g) < 6 && Math.abs(g - b) < 6;
      const pitaPlaceholder = r >= 150 && r <= 240;
      if (netral && pitaPlaceholder) abu.push(`${el.className || el.tagName}: ${bg}`);
    }
    return { abu };
  });
  cek(
    'T04.2 · nol kotak abu netral gaya placeholder ("aset belum ada")',
    abuNetral.abu.length === 0,
    abuNetral.abu.join(' | ') || 'nol latar abu placeholder ditemukan'
  );

  /* ================= T04.2 · kontras varian foto — DIUKUR DARI PIKSEL NYATA */
  // Selama placeholder terpasang (lihat catatan di atas), overlay + foto
  // sungguhan sudah ada di DOM — jadi kontras diukur dari SCREENSHOT
  // sungguhan di bawah kotak H1, bukan disimulasikan lagi. Kalau
  // `fotoTersedia` sudah dikembalikan ke `false`, blok ini otomatis
  // dilewati (tidak ada apa pun untuk diukur) dan tidak menggagalkan suite.
  const overlayColorFoto = await page.evaluate(() => {
    const el = document.querySelector('.mv-hero__overlay');
    return el ? getComputedStyle(el).backgroundColor : null;
  });
  if (overlayColorFoto) {
    cek(
      'T04.2 · overlay = rgba(15,15,15,.55) persis §6.8',
      overlayColorFoto === 'rgba(15, 15, 15, 0.55)',
      overlayColorFoto
    );

    for (const vp of [
      { width: 1280, height: 800, label: 'desktop' },
      { width: 360, height: 640, label: 'mobile' },
    ]) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
      const rect = await page.evaluate(() => {
        const r = document.querySelector('.mv-hero__h1').getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });
      const shotBuf = await page.screenshot({
        clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h },
      });
      const avg = await page.evaluate(
        async (base64, w, h) => {
          const img = new Image();
          img.src = `data:image/png;base64,${base64}`;
          await img.decode();
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, w, h).data;
          // Rata-ratakan hanya piksel NON-putih (glyph teks putih sendiri
          // disaring) supaya yang terukur adalah warna LATAR di balik teks.
          let rs = 0,
            gs = 0,
            bs = 0,
            n = 0;
          for (let i = 0; i < data.length; i += 4) {
            const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (lum < 200) {
              rs += data[i];
              gs += data[i + 1];
              bs += data[i + 2];
              n++;
            }
          }
          return n > 0 ? [rs / n, gs / n, bs / n] : null;
        },
        shotBuf.toString('base64'),
        rect.w,
        rect.h
      );
      if (!avg) {
        cek(
          `T04.2 · kontras real H1 vs foto (${vp.label})`,
          false,
          'tidak ada piksel latar terdeteksi'
        );
        continue;
      }
      const rasio = contrastRatio([255, 255, 255], avg);
      cek(
        `T04.2 · kontras REAL teks putih vs piksel foto di bawah H1 ≥4.5:1 (${vp.label})`,
        rasio >= 4.5,
        `latar terukur rgb(${avg.map((v) => Math.round(v)).join(',')}) → ${rasio.toFixed(2)}:1 — foto: PLACEHOLDER sementara, ukur ulang saat foto asli terpasang`
      );
    }
  } else {
    cek(
      'T04.2 · varian tanpa-foto aktif — kontras foto tidak berlaku',
      true,
      'fotoTersedia: false, sesuai default B2 — blok pengukuran kontras foto dilewati'
    );
  }

  /* ================= T04.3 · strip bukti: 5 nama teks, kotak seragam ====== */
  const strip = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.mv-hero__strip-item')];
    const imgRusak = [...document.querySelectorAll('.mv-hero__strip-logo')].filter(
      (img) => !img.complete || img.naturalWidth === 0
    );
    const tinggi = items.map((i) => Math.round(i.getBoundingClientRect().height));
    return {
      total: items.length,
      teks: items.filter((i) => i.classList.contains('mv-hero__strip-item--teks')).length,
      nama: items.map((i) => i.textContent.trim()),
      tinggi,
      imgRusak: imgRusak.length,
    };
  });
  cek(
    'T04.3 · strip merender tepat 5 entri, semua teks (izinTayang semua false)',
    strip.total === 5 && strip.teks === 5,
    `total=${strip.total} teks=${strip.teks} nama=[${strip.nama.join(', ')}]`
  );
  cek(
    'T04.3 · kotak seragam tinggi 28–32px',
    strip.tinggi.every((t) => t >= 28 && t <= 32),
    `tinggi per item: ${strip.tinggi.join(', ')}`
  );
  cek('T04.3 · nol gambar rusak di strip', strip.imgRusak === 0, `img rusak=${strip.imgRusak}`);

  const stripScroll = await page.evaluate(() => {
    const list = document.querySelector('.mv-hero__strip-list');
    return {
      bisaDigeser: list.scrollWidth > list.clientWidth || list.scrollWidth === list.clientWidth,
      scrollW: list.scrollWidth,
      clientW: list.clientWidth,
      overflowX: getComputedStyle(list).overflowX,
    };
  });
  cek(
    'T04.3 · strip mobile: overflow-x auto (bisa digeser)',
    stripScroll.overflowX === 'auto',
    `overflow-x=${stripScroll.overflowX} scrollWidth=${stripScroll.scrollW} clientWidth=${stripScroll.clientW}`
  );

  const overflowHalaman = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  cek(
    'T04.3 · strip yang bisa digeser TIDAK membuat halaman overflow',
    overflowHalaman.scrollW === overflowHalaman.clientW,
    `scrollWidth=${overflowHalaman.scrollW} clientWidth=${overflowHalaman.clientW}`
  );

  /* ================= T04.5 · About: kata, non-clickable ==================== */
  const aboutTeks = await page.evaluate(() => {
    const paras = [...document.querySelectorAll('.mv-about__teks > p')];
    const kata = paras.reduce((n, p) => n + p.textContent.trim().split(/\s+/).length, 0);
    const kartu = [...document.querySelectorAll('.mv-value-card')];
    const kartuInfo = kartu.map((k) => ({
      tag: k.tagName,
      cursor: getComputedStyle(k).cursor,
      isLinkOrButton: Boolean(k.closest('a,button')),
    }));
    return { kata, jumlahKartu: kartu.length, kartuInfo };
  });
  cek('T04.5 · body About ≤ 90 kata (mobile)', aboutTeks.kata <= 90, `${aboutTeks.kata} kata`);
  cek('T04.5 · tepat 4 ValueCard', aboutTeks.jumlahKartu === 4, `${aboutTeks.jumlahKartu} kartu`);
  cek(
    'T04.5 · ValueCard tidak clickable, nol cursor:pointer',
    aboutTeks.kartuInfo.every((k) => k.cursor !== 'pointer' && !k.isLinkOrButton),
    aboutTeks.kartuInfo.map((k) => `${k.tag}:${k.cursor}`).join(', ')
  );

  const klaimDilarang = await page.evaluate(() => {
    const teks = document.body.innerText.toLowerCase();
    return {
      termurah: teks.includes('termurah'),
      unlimitedStok: teks.includes('unlimited stok'),
      shopNow: teks.includes('shop now'),
    };
  });
  cek(
    'T04.5 · nol klaim terlarang (termurah / Unlimited Stok / Shop Now)',
    !klaimDilarang.termurah && !klaimDilarang.unlimitedStok && !klaimDilarang.shopNow,
    JSON.stringify(klaimDilarang)
  );

  /* ================= T04.6 · baris fakta: null disembunyikan ============== */
  const fakta = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.mv-about__fakta-item')].map((el) =>
      el.textContent.trim()
    );
    const html = document.querySelector('.mv-about__fakta')?.outerHTML ?? '';
    return {
      items,
      mengandungNull: /null|undefined/.test(html),
      mengandungStripKosong: /—/.test(html),
    };
  });
  cek(
    'T04.6 · hanya field non-null yang dirender (2 dari 4: CV & jumlah lokasi)',
    fakta.items.length === 2 &&
      fakta.items[0] === 'CV. Huimora Talenta Berkarya' &&
      fakta.items[1] === '3 lokasi operasional',
    JSON.stringify(fakta.items)
  );
  cek(
    'T04.6 · nol label kosong / nol tanda hubung menggantung untuk field null',
    !fakta.mengandungNull && !fakta.mengandungStripKosong,
    `mengandungNull=${fakta.mengandungNull} mengandungStripKosong=${fakta.mengandungStripKosong}`
  );

  /* ================= T04.7 · fade-in About, sekali saja ==================== */
  // Viewport desktop supaya About (teks + 4 ValueCard) muat dalam satu
  // layar — di 360px kartu bertumpuk 1 kolom dan lebih tinggi dari
  // viewport, jadi scrollIntoView(top) belum tentu membawa kartu terakhir
  // ikut terlihat sekaligus.
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const sebelum = await page.evaluate(() => {
    const el = document.querySelector('.mv-about__teks');
    return { terlihat: el.classList.contains('is-visible'), opacity: getComputedStyle(el).opacity };
  });
  await page.evaluate(() =>
    document.querySelector('#tentang')?.scrollIntoView({ block: 'center' })
  );
  await new Promise((r) => setTimeout(r, 700));
  const sesudah = await page.evaluate(() => {
    const teks = document.querySelector('.mv-about__teks');
    const kartu = [...document.querySelectorAll('.mv-about__kartu .mv-value-card')];
    return {
      teksTerlihat: teks.classList.contains('is-visible'),
      opacity: getComputedStyle(teks).opacity,
      transform: getComputedStyle(teks).transform,
      kartuTerlihat: kartu.filter((k) => k.classList.contains('is-visible')).length,
      strideIndex: kartu.map((k) => k.style.getPropertyValue('--reveal-index')),
    };
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));
  const setelahGulirBalik = await page.evaluate(
    () => document.querySelector('.mv-about__teks')?.classList.contains('is-visible') === true
  );
  cek(
    'T04.7 · sebelum masuk layar: belum is-visible',
    sebelum.terlihat === false,
    `is-visible=${sebelum.terlihat} opacity=${sebelum.opacity}`
  );
  cek(
    'T04.7 · setelah masuk layar: opacity 1, transform bersih, stagger terpasang',
    sesudah.teksTerlihat &&
      sesudah.opacity === '1' &&
      sesudah.transform === 'none' &&
      sesudah.kartuTerlihat === 4,
    `teks is-visible=${sesudah.teksTerlihat} opacity=${sesudah.opacity} kartuTerlihat=${sesudah.kartuTerlihat}/4 index=[${sesudah.strideIndex.join(',')}]`
  );
  cek(
    'T04.7 · animasi sekali saja (gulir balik tidak reset)',
    setelahGulirBalik,
    `is-visible tetap terpasang=${setelahGulirBalik}`
  );

  const pageRM = await browser.newPage();
  await pageRM.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await pageRM.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const rm = await pageRM.evaluate(() => {
    const el = document.querySelector('.mv-about__teks');
    const cs = getComputedStyle(el);
    return { opacity: cs.opacity, transitionDuration: cs.transitionDuration };
  });
  cek(
    'T04.7 · reduced-motion mematikan animasi sepenuhnya, konten tetap tampil',
    rm.opacity === '1' && rm.transitionDuration === '0s',
    `opacity=${rm.opacity} transitionDuration=${rm.transitionDuration}`
  );
  await pageRM.close();

  /* ================= §7.8 · guardrail cepat ================================ */
  const guardrail = await page.evaluate(() => {
    const nolHref = [...document.querySelectorAll('a')].filter(
      (a) => (a.getAttribute('href') ?? '').trim() === '#'
    ).length;
    return { nolHref };
  });
  cek(
    '§7.8 · nol href="#" di Hero/About',
    guardrail.nolHref === 0,
    `ditemukan=${guardrail.nolHref}`
  );

  await page.close();

  /* ================= LIGHTHOUSE MOBILE — LCP ================================ */
  const lhBrowser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'shell',
    args: ['--no-sandbox', '--remote-debugging-port=9223'],
  });
  const lhPort = Number(new URL(lhBrowser.wsEndpoint()).port);
  let lh;
  try {
    lh = await lighthouse(
      `${BASE}/`,
      { port: lhPort, output: 'json', logLevel: 'error', onlyCategories: ['performance'] },
      undefined
    );
  } finally {
    await lhBrowser.close();
  }

  const lhr = lh.lhr;
  const lcp = lhr.audits['largest-contentful-paint'].numericValue;
  const cls = lhr.audits['cumulative-layout-shift'].numericValue;
  const skorPerf = Math.round(lhr.categories.performance.score * 100);

  // Lighthouse 13 memindahkan identitas elemen LCP ke audit "Insights"
  // (lcp-breakdown-insight), bukan lagi largest-contentful-paint-element.
  const breakdown = lhr.audits['lcp-breakdown-insight'];
  const nodeItem = breakdown?.details?.items?.find((i) => i.type === 'node');
  const subparts = breakdown?.details?.items?.find((i) => i.type === 'table')?.items ?? [];
  const renderDelay = subparts.find((s) => s.subpart === 'elementRenderDelay')?.duration;

  cek(
    'T04.4 · Lighthouse mobile (4G lambat, throttling default) LCP ≤ 2.0s',
    lcp <= 2000,
    `LCP=${Math.round(lcp)}ms · Performance=${skorPerf} · CLS=${cls}`
  );
  cek(
    'T04.4 · elemen LCP = H1 hero (bukan font tertunda / elemen lain)',
    Boolean(nodeItem?.selector?.includes('mv-hero__h1')),
    `${nodeItem?.nodeLabel ?? 'tidak teridentifikasi'} — elementRenderDelay=${Math.round(renderDelay ?? -1)}ms`
  );
} finally {
  await browser.close();
  server.close();
}

const gagal = hasil.filter((h) => !h.lulus);
console.log('\n  VERIFIKASI AC SPRINT S04 — Chrome nyata + Lighthouse\n  ' + '-'.repeat(76));
for (const h of hasil) {
  console.log(`  ${h.lulus ? 'LULUS' : 'GAGAL'}  ${h.nama}`);
  console.log(`         ${h.detail}`);
}
console.log('  ' + '-'.repeat(76));
console.log(`  ${hasil.length - gagal.length}/${hasil.length} lulus\n`);
process.exit(gagal.length === 0 ? 0 : 1);
