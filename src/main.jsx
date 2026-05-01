import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';

const MURALES = [
  {
    id: 'i-lari',
    title: 'I Lari', artist: 'Giò Pistone', year: '2024',
    place: 'Piazza Giacomo Matteotti, muro palazzo davanti al bar “I Lari”',
    coords: [43.364712, 10.600194], image: '/images/lari.jpg', theme: 'Architettura, memoria e rinascita',
    shortIt: 'Tre figure protettrici trasformano un antico palazzo di giustizia e carceri in un luogo di gioia, colore e libertà.',
    fullIt: 'Il murale valorizza l’architettura autentica dell’edificio storico attraverso colori netti e forti. L’artista ha lavorato dopo incontri con cittadini e proprietà: proprio la proprietà desiderava superare la memoria negativa legata alle vecchie carceri. Nascono così tre lari familiaris etruschi e romani, antichi protettori della casa e della famiglia, rappresentati come stendardi o statuette luminose.',
    shortEn: 'Three protective figures turn an old courthouse and prison building into a place of joy, colour and freedom.',
    fullEn: 'The mural highlights the authentic architecture of the historic building with bold, clear colours. The artist developed the work after meetings with local people and the property owners, who wished to transform the negative memory of the old prison. The result is three Etruscan and Roman Lares familiares, ancient protectors of home and family, shown as banners or small statues filled with energy.'
  },
  {
    id: 'memoria-desiderio', title: 'Memoria e desiderio', artist: 'Daniel Muñoz', year: '2024',
    place: 'Piazza Giacomo Matteotti, facciata principale del bar “Memoria e desiderio”', coords: [43.364856, 10.600028], image: '/images/memoria-desiderio.jpg', theme: 'Mappa emotiva del paese',
    shortIt: 'Una mappa artistica di Riparbella costruita con ricordi, profumi, luoghi del cuore e desideri futuri.',
    fullIt: 'Partendo da una vista dall’alto del paese, l’artista crea una mappa non convenzionale: non solo strade e case, ma memorie, sensazioni, racconti e desideri. Le interazioni con cittadini e studenti hanno fatto emergere luoghi di incontro, profumi, storie partigiane, sogni dei bambini e visioni future. La facciata laterale diventa una legenda poetica fatta di distanze sociali, emozionali e politiche.',
    shortEn: 'An artistic map of Riparbella made of memories, scents, places of the heart and future wishes.',
    fullEn: 'Starting from an aerial view of the village, the artist creates a non-conventional map: not only streets and buildings, but memories, emotions, stories and wishes. Conversations with residents and students brought out meeting places, scents, partisan memories, children’s dreams and future visions. The side wall becomes a poetic legend of social, emotional and political distances.'
  },
  {
    id: 'amore-pentola', title: 'L’amore nella pentola', artist: 'Zed 1', year: '2024',
    place: 'Piazza Borgo di Sotto', coords: [43.364169, 10.598239], image: '/images/amore-pentola.jpg', theme: 'Tradizioni popolari e vita di piazza',
    shortIt: 'Un racconto visionario sulle donne del paese, i fuochi di Sant’Antonio, il piombo fuso e il futuro sposo.',
    fullIt: 'L’opera racconta l’anima storica di Riparbella e una tradizione tramandata dagli abitanti della piazza: durante la notte di Sant’Antonio le donne scaldavano l’acqua in grandi pentole e vi scioglievano il piombo dei pallini da caccia. Le forme ottenute venivano interpretate per immaginare il futuro sposo. Compaiono anche il cinghiale, il cavallo Gino e la bandiera sarda, omaggio alla comunità e alla storia del luogo.',
    shortEn: 'A visionary story about village women, Saint Anthony’s fires, molten lead and the search for a future husband.',
    fullEn: 'The work tells the historic soul of Riparbella through a local tradition: on Saint Anthony’s night, women heated water in large pots and melted hunting lead pellets. Once cooled, the shapes were interpreted to imagine the future husband. The mural also features a wild boar, the horse Gino and the Sardinian flag, honouring local stories and the Sardinian community living around Riparbella.'
  },
  {
    id: 'terra-colori', title: 'Terra e colori', artist: 'Mina Hamada e Zosen Bandido', year: '2024',
    place: 'Piazza Federigo Baldasserini', coords: [43.363962, 10.597198], image: '/images/terra-colori.jpg', theme: 'Paesaggio, estate e identità agricola',
    shortIt: 'Onde, sole, luna, olivi, vino e colori accesi raccontano il territorio e l’energia di Riparbella.',
    fullIt: 'Il murale rappresenta l’essenza del paese: il calore del sole, la freschezza del mare, la mobilità lenta, l’olio, il vino, l’estate e i paesaggi circostanti. Elementi astratti e simbolici si mescolano in un’opera luminosa. Tra i dettagli compaiono una cazzuola e una lente di ingrandimento, richieste dai proprietari come omaggio a storie familiari legate al muro.',
    shortEn: 'Waves, sun, moon, olive trees, wine and vivid colours describe the land and energy of Riparbella.',
    fullEn: 'The mural represents the essence of the village: the warmth of the sun, the freshness of the sea, slow mobility, olive oil, wine, summer joy and the surrounding landscapes. Abstract and symbolic elements merge in a bright visual composition. A trowel and a magnifying glass also appear, requested by the owners as a tribute to family stories connected to the building.'
  },
  {
    id: 'universo-riparbella', title: 'Universo Riparbella', artist: 'Vincenzo Marano Esposito con i bambini della scuola primaria', year: '2021',
    place: 'Via della Noce', coords: [43.364022, 10.597914], image: '/images/universo-riparbella.jpg', theme: 'Scuola, gioco e Agenda 2030',
    shortIt: 'Una sorta di gioco dell’oca urbano nato dai desideri dei bambini e dedicato allo sviluppo sostenibile.',
    fullIt: 'L’opera nasce da una richiesta dei bambini della scuola primaria: trasformare la strada verso la scuola in un percorso colorato e giocoso. Con l’artista Vinci è nato un laboratorio didattico dedicato all’Agenda 2030, alla sostenibilità e alla lotta contro povertà e disuguaglianze. Una bambina srotola un nastro giallo e azzurro che avvolge caselle e bozzetti: Riparbella che insegna.',
    shortEn: 'An urban board-game route created from children’s wishes and dedicated to sustainable development.',
    fullEn: 'The work began with a request from primary school children: to turn the road to school into a colourful, playful route. Together with the artist Vinci, they created a workshop about the 2030 Agenda, sustainability and the fight against poverty and inequality. A girl unrolls a yellow and blue ribbon connecting the children’s drawings: Riparbella that teaches.'
  },
  {
    id: 'riparbella01', title: 'Riparbella01', artist: 'Moneyless', year: '2024',
    place: 'Piazzetta limitrofa Piazza Guglielmo Marconi, facciata edificio scolastico', coords: [43.36395, 10.59805], image: '/images/riparbella01-moneyless.jpg', theme: 'Astrattismo, scuola e riflessi',
    shortIt: 'Un’opera astratta a spray che dialoga con l’edificio scolastico degli anni Trenta e con i riflessi delle finestre.',
    fullIt: 'È l’unico murale realizzato a spray e l’unico con bozza presentata prima alla Soprintendenza, poiché si trova su un edificio scolastico del 1930. Richiama astrattismo, avanguardie, Kandinsky, movimento e musica. In alcune ore del giorno si riflette nelle finestre della palestra antistante, creando l’illusione di vetrate dipinte.',
    shortEn: 'An abstract spray-painted work that dialogues with the 1930s school building and window reflections.',
    fullEn: 'This is the only mural painted with spray and the only one whose sketch was presented in advance to the heritage authority, as it stands on a 1930s school building. It recalls abstraction, avant-garde art, Kandinsky, movement and music. At certain times of day it reflects in the windows of the nearby gym, creating the illusion of painted glass.'
  },
  {
    id: 'esperienza-vita', title: 'L’esperienza più bella della nostra vita', artist: 'Giacomo Martellacci, Arianna Martucci e bambini della scuola primaria', year: '2024',
    place: 'Via Gramsci, muro di cinta della scuola elementare', coords: [43.363260, 10.598045], image: '/images/esperienza-vita.jpg', theme: 'Workshop, natura e comunità',
    shortIt: 'Un muro realizzato con i bambini per raccontare uva, cinghiali, campagna e mare.',
    fullIt: 'L’opera nasce da un workshop con i bambini della scuola primaria, che hanno potuto capire come nasce la street art, realizzare bozzetti e colorare il muro. Il dipinto racconta gli elementi naturali del paesaggio di Riparbella: l’uva, i cinghiali, la campagna e il mare che fa da sfondo ai panorami del paese.',
    shortEn: 'A wall created with children to portray grapes, wild boars, countryside and the sea.',
    fullEn: 'The mural was created through a workshop with primary school children, who learned how street art is born, made sketches and actively painted the wall. The work portrays natural elements of Riparbella’s landscape: grapes, wild boars, countryside and the sea that frames the village views.'
  },
  {
    id: 'la-gioia', title: 'La Gioia', artist: 'Vincenzo Marano Esposito', year: '2020',
    place: 'Piazza della Madonna', coords: [43.365343, 10.600444], image: '/images/la-gioia.jpg', theme: 'Autoritratto del borgo',
    shortIt: 'Una celebrazione poetica dei paesaggi, dei vigneti, degli oliveti e della gioia di vivere a Riparbella.',
    fullIt: 'Il murale rappresenta l’anima del borgo: colline, vigneti, oliveti, boschi e panorami verso il mare. È quasi un autoritratto di Riparbella, paese sviluppato lungo il crinale e circondato da una natura intensa. L’artista racconta la gioia di vivere qui e l’abbraccio caldo ricevuto dagli abitanti.',
    shortEn: 'A poetic celebration of landscapes, vineyards, olive groves and the joy of living in Riparbella.',
    fullEn: 'The mural represents the soul of the village: hills, vineyards, olive groves, woods and views towards the sea. It is almost a self-portrait of Riparbella, a village stretching along the ridge and surrounded by powerful nature. The artist portrays the joy of living here and the warm welcome received from local people.'
  },
  {
    id: 'amphora', title: 'Amphora', artist: 'Tellas', year: '2025',
    place: 'Piazza Matteotti', coords: [43.364857, 10.599860], image: '/images/amphora.jpg', theme: 'Vino, olivi, vigneti e sgraffito',
    shortIt: 'Un’anfora contemporanea custodisce l’essenza rurale di Riparbella, tra vino, olivi e memoria del paesaggio.',
    fullIt: 'Come l’anfora conserva il vino e la sua storia, il murale custodisce immagini del territorio rurale: olivi, vigneti e paesaggio. L’opera dialoga con la tradizione toscana dello sgraffito, riprendendone bicromia e sapore compositivo. Il muro non è semplice sfondo, ma materia da cui il paesaggio sembra emergere.',
    shortEn: 'A contemporary amphora preserves Riparbella’s rural essence through wine, olive trees and landscape memory.',
    fullEn: 'Just as an amphora preserves wine and its history, the mural holds images of the rural territory: olive trees, vineyards and landscape. The work dialogues with the Tuscan tradition of sgraffito, echoing its two-colour language and compositional flavour. The wall is not just a background, but the matter from which the landscape seems to emerge.'
  },
  {
    id: 'corona-aurea', title: 'Corona aurea', artist: 'Giorgio Bartocci', year: '2025',
    place: 'Centro storico, nei pressi del Museo C’ERA', coords: [43.364477, 10.598745], image: '/images/corona-aurea.jpg', theme: 'Etruschi, oro e armonia',
    shortIt: 'Un omaggio alla corona funeraria etrusca conservata al Museo C’ERA e alla continuità tra passato e futuro.',
    fullIt: 'L’opera rende omaggio alla corona funeraria conservata nel Museo C’ERA, reperto prezioso rinvenuto negli scavi di Belora. L’uso dell’oro richiama il valore sacrale dell’oggetto e la composizione vorticosa rimanda alla storia dell’arte, al Rinascimento e all’idea di un’umanità unita. La luce cambia la percezione dell’opera durante il giorno.',
    shortEn: 'A tribute to the Etruscan funerary crown kept in the C’ERA Museum and to continuity between past and future.',
    fullEn: 'The work pays tribute to the funerary crown kept in the C’ERA Museum, a precious artefact found in the Belora excavations. Gold evokes the sacred value of the object, while the swirling composition refers to art history, the Renaissance and the idea of humanity as a whole. Daylight constantly changes the perception of the mural.'
  },
  {
    id: 'hunting-hunters', title: 'Hunting Hunters', artist: 'Hitnes', year: '2025',
    place: 'Via della Noce 1', coords: [43.364107, 10.597916], image: '/images/hunting-hunters.jpg', theme: 'Animali, ironia e caccia ribaltata',
    shortIt: 'Pettirosso e gazze ladre entrano in una favola ironica dove il cacciatore potrebbe diventare la preda.',
    fullIt: 'Hitnes racconta una scena ispirata agli uccelli dei boschi intorno al borgo e al rapporto spontaneo tra uomo e natura. Un pettirosso, simbolo di gentilezza e sacrificio, si trova al centro della scena; intorno volano gazze ladre, simbolo di astuzia. La trappola nascosta ribalta il punto di vista: chi sta cacciando chi?',
    shortEn: 'A robin and magpies enter an ironic fable where the hunter may become the prey.',
    fullEn: 'Hitnes depicts a scene inspired by birds from the woods around the village and by the spontaneous relationship between people and nature. A robin, symbol of kindness and sacrifice, stands at the centre; magpies, symbols of cunning, fly around it. A hidden trap reverses the perspective: who is hunting whom?'
  },
  {
    id: 'aris', title: 'Omaggio etrusco', artist: 'Aris', year: '2025',
    place: 'Via della Noce', coords: [43.363711, 10.598080], image: '/images/aris.jpg', theme: 'Vasi etruschi e Pietro Leopoldo',
    shortIt: 'Un tributo alle origini etrusche di Riparbella, ai vasi del Museo C’ERA e al Granduca Pietro Leopoldo.',
    fullIt: 'Aris trae ispirazione dai reperti dell’abitato di Belora conservati nel Museo C’ERA, in particolare dai vasi e dai manufatti della vita quotidiana etrusca. L’opera recupera l’icona del vaso con linguaggio contemporaneo e rende omaggio a Pietro Leopoldo, figura centrale nella valorizzazione delle antichità etrusche in Toscana.',
    shortEn: 'A tribute to Riparbella’s Etruscan roots, the vases of the C’ERA Museum and Grand Duke Pietro Leopoldo.',
    fullEn: 'Aris takes inspiration from the artefacts of Belora preserved in the C’ERA Museum, especially vases and objects from Etruscan daily life. The mural reinterprets the icon of the vase in a contemporary language and pays homage to Pietro Leopoldo, a key figure in the appreciation of Etruscan antiquities in Tuscany.'
  },
  {
    id: 'sonno-turan', title: 'Il sonno di Turan', artist: 'Vesod', year: '2025',
    place: 'Via Gramsci, palestra comunale', coords: [43.363456, 10.598161], image: '/images/sonno-turan.jpg', theme: 'Liberazione, amore e pace',
    shortIt: 'Turan, dea etrusca dell’amore, dorme tra memoria e rinascita: al suo risveglio dissolve le ombre della guerra.',
    fullIt: 'L’opera celebra gli 80 anni dalla Liberazione dal Fascismo attraverso una lettura universale: liberazione come amore, pace e superamento delle oppressioni. Turan è sdraiata e riflessa nell’acqua, il suo profilo si fonde con la collina di Riparbella e con il mare. Il cigno nero, il melograno e la colomba bianca amplificano il tema della trasformazione e della speranza.',
    shortEn: 'Turan, Etruscan goddess of love, sleeps between memory and rebirth: when she wakes, she dissolves the shadows of war.',
    fullEn: 'The work celebrates the 80th anniversary of Liberation from Fascism through a universal interpretation: liberation as love, peace and freedom from oppression. Turan lies reflected in water, her profile merging with Riparbella’s hill and the sea. The black swan, pomegranate and white dove deepen the themes of transformation and hope.'
  }
];

const center = [43.36417, 10.59873];
const routeCoords = MURALES.map(m => m.coords);

function pinIcon(index, active) {
  return L.divIcon({
    className: `custom-pin ${active ? 'active' : ''}`,
    html: `<span>${index + 1}</span>`,
    iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -30]
  });
}

function FlyTo({ coords }) {
  const map = useMap();
  React.useEffect(() => { map.flyTo(coords, 18, { duration: 0.8 }); }, [coords, map]);
  return null;
}

function mapsLinks(mural) {
  const [lat, lng] = mural.coords;
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`,
    apple: `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=w`,
  };
}
function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = value => (value * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function totalRouteMeters(items) {
  return items.slice(1).reduce((sum, item, index) => sum + distanceMeters(items[index].coords, item.coords), 0);
}
function routeMapLink(items) {
  const origin = items[0].coords.join(',');
  const destination = items[items.length - 1].coords.join(',');
  const waypoints = items.slice(1, -1).map(m => m.coords.join(',')).join('|');
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodeURIComponent(waypoints)}&travelmode=walking`;
}
function shareMural(mural) {
  const url = `${window.location.origin}${window.location.pathname}#${mural.id}`;
  const text = `${mural.title} - Murales di Riparbella`;
  if (navigator.share) navigator.share({ title: text, text, url }).catch(() => {});
  else { navigator.clipboard?.writeText(url); alert('Link copiato negli appunti'); }
}

function speak(text, lang) {
  if (!('speechSynthesis' in window)) {
    alert('La lettura vocale non è supportata da questo browser.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'it' ? 'it-IT' : 'en-GB';
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

function App() {
  const [language, setLanguage] = useState('it');
  const [selectedId, setSelectedId] = useState(MURALES[0].id);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const detailRef = useRef(null);

  function openMural(id, options = { scroll: true }) {
    setSelectedId(id);
    setExpanded(false);
    if (options.scroll) {
      window.setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }

  useEffect(() => {
    const idFromHash = window.location.hash.replace('#', '');
    if (idFromHash && MURALES.some(m => m.id === idFromHash)) {
      setSelectedId(idFromHash);
      window.setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', `#${selectedId}`);
  }, [selectedId]);
  const selected = useMemo(() => MURALES.find(m => m.id === selectedId) || MURALES[0], [selectedId]);
  const selectedIndex = MURALES.findIndex(m => m.id === selected.id);
  const next = MURALES[(selectedIndex + 1) % MURALES.length];
  const links = mapsLinks(selected);
  const short = language === 'it' ? selected.shortIt : selected.shortEn;
  const full = language === 'it' ? selected.fullIt : selected.fullEn;
  const years = useMemo(() => ['all', ...Array.from(new Set(MURALES.map(m => m.year))).sort()], []);
  const filteredMurales = useMemo(() => {
    const clean = query.trim().toLowerCase();
    return MURALES.filter(m => {
      const matchesYear = year === 'all' || m.year === year;
      const text = `${m.title} ${m.artist} ${m.place} ${m.theme}`.toLowerCase();
      return matchesYear && (!clean || text.includes(clean));
    });
  }, [query, year]);
  const routeDistance = Math.round(totalRouteMeters(MURALES) / 10) * 10;
  const routeMinutes = Math.max(10, Math.round(routeDistance / 75));

  const labels = {
    it: {
      heroTitle: 'Murales di Riparbella',
      heroText: 'Un percorso d’arte urbana tra memoria, paesaggio, scuola e comunità.',
      start: 'Inizia il percorso', map: 'Vedi la mappa', choose: 'Scegli un murale',
      route: 'Percorso consigliato', routeText: 'Un itinerario nel borgo da vivere a piedi: scegli una tappa dalla mappa o dall'elenco e avvia la navigazione solo verso il murale selezionato.',    list: 'Tappe', guide: 'Guida interattiva', details: 'Approfondimento', readMore: 'Leggi di più', readLess: 'Riduci testo',
      listen: 'Ascolta guida', google: 'Portami qui con Google Maps', apple: 'Apri in Apple Maps', next: 'Prossima tappa',
      artist: 'Artista', year: 'Anno', place: 'Dove si trova', theme: 'Tema', qr: 'Scheda QR',
      project: 'Il progetto', projectText: 'Questa web app raccoglie i murales di Riparbella in un itinerario digitale bilingue, con foto, descrizioni e navigazione verso ogni opera.', search: 'Cerca murale, artista o luogo', allYears: 'Tutti gli anni', estimated: 'Tempo medio tra tappe', guideLabel: 'Guida bilingue', muralLabel: 'Murales censiti', walkLabel: 'Percorso a piedi', share: 'Condividi scheda', noResults: 'Nessun murale trovato con questi filtri.'
    },
    en: {
      heroTitle: 'Murals of Riparbella',
      heroText: 'An urban art route through memory, landscape, school and community.',
      start: 'Start the route', map: 'View the map', choose: 'Choose a mural',
      route: 'Suggested route', routeText: 'A walking route through the village: choose a stop from the map or list and start navigation only to the selected mural.',
      list: 'Stops', guide: 'Interactive guide', details: 'More details', readMore: 'Read more', readLess: 'Show less',
      listen: 'Listen to guide', google: 'Take me here with Google Maps', apple: 'Open in Apple Maps', next: 'Next stop',
      artist: 'Artist', year: 'Year', place: 'Location', theme: 'Theme', qr: 'QR page',
      project: 'The project', projectText: 'This web app brings together the murals of Riparbella in a bilingual digital route, with photos, descriptions and navigation to each artwork.', search: 'Search mural, artist or place', allYears: 'All years', estimated: 'Average time between stops', guideLabel: 'Bilingual guide', muralLabel: 'Murals listed', walkLabel: 'Walking route', share: 'Share page', noResults: 'No mural found with these filters.'
    }
  }[language];

  return (
    <div className="app">
      <header className="hero">
        <nav className="topbar">
          <div className="brand">Riparbella Street Art</div>
          <div className="lang-switch" aria-label="Language selector">
            <button className={language === 'it' ? 'selected' : ''} onClick={() => setLanguage('it')}>ITA</button>
            <button className={language === 'en' ? 'selected' : ''} onClick={() => setLanguage('en')}>ENG</button>
          </div>
        </nav>
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Outdoor museum</p>
            <h1>{labels.heroTitle}</h1>
            <p className="hero-text">{labels.heroText}</p>
            <div className="hero-actions">
              <a href="#mappa" className="primary-btn">{labels.start}</a>
              <a href="#mappa" className="ghost-btn">{labels.map}</a>
              <a href="#schede" className="ghost-btn">{labels.choose}</a>
            </div>
          </div>
          <div className="hero-photo">
            <img src={selected.image} alt={selected.title} />
            <span>{selected.title} · {selected.artist}</span>
          </div>
        </div>
      </header>

      <main>
        <section className="intro-card">
          <div>
            <h2>{labels.route}</h2>
            <p>{labels.routeText}</p>
          </div>
          <div className="stats" aria-label="Riepilogo percorso">
            <div className="stat-item">
              <strong>{MURALES.length}</strong>
              <span>{labels.muralLabel}</span>
            </div>
            <div className="stat-item">
              <strong>IT/EN</strong>
              <span>{labels.guideLabel}</span>
            </div>
            <div className="stat-item">
              <strong>{routeMinutes} min</strong>
              <span>{labels.estimated}</span>
            </div>
            <div className="stat-item soft">
              <strong>↗</strong>
              <span>{labels.walkLabel}</span>
            </div>
          </div>
        </section>

        <section className="layout" id="mappa">
          <aside className="sidebar" id="schede">
            <h2>{labels.list}</h2>
            <div className="filters">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={labels.search} />
              <select value={year} onChange={e => setYear(e.target.value)}>
                {years.map(y => <option key={y} value={y}>{y === 'all' ? labels.allYears : y}</option>)}
              </select>
            </div>
            {filteredMurales.length === 0 && <p className="empty">{labels.noResults}</p>}
            <div className="stops">
              {filteredMurales.map((mural) => (
                <button key={mural.id} className={`stop ${mural.id === selected.id ? 'active' : ''}`} onClick={() => openMural(mural.id)}>
                  <span>{MURALES.findIndex(item => item.id === mural.id) + 1}</span>
                  <div><strong>{mural.title}</strong><small>{mural.artist} · {mural.year}</small></div>
                </button>
              ))}
            </div>
          </aside>

          <section className="map-panel">
            <MapContainer center={center} zoom={17} scrollWheelZoom={false} className="map">
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polyline positions={routeCoords} pathOptions={{ color: '#f97316', weight: 4, opacity: 0.8 }} />
              {MURALES.map((mural, index) => (
                <Marker key={mural.id} position={mural.coords} icon={pinIcon(index, mural.id === selected.id)} eventHandlers={{ click: () => openMural(mural.id) }}>
                  <Popup><strong>{mural.title}</strong><br />{mural.artist}<br /><button className="popup-btn" onClick={() => openMural(mural.id)}>Apri scheda</button></Popup>
                </Marker>
              ))}
              <FlyTo coords={selected.coords} />
            </MapContainer>
          </section>
        </section>

        <section className="detail-card" ref={detailRef} tabIndex="-1">
          <div className="detail-image"><img src={selected.image} alt={selected.title} /></div>
          <div className="detail-content">
            <p className="eyebrow">{selectedIndex + 1} / {MURALES.length}</p>
            <h2>{selected.title}</h2>
            <div className="meta-grid">
              <p><span>{labels.artist}</span>{selected.artist}</p>
              <p><span>{labels.year}</span>{selected.year}</p>
              <p><span>{labels.theme}</span>{selected.theme}</p>
              <p><span>{labels.place}</span>{selected.place}</p>
            </div>

            <div className="guide-box">
              <h3>{labels.guide}</h3>
              <p>{short}</p>
              {expanded && <p>{full}</p>}
              <div className="guide-actions">
                <button onClick={() => setExpanded(!expanded)}>{expanded ? labels.readLess : labels.readMore}</button>
                <button onClick={() => speak(`${selected.title}. ${short}. ${full}`, language)}>{labels.listen}</button>
              </div>
            </div>

            <div className="nav-actions">
              <a href={links.google} target="_blank" rel="noreferrer">{labels.google}</a>
              <a href={links.apple} target="_blank" rel="noreferrer">{labels.apple}</a>
              <button onClick={() => shareMural(selected)}>{labels.share}</button>
            </div>

            <button className="next-stop" onClick={() => openMural(next.id)}>
              {labels.next}: <strong>{next.title}</strong>
            </button>
          </div>
        </section>

        <section className="project-card">
          <h2>{labels.project}</h2>
          <p>{labels.projectText}</p>
          <p className="note">Suggerimento futuro: ogni murale può avere un QR code dedicato che apre direttamente la sua scheda nella web app.</p>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
