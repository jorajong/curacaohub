import React, { useState } from 'react';
import './Hero.css';

function Hero() {
  const [location, setLocation] = useState('Curaçao');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1 persoon');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Zoeken:', { location, checkIn, checkOut, guests });
  };

  return (
    <section className="hero">
      <div className="hero-image">
        <img src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&h=600&fit=crop" alt="Luxury villa in Curaçao" />
      </div>
      <div className="hero-content">
        <h1>Vind jouw plek op Curaçao</h1>
        <p>Huisvesting voor unieke breaks — Rechtstreeks van eigenaar tot gast gereageerd.</p>
        
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <div className="search-group">
              <label>LOCATIE</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option>Curaçao</option>
                <option>Willemstad</option>
                <option>Lagunilla</option>
              </select>
            </div>
            
            <div className="search-group">
              <label>DATUMS</label>
              <div className="date-range">
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} placeholder="Check-in" />
                <span>—</span>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} placeholder="Check-out" />
              </div>
            </div>
            
            <div className="search-group">
              <label>GASTEN</label>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                <option>1 persoon</option>
                <option>2 personen</option>
                <option>3 personen</option>
                <option>4+ personen</option>
              </select>
            </div>
            <button type="submit" className="search-btn">
              <span>🔍</span> ZOEKEN
            </button>
            
          </form>
        </div>

        <div className="hero-ctas">
          <button className="cta-primary">BEKIJK WONINGEN</button>
          <button className="cta-secondary">PLAATS JOUW WONING</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;