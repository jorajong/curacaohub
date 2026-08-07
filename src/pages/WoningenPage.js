import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import PropertyCard from '../components/PropertyCard';
import { getDistinctLocaties } from '../utils/locaties';
import './WoningenPage.css';

const SLAAPKAMER_OPTIES = [1, 2, 3, 4, 5, 6];
const GASTEN_OPTIES = [1, 2, 3, 4, 5, 6];

function WoningenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locaties, setLocaties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const locatie = searchParams.get('locatie') || '';
  const slaapkamers = searchParams.get('slaapkamers') || '';
  const gasten = searchParams.get('gasten') || '';

  useEffect(() => {
    getDistinctLocaties()
      .then(setLocaties)
      .catch((error) => console.error('Fout bij ophalen locaties:', error));
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const constraints = [where('gepubliceerd', '==', true)];
      if (locatie) constraints.push(where('locatie', '==', locatie));
      if (slaapkamers) constraints.push(where('slaapkamers', '==', Number(slaapkamers)));

      const q = query(collection(db, 'properties'), ...constraints);
      const snapshot = await getDocs(q);

      let data = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          name: d.naam,
          location: d.locatie,
          image: Array.isArray(d.images) && d.images.length > 0 ? d.images[0] : '',
          tag: Array.isArray(d.tag) ? d.tag[0] : d.tag,
          guests: d.gasten,
          beds: d.slaapkamers,
          sqm: d.oppervlakte,
          price: d.prijs,
          valuta: d.valuta || 'EUR',
          periode: d.periode || 'maand'
        };
      });

      // Gasten-filter (minimaal aantal) doen we client-side, zodat we geen
      // Firestore composite index nodig hebben naast de where()-filters hierboven.
      if (gasten) {
        data = data.filter((p) => (p.guests || 0) >= Number(gasten));
      }

      setProperties(data);
    } catch (error) {
      console.error('Fout bij ophalen woningen:', error);
    } finally {
      setLoading(false);
    }
  }, [locatie, slaapkamers, gasten]);

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

  return (
    <main className="woningen-page">
      <div className="container">
        <h1 className="page-title">Alle woningen</h1>

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
            <label>SLAAPKAMERS</label>
            <select value={slaapkamers} onChange={(e) => handleFilterChange('slaapkamers', e.target.value)}>
              <option value="">Alle</option>
              {SLAAPKAMER_OPTIES.map((n) => (
                <option key={n} value={n}>{n}</option>
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
        </div>

        {loading ? (
          <p>Woningen laden...</p>
        ) : properties.length === 0 ? (
          <p>Geen woningen gevonden met deze filters.</p>
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
