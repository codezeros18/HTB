/* =============================================================
   layanan.ts — hierarki "Our Services" untuk drill-down.
   REDESIGN 2026-08-30 (permintaan klien) — sekarang MEMETAKAN
   PERSIS struktur folder `public/images/OUR SERVICE/`:

     Custom Apparel → MEN / WOMEN / SPORTSWEAR / OUTERWEAR / UNIFORM → item
     Running Package → item
     Campus Package  → item
     Merchandise     → item

   Layanan yang hanya punya SATU kelompok (`sub.length === 1`) dibuka
   langsung ke daftar itemnya — komponen melompati satu tingkat.

   ATURAN KONTEN (guardrail 1): `deskripsi` = kalimat NETRAL soal
   potongan/kegunaan. NOL angka, MOQ, lead time, harga, atau klaim.

   ⚠️ BERAT ASET: foto PNG 1–2,4 MB per berkas (total OUR SERVICE ±75 MB).
   WAJIB dikompres (AVIF/WebP + srcset) sebelum produksi.
   ============================================================= */

export interface LayananDetail {
  slug: string;
  /** Nama pendek untuk kartu/daftar & breadcrumb. */
  nama: string;
  /**
   * Judul produk versi dokumen copywriting klien, dipakai sebagai H1 di
   * halaman detail. Sering LEBIH PANJANG dari `nama` ("Rompi" -> "Custom
   * Vest", "Jersey Basket" -> "Basketball Jersey"). `null` = sama dengan
   * `nama`, jadi tidak perlu ditulis dua kali.
   */
  judul: string | null;
  /** Paragraf pembuka — copy resmi klien. */
  deskripsi: string;
  /** Paragraf kedua ("dapat dikustomisasi ..."). `null` bila produk hanya punya satu. */
  deskripsi2: string | null;
  /**
   * Kode tabel di `size-charts.ts` ('sc-01' .. 'sc-10'). `null` untuk
   * produk non-apparel (medali, bib, tas, pin, tumbler) dan untuk produk
   * fully-custom yang ukurannya mengikuti tech pack — keduanya memakai
   * `panduanUkuran` sebagai gantinya.
   */
  sizeChartId: string | null;
  /**
   * Judul blok panduan ukuran non-tabel, apa adanya dari dokumen klien:
   * 'Size Guide' atau 'Dimension Guide'. `null` bila produk memakai tabel.
   */
  panduanJudul: string | null;
  /** Kalimat panduan ukuran untuk produk tanpa tabel baku. */
  panduanUkuran: string | null;
  /** Baris "Measurement:" dari dokumen klien (mis. "Diameter 8cm ..."). */
  dimensi: string | null;
  /** Catatan tambahan di bawah size chart, khusus produk tertentu. */
  catatanUkuran: string | null;
  /** Label tombol CTA khusus produk ("Konsultasikan Crewneck"). */
  ctaLabel: string;
  foto: string;
  width: number;
  height: number;
}

export interface LayananSub {
  slug: string;
  nama: string;
  foto: string;
  items: LayananDetail[];
}

export interface Layanan {
  slug: string;
  nama: string;
  /** Satu baris di kartu tingkat 0. */
  ringkas: string;
  foto: string;
  sub: LayananSub[];
}

const B = '/images/OUR%20SERVICE';
const CA = `${B}/Custom%20Apparel`;

/* Dimensi asli berulang — dipakai untuk width/height <img> (anti-CLS). */
const P1 = { width: 1023, height: 1537 };
const P2 = { width: 1054, height: 1492 };

export const layanan: Layanan[] = [
  {
    slug: 'custom-apparel',
    nama: 'Custom Apparel',
    ringkas: 'Kaos, jaket, seragam custom.',
    foto: `${CA}/MEN/Thumbnail.webp`,
    sub: [
      {
        slug: 'men',
        nama: 'Men',
        foto: `${CA}/MEN/Thumbnail.webp`,
        items: [
          {
            slug: 'custom-menswear',
            nama: 'Custom Menswear',
            judul: null,
            deskripsi:
              'Layanan produksi menswear yang dikembangkan berdasarkan desain, referensi, atau tech pack Anda. Mulai dari pemilihan material, konstruksi, cutting, hingga detail finishing dapat disesuaikan dengan karakter dan fungsi produk.',
            deskripsi2: null,
            sizeChartId: null,
            panduanJudul: 'Size Guide',
            panduanUkuran:
              'Ukuran mengikuti tech pack atau measurement specification yang telah disepakati sebelum produksi.',
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Custom Menswear',
            foto: `${CA}/MEN/CUSTOM%20MENSWEAR.webp`,
            width: 1024,
            height: 1536,
          },
          {
            slug: 'men-crewneck',
            nama: 'Crewneck',
            judul: null,
            deskripsi:
              'Crewneck dengan tampilan clean dan versatile untuk kebutuhan perusahaan, komunitas, kampus, brand, maupun merchandise.',
            deskripsi2:
              'Material, warna, cutting, serta aplikasi desain dapat disesuaikan dengan kebutuhan dan identitas project Anda.',
            sizeChartId: 'sc-03',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Crewneck',
            foto: `${CA}/MEN/MAN%20CREWNECK.webp`,
            ...P1,
          },
          {
            slug: 'men-henley',
            nama: 'Henley',
            judul: null,
            deskripsi:
              'Casual top dengan detail bukaan kancing pada bagian leher yang memberikan tampilan lebih refined tanpa kehilangan kenyamanan.',
            deskripsi2:
              'Dapat dikustomisasi melalui pilihan material, warna, cutting, jenis kancing, hingga aplikasi logo dan branding.',
            sizeChartId: 'sc-01',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Henley',
            foto: `${CA}/MEN/MEN%20HENLEY.webp`,
            ...P1,
          },
          {
            slug: 'men-shirt',
            nama: 'Shirt',
            judul: 'Men’s Shirt',
            deskripsi:
              'Kemeja custom untuk kebutuhan corporate, event, komunitas, brand, maupun seragam dengan tampilan yang rapi dan profesional.',
            deskripsi2:
              'Model kerah, panjang lengan, material, warna, serta aplikasi bordir atau printing dapat disesuaikan dengan kebutuhan project.',
            sizeChartId: 'sc-02',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Shirt',
            foto: `${CA}/MEN/MEN%20SHIRT.webp`,
            ...P1,
          },
          {
            slug: 'men-polo-shirt',
            nama: 'Polo Shirt',
            judul: null,
            deskripsi:
              'Polo shirt dengan tampilan smart-casual yang cocok untuk kebutuhan perusahaan, event, komunitas, maupun aktivitas operasional.',
            deskripsi2:
              'Pilihan material, warna, detail kerah, kancing, serta aplikasi logo dapat disesuaikan dengan identitas Anda.',
            sizeChartId: 'sc-01',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Polo Shirt',
            foto: `${CA}/MEN/MEN%20POLO%20SHIRT.webp`,
            ...P1,
          },
          {
            slug: 'men-pants',
            nama: 'Pants',
            judul: 'Men’s Pants',
            deskripsi:
              'Celana custom yang dikembangkan untuk kebutuhan casual, uniform, maupun koleksi brand dengan fokus pada kenyamanan dan proporsi cutting.',
            deskripsi2:
              'Material, warna, detail kantong, waistband, serta finishing dapat disesuaikan berdasarkan fungsi produk.',
            sizeChartId: 'sc-04',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Pants',
            foto: `${CA}/MEN/MEN%20PANTS.webp`,
            ...P1,
          },
        ],
      },
      {
        slug: 'women',
        nama: 'Women',
        foto: `${CA}/WOMEN/Thumbnail.webp`,
        items: [
          {
            slug: 'custom-womenswear',
            nama: 'Custom Womenswear',
            judul: null,
            deskripsi:
              'Layanan pengembangan dan produksi womenswear berdasarkan desain, referensi, maupun tech pack Anda.',
            deskripsi2:
              'Silhouette, material, konstruksi, ukuran, dan detail finishing dapat dikembangkan sesuai karakter brand atau kebutuhan project.',
            sizeChartId: null,
            panduanJudul: 'Size Guide',
            panduanUkuran:
              'Mengikuti tech pack atau measurement specification yang telah disepakati.',
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Custom Womenswear',
            foto: `${CA}/WOMEN/CUSTOM%20WOMENSWEAR.webp`,
            ...P2,
          },
          {
            slug: 'woman-dress',
            nama: 'Dress',
            judul: null,
            deskripsi:
              'Custom dress yang dapat dikembangkan untuk kebutuhan corporate, hospitality, event, brand, maupun koleksi khusus.',
            deskripsi2:
              'Model, panjang, material, cutting, warna, dan detail produk dapat disesuaikan berdasarkan desain yang diinginkan.',
            sizeChartId: 'sc-06',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Dress',
            foto: `${CA}/WOMEN/WOMAN%20DRESS.webp`,
            ...P1,
          },
          {
            slug: 'woman-shirt',
            nama: 'Shirt',
            judul: 'Women’s Shirt',
            deskripsi:
              'Kemeja wanita custom dengan proporsi dan cutting yang dirancang untuk memberikan tampilan rapi dan profesional.',
            deskripsi2:
              'Material, warna, bentuk kerah, panjang lengan, serta detail branding dapat disesuaikan dengan kebutuhan.',
            sizeChartId: 'sc-05',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Women’s Shirt',
            foto: `${CA}/WOMEN/WOMAN%20SHIRT.webp`,
            ...P1,
          },
          {
            slug: 'woman-t-shirt',
            nama: 'T-Shirt',
            judul: 'Women’s T-Shirt',
            deskripsi:
              'T-shirt wanita dengan cutting yang clean dan versatile untuk kebutuhan event, komunitas, perusahaan, maupun brand.',
            deskripsi2:
              'Material, warna, fit, serta metode printing atau embroidery dapat disesuaikan dengan konsep project.',
            sizeChartId: 'sc-05',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Women’s T-Shirt',
            foto: `${CA}/WOMEN/WOMAN%20T-SHIRT.webp`,
            ...P1,
          },
          {
            slug: 'woman-pants',
            nama: 'Pants',
            judul: 'Women’s Pants',
            deskripsi:
              'Celana wanita custom dengan cutting yang dapat dikembangkan sesuai kebutuhan casual, corporate, hospitality, maupun fashion.',
            deskripsi2:
              'Pilihan material, bentuk kaki, waistband, detail kantong, dan finishing dapat disesuaikan berdasarkan desain.',
            sizeChartId: 'sc-07',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Women’s Pants',
            foto: `${CA}/WOMEN/WOMAN%20PANTS.webp`,
            ...P1,
          },
        ],
      },
      {
        slug: 'sportswear',
        nama: 'Sportswear',
        foto: `${CA}/SPORTSWEAR/Thumbnail.webp`,
        items: [
          {
            slug: 'running-jersey',
            nama: 'Running Jersey',
            judul: null,
            deskripsi:
              'Jersey running yang dirancang untuk mendukung aktivitas bergerak dengan konstruksi ringan dan nyaman digunakan selama berlari.',
            deskripsi2:
              'Desain full-print, warna, material, cutting, hingga detail identitas event atau komunitas dapat dikustomisasi.',
            sizeChartId: 'sc-08',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Running Jersey',
            foto: `${CA}/SPORTSWEAR/RUNNING%20JERSEY.webp`,
            ...P1,
          },
          {
            slug: 'futsal-jersey',
            nama: 'Futsal Jersey',
            judul: null,
            deskripsi:
              'Custom futsal jersey untuk tim, komunitas, kompetisi, maupun kebutuhan corporate sports.',
            deskripsi2:
              'Desain, nomor pemain, nama, logo sponsor, material, dan cutting dapat dikembangkan dalam satu identitas visual yang konsisten.',
            sizeChartId: 'sc-08',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Futsal Jersey',
            foto: `${CA}/SPORTSWEAR/FUTSAL%20JERSEY.webp`,
            ...P1,
          },
          {
            slug: 'jersey-basket',
            nama: 'Jersey Basket',
            judul: 'Basketball Jersey',
            deskripsi:
              'Basketball jersey dengan sleeveless construction yang memberikan ruang gerak lebih optimal saat bermain.',
            deskripsi2:
              'Warna, desain full-print, nomor, nama pemain, logo tim, dan detail lainnya dapat disesuaikan dengan identitas tim.',
            sizeChartId: 'sc-09',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Basketball Jersey',
            foto: `${CA}/SPORTSWEAR/JERSEY%20BASKET.webp`,
            ...P1,
          },
          {
            slug: 'padel-jersey',
            nama: 'Padel Jersey',
            judul: null,
            deskripsi:
              'Jersey padel dengan tampilan sporty dan modern untuk kebutuhan komunitas, tournament, club, maupun corporate event.',
            deskripsi2:
              'Material, cutting, desain, warna, serta aplikasi logo dapat disesuaikan untuk menghasilkan apparel yang nyaman sekaligus representatif.',
            sizeChartId: 'sc-08',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Padel Jersey',
            foto: `${CA}/SPORTSWEAR/PADEL%20JERSEY.webp`,
            ...P1,
          },
          {
            slug: 'jersey-golf',
            nama: 'Jersey Golf',
            judul: 'Golf Jersey',
            deskripsi:
              'Golf jersey yang menggabungkan tampilan clean dengan kebutuhan mobilitas selama beraktivitas.',
            deskripsi2:
              'Detail kerah, material, warna, cutting, serta branding dapat dikustomisasi untuk kebutuhan tournament, komunitas, maupun corporate golf event.',
            sizeChartId: 'sc-08',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Golf Jersey',
            foto: `${CA}/SPORTSWEAR/JERSEY%20GOLF.webp`,
            ...P1,
          },
          {
            slug: 'sleeveless-jersey',
            nama: 'Sleeveless Jersey',
            judul: null,
            deskripsi:
              'Sleeveless jersey untuk aktivitas olahraga dan training yang membutuhkan kebebasan gerak serta tampilan sporty.',
            deskripsi2:
              'Material, cutting, warna, desain full-print, serta detail branding dapat disesuaikan dengan kebutuhan.',
            sizeChartId: 'sc-09',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Sleeveless Jersey',
            foto: `${CA}/SPORTSWEAR/SLEEVELESS%20JERSEY.webp`,
            width: 1024,
            height: 1536,
          },
        ],
      },
      {
        slug: 'outerwear',
        nama: 'Outerwear',
        foto: `${CA}/OUTERWEAR/Thumbnail.webp`,
        items: [
          {
            slug: 'varsity',
            nama: 'Varsity',
            judul: 'Varsity Jacket',
            deskripsi:
              'Varsity jacket dengan karakter klasik dan structured look untuk komunitas, kampus, perusahaan, maupun merchandise brand.',
            deskripsi2:
              'Material badan dan lengan, kombinasi warna, rib, embroidery, patch, serta detail personalisasi dapat dikustomisasi.',
            sizeChartId: 'sc-03',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Varsity Jacket',
            foto: `${CA}/OUTERWEAR/VARSITY.webp`,
            ...P1,
          },
          {
            slug: 'hoodie',
            nama: 'Hoodie',
            judul: null,
            deskripsi:
              'Hoodie custom dengan tampilan versatile untuk kebutuhan merchandise, komunitas, perusahaan, kampus, maupun brand.',
            deskripsi2:
              'Material, cutting, warna, model hood, kantong, serta aplikasi printing atau embroidery dapat disesuaikan.',
            sizeChartId: 'sc-03',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Hoodie',
            foto: `${CA}/OUTERWEAR/hoodie.webp`,
            ...P1,
          },
          {
            slug: 'jaket-bomber',
            nama: 'Jaket Bomber',
            judul: 'Bomber Jacket',
            deskripsi:
              'Bomber jacket dengan silhouette clean dan structured untuk kebutuhan corporate, komunitas, event, maupun fashion merchandise.',
            deskripsi2:
              'Material, lining, rib, zipper, warna, serta aplikasi logo dapat disesuaikan berdasarkan fungsi dan konsep desain.',
            sizeChartId: 'sc-03',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Bomber Jacket',
            foto: `${CA}/OUTERWEAR/JAKET%20BOOMBER.webp`,
            ...P1,
          },
          {
            slug: 'coach-jacket',
            nama: 'Coach Jacket',
            judul: null,
            deskripsi:
              'Coach jacket dengan desain minimal dan ringan yang cocok untuk kebutuhan event, komunitas, corporate merchandise, maupun brand apparel.',
            deskripsi2:
              'Pilihan material, warna, lining, fastening, serta detail printing atau embroidery dapat disesuaikan.',
            sizeChartId: 'sc-03',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Coach Jacket',
            foto: `${CA}/OUTERWEAR/COACH%20JAKET.webp`,
            ...P1,
          },
          {
            slug: 'jaket-parasut',
            nama: 'Jaket Parasut',
            judul: null,
            deskripsi:
              'Jaket ringan berbahan synthetic outer fabric untuk kebutuhan outdoor, event, komunitas, maupun aktivitas operasional.',
            deskripsi2:
              'Material, lining, hood, zipper, warna, serta detail branding dapat dikembangkan sesuai kebutuhan penggunaan.',
            sizeChartId: 'sc-03',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Jaket Parasut',
            foto: `${CA}/OUTERWEAR/JAKET%20PARASUT.webp`,
            ...P1,
          },
        ],
      },
      {
        slug: 'uniform',
        nama: 'Uniform',
        foto: `${CA}/UNIFORM/Thumbnail.webp`,
        items: [
          {
            slug: 'workshirt',
            nama: 'Work Shirt',
            judul: null,
            deskripsi:
              'Kemeja kerja custom yang dirancang untuk memberikan tampilan profesional sekaligus mendukung kebutuhan aktivitas operasional.',
            deskripsi2:
              'Material, warna, jumlah kantong, detail reflektif, embroidery, serta konstruksi dapat disesuaikan dengan lingkungan kerja.',
            sizeChartId: 'sc-02',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Work Shirt',
            foto: `${CA}/UNIFORM/workshirt.webp`,
            ...P2,
          },
          {
            slug: 'uniform-polo-shirt',
            nama: 'Polo Shirt',
            judul: 'Polo Shirt Uniform',
            deskripsi:
              'Polo shirt untuk kebutuhan seragam perusahaan, retail, hospitality, event crew, maupun tim operasional.',
            deskripsi2:
              'Material, warna, detail kerah, serta aplikasi logo dapat disesuaikan agar tetap konsisten dengan identitas perusahaan.',
            sizeChartId: 'sc-01',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Polo Shirt Uniform',
            foto: `${CA}/UNIFORM/POLO%20SHIRT.webp`,
            ...P2,
          },
          {
            slug: 'security-uniform',
            nama: 'Security Uniform',
            judul: null,
            deskripsi:
              'Seragam keamanan yang dikembangkan untuk memberikan tampilan rapi, profesional, dan fungsional selama aktivitas kerja.',
            deskripsi2:
              'Material, warna, detail kantong, atribut, embroidery, serta konstruksi dapat disesuaikan berdasarkan kebutuhan institusi.',
            sizeChartId: 'sc-02',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Security Uniform',
            foto: `${CA}/UNIFORM/SECURITY%20UNIFORM.webp`,
            ...P2,
          },
          {
            slug: 'rompi',
            nama: 'Rompi',
            judul: 'Custom Vest',
            deskripsi:
              'Rompi custom untuk kebutuhan operasional, event crew, organisasi, komunitas, maupun aktivitas lapangan.',
            deskripsi2:
              'Material, jumlah kantong, zipper, reflective detail, warna, serta aplikasi logo dapat disesuaikan dengan fungsi penggunaannya.',
            sizeChartId: 'sc-10',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Rompi',
            foto: `${CA}/UNIFORM/rompi.webp`,
            ...P2,
          },
        ],
      },
    ],
  },

  {
    slug: 'running-package',
    nama: 'Running Package',
    ringkas: 'Jersey sampai medali lomba.',
    foto: `${B}/Running%20Package/THUMBNAIL%20RUNNING%20PACKAGE.webp`,
    sub: [
      {
        slug: 'komponen',
        nama: 'Komponen Racepack',
        foto: `${B}/Running%20Package/THUMBNAIL%20RUNNING%20PACKAGE.webp`,
        items: [
          {
            slug: 'jersey-running',
            nama: 'Jersey Running',
            judul: null,
            deskripsi:
              'Custom jersey untuk race event, fun run, running community, maupun corporate run.',
            deskripsi2:
              'Material ringan, desain full-print, warna, ukuran, serta identitas event dapat disesuaikan untuk memberikan pengalaman race yang lebih terintegrasi.',
            sizeChartId: 'sc-08',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Jersey Running',
            foto: `${B}/Running%20Package/JERSEY%20RUNNING.webp`,
            width: 1122,
            height: 1402,
          },
          {
            slug: 'medali-running',
            nama: 'Medali',
            judul: 'Custom Finisher Medal',
            deskripsi:
              'Medali custom yang dirancang untuk menjadi bagian dari identitas dan pengalaman sebuah race.',
            deskripsi2:
              'Bentuk, ukuran, finishing, warna, artwork, ribbon, serta detail branding dapat dikembangkan berdasarkan konsep event Anda.',
            sizeChartId: null,
            panduanJudul: 'Dimension Guide',
            panduanUkuran:
              'Ukuran medali mengikuti artwork dan spesifikasi yang telah disepakati sebelum produksi.',
            dimensi: 'Diameter 8 cm, ketebalan 4 mm, bobot 100 gr',
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Custom Medal',
            foto: `${B}/Running%20Package/MEDALI%20RUNNING.webp`,
            ...P2,
          },
          {
            slug: 'bib-running',
            nama: 'Bib Number',
            judul: 'BIB Number',
            deskripsi:
              'Custom race bib untuk identitas peserta dengan layout yang dapat disesuaikan berdasarkan kebutuhan event.',
            deskripsi2:
              'Nomor peserta, kategori, nama event, sponsor, QR code, maupun informasi tambahan dapat dimasukkan sesuai kebutuhan penyelenggara.',
            sizeChartId: null,
            panduanJudul: 'Dimension Guide',
            panduanUkuran: 'Ukuran BIB dapat disesuaikan dengan layout dan kebutuhan race.',
            dimensi: '21 × 15 cm',
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan BIB Number',
            foto: `${B}/Running%20Package/BIB%20RUNNING.webp`,
            ...P2,
          },
          {
            slug: 'string-bag-running',
            nama: 'String Bag',
            judul: null,
            deskripsi:
              'Tas ringan untuk racepack yang praktis digunakan sebagai packaging kebutuhan peserta maupun merchandise event.',
            deskripsi2:
              'Material, ukuran, warna, tali, serta desain printing dapat dikustomisasi mengikuti identitas event.',
            sizeChartId: null,
            panduanJudul: 'Dimension Guide',
            panduanUkuran: 'Ukuran dibuat sesuai kebutuhan kapasitas racepack.',
            dimensi: '30 × 40 cm',
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan String Bag',
            foto: `${B}/Running%20Package/STRING%20BAG%20RUNNING.webp`,
            ...P2,
          },
          {
            slug: 'totebag-running',
            nama: 'Totebag',
            judul: 'Custom Totebag',
            deskripsi:
              'Totebag custom untuk racepack, merchandise, event kit, maupun kebutuhan promosi.',
            deskripsi2:
              'Ukuran, material, warna, panjang handle, dan desain printing dapat disesuaikan dengan konsep event Anda.',
            sizeChartId: null,
            panduanJudul: 'Dimension Guide',
            panduanUkuran:
              'Ukuran dapat disesuaikan berdasarkan isi racepack atau kebutuhan project.',
            dimensi: '30 × 40 cm',
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Totebag',
            foto: `${B}/Running%20Package/TOTEBAG%20RUNNIG.webp`,
            width: 1055,
            height: 1491,
          },
          {
            slug: 'tumbler-running',
            nama: 'Tumbler',
            judul: 'Custom Tumbler',
            deskripsi:
              'Tumbler custom sebagai tambahan racepack maupun merchandise untuk meningkatkan value sebuah event.',
            deskripsi2:
              'Model, kapasitas, warna, serta aplikasi logo dapat dipilih berdasarkan konsep dan budget project.',
            sizeChartId: null,
            panduanJudul: 'Size Guide',
            panduanUkuran:
              'Ukuran ditentukan berdasarkan kapasitas (ml) serta model tumbler yang dipilih.',
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Tumbler',
            foto: `${B}/Running%20Package/TUMBLER%20RUNNING.webp`,
            ...P2,
          },
        ],
      },
    ],
  },

  {
    slug: 'campus-package',
    nama: 'Campus Package',
    ringkas: 'Perlengkapan acara kampus.',
    foto: `${B}/Campus%20Package/BAJU%20KAMPUS.webp`,
    sub: [
      {
        slug: 'komponen',
        nama: 'Komponen Campus Package',
        foto: `${B}/Campus%20Package/BAJU%20KAMPUS.webp`,
        items: [
          {
            slug: 'baju-kampus',
            nama: 'Baju Kampus',
            judul: null,
            deskripsi:
              'Custom apparel untuk kepanitiaan, organisasi mahasiswa, angkatan, seminar, festival, hingga berbagai kegiatan kampus.',
            deskripsi2:
              'Material, warna, desain, cutting, serta aplikasi logo dapat disesuaikan dengan identitas acara atau organisasi.',
            sizeChartId: 'sc-01',
            panduanJudul: null,
            panduanUkuran: null,
            dimensi: null,
            catatanUkuran:
              'Untuk model kemeja atau outerwear, size chart akan menyesuaikan jenis produk yang dipilih.',
            ctaLabel: 'Konsultasikan Baju Kampus',
            foto: `${B}/Campus%20Package/BAJU%20KAMPUS.webp`,
            width: 1055,
            height: 1491,
          },
          {
            slug: 'lanyard-kampus',
            nama: 'Lanyard Kampus',
            judul: null,
            deskripsi:
              'Lanyard custom untuk kebutuhan panitia, peserta, organisasi, maupun identitas kegiatan kampus.',
            deskripsi2:
              'Warna, artwork, logo, jenis kait, ukuran tali, serta ID card dapat disesuaikan dengan kebutuhan acara.',
            sizeChartId: null,
            panduanJudul: 'Dimension Guide',
            panduanUkuran: 'Spesifikasi mengikuti desain dan kebutuhan penggunaan.',
            dimensi: 'Lebar lanyard × panjang total',
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Lanyard Kampus',
            foto: `${B}/Campus%20Package/LANYARD%20KAMPUS.webp`,
            ...P2,
          },
          {
            slug: 'enamel-kampus',
            nama: 'Pin Enamel Kampus',
            judul: 'Pin Enamel Kampus',
            deskripsi:
              'Pin enamel custom sebagai merchandise, atribut organisasi, maupun memorabilia kegiatan kampus.',
            deskripsi2:
              'Bentuk, ukuran, warna, finishing, dan artwork dapat dikembangkan mengikuti identitas acara atau organisasi.',
            sizeChartId: null,
            panduanJudul: 'Dimension Guide',
            panduanUkuran: 'Ukuran mengikuti artwork.',
            dimensi: 'Width × Height',
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Pin Enamel',
            foto: `${B}/Campus%20Package/ENAMEL%20KAMPUS.webp`,
            ...P2,
          },
        ],
      },
    ],
  },

  {
    slug: 'merchandise',
    nama: 'Merchandise',
    ringkas: 'Suvenir dan merchandise acara.',
    foto: `${B}/Merchandise/GOODIE%20BAG.webp`,
    sub: [
      {
        slug: 'katalog',
        nama: 'Katalog Merchandise',
        foto: `${B}/Merchandise/GOODIE%20BAG.webp`,
        items: [
          {
            slug: 'goodie-bag',
            nama: 'Goodie Bag',
            judul: 'Custom Goodie Bag',
            deskripsi:
              'Goodie bag custom untuk event, seminar, corporate gift, campus event, maupun kebutuhan promosi.',
            deskripsi2:
              'Material, ukuran, warna, handle, gusset, serta desain printing dapat disesuaikan dengan kebutuhan isi dan identitas acara.',
            sizeChartId: null,
            panduanJudul: 'Dimension Guide',
            panduanUkuran: 'Ukuran dapat disesuaikan berdasarkan kapasitas dan isi goodie bag.',
            dimensi: 'Width × Height × Gusset',
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Goodie Bag',
            foto: `${B}/Merchandise/GOODIE%20BAG.webp`,
            width: 1055,
            height: 1491,
          },
          {
            slug: 'lanyard-panitia',
            nama: 'Lanyard Panitia',
            judul: null,
            deskripsi:
              'Custom lanyard untuk membantu identifikasi panitia, peserta, crew, maupun tamu dalam sebuah event.',
            deskripsi2:
              'Artwork, warna, logo, lebar tali, jenis kait, serta ID card dapat disesuaikan dengan sistem identitas acara.',
            sizeChartId: null,
            panduanJudul: 'Dimension Guide',
            panduanUkuran: null,
            dimensi: 'Lebar lanyard × panjang total',
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Lanyard Panitia',
            foto: `${B}/Merchandise/LANYARD%20PANITIA.webp`,
            width: 1055,
            height: 1491,
          },
          {
            slug: 'pin-enamel',
            nama: 'Pin Enamel',
            judul: 'Custom Enamel Pin',
            deskripsi:
              'Pin enamel custom untuk merchandise, komunitas, perusahaan, organisasi, maupun kebutuhan branding.',
            deskripsi2:
              'Artwork, bentuk, ukuran, warna enamel, plating, dan finishing dapat disesuaikan berdasarkan desain Anda.',
            sizeChartId: null,
            panduanJudul: 'Dimension Guide',
            panduanUkuran: 'Ukuran mengikuti bentuk artwork.',
            dimensi: 'Width × Height',
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Enamel Pin',
            foto: `${B}/Merchandise/PIN%20ENAMEL.webp`,
            width: 1254,
            height: 1254,
          },
          {
            slug: 'tumbler',
            nama: 'Tumbler',
            judul: 'Custom Tumbler',
            deskripsi:
              'Tumbler custom untuk corporate gift, merchandise, event kit, maupun kebutuhan promosi.',
            deskripsi2:
              'Model, kapasitas, material, warna, dan aplikasi branding dapat dipilih sesuai kebutuhan serta budget project.',
            sizeChartId: null,
            panduanJudul: 'Size Guide',
            panduanUkuran: 'Ukuran produk mengikuti model dan kapasitas tumbler (ml) yang dipilih.',
            dimensi: null,
            catatanUkuran: null,
            ctaLabel: 'Konsultasikan Tumbler',
            foto: `${B}/Merchandise/TUMBLER%20RUNNING.webp`,
            ...P2,
          },
        ],
      },
    ],
  },
];

/**
 * URL tujuan satu layanan — dipakai kartu homepage DAN mega menu navbar
 * (satu sumber, dua pemakai). Layanan 1-kelompok ditautkan langsung ke
 * daftar produknya (melompati halaman kelompok yang isinya cuma 1 kartu).
 */
export function layananHref(l: Layanan): string {
  return l.sub.length === 1 && l.sub[0]
    ? `/layanan/${l.slug}/${l.sub[0].slug}`
    : `/layanan/${l.slug}`;
}

export interface LayananQuickLink {
  label: string;
  href: string;
}

/**
 * Tautan "fast track" untuk mega menu navbar — REDESIGN 2026-08-30.
 * Layanan multi-kelompok (Custom Apparel) menampilkan nama kelompok
 * (Men/Women/dst). Layanan 1-kelompok menampilkan produknya langsung,
 * karena kelompoknya sudah dilompati oleh `layananHref`.
 */
export function layananQuickLinks(l: Layanan): LayananQuickLink[] {
  if (l.sub.length > 1) {
    return l.sub.map((s) => ({ label: s.nama, href: `/layanan/${l.slug}/${s.slug}` }));
  }
  const satuSatunya = l.sub[0];
  if (!satuSatunya) return [];
  return satuSatunya.items.map((it) => ({
    label: it.nama,
    href: `/layanan/${l.slug}/${satuSatunya.slug}/${it.slug}`,
  }));
}
