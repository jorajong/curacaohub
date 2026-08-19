import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import PropertyCard from '../components/PropertyCard';
import { getDistinctLocaties } from '../utils/locaties';
import { VOORZIENINGEN } from '../utils/voorzieningen';
import './WoningenPage.css';

const SLAAPKAMER_OPTIES = [1, 2, 3, 4, 5, 6];
const GASTEN_OPTIES = [1, 2, 3, 4, 5, 6];

const TYPE_LABELS = {
  kamer: 'Kamer',
  studio: 'Studio',
  appartement: 'Appartement',
  woning: 'Woning',
};

const VOORZIENINGEN_LABELS = Object.fromEntries(VOORZIENINGEN.map((v) => [v.key, v.label]));

function mapDocToProperty(docSnap) {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    name: d.naam,
    type: d.type,
    location: d.locatie,
    image: Array.isArray(d.images) && d.images.length > 0 ? d.images[0] : '',
    tag: Array.isArray(d.tag) ? d.tag[0] : d.tag,
    tags: Array.isArray(d.tag) ? d.tag : [],
    guests: d.gasten,
    beds: d.slaapkamers,
    sqm: d.oppervlakte,
    price: d.prijs,
    valuta: d.valuta || 'EUR',
    periode: d.periode || 'maand',
    // Losse voorziening-velden meenemen zodat client-side gefilterd kan
    // worden (Firestore zou voor elke combinatie een eigen index nodig hebben).
    voorzieningen: d,
  };
}

function WoningenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locaties, setLocaties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const locatie = searchParams.get('locatie') || '';
  const slaapkamers = searchParams.get('slaapkamers') || '';
  const gasten = searchParams.get('gasten') || '';
  const type = searchParams.get('type') || '';
  const voorzieningenFilter = (searchParams.get('voorzieningen') || '').split(',').filter(Boolean);
  const voorzieningenParam = searchParams.get('voorzieningen') || '';
  const tekst = searchParams.get('tekst') || '';
  const alleenFavorieten = searchParams.get('favorieten') === 'true';

  useEffect(() => {
    getDistinctLocaties()
      .then(setLocaties)
      .catch((error) => console.error('Fout bij ophalen locaties:', error));
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const voorzieningenKeys = voorzieningenParam.split(',').filter(Boolean);
      let data;

      if (alleenFavorieten) {
        // Favorieten-modus: ID's komen uit localStorage, niet uit een Firestore-query
        const ids = JSON.parse(localStorage.getItem('favorieten') || '[]');
        if (ids.length === 0) {
          setProperties([]);
          return;
        }
        const docs = await Promise.all(ids.map((id) => getDoc(doc(db, 'properties', id))));
        data = docs
          .filter((docSnap) => docSnap.exists() && docSnap.data().gepubliceerd)
          .map(mapDocToProperty);
      } else {
        const constraints = [where('gepubliceerd', '==', true)];
        if (locatie) constraints.push(where('locatie', '==', locatie));
        if (slaapkamers) constraints.push(where('slaapkamers', '==', Number(slaapkamers)));

        const q = query(collection(db, 'properties'), ...constraints);
        const snapshot = await getDocs(q);
        data = snapshot.docs.map(mapDocToProperty);
      }

      // Locatie/slaapkamers-filters ook toepassen binnen favorieten, en de
      // gasten-filter (minimaal aantal) altijd client-side, zoals eerder.
      if (alleenFavorieten) {
        if (locatie) data = data.filter((p) => p.location === locatie);
        if (slaapkamers) data = data.filter((p) => Number(p.beds) === Number(slaapkamers));
      }
      if (gasten) {
        data = data.filter((p) => (p.guests || 0) >= Number(gasten));
      }
      if (type) {
        data = data.filter((p) => p.type === type);
      }
      if (voorzieningenKeys.length > 0) {
        data = data.filter((p) => voorzieningenKeys.every((key) => p.voorzieningen?.[key] === true));
      }
      if (tekst) {
        const zoekwoorden = tekst.toLowerCase().split(/\s+/).filter(Boolean);
        data = data.filter((p) => {
          const doorzoekbareTekst = `${p.name || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
          return zoekwoorden.every((woord) => doorzoekbareTekst.includes(woord));
        });
      }

      setProperties(data);
    } catch (error) {
      console.error('Fout bij ophalen woningen:', error);
    } finally {
      setLoading(false);
    }
  }, [locatie, slaapkamers, gasten, type, voorzieningenParam, tekst, alleenFavorieten]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const verwijderFilter = (key) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    setSearchParams(params);
  };

  return (
    <main className="woningen-page">
      <div className="container">
        <h1 className="page-title">{alleenFavorieten ? 'Mijn favorieten' : 'Alle woningen'}</h1>

        {(type || voorzieningenFilter.length > 0 || tekst) && (
          <div className="actieve-filters">
            {tekst && (
              <span className="filter-chip">
                "{tekst}"
                <button type="button" onClick={() => verwijderFilter('tekst')} aria-label="Filter verwijderen">×</button>
              </span>
            )}
            {type && (
              <span className="filter-chip">
                {TYPE_LABELS[type] || type}
                <button type="button" onClick={() => verwijderFilter('type')} aria-label="Filter verwijderen">×</button>
              </span>
            )}
            {voorzieningenFilter.map((key) => (
              <span key={key} className="filter-chip">
                {VOORZIENINGEN_LABELS[key] || key}
                <button
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    const overgebleven = voorzieningenFilter.filter((k) => k !== key);
                    if (overgebleven.length > 0) {
                      params.set('voorzieningen', overgebleven.join(','));
                    } else {
                      params.delete('voorzieningen');
                    }
                    setSearchParams(params);
                  }}
                  aria-label="Filter verwijderen"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="filter-bar">
          <div className="search-group">
            <label>LOCATIE</label>
            <select value={locatie} onChange={(e) => handleFilterChange('locatie', e.target.value)}>
              <option value="">Alle locaties</option>
              {locaties.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="search-group">
            <label>GASTEN</label>
            <select value={gasten} onChange={(e) => handleFilterChange('gasten', e.target.value)}>
              <option value="">Alle</option>
              {GASTEN_OPTIES.map((n) => (
                <option key={n} value={n}>{n}+ {n === 1 ? 'persoon' : 'personen'}</option>
              ))}
            </select>
          </div>

          <div className="search-group">
            <label>SLAAPKAMERS</label>
            <select value={slaapkamers} onChange={(e) => handleFilterChange('slaapkamers', e.target.value)}>
              <option value="">Alle</option>
              {SLAAPKAMER_OPTIES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p>Woningen laden...</p>
        ) : properties.length === 0 ? (
          <p className="empty-message">
            {alleenFavorieten
              ? "Je hebt nog geen woningen als favoriet gemarkeerd. Klik op het hartje bij een woning om 'm hier te bewaren."
              : 'Geen woningen gevonden met deze filters.'}
          </p>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default WoningenPage;
