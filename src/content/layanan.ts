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
  nama: string;
  deskripsi: string;
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
    foto: `${CA}/MEN/Thumbnail.png`,
    sub: [
      {
        slug: 'men',
        nama: 'Men',
        foto: `${CA}/MEN/Thumbnail.png`,
        items: [
          {
            slug: 'custom-menswear',
            nama: 'Custom Menswear',
            deskripsi:
              'Pakaian pria yang dirancang sesuai kebutuhan — potongan, warna, dan detail mengikuti permintaan.',
            foto: `${CA}/MEN/CUSTOM%20MENSWEAR.png`,
            width: 1024,
            height: 1536,
          },
          {
            slug: 'men-crewneck',
            nama: 'Crewneck',
            deskripsi:
              'Atasan berkerah bulat tanpa kancing, potongan santai untuk pemakaian harian.',
            foto: `${CA}/MEN/MAN%20CREWNECK.png`,
            ...P1,
          },
          {
            slug: 'men-henley',
            nama: 'Henley',
            deskripsi: 'Kaos berkerah tanpa kelim dengan deretan kancing pendek di bagian dada.',
            foto: `${CA}/MEN/MEN%20HENLEY.png`,
            ...P1,
          },
          {
            slug: 'men-shirt',
            nama: 'Shirt',
            deskripsi: 'Kemeja pria berkancing penuh untuk kebutuhan formal maupun kasual.',
            foto: `${CA}/MEN/MEN%20SHIRT.png`,
            ...P1,
          },
          {
            slug: 'men-polo-shirt',
            nama: 'Polo Shirt',
            deskripsi: 'Kaos berkerah dengan placket kancing — tampilan rapi namun tetap santai.',
            foto: `${CA}/MEN/MEN%20POLO%20SHIRT.png`,
            ...P1,
          },
          {
            slug: 'men-pants',
            nama: 'Pants',
            deskripsi: 'Celana panjang pria, potongan dan bahan menyesuaikan kebutuhan.',
            foto: `${CA}/MEN/MEN%20PANTS.png`,
            ...P1,
          },
        ],
      },
      {
        slug: 'women',
        nama: 'Women',
        foto: `${CA}/WOMEN/Thumbnail.png`,
        items: [
          {
            slug: 'custom-womenswear',
            nama: 'Custom Womenswear',
            deskripsi:
              'Pakaian wanita yang dirancang sesuai kebutuhan — potongan, warna, dan detail mengikuti permintaan.',
            foto: `${CA}/WOMEN/CUSTOM%20WOMENSWEAR.png`,
            ...P2,
          },
          {
            slug: 'woman-dress',
            nama: 'Dress',
            deskripsi: 'Terusan wanita dengan pilihan panjang dan siluet menyesuaikan acara.',
            foto: `${CA}/WOMEN/WOMAN%20DRESS.png`,
            ...P1,
          },
          {
            slug: 'woman-shirt',
            nama: 'Shirt',
            deskripsi: 'Kemeja wanita berkancing, cocok untuk seragam kerja maupun acara resmi.',
            foto: `${CA}/WOMEN/WOMAN%20SHIRT.png`,
            ...P1,
          },
          {
            slug: 'woman-t-shirt',
            nama: 'T-Shirt',
            deskripsi: 'Kaos wanita dengan potongan yang mengikuti bentuk badan.',
            foto: `${CA}/WOMEN/WOMAN%20T-SHIRT.png`,
            ...P1,
          },
          {
            slug: 'woman-pants',
            nama: 'Pants',
            deskripsi: 'Celana panjang wanita, potongan dan bahan menyesuaikan kebutuhan.',
            foto: `${CA}/WOMEN/WOMAN%20PANTS.png`,
            ...P1,
          },
        ],
      },
      {
        slug: 'sportswear',
        nama: 'Sportswear',
        foto: `${CA}/SPORTSWEAR/Thumbnail.png`,
        items: [
          {
            slug: 'running-jersey',
            nama: 'Running Jersey',
            deskripsi: 'Jersey lari berbahan penyerap keringat, ringan untuk jarak jauh.',
            foto: `${CA}/SPORTSWEAR/RUNNING%20JERSEY.png`,
            ...P1,
          },
          {
            slug: 'futsal-jersey',
            nama: 'Futsal Jersey',
            deskripsi: 'Jersey futsal fullprint dengan nomor dan nama punggung.',
            foto: `${CA}/SPORTSWEAR/FUTSAL%20JERSEY.png`,
            ...P1,
          },
          {
            slug: 'jersey-basket',
            nama: 'Jersey Basket',
            deskripsi: 'Jersey basket dengan potongan longgar dan sirkulasi udara baik.',
            foto: `${CA}/SPORTSWEAR/JERSEY%20BASKET.png`,
            ...P1,
          },
          {
            slug: 'padel-jersey',
            nama: 'Padel Jersey',
            deskripsi: 'Jersey padel dengan potongan yang menunjang gerak lengan.',
            foto: `${CA}/SPORTSWEAR/PADEL%20JERSEY.png`,
            ...P1,
          },
          {
            slug: 'jersey-golf',
            nama: 'Jersey Golf',
            deskripsi: 'Kaos golf berkerah, rapi untuk lapangan maupun klub.',
            foto: `${CA}/SPORTSWEAR/JERSEY%20GOLF.png`,
            ...P1,
          },
          {
            slug: 'sleeveless-jersey',
            nama: 'Sleeveless Jersey',
            deskripsi: 'Jersey tanpa lengan untuk latihan dan olahraga bersuhu panas.',
            foto: `${CA}/SPORTSWEAR/SLEEVELESS%20JERSEY.png`,
            width: 1024,
            height: 1536,
          },
        ],
      },
      {
        slug: 'outerwear',
        nama: 'Outerwear',
        foto: `${CA}/OUTERWEAR/Thumbnail.png`,
        items: [
          {
            slug: 'varsity',
            nama: 'Varsity',
            deskripsi: 'Jaket varsity dengan kombinasi bahan badan dan lengan, khas angkatan.',
            foto: `${CA}/OUTERWEAR/VARSITY.png`,
            ...P1,
          },
          {
            slug: 'hoodie',
            nama: 'Hoodie',
            deskripsi: 'Atasan berpenutup kepala, hangat untuk pemakaian sehari-hari.',
            foto: `${CA}/OUTERWEAR/hoodie.png`,
            ...P1,
          },
          {
            slug: 'jaket-bomber',
            nama: 'Jaket Bomber',
            deskripsi: 'Jaket potongan pendek dengan karet di pinggang dan pergelangan.',
            foto: `${CA}/OUTERWEAR/JAKET%20BOOMBER.png`,
            ...P1,
          },
          {
            slug: 'coach-jacket',
            nama: 'Coach Jacket',
            deskripsi: 'Jaket berkancing depan dengan potongan lurus, ringan dipakai.',
            foto: `${CA}/OUTERWEAR/COACH%20JAKET.png`,
            ...P1,
          },
          {
            slug: 'jaket-parasut',
            nama: 'Jaket Parasut',
            deskripsi:
              'Jaket berbahan parasut — ringan dan menahan angin untuk aktivitas luar ruang.',
            foto: `${CA}/OUTERWEAR/JAKET%20PARASUT.png`,
            ...P1,
          },
        ],
      },
      {
        slug: 'uniform',
        nama: 'Uniform',
        foto: `${CA}/UNIFORM/Thumbnail.png`,
        items: [
          {
            slug: 'workshirt',
            nama: 'Work Shirt',
            deskripsi: 'Kemeja kerja berbahan drill — berstruktur namun nyaman dipakai harian.',
            foto: `${CA}/UNIFORM/workshirt.png`,
            ...P2,
          },
          {
            slug: 'uniform-polo-shirt',
            nama: 'Polo Shirt',
            deskripsi: 'Polo seragam untuk instansi, kantor, dan tim acara.',
            foto: `${CA}/UNIFORM/POLO%20SHIRT.png`,
            ...P2,
          },
          {
            slug: 'security-uniform',
            nama: 'Security Uniform',
            deskripsi: 'Seragam petugas keamanan lengkap dengan atribut sesuai kebutuhan.',
            foto: `${CA}/UNIFORM/SECURITY%20UNIFORM.png`,
            ...P2,
          },
          {
            slug: 'rompi',
            nama: 'Rompi',
            deskripsi: 'Rompi luar untuk seragam lapangan, panitia acara, atau identitas tim.',
            foto: `${CA}/UNIFORM/rompi.png`,
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
    foto: `${B}/Running%20Package/THUMBNAIL%20RUNNING%20PACKAGE.png`,
    sub: [
      {
        slug: 'komponen',
        nama: 'Komponen Racepack',
        foto: `${B}/Running%20Package/THUMBNAIL%20RUNNING%20PACKAGE.png`,
        items: [
          {
            slug: 'jersey-running',
            nama: 'Jersey Running',
            deskripsi: 'Jersey lari berbahan sintetis yang menyerap dan menguapkan keringat.',
            foto: `${B}/Running%20Package/JERSEY%20RUNNING.png`,
            width: 1122,
            height: 1402,
          },
          {
            slug: 'medali-running',
            nama: 'Medali',
            deskripsi: 'Medali finisher berbahan zinc alloy, desain mengikuti tema acara.',
            foto: `${B}/Running%20Package/MEDALI%20RUNNING.png`,
            ...P2,
          },
          {
            slug: 'bib-running',
            nama: 'Bib Number',
            deskripsi: 'Nomor peserta berbahan Tyvek yang tahan robek dan tahan air.',
            foto: `${B}/Running%20Package/BIB%20RUNNING.png`,
            ...P2,
          },
          {
            slug: 'string-bag-running',
            nama: 'String Bag',
            deskripsi: 'Tas serut untuk perlengkapan peserta, ringan dibawa saat lomba.',
            foto: `${B}/Running%20Package/STRING%20BAG%20RUNNING.png`,
            ...P2,
          },
          {
            slug: 'totebag-running',
            nama: 'Totebag',
            deskripsi: 'Tas jinjing kain untuk paket peserta maupun suvenir acara.',
            foto: `${B}/Running%20Package/TOTEBAG%20RUNNIG.png`,
            width: 1055,
            height: 1491,
          },
          {
            slug: 'tumbler-running',
            nama: 'Tumbler',
            deskripsi: 'Botol minum dengan cetak logo acara, dapat dipakai ulang peserta.',
            foto: `${B}/Running%20Package/TUMBLER%20RUNNING.png`,
            ...P2,
          },
        ],
      },
    ],
  },

  {
    slug: 'campus-package',
    nama: 'Campus Package',
    ringkas: 'Paket perlengkapan acara dan kepanitiaan kampus.',
    foto: `${B}/Campus%20Package/BAJU%20KAMPUS.png`,
    sub: [
      {
        slug: 'komponen',
        nama: 'Komponen Campus Package',
        foto: `${B}/Campus%20Package/BAJU%20KAMPUS.png`,
        items: [
          {
            slug: 'baju-kampus',
            nama: 'Baju Kampus',
            deskripsi:
              'Kaos atau kemeja acara kampus dengan identitas angkatan maupun kepanitiaan.',
            foto: `${B}/Campus%20Package/BAJU%20KAMPUS.png`,
            width: 1055,
            height: 1491,
          },
          {
            slug: 'lanyard-kampus',
            nama: 'Lanyard Kampus',
            deskripsi: 'Tali lanyard cetak penuh lengkap dengan tanda pengenal panitia.',
            foto: `${B}/Campus%20Package/LANYARD%20KAMPUS.png`,
            ...P2,
          },
          {
            slug: 'enamel-kampus',
            nama: 'Pin Enamel Kampus',
            deskripsi: 'Pin enamel sebagai suvenir atau tanda pengenal acara kampus.',
            foto: `${B}/Campus%20Package/ENAMEL%20KAMPUS.png`,
            ...P2,
          },
        ],
      },
    ],
  },

  {
    slug: 'merchandise',
    nama: 'Merchandise',
    ringkas: 'Suvenir dan perlengkapan pendukung acara.',
    foto: `${B}/Merchandise/GOODIE%20BAG.png`,
    sub: [
      {
        slug: 'katalog',
        nama: 'Katalog Merchandise',
        foto: `${B}/Merchandise/GOODIE%20BAG.png`,
        items: [
          {
            slug: 'goodie-bag',
            nama: 'Goodie Bag',
            deskripsi: 'Tas suvenir acara yang dapat dicetak sesuai identitas penyelenggara.',
            foto: `${B}/Merchandise/GOODIE%20BAG.png`,
            width: 1055,
            height: 1491,
          },
          {
            slug: 'lanyard-panitia',
            nama: 'Lanyard Panitia',
            deskripsi: 'Tali lanyard panitia dengan cetak penuh dan tanda pengenal.',
            foto: `${B}/Merchandise/LANYARD%20PANITIA.png`,
            width: 1055,
            height: 1491,
          },
          {
            slug: 'pin-enamel',
            nama: 'Pin Enamel',
            deskripsi: 'Pin enamel logam sebagai suvenir, penghargaan, atau tanda pengenal.',
            foto: `${B}/Merchandise/PIN%20ENAMEL.png`,
            width: 1254,
            height: 1254,
          },
          {
            slug: 'tumbler',
            nama: 'Tumbler',
            deskripsi: 'Botol minum cetak logo, suvenir yang dipakai berulang.',
            foto: `${B}/Merchandise/TUMBLER%20RUNNING.png`,
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
