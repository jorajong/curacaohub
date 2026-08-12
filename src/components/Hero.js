import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import heroImage from '../images/hero-scharloo.jpg';
import { getDistinctLocaties } from '../utils/locaties';
import { parseZoekopdracht } from '../utils/zoekParser';

const SLAAPKAMER_OPTIES = [1, 2, 3, 4, 5, 6];
const GASTEN_OPTIES = [1, 2, 3, 4, 5, 6];

function Hero() {
  const navigate = useNavigate();
  const [locaties, setLocaties] = useState([]);
  const [locatie, setLocatie] = useState('');
  const [slaapkamers, setSlaapkamers] = useState('');
  const [gasten, setGasten] = useState('');
  const [natuurlijkeZoekopdracht, setNatuurlijkeZoekopdracht] = useState('');

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

  const handleNatuurlijkeZoekopdracht = (e) => {
    e.preventDefault();
    if (!natuurlijkeZoekopdracht.trim()) return;

    const filters = parseZoekopdracht(natuurlijkeZoekopdracht, locaties);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => params.set(key, value));
    navigate(`/woningen?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="hero-image">
        <img src={heroImage} alt="Historisch pand in Scharloo, Curaçao" />
        <div className="hero-text">
          <div className="hero-text-inner">
            <h1>Jouw huisvesting op Curaçao</h1>
            <p>voor een verblijf van 1 - 6 maanden</p>
          </div>
        </div>
      </div>

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
            <label>GASTEN</label>
            <select value={gasten} onChange={(e) => setGasten(e.target.value)}>
              <option value="">Alle</option>
              {GASTEN_OPTIES.map((n) => (
                <option key={n} value={n}>{n}+ {n === 1 ? 'persoon' : 'personen'}</option>
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

          <button type="submit" className="search-btn">
            ZOEKEN
          </button>
        </form>

        <form onSubmit={handleNatuurlijkeZoekopdracht} className="natuurlijke-zoekbalk">
          <input
            type="text"
            value={natuurlijkeZoekopdracht}
            onChange={(e) => setNatuurlijkeZoekopdracht(e.target.value)}
            placeholder="Of typ gewoon wat je zoekt, bijv. 'studio voor 2 personen met airco in Pietermaai'"
          />
          <button type="submit">Zoek</button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
