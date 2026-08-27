import type { Lokasi } from './types';

/* =============================================================
   lokasi.ts — 3 lokasi sebagai rantai produksi.
   Alamat disalin karakter-per-karakter dari "Compro CV HTB.pdf"
   hlm. 19 "Our Address" (diverifikasi terhadap render halaman).

   `mapsUrl` = tautan pencarian Google Maps yang dibangun DETERMINISTIK
   dari string alamat (bukan koordinat tebakan). `koordinat: null` sampai
   titik presisi diberikan → JSON-LD `geo` diomit (T03.2).
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
    koordinat: null,
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
    koordinat: null,
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
    koordinat: null,
    mapsUrl: mapsSearch(
      'Jl. Raya Mayor Oking Jaya Atmaja No.196, Cirimekar, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16917'
    ),
    deskripsiPeran: null,
    jamOperasional: null,
    telepon: null,
  },
];
