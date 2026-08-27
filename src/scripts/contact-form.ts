/* =============================================================
   contact-form.ts — 4 state form Contact (S08): idle → validating
   (saat blur) → submitting → sukses / gagal.

   ── Honeypot, bukan CAPTCHA ─────────────────────────────────────
   Field `[data-honeypot]` disembunyikan lewat CSS (bukan `display:
   none` — sebagian bot melewati elemen itu), TIDAK terjangkau Tab
   (`tabindex="-1"`), dan `aria-hidden`. Terisi → dianggap bot,
   dijatuhkan diam-diam ke state sukses TANPA memanggil Web3Forms.

   ── Kegagalan form ≠ prospek hilang ─────────────────────────────
   State gagal TIDAK menyembunyikan form (data pengguna tetap ada
   untuk dicoba lagi) dan SELALU menampilkan tombol WhatsApp sebagai
   jalan keluar (AC T08.6).

   ── Kunci Web3Forms [GAP] ───────────────────────────────────────
   Selama input hidden `access_key` tidak ada di markup
   (site.kontak.web3formsAccessKey masih `null` — akun klien belum
   ada), submit tidak pernah memanggil `api.web3forms.com`; langsung
   jatuh ke state gagal. Nol permintaan dengan kredensial palsu
   (guardrail 1).
   ============================================================= */

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  // TS tidak menyimpan narrowing non-null di dalam function declaration
  // bertingkat (hoisting) — nested function di bawah memakai ini.
  const formEl = form;

  const submitBtn = form.querySelector<HTMLButtonElement>('[data-submit]');
  const gagalBlok = form.querySelector<HTMLElement>('[data-gagal]');
  const suksesBlok = document.querySelector<HTMLElement>('[data-sukses]');
  const honeypot = form.querySelector<HTMLInputElement>('[data-honeypot]');
  const fields = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-field]')
  );

  const labelAsal = submitBtn?.textContent ?? '';
  const labelKirim = submitBtn?.dataset.labelKirim ?? labelAsal;
  const labelKirimkan = submitBtn?.dataset.labelMengirim ?? 'MENGIRIM…';
  const pesanWajib = form.dataset.pesanWajib ?? 'Wajib diisi.';

  function errorElOf(field: HTMLElement): HTMLElement | null {
    const id = field.getAttribute('aria-describedby');
    return id ? document.getElementById(id) : null;
  }

  function tampilkanError(field: HTMLElement): void {
    field.setAttribute('aria-invalid', 'true');
    const err = errorElOf(field);
    if (err) {
      err.textContent = pesanWajib;
      err.hidden = false;
    }
  }

  function bersihkanError(field: HTMLElement): void {
    field.removeAttribute('aria-invalid');
    const err = errorElOf(field);
    if (err) err.hidden = true;
  }

  function validasiField(field: HTMLInputElement | HTMLSelectElement): boolean {
    if (!field.required) return true;
    const kosong = field.value.trim() === '';
    if (kosong) {
      tampilkanError(field);
      return false;
    }
    bersihkanError(field);
    return true;
  }

  // Validasi saat blur — BUKAN saat mengetik (AC T08.6).
  fields.forEach((f) => f.addEventListener('blur', () => validasiField(f)));

  function tampilkanSukses(): void {
    // `form` tidak otomatis dianggap non-null oleh TS di dalam function
    // declaration bertingkat (hoisting) — akses via variabel lokal ini.
    formEl.hidden = true;
    if (suksesBlok) {
      suksesBlok.hidden = false;
      suksesBlok.setAttribute('tabindex', '-1');
      suksesBlok.focus();
    }
  }

  function tampilkanGagal(): void {
    if (gagalBlok) {
      gagalBlok.hidden = false;
      gagalBlok.setAttribute('tabindex', '-1');
      gagalBlok.focus();
    }
  }

  function resetTombol(): void {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.textContent = labelKirim;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (gagalBlok) gagalBlok.hidden = true;

    const semuaValid = fields.map(validasiField).every(Boolean);
    if (!semuaValid) {
      fields.find((f) => f.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }

    // Honeypot terisi → bot. Dijatuhkan diam-diam, nol panggilan Web3Forms.
    if (honeypot && honeypot.value.trim() !== '') {
      tampilkanSukses();
      return;
    }

    // Kunci Web3Forms dikirim sebagai <input type="hidden" name="access_key">
    // di markup (bukan rahasia — kunci itu memang didesain publik/client-side
    // oleh Web3Forms). Elemennya hanya ada kalau site.kontak.web3formsAccessKey
    // sudah terisi.
    const accessKey = form.querySelector<HTMLInputElement>('input[name="access_key"]')?.value;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = labelKirimkan;
    }

    if (!accessKey) {
      tampilkanGagal();
      resetTombol();
      return;
    }

    const data = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
    })
      .then((res) => res.json())
      .then((json: { success?: boolean }) => {
        if (json.success) tampilkanSukses();
        else tampilkanGagal();
      })
      .catch(() => tampilkanGagal())
      .finally(resetTombol);
  });
}
