import React, { useEffect, useMemo, useRef, useState } from 'react';
import { murals } from './data/murals';
import { parkingSpots } from './data/parkingSpots';
import { placesToEat } from './data/placesToEat';
import { ui } from './data/ui';
import { extraPlaces } from './data/extraPlaces';
import { getExtraText } from './utils/localization';
import { navGoogle, navApple, embedMapUrl } from './utils/navigation';
import FoodCard from './components/FoodCard';
import BottomMobileNav from './components/BottomMobileNav';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const familyHuntItems = [
  { id: 'cinghiale', it: 'un cinghiale', en: 'a wild boar' },
  { id: 'cavallo', it: 'un cavallo', en: 'a horse' },
  { id: 'colomba', it: 'una colomba', en: 'a dove' },
  { id: 'anfora', it: 'un’anfora', en: 'an amphora' },
  { id: 'mare', it: 'il mare', en: 'the sea' },
  { id: 'pettirosso', it: 'un pettirosso', en: 'a robin' },
  { id: 'gazza', it: 'una gazza ladra', en: 'a magpie' },
  { id: 'melograno', it: 'un melograno', en: 'a pomegranate' },
  { id: 'giallo-azzurro', it: 'il colore giallo e azzurro', en: 'yellow and blue colours' },
  { id: 'pentola', it: 'una pentola', en: 'a cooking pot' },
  { id: 'vaso-etrusco', it: 'un vaso etrusco', en: 'an Etruscan vase' },
  { id: 'oliva', it: 'un’oliva', en: 'an olive' }
];

const distanceKm = (from, to) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};


const mapCategoryConfig = {
  murals: { icon: '🎨', labelKey: 'mapFilterMurals' },
  beyond: { icon: '✦', labelKey: 'mapFilterBeyond' },
  parking: { icon: 'P', labelKey: 'mapFilterParking' },
  food: { icon: '🍴', labelKey: 'mapFilterFood' }
};

const buildOsmEmbedUrl = (items) => {
  const valid = items.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
  if (!valid.length) return 'https://www.openstreetmap.org/export/embed.html?bbox=10.594%2C43.362%2C10.603%2C43.367&layer=mapnik';

  const lats = valid.map((item) => item.lat);
  const lngs = valid.map((item) => item.lng);
  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLng = Math.min(...lngs);
  let maxLng = Math.max(...lngs);

  const latPad = Math.max((maxLat - minLat) * 0.18, 0.0012);
  const lngPad = Math.max((maxLng - minLng) * 0.18, 0.0015);
  minLat -= latPad;
  maxLat += latPad;
  minLng -= lngPad;
  maxLng += lngPad;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(`${minLng},${minLat},${maxLng},${maxLat}`)}&layer=mapnik`;
};

const projectMarker = (item, items) => {
  const valid = items.filter((entry) => Number.isFinite(entry.lat) && Number.isFinite(entry.lng));
  if (!valid.length) return { left: 50, top: 50 };

  const lats = valid.map((entry) => entry.lat);
  const lngs = valid.map((entry) => entry.lng);
  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLng = Math.min(...lngs);
  let maxLng = Math.max(...lngs);

  const latPad = Math.max((maxLat - minLat) * 0.18, 0.0012);
  const lngPad = Math.max((maxLng - minLng) * 0.18, 0.0015);
  minLat -= latPad;
  maxLat += latPad;
  minLng -= lngPad;
  maxLng += lngPad;

  const left = ((item.lng - minLng) / Math.max(maxLng - minLng, 0.00001)) * 100;
  const top = (1 - (item.lat - minLat) / Math.max(maxLat - minLat, 0.00001)) * 100;
  return { left, top };
};

export default function App() {
  const [language, setLanguage] = useState('it');
  const [selectedId, setSelectedId] = useState(() => window.location.hash?.replace('#', '') || murals[0].id);
  const [query, setQuery] = useState('');
  const [isMuralSheetOpen, setIsMuralSheetOpen] = useState(false);
  const [isImmersiveMapOpen, setIsImmersiveMapOpen] = useState(false);
  const [mapCategory, setMapCategory] = useState('murals');
  const [mapSelectedKey, setMapSelectedKey] = useState(null);
  const [familyFoundIds, setFamilyFoundIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('riparbellaFamilyHunt') || '[]');
    } catch (error) {
      return [];
    }
  });
  const [nearestStatus, setNearestStatus] = useState('idle');
  const [nearestResult, setNearestResult] = useState(null);
  const detailsRef = useRef(null);
  const tourRef = useRef(null);
  const mapRef = useRef(null);

  const t = ui[language];
  const selectedIndex = Math.max(0, murals.findIndex((m) => m.id === selectedId));
  const selectedMural = murals[selectedIndex] || murals[0];
  const thematicMapItems = (() => {
    if (mapCategory === 'beyond') {
      return extraPlaces
        .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng))
        .map((item) => ({
          key: `beyond-${item.id}`,
          sourceId: item.id,
          category: 'beyond',
          title: getExtraText(item, 'title', language),
          subtitle: item.address,
          image: item.image,
          lat: item.lat,
          lng: item.lng,
          mapsUrl: navGoogle(item.lat, item.lng)
        }));
    }

    if (mapCategory === 'parking') {
      return parkingSpots.map((item, index) => ({
        key: `parking-${index}`,
        category: 'parking',
        title: item.name,
        subtitle: item.note,
        image: null,
        lat: item.lat,
        lng: item.lng,
        mapsUrl: navGoogle(item.lat, item.lng)
      }));
    }

    if (mapCategory === 'food') {
      return placesToEat
        .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng))
        .map((item, index) => ({
          key: `food-${index}`,
          category: 'food',
          title: item.name,
          subtitle: item.address,
          image: item.image,
          lat: item.lat,
          lng: item.lng,
          mapsUrl: item.mapsUrl
        }));
    }

    return murals.map((item, index) => ({
      key: `mural-${item.id}`,
      sourceId: item.id,
      category: 'murals',
      title: item.title,
      subtitle: item.address,
      image: item.image,
      lat: item.lat,
      lng: item.lng,
      mapsUrl: navGoogle(item.lat, item.lng),
      number: index + 1
    }));
  })();

  const thematicSelectedItem =
    thematicMapItems.find((item) => item.key === mapSelectedKey) ||
    thematicMapItems[0] ||
    null;

  const selectMapCategory = (category) => {
    setMapCategory(category);
    setMapSelectedKey(null);
  };
  const [visitedIds, setVisitedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('riparbellaVisitedMurals') || '[]');
    } catch (error) {
      return [];
    }
  });
  const visitedCount = visitedIds.length;
  const progressPercent = Math.round((visitedCount / murals.length) * 100);


  const filteredMurals = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return murals;
    return murals.filter((m) =>
      `${m.title} ${m.artist} ${m.address} ${m.tags.join(' ')}`
        .toLowerCase()
        .includes(q)
    );
  })();

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace('#', '');
      if (murals.some((m) => m.id === id)) setSelectedId(id);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    localStorage.setItem('riparbellaVisitedMurals', JSON.stringify(visitedIds));
  }, [visitedIds]);

  useEffect(() => {
    if (!isImmersiveMapOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsImmersiveMapOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isImmersiveMapOpen]);

  const selectMural = (id, scroll = true) => {
    setSelectedId(id);
    window.history.replaceState(null, '', `#${id}`);
    if (scroll) setIsMuralSheetOpen(true);
  };

  const toggleVisited = (id = selectedMural.id) => {
    setVisitedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const resetVisited = () => {
    setVisitedIds([]);
  };

  const isVisited = (id) => visitedIds.includes(id);


  const toggleFamilyFound = (id) => {
    setFamilyFoundIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const resetFamilyHunt = () => {
    setFamilyFoundIds([]);
  };

  const findNearestMural = () => {
    if (!navigator.geolocation) {
      setNearestStatus('error');
      return;
    }

    setNearestStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const candidates = murals.filter(
          (mural) => Number.isFinite(mural.lat) && Number.isFinite(mural.lng)
        );

        if (!candidates.length) {
          setNearestStatus('error');
          return;
        }

        const nearest = candidates.reduce((closest, mural) => {
          const muralDistance = distanceKm(userPosition, mural);
          const closestDistance = distanceKm(userPosition, closest);
          return muralDistance < closestDistance ? mural : closest;
        }, candidates[0]);

        const distance = distanceKm(userPosition, nearest);
        setNearestResult({ mural: nearest, distance });
        setNearestStatus('ready');
        selectMural(nearest.id, true);
      },
      () => {
        setNearestStatus('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const shareMural = async (mural = selectedMural) => {
    const url = `${window.location.origin}${window.location.pathname}#${mural.id}`;
    const title = `${mural.title} — Murales di Riparbella`;
    const text = language === 'it'
      ? `Scopri il murale "${mural.title}" nel percorso dei murales di Riparbella.`
      : `Discover the mural "${mural.title}" on the Riparbella mural route.`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {}
    }

    await navigator.clipboard?.writeText(url);
    alert(language === 'it' ? 'Link della scheda copiato.' : 'Card link copied.');
  };

  const goToStep = (index) => {
    const safe = (index + murals.length) % murals.length;
    selectMural(murals[safe].id, false);
    setIsMuralSheetOpen(true);
  };

  return (
    <div className="app">
      <header id="top" className="hero premium-hero">
        <nav className="topbar">
          <div className="brand">Riparbella Murales</div>
          <div className="lang">
            <button onClick={() => setLanguage('it')} className={language === 'it' ? 'active' : ''}>ITA</button>
            <button onClick={() => setLanguage('en')} className={language === 'en' ? 'active' : ''}>ENG</button>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="kicker">{t.heroKicker}</p>
            <h1>{t.title}</h1>
            <p className="subtitle">{t.subtitle}</p>
            <div className="hero-quick-links">
              <a href="#mappa" onClick={(e) => { e.preventDefault(); document.getElementById('mappa')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{t.navMap}</a>
              <a href="#parcheggi" onClick={(e) => { e.preventDefault(); document.getElementById('parcheggi')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{t.navParking}</a>
              <a href="#oltre-murales" onClick={(e) => { e.preventDefault(); document.getElementById('oltre-murales')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{t.navBeyond}</a>
              <a href="#dove-fermarsi" onClick={(e) => { e.preventDefault(); document.getElementById('dove-fermarsi')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{t.navFood}</a>
            </div>
            <div className="nearest-mural-action">
              <button type="button" onClick={findNearestMural} disabled={nearestStatus === 'loading'}>
                <span aria-hidden="true">⌖</span>
                <span>{nearestStatus === 'loading' ? t.nearestLoading : t.nearestButton}</span>
              </button>
              {nearestStatus === 'ready' && nearestResult && (
                <p>
                  {t.nearestFound}: <strong>{nearestResult.mural.title}</strong>
                  {' · '}
                  {nearestResult.distance < 1
                    ? `${Math.max(1, Math.round(nearestResult.distance * 1000))} m`
                    : `${nearestResult.distance.toFixed(1)} km`}
                </p>
              )}
              {nearestStatus === 'error' && <p className="nearest-error">{t.nearestError}</p>}
            </div>
          </div>
          <img src="/images/memoria-desiderio.jpg" alt="Murales Memoria e desiderio" className="hero-image hero-image-v22" />
        </div>
      </header>

      <main>
        <section className="section route-section">
          <div className="section-heading">
            <p className="kicker">{t.routeKicker}</p>
            <h2>{t.route}</h2>
          </div>
          <div className="text-card">
            <p>{t.routeText}</p>
            <p>{t.routeText2}</p>
          </div>
        </section>

        <section className="section tips-section">
          <div className="section-heading">
            <p className="kicker">{t.beforeStartKicker}</p>
            <h2>{t.visitTipsTitle}</h2>
          </div>
          <div className="tips-grid">
            <article className="tip-card">
              <strong>45/60 min</strong>
              <span>{t.visitCard1Text}</span>
            </article>
            <article className="tip-card">
              <strong>Percorso a piedi</strong>
              <span>{t.visitCard2Text}</span>
            </article>
            <article className="tip-card">
              <strong>Scarpe comode</strong>
              <span>{t.visitCard3Text}</span>
            </article>
            <article className="tip-card">
              <strong>Rispetto</strong>
              <span>{t.visitCard4Text}</span>
            </article>
          </div>
        </section>

        <section className="section progress-section">
          <div className="section-heading">
            <p className="kicker">{t.progressKicker}</p>
            <h2>{t.progressTitle}</h2>
          </div>
          <div className="progress-card">
            <div className="progress-copy">
              <strong>{visitedCount} / {murals.length} {t.progressSeen}</strong>
              <span>{t.progressHint}</span>
            </div>
            <div className="progress-meter" aria-label={`${t.progressAria} ${progressPercent}%`}>
              <span style={{ width: `${progressPercent}%` }}></span>
            </div>
            <div className="progress-actions">
              <button className="primary" onClick={() => toggleVisited(selectedMural.id)}>{isVisited(selectedMural.id) ? 'Segna come da rivedere' : 'Segna tappa vista'}</button>
              <button className="secondary" onClick={resetVisited}>{t.clearRoute}</button>
            </div>
          </div>
        </section>

        <section className="section project-section">
          <div className="section-heading">
            <p className="kicker">{t.projectKicker}</p>
            <h2>{t.projectTitle}</h2>
          </div>
          <div className="text-card">
            <p>{t.projectText1}</p>
            <p>{t.projectText2}</p>
          </div>
        </section>


        <section id="mappa" className="section map-section" ref={mapRef}>
          <div className="section-heading">
            <p className="kicker">{t.stopOf} {selectedIndex + 1} {t.of} {murals.length}</p>
            <h2>{t.map}</h2>
          </div>

          <div className="map-intro-card">
            <p>{t.mapIntro}</p>
            <div className="map-intro-actions">
              <button className="primary immersive-map-launch" onClick={() => setIsImmersiveMapOpen(true)}>
                <span aria-hidden="true">⌖</span>
                {t.openImmersiveMap}
              </button>
              <button className="secondary open-current-sheet" onClick={() => setIsMuralSheetOpen(true)}>
                {language === 'it' ? 'Apri scheda tappa' : 'Open stop card'}
              </button>
            </div>
          </div>

          <div className="map-layout map-layout-v11">
            <div className="map-panel">
              <iframe title="Mappa murale selezionato" src={embedMapUrl(selectedMural.lat, selectedMural.lng)} loading="lazy"></iframe>
              <div className="selected-map-caption">
                <strong>{selectedIndex + 1}. {selectedMural.title}</strong>
                <span>{selectedMural.address}</span>
              </div>
            </div>

            <div className="route-list">
              {murals.map((mural, index) => (
                <article key={mural.id} className={`${selectedId === mural.id ? 'route-stop active' : 'route-stop'} ${isVisited(mural.id) ? 'visited' : ''}`}>
                  <button className="route-stop-main route-stop-main-with-image" onClick={() => selectMural(mural.id, false)}>
                    <span className="route-number">{index + 1}</span>
                    <img className="route-thumb" src={mural.image} alt={mural.title} loading="lazy" />
                    <span>
                      <strong>{mural.title}</strong>
                      <small>{mural.address}</small>
                      {isVisited(mural.id) && <em className="visited-pill">Vista</em>}
                    </span>
                  </button>
                  <div className="route-stop-actions">
                    <button onClick={() => selectMural(mural.id, true)}>{t.openCard}</button>
                    <a href={navGoogle(mural.lat, mural.lng)} target="_blank" rel="noreferrer">{t.takeMe}</a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {isImmersiveMapOpen && (
            <div className="immersive-map-overlay thematic-map-overlay" role="dialog" aria-modal="true" aria-label={t.immersiveMapTitle}>
              <div className="immersive-map-shell thematic-map-shell">
                <div className="immersive-map-topbar thematic-map-topbar">
                  <div>
                    <p className="kicker">{t.immersiveMapKicker}</p>
                    <h3>{t.immersiveMapTitle}</h3>
                  </div>
                  <button className="immersive-map-close" onClick={() => setIsImmersiveMapOpen(false)} aria-label={t.close}>×</button>
                </div>

                <div className="thematic-map-filters" role="tablist" aria-label={t.mapCategories}>
                  {Object.entries(mapCategoryConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={mapCategory === key}
                      className={mapCategory === key ? 'thematic-filter active' : 'thematic-filter'}
                      onClick={() => selectMapCategory(key)}
                    >
                      <span aria-hidden="true">{config.icon}</span>
                      <small>{t[config.labelKey]}</small>
                    </button>
                  ))}
                </div>

                <div className="immersive-map-canvas thematic-map-canvas">
                  <iframe
                    key={mapCategory}
                    title={t.immersiveMapTitle}
                    src={buildOsmEmbedUrl(thematicMapItems)}
                    loading="eager"
                  />

                  <div className="thematic-marker-layer" aria-label={t.mapPoints}>
                    {thematicMapItems.map((item) => {
                      const pos = projectMarker(item, thematicMapItems);
                      const active = thematicSelectedItem?.key === item.key;
                      const icon = mapCategoryConfig[item.category]?.icon || '•';
                      return (
                        <button
                          key={item.key}
                          type="button"
                          className={active ? `thematic-marker ${item.category} active` : `thematic-marker ${item.category}`}
                          style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                          onClick={() => {
                            setMapSelectedKey(item.key);
                            if (item.category === 'murals' && item.sourceId) {
                              selectMural(item.sourceId, false);
                            }
                          }}
                          aria-label={item.title}
                        >
                          <span>{item.category === 'murals' ? (item.number || icon) : icon}</span>
                        </button>
                      );
                    })}
                  </div>

                  {thematicSelectedItem && (
                    <div className="thematic-map-mini-card">
                      {thematicSelectedItem.image ? (
                        <img src={thematicSelectedItem.image} alt={thematicSelectedItem.title} />
                      ) : (
                        <div className="thematic-mini-icon" aria-hidden="true">
                          {mapCategoryConfig[thematicSelectedItem.category]?.icon}
                        </div>
                      )}
                      <div className="thematic-mini-copy">
                        <small>{t[mapCategoryConfig[thematicSelectedItem.category]?.labelKey]}</small>
                        <strong>{thematicSelectedItem.title}</strong>
                        <span>{thematicSelectedItem.subtitle}</span>
                      </div>
                      <div className="thematic-mini-actions">
                        {thematicSelectedItem.category === 'murals' && thematicSelectedItem.sourceId && (
                          <button onClick={() => {
                            setIsImmersiveMapOpen(false);
                            selectMural(thematicSelectedItem.sourceId, true);
                          }}>{t.openCard}</button>
                        )}
                        <a href={thematicSelectedItem.mapsUrl} target="_blank" rel="noreferrer">{t.takeMe}</a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="thematic-map-carousel" aria-label={t.mapPoints}>
                  {thematicMapItems.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={thematicSelectedItem?.key === item.key ? 'thematic-carousel-item active' : 'thematic-carousel-item'}
                      onClick={() => {
                        setMapSelectedKey(item.key);
                        if (item.category === 'murals' && item.sourceId) selectMural(item.sourceId, false);
                      }}
                    >
                      <span>{mapCategoryConfig[item.category]?.icon}</span>
                      <strong>{item.title}</strong>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isMuralSheetOpen && (
            <div className="mural-sheet-overlay" onClick={() => setIsMuralSheetOpen(false)} role="dialog" aria-modal="true">
          <article className="selected-mural-card mural-glass-sheet" ref={detailsRef} onClick={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => setIsMuralSheetOpen(false)}>{language === 'it' ? 'Chiudi' : 'Close'}</button>
            <div className="selected-mural-image-wrap">
              <img src={selectedMural.image} alt={selectedMural.title} />
            </div>
            <div className="selected-mural-content">
              <p className="kicker">{t.selectedMuralCard}</p>
              <p className="step">{t.stopOf} {selectedIndex + 1} {t.of} {murals.length}</p>
              <h3>{selectedMural.title}</h3>
              <p className="meta">{selectedMural.artist} · {selectedMural.year}</p>
              <p className="address">⌖ {selectedMural.address}</p>
              <div className="tags">
                {(language === 'en' ? selectedMural.tagsEn || selectedMural.tags : selectedMural.tags).map((tag) => <span key={tag}>{tag}</span>)}
              </div>

              <div className="mini-block description-block">
                <h4>Descrizione dell’opera</h4>
                <p>{language === 'en' ? selectedMural.en : selectedMural.it}</p>
              </div>

              <div className="mini-block">
                <h4>{t.observe}</h4>
                <p>{language === 'en' ? (selectedMural.observeEn || selectedMural.observe || selectedMural.en) : (selectedMural.observe || selectedMural.it)}</p>
              </div>

              <div className="mini-block">
                <h4>{t.findDetails}</h4>
                <ul className="detail-list">
                  {(language === 'en' ? selectedMural.detailsToFindEn || selectedMural.detailsToFind : selectedMural.detailsToFind).map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              </div>

              {(language === 'en' ? selectedMural.directionsNextEn || selectedMural.directionsNext : selectedMural.directionsNext) && (
                <div className="mini-block next-direction">
                  <h4>{t.nextDirectionTitle}</h4>
                  <p>{language === 'en' ? selectedMural.directionsNextEn || selectedMural.directionsNext : selectedMural.directionsNext}</p>
                </div>
              )}

              <div className="button-row">
                <a href={navGoogle(selectedMural.lat, selectedMural.lng)} target="_blank" rel="noreferrer" className="primary link">{t.google}</a>
                <a href={navApple(selectedMural.lat, selectedMural.lng)} target="_blank" rel="noreferrer" className="secondary link">{t.apple}</a>
                <button className={isVisited(selectedMural.id) ? 'primary' : 'secondary'} onClick={() => toggleVisited(selectedMural.id)}>{isVisited(selectedMural.id) ? t.seenDone : t.markSeenShort}</button>
                <button className="secondary" onClick={() => shareMural(selectedMural)}>{t.shareCard}</button>
              </div>

              <div className="button-row">
                <button className="secondary" onClick={() => goToStep(selectedIndex - 1)}>{t.previousStop}</button>
                <button className="primary" onClick={() => goToStep(selectedIndex + 1)}>{t.nextStop}</button>
              </div>
            </div>
          </article>
            </div>
          )}
        </section>

        <section id="oltre-murales" className="section extra-places-section">
          <div className="section-heading">
            <p className="kicker">{t.extraKicker}</p>
            <h2>{t.extraTitle}</h2>
          </div>
          <div className="text-card">
            <p>{t.extraIntro}</p>
          </div>

          <div className="extra-places-grid">
            {extraPlaces.map((place) => (
              <article className="extra-place-card" key={place.id}>
                {place.image && (
                  <div className="extra-place-image">
                    <img src={place.image} alt={getExtraText(place, 'title', language)} loading="lazy" />
                  </div>
                )}
                <div className="extra-place-head">
                  <p className="type">{getExtraText(place, 'category', language)}</p>
                  <h3>{getExtraText(place, 'title', language)}</h3>
                  <p className="address">⌖ {place.address}</p>
                </div>
                <p className="extra-place-intro">{getExtraText(place, 'intro', language)}</p>
                <details>
                  <summary>{t.readStory}</summary>
                  <div className="extra-place-description">
                    {getExtraText(place, 'description', language).split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    <p className="credit">{getExtraText(place, 'credit', language)}</p>
                  </div>
                </details>
                <div className="button-row">
                  <a href={navGoogle(place.lat, place.lng)} target="_blank" rel="noreferrer" className="primary link">Google Maps</a>
                  <a href={navApple(place.lat, place.lng)} target="_blank" rel="noreferrer" className="secondary link">Apple Maps</a>
                  {place.website && <a href={place.website} target="_blank" rel="noreferrer" className="secondary link">Sito web</a>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section family-section">
          <div className="section-heading">
            <p className="kicker">{t.familyKicker}</p>
            <h2>{t.familyTitle}</h2>
          </div>

          <div className="text-card family-card interactive-family-card">
            <div className="family-hunt-head">
              <div>
                <p>{t.familySubtitle}</p>
                <p>{t.familyIntro}</p>
              </div>
              <div className="family-hunt-progress" aria-live="polite">
                <strong>{familyFoundIds.length}/{familyHuntItems.length}</strong>
                <span>{t.familyFound}</span>
              </div>
            </div>

            <div className="family-progress-track" aria-hidden="true">
              <span style={{ width: `${Math.round((familyFoundIds.length / familyHuntItems.length) * 100)}%` }} />
            </div>

            <div className="hunt-grid interactive-hunt-grid">
              {familyHuntItems.map((item) => {
                const found = familyFoundIds.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={found ? 'hunt-item found' : 'hunt-item'}
                    onClick={() => toggleFamilyFound(item.id)}
                    aria-pressed={found}
                  >
                    <span className="hunt-check" aria-hidden="true">{found ? '✓' : ''}</span>
                    <span>{language === 'en' ? item.en : item.it}</span>
                  </button>
                );
              })}
            </div>

            {familyFoundIds.length === familyHuntItems.length && (
              <div className="family-complete" role="status">
                <span aria-hidden="true">★</span>
                <strong>{t.familyCompleteTitle}</strong>
                <p>{t.familyCompleteText}</p>
              </div>
            )}

            {familyFoundIds.length > 0 && (
              <button type="button" className="family-reset" onClick={resetFamilyHunt}>
                {t.familyReset}
              </button>
            )}
          </div>
        </section>

        <section className="section practical" id="parcheggi">
          <div className="section-heading">
            <p className="kicker">Arrivare e ripartire</p>
            <h2>{t.parking}</h2>
          </div>
          <div className="practical-grid">
            {parkingSpots.map((spot) => (
              <article className="info-card" key={spot.name}>
                <h3>{spot.name}</h3>
                <p>{spot.note}</p>
                <p className="coords">{spot.lat}, {spot.lng}</p>
                <div className="button-row">
                  <a className="primary link" target="_blank" rel="noreferrer" href={navGoogle(spot.lat, spot.lng)}>{t.google}</a>
                  <a className="secondary link" target="_blank" rel="noreferrer" href={navApple(spot.lat, spot.lng)}>{t.apple}</a>
                </div>
              </article>
            ))}
          </div>
        </section>

                        <section className="section practical food-section" id="dove-fermarsi">
          <div className="section-heading">
            <p className="kicker">{t.foodKicker}</p>
            <h2>{t.food}</h2>
          </div>
          <div className="text-card food-intro">
            <p>{t.foodIntro}</p>
          </div>
          <div className="practical-grid food-grid">
            {placesToEat.map((place) => <FoodCard key={place.name} place={place} t={t} />)}
          </div>
          <p className="disclaimer">{t.infoDisclaimer}</p>
        </section>
      </main>


      <BottomMobileNav t={t} />

      <footer>
        <p><strong>{t.footerMade}</strong></p>
        <p>{t.footerPurpose}</p>
        <p className="footer-project">{t.footerProject}</p>
        <div className="support-box support-box-small">
          <p>{t.supportText}</p>
        </div>
        <p>{t.rightsText}</p>
        <p><strong>{t.versionLabel} — 2.5.0</strong></p>
      </footer>
      <Analytics />
      <SpeedInsights />

      <nav className="mobile-premium-nav v22-nav" aria-label={language === 'en' ? 'Quick navigation' : 'Navigazione rapida'}>
        <a href="#top" className="mobile-premium-nav-item">
          <span className="v22-icon" aria-hidden="true">⌂</span>
          <small>Home</small>
        </a>
        <a href="#murales" className="mobile-premium-nav-item">
          <span className="v22-icon" aria-hidden="true">▦</span>
          <small>{language === 'en' ? 'Murals' : 'Murales'}</small>
        </a>
        <a href="#mappa" className="mobile-premium-nav-item mobile-premium-nav-main">
          <span className="v22-icon" aria-hidden="true">⌖</span>
          <small>{language === 'en' ? 'Map' : 'Mappa'}</small>
        </a>
        <a href="#oltre" className="mobile-premium-nav-item">
          <span className="v22-icon" aria-hidden="true">✦</span>
          <small>{language === 'en' ? 'Explore' : 'Scopri'}</small>
        </a>
      </nav>

    </div>
  );
}
