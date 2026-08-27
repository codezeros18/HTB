import type { Harga } from './types';

/* =============================================================
   harga.ts — hanya angka yang bisa ditunjuk di BLUEPRINT §1.2
   [FAKTA-PDF]. Tidak ada harga produk lain yang ditambahkan.
   ============================================================= */

export const harga: Harga = {
  anchorKaos: {
    nominal: 38000,
    label: 'Kaos PE Soft 20s',
    catatan:
      'Sudah termasuk 1 logo di bagian depan. A18 — "20s" tercampur satuan gsm di tabel PE Soft.',
  },
  anchorJersey: {
    nominal: 40000,
    label: 'Jersey fullprint',
    catatan: null,
  },
  sablonDTF: [
    { nama: 'Sablon DTF LOGO', nominal: 6000, catatanAnomali: null },
    // A10 — gambar add-on melabeli A5 sebagai "15 x 30 cm" (A5 sebenarnya ±15×21 cm).
    { nama: 'Sablon DTF A5', nominal: 8000, catatanAnomali: 'A10' },
    { nama: 'Sablon DTF A4', nominal: 12000, catatanAnomali: null },
    { nama: 'Sablon DTF A3', nominal: 17000, catatanAnomali: null },
  ],
  paketLanyard: {
    // PDF hlm. 15: Lanyard fullprint (TIssue Polyester) + ID card (PVC) + Card holder (Plastik),
    // Rp 14.000 di sel gabungan 3 baris.
    nama: 'Paket Lanyard + ID Card + Card Holder',
    nominal: 14000,
    catatan:
      'A11 — belum jelas paket atau per item; A17 — material di PDF tertulis "TIssue Polyester"',
  },
  // [GAP] — tidak ada tanggal konfirmasi di PDF. `null` → label "harga per bulan ini" disembunyikan.
  tanggalKonfirmasiTerakhir: null,
};
