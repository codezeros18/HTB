/* =============================================================
   hero-scroll.ts — perilaku scroll khusus hero HOMEPAGE.
   Dipanggil dari Hero.astro (komponen hanya ada di beranda).

   Permintaan klien (2026-09-06):
   - Isyarat scroll TURUN dari puncak → satu lompatan "smooth tapi
     sat set" melewati hero ke section berikutnya.
   - Isyarat scroll NAIK dari puncak section "Tentang Kami" → lompatan
     halus yang sama, balik ke hero.
   Hanya wheel + keyboard (desktop). Sentuhan dibiarkan scroll native —
   hijack scroll di touch selalu terasa patah.

   Chevron isyarat di hero memudar begitu `.mv-hero[data-scrolled]`
   ditandai (dan muncul lagi kalau balik ke puncak).

   Reduced motion: NOL hijack, NOL tween — cuma sinkron penanda cue.
   ============================================================= */

function reducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function tweenScrollTo(targetY: number, durationMs: number, onDone?: () => void): void {
  const startY = window.scrollY;
  const dist = targetY - startY;
  if (Math.abs(dist) < 2) {
    onDone?.();
    return;
  }
  const start = performance.now();

  const step = (now: number): void => {
    const p = Math.min(1, (now - start) / durationMs);
    window.scrollTo(0, Math.round(startY + dist * easeOutCubic(p)));
    if (p < 1) requestAnimationFrame(step);
    else onDone?.();
  };
  requestAnimationFrame(step);
}

export function initHeroScroll(): void {
  const hero = document.querySelector<HTMLElement>('.mv-hero');
  if (!hero) return;

  const atTop = (): boolean => window.scrollY <= 4;
  const syncCue = (): void => {
    hero.toggleAttribute('data-scrolled', !atTop());
  };
  // Batas bawah hero dalam koordinat dokumen (= puncak "Tentang Kami").
  const heroBottomY = (): number =>
    Math.max(0, Math.round(hero.getBoundingClientRect().bottom + window.scrollY - 1));

  // Reduced motion: tidak ada hijack, cuma jaga chevron sinkron.
  if (reducedMotion()) {
    syncCue();
    window.addEventListener('scroll', syncCue, { passive: true });
    return;
  }

  const DOWN_KEYS = ['ArrowDown', 'PageDown', ' ', 'Spacebar'];
  const UP_KEYS = ['ArrowUp', 'PageUp', 'Home'];
  // Selagi di zona ini (px di bawah hero), wheel non-passive tetap terpasang.
  const ZONE_SLACK = 140;
  const TWEEN_MS = 480;

  let busy = false;

  const jumpTo = (y: number): void => {
    if (busy) return;
    busy = true;
    tweenScrollTo(y, TWEEN_MS, () => {
      busy = false;
    });
  };

  // Arah niat scroll di posisi sekarang → target lompatan, atau null.
  const targetFor = (dir: 'up' | 'down'): number | null => {
    const y = window.scrollY;
    const hb = heroBottomY();
    if (dir === 'down' && y <= 4) return hb; // puncak → lewati hero
    if (dir === 'up' && y > 4 && y <= hb + 4) return 0; // puncak Tentang Kami → balik ke hero
    return null;
  };

  const onWheel = (e: WheelEvent): void => {
    if (busy) {
      e.preventDefault();
      return;
    }
    if (e.deltaY === 0) return;
    const target = targetFor(e.deltaY > 0 ? 'down' : 'up');
    if (target !== null) {
      e.preventDefault();
      jumpTo(target);
    }
  };

  const onKey = (e: KeyboardEvent): void => {
    if (busy) return;
    let dir: 'up' | 'down' | null = null;
    if (DOWN_KEYS.includes(e.key)) dir = 'down';
    else if (UP_KEYS.includes(e.key)) dir = 'up';
    if (!dir) return;
    const target = targetFor(dir);
    if (target !== null) {
      e.preventDefault();
      jumpTo(target);
    }
  };

  let bound = false;
  const bind = (): void => {
    if (bound) return;
    bound = true;
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
  };
  const unbind = (): void => {
    if (!bound) return;
    bound = false;
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKey);
  };

  const onScroll = (): void => {
    syncCue();
    // Wheel non-passive HANYA di ~1 layar pertama halaman — di luar itu
    // dilepas supaya scroll sisa halaman tetap ringan (INP).
    if (window.scrollY <= heroBottomY() + ZONE_SLACK) bind();
    else unbind();
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
