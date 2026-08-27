/* =============================================================
   observer.ts — SATU IntersectionObserver dipakai bersama.

   Kenapa: tanpa ini tiap komponen membuat observer sendiri. Section
   proses saja punya 11 blok — 11 observer untuk pekerjaan yang sama
   (TASKS T02.8 & T06.3: "satu observer bersama, bukan 11").

   Cara kerja: observer di-cache per-kombinasi opsi (`rootMargin` +
   `threshold`). Seluruh pemanggil dengan opsi sama berbagi SATU
   instance. Callback disimpan di WeakMap per-elemen.

   Pemakaian:
     import { revealOnScroll, observeElement } from '@scripts/observer';
     revealOnScroll();                       // semua .mv-reveal
     observeElement(el, (e) => { … }, { threshold: 0.35 });

   Catatan degradasi: bila `IntersectionObserver` tidak ada, seluruh
   elemen langsung ditandai terlihat — konten TIDAK PERNAH tersembunyi
   karena fitur browser hilang (TASKS T06.7). Tanpa polyfill.
   ============================================================= */

export interface ObserveOptions {
  /** Margin root, format CSS. Default: '0px 0px -10% 0px'. */
  rootMargin?: string;
  /** Ambang perpotongan. Default: 0.15. */
  threshold?: number | number[];
  /** Berhenti mengamati setelah callback pertama yang terpicu. Default: true. */
  once?: boolean;
}

type EntryHandler = (entry: IntersectionObserverEntry) => void;

interface Registration {
  handler: EntryHandler;
  once: boolean;
}

const DEFAULT_ROOT_MARGIN = '0px 0px -10% 0px';
const DEFAULT_THRESHOLD = 0.15;

/** Satu observer per signature opsi — inti dari "observer bersama". */
const observers = new Map<string, IntersectionObserver>();
const registry = new WeakMap<Element, Registration>();

/**
 * Deteksi dukungan IntersectionObserver.
 *
 * Sengaja `typeof … === 'function'`, BUKAN `'IntersectionObserver' in window`.
 * Perbedaannya nyata dan sempat jadi bug: kalau propertinya ADA tapi bernilai
 * `undefined` (di-stub privacy tooling, atau di-undefined paksa saat pengujian
 * — persis kondisi AC T06.7), `in` mengembalikan `true`, `supported()` lolos,
 * lalu `new IntersectionObserver()` melempar "is not a constructor" dan
 * MENGGAGALKAN seluruh skrip pemanggil — termasuk `revealOnScroll()` di
 * BaseLayout dan sentinel Navbar.
 *
 * Mengecek tipenya menutup kedua kasus sekaligus:
 *   - browser lama            → properti tidak ada → typeof 'undefined' → false
 *   - di-stub undefined/null  → typeof 'undefined' → false
 *
 * Ditemukan & diperbaiki saat S06 (lihat PROGRESS.md T06.7).
 */
function supported(): boolean {
  return typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';
}

function signature(rootMargin: string, threshold: number | number[]): string {
  const t = Array.isArray(threshold) ? threshold.join(',') : String(threshold);
  return `${rootMargin}|${t}`;
}

function handleEntries(entries: IntersectionObserverEntry[], obs: IntersectionObserver): void {
  for (const entry of entries) {
    const reg = registry.get(entry.target);
    if (!reg) continue;
    reg.handler(entry);
    if (reg.once && entry.isIntersecting) {
      obs.unobserve(entry.target);
      registry.delete(entry.target);
    }
  }
}

function getObserver(rootMargin: string, threshold: number | number[]): IntersectionObserver {
  const key = signature(rootMargin, threshold);
  const existing = observers.get(key);
  if (existing) return existing;

  const created = new IntersectionObserver(handleEntries, { rootMargin, threshold });
  observers.set(key, created);
  return created;
}

/**
 * Amati satu elemen. Pemanggil dengan opsi identik berbagi observer yang sama.
 * Bila IntersectionObserver tidak tersedia, `handler` dipanggil sekali dengan
 * entry sintetis yang `isIntersecting: true` supaya konten tetap tampil.
 */
export function observeElement(
  el: Element,
  handler: EntryHandler,
  options: ObserveOptions = {}
): void {
  const { rootMargin = DEFAULT_ROOT_MARGIN, threshold = DEFAULT_THRESHOLD, once = true } = options;

  if (!supported()) {
    handler({
      target: el,
      isIntersecting: true,
      intersectionRatio: 1,
    } as IntersectionObserverEntry);
    return;
  }

  registry.set(el, { handler, once });
  getObserver(rootMargin, threshold).observe(el);
}

/** Berhenti mengamati satu elemen di seluruh observer yang aktif. */
export function unobserveElement(el: Element): void {
  registry.delete(el);
  for (const obs of observers.values()) obs.unobserve(el);
}

/**
 * Pasang animasi masuk-layar pada elemen ber-kelas `.mv-reveal`.
 * Idempoten — elemen yang sudah ditandai dilewati, jadi aman dipanggil
 * ulang setelah konten baru dirender (mis. "lihat 4 produk lainnya").
 *
 * Menambahkan kelas `js` di <html> supaya CSS tahu JavaScript aktif:
 * tanpa itu `.mv-reveal` TIDAK disembunyikan sama sekali (lihat global.css).
 */
export function revealOnScroll(scope: ParentNode = document): void {
  document.documentElement.classList.add('js');

  const targets = scope.querySelectorAll<HTMLElement>('.mv-reveal:not([data-reveal-bound])');

  targets.forEach((el, i) => {
    el.dataset.revealBound = '';

    // Stagger deklaratif untuk anak langsung .mv-reveal-group.
    const parent = el.parentElement;
    if (parent?.classList.contains('mv-reveal-group')) {
      el.style.setProperty('--reveal-index', String(i));
    }

    observeElement(
      el,
      (entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      },
      { once: true }
    );
  });
}

/** Hanya untuk pengujian/HMR: buang seluruh observer yang di-cache. */
export function resetObservers(): void {
  for (const obs of observers.values()) obs.disconnect();
  observers.clear();
}
