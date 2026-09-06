import type { KonteksCTA, SiteConfig } from './types';

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
    // REDESIGN 2026-09-05 (permintaan klien, iterasi 5): headline balik lagi
    // ke hero — sekarang jadi tagline kecil "simple, to the point" di bawah
    // logo MOTIVE, bukan h1 raksasa seperti iterasi sebelumnya. `about.judul`
    // (S04, redesign 2026-09-04) TETAP memakai teks yang sama — belum
    // diminta klien untuk diganti, jadi dibiarkan.
    h1: 'KONVEKSI CUSTOM APPAREL & RACEPACK',
    sub: 'Kaos, jersey, seragam, jaket, dan racepack lari — dikerjakan di workshop dan pabrik kami sendiri, dengan kontrol kualitas berlapis.',
    ctaPrimer: 'Chat WhatsApp',
    ctaSekunder: 'Lihat Katalog',
    // BLUEPRINT §1.2/§8 [FAKTA-PDF] — anchor 38k, baris kecil, BUKAN headline.
    anchorHarga: 'Mulai Rp 38.000/pcs untuk kaos PE Soft 20s, sudah termasuk 1 logo depan.',
    stripJudul: 'Pernah dipercaya oleh',
    // REDESIGN 2026-09-05 (permintaan klien, iterasi 5) — balik pakai foto
    // asli `HERO SECTION/Hero Section.png` (lantai produksi, 1536×1024),
    // tapi diputihkan (grayscale + overlay putih 55%) meniru tampilan
    // `motive.png` (iterasi sebelumnya) via script sharp satu-kali — lihat
    // `public/images/hero/hero-section-whitened.png`. Logo MOTIVE ("item"/
    // hitam, `LOGO MOTIVE NEW.png`) ditumpuk di tengah sebagai elemen
    // terpisah oleh Hero.astro, bukan dibakar ke dalam foto.
    // ⚠️ PNG ~1,3 MB belum dioptimasi. WAJIB dikompres (AVIF/WebP, target
    // ≤180 KB) + `srcset` sebelum produksi — kalau tidak LCP jebol.
    fotoTersedia: true,
    fotoSrc: '/images/hero/hero-section-whitened.png',
    fotoAlt: 'Lantai produksi MOTIVE — deretan operator menjahit pesanan apparel',
    statusApproval: 'draft',
  },

  /* =============================================================
     about — S04. REDESIGN 2026-09-06 (permintaan klien): section
     dipangkas jadi MINIMALIS & VISUAL-DRIVEN. Dibuang: headline
     "KONVEKSI CUSTOM APPAREL & RACEPACK" (duplikat hero), 2 paragraf
     adaptasi PDF, dan baris fakta. Sisa: judul section, satu foto
     besar, dan 4 janji nilai (§1.1) yang memang sudah ringkas.
     ============================================================= */
  about: {
    judul: 'Tentang Kami',
    // Dikompres dari `GALLERY/IMG_20260804_214603_173.jpg` (4064×3048,
    // 3,6 MB) → 1760×990 / 64 KB via sharp. Sumbernya foto klien asli.
    // ⚠️ `alt` ditulis dari ISI gambar yang sebenarnya (meja potong +
    // potongan pola), BUKAN menyalin alt di galeri.ts yang keliru
    // menyebutnya "hasil produksi siap kirim" — lihat catatan di README
    // pekerjaan; alt di galeri.ts untuk berkas yang sama perlu dikoreksi.
    foto: {
      src: '/images/about/about-produksi.jpg',
      alt: 'Meja potong workshop MOTIVE — potongan pola dan bahan sebelum dijahit',
      width: 1760,
      height: 990,
    },
    // Judul kartu dari BLUEPRINT §8 Section 3; deskripsi = frasa asli §1.1 apa adanya.
    janjiNilai: [
      { judul: 'Kontrol Kualitas Berlapis', deskripsi: 'Quality Control sebagai perhatian utama.' },
      { judul: 'Ketepatan Waktu', deskripsi: 'On-time delivery.' },
      { judul: 'Garansi Hasil Produksi', deskripsi: 'Garansi kualitas hasil produksi.' },
      { judul: 'Material Sesuai Kesepakatan', deskripsi: 'Material sesuai kesepakatan awal.' },
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
     prosesIntro — S06. Judul section "Production" / Proses Produksi.
     REDESIGN 2026-09-04 (permintaan klien): judul pendek 2 kata bergaya
     "Our Services" (raksasa, emas), diposisikan di KANAN. Dulu string
     "Proses Produksi 11 Tahap" di-hardcode di Process.astro — dipindah
     ke sini (guardrail 5). Hitungan "11 tahap" tetap tersirat dari
     <ol aria-label> + nomor kartu 01..11, tak perlu di judul.
     ============================================================= */
  prosesIntro: {
    judul: 'Proses Produksi',
    subjudul: null,
  },

  /* =============================================================
     klienUi — S07. Copy UI section "Our Clients" (BLUEPRINT §8
     Section 6 + §5.2/§5.3). Nama & kategori organisasi TETAP di klien.ts.
     REDESIGN 2026-09-04 (permintaan klien, 2 iterasi):
       1. `judul` dipendekkan jadi "Portofolio", di tengah, judul raksasa.
       2. Deskripsi/`subjudul`, disclaimer merek di bawah grid, dan tombol
          CTA WhatsApp SEMUA DIHAPUS — section jadi judul + grid nama saja.
          Risiko framing (nama instansi tanpa disclaimer) diterima klien
          secara eksplisit.
     ============================================================= */
  klienUi: {
    judul: 'Portofolio',
    subjudul: null,
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
    // REDESIGN 2026-09-04 (permintaan klien): 1 kata, gaya judul raksasa
    // "Our Services", diposisikan di KIRI. Dulu "Hasil Produksi".
    judul: 'Produksi',
    subjudul: null,
    blokTeksB: null,
    labelPerbesar: 'Perbesar',
    labelSebelumnya: 'Sebelumnya',
    labelBerikutnya: 'Berikutnya',
  },

  /* =============================================================
     kontak — S08. Copy UI section "Contact" (BLUEPRINT §8 Section 9).
     REDESIGN 2026-09-05 (permintaan klien): form 5-field + Web3Forms +
     honeypot DIHAPUS TOTAL — client semua closing lewat WhatsApp, form
     tertulis tidak diperlukan. Section jadi judul + satu tombol WhatsApp,
     nol kartu/kotak. Field-field form lama (label, placeholder, pesan
     sukses/gagal, honeypot, web3formsAccessKey) ikut dibuang dari sini
     DAN dari `KontakContent` (types.ts) — bukan cuma disembunyikan,
     karena tidak ada rencana form ditampilkan lagi.
     ============================================================= */
  kontak: {
    judul: 'How Can We Help',
    subjudul: null,
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
