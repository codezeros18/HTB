/* =============================================================
   verify-s07.mjs — cek statis output S07 (Our Clients + Gallery).

   Bagian 1: cek AC pada `dist/index.html` APA ADANYA (skenario C aktif).
   Bagian 2: uji ketiga skenario Gallery dengan menukar HANYA data
             (`site.galeri.foto`), build ulang, cek output, lalu
             kembalikan file persis semula. Membuktikan AC T07.5/T07.6:
             "berpindah skenario tidak butuh perubahan kode di luar data".
   ============================================================= */
/* global URL */
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url);
const SITE = new URL('src/content/site.ts', ROOT);
const DIST = new URL('dist/index.html', ROOT);

let pass = 0;
let fail = 0;
const cek = (n, c) => {
  const ok = c === true;
  if (ok) pass += 1;
  else fail += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}`);
};
const info = (n, v) => console.log(`INFO  ${n} = ${v}`);

// `astro build` menyimpan cache inkremental yang TIDAK selalu invalidasi
// saat `src/content/*.ts` berubah — hapus dulu supaya swap data benar-benar
// terbaca (ditemukan saat menulis skrip ini).
const build = () => {
  for (const d of ['.astro', 'node_modules/.vite', 'dist']) {
    rmSync(new URL(d, ROOT), { recursive: true, force: true });
  }
  execSync('npm run build', { cwd: ROOT, stdio: 'ignore' });
};
const html = () => readFileSync(DIST, 'utf8');

/* ============ BAGIAN 1 — skenario C aktif (keadaan repo) ============ */
console.log('\n— BAGIAN 1: dist apa adanya (skenario C) —');
let h = html();

// T07.1 urutan kategori
const idx = (s) => h.indexOf(s);
cek(
  'T07.1 kategori Instansi & Pendidikan Tinggi PERTAMA di DOM',
  idx('Instansi Pemerintah') > 0 &&
    idx('Instansi Pemerintah') < idx('Korporat &amp; Properti') &&
    idx('Korporat &amp; Properti') < idx('Event &amp; Olahraga') &&
    idx('Event &amp; Olahraga') < idx('Komunitas &amp; Organisasi')
);
cek('T07.1 nol marquee', !/\bmarquee\b/i.test(h));
cek(
  'T07.1 nol animasi/transition pada grid klien',
  !/mv-klien[^{]*\{[^}]*(animation|transition)\s*:/i.test(h)
);
cek('T07.1 nol :hover pada .mv-client', !/\.mv-client[^{]*:hover/i.test(h));

// T07.3 fallback teks, nol <img> klien
cek('T07.3 nol <img class=mv-client__img> (semua izinTayang:false)', !/mv-client__img/.test(h));
info('T07.3 jumlah nama teks (mv-client__nama)', (h.match(/mv-client__nama/g) || []).length);
cek(
  'T07.3 ≥26 nama organisasi hadir sebagai teks',
  (h.match(/mv-client__nama/g) || []).length >= 26
);

// T07.4 heading + disclaimer + larangan string
cek('T07.4 H2 "PERNAH DIPERCAYA OLEH" ada', h.includes('PERNAH DIPERCAYA OLEH'));
cek(
  'T07.4 disclaimer merek persis',
  h.includes('Logo ditampilkan sebagai referensi pekerjaan yang pernah kami kerjakan') &&
    h.includes('Semua merek adalah milik pemiliknya masing-masing.')
);
cek('T07.4 string "Klien Kami" TIDAK ADA', !/Klien Kami/i.test(h));
cek('T07.4 string "Partner" TIDAK ADA', !/Partner/i.test(h));
cek(
  'T07.4 nol angka jumlah klien ("30+ klien" dsb)',
  !/\d+\s*\+?\s*(klien|organisasi|instansi|partner)/i.test(h)
);
cek('T07.4 nol alt="logo klien N"', !/alt="[^"]*logo klien/i.test(h));

// T07.5 skenario C
cek('T07.5 #galeri TIDAK ada di DOM', !/id="galeri"/.test(h));
cek('T07.5 nol <a href="#galeri"> (link mati)', !/<a\s[^>]*href="#galeri"/.test(h));
cek(
  'T07.5 skrip pengalih #galeri→#produk hadir',
  h.includes('a[href=\\"#galeri\\"]') || h.includes('a[href="#galeri"]')
);

// T07.6 skenario C: nol JS lightbox
cek('T07.6 nol markup lightbox (data-galeri-lightbox)', !/data-galeri-lightbox/.test(h));
cek('T07.6 nol id modal "galeri-lightbox"', !/galeri-lightbox/.test(h));
cek('T07.6 nol JS panah lightbox (data-galeri-next)', !/data-galeri-next/.test(h));

/* ============ BAGIAN 2 — tukar data, uji A & B, kembalikan ============ */
const asli = readFileSync(SITE, 'utf8');
const MARKER = 'foto: []';
const markerAt = asli.indexOf(MARKER);
if (markerAt === -1) throw new Error('tidak menemukan `foto: []` di site.ts');

const fotoDummy = (jml) => {
  const item = (i) =>
    `{ src: '/images/produk/dummy-${i}', alt: 'Contoh hasil ${i}', width: 1200, height: 1500, ` +
    `produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }`;
  return '[ ' + Array.from({ length: jml }, (_, i) => item(i)).join(', ') + ' ]';
};

// Swap berbasis indeks (bukan String.replace — string pengganti multi-baris
// dengan kutip tunggal kacau di sebagian shell).
const swapFoto = (jml) => {
  const patched =
    asli.slice(0, markerAt) + `foto: ${fotoDummy(jml)}` + asli.slice(markerAt + MARKER.length);
  writeFileSync(SITE, patched);
};

try {
  console.log('\n— BAGIAN 2: skenario A (12 foto) —');
  swapFoto(12);
  build();
  h = html();
  cek('T07.5 skenario A: #galeri ADA di DOM', /id="galeri"/.test(h));
  cek('T07.5 skenario A: grid 3 kolom (mv-galeri__grid)', /mv-galeri__grid/.test(h));
  cek('T07.6 skenario A: lightbox Modal hadir (galeri-lightbox)', /id="galeri-lightbox"/.test(h));
  cek('T07.6 skenario A: skrip panah lightbox hadir', /data-galeri-next/.test(h));
  cek('T07.6 skenario A: caption [produk] · [bahan] · [sablon]', /Kaos · Combed 24s · DTF/.test(h));
  cek('T07.6 skenario A: nol nama klien di caption (klienNama null)', !/· null/.test(h));
  const imgTags = h.match(/<img\b[^>]*>/g) || [];
  cek(
    'T07.7 skenario A: TIAP <img> punya width & height eksplisit (CLS=0)',
    imgTags.length > 0 && imgTags.every((t) => /\bwidth=/.test(t) && /\bheight=/.test(t))
  );
  cek(
    'T07.7 skenario A: <source> AVIF + WebP',
    /type="image\/avif"/.test(h) && /type="image\/webp"/.test(h)
  );

  console.log('\n— BAGIAN 2: skenario B (6 foto) —');
  swapFoto(6);
  build();
  h = html();
  cek('T07.5 skenario B: #galeri ADA di DOM', /id="galeri"/.test(h));
  cek('T07.5 skenario B: layout editorial (mv-galeri__editorial)', /mv-galeri__editorial/.test(h));
  cek(
    'T07.5 skenario B: lebar editorial 1080 (mv-container--editorial)',
    /mv-container--editorial/.test(h)
  );
  cek('T07.5 skenario B: padding vertikal roomy (mv-section--roomy)', /mv-section--roomy/.test(h));
  cek('T07.6 skenario B: NOL lightbox Modal', !/id="galeri-lightbox"/.test(h));
  cek('T07.6 skenario B: NOL skrip panah lightbox', !/data-galeri-next/.test(h));
} finally {
  writeFileSync(SITE, asli);
  build();
  const restored = readFileSync(SITE, 'utf8') === asli && !/id="galeri"/.test(html());
  cek('CLEANUP: site.ts dikembalikan & rebuild skenario C', restored === true);
}

console.log(`\n${pass} PASS · ${fail} FAIL`);
process.exit(fail === 0 ? 0 : 1);
