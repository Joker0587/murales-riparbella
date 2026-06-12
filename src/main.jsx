
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const murals = [
  {
    id: 'gioia',
    title: 'La Gioia',
    artist: 'Vincenzo Marano Esposito, in arte Vinci',
    year: '2020',
    address: 'Piazza della Madonna',
    lat: 43.365343,
    lng: 10.600444,
    image: '/images/la-gioia.jpg?v=41',
    tags: ['Paesaggio', 'Natura', 'Identità'],
    detailsToFind: ['le colline', 'i vigneti e gli oliveti', 'il bosco', 'il mare all’orizzonte', 'l’abbraccio della natura'],
    observe: 'Osserva il borgo come se fosse un autoritratto: colline, vigneti, oliveti, boschi e mare all’orizzonte.',
    directionsNext: 'Scendi verso Piazza Giacomo Matteotti: la prossima tappa è il murale I Lari, sul palazzo davanti al bar.',
    it: `La visita può iniziare da Piazza della Madonna, davanti a un’opera che sembra aprire una finestra sul paesaggio di Riparbella. Vinci trasforma la facciata in un racconto del borgo: le colline, i vigneti, gli oliveti e il mare all’orizzonte diventano un autoritratto poetico del paese. Fermati qualche istante: il murale non descrive solo un panorama, ma la sensazione di vivere in un luogo raccolto, luminoso e abbracciato dalla natura.`,
    en: `The visit can begin in Piazza della Madonna, in front of a mural that feels like a window onto Riparbella’s landscape. Vinci turns the façade into a portrait of the village: hills, vineyards, olive groves and the sea on the horizon become a poetic self-portrait of the town. Take a moment here: the work is not just a view, but the feeling of living in a bright, intimate place embraced by nature.`,
    tagsEn: ["Landscape", "Nature", "Identity"],
    detailsToFindEn: ["the hills", "vineyards and olive groves", "the woodland", "the sea on the horizon", "nature’s embrace"],
    observeEn: "Look at the village as if it were a self-portrait: hills, vineyards, olive groves, woods and the sea on the horizon.",
    directionsNextEn: "Walk down towards Piazza Giacomo Matteotti: the next stop is I Lari, on the building opposite the bar.",
  },
  {
    id: 'lari',
    title: 'I Lari',
    artist: 'Giò Pistone',
    year: '2024',
    address: 'Piazza Giacomo Matteotti, muro del palazzo davanti al bar I Lari',
    lat: 43.364712,
    lng: 10.600194,
    image: '/images/lari.jpg',
    tags: ['Memoria', 'Comunità', 'Protezione'],
    detailsToFind: ['i tre Lari protettori', 'i colori forti e luminosi', 'il dialogo con l’antico palazzo di giustizia', 'l’idea di protezione della casa'],
    observe: 'Osserva i tre stendardi colorati: sono una reinterpretazione dei Lari, antichi protettori della casa e della famiglia.',
    directionsNext: 'Rimani in Piazza Giacomo Matteotti e spostati di pochi passi verso la facciata principale del palazzo del bar Memoria e desiderio.',
    it: `In Piazza Matteotti, Giò Pistone interviene su un edificio carico di memoria: l’antico palazzo di giustizia con le sue carceri. L’artista sceglie colori pieni, netti, quasi festosi, per trasformare un passato severo in un’immagine di protezione e rinascita. I tre Lari, antichi spiriti custodi della casa e della famiglia, vegliano oggi sulla piazza come presenze benevole: un invito a guardare il borgo con occhi nuovi.`,
    en: `In Piazza Matteotti, Giò Pistone works on a building filled with memory: the old courthouse and its former jail. The artist uses bold, joyful colours to turn a severe past into an image of protection and renewal. The three Lares, ancient guardians of home and family, now watch over the square as benevolent presences: an invitation to see the village with fresh eyes.`,
    tagsEn: ["Memory", "Community", "Protection"],
    detailsToFindEn: ["the three protective Lares", "the strong bright colours", "the dialogue with the old courthouse", "the idea of protecting the home"],
    observeEn: "Look at the three colourful banners: they reinterpret the Lares, ancient protectors of the home and family.",
    directionsNextEn: "Stay in Piazza Giacomo Matteotti and move a few steps towards the main façade of the building of the bar Memoria e desiderio.",
  },
  {
    id: 'memoria',
    title: 'Memoria e desiderio',
    artist: 'Daniel Muñoz',
    year: '2024',
    address: 'Piazza Giacomo Matteotti, facciata principale del palazzo del bar Memoria e desiderio',
    lat: 43.364856,
    lng: 10.600028,
    image: '/images/memoria-desiderio.jpg',
    tags: ['Memoria', 'Desiderio', 'Mappa emotiva'],
    detailsToFind: ['la mappa non convenzionale del paese', 'i luoghi della memoria raccontati dai cittadini', 'i desideri disegnati dai ragazzi', 'la legenda sulla facciata laterale'],
    observe: 'Guarda la facciata come fosse una mappa non convenzionale: non indica solo strade, ma ricordi, emozioni e desideri.',
    directionsNext: 'Resta nell’area di Piazza Matteotti: la prossima opera è Amphora, sempre in zona piazza.',
    it: `Questa grande facciata è una mappa sentimentale di Riparbella. Daniel Muñoz parte dalla vista dall’alto del paese, ma al posto di una cartografia tradizionale inserisce ricordi, profumi, abitudini e desideri raccolti parlando con cittadini e studenti. Avvicinandoti, cerca i piccoli segni: raccontano panchine, sapori, storie familiari e sogni futuri. È una mappa da leggere lentamente, più con la memoria che con l’orientamento.`,
    en: `This large façade is an emotional map of Riparbella. Daniel Muñoz starts from an aerial view of the village, but instead of a traditional map he fills it with memories, scents, habits and wishes gathered from residents and students. Look closely for the small signs: they speak of benches, flavours, family stories and future dreams. It is a map to read slowly, with memory more than direction.`,
    tagsEn: ["Memory", "Desire", "Emotional map"],
    detailsToFindEn: ["the unconventional map of the village", "places of memory told by residents", "the wishes drawn by children", "the legend on the side façade"],
    observeEn: "Look at the façade as if it were an unconventional map: it does not show only streets, but memories, emotions and wishes.",
    directionsNextEn: "Stay around Piazza Matteotti: the next work is Amphora, still near the square.",
  },
  {
    id: 'amphora',
    title: 'Amphora',
    artist: 'Tellas',
    year: '2025',
    address: 'Piazza Matteotti',
    lat: 43.364857,
    lng: 10.59986,
    image: '/images/amphora.jpg',
    tags: ['Vino', 'Sgraffito', 'Territorio'],
    detailsToFind: ['la forma dell’anfora', 'olivi e vigneti', 'la bicromia ispirata allo sgraffito', 'il paesaggio che sembra nascere dal muro'],
    observe: 'Guarda la bicromia e il modo in cui il paesaggio sembra emergere direttamente dalla superficie del muro.',
    directionsNext: 'Prosegui verso il centro espositivo Museo C’ERA per raggiungere Corona Aurea.',
    it: `Amphora racconta la campagna riparbellina attraverso un linguaggio essenziale e raffinato. Tellas guarda agli olivi, ai vigneti e alla tradizione agricola del territorio, richiamando l’anfora come contenitore di vino, memoria e paesaggio. La bicromia rimanda allo sgraffito toscano: sembra che l’opera non sia stata semplicemente dipinta sul muro, ma sia emersa dalla sua stessa materia.`,
    en: `Amphora tells the story of Riparbella’s countryside through an elegant, essential visual language. Tellas looks to olive trees, vineyards and the area’s farming tradition, using the amphora as a vessel for wine, memory and landscape. The two-tone composition recalls Tuscan sgraffito: the work seems not simply painted on the wall, but emerging from the wall itself.`,
    tagsEn: ["Wine", "Sgraffito", "Territory"],
    detailsToFindEn: ["the amphora shape", "olive trees and vineyards", "the two-colour style inspired by sgraffito", "the landscape that seems to emerge from the wall"],
    observeEn: "Notice the two-colour effect and the way the landscape seems to emerge directly from the wall surface.",
    directionsNextEn: "Continue towards the C’ERA exhibition centre to reach Corona Aurea.",
  },
  {
    id: 'corona',
    title: 'Corona Aurea',
    artist: 'Giorgio Bartocci',
    year: '2025',
    address: 'Nei pressi del Museo C’ERA',
    lat: 43.364477,
    lng: 10.598745,
    image: '/images/corona-aurea.jpg',
    tags: ['Etruschi', 'Museo C’ERA', 'Oro'],
    detailsToFind: ['i riflessi metallici', 'il movimento circolare', 'il richiamo alla corona funeraria', 'le pennellate che sembrano uscire dal muro'],
    observe: 'Cerca il movimento circolare e i riflessi metallici: richiamano la corona funeraria conservata nel Museo C’ERA.',
    directionsNext: 'Scendi verso Piazza Borgo di Sotto: lì trovi L’amore nella pentola.',
    it: `Davanti a questa opera, il filo che unisce arte urbana e storia etrusca diventa evidente. Giorgio Bartocci si ispira alla preziosa corona funeraria conservata al Museo C’ERA e la traduce in un movimento vorticoso di segni, colori e riflessi metallici. L’opera cambia con la luce e invita a osservare il muro come una reliquia contemporanea: un omaggio alla memoria, alla bellezza e alla continuità fra passato e presente.`,
    en: `Here, the link between street art and Etruscan history becomes clear. Giorgio Bartocci takes inspiration from the precious funerary crown preserved at the C’ERA Museum and translates it into a swirling movement of marks, colours and metallic reflections. The work changes with the light and invites you to see the wall as a contemporary relic: a tribute to memory, beauty and the continuity between past and present.`,
    tagsEn: ["Etruscans", "C’ERA Museum", "Gold"],
    detailsToFindEn: ["metallic reflections", "the circular movement", "the reference to the funerary crown", "brushstrokes that seem to come out of the wall"],
    observeEn: "Look for the circular movement and metallic reflections: they recall the funerary crown preserved in the C’ERA Museum.",
    directionsNextEn: "Walk down towards Piazza Borgo di Sotto: there you will find L’amore nella pentola.",
  },
  {
    id: 'amore',
    title: 'L’amore nella pentola',
    artist: 'Zed 1',
    year: '2024',
    address: 'Piazza Borgo di Sotto',
    lat: 43.364169,
    lng: 10.598239,
    image: '/images/amore-pentola.jpg',
    tags: ['Tradizione', 'Racconti popolari', 'Cinghiale'],
    detailsToFind: ['la grande pentola', 'il fuoco della notte di San Giovanni', 'il cinghiale', 'il cavallo Gino', 'la bandiera sarda'],
    observe: 'Cerca la grande pentola, il fuoco e il cinghiale: sono dettagli che raccontano memoria popolare e cucina del territorio.',
    directionsNext: 'Prosegui verso Piazza Federigo Baldasserini, dove si trova Terra e colori.',
    it: `In Piazza Borgo di Sotto il murale di Zed1 racconta una storia popolare tramandata dagli abitanti. Durante la notte di Sant’Antonio, le donne si riunivano attorno al fuoco e scioglievano il piombo in grandi pentole; le forme ottenute venivano poi interpretate per immaginare il futuro sposo. L’opera mescola rito, ironia e vita quotidiana: accanto alla pentola compaiono il cinghiale, il cavallo Gino, il paesaggio e un omaggio alla comunità sarda.`,
    en: `In Piazza Borgo di Sotto, Zed1’s mural tells a folk story passed down by local residents. On Saint Giovanni’s night, women gathered around the fire and melted lead in large pots; once cooled, the shapes were interpreted to imagine a future husband. The work blends ritual, humour and everyday life: alongside the pot you can spot the wild boar, the horse Gino, the landscape and a tribute to the Sardinian community.`,
    tagsEn: ["Tradition", "Folk tales", "Wild boar"],
    detailsToFindEn: ["the large pot", "the fire of Saint John’s night", "the wild boar", "the horse Gino", "the Sardinian flag"],
    observeEn: "Look for the large pot, the fire and the wild boar: they are details that tell of folk memory and local food traditions.",
    directionsNextEn: "Continue towards Piazza Federigo Baldasserini, where Terra e colori is located.",
  },
  {
    id: 'terra-colori',
    title: 'Terra e colori',
    artist: 'Mina Hamada e Zosen Bandido',
    year: '2024',
    address: 'Piazza Federigo Baldasserini',
    lat: 43.363962,
    lng: 10.597198,
    image: '/images/terra-colori.jpg?v=41',
    tags: ['Natura', 'Paesaggio', 'Colori'],
    detailsToFind: ['le onde', 'il sole e la luna', 'l’oliva e i colori del vino', 'la finestra sul paesaggio', 'la lente-faro e la cazzuola'],
    observe: 'Lascia correre lo sguardo tra onde, sole, luna, vegetazione, olive e richiami al vino: è un ritratto astratto del territorio.',
    directionsNext: 'Raggiungi Via della Noce: il percorso continua con Universo Riparbella.',
    it: `Questa tappa è un’esplosione di energia. Mina Hamada e Zosen Bandido traducono Riparbella in forme morbide, simboli e colori caldi: il sole, il mare, l’olio, il vino, la vegetazione e l’arrivo nel borgo si intrecciano in una composizione vivace. Osserva l’opera come un grande mosaico contemporaneo: ogni elemento racconta una sensazione del territorio più che una semplice immagine.`,
    en: `This stop is an explosion of energy. Mina Hamada and Zosen Bandido translate Riparbella into soft shapes, symbols and warm colours: sun, sea, olive oil, wine, vegetation and the entrance to the village all flow together in a lively composition. Look at the work as a contemporary mosaic: each element conveys a feeling of the territory rather than a literal image.`,
    tagsEn: ["Nature", "Landscape", "Colours"],
    detailsToFindEn: ["the waves", "the sun and the moon", "the olive and the colours of wine", "the window onto the landscape", "the lens-lighthouse and the trowel"],
    observeEn: "Let your eyes move through waves, sun, moon, vegetation, olives and references to wine: it is an abstract portrait of the territory.",
    directionsNextEn: "Reach Via della Noce: the route continues with Universo Riparbella.",
  },
  {
    id: 'universo',
    title: 'Universo Riparbella',
    artist: 'Vincenzo Marano Esposito con i bambini della scuola primaria',
    year: '2021',
    address: 'Via della Noce',
    lat: 43.364022,
    lng: 10.597914,
    image: '/images/universo-riparbella.jpg',
    tags: ['Scuola', 'Bambini', 'Agenda 2030'],
    detailsToFind: ['il nastro giallo e azzurro', 'le caselle come un gioco dell’oca', 'i disegni dei bambini', 'i temi dell’Agenda 2030'],
    observe: 'Segui il nastro giallo e azzurro: collega le caselle ideate dai bambini come in un grande gioco dell’oca urbano.',
    directionsNext: 'Prosegui lungo Via della Noce fino a Hunting Hunters.',
    it: `Via della Noce diventa qui un percorso dentro l’immaginazione dei bambini. Nato da un laboratorio con la scuola primaria, il murale trasforma la strada in una sorta di gioco dell’oca dedicato all’Agenda 2030 e al futuro sostenibile. Seguendo il nastro giallo e azzurro, si incontrano idee, disegni e messaggi: è una tappa da percorrere camminando piano, quasi come se il paese stesso insegnasse.`,
    en: `Here, Via della Noce becomes a path through children’s imagination. Created through a workshop with the primary school, the mural turns the street into a board-game-like route dedicated to the 2030 Agenda and a sustainable future. Follow the yellow and blue ribbon to discover ideas, drawings and messages: this is a stop to walk slowly, as if the village itself were teaching.`,
    tagsEn: ["School", "Children", "Agenda 2030"],
    detailsToFindEn: ["the yellow and blue ribbon", "the squares like a board game", "children’s drawings", "the themes of the 2030 Agenda"],
    observeEn: "Follow the yellow and blue ribbon: it connects the squares designed by children like a large urban board game.",
    directionsNextEn: "Continue along Via della Noce to Hunting Hunters.",
  },
  {
    id: 'hitnes',
    title: 'Hunting Hunters',
    artist: 'Hitnes',
    year: '2025',
    address: 'Via della Noce 1',
    lat: 43.364107,
    lng: 10.597916,
    image: '/images/hunting-hunters.jpg',
    tags: ['Natura', 'Animali', 'Ironia'],
    detailsToFind: ['il pettirosso', 'le gazze ladre', 'l’anello nascosto', 'la trappola', 'il ribaltamento tra cacciatore e preda'],
    observe: 'Individua il pettirosso, le gazze ladre e l’anello nascosto: la scena ribalta con ironia il rapporto tra preda e cacciatore.',
    directionsNext: 'Continua lungo Via della Noce verso l’opera di Aris.',
    it: `Hitnes porta nel borgo una piccola favola animale, ironica e un po’ misteriosa. Tra pettirossi, gazze ladre e richiami alla caccia, il murale ribalta i ruoli consueti: chi osserva non sa più con certezza chi sia il cacciatore e chi la preda. Cerca l’anello nascosto e lasciati guidare dalla domanda che l’opera suggerisce: la natura sta subendo l’uomo o sta imparando a tendergli un tranello?`,
    en: `Hitnes brings to the village a small animal fable, both ironic and mysterious. Among robins, magpies and references to hunting, the mural reverses the usual roles: the viewer is no longer sure who is the hunter and who is the prey. Look for the hidden ring and follow the question the work suggests: is nature being hunted by humans, or is it learning how to set a trap?`,
    tagsEn: ["Nature", "Animals", "Irony"],
    detailsToFindEn: ["the robin", "the magpies", "the hidden ring", "the trap", "the reversal between hunter and prey"],
    observeEn: "Find the robin, the magpies and the hidden ring: the scene ironically reverses the relationship between prey and hunter.",
    directionsNextEn: "Continue along Via della Noce towards the work by Aris.",
  },
  {
    id: 'aris',
    title: 'La Chimera',
    artist: 'Aris',
    year: '2025',
    address: 'Via della Noce',
    lat: 43.363711,
    lng: 10.59808,
    image: '/images/aris.jpg?v=39',
    tags: ['Etruschi', 'Ceramica', 'Pietro Leopoldo'],
    detailsToFind: ['il vaso etrusco', 'le forme bicrome', 'i profili stilizzati', 'il legame con il Museo C’ERA', 'l’omaggio a Pietro Leopoldo'],
    observe: 'Osserva i profili e le forme bicrome: richiamano il vaso etrusco e lo trasformano in immagine contemporanea.',
    directionsNext: 'Sali verso l’edificio scolastico in Via della Noce 15 per raggiungere Riparbella01.',
    it: `La Chimera guarda alle radici etrusche di Riparbella con uno sguardo contemporaneo. Aris prende ispirazione dai reperti del Museo C’ERA, in particolare dai vasi antichi, e li trasforma in profili e forme bicrome dal forte impatto grafico. L’opera è anche un omaggio a Pietro Leopoldo di Toscana e al suo interesse per la civiltà etrusca: un ponte visivo fra archeologia, ricerca e arte urbana.`,
    en: `La Chimera looks at Riparbella’s Etruscan roots through a contemporary lens. Aris draws inspiration from the finds preserved at the C’ERA Museum, especially ancient vases, transforming them into striking two-tone profiles and shapes. The work also pays tribute to Pietro Leopoldo of Tuscany and his interest in Etruscan civilisation: a visual bridge between archaeology, research and urban art.`,
    tagsEn: ["Etruscans", "Ceramics", "Pietro Leopoldo"],
    detailsToFindEn: ["the Etruscan vase", "the two-colour forms", "the stylised profiles", "the link with the C’ERA Museum", "the tribute to Pietro Leopoldo"],
    observeEn: "Notice the profiles and two-colour forms: they recall the Etruscan vase and turn it into a contemporary image.",
    directionsNextEn: "Walk up towards the school building in Via della Noce 15 to reach Riparbella01.",
  },
  {
    id: 'riparbella01',
    title: 'Riparbella01',
    artist: 'Moneyless',
    year: '2024',
    address: 'Via della Noce 15, facciata laterale edificio scolastico',
    lat: 43.3639,
    lng: 10.59805,
    image: '/images/riparbella01-moneyless.jpg?v=39',
    tags: ['Astrattismo', 'Scuola', 'Musica'],
    detailsToFind: ['le forme geometriche astratte', 'i richiami al movimento e alla musica', 'i colori volutamente non pieni', 'il riflesso nelle finestre della palestra'],
    observe: 'Nota le linee e le forme astratte: in alcune ore del giorno l’opera si riflette nelle finestre della palestra di fronte.',
    directionsNext: 'Spostati verso Via Gramsci, lungo il muro di cinta della scuola elementare.',
    it: `Sulla facciata della scuola, Moneyless realizza l’opera più astratta del percorso. Linee, pieni e vuoti dialogano con l’architettura degli anni Trenta e richiamano movimento, musica e avanguardie. La particolarità più poetica si scopre in certi momenti della giornata: i colori si riflettono sulle finestre della palestra di fronte, creando l’illusione di vetrate dipinte.`,
    en: `On the school façade, Moneyless creates the most abstract work of the route. Lines, solids and voids interact with the 1930s architecture and evoke movement, music and the avant-garde. Its most poetic feature appears at certain times of day: the colours reflect on the windows of the gym opposite, creating the illusion of painted glass.`,
    tagsEn: ["Abstraction", "School", "Music"],
    detailsToFindEn: ["abstract geometric shapes", "references to movement and music", "deliberately incomplete colours", "the reflection in the gym windows"],
    observeEn: "Notice the lines and abstract shapes: at certain times of day the work is reflected in the gym windows opposite.",
    directionsNextEn: "Move towards Via Gramsci, along the boundary wall of the primary school.",
  },
  {
    id: 'esperienza',
    title: 'L’esperienza più bella della nostra vita',
    artist: 'Giacomo Martellacci, Arianna Martucci e i bambini della scuola primaria',
    year: '2024',
    address: 'Via Gramsci',
    lat: 43.36326,
    lng: 10.598045,
    image: '/images/esperienza-vita.jpg',
    tags: ['Scuola', 'Paesaggio', 'Partecipazione'],
    detailsToFind: ['l’uva', 'i cinghiali', 'la campagna', 'il mare sullo sfondo', 'i segni lasciati dai bambini'],
    observe: 'Cerca gli elementi naturali del paesaggio di Riparbella: uva, cinghiali, campagna e mare.',
    directionsNext: 'Prosegui in Via Gramsci verso la palestra comunale per l’ultima tappa: Il sonno di Turan.',
    it: `Questo murale conserva l’entusiasmo dei bambini che lo hanno realizzato insieme agli artisti. Nato da un workshop con la scuola primaria, racconta il paesaggio di Riparbella attraverso uva, cinghiali, campagna e mare. Il titolo nasce dalle parole dei bambini stessi: per loro è stata davvero “l’esperienza più bella della nostra vita”. È una tappa semplice e affettuosa, dove l’arte pubblica diventa partecipazione.`,
    en: `This mural preserves the enthusiasm of the children who helped create it with the artists. Born from a workshop with the primary school, it tells Riparbella’s landscape through grapes, wild boars, countryside and sea. The title comes from the children’s own words: for them it truly was “the most beautiful experience of our life.” It is a warm, simple stop where public art becomes participation.`,
    tagsEn: ["School", "Landscape", "Participation"],
    detailsToFindEn: ["grapes", "wild boars", "the countryside", "the sea in the background", "the marks left by children"],
    observeEn: "Look for the natural elements of Riparbella’s landscape: grapes, wild boars, countryside and sea.",
    directionsNextEn: "Continue along Via Gramsci towards the municipal gym for the final stop: Il sonno di Turan.",
  },
  {
    id: 'turan',
    title: 'Il sonno di Turan',
    artist: 'Vesod',
    year: '2025',
    address: 'Via Gramsci, palestra comunale',
    lat: 43.363456,
    lng: 10.598161,
    image: '/images/sonno-turan.jpg?v=39',
    tags: ['Liberazione', 'Pace', 'Turan'],
    detailsToFind: ['la dea Turan', 'il cigno nero', 'il melograno', 'la colomba bianca', 'il profilo della collina e del mare'],
    observe: 'Guarda Turan come una figura sospesa tra memoria e rinascita: amore, pace e liberazione diventano il cuore dell’opera.',
    directionsNext: 'Hai completato il tour. Puoi tornare verso il centro storico o scegliere un parcheggio o un locale dalla guida.',
    it: `Sulle pareti della palestra comunale, Vesod dedica un’opera intensa alla Liberazione e alla pace. Turan, dea etrusca dell’amore e della vitalità, riposa come sospesa tra memoria e rinascita; al suo risveglio, l’energia dell’amore sembra dissolvere le ombre della guerra. Il profilo della dea dialoga con la collina e il mare, trasformando il murale in un grande simbolo di protezione per la comunità.`,
    en: `On the walls of the municipal gym, Vesod dedicates a powerful work to Liberation and peace. Turan, the Etruscan goddess of love and vitality, rests suspended between memory and rebirth; when she awakens, the energy of love seems to dissolve the shadows of war. Her profile echoes the hill and the sea, turning the mural into a symbol of protection for the community.`,
    tagsEn: ["Liberation", "Peace", "Turan"],
    detailsToFindEn: ["the goddess Turan", "the black swan", "the pomegranate", "the white dove", "the outline of the hill and the sea"],
    observeEn: "Look at Turan as a figure suspended between memory and rebirth: love, peace and liberation are at the heart of the work.",
    directionsNextEn: "You have completed the tour. You can return towards the historic centre or choose a car park or a place to stop from the guide.",
  }
];

const parkingSpots = [
  { name: 'Parcheggio 1 — Centro / partenza percorso', lat: 43.364872, lng: 10.598270, note: 'Comodo per iniziare il percorso a piedi nel centro storico.' },
  { name: 'Parcheggio 2 — Lato nord / ingresso paese', lat: 43.365710, lng: 10.602079, note: 'Utile per chi arriva dal lato nord del borgo.' },
  { name: 'Parcheggio 3 — Lato ovest / accesso al borgo', lat: 43.363460, lng: 10.595227, note: 'Comodo per raggiungere le tappe nella zona di Via della Noce e Via Gramsci.' }
];

const placesToEat = [
  {
    name: 'Piccola Osteria Paperini',
    type: 'Osteria',
    bestFor: 'Cucina toscana e mediterranea',
    image: '/images/piccola-osteria-paperini.jpg',
    address: 'Piazza Federico Baldasserini, 7, 56046 Riparbella PI',
    phone: '+393442224407',
    note: 'Una piccola osteria nel cuore del borgo, ideale per una pausa curata tra piatti toscani, proposte mediterranee e atmosfera raccolta.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Piccola%20Osteria%20Paperini%20Piazza%20Baldasserini%207%20Riparbella',
    website: 'https://piccolaosteriapaperini.eatbu.com/'
  },
  {
    name: 'Bistrot 1986',
    type: 'Bistrot / Ristorante',
    bestFor: 'Pranzo, cena e sapori toscani',
    image: '/images/bistrot-1986.jpg',
    address: 'Via della Madonna, 4, 56046 Riparbella PI',
    phone: '+393791353895',
    note: 'Un bistrot accogliente vicino al percorso, adatto per fermarsi a pranzo o a cena con cucina italiana, toscana e piatti di mare.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bistrot%201986%20Via%20della%20Madonna%204%20Riparbella',
    website: 'https://www.facebook.com/Bistrot1986/'
  },
  {
    name: 'Caffè Perbacco Osteria',
    type: 'Bar / Osteria',
    bestFor: 'Colazione, pranzo e aperitivo',
    image: '/images/caffe-perbacco.jpg',
    address: 'Località San Martino, 56046 Riparbella PI',
    phone: '+393713899789',
    note: 'Un punto versatile per caffè, cappuccino, aperitivo o una sosta informale con cucina italiana e toscana.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Caff%C3%A8%20Perbacco%20Osteria%20Localit%C3%A0%20San%20Martino%20Riparbella',
    website: 'https://www.tripadvisor.it/Restaurant_Review-g652041-d17339812-Reviews-Caffe_Per_Bacco_Osteria-Riparbella_Province_of_Pisa_Tuscany.html'
  },
  {
    name: 'La Piazzetta Ristorante Pizzeria Griglieria',
    type: 'Ristorante / Pizzeria / Griglieria',
    bestFor: 'Pizza, griglia e terrazza',
    image: '/images/la-piazzetta.jpg',
    address: 'Via di Piazzetta, 2, 56046 Riparbella PI',
    phone: '+3905861881268',
    note: 'Locale tipico con proposta di pizzeria, griglia e cucina italiana: una tappa comoda nel borgo, anche per famiglie e gruppi.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=La%20Piazzetta%20Ristorante%20Pizzeria%20Griglieria%20Via%20di%20Piazzetta%202%20Riparbella',
    website: 'https://lapiazzettariparbella.my.canva.site/'
  },
  {
    name: 'Jemsi Bar Caffetteria-Aperitivi-Drink',
    type: 'Bar / Caffetteria',
    bestFor: 'Caffè, aperitivi e drink',
    image: '/images/jemsi-bar.jpg',
    address: 'Piazza Giacomo Matteotti, 11, 56046 Riparbella PI',
    phone: '+393761300249',
    note: 'Bar centrale e pratico durante il percorso: perfetto per una colazione, una bibita fresca o un aperitivo dopo la visita.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jemsi%20Bar%20Caffetteria%20Aperitivi%20Drink%20Piazza%20Giacomo%20Matteotti%2011%20Riparbella',
    website: 'https://www.facebook.com/'
  },
  {
    name: 'Bar da Libero',
    type: 'Bar',
    bestFor: 'Pausa veloce nel borgo',
    image: '/images/bar-da-libero.jpg',
    address: 'Via della Madonna, 14, 56046 Riparbella PI',
    phone: '',
    note: 'Un bar di paese, semplice e comodo per una sosta veloce durante la passeggiata. {t.phoneUnavailable || t.noPhone} nelle fonti pubbliche consultate.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bar%20da%20Libero%20Via%20della%20Madonna%2014%20Riparbella'
  },
  {
    name: 'Osteria in Cantina',
    type: 'Osteria / Cucina toscana',
    bestFor: 'Cucina casalinga e tradizione',
    image: '/images/osteria-in-cantina.jpg',
    address: 'Via XX Settembre, 10, 56046 Riparbella PI',
    phone: '+390586699332',
    note: 'Osteria intima e molto apprezzata per la cucina casalinga toscana, i piatti della tradizione e l’atmosfera familiare.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Osteria%20in%20Cantina%20Via%20XX%20Settembre%2010%20Riparbella',
    website: 'https://www.tripadvisor.it/Restaurant_Review-g652041-d2272107-Reviews-Osteria_In_Cantina-Riparbella_Province_of_Pisa_Tuscany.html'
  }
];


const ui = {
  it: {
    heroKicker: 'Guida digitale interattiva',
    title: 'Murales di Riparbella',
    subtitle: 'Un percorso a piedi tra arte urbana, memoria, paesaggio e comunità.',
    startTour: 'Inizia il tour consigliato',
    openMap: 'Vai alla mappa',
    route: 'Il percorso',
    routeText: "I murales del borgo compongono un percorso d’arte diffusa che intreccia memoria, paesaggio, scuola, tradizioni popolari, radici etrusche e desideri futuri. Ogni opera nasce dal dialogo tra artisti, cittadini e territorio, trasformando piazze, strade e facciate in un museo a cielo aperto.",
    routeText2: 'La guida digitale accompagna il visitatore tappa dopo tappa, con foto, descrizioni, dettagli da osservare, mappa interattiva e navigazione verso ogni murale.',
    guidedTour: 'Tour guidato',
    map: 'Mappa del percorso',
    mapIntro: 'Segui le tappe numerate nell’ordine consigliato. Clicca su una tappa per aggiornare la mappa, leggere la scheda o aprire il navigatore.',
    openCard: 'Apri scheda',
    selectedCardTitle: 'Scheda del murale selezionato',
    previousStop: 'Tappa precedente',
    nextStop: 'Tappa successiva',
    list: 'Elenco murales',
    parking: 'Dove parcheggiare',
    food: 'Dove fermarsi',
    detail: 'Scheda del murale',
    readHint: 'Leggi la storia, i dettagli e il significato dell’opera selezionata.',
    readCard: 'Leggi scheda',
    takeMe: 'Portami qui',
    google: 'Google Maps',
    apple: 'Apple Maps',
    call: 'Chiama',
    previous: 'Precedente',
    next: 'Prossima',
    observe: 'Cosa osservare',
    findDetails: 'Cerca questi dettagli',
    shareCard: 'Condividi scheda',
    familyTitle: 'Per bambini e famiglie',
    familySubtitle: 'Una piccola caccia al dettaglio per osservare i murales con occhi curiosi.',
    familyIntro: 'Durante il percorso prova a trovare questi elementi nascosti o ricorrenti nelle opere:',
    visitTipsTitle: 'Consigli per la visita',
    visitTipsSubtitle: 'Qualche indicazione semplice per vivere meglio il percorso.',
    projectTitle: 'Il progetto',
    projectKicker: 'Arte pubblica e comunità',
    projectText1: 'Il percorso dei murales nasce come progetto di arte pubblica e rigenerazione culturale, con l’obiettivo di raccontare Riparbella attraverso il dialogo tra artisti, cittadini, scuola, memoria storica e paesaggio.',
    projectText2: 'Le opere trasformano le facciate del paese in un museo a cielo aperto, valorizzando l’identità del borgo: le radici etrusche, la vita agricola, il rapporto con la natura, la presenza del mare all’orizzonte e il ruolo della comunità.',
    backToTour: 'Torna al tour',
    readMore: 'Approfondimento',
    directions: 'Indicazioni',
    infoDisclaimer: 'Informazioni utili per il visitatore. Orari, aperture e recapiti possono variare: si consiglia di contattare direttamente le attività prima della visita.',
    progressKicker: 'Il tuo percorso',
    progressTitle: 'Segna le tappe visitate',
    progressSeen: 'murales visti',
    progressHint: 'Usa il pulsante “Vista” nelle schede per tenere traccia del tour direttamente dal tuo smartphone.',
    progressAria: 'Percorso completato al',
    markReview: 'Segna come da rivedere',
    markSeen: 'Segna come vista',
    seen: 'Vista',
    navMap: 'Mappa',
    navParking: 'I parcheggi',
    navBeyond: 'Oltre i murales',
    navFood: 'Dove fermarsi',
    extraKicker: 'Oltre i murales',
    extraTitle: 'Scopri Riparbella oltre i murales',
    extraIntro: 'Il percorso dei murales può diventare l’occasione per scoprire altri luoghi del borgo: piccoli segni di memoria, arte, tradizione, esperienze sensoriali e vita quotidiana che raccontano Riparbella da prospettive diverse.',
    readStory: 'Leggi la storia',
    foodKicker: 'Bar, ristoranti e pause',
    foodIntro: 'Una selezione di bar, osterie e ristoranti dove fermarsi prima, durante o dopo il percorso. Gli orari possono variare: consigliamo sempre di contattare direttamente l’attività prima della visita.',
    phoneUnavailable: 'Telefono non disponibile',
    footerMade: 'Web app ideata e realizzata da Francesco Bolognesi',
    footerPurpose: 'per raccontare e valorizzare i murales di Riparbella.',
    footerProject: 'Progetto digitale dedicato al percorso di arte pubblica del borgo, pensato come guida semplice, consultabile da smartphone durante la visita.',
    supportText: 'Guida gratuita · Se vuoi, puoi sostenere il progetto con un caffè usando il pulsante Ko-fi in basso.',
    rightsText: 'Testi, immagini e opere appartengono ai rispettivi autori e aventi diritto.',
    versionLabel: 'Versione prototipo',
    routeKicker: 'Riparbella si racconta sui muri',
    visitTimeTitle: 'Tempo di visita',
    visitTimeText: 'Il percorso completo richiede circa 45–60 minuti, senza contare le soste.',
    walkTitle: 'A piedi nel borgo',
    walkText: 'Le tappe sono vicine tra loro e si raggiungono comodamente camminando.',
    respectTitle: 'Rispetto dei luoghi',
    respectText: 'Molti murales si trovano su edifici abitati: osserva e fotografa con discrezione.',
    detailsTitle: 'Dettagli da osservare',
    selectedStopLabel: 'Tappa selezionata',
    yearLabel: 'Anno',
    themeLabel: 'Tema',
    artistLabel: 'Artista',
    addressLabel: 'Luogo',
    noPhone: 'Telefono non disponibile',
    infoButton: 'Info',
    openNavigation: 'Apri navigatore',
    kofiButton: 'Sostieni il progetto',
    visitCard1Title: '45/60 min',
    visitCard1Text: 'Durata consigliata con soste davanti alle opere.',
    visitCard2Title: 'Percorso a piedi',
    visitCard2Text: 'Il tour attraversa il centro storico e segue l’andamento della strada.',
    visitCard3Title: 'Scarpe comode',
    visitCard3Text: 'Il borgo ha salite, discese e scorci da scoprire lentamente.',
    visitCard4Title: 'Rispetto',
    visitCard4Text: 'Alcune opere si trovano su edifici abitati: osserva e fotografa con discrezione.',
    selectedMuralCard: 'Scheda del murale selezionato',
    stopOf: 'Tappa',
    of: 'di',
    artworkDescription: 'Descrizione dell’opera',
    whatToNotice: 'Cosa osservare',
    offerCoffee: 'Offri un caffè',
    quickConsultation: 'Consultazione rapida',
    allWorks: 'Tutte le opere',
    nextDirectionTitle: 'Verso la prossima tappa',
    seenDone: 'Vista ✓',
    markSeenShort: 'Segna vista',
    clearRoute: 'Azzera percorso',
    beforeStartKicker: 'Prima di partire',
    projectKickerVisible: 'Arte pubblica e comunità',
    searchPlaceholder: 'Cerca murale, artista, tema...',
    prototype: 'Versione prototipo — 2026'
  },
  en: {
    heroKicker: 'Interactive digital guide',
    title: 'Murals of Riparbella',
    subtitle: 'A walking route through urban art, memory, landscape and community.',
    startTour: 'Start the suggested tour',
    openMap: 'Open the map',
    route: 'The route',
    routeText: 'The murals form an open-air art route through the village, weaving together memory, landscape, school life, local traditions, Etruscan roots and future wishes. Each work comes from a dialogue between artists, residents and the territory.',
    routeText2: 'This digital guide accompanies visitors step by step with photos, descriptions, details to notice, an interactive map and navigation to each mural.',
    guidedTour: 'Guided tour',
    map: 'Route map',
    mapIntro: 'Follow the numbered stops in the suggested order. Click a stop to update the map, read the card or open navigation.',
    openCard: 'Open card',
    selectedCardTitle: 'Selected mural card',
    previousStop: 'Previous stop',
    nextStop: 'Next stop',
    list: 'Mural list',
    parking: 'Where to park',
    food: 'Where to stop',
    detail: 'Mural card',
    readHint: 'Read the story, details and meaning of the selected artwork.',
    readCard: 'Read card',
    takeMe: 'Take me here',
    google: 'Google Maps',
    apple: 'Apple Maps',
    call: 'Call',
    previous: 'Previous',
    next: 'Next',
    observe: 'What to notice',
    findDetails: 'Look for these details',
    shareCard: 'Share card',
    familyTitle: 'For children and families',
    familySubtitle: 'A small detail hunt to explore the murals with curious eyes.',
    familyIntro: 'During the route, try to find these hidden or recurring elements in the artworks:',
    visitTipsTitle: 'Visit tips',
    visitTipsSubtitle: 'A few simple suggestions to enjoy the route at its best.',
    projectTitle: 'The project',
    projectKicker: 'Public art and community',
    projectText1: 'The mural route was created as a public art and cultural regeneration project, designed to tell the story of Riparbella through a dialogue between artists, residents, schools, historical memory and landscape.',
    projectText2: 'The artworks turn the village façades into an open-air museum, highlighting Riparbella’s identity: its Etruscan roots, agricultural life, relationship with nature, the sea on the horizon and the role of the community.',
    backToTour: 'Back to tour',
    readMore: 'More details',
    directions: 'Directions',
    infoDisclaimer: 'Useful visitor information. Opening hours and contacts may change: please contact the businesses directly before your visit.',
    progressKicker: 'Your route',
    progressTitle: 'Mark visited stops',
    progressSeen: 'murals seen',
    progressHint: 'Use the “Seen” button in the cards to keep track of your tour directly from your smartphone.',
    progressAria: 'Route completed at',
    markReview: 'Mark to revisit',
    markSeen: 'Mark as seen',
    seen: 'Seen',
    navMap: 'Map',
    navParking: 'Parking',
    navBeyond: 'Beyond the murals',
    navFood: 'Where to stop',
    extraKicker: 'Beyond the murals',
    extraTitle: 'Discover Riparbella beyond the murals',
    extraIntro: 'The mural route is also a chance to discover other places in the village: small signs of memory, art, tradition, sensory experiences and everyday life that tell Riparbella from different perspectives.',
    readStory: 'Read the story',
    foodKicker: 'Bars, restaurants and breaks',
    foodIntro: 'A selection of bars, osterias and restaurants where you can stop before, during or after the route. Opening hours may vary: we recommend contacting each place directly before your visit.',
    phoneUnavailable: 'Phone not available',
    footerMade: 'Web app designed and created by Francesco Bolognesi',
    footerPurpose: 'to tell and enhance the murals of Riparbella.',
    footerProject: 'A digital project dedicated to the village’s public art route, designed as a simple guide to use from your smartphone during the visit.',
    supportText: 'Free guide · If you like, you can support the project with a coffee using the Ko-fi button below.',
    rightsText: 'Texts, images and artworks belong to their respective authors and rights holders.',
    versionLabel: 'Prototype version',
    routeKicker: 'Riparbella tells its story on the walls',
    visitTimeTitle: 'Visit time',
    visitTimeText: 'The full route takes about 45–60 minutes, not including stops.',
    walkTitle: 'Walking through the village',
    walkText: 'The stops are close to each other and can be easily reached on foot.',
    respectTitle: 'Respect the places',
    respectText: 'Many murals are on inhabited buildings: observe and take photos with discretion.',
    detailsTitle: 'Details to notice',
    selectedStopLabel: 'Selected stop',
    yearLabel: 'Year',
    themeLabel: 'Theme',
    artistLabel: 'Artist',
    addressLabel: 'Place',
    noPhone: 'Phone not available',
    infoButton: 'Info',
    openNavigation: 'Open navigation',
    kofiButton: 'Support the project',
    visitCard1Title: '45/60 min',
    visitCard1Text: 'Suggested duration including short stops in front of the artworks.',
    visitCard2Title: 'Walking route',
    visitCard2Text: 'The tour crosses the historic centre and follows the natural slope of the streets.',
    visitCard3Title: 'Comfortable shoes',
    visitCard3Text: 'The village has climbs, descents and viewpoints to discover slowly.',
    visitCard4Title: 'Respect',
    visitCard4Text: 'Some artworks are on inhabited buildings: observe and take photos with discretion.',
    selectedMuralCard: 'Selected mural card',
    stopOf: 'Stop',
    of: 'of',
    artworkDescription: 'Artwork description',
    whatToNotice: 'What to notice',
    offerCoffee: 'Buy me a coffee',
    quickConsultation: 'Quick reference',
    allWorks: 'All artworks',
    nextDirectionTitle: 'Towards the next stop',
    seenDone: 'Seen ✓',
    markSeenShort: 'Mark as seen',
    clearRoute: 'Reset route',
    beforeStartKicker: 'Before you start',
    projectKickerVisible: 'Public art and community',
    searchPlaceholder: 'Search mural, artist, theme...',
    prototype: 'Prototype version — 2026'
  }
};


const extraPlaces = [
  {
    id: 'orologio-torre',
    title: 'Orologio da torre di Riparbella',
    category: 'Storia del borgo',
    address: 'Piazzetta Borgo di Sotto',
    lat: 43.364128,
    lng: 10.598266,
    image: '/images/orologio-torre-riparbella.jpg',
    intro: 'Un punto simbolico del paese, legato alla storia della comunità e alla vita pubblica di Riparbella.',
    description: `L’abitato di Riparbella, sorto nel XV secolo nei pressi dell’antico borgo distrutto con il castello medievale durante la guerra fra Napoli e Firenze, si raccoglie su una collina a 216 metri d’altitudine, tra poggi olivati e vigneti.

Riparbella fu feudo mediceo e nel 1635 divenne Marchesato sotto la famiglia Carlotti. Il primo orologio pubblico venne collocato nel 1703 sopra una casa di proprietà del marchese Carlotti, situata nella piazza del paese.

La campana che batteva le ore riportava la data 1606 e proveniva dalla torre dell’oratorio della Compagnia in Piazza della Madonna, oggi nella chiesetta della Melatina. In origine si trattava con ogni probabilità di un orologio con suoneria “alla romana”, cioè con scansione di sei ore in sei ore, secondo l’uso del tempo.

Nel 1749, dopo il bando del Granduca di Toscana, l’orologio venne adattato alla suoneria “alla francese”, con il conteggio di dodici ore in dodici ore. Nel corso dei secoli seguirono numerosi interventi di riparazione e manutenzione, affidati a orologiai, artigiani e famiglie locali.

Nel 1864 la casa dove si trovava l’orologio fu abbattuta per allargare la strada verso la chiesa. L’orologio da torre venne quindi collocato sul nuovo Municipio appena costruito. Nel 1867 fu acquistata una nuova macchina di Luigi Toninelli di Cecina, poi posta sulla torretta del nuovo Municipio nel 1885.

Il racconto dell’orologio è anche il racconto di una comunità che, attraverso il tempo, ha continuato a custodire i propri luoghi, i propri suoni e la propria memoria.`,
    credit: 'Ricerca di Severino Bolognesi, Pontedera 19.01.2019. Ringraziamenti: Dott.ssa Angela Porciani e Dott. Michele Quirici per il contributo alla ricerca.'
  },
  {
    id: 'source-adage',
    title: 'Source Adage — Una porta per la profumeria',
    category: 'Profumi, botanica e arte',
    address: 'Via XX Settembre, 32, Riparbella',
    lat: 43.364420,
    lng: 10.599000,
    website: 'https://www.sourceadage.it/',
    image: '/images/source-adage-porta.jpg',
    intro: 'Una tappa sensoriale nel borgo: la porta dipinta racconta il legame tra profumeria, botanica e arte contemporanea.',
    description: `Ispirata alle incisioni botaniche del Seicento della pittrice fiorentina Anna Maria Vaiani, questa porta decorata aggiunge un nuovo segno alla vivace arte urbana di Riparbella.

I cofondatori e “nasi” del marchio di fragranze di nicchia Source Adage, nato a New York, Robert Dobay e Christopher Draghi, hanno dipinto la porta del magazzino adiacente alla loro boutique, reinterpretando le opere botaniche di Vaiani con una grafica audace e contemporanea.

Il disegno riflette il loro amore per i profumi botanici e dialoga con la facciata rosa del palazzo, sede della profumeria e dello studio. Non è soltanto un elemento decorativo: la porta funziona anche come piccolo indicatore visivo degli orari di apertura. Quando le porte dipinte sono aperte e mostrano il rosa, anche lo showroom è aperto; quando sono chiuse e mostrano il verde, anche la profumeria è chiusa.

Una tappa perfetta per scoprire Riparbella anche attraverso il senso dell’olfatto, tra arte, botanica e profumi.`,
    credit: 'Testo tratto e rielaborato dai materiali Source Adage.'
  },
  {
    id: 'cera-riparbella-antica',
    title: 'C’ERA — Centro Espositivo Riparbella Antica',
    category: 'Archeologia e memoria etrusca',
    address: 'Riparbella',
    lat: 43.364493,
    lng: 10.599207,
    image: '/images/cera-corona-aurea.jpg',
    intro: 'Una tappa preziosa per scoprire le radici più antiche del borgo e il legame tra arte contemporanea, archeologia e territorio.',
    description: `Il C’ERA — Centro Espositivo Riparbella Antica è una tappa preziosa per scoprire le radici più antiche del borgo e del suo territorio.

Il centro raccoglie reperti provenienti dall’area archeologica di Belora, testimonianza della presenza etrusca e romana nella zona di Riparbella. Oggetti di uso quotidiano, corredi funerari, ceramiche, balsamari e piccoli manufatti raccontano la vita, i riti e la cultura di chi abitava queste terre molti secoli fa.

Tra gli elementi più suggestivi spicca la corona aurea da Belora, un reperto di grande fascino che richiama il mondo simbolico e rituale dell’antichità. Le sue foglie dorate raccontano una storia fatta di memoria, bellezza e legame con la terra.

Visitare il C’ERA significa completare il percorso dei murales con uno sguardo più profondo: l’arte contemporanea sulle facciate del borgo dialoga con la storia antica custodita all’interno del centro espositivo.`,
    credit: 'Scheda dedicata al C’ERA — Centro Espositivo Riparbella Antica e ai reperti provenienti dall’area di Belora.'
  },
  {
    id: 'chiesa-san-giovanni',
    title: 'Chiesa di San Giovanni Evangelista',
    category: 'Arte sacra',
    address: 'Chiesa di San Giovanni Evangelista, Riparbella',
    lat: 43.364338,
    lng: 10.598561,
    image: '/images/chiesa-san-giovanni-ultima-cena.jpg',
    intro: 'Una tappa di arte sacra nel cuore del borgo, con altari storici e affreschi contemporanei nell’abside.',
    description: `La Chiesa di San Giovanni Evangelista custodisce diversi elementi di interesse artistico e devozionale.

All’interno si trovano un altare dedicato a San Giovanni Evangelista con statua moderna, un altare della Madonna del Carmelo con statua del Cristo morto e due altari presso il presbiterio con dipinti settecenteschi, tra cui Sant’Antonio Abate, e seicenteschi, tra cui la Madonna Assunta.

L’abside è arricchita da affreschi realizzati nel 1995, che rappresentano l’Ultima Cena e Cristo in gloria. La scena crea un forte punto focale all’interno della chiesa e accompagna lo sguardo verso l’altare, unendo il racconto evangelico alla dimensione spirituale del luogo.

Durante la visita si consiglia di rispettare il silenzio, gli orari di apertura e la funzione religiosa del luogo.`,
    credit: 'Scheda informativa sulla Chiesa di San Giovanni Evangelista.'
  },
  {
    id: 'presepe-animato',
    title: 'Presepe animato di Riparbella',
    category: 'Tradizione e artigianato',
    address: 'Ex Cinema, Piazza della Madonna 1',
    lat: 43.365574,
    lng: 10.600548,
    image: '/images/presepe-animato-riparbella.jpg',
    intro: 'Una grande opera artigianale realizzata dai cittadini, con scene animate, antichi mestieri e ambientazioni rurali.',
    description: `Il Presepe animato di Riparbella si trova nell’ex Cinema in Piazza della Madonna 1 ed è una grande opera artigianale di circa 80 mq, creata grazie al lavoro e alla passione dei cittadini.

Inaugurato il 24 dicembre, ospita oltre 140 statuine animate alte circa 20 cm, impegnate in mestieri tradizionali e scene della vita rurale. Tra le scene rappresentate si trovano lavori casalinghi, battitura del cerchio, pigiatura dell’uva, macina del grano, taglio della legna e molte altre attività legate alla memoria contadina.

L’allestimento è arricchito da effetti luminosi che riproducono le fasi della giornata, dall’alba al tramonto fino alla notte. Sono presenti anche effetti scenici come neve, ghiacciai, laghi, cascate e la stella cometa.

È una tappa particolarmente adatta a famiglie e bambini, ma anche a chi desidera scoprire una tradizione popolare costruita con cura, manualità e spirito di comunità.`,
    credit: 'Apertura indicativa: dal 24 dicembre al 28 febbraio, 9:00–20:00, con aperture speciali anche a marzo, luglio e agosto. Verificare sempre eventuali aggiornamenti locali.'
  }
];

function navGoogle(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function navApple(lat, lng) {
  return `https://maps.apple.com/?daddr=${lat},${lng}`;
}

const placeMapUrl = (place) => place.mapsUrl || navGoogle(place.lat, place.lng);

function embedMapUrl(lat, lng) {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.004}%2C${lat - 0.003}%2C${lng + 0.004}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function phoneLabel(phone) {
  return phone.replace('+39', '+39 ');
}

function App() {
  const [language, setLanguage] = useState('it');
  const [selectedId, setSelectedId] = useState(() => window.location.hash?.replace('#', '') || murals[0].id);
  const [query, setQuery] = useState('');
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

  const filteredMurals = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return murals;
    return murals.filter((m) => `${m.title} ${m.artist} ${m.address} ${m.tags.join(' ')}`.toLowerCase().includes(q));
  }, [query]);

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
    if (scroll) setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
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
    setTimeout(() => tourRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  return (
    <div className="app">
      <header className="hero">
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

          <article className="selected-mural-card" ref={detailsRef}>
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
        </section>

        <section className="section compact-list-section">

          <div className="section-heading">
            <p className="kicker">{t.quickConsultation}</p>
            <h2>{t.allWorks}</h2>
          </div>

          <input className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPlaceholder} />

          <div className="cards-grid">
            {filteredMurals.map((mural, index) => (
              <article key={mural.id} className={selectedId === mural.id ? 'mural-card selected' : 'mural-card'} onClick={() => selectMural(mural.id)}>
                <img src={mural.image} alt={mural.title} />
                <div>
                  <p className="step">#{murals.findIndex((m) => m.id === mural.id) + 1} {isVisited(mural.id) && <span className="inline-visited">Vista</span>}</p>
                  <h3>{mural.title}</h3>
                  <p className="meta">{mural.artist} · {mural.year}</p>
                  <div className="compact-details">
                    {mural.detailsToFind.slice(0, 3).map((detail) => <span key={detail}>{detail}</span>)}
                  </div>
                  <p>{language === 'it' ? mural.it : mural.en}</p>
                  <div className="card-actions">
                    <button className="secondary small share-inline" onClick={(event) => { event.stopPropagation(); shareMural(mural); }}>{t.shareCard}</button>
                    <button className="primary small share-inline" onClick={(event) => { event.stopPropagation(); selectMural(mural.id, true); }}>{t.backToTour}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
                    <img src={place.image} alt={place.title} loading="lazy" />
                  </div>
                )}
                <div className="extra-place-head">
                  <p className="type">{place.category}</p>
                  <h3>{place.title}</h3>
                  <p className="address">⌖ {place.address}</p>
                </div>
                <p className="extra-place-intro">{place.intro}</p>
                <details>
                  <summary>{t.readStory}</summary>
                  <div className="extra-place-description">
                    {place.description.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    <p className="credit">{place.credit}</p>
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
            {placesToEat.map((place) => (
              <article className="info-card food-card" key={place.name}>
                <div className="food-visual" aria-hidden="true">
                  {place.image ? (
                    <img src={place.image} alt="" loading="lazy" />
                  ) : (
                    <span>{place.name.split(' ').slice(0, 2).map((word) => word[0]).join('')}</span>
                  )}
                </div>
                <div className="food-card-top">
                  <p className="type">{place.type}</p>
                  {place.bestFor && <span className="food-badge">{place.bestFor}</span>}
                </div>
                <h3>{place.name}</h3>
                <p className="address">⌖ {place.address}</p>
                {place.note && <p className="place-note">{place.note}</p>}
                {place.phone ? <p className="phone">{phoneLabel(place.phone)}</p> : <p className="phone muted">{t.phoneUnavailable}</p>}
                <div className="button-row food-buttons">
                  {place.phone && <a className="primary link" href={`tel:${place.phone}`}>{t.call}</a>}
                  <a className={place.phone ? "secondary link" : "primary link"} target="_blank" rel="noreferrer" href={placeMapUrl(place)}>{t.takeMe}</a>
                  {place.website && <a className="secondary link" target="_blank" rel="noreferrer" href={place.website}>{t.infoButton}</a>}
                </div>
              </article>
            ))}
          </div>
          <p className="disclaimer">{t.infoDisclaimer}</p>
        </section>
      </main>

      <footer>
        <p><strong>{t.footerMade}</strong></p>
        <p>{t.footerPurpose}</p>
        <p className="footer-project">{t.footerProject}</p>
        <div className="support-box support-box-small">
          <p>{t.supportText}</p>
        </div>
        <p>{t.rightsText}</p>
        <p><strong>{t.versionLabel} — 1.44.9.1</strong></p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
);
