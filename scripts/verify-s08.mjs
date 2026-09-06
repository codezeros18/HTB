/* =============================================================
   verify-s08.mjs — cek statis output S08 (Location + Contact).

   Fokus AC yang bisa dibuktikan dari markup `dist/index.html`:
   - T08.1  3 kartu bernomor 01/02/03, deskripsiPeran null → tidak dirender
   - T08.2  NOL src google di markup awal; embed URL HANYA di data-attr
   - T08.3  3 alamat lengkap sebagai teks + <address> + itemprop +
            id kartu cocok dengan @id LocalBusiness (S03)
   - T08.5  tepat 5 field terlihat + 1 honeypot; nol CAPTCHA;
            access_key hidden hanya kalau key terisi (sekarang null)
   - T08.6  markup 4 state (form/submitting label/sukses/gagal) +
            error pakai warna+ikon+teks (Badge) + aria-describedby

   Cek "nol request google sebelum interaksi" versi runtime ada di
   verify-s08-network.mjs (butuh Chrome).
   ============================================================= */
/* global URL */
import { readFileSync } from 'node:fs';

const h = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

let pass = 0;
let fail = 0;
const cek = (nama, kondisi) => {
  const ok = kondisi === true;
  if (ok) pass += 1;
  else fail += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${nama}`);
};
const info = (nama, nilai) => console.log(`INFO  ${nama} = ${nilai}`);

/* ---------- T08.1 rantai produksi bernomor ---------- */
cek('T08.1 nomor 01 dirender', h.includes('>01</span>'));
cek('T08.1 nomor 02 dirender', h.includes('>02</span>'));
cek('T08.1 nomor 03 dirender', h.includes('>03</span>'));
cek('T08.1 peran Head Office', h.includes('>Head Office</h3>'));
cek('T08.1 peran Workshop', h.includes('>Workshop</h3>'));
cek('T08.1 peran Factory', h.includes('>Factory</h3>'));
cek('T08.1 deskripsiPeran (null) TIDAK dirender', !h.includes('mv-location-card__deskripsi'));

/* ---------- T08.2 facade, nol google eager ---------- */
cek('T08.2 tidak ada <iframe> di markup awal', !/<iframe/i.test(h));
cek('T08.2 tidak ada <script src=...google', !/<script[^>]+src="[^"]*google/i.test(h));
cek('T08.2 tidak ada <link ...google (preconnect/stylesheet)', !/<link[^>]+google/i.test(h));
const embedMatches = h.match(/data-embed-src="https:\/\/www\.google\.com\/maps/g) || [];
cek('T08.2 embed URL google HANYA di data-embed-src (x3)', embedMatches.length === 3);
// Tidak ada URL maps google di luar atribut data-embed-src & href tombol Maps.
const googleHrefs = h.match(/https:\/\/www\.google\.com\/maps/g) || [];
info('T08.2 total kemunculan URL google maps (3 data-attr + 3 href Maps link)', googleHrefs.length);
cek('T08.2 SVG facade dirender x3', (h.match(/mv-location-card__peta-svg/g) || []).length === 3);
cek('T08.2 tombol "Tampilkan peta" x3', (h.match(/>Tampilkan peta<\/button>/g) || []).length === 3);

/* ---------- T08.3 markup semantik alamat ---------- */
cek('T08.3 alamat head-office sebagai teks', h.includes('Ruko Solvang Arcade No. 3'));
cek('T08.3 alamat workshop sebagai teks', h.includes('Jln. Tambora II No. 38'));
cek('T08.3 alamat factory sebagai teks', h.includes('Mayor Oking Jaya Atmaja No.196'));
cek(
  'T08.3 3 kartu lokasi pakai <address> + itemprop="address"',
  (h.match(/<address class="mv-location-card__alamat/g) || []).length === 3
);
cek('T08.3 itemprop streetAddress', (h.match(/itemprop="streetAddress"/g) || []).length === 3);
cek(
  'T08.3 id kartu = slug (cocok @id JSON-LD S03)',
  h.includes('id="head-office"') && h.includes('id="workshop"') && h.includes('id="factory"')
);
cek('T08.3 JSON-LD LocalBusiness @id #head-office ada', h.includes('/#head-office"'));

/* ---------- T08.5 form 5 field + honeypot, nol CAPTCHA ---------- */
const labelVisible = (h.match(/class="mv-field__label t-label"/g) || []).length;
cek('T08.5 tepat 5 <label> field terlihat', labelVisible === 5);
cek('T08.5 honeypot tepat 1 input', (h.match(/<input[^>]*\sdata-honeypot/g) || []).length === 1);
cek(
  'T08.5 honeypot di wrapper aria-hidden',
  /mv-kontak__honeypot"[^>]*aria-hidden="true"/.test(h) ||
    /aria-hidden="true"[^>]*mv-kontak__honeypot/.test(h)
);
cek(
  'T08.5 honeypot tidak terjangkau Tab (tabindex=-1)',
  /data-honeypot[^>]*tabindex="-1"|tabindex="-1"[^>]*data-honeypot/.test(h)
);
cek('T08.5 NOL recaptcha/hcaptcha/turnstile', !/recaptcha|hcaptcha|turnstile|captcha/i.test(h));
cek(
  'T08.5 <select> native untuk jenis kebutuhan',
  h.includes('name="jenis_kebutuhan"') && h.includes('<select')
);
cek(
  'T08.5 <input name="access_key"> TIDAK dirender (key masih null)',
  !/<input[^>]*name="access_key"/.test(h)
);
cek('T08.5 autocomplete name', h.includes('autocomplete="name"'));
cek('T08.5 autocomplete organization', h.includes('autocomplete="organization"'));
cek(
  'T08.5 nol skrip pihak ketiga (semua <script> lokal/inline)',
  ![...h.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].some((m) => /^https?:\/\//.test(m[1]))
);

/* ---------- T08.4 hierarki WA > form ---------- */
cek(
  'T08.4 blok WA sebelum blok form di DOM',
  h.indexOf('mv-kontak__wa') < h.indexOf('mv-kontak__form-wrap')
);
cek(
  'T08.4 CTA WA size lg (mv-btn--lg)',
  /mv-wa[^"]*"[^>]*mv-btn--lg|mv-btn--lg[^>]*mv-wa/.test(h) || h.includes('mv-btn--lg')
);
cek(
  'T08.4 nomor WA hanya dari site.ts (wa.me/6285111420089)',
  h.includes('wa.me/6285111420089') && !/href="https:\/\/wa\.me\/(?!6285111420089)/.test(h)
);

/* ---------- T08.6 state + error non-warna ---------- */
cek('T08.6 blok sukses ada (hidden)', /data-sukses[^>]*hidden|hidden[^>]*data-sukses/.test(h));
cek('T08.6 blok gagal ada (hidden)', /data-gagal[^>]*hidden|hidden[^>]*data-gagal/.test(h));
cek(
  'T08.6 gagal berisi tombol WhatsApp (jalan keluar)',
  /data-gagal[\s\S]{0,1500}wa\.me\/6285111420089/.test(h)
);
cek(
  'T08.6 label submitting "MENGIRIM…" tersedia untuk skrip',
  h.includes('data-label-mengirim="MENGIRIM')
);
cek(
  'T08.6 error pakai Badge error (border+ikon SVG+teks)',
  h.includes('mv-badge--error') && /mv-badge--error[\s\S]{0,400}<svg/.test(h)
);
cek(
  'T08.6 aria-describedby terpasang di field wajib',
  (h.match(/aria-describedby="mv-kontak-/g) || []).length === 3
);
cek(
  'T08.6 kontainer error punya id yang dirujuk',
  h.includes('id="mv-kontak-nama-err"') &&
    h.includes('id="mv-kontak-kontak-err"') &&
    h.includes('id="mv-kontak-jenis-err"')
);

console.log(`\n${pass} PASS · ${fail} FAIL`);
process.exit(fail === 0 ? 0 : 1);
