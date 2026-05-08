import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

function PropertyCard({ property }) {
  return (
    <Link to={`/property/${property.id}`} className="property-card">
      <div className="property-image">
        <img src={property.image} alt={property.name} />
        <span className="property-tag">{property.tag}</span>
        <button className="favorite-btn">❤️</button>
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
            <span className="amount">€{property.price}</span>
            <span className="period">/p.m.</span>
          </div>
          <button className="view-btn">Bekijk →</button>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
