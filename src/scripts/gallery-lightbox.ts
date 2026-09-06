/* =============================================================
   gallery-lightbox.ts — kolase Gallery: klik foto → lightbox di TENGAH
   layar yang membesar mendekat (REDESIGN 2026-09-06, permintaan klien).

   Menggantikan `gallery-shuffle.ts`: rotasi otomatis dibuang karena
   bertabrakan dengan hover & klik (foto bisa berganti tepat saat
   kursor di atasnya).

   Kolase hanya menampilkan 9 slot, tapi lightbox bisa digeser ke
   SELURUH foto di `galeri.ts` lewat tombol panah / ← → / Esc.

   <dialog> + showModal(): focus trap, Esc, dan inert latar ditangani
   browser. Animasi membesar-ke-tengah ada di CSS (@starting-style).
   ============================================================= */

interface Foto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function initGalleryLightbox(): void {
  const stage = document.querySelector<HTMLElement>('[data-gallery]');
  const box = document.querySelector<HTMLDialogElement>('[data-gallery-box]');
  const gambar = document.querySelector<HTMLImageElement>('[data-gallery-box-img]');
  if (!stage || !box || !gambar) return;

  let daftar: Foto[] = [];
  try {
    daftar = JSON.parse(stage.dataset.galleryPool ?? '[]') as Foto[];
  } catch {
    daftar = [];
  }
  if (daftar.length === 0) return;

  let indeks = 0;
  let pemicu: HTMLElement | null = null;

  const tampilkan = (i: number): void => {
    indeks = (i + daftar.length) % daftar.length;
    const f = daftar[indeks];
    if (!f) return;
    gambar.src = f.src;
    gambar.alt = f.alt;
    gambar.width = f.width;
    gambar.height = f.height;
  };

  const buka = (i: number, dari: HTMLElement): void => {
    pemicu = dari;
    tampilkan(i);
    if (!box.open) box.showModal();
  };

  stage.querySelectorAll<HTMLElement>('[data-gallery-item]').forEach((el) => {
    el.addEventListener('click', () => {
      const i = Number(el.dataset.galleryItem);
      buka(Number.isFinite(i) ? i : 0, el);
    });
  });

  box.querySelector('[data-gallery-close]')?.addEventListener('click', () => box.close());
  box.querySelector('[data-gallery-prev]')?.addEventListener('click', () => tampilkan(indeks - 1));
  box.querySelector('[data-gallery-next]')?.addEventListener('click', () => tampilkan(indeks + 1));

  // Klik area kosong (backdrop) menutup — target-nya <dialog> itu sendiri.
  box.addEventListener('click', (e) => {
    if (e.target === box) box.close();
  });

  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      tampilkan(indeks - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      tampilkan(indeks + 1);
    }
  });

  // Kembalikan fokus ke foto yang diklik (Esc/backdrop/tombol tutup).
  box.addEventListener('close', () => {
    pemicu?.focus();
    pemicu = null;
  });
}
