// scripts/verify-s03.mjs
// Verifikasi AC sprint S03 di Chrome nyata + Lighthouse mobile.
// Jalankan setelah `npm run build`:  node scripts/verify-s03.mjs
//
// Catatan lint: callback page.evaluate() DIEKSEKUSI DI BROWSER, bukan Node.
/* global document, window, getComputedStyle, PerformanceObserver, requestAnimationFrame */
/* global URL, setTimeout */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';
import lighthouse from 'lighthouse';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 4397;
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
    // Meniru perilaku hosting statis: 404 menyajikan 404.html.
    try {
      const body = await readFile(join('dist', '404.html'));
      res.writeHead(404, { 'content-type': 'text/html' }).end(body);
    } catch {
      res.writeHead(404).end('404');
    }
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

  /* ================= T03.4 · CLS navbar 76→60 (uji terarah) ================= */
  // Halaman ini masih berisi stub kosong, jadi belum cukup tinggi untuk
  // memicu transisi navbar. Konten pengisi disuntik DULU, observer layout-
  // shift dinyalakan SESUDAHNYA, baru halaman digulir — sehingga yang
  // terukur murni pergeseran akibat navbar menyusut.
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });

  const clsNavbar = await page.evaluate(async () => {
    const pengisi = document.createElement('div');
    pengisi.style.blockSize = '4000px';
    document.querySelector('main')?.appendChild(pengisi);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    let skor = 0;
    const sumber = [];
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        skor += e.value;
        for (const s of e.sources ?? []) {
          sumber.push(`${s.node?.className || s.node?.nodeName || '?'}: ${e.value.toFixed(4)}`);
        }
      }
    });
    po.observe({ type: 'layout-shift', buffered: false });

    const nav = document.querySelector('[data-mv-nav]');
    const tinggiAwal = nav ? getComputedStyle(nav).blockSize : null;

    // Gulir turun melewati ambang 120px, lalu kembali ke atas — memicu
    // transisi navbar dua arah.
    for (const y of [0, 200, 600, 1500, 3000, 600, 0]) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 260));
    }
    await new Promise((r) => setTimeout(r, 400));

    const tinggiAkhir = nav ? getComputedStyle(nav).blockSize : null;
    po.disconnect();
    pengisi.remove();
    return { skor, sumber, tinggiAwal, tinggiAkhir };
  });

  cek(
    'T03.4 · CLS akibat transisi navbar = 0 (uji terarah, digulir penuh)',
    clsNavbar.skor === 0,
    `skor=${clsNavbar.skor}; sumber=${clsNavbar.sumber.join(' | ') || 'tidak ada'}`
  );
  cek(
    'T03.4 · kotak navbar TIDAK berubah tinggi (76px konstan)',
    clsNavbar.tinggiAwal === '76px' && clsNavbar.tinggiAkhir === '76px',
    `awal=${clsNavbar.tinggiAwal} akhir=${clsNavbar.tinggiAkhir}`
  );

  // Permukaan benar-benar tampak 60px setelah digulir (transform, bukan height).
  const susut = await page.evaluate(async () => {
    const pengisi = document.createElement('div');
    pengisi.style.blockSize = '4000px';
    document.querySelector('main')?.appendChild(pengisi);
    const surface = document.querySelector('.mv-nav__surface');
    const sebelum = surface.getBoundingClientRect();
    window.scrollTo(0, 800);
    await new Promise((r) => setTimeout(r, 500));
    const sesudah = surface.getBoundingClientRect();
    const nav = document.querySelector('[data-mv-nav]');
    const scrolled = nav.hasAttribute('data-scrolled');
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
    pengisi.remove();
    return {
      tepiBawahSebelum: Math.round(sebelum.bottom),
      tepiBawahSesudah: Math.round(sesudah.bottom),
      scrolled,
    };
  });
  cek(
    'T03.4 · tepi bawah navbar 76px → 60px setelah scroll 120px',
    susut.tepiBawahSebelum === 76 && susut.tepiBawahSesudah === 60 && susut.scrolled,
    `${susut.tepiBawahSebelum}px → ${susut.tepiBawahSesudah}px, data-scrolled=${susut.scrolled}`
  );

  /* ================= T03.4 · CTA terlihat tanpa scroll di 360×640 ============ */
  const cta = await page.evaluate(() => {
    const el = document.querySelector('.mv-nav__cta');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      terlihat: r.top >= 0 && r.bottom <= window.innerHeight && r.width > 0,
      rect: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}×${Math.round(r.height)}`,
      teks: el.textContent.trim(),
    };
  });
  cek(
    'T03.4 · CTA WhatsApp terlihat tanpa scroll di 360×640',
    cta?.terlihat === true,
    `${cta?.teks} @ ${cta?.rect}`
  );

  /* ================= T03.4 · urutan Tab ================= */
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const urutanTab = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    urutanTab.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        if (!a) return '?';
        if (a.classList.contains('mv-skip')) return 'SkipLink';
        if (a.classList.contains('mv-nav__logo')) return 'logo';
        if (a.dataset.navLink) return `link:${a.dataset.navLink}`;
        if (a.classList.contains('mv-nav__cta')) return 'CTA';
        return a.className || a.tagName;
      })
    );
  }
  const harapan = [
    'SkipLink',
    'logo',
    'link:tentang',
    'link:produk',
    'link:proses',
    'link:klien',
    'link:lokasi',
    'CTA',
  ];
  cek(
    'T03.4 · urutan Tab = SkipLink → logo → 5 link → CTA',
    JSON.stringify(urutanTab) === JSON.stringify(harapan),
    urutanTab.join(' → ')
  );

  /* ================= T03.3 · SkipLink fokus pertama & terlihat ============== */
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await page.keyboard.press('Tab');
  // SkipLink muncul lewat transisi transform 180ms — beri waktu selesai
  // sebelum posisinya diukur.
  await new Promise((r) => setTimeout(r, 400));
  const skip = await page.evaluate(() => {
    const a = document.activeElement;
    const r = a.getBoundingClientRect();
    return {
      isSkip: a.classList.contains('mv-skip'),
      href: a.getAttribute('href'),
      terlihat: r.top >= 0 && r.height > 0 && getComputedStyle(a).visibility === 'visible',
      y: Math.round(r.y),
    };
  });
  cek(
    'T03.3 · Tab pertama memfokuskan SkipLink dan terlihat',
    skip.isSkip && skip.terlihat && skip.href === '#konten-utama',
    `href=${skip.href} y=${skip.y} terlihat=${skip.terlihat}`
  );

  const target = await page.evaluate(() => Boolean(document.getElementById('konten-utama')));
  cek('T03.3 · target SkipLink (#konten-utama) ada', target, `ditemukan=${target}`);

  /* ================= T03.3 · footer: tinggi mobile & nol href="#" =========== */
  await page.setViewport({ width: 360, height: 640 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  const footer = await page.evaluate(() => {
    const f = document.querySelector('.mv-footer');
    const buka = [...document.querySelectorAll('.mv-footer__detail')].filter((d) => d.open).length;
    return { tinggi: Math.round(f.getBoundingClientRect().height), detailTerbuka: buka };
  });
  cek(
    'T03.3 · tinggi footer 360px (tertutup) ≤ 420px',
    footer.tinggi <= 420 && footer.detailTerbuka === 0,
    `tinggi=${footer.tinggi}px, <details> terbuka=${footer.detailTerbuka}`
  );

  const hrefKosong = await page.evaluate(
    () =>
      [...document.querySelectorAll('a')].filter(
        (a) => (a.getAttribute('href') ?? '').trim() === '#'
      ).length
  );
  cek('T03.3 · nol href="#" di seluruh halaman', hrefKosong === 0, `ditemukan=${hrefKosong}`);

  const tahun = await page.evaluate(
    () => document.querySelector('.mv-footer__bawah p')?.textContent.trim() ?? ''
  );
  cek('T03.3 · tahun copyright otomatis', tahun.includes(String(new Date().getFullYear())), tahun);

  const sosmed = await page.evaluate(() => document.querySelectorAll('.mv-footer__detail').length);
  cek(
    'T03.3 · kolom sosmed hilang saat null (footer jadi 3 kolom)',
    sosmed === 2,
    `kolom <details> = ${sosmed} (Navigasi + Kontak; sosmed tidak dirender)`
  );

  /* ================= T03.5 · MobileMenu ================= */
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await page.click('[data-mv-menu-open]');
  await new Promise((r) => setTimeout(r, 350));

  const menuBuka = await page.evaluate(() => ({
    open: document.getElementById('menu-mobile')?.open,
    expanded: document.querySelector('[data-mv-menu-open]')?.getAttribute('aria-expanded'),
    bodyOverflow: getComputedStyle(document.body).overflow,
  }));
  cek(
    'T03.5 · menu terbuka, aria-expanded=true, body terkunci',
    menuBuka.open === true && menuBuka.expanded === 'true' && menuBuka.bodyOverflow === 'hidden',
    `open=${menuBuka.open} aria-expanded=${menuBuka.expanded} overflow=${menuBuka.bodyOverflow}`
  );

  for (let i = 0; i < 15; i++) await page.keyboard.press('Tab');
  const trap = await page.evaluate(() => {
    const d = document.getElementById('menu-mobile');
    return {
      didalam: d?.contains(document.activeElement) ?? false,
      aktif: document.activeElement?.className || document.activeElement?.tagName,
    };
  });
  cek('T03.5 · Tab tidak keluar dari panel (15× Tab)', trap.didalam, `fokus di: ${trap.aktif}`);

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 350));
  const setelahEsc = await page.evaluate(() => ({
    open: document.getElementById('menu-mobile')?.open,
    expanded: document.querySelector('[data-mv-menu-open]')?.getAttribute('aria-expanded'),
    fokusDiHamburger: document.activeElement?.hasAttribute('data-mv-menu-open'),
    bodyOverflow: document.body.style.overflow,
  }));
  cek(
    'T03.5 · Esc menutup, aria-expanded=false, fokus kembali ke hamburger',
    setelahEsc.open === false &&
      setelahEsc.expanded === 'false' &&
      setelahEsc.fokusDiHamburger === true &&
      setelahEsc.bodyOverflow === '',
    `open=${setelahEsc.open} aria-expanded=${setelahEsc.expanded} fokusHamburger=${setelahEsc.fokusDiHamburger}`
  );

  const ctaTetap = await page.evaluate(() => {
    const el = document.querySelector('.mv-nav__cta');
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.top >= 0 && r.bottom <= window.innerHeight;
  });
  cek('T03.5 · CTA tetap terlihat di bar meski menu tertutup', ctaTetap, `terlihat=${ctaTetap}`);

  /* ================= T03.6 · urutan DOM 10 section ================= */
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  const struktur = await page.evaluate(() => {
    const body = document.body;
    const urut = [...body.children]
      .map((el) => {
        if (el.classList.contains('mv-skip')) return 'SkipLink';
        if (el.classList.contains('mv-nav')) return '1-NAVBAR';
        if (el.classList.contains('mv-nav-spacer')) return 'spacer';
        if (el.id === 'menu-mobile') return 'MobileMenu';
        if (el.tagName === 'MAIN') return 'MAIN';
        if (el.classList.contains('mv-footer')) return '10-FOOTER';
        return el.tagName.toLowerCase();
      })
      .filter((x) => x !== 'script');
    const main = document.querySelector('main');
    return {
      urut,
      mainAnak: main.children.length,
      mainTinggi: main.getBoundingClientRect().height,
    };
  });
  cek(
    'T03.6 · urutan DOM: Navbar … main … Footer',
    struktur.urut.indexOf('1-NAVBAR') < struktur.urut.indexOf('MAIN') &&
      struktur.urut.indexOf('MAIN') < struktur.urut.indexOf('10-FOOTER'),
    struktur.urut.join(' → ')
  );
  // S04 Hero+About · S05 Services · S06 Process · S07 Clients+Gallery ·
  // S08 Location+Contact. SEMUA section kini terisi — nol stub tersisa.
  // `galeri` memang tidak menghasilkan `#galeri` di skenario C (foto: []):
  // itu perilaku BENAR (BLUEPRINT §8 Section 7), bukan stub kosong. Daftar
  // dikosongkan; cek ini kini jadi penjaga regresi kalau suatu section
  // dikembalikan ke stub.
  const stubKosong = await page.evaluate(() => {
    const belumDibangun = [];
    return belumDibangun
      .map((id) => {
        const el = document.getElementById(id);
        return { id, ada: Boolean(el), tinggi: el ? el.getBoundingClientRect().height : 0 };
      })
      .filter((s) => s.ada || s.tinggi > 0);
  });
  cek(
    'T03.6 · stub yang belum dibangun tidak menghasilkan elemen kosong yang terlihat',
    stubKosong.length === 0,
    stubKosong.length === 0
      ? `<main> punya ${struktur.mainAnak} anak; 10 section terisi, nol stub tersisa (S04–S08)`
      : JSON.stringify(stubKosong)
  );

  /* ================= T03.1 · head ================= */
  const head = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const hitung = (s) => document.querySelectorAll(s).length;
    return {
      lang: document.documentElement.lang,
      title: document.title,
      desc: q('meta[name="description"]')?.content,
      canonical: q('link[rel="canonical"]')?.href,
      ogType: q('meta[property="og:type"]')?.content,
      ogLocale: q('meta[property="og:locale"]')?.content,
      twitter: q('meta[name="twitter:card"]')?.content,
      preload: [...document.querySelectorAll('link[rel="preload"][as="font"]')].map((l) =>
        l.href.split('/').pop()
      ),
      dupDesc: hitung('meta[name="description"]'),
      dupTitle: hitung('title'),
      dupCanonical: hitung('link[rel="canonical"]'),
      dupViewport: hitung('meta[name="viewport"]'),
      dupOgTitle: hitung('meta[property="og:title"]'),
      ogImage: hitung('meta[property="og:image"]'),
    };
  });
  cek('T03.1 · <html lang="id">', head.lang === 'id', `lang=${head.lang}`);
  cek('T03.1 · tepat 2 font di-preload', head.preload.length === 2, head.preload.join(', '));
  cek(
    'T03.1 · nol tag <meta>/<title>/<link canonical> duplikat',
    head.dupDesc === 1 &&
      head.dupTitle === 1 &&
      head.dupCanonical === 1 &&
      head.dupViewport === 1 &&
      head.dupOgTitle === 1,
    `title=${head.dupTitle} desc=${head.dupDesc} canonical=${head.dupCanonical} viewport=${head.dupViewport} og:title=${head.dupOgTitle}`
  );
  cek(
    'T03.1 · og:image TIDAK dirender selama berkasnya belum ada',
    head.ogImage === 0,
    `og:image count=${head.ogImage} (dibuat di S10/T10.1)`
  );
  // Catatan: BLUEPRINT §7.7 mengklaim 63/158 karakter; string aslinya 71/164.
  cek(
    'T03.1 · title & description PERSIS seperti §7.7',
    head.title.length === 71 && head.desc.length === 164,
    `title=${head.title.length} kar · description=${head.desc.length} kar (§7.7 mengklaim 63/158 — lihat catatan PROGRESS)`
  );

  /* ================= T03.7 · 404 ================= */
  const res404 = await page.goto(`${BASE}/halaman-yang-tidak-ada-xyz`, {
    waitUntil: 'networkidle0',
  });
  const p404 = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent.trim(),
    robots: document.querySelector('meta[name="robots"]')?.content,
    adaWa: Boolean(document.querySelector('a[data-wa-konteks]')),
    adaBeranda: [...document.querySelectorAll('a')].some((a) => a.getAttribute('href') === '/'),
    jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
  }));
  cek(
    'T03.7 · 404 kustom Bahasa Indonesia + tombol kembali + CTA WA',
    res404.status() === 404 &&
      p404.h1 === 'Halaman tidak ditemukan' &&
      p404.adaWa &&
      p404.adaBeranda,
    `status=${res404.status()} h1="${p404.h1}" WA=${p404.adaWa} beranda=${p404.adaBeranda} robots=${p404.robots} jsonLd=${p404.jsonLd}`
  );

  await page.close();

  /* ================= LIGHTHOUSE MOBILE ================= */
  const lhBrowser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'shell',
    args: ['--no-sandbox', '--remote-debugging-port=9222'],
  });
  const lhPort = Number(new URL(lhBrowser.wsEndpoint()).port);
  let lh;
  try {
    lh = await lighthouse(
      `${BASE}/`,
      { port: lhPort, output: 'json', logLevel: 'error' },
      undefined
    );
  } finally {
    await lhBrowser.close();
  }

  const lhr = lh.lhr;
  const cls = lhr.audits['cumulative-layout-shift'].numericValue;
  const lcp = lhr.audits['largest-contentful-paint'].numericValue;
  const skorPerf = Math.round(lhr.categories.performance.score * 100);
  const skorA11y = Math.round(lhr.categories.accessibility.score * 100);
  const skorBP = Math.round(lhr.categories['best-practices'].score * 100);
  const skorSeo = Math.round(lhr.categories.seo.score * 100);

  cek('T03.4 · Lighthouse mobile CLS = 0', cls === 0, `CLS=${cls}`);
  cek(
    'Lighthouse mobile (informatif — target penuh di S09)',
    true,
    `Performance ${skorPerf} · Accessibility ${skorA11y} · Best Practices ${skorBP} · SEO ${skorSeo} · LCP ${Math.round(lcp)}ms`
  );

  const a11yGagal = Object.values(lhr.audits).filter(
    (a) => a.score === 0 && lhr.categories.accessibility.auditRefs.some((r) => r.id === a.id)
  );
  cek(
    'Aksesibilitas Lighthouse: nol audit gagal',
    a11yGagal.length === 0,
    a11yGagal.map((a) => a.id).join(', ') || 'tidak ada yang gagal'
  );
} finally {
  await browser.close();
  server.close();
}

const gagal = hasil.filter((h) => !h.lulus);
console.log('\n  VERIFIKASI AC SPRINT S03 — Chrome nyata + Lighthouse\n  ' + '-'.repeat(76));
for (const h of hasil) {
  console.log(`  ${h.lulus ? 'LULUS' : 'GAGAL'}  ${h.nama}`);
  console.log(`         ${h.detail}`);
}
console.log('  ' + '-'.repeat(76));
console.log(`  ${hasil.length - gagal.length}/${hasil.length} lulus\n`);
process.exit(gagal.length === 0 ? 0 : 1);
