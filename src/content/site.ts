import type { KonteksCTA, SiteConfig } from './types';
import { lokasi } from './lokasi';

/* =============================================================
   site.ts — identitas, kontak, meta, dan generator pesan WA.
   Semua nilai di bawah [FAKTA-PDF] BLUEPRINT §1.1 / §7.7.
   Slot yang belum dijawab klien = `null` (lihat §10).
   ============================================================= */

export const site: SiteConfig = {
  namaCV: 'CV. Huimora Talenta Berkarya',
  brand: 'MOTIVE',
  // BLUEPRINT §1.1 [FAKTA-PDF] — tagline company profile apa adanya.
  tagline: 'Custom Apparel Specialist | Racepack | Running | Uniform | T-Shirt | Etc.',
  pic: { nama: 'Simon Bramesto S. P', jabatan: 'Direktur Utama' },
  // Blocker B7. Nomor PDF "0821-6891-2769" dinormalkan ke format wa.me.
  whatsapp: '6282168912769',
  email: 'simonbramesto@gmail.com',
  meta: {
    // BLUEPRINT §7.7 — 63 karakter, jangan diubah tanpa menghitung ulang.
    title: 'MOTIVE — Konveksi Custom Apparel & Racepack | Tangerang, Jakarta, Bogor',
    // BLUEPRINT §7.7 — 158 karakter.
    description:
      'Vendor apparel custom: kaos, jersey, seragam, jaket, dan racepack lari. Produksi di workshop & pabrik sendiri dengan kontrol kualitas berlapis. Mulai Rp 38.000/pcs.',
  },
  // BLUEPRINT §1.1 [FAKTA-PDF] — empat janji nilai, apa adanya.
  nilai: [
    'Quality Control sebagai perhatian utama',
    'On-time delivery',
    'Garansi kualitas hasil produksi',
    'Material sesuai kesepakatan awal',
  ],
  nib: null, // [GAP] non-blocker — data legal
  tahunBerdiri: null, // [GAP] non-blocker
  sosmed: null, // [GAP] non-blocker — belum ada akun yang diberikan
  balasanBiasanya: null, // [GAP] non-blocker

  /* =============================================================
     hero — S04. Konten DRAFT, BUTUH APPROVAL klien (blocker B1/A24:
     penghapusan klaim "termurah"/"kualitas terbaik dengan harga
     termurah" dari materi asli — lihat BLUEPRINT §5.4). Draft ini
     dipakai supaya build tidak menunggu, ditandai `statusApproval`.
     ============================================================= */
  hero: {
    eyebrow: 'OFFICIAL BRAND BY CV. HUIMORA TALENTA BERKARYA',
    h1: 'KONVEKSI CUSTOM APPAREL & RACEPACK',
    sub: 'Kaos, jersey, seragam, jaket, dan racepack lari — dikerjakan di workshop dan pabrik kami sendiri, dengan kontrol kualitas berlapis.',
    ctaPrimer: 'Chat WhatsApp',
    ctaSekunder: 'Lihat Katalog',
    // BLUEPRINT §1.2/§8 [FAKTA-PDF] — anchor 38k, baris kecil, BUKAN headline.
    anchorHarga: 'Mulai Rp 38.000/pcs untuk kaos PE Soft 20s, sudah termasuk 1 logo depan.',
    stripJudul: 'Pernah dipercaya oleh',
    // REDESIGN (2026-08-30) — foto hero dari klien: lantai produksi nyata,
    // `public/images/HERO SECTION/Hero Section.png` (1536×1024).
    // ⚠️ Masih PNG ~3,0 MB belum dioptimasi. WAJIB dikompres (AVIF/WebP,
    // target ≤180 KB) + `srcset` sebelum produksi — kalau tidak LCP jebol.
    fotoTersedia: true,
    fotoSrc: '/images/HERO%20SECTION/Hero%20Section.png',
    fotoAlt: 'Lantai produksi MOTIVE — deretan penjahit mengerjakan pesanan apparel',
    statusApproval: 'draft',
  },

  /* =============================================================
     about — S04. 2 paragraf adaptasi PDF (hlm. 3, [FAKTA-PDF]),
     4 janji nilai dari §1.1, baris fakta dengan penyembunyian null.
     ============================================================= */
  about: {
    // BLUEPRINT §7.7 — H2 target section About.
    judul: 'Vendor Apparel dengan Produksi Sendiri',
    paragraf: [
      'Bergerak di industri apparel, kami memahami bahwa setiap event dan organisasi membutuhkan identitas visual yang berkualitas. Itulah mengapa kami hadir untuk memenuhi kebutuhan vendor pakaian Anda dengan standar profesionalisme tinggi.',
      'Kami berkomitmen memberikan solusi produksi yang efisien tanpa mengesampingkan detail. Dengan jaminan ketepatan waktu dan garansi kualitas hasil produksi, kami memastikan material yang Anda terima selalu sesuai dengan kesepakatan awal.',
    ],
    // Judul kartu dari BLUEPRINT §8 Section 3; deskripsi = frasa asli §1.1 apa adanya.
    janjiNilai: [
      { judul: 'Kontrol Kualitas Berlapis', deskripsi: 'Quality Control sebagai perhatian utama.' },
      { judul: 'Ketepatan Waktu', deskripsi: 'On-time delivery.' },
      { judul: 'Garansi Hasil Produksi', deskripsi: 'Garansi kualitas hasil produksi.' },
      { judul: 'Material Sesuai Kesepakatan', deskripsi: 'Material sesuai kesepakatan awal.' },
    ],
    // Setiap elemen null disembunyikan sendiri oleh komponen (T04.6).
    baris: [
      'CV. Huimora Talenta Berkarya',
      null, // NIB — [GAP] data legal belum diberikan
      null, // Berdiri sejak — [GAP] belum diberikan
      `${lokasi.length} lokasi operasional`,
    ],
  },

  /* =============================================================
     services — S05. Copy UI untuk section "Our Services" (3 tab +
     progressive disclosure, BLUEPRINT §8 Section 4). Nama produk,
     harga, dan deskripsi bahan TETAP di katalog.ts/racepack.ts/
     bahan.ts/harga.ts masing-masing — di sini hanya teks antarmuka
     (judul tab, label tombol, kalimat wajib) yang tidak satu pun
     bersumber dari PDF sebagai "fakta", jadi aman ditulis di sini
     tanpa menyentuh guardrail 1.
     ============================================================= */
  services: {
    // BLUEPRINT §7.7 — H2 target section Services.
    judul: 'Katalog Produk & Bahan',
    tabApparel: 'Apparel',
    tabRacepack: 'Racepack',
    tabBahan: 'Bahan & Ukuran',
    labelLihatLainnya: 'Lihat 4 produk lainnya',
    labelSembunyikanLainnya: 'Sembunyikan produk lainnya',
    // Merangkai 4 nama racepack.ts apa adanya — bukan klaim baru.
    racepackIntro:
      'Satu paket produksi untuk kebutuhan race day — jersey dryfit, medali zinc alloy, bib number Tyvek, dan totebag/stringbag, dikerjakan dalam satu alur produksi.',
    addOnJudul: 'Add-on & Sablon',
    panduanUkuranJudul: 'Panduan Ukuran',
    panduanUkuranPilihLabel: 'Pilih produk untuk melihat panduan ukuran',
    // AC T05.5 — kalimat WAJIB persis, dipakai selama statusVerifikasi
    // sebuah tabel masih 'belum_diverifikasi' (blocker B3).
    panduanUkuranBelumVerifikasi:
      'Panduan ukuran untuk produk ini sedang kami perbarui. Silakan tanya lewat WhatsApp.',
  },

  /* =============================================================
     klienUi — S07. Copy UI section "Our Clients" (BLUEPRINT §8
     Section 6 + §5.2/§5.3). Nama & kategori organisasi TETAP di
     klien.ts. `judul` WAJIB persis "PERNAH DIPERCAYA OLEH" (pernyataan
     riwayat transaksi, bukan klaim hubungan) — dan `disclaimer` WAJIB
     persis teks §5.3. Nol angka jumlah klien di mana pun (AC T07.4).
     ============================================================= */
  klienUi: {
    judul: 'PERNAH DIPERCAYA OLEH',
    // Sengaja null: BLUEPRINT menyebut "sub" tapi tidak menetapkan teksnya;
    // kalimat apa pun di sini jadi copy tak terverifikasi (guardrail 1).
    subjudul: null,
    disclaimer:
      'Logo ditampilkan sebagai referensi pekerjaan yang pernah kami kerjakan. Semua merek adalah milik pemiliknya masing-masing.',
    labelKategori: {
      'instansi-pendidikan': 'Instansi Pemerintah & Pendidikan Tinggi',
      'korporat-properti': 'Korporat & Properti',
      'event-olahraga': 'Event & Olahraga',
      'komunitas-organisasi': 'Komunitas & Organisasi',
    },
    ctaLabel: 'Chat WhatsApp',
  },

  /* =============================================================
     galeri — S07. `foto: [ { src: '/images/produk/d0', alt: 'H0', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d1', alt: 'H1', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d2', alt: 'H2', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d3', alt: 'H3', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d4', alt: 'H4', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d5', alt: 'H5', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d6', alt: 'H6', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d7', alt: 'H7', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d8', alt: 'H8', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d9', alt: 'H9', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d10', alt: 'H10', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null }, { src: '/images/produk/d11', alt: 'H11', width: 1200, height: 1500, produk: 'Kaos', bahan: 'Combed 24s', sablon: 'DTF', klienNama: null } ]` → **skenario C aktif**: section Gallery
     TIDAK dirender sama sekali, anchor `#galeri` dialihkan ke `#produk`
     (BLUEPRINT §8 Section 7). Blocker B2: nol foto hasil produksi nyata.
     Skenario A (≥12) & B (5–11) sudah dibangun di Gallery.astro, siap
     aktif begitu `foto` diisi — nol perubahan kode di luar data ini.
     ============================================================= */
  galeri: {
    foto: [],
    judul: 'Hasil Produksi',
    subjudul: null,
    blokTeksB: null,
    labelPerbesar: 'Perbesar',
    labelSebelumnya: 'Sebelumnya',
    labelBerikutnya: 'Berikutnya',
  },

  /* =============================================================
     lokasiIntro — S08. Copy UI section "Location" (BLUEPRINT §8
     Section 8). `deskripsiPeran` tiap lokasi TETAP null di lokasi.ts
     sampai klien mengonfirmasi — bukan urusan blok ini.
     ============================================================= */
  lokasiIntro: {
    judul: 'Tiga Lokasi, Satu Rantai Produksi',
    subjudul:
      'Head office untuk konsultasi, workshop dan pabrik untuk produksi — dikelola sendiri dari ujung ke ujung.',
    labelTampilkanPeta: 'Tampilkan peta',
    labelBukaMaps: 'Buka di Google Maps',
  },

  /* =============================================================
     kontak — S08. Copy UI section "Contact" (BLUEPRINT §8 Section 9).
     WhatsApp = CTA utama (lihat Contact.astro untuk hierarki visual);
     form = jalur sekunder, 5 field, Web3Forms, honeypot bukan CAPTCHA.
     ============================================================= */
  kontak: {
    judul: 'Konsultasikan Kebutuhan Anda',
    subjudul:
      'Satu langkah, tanpa gesekan — kirim pesan lewat WhatsApp atau isi form singkat di samping.',
    waJudul: 'Chat Langsung via WhatsApp',
    waDeskripsi: 'Kanal tercepat untuk konsultasi produk, bahan, dan estimasi kebutuhan Anda.',
    formJudul: 'Atau Kirim Pesan Tertulis',
    labelNama: 'Nama',
    labelInstansi: 'Instansi / Organisasi',
    labelKontak: 'WhatsApp atau Email',
    placeholderKontak: '08xx-xxxx-xxxx atau nama@email.com',
    labelJenisKebutuhan: 'Jenis kebutuhan',
    placeholderJenisKebutuhan: 'Pilih salah satu',
    opsiJenisKebutuhan: [
      'Apparel custom (kaos, jaket, dll)',
      'Racepack lomba lari',
      'Seragam instansi / korporat',
      'Lainnya',
    ],
    labelJumlahPcs: 'Perkiraan jumlah (pcs)',
    labelSubmit: 'Kirim Pesan',
    labelSubmitting: 'MENGIRIM…',
    // Nama field honeypot — sengaja generik, TIDAK boleh diisi manusia.
    honeypotNama: 'mv_website',
    honeypotLabel: 'Jangan diisi bila Anda manusia',
    pesanWajibDiisi: 'Wajib diisi.',
    pesanSukses: 'Pesan terkirim. Kami akan segera membalas lewat email atau WhatsApp.',
    pesanGagalJudul: 'Pesan gagal terkirim',
    pesanGagalDeskripsi:
      'Silakan coba lagi, atau langsung hubungi kami lewat WhatsApp supaya kebutuhan Anda tidak tertunda.',
    labelWaJalanKeluar: 'Chat WhatsApp',
    // [GAP] — akun Web3Forms klien belum ada. Lihat catatan tipe di types.ts.
    web3formsAccessKey: null,
  },
};

/* ---------- Generator pesan WhatsApp pre-fill ---------- */

export interface WaParams {
  /** Nama produk untuk konteks 'produk'. */
  produk?: string;
  /** Perkiraan jumlah peserta untuk konteks 'racepack'. */
  peserta?: string;
  /** Tanggal acara untuk konteks 'racepack'. */
  tanggal?: string;
}

const TEMPLATE_PESAN: Record<KonteksCTA, string> = {
  navbar: 'Halo MOTIVE, saya ingin bertanya soal pesanan apparel custom.',
  hero: 'Halo MOTIVE, saya ingin bertanya soal pesanan apparel custom.',
  produk: 'Halo MOTIVE, saya tertarik dengan produk {produk}. Boleh minta info lengkapnya?',
  racepack:
    'Halo MOTIVE, saya panitia event lari dan ingin menanyakan paket racepack. Perkiraan jumlah peserta: {peserta}. Tanggal acara: {tanggal}.',
  proses: 'Halo MOTIVE, saya ingin menanyakan proses produksi dan estimasi waktu pengerjaan.',
  kontak: 'Halo MOTIVE, saya ingin berkonsultasi soal kebutuhan apparel kami.',
  footer: 'Halo MOTIVE, saya ingin bertanya soal pesanan apparel custom.',
};

/**
 * URL WhatsApp deep-link dengan pesan pre-fill ter-encode.
 * Contoh: waLink('produk', { produk: 'Regular T-shirt' })
 *   → https://wa.me/6282168912769?text=Halo%20MOTIVE%2C%20saya%20tertarik%20...
 */
export function waLink(konteks: KonteksCTA, params: WaParams = {}): string {
  const teks = TEMPLATE_PESAN[konteks]
    .replace('{produk}', params.produk ?? 'yang dipilih')
    .replace('{peserta}', params.peserta ?? '(mohon diisi)')
    .replace('{tanggal}', params.tanggal ?? '(mohon diisi)');
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(teks)}`;
}
