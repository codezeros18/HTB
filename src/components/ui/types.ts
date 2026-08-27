/* =============================================================
   types.ts — tipe publik komponen UI (S02).
   Diimpor lintas sprint: `import type { … } from '@components/ui/types'`.
   Menambah anggota union diperbolehkan; MENGUBAH nama wajib dicatat
   di PROGRESS.md (aturan paralel CLAUDE.md).
   ============================================================= */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

export type BadgeVariant = 'netral' | 'aksen' | 'sukses' | 'error' | 'garis';

/** Rasio bingkai media — sesuai aturan aset CLAUDE.md / BLUEPRINT §6.8. */
export type RasioMedia = '4/5' | '16/9' | '3/2' | '1/1';

/** Satu tab pada komponen `Tab`. `id` juga dipakai sebagai deep-link hash. */
export interface TabItem {
  id: string;
  label: string;
}

/**
 * Satu baris data pada komponen `Table`.
 * `header` dirender sebagai `<th scope="row">` (kolom pertama, sticky di mobile).
 * `sel` bernilai `null` untuk sel yang datanya belum ada — dirender kosong,
 * bukan diisi tebakan atau tanda hubung menggantung (guardrail 1).
 */
export interface TableRow {
  header: string;
  sel: (string | number | null)[];
}
