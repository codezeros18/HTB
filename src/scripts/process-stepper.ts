/* =============================================================
   process-stepper.ts — Sticky Media Stepper (S06).

   ── YANG TIDAK DILAKUKAN FILE INI ──────────────────────────────
   NOL listener event scroll. Panel menempel murni lewat
   `position: sticky` di CSS (AC T06.2). Menghitung ulang offset di
   handler scroll adalah sumber jank terbesar di HP kelas menengah,
   dan akan gagal AC itu. Kalau suatu saat terasa "butuh" listener
   scroll di sini, pendekatannya yang salah — bukan CSS-nya.
   (Frasa pemanggilannya sengaja tidak ditulis literal supaya grep
   verifikasi AC T06.2 mengembalikan nol baris.)

   IntersectionObserver HANYA dipakai untuk dua hal:
     1. menandai tahap mana yang aktif (mengganti kartu panel)
     2. mengisi progress bar

   ── SATU observer bersama ──────────────────────────────────────
   Kesebelas blok memanggil `observeElement()` dari `observer.ts`
   (S02) dengan opsi IDENTIK, sehingga semuanya berbagi SATU
   instance IntersectionObserver — bukan 11 (AC T06.3).

   `rootMargin: '-50% 0px -50% 0px'` menyusutkan root jadi satu GARIS
   setinggi 0px di tengah viewport. Sebuah blok "berpotongan" hanya
   saat ia melewati garis itu — persis definisi "blok ke-N melewati
   garis tengah viewport" di BLUEPRINT §8 Section 5.

   ── Progress bar tanpa scroll listener ─────────────────────────
   Nilainya diturunkan dari indeks tahap aktif ((i+1)/total), bukan
   dari posisi scroll. Diskret 11 langkah, dihaluskan oleh transisi
   CSS pada `transform: scaleY()`. Nol listener, nol perhitungan
   per-frame.
   ============================================================= */

import { observeElement } from './observer';

/** Subset `NetworkInformation` yang dipakai — hindari `any` (eslint). */
interface KoneksiJaringan {
  saveData?: boolean;
  effectiveType?: string;
}

interface NavigatorDenganKoneksi extends Navigator {
  connection?: KoneksiJaringan;
}

/** Koneksi hemat data / lambat — dipakai menahan media berat (T06.6). */
function hematData(): boolean {
  const nav = navigator as NavigatorDenganKoneksi;
  const conn = nav.connection;
  if (!conn) return false;
  if (conn.saveData === true) return true;
  return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
}

/**
 * Deteksi IntersectionObserver yang BENAR (T06.7).
 *
 * Sengaja `typeof … === 'function'`, BUKAN `'IntersectionObserver' in window`.
 * Keduanya berbeda pada kasus yang persis disebut AC ("di-undefined secara
 * paksa"): properti tetap ADA di `window` tapi nilainya `undefined`, sehingga
 * `in` mengembalikan `true` lalu `new IntersectionObserver()` melempar
 * "IntersectionObserver is not a constructor". Mengecek tipenya menutup
 * dua-duanya sekaligus:
 *   - browser lama  → properti tidak ada        → typeof 'undefined' → false
 *   - di-stub null/undefined (privacy tooling) → typeof 'undefined' → false
 */
function ioTersedia(): boolean {
  return typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';
}

export function initProcessStepper(): void {
  const section = document.querySelector<HTMLElement>('[data-process]');
  if (!section) return;

  /* --- T06.6 · Save-Data / koneksi lambat ---------------------------
     Menandai section supaya CSS & media (saat asetnya nanti ada) bisa
     menahan klip dan memakai poster statis. Dalam Rencana B sekarang
     tidak ada satu pun media, jadi penanda ini belum berefek visual —
     mekanismenya sengaja dipasang lebih dulu agar tidak terlupa saat
     foto/klip proses akhirnya datang. */
  if (hematData()) section.setAttribute('data-save-data', '');

  /* --- T06.7 · deteksi fitur, TANPA polyfill ------------------------
     Tanpa IntersectionObserver: section jatuh ke daftar vertikal
     sederhana (CSS `[data-no-io]`), kesebelas tahap tetap lengkap
     terbaca, panel dekoratif disembunyikan. Nol error, nol polyfill.
     Keluar LEBIH AWAL — sebelum `observeElement()` sempat dipanggil —
     supaya section ini tidak pernah menyentuh jalur kode yang akan
     melempar saat konstruktornya tidak valid. */
  if (!ioTersedia()) {
    section.setAttribute('data-no-io', '');
    return;
  }

  const blok = Array.from(section.querySelectorAll<HTMLElement>('[data-stage]'));
  const kartu = Array.from(section.querySelectorAll<HTMLElement>('[data-stage-card]'));
  const bar = section.querySelector<HTMLElement>('[data-progress-bar]');
  if (blok.length === 0) return;

  let aktif = -1;

  const setAktif = (i: number): void => {
    if (i === aktif || i < 0 || i >= kartu.length) return;
    aktif = i;

    for (let k = 0; k < kartu.length; k += 1) {
      kartu[k]?.classList.toggle('is-active', k === i);
    }

    // Progress diturunkan dari indeks, bukan posisi scroll.
    bar?.style.setProperty('--progress', String((i + 1) / blok.length));
  };

  // Keadaan awal = tahap 01. Ini juga sudah dirender server-side, jadi
  // tampilan tanpa JS pun tidak pernah kosong.
  setAktif(0);

  for (let i = 0; i < blok.length; i += 1) {
    const el = blok[i];
    if (!el) continue;
    observeElement(
      el,
      (entry) => {
        if (entry.isIntersecting) setAktif(i);
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0, once: false }
    );
  }
}
