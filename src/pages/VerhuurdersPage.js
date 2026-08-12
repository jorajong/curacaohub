import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import './VerhuurdersPage.css';

function VerhuurdersPage() {
  const [verhuurders, setVerhuurders] = useState([]);
  const [laden, setLaden] = useState(true);

  const [verhuurderNaam, setVerhuurderNaam] = useState('');
  const [verhuurderTelefoon, setVerhuurderTelefoon] = useState('');
  const [verhuurderEmail, setVerhuurderEmail] = useState('');
  const [verhuurderIdFotoBestand, setVerhuurderIdFotoBestand] = useState(null);

  const [beheerderNaam, setBeheerderNaam] = useState('');
  const [beheerderTelefoon, setBeheerderTelefoon] = useState('');
  const [beheerderEmail, setBeheerderEmail] = useState('');
  const [beheerderIdFotoBestand, setBeheerderIdFotoBestand] = useState(null);

  const [bezigMetOpslaan, setBezigMetOpslaan] = useState(false);
  const [foutmelding, setFoutmelding] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'verhuurders'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (a.verhuurderNaam || '').localeCompare(b.verhuurderNaam || ''));
      setVerhuurders(data);
      setLaden(false);
    });
    return unsubscribe;
  }, []);

  const toggleActief = async (id, huidigeWaarde) => {
    setVerhuurders((prev) =>
      prev.map((v) => (v.id === id ? { ...v, actief: !huidigeWaarde } : v))
    );
    try {
      await updateDoc(doc(db, 'verhuurders', id), { actief: !huidigeWaarde });
    } catch (err) {
      console.error('Kon status niet bijwerken:', err);
      setVerhuurders((prev) =>
        prev.map((v) => (v.id === id ? { ...v, actief: huidigeWaarde } : v))
      );
    }
  };

  const resetFormulier = () => {
    setVerhuurderNaam('');
    setVerhuurderTelefoon('');
    setVerhuurderEmail('');
    setVerhuurderIdFotoBestand(null);
    setBeheerderNaam('');
    setBeheerderTelefoon('');
    setBeheerderEmail('');
    setBeheerderIdFotoBestand(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFoutmelding('');

    if (
      !verhuurderNaam.trim() ||
      !verhuurderTelefoon.trim() ||
      !verhuurderEmail.trim() ||
      !beheerderNaam.trim() ||
      !beheerderTelefoon.trim() ||
      !beheerderEmail.trim()
    ) {
      setFoutmelding('Vul minimaal naam, telefoonnummer en e-mail in voor zowel verhuurder als beheerder.');
      return;
    }

    setBezigMetOpslaan(true);
    try {
      // Doc-ID alvast genereren, zodat de ID-foto's in Storage een map
      // krijgen die overeenkomt met het Firestore-document.
      const nieuwDocRef = doc(collection(db, 'verhuurders'));

      let verhuurderIdFotoUrl = '';
      if (verhuurderIdFotoBestand) {
        const fotoRef = ref(storage, `verhuurders/${nieuwDocRef.id}/verhuurder-id`);
        await uploadBytes(fotoRef, verhuurderIdFotoBestand);
        verhuurderIdFotoUrl = await getDownloadURL(fotoRef);
      }

      let beheerderIdFotoUrl = '';
      if (beheerderIdFotoBestand) {
        const fotoRef = ref(storage, `verhuurders/${nieuwDocRef.id}/beheerder-id`);
        await uploadBytes(fotoRef, beheerderIdFotoBestand);
        beheerderIdFotoUrl = await getDownloadURL(fotoRef);
      }

      await setDoc(nieuwDocRef, {
        verhuurderNaam: verhuurderNaam.trim(),
        verhuurderTelefoon: verhuurderTelefoon.trim(),
        verhuurderEmail: verhuurderEmail.trim(),
        verhuurderIdFoto: verhuurderIdFotoUrl,
        beheerderNaam: beheerderNaam.trim(),
        beheerderTelefoon: beheerderTelefoon.trim(),
        beheerderEmail: beheerderEmail.trim(),
        beheerderIdFoto: beheerderIdFotoUrl,
        actief: true,
        aangemaaktOp: serverTimestamp(),
      });
      resetFormulier();
    } catch (err) {
      console.error(err);
      setFoutmelding('Opslaan is niet gelukt. Probeer het opnieuw.');
    } finally {
      setBezigMetOpslaan(false);
    }
  };

  return (
    <main className="verhuurders-page">
      <div className="container">
        <div className="verhuurders-header">
          <h1>Verhuurders</h1>
          <Link to="/beheer/kantoor-overzicht">Naar kantoor-overzicht →</Link>
        </div>
        <p className="verhuurders-intro">
          De verhuurder is de eigenaar van de woning. De beheerder is de contactpersoon
          waarmee gecommuniceerd wordt over aanvragen — dit kan dezelfde persoon zijn of iemand anders.
        </p>

        <form onSubmit={handleSubmit} className="verhuurder-form">
          <h2>Nieuwe verhuurder</h2>

          <div className="verhuurder-form-blok">
            <h3>Verhuurder</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Naam *</label>
                <input type="text" value={verhuurderNaam} onChange={(e) => setVerhuurderNaam(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Telefoonnummer *</label>
                <input type="tel" value={verhuurderTelefoon} onChange={(e) => setVerhuurderTelefoon(e.target.value)} placeholder="+599 9 123 4567" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>E-mailadres *</label>
                <input type="email" value={verhuurderEmail} onChange={(e) => setVerhuurderEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Foto van ID</label>
                <input type="file" accept="image/*" onChange={(e) => setVerhuurderIdFotoBestand(e.target.files[0] || null)} />
              </div>
            </div>
          </div>

          <div className="verhuurder-form-blok">
            <h3>Beheerder</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Naam *</label>
                <input type="text" value={beheerderNaam} onChange={(e) => setBeheerderNaam(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Telefoonnummer *</label>
                <input type="tel" value={beheerderTelefoon} onChange={(e) => setBeheerderTelefoon(e.target.value)} placeholder="+599 9 123 4567" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>E-mailadres *</label>
                <input type="email" value={beheerderEmail} onChange={(e) => setBeheerderEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Foto van ID</label>
                <input type="file" accept="image/*" onChange={(e) => setBeheerderIdFotoBestand(e.target.files[0] || null)} />
              </div>
            </div>
          </div>

          {foutmelding && <p className="form-error">{foutmelding}</p>}

          <button type="submit" className="btn-primary" disabled={bezigMetOpslaan}>
            {bezigMetOpslaan ? 'BEZIG MET OPSLAAN...' : 'VERHUURDER TOEVOEGEN'}
          </button>
        </form>

        <h2 className="verhuurders-lijst-titel">Alle verhuurders</h2>

        {laden && <p>Verhuurders laden...</p>}
        {!laden && verhuurders.length === 0 && <p>Nog geen verhuurders toegevoegd.</p>}

        {!laden && verhuurders.length > 0 && (
          <div className="verhuurders-tabel">
            <div className="verhuurders-rij verhuurders-rij-header">
              <span>Verhuurder</span>
              <span>Beheerder</span>
              <span>Contact beheerder</span>
              <span>ID-foto's</span>
              <span>Actief</span>
            </div>
            {verhuurders.map((v) => (
              <div key={v.id} className="verhuurders-rij">
                <span>{v.verhuurderNaam}</span>
                <span>{v.beheerderNaam}</span>
                <span className="verhuurders-contact">
                  <span>{v.beheerderTelefoon}</span>
                  <span>{v.beheerderEmail}</span>
                </span>
                <span className="verhuurders-id-links">
                  {v.verhuurderIdFoto && (
                    <a href={v.verhuurderIdFoto} target="_blank" rel="noopener noreferrer">ID verhuurder</a>
                  )}
                  {v.beheerderIdFoto && (
                    <a href={v.beheerderIdFoto} target="_blank" rel="noopener noreferrer">ID beheerder</a>
                  )}
                </span>
                <span>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={!!v.actief}
                      onChange={() => toggleActief(v.id, v.actief)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default VerhuurdersPage;
