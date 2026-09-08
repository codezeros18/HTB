/* =============================================================
   galeri.ts — foto untuk Gallery bento.
   REDESIGN 2026-08-30 — 26 foto DOKUMENTASI NYATA dari klien
   (`public/images/GALLERY/`), menggantikan placeholder sebelumnya.

   Bento menampilkan 9 sel; seluruh 26 foto ikut dipakai lewat
   lightbox kolase (`src/scripts/gallery-lightbox.ts`),
   jadi tidak ada berkas yang menganggur.

   `alt` ditulis netral-deskriptif: menyebut JENIS pekerjaan yang
   terlihat, tanpa mengarang nama klien, jumlah, atau tanggal
   (guardrail 1).

   ⚠️ BERAT: sebagian berkas 3–5 MB (foto kamera mentah, hingga
   4064px). WAJIB diturunkan resolusinya + dikompres sebelum produksi.
   ============================================================= */

export interface GaleriFotoBento {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const G = '/images/GALLERY-OPT';

export const galeriFoto: GaleriFotoBento[] = [
  {
    src: `${G}/IMG-20260730-WA0031.webp`,
    alt: 'Hasil produksi apparel MOTIVE',
    width: 963,
    height: 1280,
  },
  {
    src: `${G}/IMG-20260805-WA0012.webp`,
    alt: 'Lanyard cetak penuh hasil produksi MOTIVE, siap dikemas',
    width: 1600,
    height: 900,
  },
  {
    src: `${G}/IMG-20260805-WA0013.webp`,
    alt: 'Perlengkapan acara hasil produksi MOTIVE',
    width: 960,
    height: 1280,
  },
  {
    src: `${G}/IMG-20260805-WA0043.webp`,
    alt: 'Detail hasil jahitan produk MOTIVE',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG-20260805-WA0088.webp`,
    alt: 'Produk apparel MOTIVE sebelum pengiriman',
    width: 899,
    height: 1599,
  },
  {
    src: `${G}/IMG-20260810-WA0047.webp`,
    alt: 'Pesanan apparel MOTIVE yang telah dikemas',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG-20260813-WA0016.webp`,
    alt: 'Hasil produksi apparel MOTIVE',
    width: 1244,
    height: 1600,
  },
  {
    src: `${G}/IMG-20260813-WA0019.webp`,
    alt: 'Hasil produksi apparel MOTIVE',
    width: 1244,
    height: 1600,
  },
  {
    src: `${G}/IMG-20260814-WA0003.webp`,
    alt: 'Detail produk apparel MOTIVE',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG-20260814-WA0021.webp`,
    alt: 'Hasil produksi MOTIVE siap serah terima',
    width: 720,
    height: 1280,
  },
  {
    src: `${G}/IMG-20260818-WA0000.webp`,
    alt: 'Produk pesanan MOTIVE',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG-20260818-WA0002.webp`,
    alt: 'Produk pesanan MOTIVE',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG-20260824-WA0015.webp`,
    alt: 'Tumbler cetak logo hasil produksi MOTIVE beserta kemasannya',
    width: 1204,
    height: 1600,
  },
  {
    src: `${G}/IMG-20260824-WA0016.webp`,
    alt: 'Merchandise tumbler hasil produksi MOTIVE',
    width: 1204,
    height: 1600,
  },
  {
    src: `${G}/IMG-20260824-WA0017.webp`,
    alt: 'Merchandise hasil produksi MOTIVE',
    width: 1204,
    height: 1600,
  },
  {
    src: `${G}/IMG_20260613_153741_580.webp`,
    alt: 'Suasana workshop MOTIVE dengan tumpukan bahan dan pesanan',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG_20260613_153753_457.webp`,
    alt: 'Bahan kain tersusun di workshop MOTIVE',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG_20260613_153759_308.webp`,
    alt: 'Proses penyortiran pesanan di workshop MOTIVE',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG_20260722_193455_257.webp`,
    alt: 'Kegiatan produksi di workshop MOTIVE',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG_20260804_213234_835.webp`,
    alt: 'Pesanan apparel MOTIVE dalam tahap penyelesaian',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG_20260804_214222_375.webp`,
    alt: 'Produk MOTIVE menjelang pengemasan',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG_20260804_214603_173.webp`,
    alt: 'Hasil produksi MOTIVE tertata sebelum dikirim',
    width: 1600,
    height: 1200,
  },
  {
    src: `${G}/IMG_20260814_100257_422.webp`,
    alt: 'Pesanan MOTIVE siap dikirim ke pelanggan',
    width: 1600,
    height: 1200,
  },
  {
    src: `${G}/IMG_20260818_144447_502.webp`,
    alt: 'Kegiatan produksi apparel di workshop MOTIVE',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG_20260818_144706_935.webp`,
    alt: 'Proses pengerjaan pesanan di workshop MOTIVE',
    width: 1200,
    height: 1600,
  },
  {
    src: `${G}/IMG_20260818_144732_927.webp`,
    alt: 'Detail pengerjaan produk di workshop MOTIVE',
    width: 1200,
    height: 1600,
  },
];
