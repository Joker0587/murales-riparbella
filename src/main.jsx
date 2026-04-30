import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const murals = [
  { id:'lari', title:'I Lari', year:'2024', artist:'Giò Pistone', address:'Piazza Giacomo Matteotti, muro palazzo davanti al bar “I Lari”', lat:43.364712, lng:10.600194, image:'/images/lari.jpg', theme:{it:'Tre lari familiaris etruschi e romani trasformano il vecchio palazzo di giustizia e le antiche carceri in un segno di protezione, gioia e libertà.', en:'Three Etruscan and Roman household guardians turn the former courthouse and prison building into a symbol of protection, joy and freedom.'}},
  { id:'memoria', title:'Memoria e desiderio', year:'2024', artist:'Daniel Muñoz', address:'Piazza Giacomo Matteotti, facciata principale palazzo del bar', lat:43.364856, lng:10.600028, image:'/images/memoria-desiderio.jpg', theme:{it:'Una mappa artistica e non convenzionale di Riparbella, costruita con memorie, emozioni, profumi e desideri raccolti dai cittadini e dai ragazzi della scuola.', en:'An unconventional artistic map of Riparbella, shaped by memories, emotions, scents and wishes collected from citizens and school students.'}},
  { id:'amore', title:'L’amore nella pentola', year:'2024', artist:'Zed 1', address:'Piazza Borgo di Sotto', lat:43.364169, lng:10.598239, image:'/images/amore-pentola.jpg', theme:{it:'Racconta una tradizione popolare: il piombo sciolto nella pentola e interpretato dalle giovani donne per immaginare il futuro sposo.', en:'It tells a local folk tradition: melted lead poured into a pot and interpreted by young women to imagine their future husband.'}},
  { id:'terra', title:'Terra e colori', year:'2024', artist:'Mina Hamada e Zosen Bandido', address:'Piazza Federigo Baldasserini', lat:43.363962, lng:10.597198, image:'/images/terra-colori.jpg', theme:{it:'Onde, sole, luna, olio, vino e paesaggio diventano forme astratte e simboliche dai colori caldi e accesi.', en:'Waves, sun, moon, olive oil, wine and landscape become abstract and symbolic shapes in warm, vivid colours.'}},
  { id:'universo', title:'Universo Riparbella', year:'2021', artist:'Vincenzo Marano Esposito con i bambini della scuola primaria', address:'Via della Noce', lat:43.364022, lng:10.597914, image:'/images/universo-riparbella.jpg', theme:{it:'Un grande gioco dell’oca urbano nato dai bambini, con caselle ispirate all’Agenda 2030 e allo slogan “Riparbella che insegna”.', en:'A large urban board-game created with children, with squares inspired by the 2030 Agenda and the motto “Riparbella teaches”.'}},
  { id:'riparbella01', title:'Riparbella01', year:'2024', artist:'Moneyless', address:'Via della Noce 15, facciata laterale edificio scolastico', lat:43.36425, lng:10.59815, image:'/images/riparbella01-moneyless.jpg', theme:{it:'Un’opera astratta realizzata a spray, con richiami alle avanguardie, al movimento, alla musica e a Kandinsky.', en:'An abstract spray-painted work recalling the avant-gardes, movement, music and Kandinsky.'}},
  { id:'esperienza', title:'L’esperienza più bella della nostra vita', year:'2024', artist:'Giacomo Martellacci, Arianna Martucci e bambini della scuola primaria', address:'Via Gramsci, muro di cinta della scuola elementare', lat:43.363260, lng:10.598045, image:'/images/esperienza-vita.jpg', theme:{it:'Un’opera collettiva che racconta uva, cinghiali, campagna e mare: gli elementi naturali del paesaggio riparbellino.', en:'A collective work portraying grapes, wild boars, countryside and sea: the natural elements of Riparbella’s landscape.'}},
  { id:'gioia', title:'La Gioia', year:'2020', artist:'Vincenzo Marano Esposito / Vinci', address:'Piazza della Madonna', lat:43.365343, lng:10.600444, image:'/images/la-gioia.jpg', theme:{it:'Un autoritratto poetico di Riparbella: colline, vigneti, oliveti, boschi e panorami verso il mare.', en:'A poetic self-portrait of Riparbella: hills, vineyards, olive groves, woods and views towards the sea.'}},
  { id:'amphora', title:'Amphora', year:'2025', artist:'Tellas', address:'Piazza Matteotti', lat:43.364857, lng:10.599860, image:'/images/amphora.jpg', theme:{it:'L’anfora diventa contenitore di paesaggio e memoria rurale, richiamando olivi, vigneti e la tradizione dello sgraffito toscano.', en:'The amphora becomes a vessel for rural landscape and memory, evoking olive trees, vineyards and the Tuscan sgraffito tradition.'}},
  { id:'corona', title:'Corona Aurea', year:'2025', artist:'Giorgio Bartocci', address:'Centro storico, nei pressi del Museo C’ERA', lat:43.364477, lng:10.598745, image:'/images/corona-aurea.jpg', theme:{it:'Omaggio alla corona funeraria del Museo C’ERA: un vortice prezioso di colore, memoria etrusca e riflessione collettiva.', en:'A tribute to the funerary crown kept at the C’ERA Museum: a precious vortex of colour, Etruscan memory and collective reflection.'}},
  { id:'hitnes', title:'Hunting Hunters', year:'2025', artist:'Hitnes', address:'Via della Noce 1', lat:43.364107, lng:10.597916, image:'/images/hunting-hunters.jpg', theme:{it:'Un racconto ironico tra pettirosso e gazze ladre: una favola visiva in cui il cacciatore potrebbe diventare preda.', en:'An ironic tale of a robin and magpies: a visual fable in which the hunter may become the hunted.'}},
  { id:'aris', title:'Omaggio etrusco e Pietro Leopoldo', year:'2025', artist:'Aris', address:'Via della Noce', lat:43.363711, lng:10.598080, image:'/images/aris.jpg', theme:{it:'Un tributo alle origini etrusche di Riparbella, ai vasi del Museo C’ERA e alla figura del Granduca Pietro Leopoldo.', en:'A tribute to Riparbella’s Etruscan origins, to the vessels of the C’ERA Museum and to Grand Duke Pietro Leopoldo.'}},
  { id:'turan', title:'Il sonno di Turan', year:'2025', artist:'Vesod', address:'Via Gramsci, palestra comunale', lat:43.363456, lng:10.598161, image:'/images/sonno-turan.jpg', theme:{it:'Un omaggio a Turan, dea etrusca dell’amore e della vitalità, che trasforma la Liberazione in messaggio di pace e rinascita.', en:'A tribute to Turan, Etruscan goddess of love and vitality, turning Liberation into a message of peace and rebirth.'}}
];

function mapsUrl(m) { return `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`; }
function appleMapsUrl(m) { return `https://maps.apple.com/?daddr=${m.lat},${m.lng}`; }

function App() {
  const [selectedId, setSelectedId] = useState(murals[0].id);
  const [lang, setLang] = useState('it');
  const selected = useMemo(() => murals.find(m => m.id === selectedId) || murals[0], [selectedId]);
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=10.5955%2C43.3626%2C10.6015%2C43.3658&layer=mapnik&marker=${selected.lat}%2C${selected.lng}`;

  return <div className="app">
    <header className="hero">
      <div>
        <p className="eyebrow">Guida interattiva</p>
        <h1>Murales di Riparbella</h1>
        <p>Un itinerario tra arte pubblica, memoria, paesaggio e comunità. Seleziona un’opera, leggi la guida e fatti portare davanti al murale.</p>
      </div>
      <div className="hero-card">
        <strong>{murals.length}</strong>
        <span>opere nel percorso</span>
      </div>
    </header>

    <main className="layout">
      <aside className="sidebar">
        <div className="toolbar">
          <button className={lang === 'it' ? 'active' : ''} onClick={() => setLang('it')}>ITA</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>ENG</button>
        </div>
        <div className="list">
          {murals.map((m, i) => <button key={m.id} className={`mural-button ${m.id === selected.id ? 'selected' : ''}`} onClick={() => setSelectedId(m.id)}>
            <span className="index">{String(i + 1).padStart(2, '0')}</span>
            <span><strong>{m.title}</strong><small>{m.artist}</small></span>
          </button>)}
        </div>
      </aside>

      <section className="content">
        <article className="card detail">
          <img src={selected.image} alt={`${selected.title} - ${selected.artist}`} />
          <div className="detail-body">
            <p className="eyebrow">{selected.year} · {selected.address}</p>
            <h2>{selected.title}</h2>
            <h3>{selected.artist}</h3>
            <p className="theme">{selected.theme[lang]}</p>
            <div className="guide">
              <strong>{lang === 'it' ? 'Guida interattiva' : 'Interactive guide'}</strong>
              <p>{lang === 'it'
                ? `Sei davanti a “${selected.title}”. Osserva il rapporto tra l’opera e l’edificio: qui il murale non decora soltanto una parete, ma racconta una parte dell’identità di Riparbella.`
                : `You are in front of “${selected.title}”. Notice how the artwork relates to the building: this mural does not simply decorate a wall, it tells part of Riparbella’s identity.`}</p>
            </div>
            <div className="actions">
              <a href={mapsUrl(selected)} target="_blank" rel="noreferrer">Apri Google Maps</a>
              <a href={appleMapsUrl(selected)} target="_blank" rel="noreferrer" className="secondary">Apri Apple Maps</a>
            </div>
          </div>
        </article>

        <article className="card map-card">
          <div className="map-header">
            <div><strong>Mappa del percorso</strong><span>{selected.lat}, {selected.lng}</span></div>
            <a href={mapsUrl(selected)} target="_blank" rel="noreferrer">Portami qui</a>
          </div>
          <iframe title="Mappa murales Riparbella" src={mapSrc}></iframe>
        </article>
      </section>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
