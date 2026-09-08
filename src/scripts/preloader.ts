/* =============================================================
   preloader.ts — mengendalikan layar muat (lihat Preloader.astro).

   Progres dihitung dari aset yang BENAR-BENAR menghalangi tampilan
   pertama: gambar TANPA `loading="lazy"`. Gambar lazy sengaja diabaikan —
   browser memang belum memintanya, jadi memasukkannya ke hitungan akan
   membuat progres macet di angka kecil sampai batas waktu.

   Nilai yang ditampilkan dianimasikan MENDEKATI target (bukan melompat)
   supaya terasa halus, dan ditahan di bawah 100% sampai `window.load`
   benar-benar terjadi — jadi angkanya jujur, bukan animasi palsu.
   ============================================================= */

/** Batas keras. Apa pun yang terjadi, overlay dibuang setelah ini. */
const MAKS_MS = 4000;
/** Tampil minimal segini supaya tidak "berkedip" di koneksi cepat. */
const MIN_MS = 250;
/** Keliling lingkaran r=25 di Preloader.astro. Harus sinkron. */
const KELILING = 157.08;

export function initPreloader(): void {
  const overlay = document.querySelector<HTMLElement>('[data-preloader]');
  if (!overlay) return;

  const arc = overlay.querySelector<SVGCircleElement>('[data-preloader-arc]');
  const label = overlay.querySelector<HTMLElement>('[data-preloader-persen]');

  const mulai = performance.now();
  const akar = document.documentElement;
  akar.setAttribute('data-memuat', '');

  let tampil = 0;
  let selesai = false;
  let rafId = 0;
  let timerId = 0;

  /** Rasio aset kritis yang sudah tuntas (0–1). */
  const rasioAset = (): number => {
    const kritis = Array.from(document.images).filter((img) => img.loading !== 'lazy');
    if (kritis.length === 0) return 1;
    const tuntas = kritis.filter((img) => img.complete).length;
    return tuntas / kritis.length;
  };

  /* Overlay dilepas begitu yang KELIHATAN sudah siap, bukan menunggu
     `window.load` penuh. Diukur: menunggu `load` menahan LCP di 2524 ms
     (batas keras CLAUDE.md 2500 ms) karena elemen LCP — foto hero — baru
     "terlihat" browser setelah overlay hilang. Aset kritis = gambar
     non-lazy; begitu semuanya tuntas dan DOM tidak lagi 'loading',
     halaman memang sudah layak ditampilkan. `window.load` tetap dipasang
     sebagai jaring pengaman kalau daftar aset kritis kosong/aneh. */
  let dimuat = document.readyState === 'complete';
  const tandaiDimuat = (): void => {
    dimuat = true;
  };
  if (!dimuat) window.addEventListener('load', tandaiDimuat, { once: true });

  const siapTampil = (): boolean =>
    dimuat || (document.readyState !== 'loading' && rasioAset() >= 1);

  const gambar = (nilai: number): void => {
    if (arc) arc.style.strokeDashoffset = String(KELILING * (1 - nilai));
    if (label) label.textContent = String(Math.round(nilai * 100));
  };

  const bereskan = (): void => {
    if (selesai) return;
    selesai = true;
    cancelAnimationFrame(rafId);
    window.clearTimeout(timerId);
    gambar(1);
    akar.removeAttribute('data-memuat');
    overlay.setAttribute('data-selesai', '');

    // Sembunyikan permanen setelah transisi supaya elemen tidak lagi
    // ikut hit-testing / paint. Durasi diambil dari --dur-slow, bukan
    // angka ajaib, dan `transitionend` tidak dipakai sendirian karena
    // tidak pernah menyala saat prefers-reduced-motion.
    window.setTimeout(() => overlay.setAttribute('hidden', ''), 320);
  };

  const langkah = (): void => {
    const lewat = performance.now() - mulai;

    // Target jujur: 10% begitu skrip jalan, sisanya dari aset kritis,
    // ditahan maksimum 92% sampai `load` benar-benar terjadi.
    const target = siapTampil() ? 1 : Math.min(0.92, 0.1 + 0.82 * rasioAset());

    // Dekati target ~22% per frame — halus tapi tidak menahan LCP.
    tampil += (target - tampil) * 0.22;
    if (target - tampil < 0.005) tampil = target;
    gambar(tampil);

    if (siapTampil() && tampil >= 0.999 && lewat >= MIN_MS) {
      bereskan();
      return;
    }
    rafId = requestAnimationFrame(langkah);
  };

  timerId = window.setTimeout(bereskan, MAKS_MS);
  rafId = requestAnimationFrame(langkah);
}
