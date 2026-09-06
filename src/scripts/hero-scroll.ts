/* =============================================================
   hero-scroll.ts — HANYA memudarkan chevron isyarat scroll di hero.
   Dipanggil dari Hero.astro (komponen cuma ada di beranda).

   CATATAN 2026-09-06: hijack scroll (wheel + preventDefault + tween
   "lompat melewati hero" / "balik ke hero") DIBUANG — selalu terasa
   kaku, lawan-lawanan dengan scroll native, dan momentum trackpad
   memicu lompatan arah yang salah. Scroll sekarang 100% native.

   Yang tersisa: satu listener `scroll` PASIF (nol preventDefault, nol
   rAF, nol jank) yang menandai `.mv-hero[data-scrolled]` supaya chevron
   memudar begitu halaman digeser, dan muncul lagi saat balik ke puncak.
   ============================================================= */

export function initHeroScroll(): void {
  const hero = document.querySelector<HTMLElement>('.mv-hero');
  if (!hero) return;

  const sync = (): void => {
    hero.toggleAttribute('data-scrolled', window.scrollY > 4);
  };

  sync();
  window.addEventListener('scroll', sync, { passive: true });
}
