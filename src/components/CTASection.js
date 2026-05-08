import React from 'react';
import './CTASection.css';

function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-background">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=300&fit=crop" alt="Curaçao beach" />
      </div>
      <div className="cta-overlay">
        <h2>WONEN WAAR ANDEREN VAKANTIES VIEREN</h2>
        <p>Unieke breeks, gewaarborgd comfort op Curaçao</p>
        <button className="btn-secondary">ONTDEK MOGELIJKHEDEN</button>
      </div>
    </section>
  );
}

export default CTASection;
