import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logohub.png';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src={logo} alt="HUB Logo" className="logo-image" />
          </Link>
          <nav className="nav">
            <Link to="/">HOME</Link>
            <Link to="/woningen">WONINGEN</Link>
            <a href="#verhuurdersinfo">VERHUURDERSINFO</a>
            <a href="#over-ons">OVER ONS</a>
            <a href="#contact">CONTACT</a>
            <Link to="/beheer/nieuwe-woning" className="btn-login">PLAATS JOUW WONING</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
