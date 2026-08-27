import type { SizeChart } from './types';

/* =============================================================
   size-charts.ts — 8 tabel. Angka disalin PERSIS dari
   "Compro CV HTB.pdf" hlm. 13–14 (diverifikasi terhadap render
   halaman, bukan hanya ekstraksi teks). TIDAK ADA angka yang
   dikoreksi (guardrail 2).

   KEDELAPAN tabel tetap berstatus belum-diverifikasi
   → komponen S05 tidak merender tabel, hanya kalimat jujur + CTA
   WA. Transkripsi selesai; VERIFIKASI angka anomali A1–A8 adalah
   aksi terpisah dari klien/bagian produksi (blocker B3). Saat satu
   tabel dikonfirmasi, ubah status-nya ke terverifikasi.

   Unit: PDF tidak mencantumkan satuan; nilai badan 20–112 hanya
   masuk akal sebagai sentimeter.
   ============================================================= */

export const sizeCharts: SizeChart[] = [
  {
    id: 'regular',
    nama: 'Regular',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    unit: 'cm',
    baris: [
      { label: 'Panjang', nilai: [65, 68, 70, 72, 75, 77, 80], catatanAnomali: null },
      {
        label: 'Lebar',
        // A2 — kenaikan 3,2,2,5,4,5; ada angka salah antara XL–2XL. Disalin apa adanya.
        nilai: [46, 49, 51, 53, 58, 62, 67],
        catatanAnomali: 'A2',
      },
      { label: 'Lengan', nilai: [21, 22, 23, 24, 25, 26, 28], catatanAnomali: null },
    ],
    toleransi: null,
    statusVerifikasi: 'belum_diverifikasi',
    catatanAnomali: ['A2'],
  },
  {
    id: 'long-sleeved',
    nama: 'Long-Sleeved',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    unit: 'cm',
    baris: [
      { label: 'Panjang', nilai: [65, 68, 70, 72, 75, 77], catatanAnomali: null },
      { label: 'Lebar', nilai: [46, 49, 51, 53, 58, 62], catatanAnomali: null },
      { label: 'Lengan', nilai: [54, 55, 56, 57, 58, 59], catatanAnomali: null },
    ],
    toleransi: null,
    statusVerifikasi: 'belum_diverifikasi',
    catatanAnomali: [],
  },
  {
    id: 'oversized',
    nama: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    unit: 'cm',
    baris: [
      {
        label: 'Panjang',
        // A3 — lompatan M→L = 5 cm (71→76), sisanya 2 cm. Disalin apa adanya.
        nilai: [69, 71, 76, 78, 80],
        catatanAnomali: 'A3',
      },
      {
        label: 'Lebar',
        // A5 — identik persis dengan Boxy.
        nilai: [52, 54, 57, 60, 63],
        catatanAnomali: 'A5',
      },
      {
        label: 'Lengan',
        // A5 — identik persis dengan Boxy.
        nilai: [26, 27, 29, 31, 33],
        catatanAnomali: 'A5',
      },
    ],
    toleransi: null,
    statusVerifikasi: 'belum_diverifikasi',
    catatanAnomali: ['A3', 'A5'],
  },
  {
    id: 'boxy',
    nama: 'Boxy',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    unit: 'cm',
    baris: [
      {
        label: 'Panjang',
        // A4 — lompatan 5 (68→73) lalu naik hanya 1 di 2XL. Disalin apa adanya.
        nilai: [66, 68, 73, 75, 76],
        catatanAnomali: 'A4',
      },
      {
        label: 'Lebar',
        // A5 — identik persis dengan Oversized.
        nilai: [52, 54, 57, 60, 63],
        catatanAnomali: 'A5',
      },
      {
        label: 'Lengan',
        // A5 — identik persis dengan Oversized.
        nilai: [26, 27, 29, 31, 33],
        catatanAnomali: 'A5',
      },
    ],
    toleransi: null,
    statusVerifikasi: 'belum_diverifikasi',
    catatanAnomali: ['A4', 'A5'],
  },
  {
    id: 'vest',
    nama: 'Vest',
    sizes: ['M', 'L', 'XL', '2XL'],
    unit: 'cm',
    baris: [
      { label: 'Panjang Badan', nilai: [65, 67, 69, 71], catatanAnomali: null },
      {
        // A6 — PDF memakai "Ling. Dada" (lingkar), bukan "Lebar Dada". Label disalin apa adanya.
        label: 'Ling. Dada',
        nilai: [100, 104, 108, 112],
        catatanAnomali: 'A6',
      },
      { label: 'Lebar Bahu', nilai: [42, 44, 46, 48], catatanAnomali: null },
    ],
    toleransi: null,
    statusVerifikasi: 'belum_diverifikasi',
    // A25 — Vest ada di katalog DAN punya tabel sendiri.
    catatanAnomali: ['A6', 'A25'],
  },
  {
    id: 'jaket',
    nama: 'Jaket',
    sizes: ['M', 'L', 'XL', '2XL'],
    unit: 'cm',
    baris: [
      {
        label: 'Panjang Badan',
        // A8 — Jaket M = 60 cm, 8 cm lebih pendek dari kaos Regular M (68). Disalin apa adanya.
        nilai: [60, 62, 64, 66],
        catatanAnomali: 'A8',
      },
      { label: 'Lebar Dada', nilai: [55, 58, 61, 64], catatanAnomali: null },
      { label: 'Panjang Lengan', nilai: [42, 44, 46, 48], catatanAnomali: null },
    ],
    toleransi: null,
    statusVerifikasi: 'belum_diverifikasi',
    // A25 — tabel ini dipakai bersama Varsity Jacket & Parachute Jacket.
    catatanAnomali: ['A8', 'A25'],
  },
  {
    id: 'kemeja',
    nama: 'Kemeja',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    unit: 'cm',
    baris: [
      { label: 'Panjang Badan', nilai: [68, 71, 74, 77, 80], catatanAnomali: null },
      { label: 'Lebar Dada', nilai: [50, 53, 56, 59, 62], catatanAnomali: null },
      {
        label: 'Panjang Lengan',
        // A7 — 20–25 cm = lengan PENDEK, padahal katalog menyebut "Work Shirt".
        nilai: [20, 22, 23, 24, 25],
        catatanAnomali: 'A7',
      },
    ],
    toleransi: null,
    statusVerifikasi: 'belum_diverifikasi',
    catatanAnomali: ['A7'],
  },
  {
    id: 'hoodie',
    nama: 'Hoodie',
    sizes: ['M', 'L', 'XL', '2XL'],
    unit: 'cm',
    baris: [
      { label: 'Panjang Badan', nilai: [71, 73, 75, 77], catatanAnomali: null },
      { label: 'Lebar Dada', nilai: [56, 59, 62, 65], catatanAnomali: null },
      {
        label: 'Panjang Lengan',
        // A1 — "63 / 63 / 64 / 48". Angka 48 hampir pasti typo; M & L sama-sama 63 juga janggal. DISALIN APA ADANYA.
        nilai: [63, 63, 64, 48],
        catatanAnomali: 'A1',
      },
    ],
    toleransi: null,
    statusVerifikasi: 'belum_diverifikasi',
    // A9 — Hoodie punya tabel ini tapi TIDAK ada di 12 katalog.
    catatanAnomali: ['A1', 'A9'],
  },
];
