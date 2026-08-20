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

export default function App() {
  const [language, setLanguage] = useState('it');
  const [selectedId, setSelectedId] = useState(() => window.location.hash?.replace('#', '') || murals[0].id);
  const [query, setQuery] = useState('');
  const [isMuralSheetOpen, setIsMuralSheetOpen] = useState(false);
  const detailsRef = useRef(null);
  const tourRef = useRef(null);
  const mapRef = useRef(null);

  const t = ui[language];
  const selectedIndex = Math.max(0, murals.findIndex((m) => m.id === selectedId));
  const selectedMural = murals[selectedIndex] || murals[0];
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
          </div>
          <img src="/images/memoria-desiderio.jpg" alt="Murales Memoria e desiderio" className="hero-image" />
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
            <button className="primary open-current-sheet" onClick={() => setIsMuralSheetOpen(true)}>{language === 'it' ? 'Apri scheda tappa' : 'Open stop card'}</button>
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
            <p className="kicker">Gioca con i murales</p>
            <h2>{t.familyTitle}</h2>
          </div>
          <div className="text-card family-card">
            <p>{t.familySubtitle}</p>
            <p>{t.familyIntro}</p>
            <div className="hunt-grid">
              {['un cinghiale', 'un cavallo', 'una colomba', 'un’anfora', 'il mare', 'un pettirosso', 'una gazza ladra', 'un melograno', 'il colore giallo e azzurro', 'una pentola', 'un vaso etrusco', 'un’oliva'].map((item) => <span key={item}>☐ {item}</span>)}
            </div>
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
        <p><strong>{t.versionLabel} — 2.1.1</strong></p>
      </footer>

      <nav className="mobile-premium-nav" aria-label={language === 'en' ? 'Quick navigation' : 'Navigazione rapida'}>
        <a href="#top" className="mobile-premium-nav-item">
          <span aria-hidden="true">⌂</span>
          <small>{language === 'en' ? 'Home' : 'Home'}</small>
        </a>
        <a href="#murales" className="mobile-premium-nav-item">
          <span aria-hidden="true">◫</span>
          <small>{language === 'en' ? 'Murals' : 'Murales'}</small>
        </a>
        <a href="#mappa" className="mobile-premium-nav-item mobile-premium-nav-main">
          <span aria-hidden="true">⌖</span>
          <small>{language === 'en' ? 'Map' : 'Mappa'}</small>
        </a>
        <a href="#oltre" className="mobile-premium-nav-item">
          <span aria-hidden="true">✦</span>
          <small>{language === 'en' ? 'Explore' : 'Scopri'}</small>
        </a>
      </nav>

    </div>
  );
}
