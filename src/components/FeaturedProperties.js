import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import PropertyCard from './PropertyCard';
import './FeaturedProperties.css';

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const q = query(
          collection(db, 'properties'),
          where('uitgelicht', '==', true),
          where('gepubliceerd', '==', true)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((docSnap) => {
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
        setProperties(data);
      } catch (error) {
        console.error('Fout bij ophalen woningen:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  return (
    <section className="featured-properties">
      <div className="container">
        <h2 className="section-title">UITGELICHTE WONINGEN</h2>

        {loading ? (
          <p>Woningen laden...</p>
        ) : properties.length === 0 ? (
          <p>Nog geen woningen gevonden.</p>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        <div className="view-all">
          <button className="btn-primary">BEKIJK ALLE WONINGEN →</button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProperties;
