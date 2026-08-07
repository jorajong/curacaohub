import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [foutmelding, setFoutmelding] = useState('');
  const [bezigMetInloggen, setBezigMetInloggen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFoutmelding('');
    setBezigMetInloggen(true);

    try {
      await signInWithEmailAndPassword(auth, email, wachtwoord);
      navigate('/beheer/nieuwe-woning');
    } catch (error) {
      setFoutmelding('Inloggen mislukt. Controleer e-mailadres en wachtwoord.');
    } finally {
      setBezigMetInloggen(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>HUB Beheer</h1>
        <p className="login-subtitle">Log in met het gedeelde teamaccount</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label>Wachtwoord</label>
            <input
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {foutmelding && <p className="login-error">{foutmelding}</p>}

          <button type="submit" className="btn-primary btn-full" disabled={bezigMetInloggen}>
            {bezigMetInloggen ? 'BEZIG...' : 'INLOGGEN'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
