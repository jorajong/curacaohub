import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrijs, formatPeriode } from '../utils/currency';
import './PropertyCard.css';
import { Heart } from 'lucide-react';

function PropertyCard({ property }) {
  const [isFavoriet, setIsFavoriet] = useState(false);

  useEffect(() => {
    const favorieten = JSON.parse(localStorage.getItem('favorieten') || '[]');
    setIsFavoriet(favorieten.includes(property.id));
  }, [property.id]);

  const toggleFavoriet = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const favorieten = JSON.parse(localStorage.getItem('favorieten') || '[]');
    const nieuweFavorieten = favorieten.includes(property.id)
      ? favorieten.filter((id) => id !== property.id)
      : [...favorieten, property.id];
    localStorage.setItem('favorieten', JSON.stringify(nieuweFavorieten));
    setIsFavoriet(!isFavoriet);
  };

  return (
    <Link to={`/property/${property.id}`} className="property-card">
      <div className="property-image">
        <img src={property.image} alt={property.name} />
        <span className="property-tag">{property.tag}</span>
        <button
          className={`favorite-btn${isFavoriet ? ' active' : ''}`}
          onClick={toggleFavoriet}
          aria-label={isFavoriet ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
        >
          <Heart size={16} color="var(--primary)" fill={isFavoriet ? 'var(--primary)' : 'none'} />
        </button>
      </div>
      <div className="property-info">
        <h3>{property.name}</h3>
        <p className="location">{property.location}</p>
        <div className="property-details">
          <span>👥 {property.guests} gasten</span>
          <span>🛏️ {property.beds} kamers</span>
          <span>📏 {property.sqm} m²</span>
        </div>
        <div className="property-footer">
          <div className="price">
            <span className="amount">{formatPrijs(property.price, property.valuta)}</span>
            <span className="period">{formatPeriode(property.periode)}</span>
          </div>
          <button className="view-btn">Bekijk →</button>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
