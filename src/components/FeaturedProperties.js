import React from 'react';
import PropertyCard from './PropertyCard';
import './FeaturedProperties.css';

function FeaturedProperties() {
  const properties = [
    {
      id: 1,
      name: 'Luxe villa zeezicht',
      location: '4 km | Willemstad',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      tag: 'NIEUW',
      guests: 6,
      beds: 3,
      sqm: 250,
      price: '2.450'
    },
    {
      id: 2,
      name: 'Modern appartement centrum',
      location: '0 km | Willemstad',
      image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop',
      tag: 'POPULAIR',
      guests: 4,
      beds: 2,
      sqm: 120,
      price: '1.650'
    },
    {
      id: 3,
      name: 'Nieuw appartement Pietermaai',
      location: '2 km | Pietermaai',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
      tag: 'AANBEVOLEN',
      guests: 3,
      beds: 1,
      sqm: 85,
      price: '1.250'
    },
    {
      id: 4,
      name: 'Ruim appartement met zeezicht',
      location: '1 km | Otrabanda',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      tag: 'EXCLUSIEF',
      guests: 6,
      beds: 3,
      sqm: 200,
      price: '1.950'
    }
  ];

  return (
    <section className="featured-properties">
      <div className="container">
        <h2 className="section-title">UITGELICHTE WONINGEN</h2>
        <div className="properties-grid">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="view-all">
          <button className="btn-primary">BEKIJK ALLE WONINGEN →</button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProperties;
