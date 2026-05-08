import React from 'react';
import './Testimonials.css';

function Testimonials() {
  const reviews = [
    {
      id: 1,
      text: 'Fantastische ervaring! De woning was precies zoals beschreven. Heel erg aanbevolen.',
      author: 'Marc de Bouwmeester',
      rating: 5
    },
    {
      id: 2,
      text: 'Prima communicatie met de eigenaar. Fijne plek voor een ontspannen vakantie!',
      author: 'Anna Jansen',
      rating: 5
    },
    {
      id: 3,
      text: 'Alles was perfect in orde. Zeker een keer terug naar deze prachtige plek.',
      author: 'Peter van Dijk',
      rating: 5
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">WAT ONZE KLANTEN ZEGGEN</h2>
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="stars">
                {'⭐'.repeat(review.rating)}
              </div>
              <p className="review-text">"{review.text}"</p>
              <p className="review-author">- {review.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
