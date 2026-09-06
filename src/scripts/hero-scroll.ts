/* =============================================================
   hero-scroll.ts — perilaku scroll khusus hero HOMEPAGE.
   Dipanggil dari Hero.astro (komponen hanya ada di beranda).

   Dua hal (permintaan klien 2026-09-06):
   1. Isyarat scroll PERTAMA dari puncak halaman → satu gerakan
      "smooth tapi sat set" melewati hero ke section berikutnya.
      Hanya untuk wheel + keyboard (desktop). Sentuhan dibiarkan
      scroll native — hijack scroll di touch selalu terasa patah.
   2. Menandai `.mv-hero[data-scrolled]` begitu halaman digeser
      sedikit → isyarat chevron di hero memudar (CSS).

   Reduced motion: NOL hijack, NOL tween — cuma menandai data-scrolled
   supaya chevron hilang. Scroll sepenuhnya native.
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

function tweenScrollTo(targetY: number, durationMs: number): void {
  const startY = window.scrollY;
  const dist = targetY - startY;
  if (Math.abs(dist) < 2) return;
  const start = performance.now();

  const step = (now: number): void => {
    const p = Math.min(1, (now - start) / durationMs);
    window.scrollTo(0, Math.round(startY + dist * easeOutCubic(p)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initHeroScroll(): void {
  const hero = document.querySelector<HTMLElement>('.mv-hero');
  if (!hero) return;

  const markScrolled = (): void => hero.setAttribute('data-scrolled', '');
  const atTop = (): boolean => window.scrollY <= 4;

  // Sudah tidak di puncak saat load (mis. restore scroll / buka #anchor):
  // tidak ada isyarat pertama untuk di-hijack.
  if (!atTop()) {
    markScrolled();
    return;
  }

  if (reducedMotion()) {
    const onScroll = (): void => {
      if (!atTop()) {
        markScrolled();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return;
  }

  const heroBottomY = (): number =>
    Math.max(0, Math.round(hero.getBoundingClientRect().bottom + window.scrollY - 1));

  let armed = true;
  const cleanups: Array<() => void> = [];

  const disarm = (): void => {
    if (!armed) return;
    armed = false;
    for (const fn of cleanups) fn();
    cleanups.length = 0;
  };

  const trigger = (): void => {
    disarm();
    markScrolled();
    tweenScrollTo(heroBottomY(), 480);
  };

  const onWheel = (e: WheelEvent): void => {
    if (!atTop()) {
      disarm();
      return;
    }
    if (e.deltaY > 0) {
      e.preventDefault();
      trigger();
    }
  };

  const onKey = (e: KeyboardEvent): void => {
    if (!atTop()) {
      disarm();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      trigger();
    }
  };

  const onScrollAny = (): void => {
    if (!atTop()) {
      markScrolled();
      disarm();
    }
  };

  // `wheel` non-passive HANYA selagi di puncak — dilepas begitu isyarat
  // pertama lewat / user scroll dengan cara lain. Dampak INP minim.
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('scroll', onScrollAny, { passive: true });
  cleanups.push(
    () => window.removeEventListener('wheel', onWheel),
    () => window.removeEventListener('keydown', onKey),
    () => window.removeEventListener('scroll', onScrollAny)
  );
}
