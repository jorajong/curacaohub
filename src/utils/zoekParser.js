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

export function parseZoekopdracht(tekst, locaties = []) {
  const query = ` ${tekst.toLowerCase()} `;
  const resultaat = {};

  // Gasten: "2 personen", "2 gasten", "voor 2 personen"
  const gastenMatch = query.match(/(\d+)\s*(personen|persoon|gasten|gast)/);
  if (gastenMatch) {
    resultaat.gasten = gastenMatch[1];
  }

  // Slaapkamers: "3 slaapkamers", "2 slaapkamer"
  const slaapkamerMatch = query.match(/(\d+)\s*(slaapkamers|slaapkamer)/);
  if (slaapkamerMatch) {
    resultaat.slaapkamers = slaapkamerMatch[1];
  }

  // Type woning: eerste match wint (een zin noemt normaliter maar één type).
  const gevondenType = Object.entries(TYPE_SYNONIEMEN).find(([, woorden]) =>
    woorden.some((woord) => query.includes(woord))
  );
  if (gevondenType) {
    resultaat.type = gevondenType[0];
  }

  // Locatie: langste naam eerst controleren, zodat een locatie die toevallig
  // een substring van een andere is niet per ongeluk de verkeerde match geeft.
  const gesorteerdeLocaties = [...locaties].sort((a, b) => b.length - a.length);
  const gevondenLocatie = gesorteerdeLocaties.find((loc) => query.includes(loc.toLowerCase()));
  if (gevondenLocatie) {
    resultaat.locatie = gevondenLocatie;
  }

  // Voorzieningen: elk woord uit de synoniemenlijst checken.
  const gevondenVoorzieningen = VOORZIENINGEN.filter((v) => {
    const synoniemen = VOORZIENING_SYNONIEMEN[v.key] || [v.label.toLowerCase()];
    return synoniemen.some((woord) => query.includes(woord));
  }).map((v) => v.key);

  if (gevondenVoorzieningen.length > 0) {
    resultaat.voorzieningen = gevondenVoorzieningen.join(',');
  }

  return resultaat;
}
