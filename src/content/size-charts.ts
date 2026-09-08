import type { SizeChart } from './types';

/* =============================================================
   size-charts.ts — MASTER SIZE CHART resmi MOTIVE (SC-01 … SC-10).

   REVISI 2026-09-08 — SUMBER BARU: "COPYWRITING WEBSITE MOTIVE PROJECT"
   dari klien (`public/docs/`). Ini MENGGANTIKAN TOTAL 8 tabel lama yang
   disalin dari "Compro CV HTB.pdf" hlm. 13–14.

   Kenapa diganti, bukan ditambah: tabel lama berstatus
   `belum_diverifikasi` dengan 8 anomali angka (A1–A8) yang menahan
   render tabel (blocker B3). Dokumen ini adalah tabel RESMI klien
   lengkap dengan metode pengukuran yang dinyatakan — blocker B3
   SELESAI dan tabel kini boleh dirender.

   Seluruh angka bersatuan CENTIMETER dan merupakan UKURAN JADI PRODUK,
   bukan ukuran badan. Toleransi produksi ±1–2 cm dinyatakan klien dan
   disimpan di `toleransi` tiap tabel.
   ============================================================= */

/** Toleransi seragam untuk seluruh tabel — pernyataan klien. */
const TOLERANSI = '±1–2 cm';

/**
 * Disclaimer resmi "Motive Standard Size Chart". Dirender berdampingan
 * dengan tabel. Kalimatnya kutipan langsung dari dokumen klien —
 * JANGAN diparafrase (menyebut standar SNI ISO adalah klaim, bukan gaya
 * bahasa; mengubahnya = mengubah pernyataan klien).
 */
export const sizeChartDisclaimer = {
  judul: 'Motive Standard Size Chart',
  metode:
    'Metode pengukuran mengacu pada prinsip antropometri dan penentuan dimensi pakaian dalam SNI ISO 8559-1:2017 dan SNI ISO 8559-2:2017.',
  ukuranJadi:
    'Ukuran pada tabel merupakan ukuran jadi produk Motive. Toleransi produksi ±1–2 cm dapat terjadi karena karakteristik material dan proses produksi.',
  penyesuaian:
    'Ukuran, cutting, dan spesifikasi dapat disesuaikan kembali berdasarkan kebutuhan project atau tech pack yang telah disepakati.',
} as const;

/**
 * "STANDARD NOTE UNTUK SEMUA PRODUCT PAGE" — dokumen klien meminta teks
 * ini muncul tepat di bawah setiap size chart. Disalin apa adanya.
 */
export const sizeNote = {
  judul: 'Size Note',
  isi: 'Seluruh ukuran merupakan ukuran jadi produk dengan toleransi produksi ±1–2 cm. Ukuran dapat disesuaikan berdasarkan kebutuhan khusus atau tech pack yang telah disepakati sebelum produksi.',
  ajakan:
    'Untuk mendapatkan ukuran yang paling sesuai, konsultasikan kebutuhan Anda dengan tim Motive sebelum melakukan pemesanan.',
} as const;

const SIZE_6 = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SIZE_5 = ['S', 'M', 'L', 'XL', 'XXL'];

export const sizeCharts: SizeChart[] = [
  {
    id: 'sc-01',
    nama: 'SC-01 — Men / Unisex Regular Top',
    untuk: 'T-Shirt, Henley, Polo Shirt, Campus Shirt dan produk regular-fit sejenis.',
    sizes: SIZE_6,
    unit: 'cm',
    baris: [
      { label: 'Lebar Dada', nilai: [49, 51, 53, 55, 58, 61], catatanAnomali: null },
      { label: 'Panjang Badan', nilai: [68, 70, 72, 74, 76, 78], catatanAnomali: null },
      { label: 'Lebar Bahu', nilai: [42, 44, 46, 48, 50, 52], catatanAnomali: null },
      { label: 'Lengan Pendek', nilai: [21, 22, 23, 24, 25, 26], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'sc-02',
    nama: 'SC-02 — Men Woven Shirt',
    untuk: 'Shirt, Work Shirt, Security Uniform dan kemeja sejenis.',
    sizes: SIZE_6,
    unit: 'cm',
    baris: [
      { label: 'Lebar Dada', nilai: [50, 52, 54, 56, 59, 62], catatanAnomali: null },
      { label: 'Panjang Badan', nilai: [70, 72, 74, 76, 78, 80], catatanAnomali: null },
      { label: 'Lebar Bahu', nilai: [43, 45, 47, 49, 51, 53], catatanAnomali: null },
      { label: 'Lengan Pendek', nilai: [23, 24, 25, 26, 27, 28], catatanAnomali: null },
      { label: 'Lengan Panjang', nilai: [59, 60, 61, 62, 63, 64], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'sc-03',
    nama: 'SC-03 — Crewneck & Outerwear',
    untuk: 'Crewneck, Hoodie, Varsity, Bomber, Coach Jacket dan Jaket Parasut.',
    sizes: SIZE_6,
    unit: 'cm',
    baris: [
      { label: 'Lebar Dada', nilai: [52, 54, 56, 58, 61, 64], catatanAnomali: null },
      { label: 'Panjang Badan', nilai: [66, 68, 70, 72, 74, 76], catatanAnomali: null },
      { label: 'Lebar Bahu', nilai: [45, 47, 49, 51, 53, 55], catatanAnomali: null },
      { label: 'Panjang Lengan', nilai: [59, 60, 61, 62, 63, 64], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'sc-04',
    nama: 'SC-04 — Men Pants',
    untuk: null,
    sizes: SIZE_6,
    unit: 'cm',
    baris: [
      { label: 'Lingkar Pinggang', nilai: [76, 80, 84, 88, 94, 100], catatanAnomali: null },
      { label: 'Lingkar Pinggul', nilai: [96, 100, 104, 108, 114, 120], catatanAnomali: null },
      { label: 'Lingkar Paha', nilai: [58, 60, 62, 64, 67, 70], catatanAnomali: null },
      { label: 'Panjang Celana', nilai: [98, 99, 100, 101, 102, 103], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'sc-05',
    nama: 'SC-05 — Women Regular Top',
    untuk: 'Women’s Shirt, T-Shirt dan apparel wanita regular fit.',
    sizes: SIZE_5,
    unit: 'cm',
    baris: [
      { label: 'Lebar Dada', nilai: [44, 46, 48, 51, 54], catatanAnomali: null },
      { label: 'Panjang Badan', nilai: [60, 62, 64, 66, 68], catatanAnomali: null },
      { label: 'Lebar Bahu', nilai: [36, 38, 40, 42, 44], catatanAnomali: null },
      { label: 'Lengan Pendek', nilai: [18, 19, 20, 21, 22], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'sc-06',
    nama: 'SC-06 — Women Dress',
    untuk: null,
    sizes: SIZE_5,
    unit: 'cm',
    baris: [
      { label: 'Lingkar Dada', nilai: [88, 92, 96, 102, 108], catatanAnomali: null },
      { label: 'Lingkar Pinggang', nilai: [72, 76, 80, 86, 92], catatanAnomali: null },
      { label: 'Lingkar Pinggul', nilai: [94, 98, 102, 108, 114], catatanAnomali: null },
      { label: 'Panjang', nilai: [100, 102, 104, 106, 108], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'sc-07',
    nama: 'SC-07 — Women Pants',
    untuk: null,
    sizes: SIZE_5,
    unit: 'cm',
    baris: [
      { label: 'Lingkar Pinggang', nilai: [68, 72, 76, 82, 88], catatanAnomali: null },
      { label: 'Lingkar Pinggul', nilai: [92, 96, 100, 106, 112], catatanAnomali: null },
      { label: 'Lingkar Paha', nilai: [54, 56, 58, 61, 64], catatanAnomali: null },
      { label: 'Panjang Celana', nilai: [96, 97, 98, 99, 100], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'sc-08',
    nama: 'SC-08 — Sports Jersey',
    untuk: 'Running, Futsal, Padel, Golf dan jersey olahraga regular fit.',
    sizes: SIZE_6,
    unit: 'cm',
    baris: [
      { label: 'Lebar Dada', nilai: [48, 50, 52, 54, 57, 60], catatanAnomali: null },
      { label: 'Panjang Badan', nilai: [67, 69, 71, 73, 75, 77], catatanAnomali: null },
      { label: 'Lengan', nilai: [20, 21, 22, 23, 24, 25], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'sc-09',
    nama: 'SC-09 — Basketball / Sleeveless Jersey',
    untuk: null,
    sizes: SIZE_6,
    unit: 'cm',
    baris: [
      { label: 'Lebar Dada', nilai: [49, 51, 53, 55, 58, 61], catatanAnomali: null },
      { label: 'Panjang Badan', nilai: [69, 71, 73, 75, 77, 79], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'sc-10',
    nama: 'SC-10 — Vest / Rompi',
    untuk: null,
    sizes: SIZE_6,
    unit: 'cm',
    baris: [
      { label: 'Lebar Dada', nilai: [52, 54, 56, 58, 61, 64], catatanAnomali: null },
      { label: 'Panjang Badan', nilai: [64, 66, 68, 70, 72, 74], catatanAnomali: null },
    ],
    toleransi: TOLERANSI,
    statusVerifikasi: 'terverifikasi',
    catatanAnomali: [],
  },
];

/** Cari tabel per kode. `null` bila produk tidak memakai size chart baku. */
export const sizeChartById = (id: string | null): SizeChart | null =>
  id === null ? null : (sizeCharts.find((c) => c.id === id) ?? null);
