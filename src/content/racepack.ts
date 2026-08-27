import type { RacepackItem } from './types';

/* =============================================================
   racepack.ts — 4 item. Nama persis BLUEPRINT §1.2 [FAKTA-PDF]:
   "Jersey Dryfit · Medali Zinc Alloy · Bib Number Tyvek 125 gsm · Totebag/Stringbag"
   Semua moq/leadTime/hargaMulai = null (blocker B6). Tidak ada harga
   racepack terverifikasi di PDF.
   ============================================================= */

export const racepack: RacepackItem[] = [
  {
    slug: 'jersey-dryfit',
    nama: 'Jersey Dryfit',
    kategori: 'racepack',
    spesifikasi: null,
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: null,
  },
  {
    slug: 'medali-zinc-alloy',
    nama: 'Medali Zinc Alloy',
    kategori: 'racepack',
    spesifikasi: 'Zinc alloy',
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: null,
  },
  {
    slug: 'bib-number-tyvek',
    nama: 'Bib Number Tyvek 125 gsm',
    kategori: 'racepack',
    // Spesifikasi ini MEMANG tertulis di nama produk PDF.
    spesifikasi: 'Tyvek 125 gsm',
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: null,
  },
  {
    slug: 'totebag-stringbag',
    nama: 'Totebag/Stringbag',
    kategori: 'racepack',
    spesifikasi: null,
    foto: null,
    moq: null,
    leadTime: null,
    hargaMulai: null,
    catatanAnomali: null,
  },
];
