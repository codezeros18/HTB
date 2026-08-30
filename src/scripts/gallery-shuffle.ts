/* =============================================================
   gallery-shuffle.ts — Gallery bento (S-GALLERY, REDESIGN 2026-08-30).

   1. Saat load: acak penempatan foto ke 9 sel (Fisher-Yates).
   2. Bila pengguna TIDAK minta reduced-motion: tiap ~4,5 detik satu sel
      dipilih acak dan fotonya diganti dengan crossfade pendek.

   Tanpa JS: sel tampil apa adanya, tanpa acak. Reduced-motion: hanya
   acak sekali di awal, tanpa rotasi berkala.
   ============================================================= */

interface Foto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

function acak<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = out[i]!;
    const b = out[j]!;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

function setFoto(cell: HTMLElement, foto: Foto): void {
  const img = cell.querySelector('img');
  if (!img) return;
  if (img.getAttribute('src') === foto.src) return;
  img.style.opacity = '0';
  window.setTimeout(() => {
    img.setAttribute('src', foto.src);
    img.setAttribute('alt', foto.alt);
    // width/height ikut diganti supaya rasio intrinsik tetap benar (anti-CLS).
    img.setAttribute('width', String(foto.width));
    img.setAttribute('height', String(foto.height));
    img.style.opacity = '1';
  }, 200);
}

export function initGalleryShuffle(): void {
  const grid = document.querySelector<HTMLElement>('[data-gallery]');
  if (!grid) return;

  const cells = Array.from(grid.querySelectorAll<HTMLElement>('[data-gallery-cell]'));
  if (cells.length === 0) return;

  let pool: Foto[] = [];
  try {
    const raw = grid.dataset.galleryPool;
    if (raw) pool = JSON.parse(raw) as Foto[];
  } catch {
    pool = [];
  }
  if (pool.length === 0) return;

  // 1. Acak awal.
  const awal = acak(pool);
  cells.forEach((cell, i) => setFoto(cell, awal[i % awal.length]!));

  // 2. Rotasi berkala — hanya bila gerak diizinkan.
  const bolehGerak = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!bolehGerak || pool.length < 2) return;

  window.setInterval(() => {
    const cell = cells[Math.floor(Math.random() * cells.length)];
    if (!cell) return;
    const kini = cell.querySelector('img')?.getAttribute('src');
    const kandidat = pool.filter((f) => f.src !== kini);
    const pilih = kandidat[Math.floor(Math.random() * kandidat.length)];
    if (pilih) setFoto(cell, pilih);
  }, 4500);
}
