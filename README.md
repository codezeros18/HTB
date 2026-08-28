# Website Company Profile MOTIVE

Website resmi **MOTIVE**, brand apparel milik **CV. Huimora Talenta Berkarya**. Satu halaman, statis, Bahasa Indonesia, menampilkan katalog produk, pilihan bahan, panduan ukuran, proses produksi, portofolio, dan tiga lokasi operasional. Tujuan utamanya sederhana: memudahkan calon klien memahami apa yang MOTIVE kerjakan, lalu menghubungi lewat WhatsApp dalam satu klik.

Dibangun dengan **Astro 7**, **TypeScript**, dan **Tailwind CSS 4**. Situs ini dihasilkan sebagai HTML statis — tidak ada server aplikasi, tidak ada basis data, dan tidak ada biaya berjalan selain hosting.

> Catatan versi: rencana awal memakai Astro 5, tetapi seri 5.x membawa 8 advisory XSS yang hanya ditambal di Astro 7. Karena API yang dipakai proyek ini (komponen `.astro`, content collections, `astro:assets`) setara di kedua versi, fondasi memakai Astro 7.

---

## Peta Repo

```
.
├── src/
│   ├── components/
│   │   ├── layout/          Navbar, MobileMenu, Footer, Container, SectionHeading, SkipLink
│   │   ├── ui/              Button, Tab, Accordion, Modal, Table, Badge, WhatsAppButton
│   │   ├── sections/        Hero, About, Services, Process, Clients, Gallery, Location, Contact
│   │   └── cards/           ProductCard, RacepackCard, MaterialCard, ValueCard, LocationCard, ClientLogo
│   ├── content/             ← SEMUA ISI WEBSITE ADA DI SINI (lihat bagian "Mengubah Konten")
│   ├── layouts/             BaseLayout.astro
│   ├── pages/               index.astro, 404.astro
│   ├── scripts/             observer.ts, tabs.ts, process-stepper.ts, map-facade.ts, contact-form.ts
│   └── styles/              tokens.css (warna & ukuran), global.css
├── public/
│   ├── images/              produk, bahan, proses, lokasi, klien, hero
│   ├── fonts/               Archivo & Inter (WOFF2)
│   ├── docs/                company-profile-motive.pdf
│   └── favicon/, og-image.jpg, robots.txt
├── scripts/
│   ├── check-budget.mjs     Pemeriksa berat halaman (dipakai `npm run check:budget`)
│   └── verify-s*.mjs        Uji acceptance per sprint di peramban nyata (butuh Chrome)
├── astro.config.mjs
└── package.json
```

---

## Prasyarat

| Kebutuhan | Versi |
|---|---|
| Node.js | 20 atau lebih baru (`node -v` untuk mengecek) |
| Package manager | npm 10+ (bawaan Node 20), atau pnpm 9+ |
| Git | versi apa pun yang terbaru |

---

## Setup & Menjalankan Secara Lokal

**1. Ambil kode dan masuk ke foldernya**

```bash
git clone <url-repo>
cd motive-website
```

**2. Pasang dependensi**

```bash
npm install
```

**3. Jalankan server pengembangan**

```bash
npm run dev
```

Buka `http://localhost:4321` di peramban. Setiap perubahan file akan langsung terlihat tanpa perlu me-refresh.

**4. Menghentikan server**

Tekan `Ctrl + C` di terminal.

---

## Kerja Paralel dari Dua Mesin (Komputer & Laptop)

Repo ini bisa dikerjakan bergantian dari beberapa mesin. Yang wajib dipahami lebih dulu: **tidak semua file ikut Git.**

### 1. Yang tersinkron lewat Git — cukup `git pull` / `git push`

Seluruh `src/` (komponen + konten di `src/content/` + style + script), `public/` (font, gambar hasil optimasi, dokumen publik), `scripts/` (`check-budget.mjs`, `verify-s*.mjs`), dan seluruh konfigurasi (`astro.config.mjs`, `package.json`, `package-lock.json`, `eslint.config.js`, `.prettierrc.json`, `tsconfig.json`) plus `README.md`.

### 2. Yang TIDAK ikut Git — harus disalin manual antar mesin

Dokumen kerja internal ada di `.gitignore` (berisi strategi, daftar data yang belum dijawab klien, catatan anomali — bukan untuk konsumsi klien):

| File | Isi | Kalau hilang |
|---|---|---|
| `PROGRESS.md` | Log tiap task: yang dikerjakan, keputusan teknis, error & fix | **Seluruh memori teknis proyek hilang — tidak ada salinan lain** |
| `TASKS.md` | Rencana sprint + status centang | Kehilangan jejak apa yang sudah/belum selesai |
| `BLUEPRINT.md` | Spesifikasi penuh + token desain | Kehilangan alasan di balik tiap keputusan |
| `PROMPTS.md` | Prompt siap-pakai per sprint | — |
| `CLAUDE.md` | Aturan proyek (dibaca otomatis tiap sesi Claude Code) | Sesi berikutnya kehilangan guardrail |

**Cara menyinkronkannya — pilih salah satu:**

- **Folder bersama (paling praktis):** taruh kelima file di Google Drive / OneDrive / Dropbox yang ter-sync di kedua mesin, lalu salin ke root repo sebelum mulai kerja dan salin balik setelah selesai.
- **Repo privat terpisah:** simpan kelima file di repo Git privat kedua, di-`pull`/`push` terpisah dari repo utama.
- **Salin manual (rawan lupa, hanya darurat):** kirim `PROGRESS.md` + `TASKS.md` terbaru ke diri sendiri sebelum pindah mesin.

Aturan mainnya: **selesai kerja → perbarui `PROGRESS.md` → sinkronkan kelima file → baru pindah mesin.**

### 3. Yang harus dipasang / dibuat ulang di TIAP mesin (tidak ikut Git, tapi bisa dibuat ulang)

| Item | Cara | Catatan |
|---|---|---|
| Node.js | pasang manual di OS | **Samakan versi mayor di kedua mesin** — Node 20 LTS atau 22 LTS. Beda versi bisa membuat `package-lock.json` berubah bolak-balik |
| Git | pasang manual di OS | versi terbaru apa pun |
| `node_modules/` | `npm install` | Jalankan ulang **setiap habis `git pull` yang mengubah `package-lock.json`** |
| `dist/`, `.astro/` | otomatis saat `npm run dev` / `npm run build` | Jangan di-commit; aman dihapus kapan saja |
| Google Chrome | pasang manual | **Hanya** dibutuhkan oleh `scripts/verify-s*.mjs` (uji di peramban nyata). `dev` / `build` / `lint` / `typecheck` / `check:budget` tidak butuh Chrome. Skrip verify mencari Chrome di `C:/Program Files/Google/Chrome/Application/chrome.exe` — sesuaikan konstanta `CHROME` di dalam skrip bila lokasinya beda |

**Tidak ada `.env` atau kunci rahasia saat ini** — `npm install` lalu `npm run dev` sudah cukup untuk menjalankan situs sepenuhnya. (Bila nanti kunci Web3Forms disimpan sebagai variabel lingkungan, file `.env` dibuat manual di tiap mesin dan tidak ikut Git.)

### 4. Checklist mesin baru (pertama kali)

1. Pasang **Node.js 20+** dan **Git** (plus **Google Chrome** bila akan menjalankan `verify-s*.mjs`)
2. `git clone <url-repo>` lalu `cd` ke folder repo
3. `npm install`
4. Salin `PROGRESS.md`, `TASKS.md`, `BLUEPRINT.md`, `PROMPTS.md`, `CLAUDE.md` dari folder bersama ke root repo
5. `npm run dev` → buka `http://localhost:4321`. Kalau halaman muncul, setup beres
6. (opsional) `npm run build && npm run check:budget` untuk memastikan toolchain lengkap

### 5. Rutinitas tiap kali berpindah mesin

**Mulai sesi:**

```bash
git pull                 # tarik perubahan kode dari mesin sebelumnya
npm install              # hanya bila package-lock.json ikut berubah
# salin PROGRESS.md + TASKS.md (+ file internal lain) dari folder bersama
```

**Selesai sesi:**

```bash
npm run lint && npm run typecheck && npm run build && npm run check:budget
git add -A && git commit -m "<ringkas perubahan>" && git push
# perbarui PROGRESS.md, lalu salin kelima file internal balik ke folder bersama
```

---

## Mengubah Konten

**Ini bagian yang paling sering dipakai.** Seluruh isi website — nama produk, harga, alamat, daftar klien, deskripsi bahan — berada di folder `src/content/`. Tidak perlu menyentuh komponen atau file desain sama sekali.

Setiap kali selesai mengubah, jalankan `npm run dev` untuk melihat hasilnya, lalu `npm run build` sebelum menerbitkan.

### Mengubah harga

Semua harga ada di **satu file**: `src/content/harga.ts`.

```ts
export const harga = {
  anchorKaos: {
    nominal: 38000,
    label: 'Kaos PE Soft 20s',
    catatan: 'Sudah termasuk 1 logo di bagian depan',
  },
  anchorJersey: {
    nominal: 40000,
    label: 'Jersey fullprint',
    catatan: null,
  },
  sablonDTF: [
    { nama: 'Sablon DTF LOGO', nominal: 6000 },
    { nama: 'Sablon DTF A5',   nominal: 8000 },
    // ...
  ],
  tanggalKonfirmasiTerakhir: '2026-08',
};
```

Ubah angka pada `nominal`. Format rupiah (titik pemisah ribuan) ditambahkan otomatis — **tulis angka polos tanpa titik**.

Jangan lupa memperbarui `tanggalKonfirmasiTerakhir` supaya keterangan "harga per bulan ini" di website ikut berubah.

### Menambah produk baru

Buka `src/content/katalog.ts` dan tambahkan satu objek ke dalam array:

```ts
{
  slug: 'crewneck-sweater',          // huruf kecil, tanpa spasi, dipakai untuk anchor URL
  nama: 'Crewneck Sweater',
  kategori: 'apparel',
  bahanRef: ['fleece'],              // merujuk id di bahan.ts
  sizeChartRef: 'jaket',             // merujuk id di size-charts.ts, atau null bila belum ada
  foto: '/images/produk/crewneck-sweater.jpg',
  moq: null,                         // biarkan null bila belum ditentukan
  hargaMulai: null,
},
```

**Penting:** field yang belum ada datanya diisi `null`, **bukan** dikosongkan dan **bukan** diisi tebakan. Baris yang bernilai `null` otomatis disembunyikan di halaman, sehingga tidak ada informasi setengah jadi yang tampil ke pengunjung.

### Menambah logo klien

Buka `src/content/klien.ts`:

```ts
{
  nama: 'Nama Organisasi',
  kategori: 'instansi',              // 'instansi' | 'korporat' | 'event' | 'komunitas'
  logo: '/images/klien/nama-organisasi.png',
  izinTayang: false,                 // ← lihat penjelasan di bawah
  tampilDiHero: false,
},
```

**Tentang `izinTayang`:**
- `false` — website menampilkan **nama organisasi sebagai teks** di dalam kotak yang sama, bukan logonya. Ini kondisi aman ketika izin penggunaan logo belum diperoleh.
- `true` — website menampilkan file logo.

Ubah ke `true` **hanya setelah** izin dari organisasi yang bersangkutan diperoleh. Tampilannya tetap rapi pada kedua kondisi, jadi tidak perlu terburu-buru.

**`tampilDiHero: true`** menempatkan organisasi tersebut di deretan logo di bagian paling atas halaman. Batasi maksimal 5 agar tetap efektif.

### Memasukkan foto

**1. Letakkan file di folder yang sesuai:**

| Jenis foto | Folder | Rasio | Ukuran minimum |
|---|---|---|---|
| Produk | `public/images/produk/` | 4:5 (tegak) | 1600px |
| Bahan (close-up kain) | `public/images/bahan/` | 1:1 (kotak) | 1200px |
| Proses produksi | `public/images/proses/` | 3:2 (mendatar) | 2000px |
| Workshop / pabrik (hero) | `public/images/hero/` | 16:9 (mendatar) | 2400px |
| Logo klien | `public/images/klien/` | bebas | 500px, PNG transparan |
| Fasad lokasi | `public/images/lokasi/` | 3:2 (mendatar) | 1600px |

**2. Hubungkan di file konten yang sesuai:**

```ts
// Contoh di src/content/proses.ts
{
  nomor: 6,
  nama: 'Sewing',
  deskripsi: 'Potongan kain dijahit menjadi produk utuh.',
  babak: 'III',
  media: '/images/proses/06-sewing.jpg',   // ← sebelumnya null
},
```

Konversi ke format web (AVIF/WebP), pembuatan versi kecil untuk ponsel, dan pemasangan ukuran gambar dilakukan **otomatis** saat build. Cukup letakkan file aslinya dengan resolusi yang baik.

**Catatan:** bagian Galeri menyesuaikan diri dengan jumlah foto yang tersedia. Dengan sedikit foto, tata letaknya berubah agar tetap terlihat rapi; bila belum ada foto sama sekali, bagian tersebut tidak ditampilkan.

### Mengubah nomor WhatsApp, email, atau alamat

Nomor WhatsApp, email, dan identitas perusahaan ada di `src/content/site.ts`. Alamat ketiga lokasi ada di `src/content/lokasi.ts`.

Nomor WhatsApp ditulis dalam format internasional tanpa tanda apa pun:

```ts
whatsapp: '6282168912769',   // bukan 0821-6891-2769
```

Mengubahnya di satu tempat ini akan memperbarui **seluruh** tombol WhatsApp di website.

---

## Build & Deploy

**Membuat versi produksi:**

```bash
npm run build
```

Hasilnya ada di folder `dist/`. Ini yang diunggah ke hosting.

**Melihat pratinjau hasil build sebelum diterbitkan:**

```bash
npm run preview
```

**Menerbitkan:**

Website terhubung ke hosting (Netlify / Cloudflare Pages) melalui Git. Setiap `git push` ke branch utama akan otomatis membangun dan menerbitkan versi terbaru.

```bash
git add .
git commit -m "Perbarui harga kaos"
git push
```

Push ke branch lain menghasilkan **URL pratinjau** terpisah — berguna untuk meminta persetujuan sebelum perubahan tayang di alamat resmi.

---

## Perintah Verifikasi

Jalankan seluruhnya sebelum menerbitkan perubahan besar:

```bash
npm run lint          # Memeriksa gaya penulisan kode
npm run typecheck     # Memeriksa kesalahan tipe data
npm run build         # Memastikan website bisa dibangun
npm run check:budget  # Memastikan halaman tidak menjadi terlalu berat
```

`check:budget` akan **gagal dengan sengaja** bila halaman melewati batas berat yang ditetapkan. Ini pengaman agar penambahan foto besar tidak diam-diam membuat website lambat di jaringan seluler.

Bila salah satu perintah gagal, perbaiki sebelum melakukan push.

---

## Kontak Teknis

Pertanyaan seputar kode, hosting, atau perubahan yang tidak tercakup di panduan ini dapat diarahkan ke tim pengembang.
