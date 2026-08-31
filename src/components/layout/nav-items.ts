/* =============================================================
   nav-items.ts — kontrak navigasi & anchor, SATU sumber.

   Dipakai bersama oleh Navbar, MobileMenu, dan Footer supaya
   ketiganya tidak pernah berbeda isi.

   TEPAT 5 item — BLUEPRINT §8 Section 1. Alasannya sudah final:
   pada 1280px, 10 item + logo + CTA butuh ±1150px dan memaksa
   huruf 11px. Hero → klik logo · Gallery → sub-bagian Produk ·
   Contact → sudah jadi tombol CTA · Footer → tak pernah butuh nav.
   JANGAN menambah item ke-6.

   Catatan guardrail 5 (nol string konten di komponen): label di
   bawah adalah chrome navigasi, bukan data bisnis, dan terikat
   langsung ke anchor id yang dideklarasikan di `index.astro`.
   Ditaruh di satu modul, bukan disebar ke tiap komponen.
   `src/content/*` milik S01 dan tidak boleh disentuh di sprint ini.
   ============================================================= */

export interface NavItem {
  label: string;
  /**
   * Anchor href. ABSOLUT (`/#<sectionId>`), BUKAN relatif (`#<sectionId>`).
   * REDESIGN (2026-08-30) — bug ditemukan: sejak halaman `/layanan/**`
   * ditambahkan (S-SERVICES), href relatif membuat navbar diam-diam mati
   * di sana. Fragment tanpa `/` di depan di-resolve TERHADAP HALAMAN
   * SAAT INI — di homepage kebetulan cocok (section-nya memang di situ),
   * tapi di `/layanan/produk-x` browser mencari id itu di halaman yang
   * SAMA, tidak ketemu, dan diam-diam tidak melakukan apa pun (bukan
   * error, jadi terlihat seperti "navbar tidak bisa dipencet"). Dengan
   * `/#id`, browser SELALU menuju homepage lalu ke section-nya — dari
   * halaman mana pun.
   */
  href: string;
  /** id elemen section yang diamati IntersectionObserver navbar. */
  sectionId: string;
}

export const navItems: NavItem[] = [
  { label: 'Tentang', href: '/#tentang', sectionId: 'tentang' },
  { label: 'Produk', href: '/#produk', sectionId: 'produk' },
  { label: 'Proses', href: '/#proses', sectionId: 'proses' },
  { label: 'Klien', href: '/#klien', sectionId: 'klien' },
  { label: 'Lokasi', href: '/#lokasi', sectionId: 'lokasi' },
];

/**
 * Seluruh anchor id yang WAJIB dirender oleh section pemiliknya.
 * `galeri` dan `kontak` tidak ada di navbar (lihat alasan di atas)
 * tapi tetap jadi target anchor dari tempat lain.
 *
 * Pemilik: tentang→S04 · produk→S05 · proses→S06 · klien→S07 ·
 * galeri→S07 · lokasi→S08 · kontak→S08.
 */
export const SECTION_IDS = {
  tentang: 'tentang',
  produk: 'produk',
  proses: 'proses',
  klien: 'klien',
  galeri: 'galeri',
  lokasi: 'lokasi',
  kontak: 'kontak',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
