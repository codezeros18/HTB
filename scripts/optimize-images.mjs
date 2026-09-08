/* =============================================================
   optimize-images.mjs — kompresi aset gambar yang BENAR-BENAR
   direferensikan situs.

   Alasan dibuat (2026-09-08): klien melaporkan situs "lag". Penyebabnya
   BUKAN kurangnya lazy-load — melainkan berat berkasnya. Homepage
   merujuk ±15,3 MB gambar mentah, termasuk logo klien 1,7 MB yang
   dirender hanya 128x44 px, dan foto hero PNG 1,27 MB sebagai elemen LCP.
   Kompresi ini memangkas byte di sumbernya; lazy-load & loading screen
   hanya menyembunyikan gejalanya.

   Kebijakan per jenis (dari ATURAN ASET di CLAUDE.md):
     logo   — dirender <=160x80, sering transparan  -> PNG palet, lebar <=400
     foto   — kartu layanan/galeri                  -> WebP q80, lebar <=1200
     hero   — LCP, full-bleed                       -> WebP q82, lebar <=1920

   PNG bertahan sebagai PNG (transparansi + nama berkas tidak berubah).
   Foto PNG/JPG PINDAH ke .webp; skrip mencetak peta rename supaya path
   di `src/content/*.ts` bisa disesuaikan. Berkas asli TIDAK dihapus dari
   riwayat git — `git show <commit>:<path>` selalu bisa mengembalikannya.

   Jalankan: node scripts/optimize-images.mjs [--tulis]
   Tanpa --tulis = dry run (hanya laporan, nol berkas disentuh).
   ============================================================= */
import { readFileSync, writeFileSync, statSync, existsSync, unlinkSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join, basename, relative, sep } from 'node:path';
import sharp from 'sharp';

const TULIS = process.argv.includes('--tulis');
const ROOT = process.cwd();
const PUBLIC = join(ROOT, 'public');

/* --- 1. Kumpulkan SEMUA berkas gambar di public/images ---
   Dulu skrip ini hanya membaca literal string '/images/...' di
   src/content/*.ts. Itu MELEWATKAN foto OUR SERVICE — path-nya dirakit
   dari template literal (`${CA}/MEN/Thumbnail.png`), justru berkas
   TERBERAT (1–2,4 MB per foto). Sekarang seluruh pohon disapu. */
const IMG_EXT = /\.(png|jpe?g|webp)$/i;

const sapu = (dir) => {
  const keluar = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) keluar.push(...sapu(p));
    else if (IMG_EXT.test(e.name)) keluar.push(p);
  }
  return keluar;
};

/* Hanya direktori yang benar-benar dirender build. `public/images/GALLERY`
   (54 MB sumber mentah), `HERO SECTION`, `klien/`, `services/` adalah
   duplikat/sumber yang TIDAK pernah dirujuk HTML — dilewati supaya skrip
   tidak menghabiskan waktu (dan tidak ikut membengkakkan dist). */
const DIR_DIPAKAI = ['GALLERY-OPT', 'OUR CLIENT', 'OUR SERVICE', 'hero', 'logo'];

const sapuSrc = (dir) => {
  const keluar = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) keluar.push(...sapuSrc(p));
    else if (/\.(ts|astro)$/.test(e.name)) keluar.push(p);
  }
  return keluar;
};

const dirujuk = new Set(
  DIR_DIPAKAI.flatMap((d) =>
    sapu(join(PUBLIC, 'images', d)).map((p) => '/' + relative(PUBLIC, p).split(sep).join('/'))
  )
);

/* --- 2. Klasifikasi --- */
const jenis = (rel) => {
  const p = rel.toUpperCase();
  if (p.includes('/HERO')) return 'hero';
  if (p.includes('CLIENT LOGO') || p.includes('/KLIEN/') || p.includes('/LOGO/')) return 'logo';
  return 'foto';
};

const ATURAN = {
  logo: { lebar: 400, format: 'png' },
  foto: { lebar: 1200, format: 'webp', q: 80 },
  hero: { lebar: 1920, format: 'webp', q: 82 },
};

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const rename = [];
let sebelumTotal = 0;
let sesudahTotal = 0;
const baris = [];

for (const rel of [...dirujuk].sort()) {
  const src = join(PUBLIC, rel);
  if (!existsSync(src)) {
    baris.push(['?', rel, 'TIDAK ADA', '']);
    continue;
  }
  const sebelum = statSync(src).size;
  const j = jenis(rel);
  const aturan = ATURAN[j];

  // Baca ke Buffer dulu, JANGAN sharp(path): di Windows handle berkas
  // sumber masih dipegang saat kita menulis ke path yang sama ->
  // "UNKNOWN: unknown error, open ...". Dari Buffer, handle sudah lepas.
  let pipa = sharp(readFileSync(src)).rotate();
  const meta = await pipa.metadata();
  if (meta.width > aturan.lebar)
    pipa = pipa.resize({ width: aturan.lebar, withoutEnlargement: true });

  let buf;
  let relBaru = rel;
  // Logo dikompres TANPA ganti nama berkas, jadi format keluarnya HARUS
  // mengikuti ekstensi sumber. Kalau tidak, aturan `logo -> png` menulis
  // byte PNG ke dalam berkas bernama .jpg/.webp: browser umumnya masih
  // merender (content sniffing), tapi Content-Type yang dikirim Vercel
  // jadi salah. Ditemukan lewat audit magic-byte, bukan lewat mata.
  const extSumber = rel.toLowerCase().match(/\.(png|jpe?g|webp)$/)[1];
  const formatKeluar =
    aturan.format === 'png'
      ? extSumber === 'png'
        ? 'png'
        : extSumber === 'webp'
          ? 'webp'
          : 'jpeg'
      : aturan.format;

  if (formatKeluar === 'png') {
    buf = await pipa
      .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
      .toBuffer();
  } else if (formatKeluar === 'jpeg') {
    buf = await pipa.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  } else {
    buf = await pipa.webp({ quality: aturan.q ?? 85, effort: 6 }).toBuffer();
    relBaru = rel.replace(/\.(png|jpe?g|webp)$/i, '.webp');
  }

  // Jangan tulis kalau justru membengkak (mis. berkas sudah dioptimasi).
  if (buf.length >= sebelum && relBaru === rel) {
    baris.push([j, rel, kb(sebelum), 'dilewati (sudah kecil)']);
    sebelumTotal += sebelum;
    sesudahTotal += sebelum;
    continue;
  }

  sebelumTotal += sebelum;
  sesudahTotal += buf.length;
  baris.push([
    j,
    rel,
    `${kb(sebelum)} -> ${kb(buf.length)}`,
    relBaru !== rel ? `rename -> ${basename(relBaru)}` : '',
  ]);
  if (relBaru !== rel) rename.push([rel, relBaru]);

  if (TULIS) {
    writeFileSync(join(PUBLIC, relBaru), buf);
    if (relBaru !== rel) unlinkSync(src);
  }
}

/* --- 3. Laporan --- */
console.log(`\n${TULIS ? 'MENULIS' : 'DRY RUN (tambahkan --tulis untuk menerapkan)'}\n`);
for (const [j, rel, ukuran, catatan] of baris) {
  console.log(`  [${j.padEnd(5)}] ${ukuran.padEnd(22)} ${rel}${catatan ? `  (${catatan})` : ''}`);
}
console.log(
  `\n  TOTAL ${kb(sebelumTotal)} -> ${kb(sesudahTotal)}  ` +
    `(hemat ${(100 - (sesudahTotal / sebelumTotal) * 100).toFixed(1)}%)\n`
);

/* --- 4. Perbarui path di src/ untuk berkas yang ganti ekstensi ---
   Path gambar TIDAK selalu berupa literal utuh: `layanan.ts` merakitnya
   dari template literal (`${CA}/MEN/Thumbnail.png`), jadi mencari string
   '/images/...' penuh akan meleset. Karena itu penggantian dilakukan per
   NAMA BERKAS (mentah + ter-URL-encode), yang pasti muncul apa adanya di
   sumber mana pun. Aman selama tidak ada nama berkas yang dikonversi di
   satu folder tapi dipertahankan di folder lain — dicek di bawah, dan
   skrip berhenti kalau bentrok. */
if (rename.length) {
  const dikonversi = new Map(rename.map(([lama, baru]) => [basename(lama), basename(baru)]));
  const dipertahankan = new Set(
    [...dirujuk].filter((r) => !rename.some(([lama]) => lama === r)).map((r) => basename(r))
  );
  const bentrok = [...dikonversi.keys()].filter((n) => dipertahankan.has(n));
  if (bentrok.length) {
    console.error(`
  GAGAL: nama berkas bentrok (dikonversi & dipertahankan): ${bentrok.join(', ')}`);
    process.exit(1);
  }

  console.log(`  ${rename.length} berkas ganti ekstensi -> memperbarui src/`);
  if (TULIS) {
    const berkasSrc = sapuSrc(join(ROOT, 'src'));
    for (const f of berkasSrc) {
      let isi = readFileSync(f, 'utf8');
      const asal = isi;
      for (const [lama, baru] of dikonversi) {
        isi = isi.split(lama).join(baru);
        isi = isi.split(encodeURIComponent(lama)).join(encodeURIComponent(baru));
      }
      if (isi !== asal) {
        writeFileSync(f, isi);
        console.log(`    diperbarui ${relative(ROOT, f)}`);
      }
    }
  }
}
