import type { TahapProses } from './types';

/* =============================================================
   proses.ts — 11 tahap. Urutan & nama persis BLUEPRINT §1.4
   [FAKTA-PDF]. Pembagian babak (dipakai di mobile, tidak mengubah
   urutan): I = 1–3, II = 4–5, III = 6–8, IV = 9–11.

   `deskripsi` = EDITORIAL: kalimat netral tanpa angka/klaim,
   diturunkan dari nama tahap standar konveksi. PDF tidak memuat
   deskripsi per tahap — minta klien review. `media: null` (blocker
   media; varian stepper tipografis akan dipakai di S06).
   ============================================================= */

export const proses: TahapProses[] = [
  {
    nomor: 1,
    nama: 'Kedatangan Bahan',
    deskripsi: 'Bahan baku yang datang diperiksa jenis dan jumlahnya sebelum masuk produksi.',
    babak: 'I',
    media: null,
  },
  {
    nomor: 2,
    nama: 'Pembuatan Pola Produksi',
    deskripsi: 'Pola potong disiapkan sesuai desain dan ukuran pesanan.',
    babak: 'I',
    media: null,
  },
  {
    nomor: 3,
    nama: 'Cutting Bahan',
    deskripsi: 'Lembar bahan dipotong mengikuti pola.',
    babak: 'I',
    media: null,
  },
  {
    nomor: 4,
    nama: 'Grouping Bahan per Size',
    deskripsi: 'Potongan dikelompokkan per ukuran agar tidak tertukar saat dijahit.',
    babak: 'II',
    media: null,
  },
  {
    nomor: 5,
    nama: 'Numbering',
    deskripsi: 'Tiap kelompok potongan diberi nomor untuk pelacakan selama produksi.',
    babak: 'II',
    media: null,
  },
  {
    nomor: 6,
    nama: 'Sewing',
    deskripsi: 'Potongan dijahit menjadi produk utuh.',
    babak: 'III',
    media: null,
  },
  {
    nomor: 7,
    nama: 'Buang Benang',
    deskripsi: 'Sisa benang jahitan dirapikan dan dibuang.',
    babak: 'III',
    media: null,
  },
  {
    nomor: 8,
    nama: 'Setrika Uap',
    deskripsi: 'Produk dirapikan dengan setrika uap.',
    babak: 'III',
    media: null,
  },
  {
    nomor: 9,
    nama: 'QC & Pemasangan Elemen',
    deskripsi: 'Produk diperiksa dan elemen tambahan seperti label atau aksesori dipasang.',
    babak: 'IV',
    media: null,
  },
  {
    nomor: 10,
    nama: 'QC Akhir',
    deskripsi: 'Pemeriksaan kualitas akhir sebelum produk dikemas.',
    babak: 'IV',
    media: null,
  },
  {
    nomor: 11,
    nama: 'Packing',
    deskripsi: 'Produk dikemas dan disiapkan untuk pengiriman.',
    babak: 'IV',
    media: null,
  },
];

/** Judul 4 babak — BLUEPRINT §1.4 [FAKTA-PDF]. */
export const babakProses = [
  { babak: 'I', judul: 'Persiapan Bahan', tahap: [1, 2, 3] },
  { babak: 'II', judul: 'Penyiapan per Ukuran', tahap: [4, 5] },
  { babak: 'III', judul: 'Penjahitan & Finishing', tahap: [6, 7, 8] },
  { babak: 'IV', judul: 'Kontrol Kualitas & Pengiriman', tahap: [9, 10, 11] },
] as const;
