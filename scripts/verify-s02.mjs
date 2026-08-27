// scripts/verify-s02.mjs
// Verifikasi AC sprint S02 di browser NYATA (Chrome terpasang, via puppeteer-core).
// Bukan bagian dari build. Jalankan: node scripts/verify-s02.mjs
// Prasyarat: `npm run build` sudah dijalankan (script ini menyajikan dist/).
//
// Catatan lint: callback di dalam page.evaluate() DIEKSEKUSI DI BROWSER,
// bukan di Node — jadi global DOM di bawah ini memang tersedia saat berjalan.
/* global document, window, getComputedStyle, setTimeout */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const DIST = 'dist';
const PORT = 4399;
const URL = `http://127.0.0.1:${PORT}/probe/`;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  try {
    let p = join(DIST, decodeURIComponent((req.url ?? '/').split('?')[0]));
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
  args: ['--no-sandbox', '--font-render-hinting=none'],
});

try {
  const page = await browser.newPage();

  /* ---------- T02.4 · 360px: tabel digeser, HALAMAN tidak meluber ---------- */
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0' });

  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  cek(
    'T02.4 · 360px nol overflow horizontal HALAMAN',
    overflow.scrollW === overflow.clientW,
    `scrollWidth=${overflow.scrollW} clientWidth=${overflow.clientW}`
  );

  const tabel = await page.evaluate(() => {
    const wrap = document.querySelector('[data-mv-table-scroll]');
    if (!wrap) return null;
    const before = wrap.scrollLeft;
    wrap.scrollLeft = 9999;
    const after = wrap.scrollLeft;
    wrap.scrollLeft = before;
    return { bisaDigeser: after > 0, scrollW: wrap.scrollWidth, clientW: wrap.clientWidth };
  });
  cek(
    'T02.4 · tabel 8 kolom bisa digeser sendiri',
    tabel?.bisaDigeser === true,
    `tabel scrollWidth=${tabel?.scrollW} clientWidth=${tabel?.clientW}`
  );

  const sticky = await page.evaluate(() => {
    const th = document.querySelector('.is-sticky th[scope="row"]');
    return th ? getComputedStyle(th).position : null;
  });
  cek('T02.4 · kolom pertama sticky di mobile', sticky === 'sticky', `position=${sticky}`);

  const tnum = await page.evaluate(() => {
    const td = document.querySelector('td.t-tnum');
    return td ? getComputedStyle(td).fontVariantNumeric : null;
  });
  cek('T02.4 · angka tabel tabular-nums', String(tnum).includes('tabular-nums'), `${tnum}`);

  /* ---------- T02.2 · target sentuh ≥44×44 di <768px ---------- */
  const tap = await page.evaluate(() => {
    const kontrol = document.querySelectorAll('.mv-btn, [role="tab"], summary, .mv-modal__tutup');
    const kecil = [];
    kontrol.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return; // tersembunyi
      if (r.height < 44 || r.width < 44) {
        kecil.push(`${el.className || el.tagName}: ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
    });
    return { total: kontrol.length, kecil };
  });
  cek(
    'T02.2 · target sentuh ≥44×44px di 360px',
    tap.kecil.length === 0,
    `${tap.total} kontrol diperiksa; pelanggar: ${tap.kecil.join(' | ') || 'tidak ada'}`
  );

  /* ---------- T02.1 · jarak dua section = 96/56px ---------- */
  const jarakMobile = await page.evaluate(() => {
    const s = document.querySelectorAll('main > .mv-section');
    if (s.length < 2) return null;
    const a = s[0].getBoundingClientRect();
    const b = s[1].getBoundingClientRect();
    return Math.round(b.top - a.bottom + parseFloat(getComputedStyle(s[1]).paddingBlockStart));
  });
  cek('T02.1 · jarak antar section 56px (mobile)', jarakMobile === 56, `${jarakMobile}px`);

  /* ---------- T02.5 · tab: panah + 3 sinyal pembeda ---------- */
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0' });

  const jarakDesktop = await page.evaluate(() => {
    const s = document.querySelectorAll('main > .mv-section');
    if (s.length < 2) return null;
    const a = s[0].getBoundingClientRect();
    const b = s[1].getBoundingClientRect();
    return Math.round(b.top - a.bottom + parseFloat(getComputedStyle(s[1]).paddingBlockStart));
  });
  cek('T02.1 · jarak antar section 96px (desktop)', jarakDesktop === 96, `${jarakDesktop}px`);

  await page.focus('[role="tab"][aria-selected="true"]');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 300));
  const setelahPanah = await page.evaluate(() => {
    const aktif = document.querySelector('[role="tab"][aria-selected="true"]');
    const panel = document.getElementById(aktif?.getAttribute('aria-controls') ?? '');
    return {
      id: aktif?.dataset.tabId,
      fokusDiTabAktif: document.activeElement === aktif,
      panelTampil: panel ? !panel.hidden : false,
      panelLainTersembunyi:
        [...document.querySelectorAll('[role="tabpanel"]')].filter((p) => !p.hidden).length === 1,
    };
  });
  cek(
    'T02.5 · panah kanan ×2 memindah tab & fokus',
    setelahPanah.id === 'bahan' && setelahPanah.fokusDiTabAktif,
    `tab aktif=${setelahPanah.id}, fokus=${setelahPanah.fokusDiTabAktif}`
  );
  cek(
    'T02.5 · tepat satu tabpanel terlihat',
    setelahPanah.panelTampil && setelahPanah.panelLainTersembunyi,
    `panel tampil=${setelahPanah.panelTampil}`
  );

  const sinyal = await page.evaluate(() => {
    const aktif = document.querySelector('[role="tab"][aria-selected="true"]');
    const nonaktif = document.querySelector('[role="tab"][aria-selected="false"]');
    if (!aktif || !nonaktif) return null;
    const ca = getComputedStyle(aktif);
    const cn = getComputedStyle(nonaktif);
    const la = getComputedStyle(aktif.querySelector('.mv-tabs__label'));
    const ln = getComputedStyle(nonaktif.querySelector('.mv-tabs__label'));
    return {
      warna: ca.color !== cn.color,
      weight: la.fontWeight !== ln.fontWeight,
      border: ca.borderBlockEndColor !== cn.borderBlockEndColor,
      nilai: `warna ${cn.color}→${ca.color}, weight ${ln.fontWeight}→${la.fontWeight}, border ${cn.borderBlockEndColor}→${ca.borderBlockEndColor}`,
    };
  });
  cek(
    'T02.5 · tab aktif dibedakan warna + weight + border',
    Boolean(sinyal?.warna && sinyal?.weight && sinyal?.border),
    sinyal?.nilai ?? 'tidak terbaca'
  );

  const geser = await page.evaluate(() => {
    const tabAktif = document.querySelector('[role="tab"][aria-selected="true"]');
    const nonaktif = document.querySelector('[role="tab"][aria-selected="false"]');
    return { aktifTabindex: tabAktif?.tabIndex, nonaktifTabindex: nonaktif?.tabIndex };
  });
  cek(
    'T02.5 · roving tabindex (aktif 0, sisanya -1)',
    geser.aktifTabindex === 0 && geser.nonaktifTabindex === -1,
    `aktif=${geser.aktifTabindex} nonaktif=${geser.nonaktifTabindex}`
  );

  /* ---------- T02.5 · deep link hash ---------- */
  await page.goto(`${URL}#racepack`, { waitUntil: 'networkidle0' });
  const hashAktif = await page.evaluate(
    () => document.querySelector('[role="tab"][aria-selected="true"]')?.dataset.tabId
  );
  cek(
    'T02.5 · deep link #racepack mengaktifkan tab',
    hashAktif === 'racepack',
    `aktif=${hashAktif}`
  );

  /* ---------- T02.2 · ring fokus 3px offset 2px ---------- */
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelector('.mv-btn')?.focus());
  const ring = await page.evaluate(() => {
    const el = document.querySelector('.mv-btn');
    const c = getComputedStyle(el);
    return {
      width: c.outlineWidth,
      style: c.outlineStyle,
      offset: c.outlineOffset,
      color: c.outlineColor,
    };
  });
  cek(
    'T02.2 · ring fokus 3px solid offset 2px',
    ring.width === '3px' && ring.style === 'solid' && ring.offset === '2px',
    `${ring.width} ${ring.style} ${ring.offset} ${ring.color}`
  );

  /* ---------- T02.2 · disabled tidak merespons klik ---------- */
  const disabled = await page.evaluate(() => {
    const btn = document.querySelector('button.mv-btn[data-disabled]');
    const link = document.querySelector('a.mv-btn[data-disabled]');
    let klik = 0;
    btn?.addEventListener('click', () => (klik += 1));
    btn?.click();
    return {
      ariaBtn: btn?.getAttribute('aria-disabled'),
      disabledAttr: btn?.disabled,
      klikTerpicu: klik,
      linkPunyaHref: link?.hasAttribute('href'),
      ariaLink: link?.getAttribute('aria-disabled'),
    };
  });
  cek(
    'T02.2 · disabled: aria-disabled benar & klik tidak terpicu',
    disabled.ariaBtn === 'true' &&
      disabled.disabledAttr === true &&
      disabled.klikTerpicu === 0 &&
      disabled.linkPunyaHref === false &&
      disabled.ariaLink === 'true',
    `button aria=${disabled.ariaBtn} disabled=${disabled.disabledAttr} klik=${disabled.klikTerpicu}; link href=${disabled.linkPunyaHref} aria=${disabled.ariaLink}`
  );

  /* ---------- T02.6 · Modal: focus trap, Esc, fokus balik, body terkunci ---------- */
  await page.click('[data-mv-modal-open="probe-modal"]');
  await new Promise((r) => setTimeout(r, 250));

  const modalBuka = await page.evaluate(() => ({
    open: document.getElementById('probe-modal')?.open,
    bodyOverflow: getComputedStyle(document.body).overflow,
  }));
  cek(
    'T02.6 · modal terbuka & body terkunci scroll',
    modalBuka.open === true && modalBuka.bodyOverflow === 'hidden',
    `open=${modalBuka.open} body.overflow=${modalBuka.bodyOverflow}`
  );

  // Tab 12× — kalau trap bocor, fokus keluar dari <dialog>.
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  const trap = await page.evaluate(() => {
    const dlg = document.getElementById('probe-modal');
    return {
      didalam: dlg?.contains(document.activeElement) ?? false,
      aktif: document.activeElement?.className || document.activeElement?.tagName,
    };
  });
  cek('T02.6 · Tab tidak keluar dari modal (12× Tab)', trap.didalam, `fokus di: ${trap.aktif}`);

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 250));
  const setelahEsc = await page.evaluate(() => ({
    open: document.getElementById('probe-modal')?.open,
    bodyOverflow: document.body.style.overflow,
    fokusDiPemicu: document.activeElement?.getAttribute('data-mv-modal-open') === 'probe-modal',
  }));
  cek(
    'T02.6 · Esc menutup, scroll lepas, fokus kembali ke pemicu',
    setelahEsc.open === false && setelahEsc.bodyOverflow === '' && setelahEsc.fokusDiPemicu,
    `open=${setelahEsc.open} body.overflow="${setelahEsc.bodyOverflow}" fokusPemicu=${setelahEsc.fokusDiPemicu}`
  );

  /* ---------- T02.6 · Accordion tanpa JavaScript ---------- */
  const pageNoJs = await browser.newPage();
  await pageNoJs.setJavaScriptEnabled(false);
  await pageNoJs.goto(URL, { waitUntil: 'domcontentloaded' });
  const accNoJs = await pageNoJs.evaluate(() => {
    const d = document.querySelector('#acc-mandiri');
    return { adaDetails: Boolean(d), tagSummary: d?.firstElementChild?.tagName };
  });
  // <details> membuka lewat mesin render, bukan JS — klik native tetap bekerja.
  await pageNoJs.click('#acc-mandiri > summary');
  const accTerbuka = await pageNoJs.evaluate(
    () => document.querySelector('#acc-mandiri')?.open === true
  );
  cek(
    'T02.6 · Accordion native berfungsi dengan JS mati',
    accNoJs.adaDetails && accNoJs.tagSummary === 'SUMMARY' && accTerbuka,
    `<details> ada=${accNoJs.adaDetails}, anak pertama=${accNoJs.tagSummary}, terbuka setelah klik=${accTerbuka}`
  );

  const revealNoJs = await pageNoJs.evaluate(() => {
    const el = document.querySelector('.mv-reveal');
    return { opacity: getComputedStyle(el).opacity, htmlClass: document.documentElement.className };
  });
  cek(
    'T02.8 · konten .mv-reveal tetap terlihat tanpa JS',
    revealNoJs.opacity === '1',
    `opacity=${revealNoJs.opacity}, <html class="${revealNoJs.htmlClass}">`
  );
  await pageNoJs.close();

  /* ---------- T02.8 · reduced motion => transition none ---------- */
  const pageRM = await browser.newPage();
  await pageRM.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await pageRM.goto(URL, { waitUntil: 'networkidle0' });
  const rm = await pageRM.evaluate(() => {
    const sampel = ['.mv-btn', '[role="tab"]', 'summary', '.mv-reveal', '.mv-acc__ikon'];
    const pelanggar = [];
    for (const sel of sampel) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const c = getComputedStyle(el);
      if (c.transitionDuration !== '0s' || c.animationDuration !== '0s') {
        pelanggar.push(
          `${sel}: transition=${c.transitionDuration} animation=${c.animationDuration}`
        );
      }
    }
    const rv = document.querySelector('.mv-reveal');
    return { pelanggar, revealOpacity: getComputedStyle(rv).opacity };
  });
  cek(
    'T02.8 · reduced-motion: transition & animation = 0s',
    rm.pelanggar.length === 0,
    rm.pelanggar.join(' | ') || 'seluruh sampel bersih'
  );
  cek(
    'T02.8 · reduced-motion: konten tampil penuh (tidak tersembunyi)',
    rm.revealOpacity === '1',
    `opacity=${rm.revealOpacity}`
  );
  await pageRM.close();

  /* ---------- T02.8 · reveal jalan saat JS aktif ---------- */
  // Sebelum digulir: elemen di bawah lipatan memang harus masih tersembunyi.
  const sebelumGulir = await page.evaluate(() => {
    const el = document.querySelector('.mv-reveal');
    return {
      htmlJs: document.documentElement.classList.contains('js'),
      terlihat: el?.classList.contains('is-visible'),
    };
  });
  cek(
    'T02.8 · observer memasang .js & elemen di bawah lipatan belum dianimasikan',
    sebelumGulir.htmlJs === true && sebelumGulir.terlihat === false,
    `html.js=${sebelumGulir.htmlJs} is-visible=${sebelumGulir.terlihat}`
  );

  await page.evaluate(() => document.querySelector('.mv-reveal')?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 600));
  const reveal = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.mv-reveal')];
    const el = els[0];
    return {
      terlihat: el?.classList.contains('is-visible'),
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
      semua: els.filter((e) => e.classList.contains('is-visible')).length,
      total: els.length,
      stagger: el?.style.getPropertyValue('--reveal-index'),
    };
  });
  cek(
    'T02.8 · setelah masuk layar: is-visible + opacity 1 + transform bersih',
    reveal.terlihat === true && reveal.opacity === '1' && reveal.transform === 'none',
    `is-visible=${reveal.semua}/${reveal.total} opacity=${reveal.opacity} transform=${reveal.transform} --reveal-index=${reveal.stagger}`
  );

  // Sekali saja: gulir balik ke atas lalu turun lagi tidak boleh mengulang animasi.
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));
  const tetapTerlihat = await page.evaluate(
    () => document.querySelector('.mv-reveal')?.classList.contains('is-visible') === true
  );
  cek(
    'T02.8 · animasi sekali saja (gulir balik tidak mereset)',
    tetapTerlihat,
    `is-visible tetap terpasang=${tetapTerlihat}`
  );

  /* ---------- T02.3 · WhatsApp deep link ---------- */
  const wa = await page.evaluate(() => {
    const a = document.querySelector('a[data-wa-konteks="produk"]');
    return { href: a?.getAttribute('href'), target: a?.target, rel: a?.rel };
  });
  cek(
    'T02.3 · WA deep link ter-encode + target/rel aman',
    Boolean(wa.href?.startsWith('https://wa.me/6282168912769?text=')) &&
      wa.href.includes('Regular%20T-shirt') &&
      wa.target === '_blank' &&
      wa.rel === 'noopener noreferrer',
    `${wa.href?.slice(0, 96)}…`
  );

  /* ---------- §7.8 · semantik tabel ---------- */
  const semantik = await page.evaluate(() => {
    const t = document.querySelector('table');
    return {
      caption: Boolean(t?.querySelector('caption')),
      thCol: t?.querySelectorAll('th[scope="col"]').length ?? 0,
      thRow: t?.querySelectorAll('th[scope="row"]').length ?? 0,
    };
  });
  cek(
    '§7.8 · tabel punya caption + th scope col/row',
    semantik.caption && semantik.thCol > 0 && semantik.thRow > 0,
    `caption=${semantik.caption} th[col]=${semantik.thCol} th[row]=${semantik.thRow}`
  );
} finally {
  await browser.close();
  server.close();
}

const gagal = hasil.filter((h) => !h.lulus);
console.log('\n  VERIFIKASI AC SPRINT S02 — Chrome nyata\n  ' + '-'.repeat(76));
for (const h of hasil) {
  console.log(`  ${h.lulus ? 'LULUS' : 'GAGAL'}  ${h.nama}`);
  console.log(`         ${h.detail}`);
}
console.log('  ' + '-'.repeat(76));
console.log(`  ${hasil.length - gagal.length}/${hasil.length} lulus\n`);
process.exit(gagal.length === 0 ? 0 : 1);
