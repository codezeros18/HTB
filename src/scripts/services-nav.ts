/* =============================================================
   services-nav.ts — drill-down "Our Services" (S-SERVICES, REDESIGN
   2026-08-30).

   Menukar tampilan di dalam SATU section:
     tingkat 0 (grid 5 kartu) → panel sub-kategori → panel item → detail

   - Klik `[data-svc-open="<key>"]` → sembunyikan tampilan sekarang,
     tampilkan `[data-svc-panel="<key>"]`, dorong key ke tumpukan.
   - Klik `[data-svc-back]` → pop tumpukan, tampilkan tampilan sebelumnya.
   - `key` = "layanan" | "layanan/sub" | "layanan/sub/item".
     `''` (string kosong) = tingkat 0.

   Tanpa JS: seluruh panel ditumpuk terbuka lewat <noscript> di komponen —
   skrip ini tidak pernah jalan, semua info & CTA tetap terjangkau.
   ============================================================= */

export function initServicesNav(): void {
  const root = document.querySelector<HTMLElement>('[data-svc]');
  if (!root) return;

  const level0 = root.querySelector<HTMLElement>('[data-svc-level="0"]');
  if (!level0) return;

  const panels = new Map<string, HTMLElement>();
  root.querySelectorAll<HTMLElement>('[data-svc-panel]').forEach((el) => {
    const key = el.dataset.svcPanel;
    if (key) panels.set(key, el);
  });

  /** Tumpukan tampilan. Elemen paling belakang = yang sedang tampil. */
  const stack: string[] = [''];

  const tampilkan = (key: string): void => {
    level0.hidden = key !== '';
    for (const [k, el] of panels) el.hidden = k !== key;

    // Fokus ke judul/kembali panel baru supaya pembaca layar & keyboard
    // tidak "tersesat" setelah tampilan berganti.
    if (key !== '') {
      const panel = panels.get(key);
      const fokusTarget =
        panel?.querySelector<HTMLElement>('[data-svc-back]') ??
        panel?.querySelector<HTMLElement>('h1, h2, h3');
      fokusTarget?.setAttribute('tabindex', '-1');
      fokusTarget?.focus({ preventScroll: true });
    }
  };

  const buka = (key: string): void => {
    if (!panels.has(key)) return;
    stack.push(key);
    tampilkan(key);
  };

  const kembali = (): void => {
    if (stack.length <= 1) return;
    stack.pop();
    tampilkan(stack[stack.length - 1] ?? '');
  };

  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const opener = target.closest<HTMLElement>('[data-svc-open]');
    if (opener && root.contains(opener)) {
      const key = opener.dataset.svcOpen;
      if (key) buka(key);
      return;
    }

    const back = target.closest<HTMLElement>('[data-svc-back]');
    if (back && root.contains(back)) kembali();
  });
}
