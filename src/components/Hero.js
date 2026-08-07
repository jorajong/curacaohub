import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import heroImage from '../images/hero-scharloo.jpg';
import { getDistinctLocaties } from '../utils/locaties';

const SLAAPKAMER_OPTIES = [1, 2, 3, 4, 5, 6];
const GASTEN_OPTIES = [1, 2, 3, 4, 5, 6];

function Hero() {
  const navigate = useNavigate();
  const [locaties, setLocaties] = useState([]);
  const [locatie, setLocatie] = useState('');
  const [slaapkamers, setSlaapkamers] = useState('');
  const [gasten, setGasten] = useState('');

  useEffect(() => {
    getDistinctLocaties()
      .then(setLocaties)
      .catch((error) => console.error('Fout bij ophalen locaties:', error));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locatie) params.set('locatie', locatie);
    if (slaapkamers) params.set('slaapkamers', slaapkamers);
    if (gasten) params.set('gasten', gasten);
    navigate(`/woningen?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="hero-image">
        <img src={heroImage} alt="Historisch pand in Scharloo, Curaçao" />
      </div>
      <div className="hero-content">
        <h1>Jouw huisvesting op Curaçao</h1>
        <p>voor een verblijf van 1 - 6 maanden</p>

        <div className="search-box">
          <form onSubmit={handleSearch}>
            <div className="search-group">
              <label>LOCATIE</label>
              <select value={locatie} onChange={(e) => setLocatie(e.target.value)}>
                <option value="">Alle locaties</option>
                {locaties.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="search-group">
              <label>SLAAPKAMERS</label>
              <select value={slaapkamers} onChange={(e) => setSlaapkamers(e.target.value)}>
                <option value="">Alle</option>
                {SLAAPKAMER_OPTIES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="search-group">
              <label>GASTEN</label>
              <select value={gasten} onChange={(e) => setGasten(e.target.value)}>
                <option value="">Alle</option>
                {GASTEN_OPTIES.map((n) => (
                  <option key={n} value={n}>{n}+ {n === 1 ? 'persoon' : 'personen'}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="search-btn">
              <span>🔍</span> ZOEKEN
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Hero;
