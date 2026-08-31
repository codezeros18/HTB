/* =============================================================
   map-facade.ts — Peta facade → Leaflet HANYA setelah diklik.
   REDESIGN 2026-08-31 (permintaan klien: peta interaktif sungguhan,
   bukan iframe Google Maps statis).

   Kenapa Leaflet, bukan MapLibre GL: MapLibre ≈200 KB gzip sendirian
   sudah melewati batas keras JS 80 KB (CLAUDE.md), bahkan kalau
   di-lazy-load. Leaflet ≈42 KB gzip pas untuk kebutuhan "3 pin lokasi".

   Cara kerja (facade pattern tetap dipertahankan, AC T08.2): setiap
   kartu lokasi merender SVG statis (nol request) + tombol "Tampilkan
   peta". Leaflet (JS+CSS dari cdnjs) & tile CARTO gelap baru diminta
   SETELAH diklik — nol request pihak ketiga sebelum interaksi
   (guardrail 6). `leafletPromise` di-cache supaya 3 kartu berbagi SATU
   unduhan Leaflet, bukan tiga.
   ============================================================= */

const LEAFLET_VERSION = '1.9.4';
const LEAFLET_CSS = `https://cdnjs.cloudflare.com/ajax/libs/leaflet/${LEAFLET_VERSION}/leaflet.min.css`;
const LEAFLET_JS = `https://cdnjs.cloudflare.com/ajax/libs/leaflet/${LEAFLET_VERSION}/leaflet.min.js`;

// CARTO Dark Matter — gratis, nol API key, cocok tema gelap situs.
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> ' +
  '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';

/** Subset API Leaflet yang benar-benar dipakai — nol `any` (guardrail proyek). */
interface LeafletMap {
  invalidateSize(): void;
}
interface LeafletMarker {
  addTo(map: LeafletMap): LeafletMarker;
  bindPopup(html: string): LeafletMarker;
}
interface LeafletTileLayer {
  addTo(map: LeafletMap): LeafletTileLayer;
}
interface LeafletStatic {
  map(el: HTMLElement, opts: Record<string, unknown>): LeafletMap;
  tileLayer(url: string, opts: Record<string, unknown>): LeafletTileLayer;
  marker(latlng: [number, number], opts: Record<string, unknown>): LeafletMarker;
  divIcon(opts: Record<string, unknown>): unknown;
}

declare global {
  interface Window {
    L?: LeafletStatic;
  }
}

let leafletPromise: Promise<LeafletStatic> | null = null;

function loadLeaflet(): Promise<LeafletStatic> {
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => {
      if (window.L) resolve(window.L);
      else reject(new Error('Leaflet gagal dimuat'));
    };
    script.onerror = () => reject(new Error('Leaflet gagal dimuat'));
    document.head.appendChild(script);
  });

  return leafletPromise;
}

function bukaPeta(wrapper: HTMLElement, tombol: HTMLButtonElement): void {
  const lat = Number(wrapper.dataset.lat);
  const lng = Number(wrapper.dataset.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  const labelAsal = tombol.textContent ?? '';
  tombol.disabled = true;
  tombol.textContent = 'Memuat…';

  loadLeaflet()
    .then((L) => {
      const holder = document.createElement('div');
      holder.className = 'mv-loc__leaflet';
      wrapper.replaceChildren(holder);

      const map = L.map(holder, {
        center: [lat, lng],
        zoom: 15,
        // Nol scroll-jacking: peta tidak mencuri scroll halaman (§6.7/§7.8).
        scrollWheelZoom: false,
      });

      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const pin = L.divIcon({
        className: 'mv-loc__pin',
        html: '<span></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 20],
      });

      const judul = wrapper.dataset.title ?? '';
      const alamat = wrapper.dataset.address ?? '';
      const mapsUrl = wrapper.dataset.mapsUrl;
      const tautan = mapsUrl
        ? `<br><a href="${mapsUrl}" target="_blank" rel="noopener">Rute di Google Maps →</a>`
        : '';

      L.marker([lat, lng], { icon: pin, title: judul, alt: judul })
        .addTo(map)
        .bindPopup(`<strong>${judul}</strong><br>${alamat}${tautan}`);

      // Container baru diberi ukuran oleh layout SETELAH init — paksa
      // Leaflet menghitung ulang supaya tile tidak terpotong/kosong.
      window.setTimeout(() => map.invalidateSize(), 80);

      wrapper.closest<HTMLElement>('.mv-loc')?.setAttribute('data-map-live', '');
    })
    .catch(() => {
      tombol.disabled = false;
      tombol.textContent = labelAsal;
    });
}

export function initMapFacade(): void {
  const pemicu = document.querySelectorAll<HTMLButtonElement>('[data-map-facade-trigger]');

  pemicu.forEach((tombol) => {
    tombol.addEventListener(
      'click',
      () => {
        const wrapper = tombol.closest<HTMLElement>('[data-map-facade]');
        if (!wrapper) return;
        bukaPeta(wrapper, tombol);
      },
      { once: true }
    );
  });
}
