import type { Bahan } from './types';

/* =============================================================
   bahan.ts — 5 kelompok / 15 varian. Disalin dari
   "Compro CV HTB.pdf" hlm. 8–12 (Bahan Kaos / Jersey /
   Kemeja & Vest / Jaket / Polo).

   Catatan: BLUEPRINT §7.2 memperkirakan "14 varian"; PDF sebenarnya
   memuat 15 (Bahan Kaos 3 + Jersey 4 + Kemeja & Vest 3 + Jaket 3 +
   Polo 2). Angka PDF yang dipakai.

   Aturan render (guardrail 3, blocker B4):
   `namaPasar` TIDAK PERNAH masuk output HTML — hanya `namaTampil`.
   Merek dagang di PDF: "Nike", "Billabong" (jersey, A14) ·
   "Lacoste CVC" (polo, A15). "Americal Drill" = typo PDF (A16).
   ============================================================= */

export const bahan: Bahan[] = [
  /* ---------- Bahan Kaos (PDF hlm. 8) ---------- */
  {
    id: 'cotton-combed',
    kelompok: 'Bahan Kaos',
    namaTampil: 'Cotton Combed',
    namaPasar: null,
    gsm: [330, 220, 190, 160],
    gramasi: '16s — 330 gsm · 20s — 220 gsm · 24s — 190 gsm · 30s — 160 gsm',
    deskripsi: null, // PDF hanya memberi daftar ketebalan, tanpa deskripsi.
    swatch: null,
    catatanAnomali: 'A12, A13', // 16s=330 gsm (A12); nilai 220/190/160 identik dengan "Cotton" (A13)
  },
  {
    id: 'cotton',
    kelompok: 'Bahan Kaos',
    namaTampil: 'Cotton',
    namaPasar: null,
    gsm: [220, 190, 160],
    gramasi: '20s — ±220 gsm · 24s — ±190 gsm · 30s — ±160 gsm',
    deskripsi: null,
    swatch: null,
    catatanAnomali: 'A13', // nilai identik dengan tabel Cotton Combed
  },
  {
    id: 'pe-soft',
    kelompok: 'Bahan Kaos',
    namaTampil: 'PE Soft',
    namaPasar: null,
    gsm: [], // PDF hanya memberi rentang, tidak ada nilai diskret.
    gramasi: '±140–160 gsm · ±160–180 gsm · ±180–200 gsm',
    deskripsi: null,
    swatch: null,
    catatanAnomali: 'A18', // anchor menyebut "PE Soft 20s" padahal tabel ini memakai gsm
  },

  /* ---------- Bahan Jersey (PDF hlm. 9) ---------- */
  {
    id: 'jersey-milano',
    kelompok: 'Bahan Jersey',
    namaTampil: 'Milano',
    namaPasar: null,
    gsm: [140, 150, 160],
    gramasi: '140, 150, 160 gsm',
    deskripsi:
      'Bahan jersey dengan tekstur halus dan tampilan lebih premium, nyaman dipakai untuk kebutuhan yang mengutamakan kualitas.',
    swatch: null,
    catatanAnomali: null,
  },
  {
    id: 'jersey-padat',
    kelompok: 'Bahan Jersey',
    namaTampil: 'Jersey Padat',
    namaPasar: 'Nike', // INTERNAL — A14. Merek dagang; dilarang dirender.
    gsm: [140, 150, 160],
    gramasi: '140, 150, 160 gsm',
    deskripsi:
      'Bahan jersey dengan struktur lebih padat namun tetap breathable, memberikan kesan sporty dan performa yang lebih maksimal.',
    swatch: null,
    catatanAnomali: 'A14',
  },
  {
    id: 'jersey-ringan',
    kelompok: 'Bahan Jersey',
    namaTampil: 'Jersey Ringan',
    namaPasar: 'Billabong', // INTERNAL — A14. Merek dagang; dilarang dirender.
    gsm: [140, 150, 160],
    gramasi: '140, 150, 160 gsm',
    deskripsi:
      'Bahan jersey dengan karakter lembut dan ringan, memberikan kenyamanan untuk penggunaan sehari-hari maupun olahraga.',
    swatch: null,
    catatanAnomali: 'A14',
  },
  {
    id: 'jersey-emboss',
    kelompok: 'Bahan Jersey',
    namaTampil: 'Emboss',
    namaPasar: null,
    gsm: [140, 150, 160],
    gramasi: '140, 150, 160 gsm',
    deskripsi:
      'Bahan jersey yang ringan dan lentur dengan sirkulasi udara baik, cocok untuk aktivitas tinggi dan tetap terasa adem.',
    swatch: null,
    catatanAnomali: null,
  },

  /* ---------- Bahan Kemeja & Vest (PDF hlm. 10) ---------- */
  {
    id: 'drill-american',
    kelompok: 'Bahan Kemeja & Vest',
    namaTampil: 'American Drill',
    namaPasar: 'Americal Drill', // INTERNAL — A16, typo PDF. namaTampil pakai ejaan yang benar.
    gsm: [],
    gramasi: null, // PDF tidak memberi gramatur untuk bahan kemeja.
    deskripsi:
      'Perpaduan serat katun dan polyester yang seimbang. Memberikan struktur kemeja yang tetap tegak (firm) namun tetap terasa lembut di kulit. Pilihan paling populer untuk seragam harian. Fitur utama: Tekstur halus, tidak mudah kusut, dan awet.',
    swatch: null,
    catatanAnomali: 'A16',
  },
  {
    id: 'drill-japan',
    kelompok: 'Bahan Kemeja & Vest',
    namaTampil: 'Japan Drill',
    namaPasar: null,
    gsm: [],
    gramasi: null,
    deskripsi:
      'Memiliki konsentrasi serat katun yang lebih tinggi dibanding American Drill. Karakter kainnya lebih tebal dan kuat, namun tetap adem saat digunakan untuk aktivitas outdoor maupun indoor. Fitur Utama: Serat lebih tebal, warna tahan lama, dan daya serap keringat baik.',
    swatch: null,
    catatanAnomali: null,
  },
  {
    id: 'verlando',
    kelompok: 'Bahan Kemeja & Vest',
    namaTampil: 'Verlando',
    namaPasar: null,
    gsm: [],
    gramasi: null,
    deskripsi:
      'Bahan premium dengan teknologi mercerized & sanforized. Serat kainnya sangat rapat dan rapi, memberikan kesan eksklusif dan sangat nyaman dipakai seharian tanpa rasa gerah. Fitur Utama: Tekstur premium, sangat kuat, dan tidak menyusut.',
    swatch: null,
    catatanAnomali: null,
  },

  /* ---------- Bahan Jaket (PDF hlm. 11) ---------- */
  {
    id: 'jaket-fleece',
    kelompok: 'Bahan Jaket',
    namaTampil: 'Fleece',
    namaPasar: null,
    gsm: [],
    gramasi: null,
    deskripsi:
      'Kain yang memiliki lapisan serat seperti kapas di bagian dalam. Teksturnya sangat lembut, mampu menahan panas tubuh dengan baik, dan memberikan kenyamanan ekstra untuk cuaca dingin atau penggunaan harian. Sangat cocok untuk pembuatan Jaket varsity dan Hoodie.',
    swatch: null,
    catatanAnomali: null,
  },
  {
    id: 'jaket-parasut',
    kelompok: 'Bahan Jaket',
    namaTampil: 'Parasut',
    namaPasar: null,
    gsm: [],
    gramasi: null,
    deskripsi:
      'Material ringan yang dirancang khusus untuk perlindungan dari angin (windbreaker) dan percikan air ringan. Sangat praktis, mudah kering, dan cocok untuk aktivitas aktif maupun berkendara. Fitur Utama: Ringan, tahan angin, dan mudah dibersihkan.',
    swatch: null,
    catatanAnomali: null,
  },
  {
    id: 'jaket-milky-taslan',
    kelompok: 'Bahan Jaket',
    namaTampil: 'Milky Taslan',
    namaPasar: null,
    gsm: [],
    gramasi: null,
    deskripsi:
      'Bahan premium dengan lapisan coating milky (berwarna putih) di bagian dalam untuk ketahanan air yang lebih baik. Teksturnya lebih berkelas, kuat, dan memberikan proteksi maksimal namun tetap terlihat elegan. Sangat cocok untuk pembuatan Jaket seperti Jaket parka anti air.',
    swatch: null,
    catatanAnomali: null,
  },

  /* ---------- Bahan Polo (PDF hlm. 12) ---------- */
  {
    id: 'polo-lacoste-cvc',
    kelompok: 'Bahan Polo',
    namaTampil: 'Piké CVC',
    namaPasar: 'Lacoste CVC', // INTERNAL — A15. Merek dagang; dilarang dirender.
    gsm: [],
    gramasi: '200–230 gsm',
    deskripsi:
      'Perpaduan sempurna antara serat katun dan polyester. Memiliki pori-pori khas polo yang rapi dengan daya serap keringat yang baik. Tetap adem dan nyaman dipakai seharian tanpa khawatir baju cepat melar. Fitur Utama: Lembut, warna tahan lama, dan minim penyusutan.',
    swatch: null,
    catatanAnomali: 'A15',
  },
  {
    id: 'polo-pe-pique',
    kelompok: 'Bahan Polo',
    namaTampil: 'PE Pique',
    namaPasar: null,
    gsm: [],
    gramasi: '180–210 gsm',
    deskripsi:
      'Terbuat dari 100% serat polyester dengan tekstur pique. Solusi terbaik untuk seragam event atau promosi dengan budget terjangkau namun tetap memberikan kesan formal dan rapi. Fitur Utama: Sangat awet, cepat kering, dan tidak mudah kusut.',
    swatch: null,
    catatanAnomali: null,
  },
];
