import React, { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const categoryFallback = {
  murals: '🎨',
  beyond: '✦',
  parking: 'P',
  food: '🍴'
};

export default function ImmersiveThematicMap({ items, selectedKey, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  const validItems = useMemo(
    () => items.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng)),
    [items]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true
    }).setView([43.3647, 10.5997], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const invalidate = () => map.invalidateSize();
    window.addEventListener('resize', invalidate);
    setTimeout(invalidate, 80);

    return () => {
      window.removeEventListener('resize', invalidate);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (!validItems.length) return;

    validItems.forEach((item) => {
      const active = selectedKey === item.key;
      const hasImage = Boolean(item.image);
      const fallback = categoryFallback[item.category] || '•';

      const html = hasImage
        ? `<div class="leaflet-preview-marker ${escapeHtml(item.category)} ${active ? 'active' : ''}">
             <img src="${escapeHtml(item.image)}" alt="" />
           </div>`
        : `<div class="leaflet-preview-marker icon-only ${escapeHtml(item.category)} ${active ? 'active' : ''}">
             <span>${escapeHtml(fallback)}</span>
           </div>`;

      const icon = L.divIcon({
        className: 'leaflet-preview-marker-wrap',
        html,
        iconSize: active ? [58, 58] : [48, 48],
        iconAnchor: active ? [29, 58] : [24, 48]
      });

      const marker = L.marker([item.lat, item.lng], {
        icon,
        riseOnHover: true,
        title: item.title
      }).addTo(layer);

      marker.on('click', () => onSelect(item.key));
    });

    const bounds = L.latLngBounds(validItems.map((item) => [item.lat, item.lng]));
    if (validItems.length === 1) {
      map.setView(bounds.getCenter(), 17, { animate: true });
    } else {
      map.fitBounds(bounds.pad(0.16), { animate: true, maxZoom: 17 });
    }

    setTimeout(() => map.invalidateSize(), 50);
  }, [validItems, selectedKey, onSelect]);

  return <div ref={containerRef} className="leaflet-thematic-map" />;
}
