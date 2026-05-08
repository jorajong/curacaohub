import React from 'react';
import './HowItWorks.css';

function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'ZOEK',
      description: 'Vind jouw perfecte vakantieadres'
    },
    {
      number: 2,
      title: 'SELECTEER',
      description: 'Bereid je break voor'
    },
    {
      number: 3,
      title: 'BOEKING',
      description: 'Direct contact met eigenaar'
    }
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <h2 className="section-title">HOE HET WERKT</h2>
        <div className="steps">
          {steps.map((step, index) => (
            <div key={step.number} className="step">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>

        <div className="benefits">
          <div className="benefit-card">
            <h3>VOOR HUURDERS</h3>
            <p>Unieke woningen op Curaçao — Veel een deel van hotels en airbnb</p>
            <button className="btn-primary">BEKIJK WONINGEN</button>
          </div>
          <div className="benefit-card">
            <h3>VOOR VERHUURDERSINFO</h3>
            <p>Eenvoudige verdiensten — Perfect voor verhuur van eigenaar</p>
            <button className="btn-secondary">MEER INFORMATIE</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
