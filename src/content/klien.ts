import type { Klien } from './types';

/* =============================================================
   klien.ts — 26 organisasi teridentifikasi. Nama & kategori
   persis BLUEPRINT §5.2.

   Aturan sprint S01 (blocker B5 / §5.3):
   - Entri TANPA `logo` tetap dirender sebagai NAMA TEKS.
   - Tepat 5 entri tampil di hero: Kementerian ESDM, PKN STAN,
     Universitas Katolik Indonesia Atma Jaya, PPI Curug, IPEKA RUN.

   REDESIGN (2026-08-30) — SELURUH 18 berkas di
   `public/images/OUR CLIENT/CLIENT LOGO/` dipasang atas instruksi
   eksplisit pemilik proyek; `izinTayang: true` untuk entri yang punya
   berkas, menimpa peringatan blocker B5 (izin tertulis belum turun).

   Enam berkas yang dulu "belum terpetakan" sudah DIIDENTIFIKASI dari
   isi gambarnya dan menutup sebagian anomali A20/A21:
     • logo_universitas.png              → Pradita University
     • Logo-UMN-….webp                   → Universitas Multimedia Nusantara (entri BARU)
     • SMA ASSISI.jpg (hati-salib)       → SMA Assisi (entri BARU, menutup A20)
     • Ciputra Logo Warna.png            → Ciputra Group (entri BARU)
     • Logo Solvensea.png (bola karang)  → Solvensea (entri BARU, menutup A21)
     • logo kammatanha … .png (vihara)   → Kammatanha (entri BARU, menutup A21)

   Perlu konfirmasi klien: ejaan "Kammatanha", dan apakah berkas
   "IPEKA GRAND WISATA.webp" memang untuk entri IPEKA RUN.

   ⚠️ Berkas logo masih mentah (STAN 1 MB, UAD 828 KB, Kammatanha 1,7 MB).
   `ClientLogo` sudah `object-fit: contain`, tapi berat unduh WAJIB
   dikompres sebelum produksi.

   A22 / blocker B8 — afiliasi ber-nama "Huimora" (sama dengan nama CV)
   SENGAJA TIDAK dimasukkan; kemungkinan afiliasi, bukan klien pihak
   ketiga. Tambahkan hanya setelah klien mengonfirmasi.

   A19/A20 — sisa logo portofolio yang MASIH belum teridentifikasi
   (tidak ada berkasnya, jadi tidak dijadikan entri):
     • lingkaran biru bersusun kotak putih (slide 1, A19)
     • logo biru-merah "PJI/PU" (slide 2, A20)
   ============================================================= */

export const klien: Klien[] = [
  /* ---------- 1. Instansi Pemerintah & Pendidikan Tinggi (render pertama) ---------- */
  {
    nama: 'Kementerian ESDM',
    kategori: 'instansi-pendidikan',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/kementrian%20esdm.jpg',
    izinTayang: true,
    tampilDiHero: true,
  },
  {
    nama: 'PKN STAN',
    kategori: 'instansi-pendidikan',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/STAN.png',
    izinTayang: true,
    tampilDiHero: true,
  },
  {
    nama: 'Politeknik Penerbangan Indonesia (PPI) Curug',
    kategori: 'instansi-pendidikan',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/PPI%20CURUG.jpg',
    izinTayang: true,
    tampilDiHero: true,
  },
  {
    nama: 'Universitas Katolik Indonesia Atma Jaya',
    kategori: 'instansi-pendidikan',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/ATMAJAYA.png',
    izinTayang: true,
    tampilDiHero: true,
  },
  {
    nama: 'Universitas Ahmad Dahlan',
    kategori: 'instansi-pendidikan',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/UNIVERSITAS%20AHMAD%20DAHLAN.png',
    izinTayang: true,
    tampilDiHero: false,
  },
  {
    // Tebakan: file "USB.png" = Universitas Sunan Bonang (Tuban). Konfirmasi.
    nama: 'Sunan Bonang Tuban',
    kategori: 'instansi-pendidikan',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/USB.png',
    izinTayang: true,
    tampilDiHero: false,
  },
  {
    // Berkas "logo_universitas.png" TERBACA "PRADITA University" — cocok entri ini.
    nama: 'Pradita University',
    kategori: 'instansi-pendidikan',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/logo_universitas.png',
    izinTayang: true,
    tampilDiHero: false,
  },
  {
    // Entri BARU dari berkas logo klien (sebelumnya tidak ada di §5.2).
    nama: 'Universitas Multimedia Nusantara',
    kategori: 'instansi-pendidikan',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/Logo-UMN-Universitas-Multimedia-Nusantara-Original-png.png.webp',
    izinTayang: true,
    tampilDiHero: false,
  },
  {
    // Entri BARU. Berkas "SMA ASSISI.jpg" = lambang hati-salib — menutup
    // anomali A20 ("logo hati-salib merah/kuning" yang dulu tak teridentifikasi).
    nama: 'SMA Assisi',
    kategori: 'instansi-pendidikan',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/SMA%20ASSISI.jpg',
    izinTayang: true,
    tampilDiHero: false,
  },

  /* ---------- 2. Korporat & Properti ---------- */
  {
    nama: 'CitraLand Megah Batam',
    kategori: 'korporat-properti',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/CITRALAND%20BATAM.png',
    izinTayang: true,
    tampilDiHero: false,
  },
  {
    nama: 'Paramount Petals',
    kategori: 'korporat-properti',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/PARAMOUNT%20PETALS.png',
    izinTayang: true,
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
    // Entri BARU dari berkas "Ciputra Logo Warna.png" (grup induk CitraLand).
    nama: 'Ciputra Group',
    kategori: 'korporat-properti',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/Ciputra%20Logo%20Warna.png',
    izinTayang: true,
    tampilDiHero: false,
  },
  {
    // Entri BARU. Berkas "Logo Solvensea.png" = bola kaca berisi karang —
    // menutup anomali A21 ("logo bola kaca berisi karang").
    nama: 'Solvensea',
    kategori: 'korporat-properti',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/Logo%20Solvensea.png',
    izinTayang: true,
    tampilDiHero: false,
  },
  {
    nama: 'Bangor',
    kategori: 'korporat-properti',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/BURGER%20BANGOR.jpg',
    izinTayang: true,
    tampilDiHero: false,
  },

  /* ---------- 3. Event & Olahraga ---------- */
  {
    // Tebakan: file "IPEKA GRAND WISATA.webp" dipakai untuk entri IPEKA RUN. Konfirmasi.
    nama: 'IPEKA RUN (Run 2 Rise)',
    kategori: 'event-olahraga',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/IPEKA%20GRAND%20WISATA.webp',
    izinTayang: true,
    tampilDiHero: true,
  },
  {
    nama: 'ASO 2026',
    kategori: 'event-olahraga',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/Logo%20ASO%202026%20(1).png',
    izinTayang: true,
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
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/LOGO%20PHOENIX%20EO.png',
    izinTayang: true,
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
  {
    // Entri BARU. Berkas "logo kammatanha polos tanpa teks.png" = lambang
    // vihara bertulis "Sīla Samādhi Paññā" — menutup anomali A21 ("logo
    // candi/pagoda"). Nama perlu dikonfirmasi ejaannya ke klien.
    nama: 'Kammatanha',
    kategori: 'komunitas-organisasi',
    logo: '/images/OUR%20CLIENT/CLIENT%20LOGO/logo%20kammatanha%20polos%20tanpa%20teks.png',
    izinTayang: true,
    tampilDiHero: false,
  },
];
