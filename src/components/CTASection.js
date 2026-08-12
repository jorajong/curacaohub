import React from 'react';
import './CTASection.css';
import { Link } from 'react-router-dom';

function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-background">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=300&fit=crop" alt="Curaçao beach" />
      </div>
      <div className="cta-overlay">
        <h2>WONEN WAAR ANDEREN VAKANTIE VIEREN</h2>
        <p>Jouw huisvesting op Curaçao voor 1 - 6 maanden</p>
        <Link to="/woningen" className="btn-secondary">ONTDEK MOGELIJKHEDEN</Link>
      </div>
    </section>
  );
}

export default CTASection;
