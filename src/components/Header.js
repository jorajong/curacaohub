import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logohub.png';
import './Header.css';
import { Heart } from 'lucide-react';


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src={logo} alt="HUB Logo" className="logo-image" />
          </Link>

          <nav className="nav nav-desktop">
            <Link to="/">HOME</Link>
            <Link to="/woningen">WONINGEN</Link>
            <a href="#verhuurdersinfo">VERHUURDERSINFO</a>
            <a href="#over-ons">OVER ONS</a>
            <a href="#contact">CONTACT</a>
            <Link to="/woningen?favorieten=true" className="nav-favorites" aria-label="Favorieten"><Heart size={18} color="var(--primary)" /></Link>
            <Link to="/beheer/nieuwe-woning" className="btn-login">PLAATS JOUW WONING</Link>
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            MENU
          </button>
        </div>

        {isMenuOpen && (
          <nav id="mobile-nav" className="nav-mobile">
            <Link to="/" onClick={closeMenu}>HOME</Link>
            <Link to="/woningen" onClick={closeMenu}>WONINGEN</Link>
            <Link to="/woningen?favorieten=true" onClick={closeMenu} className="nav-favorites-mobile"><Heart size={16} color="var(--primary)" /> FAVORIETEN</Link>
            <a href="#verhuurdersinfo" onClick={closeMenu}>VERHUURDERSINFO</a>
            <a href="#over-ons" onClick={closeMenu}>OVER ONS</a>
            <a href="#contact" onClick={closeMenu}>CONTACT</a>
            <Link to="/beheer/nieuwe-woning" className="btn-login" onClick={closeMenu}>PLAATS JOUW WONING</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
