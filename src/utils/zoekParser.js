// Ontleedt een vrije zoekzin (bijv. "studio voor 2 personen met airco in
// Pietermaai") naar dezelfde filters die de woningenlijst ondersteunt:
// type, locatie, gasten, slaapkamers en voorzieningen. Werkt met simpele
// patroonherkenning — geen externe AI-aanroep nodig, dus geen kosten en geen
// vertraging. Als vragen later beschrijvender worden (bijv. "iets rustigs
// dichtbij het strand"), is dit de plek om eventueel een AI-aanroep toe te
// voegen als deze patroonherkenning tekortschiet.

import { VOORZIENINGEN } from './voorzieningen';

// Synoniemen per voorziening zodat "zwembad", "pool" en "zwemmen" allemaal
// naar dezelfde voorziening-key wijzen. Voeg gerust woorden toe naarmate je
// merkt dat bezoekers iets anders typen.
const VOORZIENING_SYNONIEMEN = {
  zwembad: ['zwembad', 'pool', 'zwemmen'],
  wifi: ['wifi', 'wi-fi', 'internet'],
  airco: ['airco', 'aircon', 'airconditioning', 'koeling'],
  parkeerplaats: ['parkeerplaats', 'parkeren', 'parking'],
  wasmachine: ['wasmachine', 'wassen'],
  schoonmaak: ['schoonmaak', 'schoongemaakt'],
  balkon: ['balkon'],
  keuken: ['eigen keuken', 'privé keuken'],
  gedeeldeKeuken: ['gedeelde keuken', 'gezamenlijke keuken'],
  gedeeldeBadkamer: ['gedeelde badkamer', 'gezamenlijke badkamer'],
  gemeubileerd: ['gemeubileerd', 'gemeubeld'],
  rookvrij: ['rookvrij', 'niet roken'],
  tuin: ['tuin'],
  tv: [' tv ', 'televisie'],
  linnenpakket: ['linnenpakket', 'beddengoed'],
  bbq: ['bbq', 'barbecue'],
};

// Synoniemen per type woning.
const TYPE_SYNONIEMEN = {
  kamer: ['kamer', 'kamertje'],
  studio: ['studio'],
  appartement: ['appartement', 'flat'],
  woning: ['woning', 'huis', 'villa'],
};

// Woorden die op zichzelf niets betekenen voor de zoekopdracht en dus nooit
// als "restwoord" (vrije tekst) meegenomen moeten worden.
const NEGEER_WOORDEN = [
  'ik', 'zoek', 'zoeken', 'een', 'voor', 'met', 'in', 'de', 'het', 'van',
  'op', 'en', 'of', 'graag', 'wil', 'naar', 'plek', 'plekje', 'alstublieft',
  'alsjeblieft', 'is', 'er', 'die', 'dat', 'wat', 'heb', 'hebben',
];

export function parseZoekopdracht(tekst, locaties = []) {
  const query = ` ${tekst.toLowerCase()} `;
  const resultaat = {};

  // Bijhouden welke stukjes tekst al "verklaard" zijn door een herkend
  // filter, zodat aan het einde duidelijk is wat er onherkend overblijft
  // (bijv. een woningnaam als "Penthouse").
  let rest = query;
  const verwijderUitRest = (stukje) => {
    rest = rest.replace(stukje, ' ');
  };

  // Gasten: "2 personen", "2 gasten", "voor 2 personen"
  const gastenMatch = query.match(/(\d+)\s*(personen|persoon|gasten|gast)/);
  if (gastenMatch) {
    resultaat.gasten = gastenMatch[1];
    verwijderUitRest(gastenMatch[0]);
  }

  // Slaapkamers: "3 slaapkamers", "2 slaapkamer"
  const slaapkamerMatch = query.match(/(\d+)\s*(slaapkamers|slaapkamer)/);
  if (slaapkamerMatch) {
    resultaat.slaapkamers = slaapkamerMatch[1];
    verwijderUitRest(slaapkamerMatch[0]);
  }

  // Type woning: eerste match wint (een zin noemt normaliter maar één type).
  const gevondenType = Object.entries(TYPE_SYNONIEMEN).find(([, woorden]) =>
    woorden.some((woord) => query.includes(woord))
  );
  if (gevondenType) {
    resultaat.type = gevondenType[0];
    const gevondenWoord = gevondenType[1].find((woord) => query.includes(woord));
    verwijderUitRest(gevondenWoord);
  }

  // Locatie: langste naam eerst controleren, zodat een locatie die toevallig
  // een substring van een andere is niet per ongeluk de verkeerde match geeft.
  const gesorteerdeLocaties = [...locaties].sort((a, b) => b.length - a.length);
  const gevondenLocatie = gesorteerdeLocaties.find((loc) => query.includes(loc.toLowerCase()));
  if (gevondenLocatie) {
    resultaat.locatie = gevondenLocatie;
    verwijderUitRest(gevondenLocatie.toLowerCase());
  }

  // Voorzieningen: elk woord uit de synoniemenlijst checken.
  const gevondenVoorzieningen = [];
  VOORZIENINGEN.forEach((v) => {
    const synoniemen = VOORZIENING_SYNONIEMEN[v.key] || [v.label.toLowerCase()];
    const gevondenWoord = synoniemen.find((woord) => query.includes(woord));
    if (gevondenWoord) {
      gevondenVoorzieningen.push(v.key);
      verwijderUitRest(gevondenWoord);
    }
  });

  if (gevondenVoorzieningen.length > 0) {
    resultaat.voorzieningen = gevondenVoorzieningen.join(',');
  }

  // Alles wat overblijft en geen negeerwoord is, is vermoedelijk een
  // woningnaam of ander kenmerk dat niet als los filter bestaat (bijv.
  // "Penthouse") — dat gebruiken we als vrije-tekstzoekopdracht op naam/tags,
  // zodat de site niet stilletjes alles teruggeeft als er niets herkend is.
  const restWoorden = rest
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !NEGEER_WOORDEN.includes(w));

  if (restWoorden.length > 0) {
    resultaat.tekst = restWoorden.join(' ');
  }

  return resultaat;
}
