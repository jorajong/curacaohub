// Koppelt een valuta-code (zoals opgeslagen in Firestore) aan het bijbehorende symbool.
// Onbekende codes tonen gewoon de code zelf, zodat er nooit iets crasht.
const VALUTA_SYMBOLEN = {
  EUR: '€',
  USD: '$'
};

export function formatPrijs(prijs, valuta) {
  const symbool = VALUTA_SYMBOLEN[valuta] || valuta;
  const bedrag = Number(prijs).toLocaleString('nl-NL');
  return `${symbool} ${bedrag}`;
}

const PERIODE_LABELS = {
  maand: '/p.m.',
  week: '/p.w.'
};

export function formatPeriode(periode) {
  return PERIODE_LABELS[periode] || `/${periode}`;
}
