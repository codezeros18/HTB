import type { Klien } from './types';

/* =============================================================
   klien.ts — 26 organisasi teridentifikasi. Nama & kategori
   persis BLUEPRINT §5.2.

   Aturan sprint S01 (blocker B5 / §5.3):
   - Semua entri belum diizinkan tayang → dirender sebagai NAMA TEKS.
   - Logo kosong di semua entri sampai file logo + izin turun.
   - Tepat 5 entri tampil di hero: Kementerian ESDM, PKN STAN,
     Universitas Katolik Indonesia Atma Jaya, PPI Curug, IPEKA RUN.

   A22 / blocker B8 — afiliasi ber-nama "Huimora" (sama dengan nama CV)
   SENGAJA TIDAK dimasukkan; kemungkinan afiliasi, bukan klien pihak
   ketiga. Tambahkan hanya setelah klien mengonfirmasi.

   A19–A21 — ±5–6 logo portofolio BELUM teridentifikasi dan tidak
   dijadikan entri:
     • lingkaran biru bersusun kotak putih (slide 1, A19)
     • logo hati-salib merah/kuning (slide 2, A20)
     • logo biru-merah "PJI/PU" (slide 2, A20)
     • logo candi/pagoda (slide 3, A21)
     • logo bola kaca berisi karang (slide 3, A21)
   Hitungan slide = ±32 logo total (A21 catatan); 26 di bawah + ±6 ini.
   ============================================================= */

export const klien: Klien[] = [
  /* ---------- 1. Instansi Pemerintah & Pendidikan Tinggi (render pertama) ---------- */
  {
    nama: 'Kementerian ESDM',
    kategori: 'instansi-pendidikan',
    logo: null,
    izinTayang: false,
    tampilDiHero: true,
  },
  {
    nama: 'PKN STAN',
    kategori: 'instansi-pendidikan',
    logo: null,
    izinTayang: false,
    tampilDiHero: true,
  },
  {
    nama: 'Politeknik Penerbangan Indonesia (PPI) Curug',
    kategori: 'instansi-pendidikan',
    logo: null,
    izinTayang: false,
    tampilDiHero: true,
  },
  {
    nama: 'Universitas Katolik Indonesia Atma Jaya',
    kategori: 'instansi-pendidikan',
    logo: null,
    izinTayang: false,
    tampilDiHero: true,
  },
  {
    nama: 'Universitas Ahmad Dahlan',
    kategori: 'instansi-pendidikan',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Sunan Bonang Tuban',
    kategori: 'instansi-pendidikan',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Pradita University',
    kategori: 'instansi-pendidikan',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },

  /* ---------- 2. Korporat & Properti ---------- */
  {
    nama: 'CitraLand Megah Batam',
    kategori: 'korporat-properti',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Paramount Petals',
    kategori: 'korporat-properti',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'The Plaza Millennium',
    kategori: 'korporat-properti',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Indoclean',
    kategori: 'korporat-properti',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Koyasai',
    kategori: 'korporat-properti',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Hitsuji',
    kategori: 'korporat-properti',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Ruma & Co',
    kategori: 'korporat-properti',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'CV Sayur Mayur Nyayur',
    kategori: 'korporat-properti',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Bangor',
    kategori: 'korporat-properti',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },

  /* ---------- 3. Event & Olahraga ---------- */
  {
    nama: 'IPEKA RUN (Run 2 Rise)',
    kategori: 'event-olahraga',
    logo: null,
    izinTayang: false,
    tampilDiHero: true,
  },
  {
    nama: 'ASO 2026',
    kategori: 'event-olahraga',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Intelecta Cup',
    kategori: 'event-olahraga',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Phoenix Event',
    kategori: 'event-olahraga',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'HPKSI DPW Kalimantan Timur',
    kategori: 'event-olahraga',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },

  /* ---------- 4. Komunitas & Organisasi ---------- */
  {
    nama: 'GKLKI',
    kategori: 'komunitas-organisasi',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'KMK Keuskupan Larantuka',
    kategori: 'komunitas-organisasi',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'YCS Indonesia Atma Jaya',
    kategori: 'komunitas-organisasi',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'Naksatra Dharma',
    kategori: 'komunitas-organisasi',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
  {
    nama: 'KMB Viriya Dhamma',
    kategori: 'komunitas-organisasi',
    logo: null,
    izinTayang: false,
    tampilDiHero: false,
  },
];
