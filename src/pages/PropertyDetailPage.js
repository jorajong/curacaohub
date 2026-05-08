import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './PropertyDetailPage.css';

function PropertyDetailPage() {
  const { id } = useParams();
  const [showInterest, setShowInterest] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Mock property data
  const property = {
    id: id,
    name: 'Modern appartement in Pietermaai',
    price: '1.650',
    location: 'Pietermaai, Willemstad',
    guests: 4,
    beds: 2,
    baths: 2,
    sqm: 120,
    rating: 4.8,
    reviews: 24,
    tags: ['Airco', 'WiFi', 'Keuken', 'Wasserij'],
    images: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
    ],
    description: `Dit moderne appartement bevindt zich in het hartje van Pietermaai, 
      één van de charmantste wijken van Willemstad. Het appartement is recent gerenoveerd 
      en voorzien van alle moderne faciliteiten.`,
    amenities: [
      { icon: '🏊', label: 'Zwembad' },
      { icon: '🔑', label: 'Sleutelservice 24/7' },
      { icon: '🧹', label: 'Schoonmaak inbegrepen' },
      { icon: '🛎️', label: 'Conciërge service' },
      { icon: '🚗', label: 'Parkeergelegenheid' },
      { icon: '🌡️', label: 'Airconditioning' }
    ],
    cancellation: 'Gratis annulering tot 7 dagen voor aankomst',
    checkInTime: '15:00',
    checkOutTime: '11:00'
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  return (
    <main className="property-detail">
      <div className="container">
        <div className="breadcrumb">
          <a href="/">Home</a> / <a href="/">Woningen</a> / {property.name}
        </div>

        <div className="property-header">
          <h1>{property.name}</h1>
          <div className="property-meta">
            <span className="location">📍 {property.location}</span>
            <span className="rating">⭐ {property.rating} ({property.reviews} reviews)</span>
          </div>
        </div>

        <div className="property-images">
          <div className="main-image">
            <img src={property.images[0]} alt={property.name} />
          </div>
          <div className="thumbnail-images">
            {property.images.map((img, idx) => (
              <img key={idx} src={img} alt={`${property.name} - ${idx + 1}`} />
            ))}
          </div>
        </div>

        <div className="property-body">
          <div className="property-left">
            <section className="property-section">
              <h2>Over deze woning</h2>
              <p>{property.description}</p>
            </section>

            <section className="property-section">
              <h2>Wat is inbegrepen</h2>
              <div className="amenities-grid">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="amenity-item">
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-label">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="property-section">
              <h2>Beschrijving</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Aantal gasten</label>
                  <span>{property.guests} gasten</span>
                </div>
                <div className="detail-item">
                  <label>Slaapkamers</label>
                  <span>{property.beds}</span>
                </div>
                <div className="detail-item">
                  <label>Badkamers</label>
                  <span>{property.baths}</span>
                </div>
                <div className="detail-item">
                  <label>Oppervlakte</label>
                  <span>{property.sqm} m²</span>
                </div>
                <div className="detail-item">
                  <label>Check-in</label>
                  <span>{property.checkInTime}</span>
                </div>
                <div className="detail-item">
                  <label>Check-out</label>
                  <span>{property.checkOutTime}</span>
                </div>
              </div>
            </section>

            <section className="property-section">
              <h2>Annuleringsbeleid</h2>
              <p className="cancellation">{property.cancellation}</p>
            </section>
          </div>

          <div className="property-right">
            <div className="booking-card">
              <div className="price-section">
                <div className="price">
                  <span className="amount">€{property.price}</span>
                  <span className="period">/maand</span>
                </div>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label>Check-in</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Check-out</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Aantal gasten</label>
                  <select>
                    <option>1 gast</option>
                    <option>2 gasten</option>
                    <option>3 gasten</option>
                    <option>4 gasten</option>
                  </select>
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
