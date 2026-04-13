const mapStatus = document.getElementById('mapStatus');

function getLang() {
  const queryLang = new URLSearchParams(window.location.search).get('lang');
  return queryLang || window.siteI18n?.getSiteLanguage?.() || 'vi';
}

function tr(key) {
  return window.siteI18n?.translate?.(key, getLang()) ?? key;
}

function setMapStatus(message, isWarning = false) {
  if (!mapStatus) {
    return;
  }

  mapStatus.textContent = message;
  mapStatus.classList.toggle('warning', isWarning);
}

function getFocusLocationId() {
  const value = new URLSearchParams(window.location.search).get('locationId');
  return value ? value.trim().toLowerCase() : '';
}

function buildOfflineStyle() {
  // True offline vector rendering requires a complete style.json (with source-layer mappings).
  return '/assets/vector-tiles/vinh-khanh/style.json';
}

function buildOnlineRasterFallbackStyle() {
  return {
    version: 8,
    name: 'online-osm-fallback',
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'osm-base',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  };
}

function renderFallbackCanvas(locations) {
  const host = document.getElementById('vinhKhanhMap');
  if (!host) {
    return;
  }

  const points = locations
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));

  if (!points.length) {
    host.innerHTML = '<div style="padding:1rem;color:#616161">Không có dữ liệu tọa độ để hiển thị fallback.</div>';
    return;
  }

  const minLng = Math.min(...points.map((x) => x.longitude));
  const maxLng = Math.max(...points.map((x) => x.longitude));
  const minLat = Math.min(...points.map((x) => x.latitude));
  const maxLat = Math.max(...points.map((x) => x.latitude));

  const width = 1200;
  const height = 520;
  const padding = 48;

  const mapX = (lng) => {
    const ratio = (lng - minLng) / Math.max(0.000001, maxLng - minLng);
    return padding + ratio * (width - padding * 2);
  };

  const mapY = (lat) => {
    const ratio = (lat - minLat) / Math.max(0.000001, maxLat - minLat);
    return height - padding - ratio * (height - padding * 2);
  };

  const ordered = [...points].sort((a, b) => a.longitude - b.longitude);
  const pathData = ordered.map((item, index) => `${index === 0 ? 'M' : 'L'} ${mapX(item.longitude)} ${mapY(item.latitude)}`).join(' ');

  host.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" role="img" aria-label="Fallback map">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#fff7ed"/>
          <stop offset="100%" stop-color="#e6fffb"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#bg)" />
      <path d="${pathData}" fill="none" stroke="#e65100" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      ${points.map((item) => `
        <g>
          <circle cx="${mapX(item.longitude)}" cy="${mapY(item.latitude)}" r="9" fill="#00838f" stroke="#ffffff" stroke-width="3" />
          <text x="${mapX(item.longitude) + 12}" y="${mapY(item.latitude) - 10}" font-size="18" fill="#0f172a" font-weight="700">${item.name}</text>
        </g>
      `).join('')}
    </svg>
  `;
}

async function fetchLocations() {
  const response = await fetch('/api/locations');
  const data = await response.json();
  const items = Array.isArray(data) ? data : (data.value ?? []);
  const lang = getLang();
  return items.map((item) => window.localizeLocationData ? window.localizeLocationData(item, lang) : item);
}

function lonLatToTile(lon, lat, zoom) {
  const x = Math.floor(((lon + 180) / 360) * (2 ** zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * (2 ** zoom)
  );

  return { x, y };
}

async function checkOfflineTileAvailability() {
  const styleUrl = buildOfflineStyle();

  try {
    const response = await fetch(styleUrl, { method: 'GET' });
    if (response.ok) {
      setMapStatus(tr('map_status_has_style'));
      return true;
    }

    setMapStatus(tr('map_status_no_style'), true);
    return false;
  } catch {
    setMapStatus(tr('map_status_no_check'), true);
    return false;
  }
}

function buildRouteFeature(locations) {
  const points = locations
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .sort((a, b) => a.longitude - b.longitude)
    .map((item) => [item.longitude, item.latitude]);

  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: points
    },
    properties: {
      name: 'Trục đường Vĩnh Khánh'
    }
  };
}

function buildPoiGeoJson(locations) {
  return {
    type: 'FeatureCollection',
    features: locations
      .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
      .map((item) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude]
        },
        properties: {
          id: item.id,
          name: item.name,
          category: item.category,
          address: item.address,
          highlight: item.highlight
        }
      }))
  };
}

async function initMapPage() {
  const mapElement = document.getElementById('vinhKhanhMap');
  if (!mapElement) {
    return;
  }

  let locations = [];
  try {
    locations = await fetchLocations();
  } catch {
    setMapStatus(tr('map_status_no_api'), true);
    return;
  }

  if (typeof maplibregl === 'undefined') {
    renderFallbackCanvas(locations);
    setMapStatus(tr('map_status_no_maplibre'), true);
    return;
  }

  let map;
  try
  {
    const hasOfflineStyle = await checkOfflineTileAvailability();
    const selectedStyle = hasOfflineStyle ? buildOfflineStyle() : buildOnlineRasterFallbackStyle();

    map = new maplibregl.Map({
      container: 'vinhKhanhMap',
      style: selectedStyle,
      center: [106.7036, 10.7616],
      zoom: 15.2,
      minZoom: 13,
      maxZoom: 18,
      attributionControl: false
    });
  }
  catch
  {
    renderFallbackCanvas(locations);
    setMapStatus(tr('map_status_no_webgl'), true);
    return;
  }

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

  map.on('load', async () => {
    const poiGeoJson = buildPoiGeoJson(locations);
    const routeGeoJson = {
      type: 'FeatureCollection',
      features: [buildRouteFeature(locations)]
    };

    map.addSource('vinh-khanh-route', {
      type: 'geojson',
      data: routeGeoJson
    });

    map.addLayer({
      id: 'vinh-khanh-route-line',
      type: 'line',
      source: 'vinh-khanh-route',
      paint: {
        'line-color': '#e65100',
        'line-width': 4,
        'line-opacity': 0.85
      }
    });

    map.addSource('vinh-khanh-poi', {
      type: 'geojson',
      data: poiGeoJson
    });

    map.addLayer({
      id: 'vinh-khanh-poi-circle',
      type: 'circle',
      source: 'vinh-khanh-poi',
      paint: {
        'circle-radius': 7,
        'circle-color': '#00838f',
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2
      }
    });

    map.on('click', 'vinh-khanh-poi-circle', (event) => {
      const feature = event.features?.[0];
      if (!feature || feature.geometry.type !== 'Point') {
        return;
      }

      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties ?? {};
      new maplibregl.Popup({ closeButton: true, closeOnMove: true })
        .setLngLat([lng, lat])
        .setHTML(`
          <strong>${props.name ?? ''}</strong><br/>
          <span>${props.category ?? ''}</span><br/>
          <span>${props.address ?? ''}</span><br/>
          <em>${props.highlight ?? ''}</em>
        `)
        .addTo(map);
    });

    map.on('mouseenter', 'vinh-khanh-poi-circle', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'vinh-khanh-poi-circle', () => {
      map.getCanvas().style.cursor = '';
    });

    const focusLocationId = getFocusLocationId();
    if (!focusLocationId) {
      return;
    }

    const target = locations.find((item) => String(item.id || '').toLowerCase() === focusLocationId);
    if (!target || !Number.isFinite(target.longitude) || !Number.isFinite(target.latitude)) {
      return;
    }

    map.flyTo({
      center: [target.longitude, target.latitude],
      zoom: 16.8,
      essential: true
    });

    new maplibregl.Popup({ closeButton: true })
      .setLngLat([target.longitude, target.latitude])
      .setHTML(`
        <strong>${target.name ?? ''}</strong><br/>
        <span>${target.category ?? ''}</span><br/>
        <span>${target.address ?? ''}</span><br/>
        <em>${target.highlight ?? ''}</em>
      `)
      .addTo(map);
  });
}

void initMapPage();
