import type { Lokasi } from './types';

/* =============================================================
   lokasi.ts — 3 lokasi sebagai rantai produksi.
   Alamat disalin karakter-per-karakter dari "Compro CV HTB.pdf"
   hlm. 19 "Our Address" (diverifikasi terhadap render halaman).

   `mapsUrl` = tautan PENCARIAN Google Maps deterministik dari string
   alamat — rute akurat selalu lewat sini.

   `koordinat` = REDESIGN 2026-08-31: titik PERKIRAAN level jalan/kelurahan
   (Gading Serpong · Tambora/Duri · Cirimekar-Cibinong) supaya peta Leaflet
   bisa menaruh pin. BUKAN titik gedung presisi — ganti dengan koordinat
   resmi dari klien saat tersedia. Popup peta + tombol "Buka di Google Maps"
   tetap memakai `alamat`/`mapsUrl` untuk rute yang benar.
   `deskripsiPeran` & `jamOperasional` = [GAP], menunggu klien.
   ============================================================= */

const mapsSearch = (alamat: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamat)}`;

export const lokasi: Lokasi[] = [
  {
    slug: 'head-office',
    peran: 'Head Office',
    alamat:
      'Jln. Mission Drive, Ruko Solvang Arcade No. 3, Gading Serpong, Kab. Tangerang, Banten, 15180',
    koordinat: { lat: -6.2436, lng: 106.627 }, // PERKIRAAN — Gading Serpong
    mapsUrl: mapsSearch(
      'Jln. Mission Drive, Ruko Solvang Arcade No. 3, Gading Serpong, Kab. Tangerang, Banten, 15180'
    ),
    deskripsiPeran: null,
    jamOperasional: null,
    telepon: null,
  },
  {
    slug: 'workshop',
    peran: 'Workshop',
    alamat: 'Jln. Tambora II No. 38, Duri, Jakarta Barat, DKI Jakarta',
    koordinat: { lat: -6.147, lng: 106.799 }, // PERKIRAAN — Tambora / Duri
    mapsUrl: mapsSearch('Jln. Tambora II No. 38, Duri, Jakarta Barat, DKI Jakarta'),
    deskripsiPeran: null,
    jamOperasional: null,
    telepon: null,
  },
  {
    slug: 'factory',
    peran: 'Factory',
    alamat:
      'Jl. Raya Mayor Oking Jaya Atmaja No.196, Cirimekar, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16917',
    koordinat: { lat: -6.4805, lng: 106.8365 }, // PERKIRAAN — Cirimekar, Cibinong
    mapsUrl: mapsSearch(
      'Jl. Raya Mayor Oking Jaya Atmaja No.196, Cirimekar, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16917'
    ),
    deskripsiPeran: null,
    jamOperasional: null,
    telepon: null,
  },
];
