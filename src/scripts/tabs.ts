/* =============================================================
   tabs.ts — interaktivitas khusus section Our Services (S05).

   Dua hal di sini TIDAK ditangani oleh `ui/Tab.astro` (S02, dipakai
   apa adanya untuk 3 tab level atas):

   1. Tombol "Lihat 4 produk lainnya" — ungkap 4 kartu Apparel yang
      disembunyikan lewat atribut `hidden`. Bukan disclosure ARIA
      standar (bukan accordion/tab), jadi diimplementasikan sebagai
      tombol biasa + `aria-expanded` + `hidden`. Mengungkap/menyembunyikan
      dipicu klik pengguna — Web Vitals CLS mengecualikan pergeseran
      layout dalam 500ms setelah input pengguna, jadi ini TIDAK memicu
      skor CLS (AC T05.2 "tanpa memicu layout shift").

   2. Selector panduan ukuran — `<select>` NATIVE (bukan custom
      dropdown) yang menukar satu panel tabel ukuran pada satu waktu.
      Panel non-aktif disembunyikan lewat `hidden`, bukan dihapus dari
      DOM, supaya tetap terindeks mesin cari.

   Degradasi tanpa JS: tombol "lihat lainnya" tidak berfungsi (4 kartu
   tetap tersembunyi) dan `<select>` hanya menampilkan panel pertama
   (opsi default) — keduanya bukan bagian dari daftar "wajib bekerja
   tanpa JS" (itu milik Accordion & Table, native by design). CTA
   WhatsApp di setiap kartu tetap berfungsi penuh tanpa JS sama sekali.
   ============================================================= */

export function initShowMore(): void {
  const tombol = document.querySelector<HTMLButtonElement>('[data-show-more]');
  if (!tombol) return;

  const targetId = tombol.getAttribute('aria-controls');
  const target = targetId ? document.getElementById(targetId) : null;
  // Label diupdate lewat <span data-show-more-label> di DALAM tombol —
  // BUKAN tombol.textContent, karena ui/Button (S02, dipakai apa adanya)
  // membungkus slot-nya dengan <span class="mv-btn__label">. Menimpa
  // textContent tombol akan menghapus wrapper itu beserta styling-nya.
  const labelEl = tombol.querySelector<HTMLElement>('[data-show-more-label]');
  if (!target || !labelEl) return;

  const labelBuka = tombol.dataset.labelBuka ?? labelEl.textContent ?? '';
  const labelTutup = tombol.dataset.labelTutup ?? labelBuka;

  tombol.addEventListener('click', () => {
    const terbuka = tombol.getAttribute('aria-expanded') === 'true';
    const berikutnya = !terbuka;
    tombol.setAttribute('aria-expanded', String(berikutnya));
    target.hidden = !berikutnya;
    labelEl.textContent = berikutnya ? labelTutup : labelBuka;
  });
}

export function initSizeChartSelector(): void {
  const select = document.querySelector<HTMLSelectElement>('[data-chart-select]');
  if (!select) return;

  const panels = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-chart-panel]').forEach((el) => {
    const id = el.dataset.chartId;
    if (id) panels.set(id, el);
  });

  const tampilkan = (id: string): void => {
    for (const [panelId, el] of panels) {
      el.hidden = panelId !== id;
    }
  };

  select.addEventListener('change', () => tampilkan(select.value));
  // Sinkronkan begitu skrip berjalan — melindungi dari kasus browser
  // mengingat pilihan <select> terakhir setelah reload (bfcache).
  tampilkan(select.value);
}
