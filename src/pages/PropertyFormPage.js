import React, { useState } from 'react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { VOORZIENINGEN } from '../utils/voorzieningen';
import './PropertyFormPage.css';

const MAX_FOTOS = 4;

function PropertyFormPage() {
  const [naam, setNaam] = useState('');
  const [locatie, setLocatie] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [oppervlakte, setOppervlakte] = useState('');
  const [slaapkamers, setSlaapkamers] = useState('');
  const [gasten, setGasten] = useState('');
  const [prijs, setPrijs] = useState('');
  const [valuta, setValuta] = useState('EUR');
  const [periode, setPeriode] = useState('maand');
  const [uitgelicht, setUitgelicht] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagInvoer, setTagInvoer] = useState('');

  const [voorzieningen, setVoorzieningen] = useState({});

  const [fotos, setFotos] = useState([]);
  const [fotoPreviews, setFotoPreviews] = useState([]);

  const [bezigMetOpslaan, setBezigMetOpslaan] = useState(false);
  const [foutmelding, setFoutmelding] = useState('');
  const [gelukt, setGelukt] = useState(false);

  const toggleVoorziening = (key) => {
    setVoorzieningen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tagToevoegen = () => {
    if (tagInvoer.trim()) {
      setTags((prev) => [...prev, tagInvoer.trim()]);
      setTagInvoer('');
    }
  };

  const handleTagToevoegen = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      tagToevoegen();
    }
  };

  const verwijderTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFotoSelectie = (e) => {
    const geselecteerd = Array.from(e.target.files);
    const totaal = [...fotos, ...geselecteerd].slice(0, MAX_FOTOS);
    setFotos(totaal);
    setFotoPreviews(totaal.map((bestand) => URL.createObjectURL(bestand)));
    e.target.value = '';
  };

  const verwijderFoto = (index) => {
    const nieuweFotos = fotos.filter((_, i) => i !== index);
    setFotos(nieuweFotos);
    setFotoPreviews(nieuweFotos.map((bestand) => URL.createObjectURL(bestand)));
  };

  const resetFormulier = () => {
    setNaam('');
    setLocatie('');
    setBeschrijving('');
    setOppervlakte('');
    setSlaapkamers('');
    setGasten('');
    setPrijs('');
    setValuta('EUR');
    setPeriode('maand');
    setUitgelicht(false);
    setTags([]);
    setTagInvoer('');
    setVoorzieningen({});
    setFotos([]);
    setFotoPreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFoutmelding('');
    setGelukt(false);

    if (!naam.trim() || !locatie.trim() || !prijs || !beschrijving.trim()) {
      setFoutmelding('Vul minimaal naam, locatie, prijs en beschrijving in.');
      return;
    }

    setBezigMetOpslaan(true);

    // Vangnet: als er nog een tag in het invoerveld staat die niet
    // expliciet is toegevoegd (bijv. geen Enter/knop gebruikt), toch meenemen.
    const alleTags = tagInvoer.trim() ? [...tags, tagInvoer.trim()] : tags;

    try {
      // Doc-ID alvast genereren, zodat foto's in Storage een map krijgen
      // die overeenkomt met het Firestore-document.
      const nieuwDocRef = doc(collection(db, 'properties'));

      const imageUrls = [];
      for (let i = 0; i < fotos.length; i++) {
        const bestand = fotos[i];
        const fotoRef = ref(storage, `properties/${nieuwDocRef.id}/foto-${i + 1}`);
        await uploadBytes(fotoRef, bestand);
        const url = await getDownloadURL(fotoRef);
        imageUrls.push(url);
      }

      await setDoc(nieuwDocRef, {
        naam: naam.trim(),
        locatie: locatie.trim(),
        beschrijving: beschrijving.trim(),
        images: imageUrls,
        oppervlakte: Number(oppervlakte) || 0,
        slaapkamers: Number(slaapkamers) || 0,
        gasten: Number(gasten) || 0,
        prijs: Number(prijs) || 0,
        valuta,
        periode,
        tag: alleTags,
        uitgelicht,
        // Concept bij opslaan vanuit dit formulier — pas op kantoor
        // wordt dit veld op true gezet en verschijnt de woning live.
        gepubliceerd: false,
        ...voorzieningen,
        aangemaaktOp: serverTimestamp(),
      });

      setGelukt(true);
      resetFormulier();
    } catch (error) {
      console.error(error);
      setFoutmelding('Opslaan is niet gelukt. Probeer het opnieuw.');
    } finally {
      setBezigMetOpslaan(false);
    }
  };

  return (
    <main className="property-form-page">
      <div className="container">
        <h1>Nieuwe woning toevoegen</h1>
        <p className="form-intro">
          Dit formulier slaat de woning op als concept. De woning verschijnt pas op de
          site nadat deze op kantoor is gecontroleerd en gepubliceerd.
        </p>

        {gelukt && (
          <div className="form-success">
            Woning opgeslagen als concept. Op kantoor wordt deze binnenkort gecontroleerd en gepubliceerd.
          </div>
        )}

        <form onSubmit={handleSubmit} className="property-form">
          <section className="form-section">
            <h2>Algemene informatie</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Naam woning *</label>
                <input type="text" value={naam} onChange={(e) => setNaam(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Locatie *</label>
                <input
                  type="text"
                  value={locatie}
                  onChange={(e) => setLocatie(e.target.value)}
                  placeholder="bijv. Jan Thiel"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Beschrijving *</label>
              <textarea
                value={beschrijving}
                onChange={(e) => setBeschrijving(e.target.value)}
                rows="4"
                placeholder="Korte omschrijving die op de detailpagina komt te staan..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Oppervlakte (m²)</label>
                <input type="number" min="0" value={oppervlakte} onChange={(e) => setOppervlakte(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Slaapkamers</label>
                <input type="number" min="0" value={slaapkamers} onChange={(e) => setSlaapkamers(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Aantal gasten</label>
                <input type="number" min="0" value={gasten} onChange={(e) => setGasten(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prijs *</label>
                <input type="number" min="0" value={prijs} onChange={(e) => setPrijs(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Valuta</label>
                <select value={valuta} onChange={(e) => setValuta(e.target.value)}>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="XCG">XCG</option>
                </select>
              </div>
              <div className="form-group">
                <label>Periode</label>
                <select value={periode} onChange={(e) => setPeriode(e.target.value)}>
                  <option value="maand">Per maand</option>
                  <option value="week">Per week</option>
                </select>
              </div>
            </div>

            <label className="checkbox-line">
              <input type="checkbox" checked={uitgelicht} onChange={(e) => setUitgelicht(e.target.checked)} />
              Uitgelicht op homepage
            </label>
          </section>

          <section className="form-section">
            <h2>Tags</h2>
            <div className="tag-input-row">
              <input
                type="text"
                value={tagInvoer}
                onChange={(e) => setTagInvoer(e.target.value)}
                onKeyDown={handleTagToevoegen}
                placeholder="Typ een tag (bijv. Nieuw)"
              />
              <button type="button" className="btn-secondary" onClick={tagToevoegen}>
                Toevoegen
              </button>
            </div>
            {tags.length > 0 && (
              <div className="tag-list">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-chip">
                    {tag}
                    <button type="button" onClick={() => verwijderTag(index)} aria-label="Tag verwijderen">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="form-section">
            <h2>Voorzieningen</h2>
            <div className="voorzieningen-grid">
              {VOORZIENINGEN.map((v) => (
                <label key={v.key} className="voorziening-item">
                  <input
                    type="checkbox"
                    checked={!!voorzieningen[v.key]}
                    onChange={() => toggleVoorziening(v.key)}
                  />
                  <v.icon className="voorziening-icon" size={18} strokeWidth={1.75} />
                  <span>{v.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="form-section">
            <h2>Foto's (max {MAX_FOTOS})</h2>
            <p className="form-hint">De eerste foto wordt de hoofdfoto.</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFotoSelectie}
              disabled={fotos.length >= MAX_FOTOS}
            />
            {fotoPreviews.length > 0 && (
              <div className="foto-previews">
                {fotoPreviews.map((url, index) => (
                  <div key={index} className="foto-preview">
                    <img src={url} alt={`Foto ${index + 1}`} />
                    {index === 0 && <span className="hoofdfoto-badge">Hoofdfoto</span>}
                    <button type="button" onClick={() => verwijderFoto(index)} aria-label="Foto verwijderen">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {foutmelding && <p className="form-error">{foutmelding}</p>}

          <button type="submit" className="btn-primary btn-full" disabled={bezigMetOpslaan}>
            {bezigMetOpslaan ? 'BEZIG MET OPSLAAN...' : 'OPSLAAN ALS CONCEPT'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default PropertyFormPage;
