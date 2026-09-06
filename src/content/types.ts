/* =============================================================
   types.ts — kontrak tipe seluruh lapisan konten MOTIVE
   Aturan (CLAUDE.md guardrail 1 + BLUEPRINT §7.2):
   - Field yang JAWABANNYA BELUM DIBERIKAN KLIEN bertipe `| null`
     EKSPLISIT — bukan opsional `?`. Ini memaksa komponen menangani
     null (menyembunyikan baris), bukan mendiamkannya.
   - Kode anomali (A1–A25) merujuk BLUEPRINT.md §11.
   ============================================================= */

/* ---------- union / enum ---------- */

export type KategoriProduk = 'apparel';
export type KategoriRacepack = 'racepack';

export type BabakProses = 'I' | 'II' | 'III' | 'IV';

/** Empat kategori logo — BLUEPRINT §5.2. Urutan render = urutan deklarasi ini. */
export type KategoriKlien =
  'instansi-pendidikan' | 'korporat-properti' | 'event-olahraga' | 'komunitas-organisasi';

/** `belum_diverifikasi` → tabel TIDAK dirender (BLUEPRINT §7.2 poin 3). */
export type StatusVerifikasi = 'belum_diverifikasi' | 'terverifikasi';

export type UnitUkuran = 'cm' | 'inch';

export type KonteksCTA = 'navbar' | 'hero' | 'produk' | 'racepack' | 'proses' | 'kontak' | 'footer';

/* ---------- produk ---------- */

export interface Produk {
  slug: string;
  nama: string;
  kategori: KategoriProduk;
  /** id varian di `bahan.ts`. `[]` = pemetaan produk↔bahan belum lengkap (A9). */
  bahanRef: string[];
  /** id tabel di `size-charts.ts`, atau `null` bila produk belum punya tabel jelas (A9). */
  sizeChartRef: string | null;
  foto: string | null;
  /** [GAP] B6 — MOQ belum dijawab klien. */
  moq: number | null;
  /** [GAP] B6 — lead time belum dijawab klien. */
  leadTime: string | null;
  /** Rupiah. Non-null HANYA untuk anchor terverifikasi (BLUEPRINT §1.2). */
  hargaMulai: number | null;
  /** Kode anomali BLUEPRINT §11 yang menempel pada produk ini. */
  catatanAnomali: string | null;
}

export interface RacepackItem {
  slug: string;
  nama: string;
  kategori: KategoriRacepack;
  /** Spesifikasi yang MEMANG tertulis di nama produk PDF (mis. "Tyvek 125 gsm"). */
  spesifikasi: string | null;
  foto: string | null;
  moq: number | null;
  leadTime: string | null;
  hargaMulai: number | null;
  catatanAnomali: string | null;
}

/* ---------- bahan ---------- */

export interface Bahan {
  id: string;
  /** Salah satu dari 5 kelompok bahan (BLUEPRINT §7.2). */
  kelompok: string;
  /** Nama netral yang DIRENDER ke HTML. Wajib bebas merek dagang. */
  namaTampil: string;
  /**
   * INTERNAL — DILARANG DIRENDER.
   * Nama pasar / merek dagang apa adanya dari company profile klien
   * ("Nike", "Billabong", "Lacoste CVC"). Hanya untuk rujukan tim.
   * Publikasi tertulis = risiko hukum (BLUEPRINT §11 A14/A15, blocker B4).
   */
  namaPasar: string | null;
  /** Daftar gramatur diskret dari PDF (mis. `[140, 150, 160]`). `[]` bila PDF hanya memberi rentang — lihat `gramasi`. */
  gsm: number[];
  /** Teks gramatur verbatim dari PDF bila berupa rentang (mis. "200–230 gsm", "±140–160 gsm · ±160–180 gsm"). `null` bila `gsm` sudah cukup. */
  gramasi: string | null;
  deskripsi: string | null;
  swatch: string | null;
  catatanAnomali: string | null;
}

/* ---------- size chart ---------- */

export interface BarisSize {
  /** Label baris apa adanya dari PDF ("Lebar Dada", "Ling. Dada", "Panjang Lengan", …). */
  label: string;
  /** Satu nilai per kolom size, urut sesuai `SizeChart.sizes`. `null` = sel belum tersalin/terverifikasi. */
  nilai: (number | null)[];
  catatanAnomali: string | null;
}

export interface SizeChart {
  id: string;
  nama: string;
  /** Header kolom, mis. ["S","M","L","XL","2XL","3XL","4XL"]. */
  sizes: string[];
  unit: UnitUkuran;
  baris: BarisSize[];
  toleransi: string | null;
  /** Selama `'belum_diverifikasi'` komponen TIDAK merender tabel ini (blocker B3). */
  statusVerifikasi: StatusVerifikasi;
  /** Kode anomali BLUEPRINT §11 (A1–A9) yang relevan untuk tabel ini. */
  catatanAnomali: string[];
}

/* ---------- klien ---------- */

export interface Klien {
  nama: string;
  kategori: KategoriKlien;
  logo: string | null;
  /** [GAP] B5 — semua `false` sampai izin tertulis turun. `false` → render nama teks. */
  izinTayang: boolean;
  tampilDiHero: boolean;
}

/* ---------- proses ---------- */

export interface TahapProses {
  /** 1..11 — urutan dikunci klien (BLUEPRINT §1.4). */
  nomor: number;
  nama: string;
  deskripsi: string | null;
  babak: BabakProses;
  media: string | null;
}

/* ---------- lokasi ---------- */

export interface Koordinat {
  lat: number;
  lng: number;
}

export interface Lokasi {
  slug: string;
  /** "Head Office" | "Workshop" | "Factory" — apa adanya dari PDF. */
  peran: string;
  alamat: string;
  /** [GAP] — koordinat presisi belum ada. `null` → JSON-LD `geo` diomit (T03.2). */
  koordinat: Koordinat | null;
  mapsUrl: string | null;
  /** [GAP] — deskripsi peran tiap lokasi belum dikonfirmasi klien. */
  deskripsiPeran: string | null;
  /** [GAP] — jam operasional per lokasi belum dijawab. `null` → `openingHours` diomit. */
  jamOperasional: string | null;
  telepon: string | null;
}

/* ---------- harga ---------- */

export interface AnchorHarga {
  nominal: number;
  label: string;
  catatan: string | null;
}

export interface BarisHargaDTF {
  nama: string;
  nominal: number;
  catatanAnomali: string | null;
}

export interface PaketHarga {
  nama: string;
  nominal: number;
  catatan: string;
}

export interface Harga {
  anchorKaos: AnchorHarga;
  anchorJersey: AnchorHarga;
  sablonDTF: BarisHargaDTF[];
  paketLanyard: PaketHarga;
  /** [GAP] — tanggal klien terakhir mengonfirmasi harga. `null` → label "harga per bulan ini" disembunyikan. */
  tanggalKonfirmasiTerakhir: string | null;
}

/* ---------- site ---------- */

export interface Sosmed {
  label: string;
  url: string;
}

/* ---------- hero (S04) ---------- */

export interface HeroContent {
  eyebrow: string;
  h1: string;
  sub: string;
  ctaPrimer: string;
  ctaSekunder: string;
  /** Baris kecil Body S di bawah CTA — BUKAN headline (BLUEPRINT §8 Section 2). */
  anchorHarga: string;
  /** Judul strip bukti sosial ("Pernah dipercaya oleh"). */
  stripJudul: string;
  /**
   * Flag TUNGGAL varian hero. `false` → latar polos + tipografi besar.
   * `true` → foto + overlay, HANYA bermakna kalau `fotoSrc` juga terisi.
   * Default `false` selama blocker B2 (asal foto pabrik) belum dijawab.
   */
  fotoTersedia: boolean;
  fotoSrc: string | null;
  fotoAlt: string | null;
  /** Draft menunggu persetujuan klien (blocker B1/A24) — lihat §5.4. */
  statusApproval: 'draft' | 'final';
}

/* ---------- about (S04) ---------- */

export interface JanjiNilai {
  judul: string;
  deskripsi: string;
}

export interface AboutContent {
  /**
   * H2 SectionHeading — "Tentang Kami". Headline "KONVEKSI CUSTOM APPAREL
   * & RACEPACK" dilepas dari sini karena sudah ada di hero.
   */
  judul: string;
  /**
   * Tepat 2 paragraf, adaptasi PDF.
   * REDESIGN 2026-09-06: sempat dibuang saat section dibuat visual-driven,
   * lalu DIKEMBALIKAN — foto "tentang kami" milik klien belum tersedia,
   * jadi section ini tetap berbasis teks (permintaan klien).
   */
  paragraf: [string, string];
  janjiNilai: JanjiNilai[];
  /**
   * Baris fakta perusahaan. Setiap elemen `null` disembunyikan sendiri-
   * sendiri; bila SELURUH elemen `null`, seluruh baris tidak dirender
   * (guardrail 1 — nol label kosong, nol tanda hubung menggantung).
   */
  baris: (string | null)[];
}

/* ---------- services (S05) ---------- */

export interface ServicesContent {
  /** H2 SectionHeading — BLUEPRINT §7.7. */
  judul: string;
  tabApparel: string;
  tabRacepack: string;
  tabBahan: string;
  /** Teks tombol ungkap 4 kartu Apparel sisanya. */
  labelLihatLainnya: string;
  /** Teks tombol saat 4 kartu sudah terungkap (aksi sebaliknya). */
  labelSembunyikanLainnya: string;
  /** Kalimat pembuka blok Paket Racepack — merangkai 4 nama item racepack.ts. */
  racepackIntro: string;
  /** Judul blok tabel add-on (DTF + lanyard). */
  addOnJudul: string;
  /** Judul blok selector panduan ukuran. */
  panduanUkuranJudul: string;
  /** Label <label> untuk <select> native. */
  panduanUkuranPilihLabel: string;
  /**
   * Kalimat WAJIB (persis) saat tabel berstatus `belum_diverifikasi`
   * (blocker B3) — AC T05.5. Tabel itu sendiri TIDAK dirender sama sekali.
   */
  panduanUkuranBelumVerifikasi: string;
}

/* ---------- proses intro (S06) ---------- */

export interface ProsesIntroContent {
  /** H2 SectionHeading. REDESIGN 2026-09-04 — judul pendek gaya "Our Services". */
  judul: string;
  subjudul: string | null;
}

/* ---------- clients UI (S07) ---------- */

export interface KlienUiContent {
  /**
   * H2 SectionHeading. REDESIGN 2026-09 (permintaan klien, beberapa iterasi):
   * "Portofolio", di tengah, gaya judul raksasa. Disclaimer merek + CTA WA
   * dihapus. Grid digabung jadi SATU tanpa label kategori dan menampilkan
   * SELURUH klien (tanpa sel "+ Banyak lagi"). `labelKategori`/`labelLainnya`
   * ikut dibuang. Risiko framing diterima klien secara eksplisit.
   */
  judul: string;
  /** Sub opsional. `null` → tidak dirender (deskripsi judul dihapus di semua section). */
  subjudul: string | null;
}

/* ---------- gallery (S07) ---------- */

export interface GaleriFoto {
  /** Basename aset tanpa ekstensi (AVIF/WebP diturunkan di komponen). */
  src: string;
  /** alt deskriptif — BUKAN "foto galeri N". */
  alt: string;
  width: number;
  height: number;
  /** Bagian caption: `[produk] · [bahan] · [sablon]`. */
  produk: string;
  bahan: string;
  sablon: string;
  /**
   * Nama klien untuk caption — HANYA diisi bila klien itu `izinTayang: true`
   * di `klien.ts` (AC T07.7). `null` → caption tanpa nama klien.
   */
  klienNama: string | null;
}

export interface GaleriContent {
  /**
   * Foto hasil produksi NYATA. Jumlahnya menentukan skenario:
   *   ≥12 → A (grid + lightbox) · 5–11 → B (editorial) · <5 → C (section
   *   TIDAK dirender, anchor `#galeri` dialihkan ke `#produk`).
   * Kosong sekarang (blocker B2 — nol foto hasil nyata) → skenario C.
   */
  foto: GaleriFoto[];
  /** H2 SectionHeading (dipakai skenario A & B). */
  judul: string;
  subjudul: string | null;
  /** Blok teks tipografis skenario B. `null` → blok teks tidak dirender. */
  blokTeksB: string | null;
  /** Chrome lightbox skenario A (bukan data bisnis). */
  labelPerbesar: string;
  labelSebelumnya: string;
  labelBerikutnya: string;
}

/* ---------- contact (S08) ---------- */

export interface KontakContent {
  /**
   * H2 SectionHeading — BLUEPRINT §8 Section 9.
   * REDESIGN 2026-09-05 (permintaan klien): form 5-field + Web3Forms +
   * honeypot DIHAPUS TOTAL (client semua closing lewat WhatsApp). Section
   * sekarang cuma judul + satu tombol WhatsApp — seluruh field form lama
   * dibuang dari sini, bukan cuma disembunyikan.
   */
  judul: string;
  subjudul: string | null;
}

export interface SiteConfig {
  namaCV: string;
  brand: string;
  tagline: string;
  pic: { nama: string; jabatan: string };
  /** Format internasional tanpa tanda: "6282168912769". Blocker B7. */
  whatsapp: string;
  email: string;
  meta: { title: string; description: string };
  /** 4 janji nilai klien — BLUEPRINT §1.1 [FAKTA-PDF]. */
  nilai: string[];
  /** [GAP] non-blocker — NIB/NPWP belum diberikan. */
  nib: string | null;
  /** [GAP] non-blocker — tahun berdiri belum diberikan. */
  tahunBerdiri: number | null;
  /** [GAP] non-blocker — akun sosial media belum diberikan. `null` → kolom footer disembunyikan. */
  sosmed: Sosmed[] | null;
  /** [GAP] non-blocker — "balasan biasanya dalam …" belum dikonfirmasi. */
  balasanBiasanya: string | null;
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  prosesIntro: ProsesIntroContent;
  klienUi: KlienUiContent;
  galeri: GaleriContent;
  kontak: KontakContent;
}
