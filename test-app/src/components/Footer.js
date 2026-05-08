import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>OVER HUB</h3>
            <p className="tagline">Huisvesting voor unieke breaks op Curaçao</p>
            <p className="description">
              Wonen in een huisje is veel beter dan in hotels. Rechtstreeks van eigenaar tot gast.
            </p>
          </div>

          <div className="footer-section">
            <h3>INFORMATIE</h3>
            <ul>
              <li><a href="#about">Over ons</a></li>
              <li><a href="#how-it-works">Hoe het werkt</a></li>
              <li><a href="#faq">Veelgestelde vragen</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>CURACAO</h3>
            <ul>
              <li><a href="#willemstad">Willemstad</a></li>
              <li><a href="#otrabanda">Otrabanda</a></li>
              <li><a href="#pietermaai">Pietermaai</a></li>
              <li><a href="#lagunilla">Lagunilla</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>CONTACT</h3>
            <ul>
              <li><a href="tel:+5999-123-4567">+599 9 123-4567</a></li>
              <li><a href="mailto:info@curacaohub.com">info@curacaohub.com</a></li>
              <li>Willemstad, Curaçao</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>VOLG ONS</h3>
            <div className="social-links">
              <a href="#facebook" title="Facebook">f</a>
              <a href="#instagram" title="Instagram">📷</a>
              <a href="#linkedin" title="LinkedIn">in</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Curaçao Hub. Alle rechten voorbehouden.</p>
          <div className="footer-links">
            <a href="#privacy">Privacybeleid</a>
            <a href="#terms">Algemene voorwaarden</a>
            <a href="#cookies">Cookie-instellingen</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
