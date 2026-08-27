/* =============================================================
   map-facade.ts — Peta facade → iframe HANYA setelah diklik (S08).

   Kenapa: satu iframe Google Maps eager ≈ 700KB–1.2MB dan puluhan
   request pihak ketiga yang memasang cookie SEBELUM pengunjung
   berinteraksi (guardrail proyek 6, AC T08.2). Tiga lokasi × iframe
   eager akan menghancurkan performance budget.

   Cara kerja: setiap kartu lokasi merender SVG statis (nol request,
   inline di markup) + tombol "Tampilkan peta". `<iframe>` baru dibuat
   lewat DOM SETELAH klik, dan `src`-nya baru di-set saat itu juga —
   jadi browser tidak pernah menaruh permintaan ke domain google
   sebelum momen itu. `{ once: true }` mencegah iframe dibuat dobel.
   ============================================================= */

export function initMapFacade(): void {
  const pemicu = document.querySelectorAll<HTMLButtonElement>('[data-map-facade-trigger]');

  pemicu.forEach((tombol) => {
    tombol.addEventListener(
      'click',
      () => {
        const wrapper = tombol.closest<HTMLElement>('[data-map-facade]');
        const src = wrapper?.dataset.embedSrc;
        if (!wrapper || !src) return;

        const iframe = document.createElement('iframe');
        iframe.loading = 'lazy';
        iframe.title = wrapper.dataset.title ?? 'Peta lokasi';
        iframe.className = 'mv-location-card__peta-iframe';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        // src di-set TERAKHIR — baris di atas tidak memicu permintaan apa pun.
        iframe.src = src;

        wrapper.replaceChildren(iframe);
      },
      { once: true }
    );
  });
}
