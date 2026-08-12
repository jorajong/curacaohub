import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { formatPrijs, formatPeriode } from '../utils/currency';
import { VOORZIENINGEN } from '../utils/voorzieningen';
import './PropertyDetailPage.css';

function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInterest, setShowInterest] = useState(false);
  const [geselecteerdeFoto, setGeselecteerdeFoto] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
          setGeselecteerdeFoto(0);
        } else {
          setProperty(null);
        }
      } catch (error) {
        console.error('Fout bij ophalen woning:', error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Bedankt voor je interesse! De eigenaar zal binnenkort contact opnemen.');
    setFormData({ name: '', email: '', message: '' });
  };

  if (loading) {
    return (
      <main className="property-detail">
        <div className="container">
          <p>Woning laden...</p>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="property-detail">
        <div className="container">
          <p>Deze woning kon niet gevonden worden.</p>
        </div>
      </main>
    );
  }

  const images = Array.isArray(property.images) ? property.images : [];
  const actieveVoorzieningen = VOORZIENINGEN.filter((v) => property[v.key] === true);

  return (
    <main className="property-detail">
      <div className="container">
        <div className="breadcrumb">
          <a href="/">Home</a> / <a href="/">Woningen</a> / {property.naam}
        </div>

        <div className="property-header">
          <h1>{property.naam}</h1>
          <div className="property-meta">
            <span className="location">📍 {property.locatie}</span>
          </div>
        </div>

        <div className="property-images">
          <div className="main-image">
            {images[geselecteerdeFoto] && (
              <img src={images[geselecteerdeFoto]} alt={property.naam} />
            )}
          </div>
          {images.length > 1 && (
            <div className="thumbnail-images">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${property.naam} - ${idx + 1}`}
                  onClick={() => setGeselecteerdeFoto(idx)}
                  className={idx === geselecteerdeFoto ? 'active' : ''}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="property-body">
          <div className="property-left">
            {property.beschrijving && (
              <section className="property-section">
                <h2>Over deze woning</h2>
                <p>{property.beschrijving}</p>
              </section>
            )}

            {actieveVoorzieningen.length > 0 && (
              <section className="property-section">
                <h2>Voorzieningen</h2>
                <div className="amenities-grid">
                  {actieveVoorzieningen.map((v) => (
                    <div key={v.key} className="amenity-item">
                      <v.icon className="amenity-icon" size={22} strokeWidth={1.75} />
                      <span className="amenity-label">{v.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="property-section">
              <h2>Beschrijving</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Aantal gasten</label>
                  <span>{property.gasten} gasten</span>
                </div>
                <div className="detail-item">
                  <label>Slaapkamers</label>
                  <span>{property.slaapkamers}</span>
                </div>
                <div className="detail-item">
                  <label>Oppervlakte</label>
                  <span>{property.oppervlakte} m²</span>
                </div>
              </div>
            </section>
          </div>

          <div className="property-right">
            <div className="booking-card">
              <div className="price-section">
                <div className="price">
                  <span className="amount">{formatPrijs(property.prijs, property.valuta || 'EUR')}</span>
                  <span className="period">{formatPeriode(property.periode || 'maand')}</span>
                </div>
              </div>

              <button
                className="btn-primary btn-full"
                onClick={() => setShowInterest(true)}
              >
                INTERESSE TONEN
              </button>
              <button className="btn-secondary btn-full">STUUR WHATSAPP</button>
            </div>

            {showInterest && (
              <div className="interest-form">
                <h3>Interesse in deze woning?</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Naam</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>E-mailadres</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Bericht</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows="4"
                      placeholder="Vertel ons meer over jezelf..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary btn-full">
                    VERSTUUR BERICHT
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default PropertyDetailPage;