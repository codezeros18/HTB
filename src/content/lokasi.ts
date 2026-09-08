import type { Lokasi } from './types';

/* =============================================================
   lokasi.ts — 3 lokasi sebagai rantai produksi.

   REVISI 2026-09-08 (permintaan klien): alamat Head Office & Workshop
   DIGANTI dengan alamat resmi terbaru yang dikirim klien (menggantikan
   salinan dari "Compro CV HTB.pdf" hlm. 19 yang sudah usang). Alamat
   Factory MASIH menunggu konfirmasi klien — lihat catatan di entrinya.

   `mapsUrl` = tautan PENCARIAN Google Maps deterministik dari string
   alamat — rute akurat selalu lewat sini, bukan lewat `koordinat`.

   `koordinat` = titik PERKIRAAN level jalan/kelurahan (Gading Serpong ·
   Tambora · Cirimekar-Cibinong) supaya peta Leaflet bisa menaruh pin.
   BUKAN titik gedung presisi — ganti dengan koordinat resmi dari klien
   saat tersedia. Popup peta + tautan "Rute di Google Maps" tetap memakai
   `alamat`/`mapsUrl` supaya rutenya benar.
   `deskripsiPeran` & `jamOperasional` = [GAP], menunggu klien.
   ============================================================= */

const mapsSearch = (alamat: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`;

/* Alamat ditulis SEKALI lalu dipakai ulang untuk `alamat` + `mapsUrl`,
   supaya keduanya mustahil berbeda saat alamat direvisi lagi. */
const ALAMAT_HEAD_OFFICE =
  'Jl. Mission Drive, Jl. Boulevard Raya Gading Serpong No. 3, Ruko Solvang Arcade, Klp. Dua, Kec. Kelapa Dua, Kab. Tangerang, Banten 15810';

const ALAMAT_WORKSHOP =
  'Jl. Tambora IV, Gg. Suteng, RT 2 / RW 7 No. 34A, Tambora, Kota Administrasi Jakarta Barat, DKI Jakarta';

const ALAMAT_FACTORY =
  'Jl. Raya Mayor Oking Jaya Atmaja No. 196, Cirimekar, Kec. Cibinong, Kab. Bogor, Jawa Barat 16917';

export const lokasi: Lokasi[] = [
  {
    slug: 'head-office',
    peran: 'Head Office',
    alamat: ALAMAT_HEAD_OFFICE,
    koordinat: { lat: -6.2436, lng: 106.627 }, // PERKIRAAN — Gading Serpong
    mapsUrl: mapsSearch(ALAMAT_HEAD_OFFICE),
    deskripsiPeran: null,
    jamOperasional: null,
    telepon: null,
  },
  {
    slug: 'workshop',
    peran: 'Workshop',
    alamat: ALAMAT_WORKSHOP,
    koordinat: { lat: -6.147, lng: 106.799 }, // PERKIRAAN — Tambora, Jakbar
    mapsUrl: mapsSearch(ALAMAT_WORKSHOP),
    deskripsiPeran: null,
    jamOperasional: null,
    telepon: null,
  },
  {
    // MENUNGGU KLIEN: revisi 2026-09-08 mengirim 3 alamat, tapi alamat
    // ke-3 IDENTIK dengan Head Office. Belum jelas apakah Factory pindah
    // ke Gading Serpong atau entri ini memang harus dihapus — alamat lama
    // (Cibinong) DIPERTAHANKAN dulu daripada menampilkan dua kartu peta
    // dengan alamat & pin yang persis sama. Tanyakan lalu perbaiki di sini.
    slug: 'factory',
    peran: 'Factory',
    alamat: ALAMAT_FACTORY,
    koordinat: { lat: -6.4805, lng: 106.8365 }, // PERKIRAAN — Cirimekar, Cibinong
    mapsUrl: mapsSearch(ALAMAT_FACTORY),
    deskripsiPeran: null,
    jamOperasional: null,
    telepon: null,
  },
];
