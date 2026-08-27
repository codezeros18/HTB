import type { Produk } from './types';

/* =============================================================
   katalog.ts — 12 produk apparel. Nama persis BLUEPRINT §1.2.

   Aturan sprint S01:
   - `moq`, `leadTime`, `hargaMulai` = `null` (blocker B6) KECUALI dua
     anchor harga terverifikasi (BLUEPRINT §1.2 [FAKTA-PDF]).
   - `hargaMulai` anchor: PDF menyebut "Kaos PE Soft 20s Rp 38.000" dan
     "Jersey fullprint Rp 40.000" tanpa memetakan ke siluet spesifik.
     Pemetaan ke `regular-t-shirt` (38k) & `o-neck-jersey` (40k) di bawah
     adalah INTERPRESTASI paling wajar — minta klien konfirmasi (A18/A25).
   - `sizeChartRef` mengikuti A9/A25: hanya produk dengan tabel yang jelas.
   - `bahanRef: []` di semua entri — peta produk↔bahan belum lengkap (A9).
   ============================================================= */

export const katalog: Produk[] = [
  {
    slug: 'regular-t-shirt',
    nama: 'Regular T-shirt',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: 'regular',
    foto: null,
    moq: null,
    leadTime: null,
    // BLUEPRINT §1.2 anchor "Kaos PE Soft 20s mulai Rp 38.000/pcs (+1 logo depan)".
    hargaMulai: 38000,
    catatanAnomali: 'A18',
  },
  {
    slug: 'oversized-t-shirt',
    nama: 'Oversized T-shirt',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: 'oversized',
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: 'A3',
  },
  {
    slug: 'boxy-t-shirt',
    nama: 'Boxy T-shirt',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: 'boxy',
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: 'A4, A5',
  },
  {
    slug: 'long-sleeved-t-shirt',
    nama: 'Long Sleeved T-shirt',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: 'long-sleeved',
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: null,
  },
  {
    slug: 'varsity-jacket',
    nama: 'Varsity Jacket',
    kategori: 'apparel',
    bahanRef: [],
    // A25 — Varsity Jacket & Parachute Jacket berbagi satu tabel "Jaket".
    sizeChartRef: 'jaket',
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: 'A8, A25',
  },
  {
    slug: 'work-shirt',
    nama: 'Work Shirt',
    kategori: 'apparel',
    bahanRef: [],
    // A7 — tabel "Kemeja" berisi panjang lengan 20–25 cm (lengan pendek),
    // padahal "Work Shirt" mengesankan lengan panjang.
    sizeChartRef: 'kemeja',
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: 'A7, A16',
  },
  {
    slug: 'polo-shirt',
    nama: 'Polo Shirt',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: null, // A9 — tidak ada tabel yang jelas
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: 'A9, A15',
  },
  {
    slug: 'v-neck-jersey',
    nama: 'V-neck Jersey',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: null, // A9
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: 'A9',
  },
  {
    slug: 'o-neck-jersey',
    nama: 'O-neck Jersey',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: null, // A9
    foto: null,
    moq: null,
    leadTime: null,
    // BLUEPRINT §1.2 anchor "Jersey fullprint mulai Rp 40.000/pcs" —
    // dipetakan ke O-neck Jersey (kerah paling generik). Minta konfirmasi klien.
    hargaMulai: 40000,
    catatanAnomali: 'A9',
  },
  {
    slug: 'polo-neck-jersey',
    nama: 'Polo-neck Jersey',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: null, // A9
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: 'A9',
  },
  {
    slug: 'vest',
    nama: 'Vest',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: 'vest',
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: 'A6, A25',
  },
  {
    slug: 'parachute-jacket',
    nama: 'Parachute Jacket',
    kategori: 'apparel',
    bahanRef: [],
    sizeChartRef: 'jaket', // A25 — berbagi tabel "Jaket"
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: 'A25',
  },
];
